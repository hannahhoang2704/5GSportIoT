import React from 'react';

import MqttListener from './components/MqttListener';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app-container">
      {/* Heart Rate chart */}

      <Dashboard />
      <MqttListener />
    </div>
  );
}

export default App;
