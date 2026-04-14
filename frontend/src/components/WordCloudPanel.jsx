import { motion } from "framer-motion";
import { TagCloud } from "react-tagcloud";

function WordCloudPanel({ words }) {
  if (!words?.length) {
    return null;
  }

  return (
    <motion.section
      whileHover={{ y: -4 }}
      className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
    >
      <p className="text-xs uppercase tracking-[0.32em] text-cyan-700 dark:text-cyan-300">Keyword Map</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Word cloud</h2>
      <div className="mt-6 flex min-h-[260px] items-center justify-center">
        <TagCloud
          minSize={16}
          maxSize={42}
          tags={words.map((item) => ({ value: item.value, count: item.count }))}
          className="text-center"
        />
      </div>
    </motion.section>
  );
}

export default WordCloudPanel;
