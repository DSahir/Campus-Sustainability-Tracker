import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { KPICard } from "../components/KPICard";
import { TrendChart } from "../components/charts/TrendChart";
import { BuildingBarChart } from "../components/charts/BuildingBarChart";
import { WastePieChart } from "../components/charts/WastePieChart";
import { Card } from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { RecommendationsPanel } from "../components/RecommendationsPanel";

export default function DashboardPage() {
  const { token, role } = useAuth();
  const { role: routeRole } = useParams();
  const { data, loading, error } = useDashboardData(token);

  const dashboardTitle = useMemo(() => {
    switch (routeRole) {
      case "admin":
        return "Admin Dashboard";
      case "facility_manager":
        return "Facility Manager Dashboard";
      case "student":
        return "Student Dashboard";
      default:
        return "Dashboard";
    }
  }, [routeRole]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Card className="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error ?? "Something went wrong."}
          </Card>
        </div>
      </>
    );
  }

  const criticalCount = data.alerts.filter((alert) => alert.severity === "high").length;
  const warningCount = data.alerts.filter((alert) => alert.severity === "medium").length;
  const canViewAlerts = role === "admin" || role === "facility_manager";
  const canViewReports = role === "admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-600 dark:text-emerald-400">
              UMass Amherst · Monitoring last 7 days of campus resource usage
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {dashboardTitle}
            </h2>

            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Logged in as <span className="font-medium capitalize">{role}</span>
            </p>
          </div>

          <div className="w-fit rounded-2xl bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-soft dark:bg-emerald-500/15 dark:text-emerald-300">
            Sustainability overview for the last 7 days
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <KPICard
            title="Energy Usage"
            value={data.summary.energy}
            change={data.summary.energyChange}
            unit="kWh"
          />
          <KPICard
            title="Water Usage"
            value={data.summary.water}
            change={data.summary.waterChange}
            unit="gal"
          />
          <KPICard
            title="CO₂ Emissions"
            value={data.summary.co2}
            change={data.summary.co2Change}
            unit="kg"
          />
        </section>

        <RecommendationsPanel recommendations={data.recommendations} />

        <section className="mt-8">
          <TrendChart data={data.trends} />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <BuildingBarChart data={data.buildingComparison} />
          <WastePieChart data={data.wasteBreakdown} />
        </section>
        {/* THRESHOLD CONFIGURATION - ADMIN ONLY */}
{canViewReports && (
  <section className="mt-8">
    <Card>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Threshold Configuration
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure sustainability alert thresholds for campus monitoring.
          </p>
        </div>

        <span className="w-fit rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">
          Admin Controls
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {/* ENERGY */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-xl">
              ⚡
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Energy Threshold
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily campus energy usage
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Maximum kWh
          </label>

          <input
            type="number"
            defaultValue={18000}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Alerts trigger when usage exceeds this threshold.
          </p>
        </div>

        {/* WATER */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl">
              💧
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Water Threshold
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily campus water usage
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Maximum gallons
          </label>

          <input
            type="number"
            defaultValue={12000}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Used for automated water anomaly detection.
          </p>
        </div>

        {/* CO2 */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-xl">
              🌿
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                CO₂ Threshold
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Emission monitoring
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Maximum CO₂ (kg)
          </label>

          <input
            type="number"
            defaultValue={5000}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Helps monitor sustainability compliance targets.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-700">
          Save Threshold Settings
        </button>
      </div>
    </Card>
  </section>
)}
        {canViewAlerts && (
          <section className="mt-8">
            <Card>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Active Alerts
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Real-time threshold monitoring
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-red-500/15 px-3 py-1 text-red-500 dark:text-red-400">
                    {criticalCount} critical
                  </span>
                  <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-600 dark:text-amber-400">
                    {warningCount} warning
                  </span>
                  <span className="rounded-full bg-slate-500/15 px-3 py-1 text-slate-500 dark:text-slate-300">
                    {data.alerts.length} total
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {data.alerts.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No active alerts.
                  </p>
                ) : (
                  data.alerts.map((alert) => {
                    const isCritical = alert.severity === "high";
                    const isWarning = alert.severity === "medium";

                    const alertStyle = isCritical
                      ? "border-red-500/30 bg-red-500/10"
                      : isWarning
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-blue-500/30 bg-blue-500/10";

                    const iconStyle = isCritical
                      ? "bg-red-500/20 text-red-500 dark:text-red-400"
                      : isWarning
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-blue-500/20 text-blue-500 dark:text-blue-400";

                    const badgeStyle = isCritical
                      ? "bg-red-500/20 text-red-500 dark:text-red-400"
                      : isWarning
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-blue-500/20 text-blue-500 dark:text-blue-400";

                    return (
                      <div
                        key={alert.id}
                        className={`rounded-2xl border p-4 transition-all ${alertStyle}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl text-lg ${iconStyle}`}
                          >
                            {isCritical ? "⚠️" : isWarning ? "🔔" : "ℹ️"}
                          </div>

                          <div className="flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold capitalize text-slate-900 dark:text-white">
                                {isCritical
                                  ? "Critical Priority"
                                  : isWarning
                                    ? "Warning Priority"
                                    : `${alert.severity} Priority`}
                              </h3>

                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeStyle}`}
                              >
                                {isCritical
                                  ? "critical"
                                  : isWarning
                                    ? "warning"
                                    : alert.severity}
                              </span>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {alert.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </section>
        )}

        {canViewReports && (
          <section className="mt-8">
            <Card>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Sustainability Reports
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Generate downloadable reports.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Time Range
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Campus Scope
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option>UMass Amherst</option>
                    <option>All Campuses</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Format
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option>PDF</option>
                    <option>CSV</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Filename
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Optional filename"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                Report includes energy consumption, water usage, waste generation, CO₂ emissions,
                and active system alerts for the selected period.
              </div>

              <div className="mt-5 flex justify-end">
                <a
                  href="http://localhost:8000/api/v1/reports"
                  download
                  className="rounded-xl bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  Download Report
                </a>
              </div>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}