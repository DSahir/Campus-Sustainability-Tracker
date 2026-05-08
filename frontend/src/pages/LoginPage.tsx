import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await loginUser({ username, password });
      auth.login(result);
      navigate(`/dashboard/${result.role}`);
    } catch (err: unknown) {
      setError("Invalid username or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-md transition hover:scale-105 dark:border-slate-700 dark:bg-slate-900"
        aria-label="Toggle theme"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <Card className="w-full max-w-md bg-white/90 p-8 shadow-2xl backdrop-blur dark:bg-slate-900/90">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl shadow-md dark:bg-emerald-500/20">
            🌿
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Campus Sustainability Tracker
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Sign in to access sustainability insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Username
            </label>

            <Input
              id="username"
              name="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Forgot Password?
              </Link>
            </div>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
}