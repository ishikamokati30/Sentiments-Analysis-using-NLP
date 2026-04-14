const { computeModelMetrics } = require("./nlpService");

function groupDailyTrend(history) {
  const daily = new Map();

  for (const entry of history) {
    const day = new Date(entry.timestamp).toISOString().slice(0, 10);
    const current = daily.get(day) || { date: day, positive: 0, negative: 0, neutral: 0 };
    current[entry.sentiment] = (current[entry.sentiment] || 0) + 1;
    daily.set(day, current);
  }

  return [...daily.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function summarizeWords(history) {
  const counts = new Map();

  for (const entry of history) {
    for (const item of entry.wordCloud || []) {
      counts.set(item.value, (counts.get(item.value) || 0) + item.count);
    }
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40);
}

function buildAnalytics(history) {
  const totals = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };

  const emotions = {
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
    fear: 0,
    surprise: 0,
  };

  for (const entry of history) {
    totals[entry.sentiment] = (totals[entry.sentiment] || 0) + 1;
    const primaryEmotion = entry.emotions?.primary || "neutral";
    emotions[primaryEmotion] = (emotions[primaryEmotion] || 0) + 1;
  }

  return {
    totals: {
      ...totals,
      total: history.length,
    },
    emotions,
    trends: groupDailyTrend(history),
    wordCloud: summarizeWords(history),
    modelComparison: {
      ruleBased: computeModelMetrics(history, "ruleBased"),
      mlModel: computeModelMetrics(history, "mlModel"),
      transformerModel: computeModelMetrics(history, "transformerModel"),
      note: "Metrics are estimated against the stored final sentiment label.",
    },
    recentHistory: history.slice(0, 50),
  };
}

module.exports = {
  buildAnalytics,
};
