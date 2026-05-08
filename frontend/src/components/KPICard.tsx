import { Card } from "./ui/Card";
import { formatCompactNumber } from "../lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  unit: string;
}

export function KPICard({
  title,
  value,
  change,
  unit
}: KPICardProps) {
  const positive = change > 0;

  const accentColor = title.includes("Energy")
    ? "from-amber-500 to-orange-500"
    : title.includes("Water")
    ? "from-blue-500 to-cyan-500"
    : "from-emerald-500 to-green-500";

  const lineColor = title.includes("Energy")
    ? "bg-amber-500"
    : title.includes("Water")
    ? "bg-blue-500"
    : "bg-emerald-500";

  return (
    <Card className="min-h-[190px] bg-white p-6 text-slate-900 dark:bg-slate-900 dark:text-white">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accentColor} text-2xl shadow-lg`}
          >
            {title.includes("Energy")
              ? "⚡"
              : title.includes("Water")
              ? "💧"
              : "☁️"}
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              positive
                ? "bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-300"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300"
            }`}
          >
            {positive ? "↑" : "↓"} {Math.abs(change)}%
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatCompactNumber(value)}{" "}
            <span className="text-base font-semibold text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          </h3>

          <p
            className={`mt-2 text-sm font-semibold ${
              positive
                ? "text-red-500 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {positive
              ? "Increased vs last 7 days"
              : "Decreased vs last 7 days"}
          </p>
        </div>

        <div className="mt-5">
          <div
            className={`h-1.5 w-full rounded-full opacity-90 ${lineColor}`}
          />
        </div>
      </div>
    </Card>
  );
}