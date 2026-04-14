import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="rounded-[2rem] border border-white/20 bg-white/55 p-10 text-center shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
      <p className="text-xs uppercase tracking-[0.32em] text-cyan-700 dark:text-cyan-300">404</p>
      <h2 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">Page not found</h2>
      <p className="mt-3 text-slate-500 dark:text-slate-400">This route does not exist inside the current workspace shell.</p>
      <Link to="/" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;
