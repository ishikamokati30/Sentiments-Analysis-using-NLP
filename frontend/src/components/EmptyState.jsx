import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function EmptyState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-white/20 bg-white/55 p-8 text-center shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
    >
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
        No analysis yet
      </h2>
      <p className="mt-3 text-slate-500 dark:text-slate-400">
        Run an analysis from the analyzer workspace to populate your dashboard.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
      >
        Go to analyzer
      </Link>
    </motion.section>
  );
}

export default EmptyState;
