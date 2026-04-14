import DashboardCharts from "../components/DashboardCharts";
import EmptyState from "../components/EmptyState";
import HistoryList from "../components/HistoryList";
import ModelComparisonCard from "../components/ModelComparisonCard";
import WordCloudPanel from "../components/WordCloudPanel";

function DashboardPage({ history, analytics, bootstrapping }) {
  if (bootstrapping) {
    return (
      <section className="card empty-state">
        <h2>Loading analytics</h2>
      </section>
    );
  }

  if (!history.length) {
    return <EmptyState />;
  }

  const latestResult = history[0];

  return (
    <section className="dashboard-stack">
      <div className="card">
        <div className="section-heading">
          <p className="eyebrow">Overview</p>
          <h2>Advanced sentiment summary</h2>
        </div>
        <div className="metric-strip">
          <article className="metric-card">
            <span>Total analyses</span>
            <strong>{analytics?.totals?.total || history.length}</strong>
          </article>
          <article className="metric-card">
            <span>Primary emotion</span>
            <strong>{latestResult.emotions?.primary || "neutral"}</strong>
          </article>
          <article className="metric-card">
            <span>Latest language</span>
            <strong>{latestResult.language}</strong>
          </article>
        </div>
      </div>

      <div className="card">
        <div className="section-heading">
          <p className="eyebrow">Latest</p>
          <h2>Most recent result</h2>
        </div>
        <p className="result-meta">Sentiment: <span className={`sentiment-badge tone-${latestResult.sentiment}`}>{latestResult.sentiment}</span></p>
        <p className="result-meta">Mood: <span className="sentiment-badge">{latestResult.mood}</span></p>
        <p className="result-meta">Score: <span className="sentiment-badge">{latestResult.sentimentScore.toFixed(2)}</span></p>
      </div>

      <DashboardCharts analytics={analytics} />
      <WordCloudPanel words={analytics?.wordCloud} />
      <ModelComparisonCard comparison={analytics?.modelComparison} />
      <HistoryList history={history} />
    </section>
  );
}

export default DashboardPage;
