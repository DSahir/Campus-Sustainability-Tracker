import React, { useEffect, useState } from 'react';
import { useParams }          from 'react-router-dom';
import { fetchDashboardData } from '../api/dashboardApi';
import { MetricsSummary, Building, Alert } from '../types';
import Navbar                 from '../components/Navbar';
import KPICard                from '../components/KPICard';
import ResourceLineChart      from '../components/charts/ResourceLineChart';
import BuildingBarChart       from '../components/charts/BuildingBarChart';
import WastePieChart          from '../components/charts/WastePieChart';
import AlertsFeed             from '../components/AlertsFeed';
import {
  SkeletonKPICard,
  SkeletonChart,
  SkeletonAlerts,
}                             from '../components/SkeletonCard';
import {
  STUB_METRICS,
  STUB_BUILDINGS,
  STUB_ALERTS,
}                             from '../data/stubs';

// ── Inline KPI icons ───────────────────────────────────────────────────────────
const BoltIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const DropIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 2C8 8 5 13 5 16a7 7 0 0014 0c0-3-3-8-7-14z" />
  </svg>
);
const CloudIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999A5.002 5.002 0 003 15z" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();

  const [metrics,   setMetrics]   = useState<MetricsSummary | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [alerts,    setAlerts]    = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stubMode,  setStubMode]  = useState(false);

  // ── Three parallel API calls on mount ────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [m, b, a] = await fetchDashboardData();
        if (!cancelled) { setMetrics(m); setBuildings(b); setAlerts(a); }
      } catch {
        if (!cancelled) {
          setMetrics(STUB_METRICS);
          setBuildings(STUB_BUILDINGS);
          setAlerts(STUB_ALERTS);
          setStubMode(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const highAlertCount = alerts.filter(a => a.severity === 'high').length;

  return (
    // ── Page shell with gradient background ──────────────────────────────────
    <div className="min-h-screen
                    bg-gradient-to-br
                    from-emerald-50 via-sky-50 to-violet-50
                    dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">

      {/* Sticky top navbar */}
      <Navbar role={role ?? 'student'} alertCount={highAlertCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Stub data warning ── */}
        {!isLoading && stubMode && (
          <div className="flex items-center gap-3
                          bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm
                          border border-amber-200 dark:border-amber-800/40
                          text-amber-800 dark:text-amber-400
                          rounded-2xl px-5 py-3.5 text-sm shadow-sm
                          animate-fade-in">
            <span className="flex-shrink-0 text-base">⚠️</span>
            <span>
              Using <strong>stub data</strong> — FastAPI backend unavailable at{' '}
              <code className="font-mono text-xs
                               bg-amber-100 dark:bg-amber-900/40
                               px-1.5 py-0.5 rounded-md">
                {import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}
              </code>
            </span>
          </div>
        )}

        {/* ── Page title ── */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Sustainability Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              UMass Amherst · Monitoring last 7 days of campus resource usage
            </p>
          </div>
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 pb-0.5
                          text-xs font-medium text-gray-400 dark:text-slate-500 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <section aria-label="Key performance indicators">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {isLoading ? (
              <><SkeletonKPICard /><SkeletonKPICard /><SkeletonKPICard /></>
            ) : metrics ? (
              <>
                <KPICard
                  title="Energy Consumption"
                  value={metrics.energy.value}
                  unit={metrics.energy.unit}
                  trend={metrics.energy.trend}
                  icon={<BoltIcon />}
                  colorClass="bg-amber-500"
                  sparkColor="#f59e0b"
                  sparkData={metrics.timeSeries}
                  sparkKey="energy"
                />
                <KPICard
                  title="Water Usage"
                  value={metrics.water.value}
                  unit={metrics.water.unit}
                  trend={metrics.water.trend}
                  icon={<DropIcon />}
                  colorClass="bg-blue-500"
                  sparkColor="#3b82f6"
                  sparkData={metrics.timeSeries}
                  sparkKey="water"
                />
                <KPICard
                  title="CO₂ Emissions"
                  value={metrics.co2.value}
                  unit={metrics.co2.unit}
                  trend={metrics.co2.trend}
                  icon={<CloudIcon />}
                  colorClass="bg-emerald-500"
                  sparkColor="#10b981"
                  sparkData={metrics.timeSeries}
                  sparkKey="co2"
                />
              </>
            ) : null}
          </div>
        </section>

        {/* ── 7-Day Line Chart (full width) ── */}
        <section aria-label="7-day resource trends">
          {isLoading
            ? <SkeletonChart height={300} />
            : metrics?.timeSeries && <ResourceLineChart data={metrics.timeSeries} />
          }
        </section>

        {/* ── Bar + Donut side-by-side ── */}
        <section aria-label="Building comparison and waste breakdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {isLoading ? (
              <><SkeletonChart height={300} /><SkeletonChart height={300} /></>
            ) : (
              <>
                <BuildingBarChart data={buildings} />
                {metrics?.wasteBreakdown && (
                  <WastePieChart data={metrics.wasteBreakdown} />
                )}
              </>
            )}
          </div>
        </section>

        {/* ── Alerts Feed ── */}
        <section id="alerts" aria-label="Active alerts">
          {isLoading ? <SkeletonAlerts /> : <AlertsFeed alerts={alerts} />}
        </section>

        {/* ── Reports placeholder ── */}
        <section id="reports" aria-label="Reports">
          <div className="glass-card p-8 text-center">
            <p className="text-3xl mb-3">📄</p>
            <p className="text-base font-semibold text-gray-700 dark:text-slate-300">
              Reports
            </p>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
              Export sustainability reports as PDF
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;