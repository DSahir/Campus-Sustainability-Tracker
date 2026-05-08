import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { TrendPoint } from "../../types/api";
import { Card } from "../ui/Card";
import { ChartTooltip } from "./ChartTooltip";

interface TrendChartProps {
  data: TrendPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            7-Day Resource Trends + Forecast
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Actual usage compared with predicted energy and confidence range
          </p>
        </div>

        <span className="w-fit rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">
          AI Forecast
        </span>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.25}
            />

            <XAxis dataKey="date" tick={{ fill: "#64748b" }} />
            <YAxis tick={{ fill: "#64748b" }} />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(148, 163, 184, 0.18)" }}
            />

            <Legend />

            <Area
              type="monotone"
              dataKey="energyUpper"
              name="Confidence Band"
              stroke="none"
              fill="#8b5cf6"
              fillOpacity={0.12}
              activeDot={false}
            />

            <Line
              type="monotone"
              dataKey="energyLower"
              name="Lower Bound"
              stroke="#8b5cf6"
              strokeOpacity={0.25}
              strokeWidth={1}
              dot={false}
              legendType="none"
            />

            <Line
              type="monotone"
              dataKey="energyUpper"
              name="Upper Bound"
              stroke="#8b5cf6"
              strokeOpacity={0.25}
              strokeWidth={1}
              dot={false}
              legendType="none"
            />

            <Line
              type="monotone"
              dataKey="energy"
              name="Actual Energy"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="predictedEnergy"
              name="Predicted Energy"
              stroke="#8b5cf6"
              strokeWidth={3}
              strokeDasharray="6 6"
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="water"
              name="Water"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="co2"
              name="CO₂"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}