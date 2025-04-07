// src/App.js
import React, {useState} from 'react';
import Sidebar from './components/Sidebar';
import PlayerPanel from './components/PlayerPanel';
import Dashboard from './components/Dashboard';
import './styles.css';

function App() {
  const players = [
    {
      id: 1,
      name: 'Matti',
      profilePicture: 'https://via.placeholder.com/100?text=Matti',
      calories: 2000,
      position: 'Forward',
      healthData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        stressLevel: [30, 40, 35, 50, 45],
        pulse: [70, 72, 68, 75, 73],
        temperature: [36.5, 36.6, 36.4, 36.7, 36.5],
        caloriesBurned: [200, 220, 210, 230, 205],
      },
      sensorData: {
        positioning: {x: 12.34, y: 56.78},
        accelerometer: {x: [0.1, 0.2], y: [0.15, 0.25], z: [0.2, 0.3]},
        gyroscope: {x: [1.1, 1.2], y: [1.15, 1.25], z: [1.2, 1.3]},
        magnetometer: {x: [0.5, 0.6], y: [0.55, 0.65], z: [0.6, 0.7]},
        HR: 72,
        ecg: [0.1, 0.15, 0.2, 0.18, 0.16, 0.14],
      },
    },
    {
      id: 2,
      name: 'Niko',
      profilePicture: 'https://via.placeholder.com/100?text=Niko',
      calories: 1800,
      position: 'Midfielder',
      healthData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        stressLevel: [25, 35, 40, 45, 38],
        pulse: [68, 70, 66, 72, 70],
        temperature: [36.4, 36.5, 36.3, 36.6, 36.4],
        caloriesBurned: [210, 230, 220, 240, 215],
      },
      sensorData: {
        positioning: {x: 22.1, y: 44.32},
        accelerometer: {x: [0.12, 0.22], y: [0.17, 0.27], z: [0.21, 0.31]},
        gyroscope: {x: [1.0, 1.1], y: [1.05, 1.15], z: [1.1, 1.2]},
        magnetometer: {x: [0.55, 0.65], y: [0.6, 0.7], z: [0.65, 0.75]},
        HR: 75,
        ecg: [0.12, 0.18, 0.22, 0.2, 0.17, 0.15],
      },
    },
    {
      id: 3,
      name: 'John',
      profilePicture: 'https://via.placeholder.com/100?text=John',
      calories: 1900,
      position: 'Defender',
      healthData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        stressLevel: [28, 38, 33, 48, 42],
        pulse: [69, 71, 67, 74, 72],
        temperature: [36.5, 36.5, 36.4, 36.8, 36.6],
        caloriesBurned: [205, 225, 215, 235, 210],
      },
      sensorData: {
        positioning: {x: 33.33, y: 77.77},
        accelerometer: {x: [0.14, 0.24], y: [0.19, 0.29], z: [0.23, 0.33]},
        gyroscope: {x: [1.2, 1.3], y: [1.25, 1.35], z: [1.3, 1.4]},
        magnetometer: {x: [0.6, 0.7], y: [0.65, 0.75], z: [0.7, 0.8]},
        HR: 68,
        ecg: [0.11, 0.16, 0.21, 0.19, 0.18, 0.17],
      },
    },
    {
      id: 4,
      name: 'Mike',
      profilePicture: 'https://via.placeholder.com/100?text=Mike',
      calories: 1700,
      position: 'Goalkeeper',
      healthData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        stressLevel: [32, 42, 37, 52, 47],
        pulse: [71, 73, 69, 76, 74],
        temperature: [36.6, 36.7, 36.5, 36.9, 36.7],
        caloriesBurned: [190, 210, 200, 220, 195],
      },
      sensorData: {
        positioning: {x: 44.44, y: 88.88},
        accelerometer: {x: [0.16, 0.26], y: [0.21, 0.31], z: [0.26, 0.36]},
        gyroscope: {x: [1.3, 1.4], y: [1.35, 1.45], z: [1.4, 1.5]},
        magnetometer: {x: [0.65, 0.75], y: [0.7, 0.8], z: [0.75, 0.85]},
        HR: 80,
        ecg: [0.13, 0.19, 0.23, 0.21, 0.2, 0.18],
      },
    },
  ];

  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0].id);
  const selectedPlayer = players.find(
    (player) => player.id === selectedPlayerId
  );

  const handleSelectPlayer = (id) => {
    setSelectedPlayerId(id);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1>Overview</h1>
        </header>
        <div className="content-section">
          <PlayerPanel
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={handleSelectPlayer}
          />
          <Dashboard selectedPlayer={selectedPlayer} />
        </div>
      </div>
    </div>
  );
}

export default App;
