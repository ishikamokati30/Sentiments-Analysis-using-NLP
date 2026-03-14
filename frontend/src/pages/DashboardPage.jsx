import DashboardCharts from "../components/DashboardCharts";
import EmptyState from "../components/EmptyState";
import WordCloudPanel from "../components/WordCloudPanel";

function DashboardPage({ history }) {
  if (!history.length) {
    return <EmptyState />;
  }

  return (
    <section className="dashboard-stack">
      <div className="card">
        <div className="section-heading">
          <p className="eyebrow">Analytics</p>
          <h2>Sentiment distribution and timeline</h2>
        </div>
        <DashboardCharts history={history} />
      </div>

      <WordCloudPanel history={history} />
    </section>
  );
}

export default DashboardPage;
