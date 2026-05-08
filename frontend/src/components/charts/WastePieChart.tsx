import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import type { WasteBreakdown } from "../../types/api";
import { Card } from "../ui/Card";
import { ChartTooltip } from "./ChartTooltip";

interface WastePieChartProps {
  data: WasteBreakdown[];
}

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444"
];

export function WastePieChart({
  data
}: WastePieChartProps) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Waste Breakdown
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Current category distribution
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<ChartTooltip />} />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}