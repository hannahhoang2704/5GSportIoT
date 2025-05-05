// src/components/Dashboard.jsx
import React, {useState, useEffect} from 'react';
import LiveSensorChart from './LiveSensorChart';

import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Dashboard() {
  const [visible, setVisible] = useState({
    gnss: true,
    map: true,
    hr: true,
    accel: true,
    gyro: true,
    ecg: true,
  });

  const toggle = (key) => setVisible((prev) => ({...prev, [key]: !prev[key]}));

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'auto auto auto',
    gap: '16px',
    padding: '16px',
  };
  const cardBase = {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '16px',
    position: 'relative',
  };
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  };

  // assign border colors
  const borders = {
    gnss: '#1E90FF', // blue
    map: '#28a745', // green
    hr: '#dc3545', // red
    accel: '#fd7e14', // orange
    gyro: '#6f42c1', // purple
    ecg: '#e83e8c', // pink
  };

  return (
    <div style={gridStyle}>
      {/* GNSS Position */}
      <div
        style={{
          ...cardBase,
          border: `2px solid ${borders.gnss}`,
          gridColumn: '1 / 2',
          gridRow: 1,
        }}
      >
        <div style={headerStyle}>
          <h3>GNSS Position</h3>
          <input
            type="checkbox"
            checked={visible.gnss}
            onChange={() => toggle('gnss')}
          />
        </div>
        {visible.gnss ? <GNSSWidget /> : <p>No data</p>}
      </div>

      {/* Map */}
      <div
        style={{
          ...cardBase,
          border: `2px solid ${borders.map}`,
          gridColumn: '2 / 3',
          gridRow: 1,
        }}
      >
        <div style={headerStyle}>
          <h3>Map</h3>
          <input
            type="checkbox"
            checked={visible.map}
            onChange={() => toggle('map')}
          />
        </div>
        {visible.map ? <MapWidget /> : <p>No data</p>}
      </div>

      {/* Heart Rate */}
      <div
        style={{
          ...cardBase,
          border: `2px solid ${borders.hr}`,
          gridColumn: '3 / 4',
          gridRow: 1,
        }}
      >
        <div style={headerStyle}>
          <h3>Heart Rate</h3>
          <input
            type="checkbox"
            checked={visible.hr}
            onChange={() => toggle('hr')}
          />
        </div>
        {visible.hr ? (
          <LiveSensorChart topic="sensors/hr" label="Heart Rate (bpm)" />
        ) : (
          <p>No data</p>
        )}
      </div>

      {/* Accelerometer */}
      <div
        style={{
          ...cardBase,
          border: `2px solid ${borders.accel}`,
          gridColumn: '1 / 2',
          gridRow: 2,
        }}
      >
        <div style={headerStyle}>
          <h3>Accelerometer</h3>
          <input
            type="checkbox"
            checked={visible.accel}
            onChange={() => toggle('accel')}
          />
        </div>
        {visible.accel ? (
          <LiveSensorChart topic="sensors/imu" label="Accelerometer (X-axis)" />
        ) : (
          <p>No data</p>
        )}
      </div>

      {/* Gyroscope */}
      <div
        style={{
          ...cardBase,
          border: `2px solid ${borders.gyro}`,
          gridColumn: '2 / 3',
          gridRow: 2,
        }}
      >
        <div style={headerStyle}>
          <h3>Gyroscope</h3>
          <input
            type="checkbox"
            checked={visible.gyro}
            onChange={() => toggle('gyro')}
          />
        </div>
        {visible.gyro ? (
          <LiveSensorChart topic="sensors/imu" label="Gyroscope (X-axis)" />
        ) : (
          <p>No data</p>
        )}
      </div>

      {/* ECG */}
      <div
        style={{
          ...cardBase,
          border: `2px solid ${borders.ecg}`,
          gridColumn: '1 / 4',
          gridRow: 3,
        }}
      >
        <div style={headerStyle}>
          <h3>ECG</h3>
          <input
            type="checkbox"
            checked={visible.ecg}
            onChange={() => toggle('ecg')}
          />
        </div>
        {visible.ecg ? <ECGWidget /> : <p>No data</p>}
      </div>
    </div>
  );
}

