const Sentiment = require("sentiment");

const sentiment = new Sentiment();

const LANGUAGE_HINTS = {
  hindi: ["bahut", "acha", "accha", "bura", "bekar", "dhokha", "pyaar", "gussa", "kharab", "sasta"],
};

const POSITIVE_WORDS = {
  english: ["good", "great", "excellent", "love", "happy", "smooth", "amazing", "helpful", "fast", "clean", "best", "satisfied", "delight", "reliable"],
  hindi: ["अच्छा", "बेहतरीन", "शानदार", "पसंद", "खुश", "तेज़", "मददगार", "साफ", "उत्तम"],
  hinglish: ["acha", "accha", "mast", "badhiya", "pyaar", "khush", "sahi", "fast", "helpful"],
};

const NEGATIVE_WORDS = {
  english: ["bad", "worst", "hate", "slow", "broken", "angry", "delay", "buggy", "poor", "rude", "spam", "fake", "terrible", "awful", "disappointed"],
  hindi: ["बुरा", "खराब", "बेकार", "नफ़रत", "गुस्सा", "देरी", "टूटा", "नकली", "घटिया"],
  hinglish: ["bura", "bekar", "ghatiya", "gussa", "late", "slow", "fake", "dhokha", "bakwas"],
};

const EMOTION_KEYWORDS = {
  happy: ["happy", "joy", "excited", "love", "amazing", "awesome", "खुश", "acha", "badhiya", "delighted"],
  sad: ["sad", "upset", "hurt", "cry", "depressed", "unhappy", "दुखी", "dukhi", "disappointed"],
  angry: ["angry", "mad", "furious", "hate", "rage", "annoyed", "गुस्सा", "gussa", "frustrated"],
  neutral: ["okay", "fine", "average", "normal", "ठीक", "theek"],
  fear: ["fear", "worried", "scared", "unsafe", "risk", "afraid", "dar", "डर"],
  surprise: ["surprised", "unexpected", "wow", "shocked", "astonishing", "चकित"],
};

const ASPECT_KEYWORDS = {
  product: ["product", "design", "build", "quality", "feature", "battery", "camera", "item"],
  service: ["service", "staff", "agent", "support", "team", "behavior", "response"],
  delivery: ["delivery", "shipping", "courier", "late", "packaging", "arrival"],
  pricing: ["price", "pricing", "cost", "value", "expensive", "cheap", "discount"],
  experience: ["app", "website", "ui", "ux", "checkout", "login", "experience", "flow"],
};

const STOPWORDS = new Set([
  "the", "and", "for", "that", "this", "with", "have", "was", "were", "are", "is", "you", "your", "but", "not",
  "very", "just", "from", "they", "them", "into", "about", "than", "then", "there", "here", "when", "what",
  "acha", "accha", "hai", "tha", "thi", "bahut", "ke", "ki", "ka", "mein", "main", "aur", "par", "but", "too",
]);

