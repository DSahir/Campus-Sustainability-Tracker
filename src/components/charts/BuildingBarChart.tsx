import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Building } from '../../types';
import { useTheme }  from '../../context/ThemeContext';

interface Props { data: Building[] }

const BuildingBarChart: React.FC<Props> = ({ data }) => {
  const { isDark } = useTheme();

  // Sort: highest energy first → problem buildings float to the top
  const sorted = [...data].sort((a, b) => b.energy - a.energy);

  const grid   = isDark ? '#1e293b' : '#f1f5f9';
  const tick   = isDark ? '#64748b' : '#94a3b8';
  const ttBg   = isDark ? '#1e293b' : '#ffffff';
  const ttBdr  = isDark ? '#334155' : '#e2e8f0';
  const ttText = isDark ? '#e2e8f0' : '#374151';
  const cursor = isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)';

  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
          Per-Building Comparison
        </h2>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
          Sorted by highest energy usage — current period
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sorted}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="name"
            tick={{ fontSize: 10, fill: tick }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: tick }} axisLine={false} tickLine={false} width={55} />
          <Tooltip
            cursor={{ fill: cursor }}
            contentStyle={{
              backgroundColor: ttBg, border: `1px solid ${ttBdr}`,
              borderRadius: '12px', color: ttText,
              boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)',
            }}
            labelStyle={{ color: ttText, fontWeight: 600 }}
          />
          <Legend iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px', color: tick }} />
          <Bar dataKey="energy" name="Energy (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="water"  name="Water (gal)"  fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="co2"    name="CO₂ (kg)"     fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BuildingBarChart;