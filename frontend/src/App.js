import React from 'react';
import LiveSensorChart from './components/LiveSensorChart';
import MqttListener from './components/MqttListener';

function App() {
  return (
    <div className="app-container">
      {/* Heart Rate chart */}
      <LiveSensorChart topic="sensors/hr" label="Heart Rate (bpm)" />
      <MqttListener />
    </div>
  );
}

export default App;
