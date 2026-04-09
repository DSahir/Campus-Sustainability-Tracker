import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TimeSeriesPoint } from '../../types';
import { useTheme }         from '../../context/ThemeContext';

interface Props { data: TimeSeriesPoint[] }

const ResourceLineChart: React.FC<Props> = ({ data }) => {
  const { isDark } = useTheme();

  const grid    = isDark ? '#1e293b' : '#f1f5f9';
  const tick    = isDark ? '#64748b' : '#94a3b8';
  const ttBg    = isDark ? '#1e293b' : '#ffffff';
  const ttBdr   = isDark ? '#334155' : '#e2e8f0';
  const ttText  = isDark ? '#e2e8f0' : '#374151';

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
          7-Day Resource Trends
        </h2>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
          Energy · Water · CO₂ — daily totals with hover detail
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} />
          <XAxis dataKey="date"
            tick={{ fontSize: 11, fill: tick }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: tick }} axisLine={false} tickLine={false} width={55} />
          <Tooltip
            contentStyle={{
              backgroundColor: ttBg, border: `1px solid ${ttBdr}`,
              borderRadius: '12px', color: ttText,
              boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)',
            }}
            labelStyle={{ color: ttText, fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: ttText }}
          />
          <Legend iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px', color: tick }} />
          <Line type="monotone" dataKey="energy" name="Energy (kWh)"
            stroke="#f59e0b" strokeWidth={2.5} dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
          <Line type="monotone" dataKey="water" name="Water (gal)"
            stroke="#3b82f6" strokeWidth={2.5} dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
          <Line type="monotone" dataKey="co2" name="CO₂ (kg)"
            stroke="#10b981" strokeWidth={2.5} dot={false}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceLineChart;