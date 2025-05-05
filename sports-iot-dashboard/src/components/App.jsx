// App.jsx
import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import Toggle from './Toggle';
import HeartGauge from './HeartGauge';
import LineChart from './LineChart';

const GNSS_TOPIC = 'sensors/gnss';
const HR_TOPIC = 'sensors/hr';
const ECG_TOPIC = 'sensors/ecg';
const IMU_TOPIC = 'sensors/imu';

export default function App() {
  const [gnss, setGnss] = useState({lat: null, lon: null});
  const [hr, setHr] = useState(0);
  const [ecgData, setEcgData] = useState([]);
  const [imuData, setImuData] = useState({acc: [], gyro: [], mag: []});
  const [toggles, setToggles] = useState({
    gnss: true,
    map: true,
    hr: true,
    ecg: true,
    imu: true,
  });
  const [active, setActive] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const src = new EventSource('http://localhost:3001/events');
    src.onmessage = (e) => {
      const {topic, payload} = JSON.parse(e.data);
      switch (topic) {
        case GNSS_TOPIC:
          setGnss({lat: +payload.Latitude, lon: +payload.Longitude});
          break;
        case HR_TOPIC:
          setHr(Math.round(payload.average));
          break;
        case ECG_TOPIC:
          setEcgData((prev) => [...prev.slice(-100), ...payload.Samples]);
          break;
        case IMU_TOPIC:
          setImuData((prev) => ({
            acc: [...prev.acc.slice(-200), ...payload.ArrayAcc],
            gyro: [...prev.gyro.slice(-200), ...payload.ArrayGyro],
            mag: [...prev.mag.slice(-200), ...payload.ArrayMagn],
          }));
          break;
        default:
      }
    };
    return () => src.close();
  }, []);

  const toggle = (key) => setToggles((t) => ({...t, [key]: !t[key]}));

  return (
    <div className="dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>SPORTS IoT</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {[
              {name: 'Overview', icon: '🏠', to: '/overview'},
              {name: 'Players', icon: '👥', to: '/players'},
              {name: 'Plan', icon: '📋', to: '/plan'},
              {name: 'Goals', icon: '🎯', to: '/goals'},
              {name: 'Progress', icon: '📊', to: '/progress'},
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.to}
                  className={active === item.name ? 'active' : ''}
                  onClick={() => setActive(item.name)}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            ☰
          </button>
          <h1>Dashboard</h1>
        </header>
        <div className="content-wrapper">
          <main className="content-grid">
            {/* GNSS */}
            <div className="col-span-4 card card-gnss">
              <div className="card-header">
                <h3>GNSS Position</h3>
                <Toggle
                  checked={toggles.gnss}
                  onChange={() => toggle('gnss')}
                />
              </div>
              {toggles.gnss && gnss.lat !== null ? (
                <>
                  <p>Lat: {gnss.lat.toFixed(6)}</p>
                  <p>Lon: {gnss.lon.toFixed(6)}</p>
                </>
              ) : (
                <p>No data</p>
              )}
            </div>

            {/* Map */}
            <div className="col-span-4 card card-map">
              <div className="card-header">
                <h3>Map</h3>
                <Toggle checked={toggles.map} onChange={() => toggle('map')} />
              </div>
              {toggles.map && gnss.lat !== null && (
                <MapContainer
                  center={[gnss.lat, gnss.lon]}
                  zoom={15}
                  className="map-container"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[gnss.lat, gnss.lon]} />
                </MapContainer>
              )}
            </div>

            {/* Heart Rate */}
            <div className="col-span-4 card card-hr">
              <div className="card-header">
                <h3>Heart Rate</h3>
                <Toggle checked={toggles.hr} onChange={() => toggle('hr')} />
              </div>
              {toggles.hr ? (
                <HeartGauge value={hr} min={40} max={180} />
              ) : (
                <p>No data</p>
              )}
            </div>

            {/* Accelerometer */}
            <div className="col-span-6 card card-accelerometer">
              <div className="card-header">
                <h3>Accelerometer</h3>
                <Toggle checked={toggles.imu} onChange={() => toggle('imu')} />
              </div>
              {toggles.imu ? <LineChart data={imuData.acc} /> : <p>No data</p>}
            </div>

            {/* Gyroscope */}
            <div className="col-span-6 card card-gyroscope">
              <div className="card-header">
                <h3>Gyroscope</h3>
                <Toggle checked={toggles.imu} onChange={() => toggle('imu')} />
              </div>
              {toggles.imu ? <LineChart data={imuData.gyro} /> : <p>No data</p>}
            </div>

            {/* ECG */}
            <div className="col-span-12 card card-ecg">
              <div className="card-header">
                <h3>ECG</h3>
                <Toggle checked={toggles.ecg} onChange={() => toggle('ecg')} />
              </div>
              {toggles.ecg ? <LineChart data={ecgData} /> : <p>No data</p>}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
