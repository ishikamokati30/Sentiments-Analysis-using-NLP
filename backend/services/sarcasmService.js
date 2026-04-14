const { clamp, tokenize } = require("./textUtils");

const POSITIVE_CUES = [
  "wow", "great", "awesome", "perfect", "love that", "just what i needed", "fantastic", "amazing",
];

const NEGATIVE_CUES = [
  "slow", "slower", "broken", "delay", "late", "bug", "buggy", "crash", "worse", "worst", "issue", "problem", "useless",
];

function detectSarcasm(text, sentimentResult) {
  const lower = String(text || "").toLowerCase();
  const tokens = tokenize(text);
  const positiveMatches = POSITIVE_CUES.filter((cue) => lower.includes(cue));
  const negativeMatches = NEGATIVE_CUES.filter((cue) => lower.includes(cue));
  const hasEllipsis = /…|\.\.\./.test(lower);
  const quotedPraise = /"(great|perfect|amazing|awesome)"/.test(lower);
  const positiveTokenCount = tokens.filter((token) => ["wow", "great", "awesome", "perfect", "amazing", "love"].includes(token)).length;
  const negativeTokenCount = tokens.filter((token) => NEGATIVE_CUES.includes(token)).length;
  const mismatch = positiveTokenCount > 0 && (negativeTokenCount > 0 || sentimentResult.score < -0.2);

  let score = 0;
  score += positiveMatches.length * 0.24;
  score += negativeMatches.length * 0.16;
  score += mismatch ? 0.28 : 0;
  score += hasEllipsis ? 0.12 : 0;
  score += quotedPraise ? 0.14 : 0;
  score = clamp(score, 0, 1);

  const sarcasm =
    score >= 0.65 ? "High"
      : score >= 0.35 ? "Medium"
        : "Low";

  return {
    sarcasm,
    confidence: Number(score.toFixed(4)),
    reasons: [
      ...positiveMatches,
      ...negativeMatches.map((cue) => `negative-context:${cue}`),
      ...(mismatch ? ["sentiment-mismatch"] : []),
      ...(hasEllipsis ? ["ellipsis-tone"] : []),
      ...(quotedPraise ? ["quoted-praise"] : []),
    ],
  };
}

module.exports = {
  detectSarcasm,
};
