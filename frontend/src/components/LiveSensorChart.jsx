import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useLiveSensorData from '../hooks/useLiveSensorData';

export default function LiveSensorChart({topic, label}) {
  const series = useLiveSensorData(topic);
  return (
    <div style={{width: '100%', height: 200}}>
      <h4>{label}</h4>
      <ResponsiveContainer>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(t) => new Date(t).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip labelFormatter={(t) => new Date(t).toLocaleTimeString()} />
          <Line dataKey="value" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
