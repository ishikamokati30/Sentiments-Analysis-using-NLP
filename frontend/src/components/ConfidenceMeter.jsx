import { motion } from "framer-motion";

function ConfidenceMeter({ score = 0 }) {
  const percentage = ((Number(score) + 1) / 2) * 100;

  return (
    <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
        <span>Sentiment score</span>
        <strong className="text-slate-900 dark:text-white">
          {Number(score).toFixed(2)}
        </strong>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400"
        />
      </div>
      <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
        <span>-1</span>
        <span>neutral</span>
        <span>+1</span>
      </div>
    </div>
  );
}

export default ConfidenceMeter;
