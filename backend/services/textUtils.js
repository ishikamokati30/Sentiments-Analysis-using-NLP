const HINGLISH_HINTS = new Set([
  "acha", "accha", "bahut", "bekar", "bura", "gussa", "dhokha", "sahi", "yaar", "hai", "tha", "thi", "pyaar",
  "mast", "badhiya", "bakwas", "kharab", "jaldi", "der", "theek", "acha", "kyun", "nahi", "matlab",
]);

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "for", "with", "that", "this", "these", "those", "are", "was", "were", "is", "am",
  "be", "been", "being", "to", "of", "in", "on", "at", "it", "its", "i", "we", "you", "they", "he", "she", "them", "our",
  "your", "my", "me", "him", "her", "their", "have", "has", "had", "do", "did", "does", "not", "just", "what", "needed",
  "very", "too", "from", "into", "than", "then", "there", "here", "when", "while", "after", "before", "about", "again",
  "acha", "accha", "hai", "tha", "thi", "bahut", "ke", "ki", "ka", "mein", "main", "aur", "par", "ya", "nahi", "haan",
]);

const NEGATIVE_WORDS = new Set([
  "slow", "slower", "laggy", "worse", "worst", "broken", "bad", "terrible", "awful", "poor", "hate", "late", "delay",
  "bug", "buggy", "freeze", "freezing", "crash", "crashes", "crashed", "useless", "badly", "frustrating", "annoying",
  "kharab", "bekar", "bura", "bakwas", "ghatiya",
]);

const POSITIVE_WORDS = new Set([
  "good", "great", "excellent", "amazing", "awesome", "love", "smooth", "fast", "useful", "helpful", "reliable",
  "acha", "accha", "badhiya", "mast", "shandar",
]);

function tokenize(text) {
  return String(text || "").toLowerCase().match(/[\p{L}\p{N}']+/gu) || [];
}

function splitSentences(text) {
  return String(text || "")
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeLabel(label) {
  return String(label || "").trim().toLowerCase();
}

function classifySentiment(score, neutralBand = 0.15) {
  if (score > neutralBand) {
    return "negative";
  }

  if (score < -neutralBand) {
    return "positive";
  }

  return "neutral";
}

function scoreToLabel(score, neutralBand = 0.15) {
  if (score >= neutralBand) {
    return "positive";
  }

  if (score <= -neutralBand) {
    return "negative";
  }

  return "neutral";
}

function titleCase(label) {
  const lower = normalizeLabel(label);
  return lower ? `${lower[0].toUpperCase()}${lower.slice(1)}` : "";
}

function detectLanguage(text) {
  const sample = String(text || "");

  if (/[\u0900-\u097F]/.test(sample)) {
    return "hindi";
  }

  let franc;
  try {
    ({ franc } = require("franc"));
  } catch {
    franc = null;
  }

  const tokens = tokenize(sample);
  const hinglishHits = tokens.filter((token) => HINGLISH_HINTS.has(token)).length;

  if (hinglishHits >= 2) {
    return "hinglish";
  }

  if (franc) {
    const detected = franc(sample, { minLength: 8 });
    if (detected === "hin") {
      return "hindi";
    }
  }

  return "english";
}

function extractCandidateAspects(text) {
  try {
    const nlp = require("compromise");
    const doc = nlp(text);
    const nounPhrases = [
      ...doc.nouns().out("array"),
      ...doc.match("#Adjective? #Noun+").out("array"),
    ]
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item && item.length > 2 && !STOPWORDS.has(item));

    if (nounPhrases.length) {
      return [...new Set(nounPhrases)].slice(0, 10);
    }
  } catch {
    // Fall back to token-based extraction when compromise is unavailable.
  }

  const tokens = tokenize(text);
  const candidates = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (STOPWORDS.has(token) || token.length < 3) {
      continue;
    }

    const previous = tokens[index - 1];
    if (previous && !STOPWORDS.has(previous) && previous.length > 2) {
      candidates.push(`${previous} ${token}`);
    }

    candidates.push(token);
  }

  return [...new Set(candidates)].slice(0, 10);
}

function getAspectContext(text, aspect) {
  const sentences = splitSentences(text);
  const lowerAspect = aspect.toLowerCase();
  const sentence = sentences.find((item) => item.toLowerCase().includes(lowerAspect));

  if (!sentence) {
    return text;
  }

  const clauses = sentence
    .split(/\bbut\b|\bhowever\b|\balthough\b|\bwhile\b|,/i)
    .map((item) => item.trim())
    .filter(Boolean);

  const clause = clauses.find((item) => item.toLowerCase().includes(lowerAspect));
  return clause || sentence;
}

function buildWordCloud(text) {
  const counts = new Map();

  for (const token of tokenize(text)) {
    if (token.length < 3 || STOPWORDS.has(token)) {
      continue;
    }

    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 30);
}

function lexiconTone(token) {
  if (NEGATIVE_WORDS.has(token)) {
    return "negative";
  }

  if (POSITIVE_WORDS.has(token)) {
    return "positive";
  }

  return "neutral";
}

module.exports = {
  buildWordCloud,
  clamp,
  detectLanguage,
  extractCandidateAspects,
  getAspectContext,
  lexiconTone,
  normalizeLabel,
  scoreToLabel,
  splitSentences,
  STOPWORDS,
  titleCase,
  tokenize,
};
