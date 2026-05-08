import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/Button";

export function Navbar() {
  const { role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-white/20 bg-white/10 backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-900/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Campus Sustainability Tracker
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Role: {role?.replace("_", " ")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white/70 text-xl shadow-md transition hover:scale-105 dark:border-slate-600 dark:bg-slate-800 dark:text-yellow-300"
            title="Toggle theme"
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>

          <Button onClick={logout} className="bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}