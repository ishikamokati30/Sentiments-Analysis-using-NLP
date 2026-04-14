import { useMemo, useState } from "react";

function HistoryList({ history, compact = false }) {
  const [filter, setFilter] = useState("all");

  const filteredHistory = useMemo(() => {
    if (filter === "all") {
      return history;
    }

    return history.filter((item) => item.sentiment === filter || item.language === filter);
  }, [filter, history]);

  return (
    <section className="card">
      <div className="section-heading section-row">
        <div>
          <p className="eyebrow">History</p>
          <h2>{compact ? "Recent predictions" : "History table with filters"}</h2>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="filter-select">
          <option value="all">All</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="hinglish">Hinglish</option>
        </select>
      </div>

      <div className="history-table-wrap">
        {filteredHistory.length ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Text</th>
                <th>Sentiment</th>
                <th>Score</th>
                <th>Emotion</th>
                <th>Language</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr key={`${item.timestamp}-${index}`}>
                  <td>{item.text.slice(0, compact ? 80 : 120)}</td>
                  <td>
                    <span className={`sentiment-badge tone-${item.sentiment}`}>{item.sentiment}</span>
                  </td>
                  <td>{Number(item.sentimentScore).toFixed(2)}</td>
                  <td>{item.emotions?.primary || "neutral"}</td>
                  <td>{item.language}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted-text">No analysis history matches the current filter.</p>
        )}
      </div>
    </section>
  );
}

export default HistoryList;
