const { analyzeEmotions } = require("./emotionService");
const { explainKeywords } = require("./explainService");
const { analyzeSentiment, toLegacyComparison } = require("./sentimentService");
const { detectSarcasm } = require("./sarcasmService");
const { formatStrictResponse } = require("./responseFormatterService");
const {
  buildWordCloud,
  detectLanguage,
  extractCandidateAspects,
  getAspectContext,
  normalizeLabel,
  normalizeText,
  titleCase,
} = require("./textUtils");

function detectSpam(text) {
  const lower = String(text || "").toLowerCase();
  const hasLink = /https?:\/\//.test(lower) || /\bwww\./.test(lower);
  const hasPromo =
    /\b(buy now|click here|subscribe|guaranteed|free money)\b/.test(lower);
  const repeatedExclamations = (lower.match(/!/g) || []).length >= 4;
  const uppercaseRatio =
    text.replace(/[^A-Z]/g, "").length /
    Math.max(text.replace(/[^A-Za-z]/g, "").length, 1);

  let score = 0;
  score += hasLink ? 0.4 : 0;
  score += hasPromo ? 0.35 : 0;
  score += repeatedExclamations ? 0.15 : 0;
  score += uppercaseRatio > 0.55 ? 0.2 : 0;

  const level = score >= 0.45 ? "High" : score >= 0.2 ? "Medium" : "Low";
  return {
    level,
    isSpam: level === "High",
    confidence: Number(Math.min(score, 1).toFixed(4)),
    reasons: [
      ...(hasLink ? ["contains-link"] : []),
      ...(hasPromo ? ["promotional-language"] : []),
      ...(repeatedExclamations ? ["repeated-exclamation"] : []),
      ...(uppercaseRatio > 0.55 ? ["uppercase-heavy"] : []),
    ],
  };
}

async function analyzeAspects(text, language) {
  const aspects = extractCandidateAspects(text);

  if (!aspects.length) {
    return [];
  }

  const results = [];

  for (const aspect of aspects.slice(0, 6)) {
    const context = getAspectContext(text, aspect);
    const sentiment = await analyzeSentiment(context, language);

    if (
      normalizeLabel(sentiment.sentimentLabel) === "neutral" &&
      context === text
    ) {
      continue;
    }

    results.push({
      aspect,
      sentiment: sentiment.sentimentLabel,
      sentimentDisplay: titleCase(sentiment.sentimentLabel),
      score: sentiment.score,
      confidence: sentiment.confidence,
    });
  }

  const deduped = [];
  const seen = new Set();

  for (const item of results) {
    const key = item.aspect.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

// Function removed since it was redundant with emotionResult.distribution

function moodFromEmotion(primary) {
  if (primary === "happy") {
    return "Happy 😊";
  }
  if (primary === "sad") {
    return "Sad 😢";
  }
  if (primary === "angry") {
    return "Angry 😡";
  }
  if (primary === "fear") {
    return "Concerned 😟";
  }
  if (primary === "surprise") {
    return "Surprised 😲";
  }
  return "Neutral 😐";
}

async function runAdvancedAnalysis(text) {
  const normalizedText = String(text || "").trim();
  const language = detectLanguage(normalizedText);
  const sentimentResult = await analyzeSentiment(normalizedText, language);
  const emotionResult = await analyzeEmotions(
    normalizedText,
    sentimentResult,
    language,
  );
  const sarcasmResult = detectSarcasm(normalizedText, sentimentResult);
  const spamResult = detectSpam(normalizedText);
  const keywords = explainKeywords(
    normalizedText,
    sentimentResult,
    sarcasmResult,
  );
  const aspects = await analyzeAspects(normalizedText, language);

  return {
    text: normalizedText,
    sentiment: sentimentResult.sentimentLabel,
    sentimentDisplay: sentimentResult.sentiment,
    score: sentimentResult.score,
    sentimentScore: sentimentResult.score,
    confidence: sentimentResult.confidence,
    probabilities: sentimentResult.probabilities,
    language,
    mood: moodFromEmotion(emotionResult.primary),
    emotions: {
      primary: emotionResult.primary,
      distribution: emotionResult.distribution,
    },
    sarcasm: {
      level: sarcasmResult.sarcasm || sarcasmResult.level,
      isSarcastic: sarcasmResult.isSarcastic,
      confidence: sarcasmResult.confidence,
      reasons: sarcasmResult.reasons,
    },
    spam: spamResult,
    aspects,
    keywords,
    explainability: {
      influentialWords: keywords.map((item) => ({
        word: item.word,
        label: item.impact === "sarcastic" ? "negative" : item.impact,
        weight: item.importance,
      })),
    },
    wordCloud: buildWordCloud(normalizedText),
    models: toLegacyComparison(sentimentResult),
    timestamp: new Date().toISOString(),
  };
}

function createLegacyAnalysis(advanced) {
  return {
    sentiment: advanced.sentiment,
    mood: advanced.mood,
    sentimentScore: advanced.sentimentScore,
    emotions: advanced.emotions,
  };
}

function createConfusionMatrix(records, modelKey) {
  const labels = ["positive", "neutral", "negative"];
  const matrix = Object.fromEntries(
    labels.map((actual) => [
      actual,
      Object.fromEntries(labels.map((predicted) => [predicted, 0])),
    ]),
  );

  for (const record of records) {
    const actual = normalizeLabel(record.sentiment);
    const predicted = normalizeLabel(record.models?.[modelKey]?.label);

    if (labels.includes(actual) && labels.includes(predicted)) {
      matrix[actual][predicted] += 1;
    }
  }

  return matrix;
}

function computeModelMetrics(records, modelKey) {
  if (!records.length) {
    return {
      accuracy: 0,
      precision: 0,
      recall: 0,
      confusionMatrix: createConfusionMatrix(records, modelKey),
      sampleSize: 0,
    };
  }

  let correct = 0;
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  for (const record of records) {
    const actual = normalizeLabel(record.sentiment);
    const predicted = normalizeLabel(record.models?.[modelKey]?.label);

    if (actual === predicted) {
      correct += 1;
    }

    if (predicted === "positive") {
      if (actual === "positive") {
        truePositive += 1;
      } else {
        falsePositive += 1;
      }
    }

    if (actual === "positive" && predicted !== "positive") {
      falseNegative += 1;
    }
  }

  const accuracy = correct / records.length;
  const precision = truePositive / Math.max(truePositive + falsePositive, 1);
  const recall = truePositive / Math.max(truePositive + falseNegative, 1);

  return {
    accuracy: Number(accuracy.toFixed(2)),
    precision: Number(precision.toFixed(2)),
    recall: Number(recall.toFixed(2)),
    confusionMatrix: createConfusionMatrix(records, modelKey),
    sampleSize: records.length,
  };
}

/**
 * Run strict format analysis - returns standardized JSON output
 */
async function runStrictFormatAnalysis(text) {
  const normalizedText = String(text || "").trim();
  const language = detectLanguage(normalizedText);
  const sentimentResult = await analyzeSentiment(normalizedText, language);
  const emotionResult = await analyzeEmotions(
    normalizedText,
    sentimentResult,
    language,
  );
  const sarcasmResult = detectSarcasm(normalizedText, sentimentResult);
  return formatStrictResponse(
    normalizedText,
    null,
    sentimentResult,
    emotionResult,
    sarcasmResult,
    language,
  );
}

module.exports = {
  computeModelMetrics,
  createLegacyAnalysis,
  runAdvancedAnalysis,
  runStrictFormatAnalysis,
};
