export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800/95">
      <p className="mb-2 font-bold text-slate-900 dark:text-white">{label}</p>

      <div className="space-y-1">
        {payload.map((entry: any) => (
          <p
            key={entry.dataKey}
            className="text-sm font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name ?? entry.dataKey} : {entry.value}
          </p>
        ))}
      </div>
    </div>
  );
}