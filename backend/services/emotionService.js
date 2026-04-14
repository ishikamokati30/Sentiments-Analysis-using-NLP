const { queryModel } = require("./hfClient");
const { normalizeLabel } = require("./textUtils");

const EMOTION_MODEL = "j-hartmann/emotion-english-distilroberta-base";
const EMOTION_KEYS = ["happy", "sad", "angry", "fear", "surprise", "neutral"];

function normalizeEmotionLabel(label) {
  const lower = normalizeLabel(label);

  if (lower === "joy") {
    return "happy";
  }

  if (lower === "disgust") {
    return "angry";
  }

  return EMOTION_KEYS.includes(lower) ? lower : null;
}

function mapEmotionPayload(payload) {
  const predictions = Array.isArray(payload?.[0]) ? payload[0] : Array.isArray(payload) ? payload : [];

  if (!predictions.length) {
    return null;
  }

  const emotions = Object.fromEntries(EMOTION_KEYS.map((key) => [key, 0]));

  for (const item of predictions) {
    const key = normalizeEmotionLabel(item.label);
    if (key) {
      emotions[key] += item.score;
    }
  }

  const primary = Object.entries(emotions).sort((left, right) => right[1] - left[1])[0]?.[0] || "neutral";

  return {
    primary,
    distribution: Object.fromEntries(
      Object.entries(emotions).map(([key, value]) => [key, Number(value.toFixed(4))]),
    ),
    provider: `huggingface-${EMOTION_MODEL}`,
  };
}

function fallbackEmotion(sentimentResult) {
  const score = sentimentResult.score;
  const distribution = {
    happy: score > 0 ? 0.55 : 0.08,
    sad: score < -0.45 ? 0.36 : 0.12,
    angry: score < -0.2 ? 0.24 : 0.08,
    fear: score < -0.3 ? 0.14 : 0.06,
    surprise: Math.abs(score) > 0.5 ? 0.12 : 0.08,
    neutral: Math.abs(score) < 0.12 ? 0.58 : 0.12,
  };

  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);
  const normalized = Object.fromEntries(
    Object.entries(distribution).map(([key, value]) => [key, Number((value / total).toFixed(4))]),
  );
  const primary = Object.entries(normalized).sort((left, right) => right[1] - left[1])[0][0];

  return {
    primary,
    distribution: normalized,
    provider: "fallback-sentiment-shaped-emotion",
  };
}

async function analyzeEmotions(text, sentimentResult, language = "english") {
  if (language === "hindi") {
    return fallbackEmotion(sentimentResult);
  }

  const payload = await queryModel(EMOTION_MODEL, text);
  return mapEmotionPayload(payload) || fallbackEmotion(sentimentResult);
}

module.exports = {
  analyzeEmotions,
};
