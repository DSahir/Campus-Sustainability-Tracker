import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  function toggleTheme() {
    const nextDark = !isDark;

    setIsDark(nextDark);

    document.documentElement.classList.toggle("dark", nextDark);

    localStorage.setItem("theme", nextDark ? "dark" : "light");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* THEME BUTTON */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-md transition hover:scale-105 dark:border-slate-700 dark:bg-slate-900"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <Card className="w-full max-w-md bg-white/90 p-8 shadow-2xl backdrop-blur dark:bg-slate-900/90">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl shadow-md dark:bg-emerald-500/20">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Enter your email to receive a password reset link
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
              Reset link sent successfully!
            </p>

            <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
              Please check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email Address
              </label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}