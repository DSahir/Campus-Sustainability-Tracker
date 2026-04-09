import React from 'react';

const Bar: React.FC<{ w?: string; h?: string; extraCls?: string }> = ({
  w = 'w-full', h = 'h-4', extraCls = '',
}) => (
  <div className={`${w} ${h} ${extraCls}
                   rounded-full bg-slate-200 dark:bg-slate-700
                   animate-skeleton-pulse`} />
);

export const SkeletonKPICard: React.FC = () => (
  <div className="glass-card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-700 animate-skeleton-pulse flex-shrink-0" />
      <Bar w="w-16" h="h-6" extraCls="rounded-full" />
    </div>
    <div className="space-y-2.5">
      <Bar w="w-2/3" h="h-3.5" />
      <Bar w="w-1/2" h="h-8" />
      <Bar w="w-3/4" h="h-3" />
    </div>
    {/* Sparkline placeholder */}
    <div className="mt-4 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 animate-skeleton-pulse" />
  </div>
);

// ── Chart skeleton (reusable, configurable height) ────────────────────────────
export const SkeletonChart: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="glass-card p-6">
    <div className="mb-5 space-y-2">
      <Bar w="w-1/3" h="h-5" />
      <Bar w="w-1/4" h="h-3" />
    </div>
    {/* Fake chart bars / lines */}
    <div
      className="w-full rounded-xl
                 bg-gradient-to-b from-slate-100 to-slate-50
                 dark:from-slate-700/40 dark:to-slate-700/20
                 animate-skeleton-pulse flex items-end gap-2 px-4 pb-4"
      style={{ height }}
    >
      {[55, 80, 45, 90, 65, 75, 50].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-lg bg-slate-200 dark:bg-slate-600/50"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);

// ── Alerts feed skeleton ──────────────────────────────────────────────────────
export const SkeletonAlerts: React.FC = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex justify-between items-center">
      <Bar w="w-1/4" h="h-5" />
      <Bar w="w-20" h="h-6" extraCls="rounded-full" />
    </div>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex items-start gap-3 p-4 rounded-xl
                   bg-slate-50 dark:bg-slate-700/30"
      >
        <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600
                        animate-skeleton-pulse flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <Bar w="w-3/4" h="h-3.5" />
          <Bar w="w-full" h="h-3" />
          <Bar w="w-1/3"  h="h-2.5" />
        </div>
      </div>
    ))}
  </div>
);