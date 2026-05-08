import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { BuildingUsage } from "../../types/api";
import { Card } from "../ui/Card";
import { ChartTooltip } from "./ChartTooltip";

interface BuildingBarChartProps {
  data: BuildingUsage[];
}

export function BuildingBarChart({
  data
}: BuildingBarChartProps) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Per-Building Comparison
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sorted by highest energy usage — current period
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.25}
            />

            <XAxis
              dataKey="building"
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <YAxis
              tick={{ fill: "#64748b" }}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(148, 163, 184, 0.18)" }}
            />

            <Legend />

            <Bar
              dataKey="energy"
              name="Energy (kWh)"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="water"
              name="Water (gal)"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="co2"
              name="CO₂ (kg)"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}