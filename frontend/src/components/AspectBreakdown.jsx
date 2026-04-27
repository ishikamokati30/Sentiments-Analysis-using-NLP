import { motion } from "framer-motion";

function AspectBreakdown({ aspects }) {
  if (!aspects?.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No aspect cues found in this text.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {aspects.map((aspect, index) => (
        <motion.article
          key={aspect.aspect}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -3 }}
          className="rounded-[1.5rem] border border-white/20 bg-white/60 p-5 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <strong className="text-base capitalize text-slate-900 dark:text-white">
              {aspect.aspect}
            </strong>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                aspect.sentiment === "positive"
                  ? "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
                  : aspect.sentiment === "negative"
                    ? "bg-rose-400/15 text-rose-700 dark:text-rose-300"
                    : "bg-amber-400/15 text-amber-700 dark:text-amber-300"
              }`}
            >
              {aspect.sentiment}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Score: {Number(aspect.score ?? 0).toFixed(2)}
          </p>
        </motion.article>
      ))}
    </div>
  );
}

export default AspectBreakdown;
