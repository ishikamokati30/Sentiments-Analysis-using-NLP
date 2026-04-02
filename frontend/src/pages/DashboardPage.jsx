import EmptyState from "../components/EmptyState";
import HistoryList from "../components/HistoryList";

function DashboardPage({ history }) {
  if (!history.length) {
    return <EmptyState />;
  }

  const positiveCount = history.filter((entry) => entry.sentiment === "positive").length;
  const negativeCount = history.filter((entry) => entry.sentiment === "negative").length;
  const latestResult = history[0];

  return (
    <section className="dashboard-stack">
      <div className="card">
        <div className="section-heading">
          <p className="eyebrow">Overview</p>
          <h2>Sentiment summary</h2>
        </div>
        <div className="metric-strip">
          <article className="metric-card">
            <span>Total analyses</span>
            <strong>{history.length}</strong>
          </article>
          <article className="metric-card">
            <span>Positive</span>
            <strong>{positiveCount}</strong>
          </article>
          <article className="metric-card">
            <span>Negative</span>
            <strong>{negativeCount}</strong>
          </article>
        </div>
      </div>

      <div className="card">
        <div className="section-heading">
          <p className="eyebrow">Latest</p>
          <h2>Most recent result</h2>
        </div>
        <p className="result-meta">Sentiment: <span className="sentiment-badge">{latestResult.sentiment}</span></p>
      </div>

      <HistoryList history={history} />
    </section>
  );
}

export default DashboardPage;
