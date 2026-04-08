const Sentiment = require("sentiment");

const sentiment = new Sentiment();

const SENTIMENT_THRESHOLDS = {
  positive: 2,
  negative: -2,
};

const MOOD_KEYWORDS = {
  happy: [
    "happy",
    "joy",
    "joyful",
    "excited",
    "great",
    "awesome",
    "love",
    "loved",
    "amazing",
    "delighted",
    "glad",
    "smile",
    "smiling",
    "pleased",
  ],
  angry: [
    "angry",
    "mad",
    "furious",
    "annoyed",
    "irritated",
    "hate",
    "hated",
    "outraged",
    "frustrated",
    "upset",
    "rage",
  ],
  sad: [
    "sad",
    "unhappy",
    "depressed",
    "down",
    "heartbroken",
    "cry",
    "crying",
    "lonely",
    "miserable",
    "hurt",
    "gloomy",
    "disappointed",
  ],
};

const MOOD_LABELS = {
  happy: "Happy 😊",
  angry: "Angry 😡",
  sad: "Sad 😢",
  neutral: "Neutral 😐",
};

function tokenize(text) {
  return text.toLowerCase().match(/\b[\w']+\b/g) || [];
}

function scoreSentiment(text) {
  return sentiment.analyze(text).score;
}

function getSentimentLabel(score) {
  if (score >= SENTIMENT_THRESHOLDS.positive) {
    return "positive";
  }

  if (score <= SENTIMENT_THRESHOLDS.negative) {
    return "negative";
  }

  return "neutral";
}

function detectMood(text, sentimentScore) {
  const tokens = tokenize(text);
  const moodScores = {
    happy: 0,
    angry: 0,
    sad: 0,
  };

  for (const token of tokens) {
    for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
      if (keywords.includes(token)) {
        moodScores[mood] += 1;
      }
    }
  }

  const topMood = Object.entries(moodScores).sort((left, right) => right[1] - left[1])[0];

  if (!topMood || topMood[1] === 0) {
    return sentimentScore > 0 ? MOOD_LABELS.happy : sentimentScore < 0 ? MOOD_LABELS.sad : MOOD_LABELS.neutral;
  }

  return MOOD_LABELS[topMood[0]] || MOOD_LABELS.neutral;
}

function analyzeText(text) {
  const normalizedText = text.trim();
  const sentimentScore = scoreSentiment(normalizedText);

  return {
    sentiment: getSentimentLabel(sentimentScore),
    mood: detectMood(normalizedText, sentimentScore),
  };
}

module.exports = {
  analyzeText,
  detectMood,
  getSentimentLabel,
  scoreSentiment,
};
