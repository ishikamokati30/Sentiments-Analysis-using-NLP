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

function fallbackEmotion(sentimentResult, text = "") {
  const score = sentimentResult.score;
  const lowerText = text.toLowerCase();
  
  let distribution = { happy: 0.05, sad: 0.05, angry: 0.05, fear: 0.05, surprise: 0.05, neutral: 0.05 };

  if (score >= 0.15) {
    distribution.happy = 0.65;
    distribution.sad = 0.02;
    distribution.angry = 0.02;
    distribution.surprise = 0.16;
    distribution.neutral = 0.10;
  } else if (score <= -0.15) {
    distribution.happy = 0.02;
    distribution.neutral = 0.08;
    distribution.fear = 0.10;
    
    if (/(terrible|frustrating|hate|angry|mad|worst|bakwaas|trash|useless)/.test(lowerText)) {
      distribution.angry = 0.60;
      distribution.sad = 0.15;
    } else if (/(sad|depressed|heartbroken|cry|miserable)/.test(lowerText)) {
      distribution.sad = 0.60;
      distribution.angry = 0.15;
    } else {
      distribution.angry = 0.40;
      distribution.sad = 0.35;
    }
  } else {
    distribution.neutral = 0.70;
    distribution.happy = 0.06;
    distribution.sad = 0.06;
    distribution.angry = 0.06;
    distribution.surprise = 0.06;
    distribution.fear = 0.06;
  }

  if (/(wow|unexpected|shocking|omg|surprise)/.test(lowerText)) {
    distribution.surprise += 0.30;
  }

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
    return fallbackEmotion(sentimentResult, text);
  }

  const payload = await queryModel(EMOTION_MODEL, text);
  return mapEmotionPayload(payload) || fallbackEmotion(sentimentResult, text);
}

module.exports = {
  analyzeEmotions,
};
