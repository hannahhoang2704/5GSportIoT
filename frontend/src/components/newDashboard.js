// src/pages/Dashboard.js
import React, {useMemo} from 'react';
import {useMqtt} from '../context/MqttContext';

export default function NewDashboard() {
  const {messages} = useMqtt();

  const SENSORS = [
    {topic: 'sensors/gnss', label: 'GNSS'},
    {topic: 'sensors/hr', label: 'Heart Rate'},
    {topic: 'sensors/ecg', label: 'ECG'},
    {topic: 'sensors/imu', label: 'IMU'},
  ];

  return (
    <div style={{padding: 20, fontFamily: 'sans-serif'}}>
      <h1>Live MQTT Dashboard</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}
      >
        {SENSORS.map(({topic, label}) => (
          <SensorCard key={topic} label={label} rawPayload={messages[topic]} />
        ))}
      </div>
    </div>
  );
}

function SensorCard({label, rawPayload}) {
  const display = useMemo(() => {
    if (!rawPayload) return 'No data yet';
    try {
      return JSON.stringify(JSON.parse(rawPayload), null, 2);
    } catch {
      return rawPayload;
    }
  }, [rawPayload]);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        background: '#fafafa',
        minHeight: 100,
      }}
    >
      <strong>{label}</strong>
      <pre
        style={{
          marginTop: 8,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {display}
      </pre>
    </div>
  );
}
