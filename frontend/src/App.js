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
    },
  ];

  // Set the initially selected player
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
