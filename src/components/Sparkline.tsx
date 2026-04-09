/**
 * Mini inline sparkline rendered inside KPI cards.
 * Purely decorative — aria-hidden on the parent wrapper in KPICard.
 */
import React from 'react';
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TimeSeriesPoint } from '../types';

interface SparklineProps {
  data:    TimeSeriesPoint[];
  dataKey: keyof Pick<TimeSeriesPoint, 'energy' | 'water' | 'co2'>;
  color:   string;
}

const Sparkline: React.FC<SparklineProps> = ({ data, dataKey, color }) => {
  // Compute mean to draw a reference line
  const values = data.map(d => d[dataKey] as number);
  const mean   = values.reduce((s, v) => s + v, 0) / (values.length || 1);

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        {/* Dashed mean reference line */}
        <ReferenceLine
          y={mean}
          stroke={color}
          strokeDasharray="3 3"
          strokeOpacity={0.35}
          strokeWidth={1}
        />
        <Line
          type="monotone"
          dataKey={dataKey as string}
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;