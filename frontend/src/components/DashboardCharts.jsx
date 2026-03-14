import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
);

function DashboardCharts({ history }) {
  const positiveCount = history.filter((entry) => entry.sentiment === "Positive").length;
  const negativeCount = history.filter((entry) => entry.sentiment === "Negative").length;

  const pieData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [positiveCount, negativeCount],
        backgroundColor: ["#32c48d", "#ff6b57"],
      },
    ],
  };

  const barData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        label: "Prediction count",
        data: [positiveCount, negativeCount],
        backgroundColor: ["#32c48d", "#ff6b57"],
        borderRadius: 12,
      },
    ],
  };

  const orderedHistory = [...history].reverse();
  const lineData = {
    labels: orderedHistory.map((entry, index) => `Run ${index + 1}`),
    datasets: [
      {
        label: "Sentiment over time",
        data: orderedHistory.map((entry) => (entry.sentiment === "Positive" ? 1 : -1)),
        fill: false,
        borderColor: "#0f172a",
        backgroundColor: "#f59e0b",
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <h3>Pie chart</h3>
        <Pie data={pieData} />
      </div>

      <div className="chart-card">
        <h3>Bar chart</h3>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      <div className="chart-card chart-wide">
        <h3>Line chart</h3>
        <Line
          data={lineData}
          options={{
            scales: {
              y: {
                min: -1.2,
                max: 1.2,
                ticks: {
                  callback: (value) => {
                    if (value === 1) return "Positive";
                    if (value === -1) return "Negative";
                    return "";
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default DashboardCharts;
