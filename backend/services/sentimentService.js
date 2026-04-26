const { queryModel } = require("./hfClient");
const { clamp, normalizeLabel, scoreToLabel, titleCase, tokenize, detectIntensity, detectNegationContext, normalizeText } = require("./textUtils");

const ENGLISH_SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment";
const MULTILINGUAL_SENTIMENT_MODEL = "cardiffnlp/twitter-xlm-roberta-base-sentiment";

const FALLBACK_NEGATIVE = new Set([
  "slow", "slower", "bad", "worse", "worst", "broken", "terrible", "awful", "delay", "lag", "laggy", "frustrating",
  "annoying", "useless", "hate", "buggy", "crash", "crashed", "freezing", "poor", "bekar", "bura", "kharab", "bakwas",
  "sad", "angry", "mad", "upset", "depressed", "trash", "faltu", "bakwaas", "bekaar",
]);

const FALLBACK_POSITIVE = new Set([
  "good", "great", "excellent", "love", "smooth", "fast", "helpful", "reliable", "awesome", "amazing", "perfect",
  "acha", "accha", "badhiya", "mast", "happy", "joy", "glad", "yay", "badiya", "lit",
]);

function mapSentimentPayload(payload, model) {
  const predictions = Array.isArray(payload?.[0]) ? payload[0] : Array.isArray(payload) ? payload : [];

  if (!predictions.length) {
    return null;
  }

  const positive = predictions.find((item) => /label_2|positive/i.test(item.label))?.score || 0;
  const neutral = predictions.find((item) => /label_1|neutral/i.test(item.label))?.score || 0;
  const negative = predictions.find((item) => /label_0|negative/i.test(item.label))?.score || 0;
  const score = clamp(positive - negative, -1, 1);
  const label = scoreToLabel(score, 0.1);

  return {
    sentiment: titleCase(label),
    sentimentLabel: label,
    score: Number(score.toFixed(2)),
    confidence: Number(Math.max(positive, neutral, negative).toFixed(4)),
    probabilities: {
      positive: Number(positive.toFixed(4)),
      neutral: Number(neutral.toFixed(4)),
      negative: Number(negative.toFixed(4)),
    },
    provider: `huggingface-${model}`,
  };
}

/**
 * Apply context-aware adjustments based on negation and intensity
 */
function applyContextAdjustments(text, score) {
  const intensityBoost = detectIntensity(text);
  let adjustedScore = score * intensityBoost;
  
  const negationMap = detectNegationContext(text);
  
  // If positive/negative words follow negation, flip the sentiment
  for (const [word, isNegated] of negationMap) {
    if (isNegated) {
      // For negated words, invert their sentiment
      if (word === "good" || word === "great" || word === "bad" || word === "terrible") {
        adjustedScore = -adjustedScore;
      }
    }
  }
  
  return clamp(adjustedScore, -1, 1);
}

function fallbackSentiment(text) {
  const tokens = tokenize(text);
  const raw = tokens.reduce((sum, token) => {
    if (FALLBACK_POSITIVE.has(token)) {
      return sum + 1;
    }
    if (FALLBACK_NEGATIVE.has(token)) {
      return sum - 1;
    }
    return sum;
  }, 0);

  const normalized = clamp(raw / Math.max(tokens.length / 3, 2), -1, 1);
  const label = scoreToLabel(normalized, 0.12);
  const positive = normalized > 0 ? Math.min(0.9, 0.5 + normalized / 2) : Math.max(0.05, 0.25 + normalized / 3);
  const negative = normalized < 0 ? Math.min(0.9, 0.5 + Math.abs(normalized) / 2) : Math.max(0.05, 0.25 - normalized / 3);
  const neutral = clamp(1 - positive - negative, 0.05, 0.9);

  return {
    sentiment: titleCase(label),
    sentimentLabel: label,
    score: Number(normalized.toFixed(2)),
    confidence: Number(Math.max(positive, negative, neutral).toFixed(4)),
    probabilities: {
      positive: Number(positive.toFixed(4)),
      neutral: Number(neutral.toFixed(4)),
      negative: Number(negative.toFixed(4)),
    },
    provider: "fallback-lexical-sentiment",
  };
}

async function analyzeSentiment(text, language = "english") {
  const normalized = normalizeText(text);
  const model = language === "hindi" ? MULTILINGUAL_SENTIMENT_MODEL : ENGLISH_SENTIMENT_MODEL;
  const payload = await queryModel(model, normalized);
  let result = mapSentimentPayload(payload, model) || fallbackSentiment(normalized);
  
  // Apply context-aware adjustments (negation, intensity)
  result.score = Number(applyContextAdjustments(text, result.score).toFixed(2));
  result.sentimentLabel = scoreToLabel(result.score, 0.1);
  result.sentiment = titleCase(result.sentimentLabel);
  
  return result;
}

function toLegacyComparison(sentimentResult) {
  const current = {
    label: normalizeLabel(sentimentResult.sentimentLabel),
    score: sentimentResult.score,
    confidence: sentimentResult.confidence,
    provider: sentimentResult.provider,
  };

  return {
    ruleBased: current,
    mlModel: current,
    transformerModel: current,
  };
}

module.exports = {
  analyzeSentiment,
  toLegacyComparison,
};