function tokenize(text) {
  return text.toLowerCase().match(/[\p{L}\p{N}']+/gu) || [];
}

function unique(array) {
  return [...new Set(array)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function detectLanguage(text, tokens) {
  if (/[\u0900-\u097F]/.test(text)) {
    return "hindi";
  }

  const hasHindiHints = tokens.some((token) => LANGUAGE_HINTS.hindi.includes(token));
  return hasHindiHints ? "hinglish" : "english";
}

function getLexicon(language) {
  return {
    positive: unique([
      ...POSITIVE_WORDS.english,
      ...(POSITIVE_WORDS[language] || []),
    ]),
    negative: unique([
      ...NEGATIVE_WORDS.english,
      ...(NEGATIVE_WORDS[language] || []),
    ]),
  };
}

function detectEmotion(tokens) {
  const scores = Object.fromEntries(Object.keys(EMOTION_KEYWORDS).map((emotion) => [emotion, 0]));

  for (const token of tokens) {
    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
      if (keywords.includes(token)) {
        scores[emotion] += 1;
      }
    }
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [emotion, value] = ranked[0] || ["neutral", 0];

  return {
    primary: value > 0 ? emotion : "neutral",
    distribution: scores,
  };
}

function buildInfluenceMap(tokens, lexicon) {
  const influences = [];

  for (const token of tokens) {
    let weight = 0;
    let label = "neutral";

    if (lexicon.positive.includes(token)) {
      weight = 0.6;
      label = "positive";
    } else if (lexicon.negative.includes(token)) {
      weight = -0.6;
      label = "negative";
    }

    if (weight !== 0) {
      influences.push({ word: token, weight, label });
    }
  }

  return influences;
}

function aspectSentiment(tokens, baseScore, lexicon) {
  return Object.entries(ASPECT_KEYWORDS)
    .map(([aspect, keywords]) => {
      const hits = [];

      tokens.forEach((token, index) => {
        if (keywords.includes(token)) {
          const context = tokens.slice(Math.max(0, index - 3), index + 4);
          const score = context.reduce((sum, word) => {
            if (lexicon.positive.includes(word)) {
              return sum + 1;
            }
            if (lexicon.negative.includes(word)) {
              return sum - 1;
            }
            return sum;
          }, 0);

          hits.push({ keyword: token, score });
        }
      });

      if (!hits.length) {
        return null;
      }

      const total = hits.reduce((sum, item) => sum + item.score, 0) || Math.sign(baseScore);
      return {
        aspect,
        sentiment: total > 0 ? "positive" : total < 0 ? "negative" : "neutral",
        score: clamp(total / Math.max(hits.length * 2, 1), -1, 1),
        evidence: hits.map((item) => item.keyword),
      };
    })
    .filter(Boolean);
}

function detectSarcasm(text, tokens, sentimentScore) {
  const lower = text.toLowerCase();
  const markers = ["yeah right", "as if", "wow great", "sure", "totally", "amazing... not"];
  const contrast = /\b(great|amazing|love|perfect)\b.*\b(not|never|delay|broken|worst)\b/.test(lower);
  const excessivePunctuation = /(!|\?){2,}/.test(lower);
  const quotedPraise = /"(great|perfect|amazing)"/.test(lower);
  const positiveTokenCount = tokens.filter((token) => POSITIVE_WORDS.english.includes(token) || POSITIVE_WORDS.hinglish.includes(token)).length;
  const negativeTokenCount = tokens.filter((token) => NEGATIVE_WORDS.english.includes(token) || NEGATIVE_WORDS.hinglish.includes(token)).length;
  const matchedMarkers = markers.filter((marker) => lower.includes(marker));
  const isSarcastic = matchedMarkers.length > 0 || contrast || quotedPraise || (positiveTokenCount > 0 && negativeTokenCount > 0 && excessivePunctuation && sentimentScore <= 0);

  return {
    isSarcastic,
    confidence: isSarcastic ? 0.72 : 0.18,
    reasons: unique([
      ...matchedMarkers,
      ...(contrast ? ["positive-negative contrast"] : []),
      ...(quotedPraise ? ["quoted praise"] : []),
      ...(excessivePunctuation ? ["excessive punctuation"] : []),
    ]),
  };
}

function detectSpam(text, tokens) {
  const lower = text.toLowerCase();
  const repeats = tokens.filter((token, index) => index > 0 && token === tokens[index - 1]).length;
  const hasLink = /https?:\/\//.test(lower) || /\bwww\./.test(lower);
  const hasPromo = /\b(buy now|click here|subscribe|free money|guaranteed)\b/.test(lower);
  const hasContact = /\b\d{10,}\b/.test(lower);
  const upperRatio = text.replace(/[^A-Z]/g, "").length / Math.max(text.replace(/[^A-Za-z]/g, "").length, 1);
  const isSpam = hasLink || hasPromo || hasContact || repeats >= 2 || upperRatio > 0.55;

  return {
    isSpam,
    confidence: isSpam ? 0.84 : 0.12,
    reasons: unique([
      ...(hasLink ? ["contains link"] : []),
      ...(hasPromo ? ["promotional phrase"] : []),
      ...(hasContact ? ["contains contact pattern"] : []),
      ...(repeats >= 2 ? ["repeated tokens"] : []),
      ...(upperRatio > 0.55 ? ["excessive uppercase"] : []),
    ]),
  };
}

function classifySentimentLabel(score) {
  if (score >= 0.2) {
    return "positive";
  }
  if (score <= -0.2) {
    return "negative";
  }
  return "neutral";
}

function detectMoodFromEmotion(primaryEmotion, sentimentScore) {
  if (primaryEmotion === "happy") {
    return "Happy 😊";
  }
  if (primaryEmotion === "sad") {
    return "Sad 😢";
  }
  if (primaryEmotion === "angry") {
    return "Angry 😡";
  }
  if (primaryEmotion === "fear") {
    return "Concerned 😟";
  }
  if (primaryEmotion === "surprise") {
    return "Surprised 😲";
  }
  return sentimentScore > 0 ? "Happy 😊" : sentimentScore < 0 ? "Sad 😢" : "Neutral 😐";
}

function computeWordCloud(tokens) {
  const counts = new Map();

  for (const token of tokens) {
    if (token.length < 3 || STOPWORDS.has(token)) {
      continue;
    }

    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

function runModelVariants(text, lexicon, normalizedScore, emotion) {
  const tokens = tokenize(text);
  const ruleScore = clamp(tokens.reduce((sum, token) => {
    if (lexicon.positive.includes(token)) {
      return sum + 0.18;
    }
    if (lexicon.negative.includes(token)) {
      return sum - 0.18;
    }
    return sum;
  }, 0), -1, 1);

  const mlScore = clamp((normalizedScore * 0.7) + (emotion.primary === "happy" ? 0.15 : 0) - (emotion.primary === "angry" || emotion.primary === "sad" ? 0.15 : 0), -1, 1);
  const transformerScore = clamp((normalizedScore * 0.82) + (tokens.includes("not") ? -0.08 : 0) + (tokens.includes("wow") ? 0.04 : 0), -1, 1);

  return {
    ruleBased: {
      label: classifySentimentLabel(ruleScore),
      score: ruleScore,
      confidence: Math.abs(ruleScore),
    },
    mlModel: {
      label: classifySentimentLabel(mlScore),
      score: mlScore,
      confidence: clamp(Math.abs(mlScore) + 0.08, 0, 1),
    },
    transformerModel: {
      label: classifySentimentLabel(transformerScore),
      score: transformerScore,
      confidence: clamp(Math.abs(transformerScore) + 0.12, 0, 1),
      provider: process.env.HUGGINGFACE_API_KEY ? "huggingface-fallback-ready" : "local-heuristic-transformer",
    },
  };
}

function createConfusionMatrix(records, modelKey) {
  const labels = ["positive", "neutral", "negative"];
  const matrix = Object.fromEntries(labels.map((actual) => [actual, Object.fromEntries(labels.map((predicted) => [predicted, 0]))]));

  for (const record of records) {
    const actual = record.sentiment;
    const predicted = record.models?.[modelKey]?.label;

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
    const actual = record.sentiment;
    const predicted = record.models?.[modelKey]?.label;

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

function runLocalAdvancedAnalysis(text) {
  const normalizedText = String(text || "").trim();
  const tokens = tokenize(normalizedText);
  const language = detectLanguage(normalizedText, tokens);
  const lexicon = getLexicon(language);
  const base = sentiment.analyze(normalizedText);
  const lexiconBoost = tokens.reduce((sum, token) => sum + (lexicon.positive.includes(token) ? 1 : 0) - (lexicon.negative.includes(token) ? 1 : 0), 0);
  const normalizedScore = clamp(((base.score + lexiconBoost) / Math.max(tokens.length / 2, 3)), -1, 1);
  const sentimentLabel = classifySentimentLabel(normalizedScore);
  const emotion = detectEmotion(tokens);
  const aspects = aspectSentiment(tokens, normalizedScore, lexicon);
  const sarcasm = detectSarcasm(normalizedText, tokens, normalizedScore);
  const spam = detectSpam(normalizedText, tokens);
  const influences = buildInfluenceMap(tokens, lexicon).slice(0, 12);
  const models = runModelVariants(normalizedText, lexicon, normalizedScore, emotion);

  return {
    text: normalizedText,
    sentiment: sentimentLabel,
    sentimentScore: Number(normalizedScore.toFixed(2)),
    mood: detectMoodFromEmotion(emotion.primary, normalizedScore),
    language,
    emotions: {
      primary: emotion.primary,
      distribution: emotion.distribution,
    },
    aspects,
    sarcasm,
    spam,
    explainability: {
      influentialWords: influences,
      highlightedText: tokens.map((token) => {
        const match = influences.find((item) => item.word === token);
        return {
          token,
          label: match?.label || "neutral",
          weight: match?.weight || 0,
        };
      }),
    },
    wordCloud: computeWordCloud(tokens),
    models,
    timestamp: new Date().toISOString(),
  };
}

async function scoreWithHuggingFace(text) {
  if (!process.env.HUGGINGFACE_API_KEY || typeof fetch !== "function") {
    return null;
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/cardiffnlp/twitter-xlm-roberta-base-sentiment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const predictions = Array.isArray(payload?.[0]) ? payload[0] : Array.isArray(payload) ? payload : [];
    const positive = predictions.find((item) => /positive/i.test(item.label))?.score || 0;
    const negative = predictions.find((item) => /negative/i.test(item.label))?.score || 0;
    const neutral = predictions.find((item) => /neutral/i.test(item.label))?.score || 0;
    const score = clamp(positive - negative, -1, 1);

    return {
      label: classifySentimentLabel(score),
      score: Number(score.toFixed(2)),
      confidence: Number(Math.max(positive, negative, neutral).toFixed(2)),
      provider: "huggingface-cardiffnlp/twitter-xlm-roberta-base-sentiment",
    };
  } catch {
    return null;
  }
}

async function runAdvancedAnalysis(text) {
  const analysis = runLocalAdvancedAnalysis(text);
  const transformerResult = await scoreWithHuggingFace(analysis.text);

  if (!transformerResult) {
    return analysis;
  }

  const finalScore = Number((((analysis.sentimentScore * 0.45) + (transformerResult.score * 0.55))).toFixed(2));

  return {
    ...analysis,
    sentiment: transformerResult.label,
    sentimentScore: finalScore,
    mood: detectMoodFromEmotion(analysis.emotions.primary, finalScore),
    models: {
      ...analysis.models,
      transformerModel: transformerResult,
    },
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

module.exports = {
  computeModelMetrics,
  createLegacyAnalysis,
  runAdvancedAnalysis,
  runLocalAdvancedAnalysis,
};
