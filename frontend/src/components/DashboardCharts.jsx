import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

function DashboardCharts({ analytics }) {
  if (!analytics) {
    return null;
  }

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [analytics.totals?.positive || 0, analytics.totals?.neutral || 0, analytics.totals?.negative || 0],
        backgroundColor: ["#2f855a", "#d69e2e", "#c53030"],
      },
    ],
  };

  const lineData = {
    labels: (analytics.trends || []).map((item) => item.date),
    datasets: [
      {
        label: "Positive",
        data: (analytics.trends || []).map((item) => item.positive),
        borderColor: "#2f855a",
        backgroundColor: "rgba(47,133,90,0.15)",
        fill: true,
      },
      {
        label: "Negative",
        data: (analytics.trends || []).map((item) => item.negative),
        borderColor: "#c53030",
        backgroundColor: "rgba(197,48,48,0.08)",
        fill: true,
      },
    ],
  };

  const emotionData = {
    labels: Object.keys(analytics.emotions || {}),
    datasets: [
      {
        label: "Emotion distribution",
        data: Object.values(analytics.emotions || {}),
        backgroundColor: ["#2b6cb0", "#dd6b20", "#c53030", "#718096", "#805ad5", "#319795"],
      },
    ],
  };

  return (
    <section className="chart-grid">
      <article className="chart-card">
        <h3>Sentiment split</h3>
        <Pie data={pieData} />
      </article>
      <article className="chart-card">
        <h3>Emotion distribution</h3>
        <Bar data={emotionData} />
      </article>
      <article className="chart-card chart-wide">
        <h3>Trend over time</h3>
        <Line data={lineData} />
      </article>
    </section>
  );
}

export default DashboardCharts;
