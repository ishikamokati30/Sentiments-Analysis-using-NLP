import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DashboardCharts({ analytics }) {
  if (!analytics) {
    return null;
  }

  const pieData = [
    {
      name: "Positive",
      value: analytics.totals?.positive || 0,
      color: "#34d399",
    },
    {
      name: "Neutral",
      value: analytics.totals?.neutral || 0,
      color: "#fbbf24",
    },
    {
      name: "Negative",
      value: analytics.totals?.negative || 0,
      color: "#fb7185",
    },
  ];

  const trendData = (analytics.trends || []).map((item) => ({
    date: item.date.slice(5),
    positive: item.positive,
    negative: item.negative,
    neutral: item.neutral,
  }));

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <motion.article
        whileHover={{ y: -4 }}
        className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Sentiment split
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={94}
                paddingAngle={6}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.article>

      <motion.article
        whileHover={{ y: -4 }}
        className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45 xl:col-span-2"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Trend over time
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="positiveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.18)"
              />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="positive"
                stroke="#34d399"
                fill="url(#positiveFill)"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#fb7185"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.article>

      <motion.article
        whileHover={{ y: -4 }}
        className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45 xl:col-span-3"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Emotion spread
        </h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={Object.entries(analytics.emotions || {}).map(
                ([emotion, value]) => ({ emotion, value }),
              )}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.18)"
              />
              <XAxis dataKey="emotion" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#60a5fa"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.article>
    </section>
  );
}

export default DashboardCharts;
