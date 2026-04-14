import { motion } from "framer-motion";
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
    <section className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-700 dark:text-cyan-300">History</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{compact ? "Recent predictions" : "History table with filters"}</h2>
        </div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm outline-none backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
        >
          <option value="all">All</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="hinglish">Hinglish</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        {filteredHistory.length ? (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/15 text-slate-500 dark:text-slate-400">
                <th className="px-3 py-3">Text</th>
                <th className="px-3 py-3">Sentiment</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Emotion</th>
                <th className="px-3 py-3">Language</th>
                <th className="px-3 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <motion.tr
                  key={`${item.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-white/10 last:border-0"
                >
                  <td className="max-w-[420px] px-3 py-4 text-slate-700 dark:text-slate-200">{item.text.slice(0, compact ? 80 : 120)}</td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      item.sentiment === "positive"
                        ? "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
                        : item.sentiment === "negative"
                          ? "bg-rose-400/15 text-rose-700 dark:text-rose-300"
                          : "bg-amber-400/15 text-amber-700 dark:text-amber-300"
                    }`}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-slate-600 dark:text-slate-300">{Number(item.sentimentScore).toFixed(2)}</td>
                  <td className="px-3 py-4 text-slate-600 dark:text-slate-300">{item.emotions?.primary || "neutral"}</td>
                  <td className="px-3 py-4 text-slate-600 dark:text-slate-300">{item.language}</td>
                  <td className="px-3 py-4 text-slate-500 dark:text-slate-400">{new Date(item.timestamp).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No analysis history matches the current filter.</p>
        )}
      </div>
    </section>
  );
}

export default HistoryList;
