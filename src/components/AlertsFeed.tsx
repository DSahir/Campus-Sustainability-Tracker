import React from 'react';
import { Alert, AlertSeverity } from '../types';

interface Props { alerts: Alert[] }

// ── Severity config ────────────────────────────────────────────────────────────
const SEV: Record<AlertSeverity, {
  card:  string; badge: string; label: string; icon: React.ReactNode;
}> = {
  high: {
    card:  'bg-red-50/70 dark:bg-red-900/15 border-red-200 dark:border-red-800/40',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    label: 'CRITICAL',
    icon: (
      <svg className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
           fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213
             2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1
             1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
    ),
  },
  medium: {
    card:  'bg-amber-50/70 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800/40',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    label: 'WARNING',
    icon: (
      <svg className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5"
           fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1
             1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
    ),
  },
  low: {
    card:  'bg-emerald-50/70 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800/40',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
    label: 'LOW',
    icon: (
      <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5"
           fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9
             10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd" />
      </svg>
    ),
  },
};

const TYPE_EMOJI: Record<string, string> = { energy: '⚡', water: '💧', co2: '🌫️' };

const AlertsFeed: React.FC<Props> = ({ alerts }) => {
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const medCount  = alerts.filter(a => a.severity === 'medium').length;

  return (
    <div id="alerts" className="glass-card p-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
            Active Alerts
          </h2>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            Real-time threshold monitoring
          </p>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap items-center gap-2">
          {highCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full
                             bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
              {highCount} critical
            </span>
          )}
          {medCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full
                             bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
              {medCount} warning
            </span>
          )}
          <span className="text-xs font-medium px-2.5 py-1 rounded-full
                           bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
            {alerts.length} total
          </span>
        </div>
      </div>

      {/* ── Feed ── */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              All systems nominal
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
              No active alerts at this time
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const s = SEV[alert.severity];
            return (
              <div
                key={alert.id}
                className={`border rounded-xl p-4 ${s.card}
                            hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon + content */}
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    {s.icon}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                          {alert.building}
                        </p>
                        <span className="text-xs text-gray-400 dark:text-slate-500">
                          {TYPE_EMOJI[alert.type] ?? '📊'} {alert.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">
                        {new Date(alert.timestamp).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Severity badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                   flex-shrink-0 whitespace-nowrap ${s.badge}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsFeed;