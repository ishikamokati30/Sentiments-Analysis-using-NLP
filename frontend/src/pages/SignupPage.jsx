import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";
import { pageTransition } from "../animations/variants";
import { useAuth } from "../auth/AuthContext";

function SignupPage({ theme, onToggleTheme }) {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError(
        "Enter a name, a valid email, and a password with at least 6 characters.",
      );
      return;
    }

    setError("");

    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.message ||
          "Signup failed.",
      );
    }
  };

  return (
    <motion.section
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12"
    >
      <div className="w-full rounded-[2rem] border border-white/20 bg-white/55 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">
              Join The Platform
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
              Create your workspace
            </h1>
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="text-xs font-semibold text-slate-500 dark:text-slate-300"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <UserRound className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Ishika"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="w-full bg-transparent text-sm outline-none"
                placeholder="team@company.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <LockKeyhole className="h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="w-full bg-transparent text-sm outline-none"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="bg-transparent p-0 text-slate-400 shadow-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {error ? (
            <p className="rounded-2xl border border-rose-300/40 bg-rose-100/70 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-glow dark:bg-white dark:text-slate-950"
          >
            {loading ? <Spinner /> : null}
            {loading ? "Creating account..." : "Create account"}
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-700 dark:text-cyan-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.section>
  );
}

export default SignupPage;
