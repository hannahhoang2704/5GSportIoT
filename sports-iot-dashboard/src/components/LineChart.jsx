// LineChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RC,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function LineChart({data}) {
  const series = data.map((pt, i) => ({
    index: i,
    x: pt.x ?? pt[0] ?? 0,
    y: pt.y ?? pt[1] ?? 0,
    z: pt.z ?? pt[2] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RC data={series}>
        <XAxis dataKey="index" hide />
        <YAxis hide />
        <Tooltip />
        <Line dataKey="x" dot={false} stroke="#8884d8" />
        <Line dataKey="y" dot={false} stroke="#82ca9d" />
        <Line dataKey="z" dot={false} stroke="#ffc658" />
      </RC>
    </ResponsiveContainer>
  );
}