// GNSS latest position
function GNSSWidget() {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    const src = new EventSource('http://localhost:3001/events');
    src.onmessage = (e) => {
      try {
        const {topic, payload} = JSON.parse(e.data);
        if (topic === 'sensors/gnss') {
          setPos({
            lat: payload.Latitude,
            lng: payload.Longitude,
          });
        }
      } catch {}
    };
    return () => src.close();
  }, []);

  return pos ? (
    <div>
      <strong>Lat:</strong> {pos.lat.toFixed(6)}
      <br />
      <strong>Lng:</strong> {pos.lng.toFixed(6)}
    </div>
  ) : (
    <p>No data</p>
  );
}

// Map showing GNSS marker
function MapWidget() {
  const [pos, setPos] = useState({lat: 0, lng: 0});
  useEffect(() => {
    const src = new EventSource('http://localhost:3001/events');
    src.onmessage = (e) => {
      try {
        const {topic, payload} = JSON.parse(e.data);
        if (topic === 'sensors/gnss') {
          setPos({lat: payload.Latitude, lng: payload.Longitude});
        }
      } catch {}
    };
    return () => src.close();
  }, []);

  return (
    <MapContainer
      center={[pos.lat, pos.lng]}
      zoom={13}
      style={{height: '150px', width: '100%'}}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[pos.lat, pos.lng]}>
        <Popup>
          {`Lat: ${pos.lat.toFixed(6)}, Lng: ${pos.lng.toFixed(6)}`}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

// Simple ECG sample list (first 50 values)
function ECGWidget() {
  const [samples, setSamples] = useState([]);
  useEffect(() => {
    const src = new EventSource('http://localhost:3001/events');
    src.onmessage = (e) => {
      try {
        const {topic, payload} = JSON.parse(e.data);
        if (topic === 'sensors/ecg') {
          setSamples(payload.Samples || []);
        }
      } catch {}
    };
    return () => src.close();
  }, []);

  return samples.length ? (
    <ul style={{maxHeight: 100, overflowY: 'auto', fontSize: '0.8em'}}>
      {samples.slice(0, 50).map((v, i) => (
        <li key={i}>{v}</li>
      ))}
    </ul>
  ) : (
    <p>No data</p>
  );
}
export function useLiveSensorData(topicFilter, maxPoints = 100) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const source = new EventSource('http://localhost:3001/events');

    source.onmessage = (e) => {
      let parsed;
      try {
        parsed = JSON.parse(e.data);
      } catch (err) {
        console.warn('Malformed SSE data:', e.data);
        return;
      }
      const {topic, payload} = parsed;
      if (topic !== topicFilter) return;
      if (!payload || typeof payload !== 'object') {
        console.warn(`No valid payload for topic ${topic}`);
        return;
      }

      // Determine the timestamp (fallback to Timestamp_UTC or now)
      const rawTime =
        payload.Timestamp_ms ?? payload.Timestamp_UTC ?? Date.now();
      const time = new Date(rawTime);

      // Determine the data value (customize per topic)
      let value = NaN;
      if (topic === 'sensors/hr' && typeof payload.average === 'number') {
        value = payload.average;
      } else if (
        topic === 'sensors/imu' &&
        Array.isArray(payload.ArrayAcc) &&
        payload.ArrayAcc.length
      ) {
        value = payload.ArrayAcc[0].x ?? NaN;
      } else if (topic === 'sensors/ecg' && Array.isArray(payload.Samples)) {
        // simple: take the first sample
        value = payload.Samples[0] ?? NaN;
      } else if (topic === 'sensors/gnss' && payload.Latitude != null) {
        // numeric latitude as a placeholder value
        value = payload.Latitude;
      }

      setData((prev) => {
        const next = [...prev, {time, value}];
        return next.length > maxPoints
          ? next.slice(next.length - maxPoints)
          : next;
      });
    };

    source.onerror = (err) => {
      console.error('SSE error:', err);
      source.close();
    };

    return () => {
      source.close();
    };
  }, [topicFilter, maxPoints]);

  return data;
}
