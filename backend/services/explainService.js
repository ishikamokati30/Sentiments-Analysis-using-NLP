const { clamp, lexiconTone, STOPWORDS, tokenize } = require("./textUtils");

function explainKeywords(text, sentimentResult, sarcasmResult) {
  const tokens = tokenize(text);
  const counts = new Map();

  tokens.forEach((token, index) => {
    if (token.length < 3 || STOPWORDS.has(token)) {
      return;
    }

    const current = counts.get(token) || { count: 0, positions: [] };
    current.count += 1;
    current.positions.push(index);
    counts.set(token, current);
  });

  const items = [...counts.entries()].map(([word, value]) => {
    const tf = value.count / tokens.length;
    const rarityBoost = 1 / (1 + value.positions.length - 1);
    const lexical = lexiconTone(word);
    const polarityWeight =
      lexical === "positive"
        ? sentimentResult.probabilities.positive
        : lexical === "negative"
          ? sentimentResult.probabilities.negative
          : Math.max(sentimentResult.confidence - 0.2, 0.08);
    const sarcasmBoost =
      sarcasmResult.sarcasm !== "Low" &&
      ["wow", "great", "amazing", "perfect"].includes(word)
        ? 0.28
        : 0;
    const importance = clamp(
      tf * 3.4 + rarityBoost + polarityWeight + sarcasmBoost,
      0,
      2.5,
    );
    const impact =
      sarcasmBoost > 0
        ? "sarcastic"
        : lexical !== "neutral"
          ? lexical
          : sentimentResult.sentimentLabel;

    return {
      word,
      impact,
      importance,
    };
  });

  return items
    .sort((left, right) => right.importance - left.importance)
    .slice(0, 8)
    .map((item) => ({
      word: item.word,
      impact: item.impact,
      importance: Number(item.importance.toFixed(4)),
    }));
}

module.exports = {
  explainKeywords,
};
