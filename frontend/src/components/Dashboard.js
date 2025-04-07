// src/components/Dashboard.js
import React from 'react';
import Card from './Card';
import HealthMonitoring from './HealthMonitoring';

function Dashboard({selectedPlayer}) {
  return (
    <div className="dashboard">
      <div className="cards-row">
        <Card title="Player Profile">
          <img
            src={selectedPlayer.profilePicture}
            alt={`${selectedPlayer.name} profile`}
            style={{
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              objectFit: 'cover',
            }}
          />
          <p>{selectedPlayer.name}</p>
        </Card>
        <Card title="Calories">
          <h2>{selectedPlayer.calories} kcal</h2>
        </Card>
        <Card title="Position">
          <p>{selectedPlayer.position}</p>
        </Card>
      </div>
      <HealthMonitoring healthData={selectedPlayer.healthData} />
    </div>
  );
}

export default Dashboard;
