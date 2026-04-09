import React from 'react';
import { TimeSeriesPoint } from '../types';
import Sparkline from './Sparkline';

interface KPICardProps {
  title:      string;
  value:      number;
  unit:       string;
  /** % delta vs last week. Positive = consumption UP (⚠ bad). */
  trend:      number;
  icon:       React.ReactNode;
  /** Tailwind bg-* class for the icon badge (e.g. "bg-amber-500") */
  colorClass: string;
  sparkColor: string;
  sparkData:  TimeSeriesPoint[];
  sparkKey:   keyof Pick<TimeSeriesPoint, 'energy' | 'water' | 'co2'>;
}

const KPICard: React.FC<KPICardProps> = ({
  title, value, unit, trend, icon, colorClass, sparkColor, sparkData, sparkKey,
}) => {
  const trendUp = trend >= 0;

  // For sustainability: UP = bad → red; DOWN = good → green
  const trendColor = trendUp
    ? 'text-red-500 dark:text-red-400'
    : 'text-emerald-600 dark:text-emerald-400';
  const trendBg = trendUp
    ? 'bg-red-50  dark:bg-red-900/20'
    : 'bg-emerald-50 dark:bg-emerald-900/20';
  const trendArrow = trendUp ? '↑' : '↓';

  return (
    <div
      role="region"
      aria-label={title}
      className="glass-card p-6 relative overflow-hidden
                 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10
                 dark:hover:shadow-black/40
                 transition-all duration-300 cursor-default animate-fade-in"
    >
      {/* Ambient glow in card corner (matches icon colour, very subtle) */}
      <div
        aria-hidden="true"
        className={`absolute -top-8 -right-8 w-28 h-28
                    rounded-full blur-3xl opacity-[0.12] ${colorClass}`}
      />

      {/* ── Row 1: icon + trend badge ── */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        {/* Icon badge */}
        <div className={`${colorClass} p-2.5 rounded-xl text-white
                         shadow-lg shadow-black/10
                         group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>

        {/* Trend badge */}
        <span className={`flex items-center gap-1 text-xs font-bold
                          px-2.5 py-1 rounded-full ${trendColor} ${trendBg}`}>
          {trendArrow} {Math.abs(trend).toFixed(1)}%
        </span>
      </div>

      {/* ── Row 2: label + value ── */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1 truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums">
            {value.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-gray-400 dark:text-slate-500">
            {unit}
          </span>
        </div>
        <p className={`mt-1 text-xs font-semibold ${trendColor}`}>
          {trendUp ? 'Increased' : 'Decreased'} vs last 7 days
        </p>
      </div>

      {/* ── Row 3: sparkline ── */}
      {sparkData.length > 0 && (
        <div className="mt-3 -mx-1 relative z-10" aria-hidden="true">
          <Sparkline data={sparkData} dataKey={sparkKey} color={sparkColor} />
        </div>
      )}
    </div>
  );
};

export default KPICard;