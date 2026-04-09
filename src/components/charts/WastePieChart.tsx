import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { WasteCategory } from '../../types';
import { useTheme }       from '../../context/ThemeContext';

interface Props { data: WasteCategory[] }

const PALETTE = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];
const RADIAN  = Math.PI / 180;

interface LabelProps {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}

// Renders percentage inside each slice; hides label if slice is too narrow
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) => {
  if (percent < 0.07) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.56;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle"
          dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const WastePieChart: React.FC<Props> = ({ data }) => {
  const { isDark } = useTheme();

  const ttBg   = isDark ? '#1e293b' : '#ffffff';
  const ttBdr  = isDark ? '#334155' : '#e2e8f0';
  const ttText = isDark ? '#e2e8f0' : '#374151';
  const tick   = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
          Waste Breakdown
        </h2>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
          Category share — percentages shown inside slices
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={70} outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
            labelLine={false}
            label={renderLabel}
            animationBegin={0}
            animationDuration={900}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [`${v}%`, 'Share']}
            contentStyle={{
              backgroundColor: ttBg, border: `1px solid ${ttBdr}`,
              borderRadius: '12px', color: ttText,
              boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)',
            }}
          />
          <Legend iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: '12px', color: tick }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WastePieChart;