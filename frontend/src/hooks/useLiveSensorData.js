// src/hooks/useLiveSensorData.js
import {useState, useEffect} from 'react';

/**
 * Custom hook to collect live sensor data via SSE and maintain a sliding window.
 *
 * @param {string} topicFilter - MQTT topic to filter (e.g. 'sensors/hr').
 * @param {number} maxPoints - Maximum data points to retain.
 * @returns {Array<{ time: Date, value: number }>} Recent data points.
 */
export default function useLiveSensorData(topicFilter, maxPoints = 100) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const source = new EventSource('http://localhost:3001/events');

    source.onmessage = (e) => {
      // ignore empty or keep-alive messages
      const raw = (e.data || '').trim();
      if (!raw) return;

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // skip non-JSON
        return;
      }

      const {topic, payload} = parsed;
      // skip if no topic or not matching
      if (typeof topic !== 'string' || topic !== topicFilter) return;
      if (!payload || typeof payload !== 'object') return;

      // derive timestamp
      const rawTime =
        payload.Timestamp_ms ?? payload.Timestamp_UTC ?? Date.now();
      const time = new Date(rawTime);

      // derive value based on topic
      let value = NaN;
      switch (topic) {
        case 'sensors/hr':
          if (typeof payload.average === 'number') value = payload.average;
          break;
        case 'sensors/imu':
          // example: accelerometer X
          value = payload.ArrayAcc?.[0]?.x ?? NaN;
          break;
        case 'sensors/ecg':
          value = Array.isArray(payload.Samples)
            ? payload.Samples[0] ?? NaN
            : NaN;
          break;
        case 'sensors/gnss':
          value = Number(payload.Latitude) || NaN;
          break;
        default:
          // Handle unexpected topics
          value = NaN;
          break;
      }

      setData((prev) => {
        const next = [...prev, {time, value}];
        return next.length > maxPoints
          ? next.slice(next.length - maxPoints)
          : next;
      });
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };
  }, [topicFilter, maxPoints]);

  return data;
}
