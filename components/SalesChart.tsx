import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data: { name: string; revenue: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <Tooltip
          cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderRadius: '0.5rem',
            border: '1px solid #374151',
            color: '#e5e7eb'
          }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar dataKey="revenue" fill="#22c55e" name="Revenue" barSize={30} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;