import { useMemo, useState } from "react";

import { analyzeText } from "../api/sentimentApi";
import HeroPanel from "../components/HeroPanel";
import HistoryList from "../components/HistoryList";
import ResultCard from "../components/ResultCard";

const EMPTY_RESULT = null;

function HomePage({ history, onAnalyze }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(EMPTY_RESULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const positives = history.filter((item) => item.sentiment === "positive").length;
    const negatives = history.filter((item) => item.sentiment === "negative").length;

    return {
      total: history.length,
      positives,
      negatives,
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
      const payload = await analyzeText(text);

      const nextResult = {
        sentiment: typeof payload?.sentiment === "string" ? payload.sentiment.trim().toLowerCase() : "",
      };

      if (!nextResult.sentiment) {
        throw new Error("Invalid API response.");
      }

      setResult(nextResult);
      onAnalyze({
        ...nextResult,
        text,
        timestamp: new Date().toISOString(),
      });
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
          <h2>Classify customer feedback, reviews, or social posts</h2>
        </div>

        <textarea
          className="input-panel"
          rows="8"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste review text, support feedback, or campaign responses here..."
        />

        <div className="action-row">
          <button type="button" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Sentiment"}
          </button>
          <span className="helper-text">Flow: React -> Express -> Flask -> sklearn model</span>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="result-grid">
          <ResultCard result={result} />
        </div>
      </div>

      <HistoryList history={history} />
    </section>
  );
}

export default HomePage;
