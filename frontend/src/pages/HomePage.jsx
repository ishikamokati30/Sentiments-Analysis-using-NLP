import { useMemo, useState } from "react";

import { analyzeTextAdvanced, fetchAnalytics } from "../api/sentimentApi";
import HeroPanel from "../components/HeroPanel";
import HistoryList from "../components/HistoryList";
import ResultCard from "../components/ResultCard";

function HomePage({ history, onAnalyze, onAnalyticsRefresh }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const positives = history.filter((item) => item.sentiment === "positive").length;
    const risky = history.filter((item) => item.spam?.isSpam || item.sarcasm?.isSarcastic).length;

    return {
      total: history.length,
      positives,
      risky,
    };
  }, [history]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Enter some text before running the analysis.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await analyzeTextAdvanced(text);
      setResult(payload);
      onAnalyze(payload);
      onAnalyticsRefresh(await fetchAnalytics());
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-grid">
      <HeroPanel stats={stats} />

      <div className="card analyzer-card">
        <div className="section-heading">
          <p className="eyebrow">Analyzer</p>
          <h2>Run advanced multilingual sentiment analytics</h2>
        </div>

        <textarea
          className="input-panel"
          rows="8"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste English, Hindi, or Hinglish reviews, support logs, or campaign feedback here..."
        />

        <div className="action-row">
          <button type="button" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Advanced Sentiment"}
          </button>
          <span className="helper-text">Includes score, emotions, aspects, sarcasm, spam, and explainability.</span>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="result-grid">
          <ResultCard result={result} />
        </div>
      </div>

      <HistoryList history={history.slice(0, 12)} compact />
    </section>
  );
}

export default HomePage;
