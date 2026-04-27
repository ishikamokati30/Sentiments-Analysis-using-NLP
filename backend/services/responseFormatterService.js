const {
  tokenize,
  normalizeText,
  POSITIVE_WORDS,
  NEGATIVE_WORDS,
} = require("./textUtils");

/**
 * Extract sentiment-focused keywords from text
 */
function extractSentimentKeywords(text, sentimentResult, sarcasmResult) {
  const tokens = tokenize(text);
  const keywords = new Set();

  // Add sentiment-bearing words
  for (const token of tokens) {
    if (POSITIVE_WORDS.has(token) || NEGATIVE_WORDS.has(token)) {
      keywords.add(token);
    }
  }

  // Add sarcasm reason keywords
  for (const reason of sarcasmResult.reasons) {
    if (!reason.includes(":") && !reason.includes("-")) {
      keywords.add(reason);
    }
  }

  return Array.from(keywords).slice(0, 10);
}

/**
 * Format analysis result to strict JSON output format
 */
function formatStrictResponse(
  text,
  advancedAnalysis,
  sentimentResult,
  emotionResult,
  sarcasmResult,
  language = "english",
) {
  const keywords = extractSentimentKeywords(
    text,
    sentimentResult,
    sarcasmResult,
  );

  let finalSentiment = "neutral";
  if (sarcasmResult.sarcasm !== "Low") {
    finalSentiment = "sarcastic";
  } else if (emotionResult.primary !== "neutral") {
    finalSentiment = emotionResult.primary;
  } else if (sentimentResult.sentimentLabel === "negative") {
    finalSentiment = "angry";
  } else if (sentimentResult.sentimentLabel === "positive") {
    finalSentiment = "happy";
  }

  const reason =
    keywords.length > 0
      ? `The word(s) '${keywords.join(", ")}' indicate a ${finalSentiment} sentiment.`
      : "No strong emotional indicators found, resulting in a neutral classification.";

  return {
    sentiment: finalSentiment,
    score: sentimentResult.score,
    sarcasm: sarcasmResult.sarcasm || "Low",
    language: language.charAt(0).toUpperCase() + language.slice(1),
    keywords: keywords,
    reason: reason,
  };
}

module.exports = {
  extractSentimentKeywords,
  formatStrictResponse,
};
