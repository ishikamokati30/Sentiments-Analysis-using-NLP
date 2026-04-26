const { clamp, tokenize, INTENSITY_MODIFIERS } = require("./textUtils");

const POSITIVE_CUES = [
  "wow", "great", "awesome", "perfect", "love that", "just what i needed", "fantastic", "amazing",
  "excellent", "brilliant", "wonderful", "delightful", "fabulous",
];

const NEGATIVE_CUES = [
  "slow", "slower", "broken", "delay", "late", "bug", "buggy", "crash", "worse", "worst", "issue", "problem", "useless",
  "terrible", "awful", "horrible", "stupid", "idiotic", "pathetic",
];

/**
 * Enhanced sarcasm detection with better pattern matching
 */
function detectSarcasm(text, sentimentResult) {
  const lower = String(text || "").toLowerCase();
  const tokens = tokenize(text);
  const positiveMatches = POSITIVE_CUES.filter((cue) => lower.includes(cue));
  const negativeMatches = NEGATIVE_CUES.filter((cue) => lower.includes(cue));
  
  // Pattern detection
  const hasEllipsis = /…|\.\.\./.test(lower);
  const quotedPraise = /"(great|perfect|amazing|awesome)"/.test(lower);
  const positiveTokenCount = tokens.filter((token) => ["wow", "great", "awesome", "perfect", "amazing", "love"].includes(token)).length;
  const negativeTokenCount = tokens.filter((token) => NEGATIVE_CUES.includes(token)).length;
  const mismatch = positiveTokenCount > 0 && (negativeTokenCount > 0 || sentimentResult.score < -0.2);
  
  // New patterns for sarcasm detection
  const exaggeratedIntensity = tokens.some(t => INTENSITY_MODIFIERS.has(t)) && sentimentResult.score < -0.1;
  const rhetorical = /[?!]{2,}/.test(text); // Multiple punctuation marks
  const ironyMarkers = /yeah.*right|oh.*sure|oh.*please|how (wonderful|nice|fun)/.test(lower);
  
  let score = 0;
  score += positiveMatches.length * 0.24;
  score += negativeMatches.length * 0.16;
  score += mismatch ? 0.28 : 0;
  score += hasEllipsis ? 0.12 : 0;
  score += quotedPraise ? 0.14 : 0;
  score += exaggeratedIntensity ? 0.2 : 0;
  score += rhetorical ? 0.1 : 0;
  score += ironyMarkers ? 0.25 : 0;
  score = clamp(score, 0, 1);

  const sarcasm =
    score >= 0.65 ? "High"
      : score >= 0.35 ? "Medium"
        : "Low";

  return {
    sarcasm,
    confidence: Number(score.toFixed(4)),
    isSarcastic: score >= 0.35,
    reasons: [
      ...positiveMatches,
      ...negativeMatches.map((cue) => `negative-context:${cue}`),
      ...(mismatch ? ["sentiment-mismatch"] : []),
      ...(hasEllipsis ? ["ellipsis-tone"] : []),
      ...(quotedPraise ? ["quoted-praise"] : []),
      ...(exaggeratedIntensity ? ["exaggerated-intensity"] : []),
      ...(rhetorical ? ["rhetorical-punctuation"] : []),
      ...(ironyMarkers ? ["irony-markers"] : []),
    ],
  };
}

module.exports = {
  detectSarcasm,
};
