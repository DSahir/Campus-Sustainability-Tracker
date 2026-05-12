import { Card } from "./ui/Card";

interface RecommendationsPanelProps {
  recommendations: string[];
}

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
          <div className="grid gap-4">
            {recommendations.map((item, index) => (
              <article
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70"
              >
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item}
                </p>
              </article>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}