import type { RecommendationItem } from "../types/api";
import { Card } from "./ui/Card";

interface RecommendationsPanelProps {
  recommendations: RecommendationItem[];
}

const categoryStyles = {
  energy: {
    icon: "⚡",
    label: "Energy",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-300"
  },
  water: {
    icon: "💧",
    label: "Water",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-300"
  },
  waste: {
    icon: "♻️",
    label: "Waste",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
  },
  co2: {
    icon: "☁️",
    label: "CO₂",
    className: "bg-violet-500/15 text-violet-600 dark:text-violet-300"
  }
};

const impactStyles = {
  high: "bg-red-500/15 text-red-600 dark:text-red-300",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  low: "bg-slate-500/15 text-slate-600 dark:text-slate-300"
};

export function RecommendationsPanel({
  recommendations
}: RecommendationsPanelProps) {
  return (
    <section className="mt-8">
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sustainability Recommendations
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              AI-assisted suggestions based on current resource patterns.
            </p>
          </div>

          <span className="w-fit rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
            {recommendations.length} actions
          </span>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No recommendations available.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recommendations.map((item) => {
              const category = categoryStyles[item.category];

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800/70"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${category.className}`}
                    >
                      {category.icon}
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${impactStyles[item.impact]}`}
                    >
                      {item.impact} impact
                    </span>
                  </div>

                  <div className="mb-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.className}`}
                    >
                      {category.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </Card>
    </section>
  );
}