// HeartGauge.jsx
import React from 'react';

export default function HeartGauge({value, min, max}) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = pct * 180;
  const r = 50;
  const dash = (angle / 180) * Math.PI * r;
  return (
    <svg width={120} height={60} viewBox="0 0 120 60">
      <path
        d={`M10 50 A${r} ${r} 0 0 1 110 50`}
        fill="none"
        stroke="#eee"
        strokeWidth="10"
      />
      <path
        d={`M10 50 A${r} ${r} 0 0 1 110 50`}
        fill="none"
        stroke="orange"
        strokeWidth="10"
        strokeDasharray={`${dash} 1000`}
      />
      <text x="60" y="40" textAnchor="middle" fontSize="20">
        {value} bpm
      </text>
    </svg>
  );
}
