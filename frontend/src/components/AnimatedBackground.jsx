function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_58%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_58%)]" />
      <div className="absolute left-[8%] top-24 h-40 w-40 animate-floaty rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-400/20" />
      <div className="absolute right-[10%] top-16 h-56 w-56 animate-drift rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-violet-500/20" />
      <div className="absolute bottom-24 left-1/3 h-44 w-44 animate-floaty rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20 mix-blend-overlay dark:opacity-10" />
    </div>
  );
}

export default AnimatedBackground;
