import { motion } from "framer-motion";

import DashboardCharts from "../components/DashboardCharts";
import EmptyState from "../components/EmptyState";
import HistoryList from "../components/HistoryList";
import ModelComparisonCard from "../components/ModelComparisonCard";
import WordCloudPanel from "../components/WordCloudPanel";

function DashboardPage({ history, analytics, bootstrapping }) {
  if (bootstrapping) {
    return (
      <section className="rounded-[2rem] border border-white/20 bg-white/55 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
        <div className="h-48 animate-pulse rounded-[1.5rem] bg-white/50 dark:bg-white/5" />
      </section>
    );
  }

  if (!history.length) {
    return <EmptyState />;
  }

  const latestResult = history[0];
  const stats = [
    { label: "Total analyses", value: analytics?.totals?.total || history.length },
    { label: "Positive count", value: analytics?.totals?.positive || 0 },
    { label: "Negative count", value: analytics?.totals?.negative || 0 },
    { label: "Primary emotion", value: latestResult.emotions?.primary || "neutral" },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <motion.article
            key={stat.label}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-[1.75rem] border border-white/20 bg-white/55 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-700 dark:text-cyan-300">Latest Insight</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Most recent result</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.4rem] bg-white/60 p-4 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Sentiment</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{latestResult.sentiment}</p>
            </div>
            <div className="rounded-[1.4rem] bg-white/60 p-4 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Mood</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{latestResult.mood}</p>
            </div>
            <div className="rounded-[1.4rem] bg-white/60 p-4 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{latestResult.sentimentScore.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <DashboardCharts analytics={analytics} />
      </div>

      <WordCloudPanel words={analytics?.wordCloud} />
      <ModelComparisonCard comparison={analytics?.modelComparison} />
      <HistoryList history={history} />
    </section>
  );
}

export default DashboardPage;
