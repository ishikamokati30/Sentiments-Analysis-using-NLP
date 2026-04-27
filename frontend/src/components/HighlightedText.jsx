import { motion } from "framer-motion";

function HighlightedText({ items }) {
  if (!items?.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No standout keywords detected yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <motion.span
          key={`${item.token || item.word}-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.04 }}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            item.label === "positive"
              ? "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
              : item.label === "negative"
                ? "bg-rose-400/15 text-rose-700 dark:text-rose-300"
                : "bg-amber-400/15 text-amber-700 dark:text-amber-300"
          }`}
        >
          {item.token || item.word}
        </motion.span>
      ))}
    </div>
  );
}

export default HighlightedText;
