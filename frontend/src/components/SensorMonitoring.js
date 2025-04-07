// src/components/SensorMonitoring.js
import React, {useState} from 'react';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorMonitoring({sensorData}) {
  const [selectedSensor, setSelectedSensor] = useState('Accelerometer');

  // Define sensor tabs and map them to keys in sensorData
  const sensorTabs = [
    'GPS',
    'Accelerometer',
    'Gyroscope',
    'Magnetometer',
    'HR',
    'ECG',
  ];

  let content;
  if (selectedSensor === 'GPS') {
    // Display GPS positioning as text
    const data = sensorData.positioning;
    content = (
      <div>
        <h3>Positioning Data</h3>
        <p>X: {data.x}</p>
        <p>Y: {data.y}</p>
      </div>
    );
  } else if (
    selectedSensor === 'Accelerometer' ||
    selectedSensor === 'Gyroscope' ||
    selectedSensor === 'Magnetometer'
  ) {
    // For these sensors, expect an object with arrays for x, y, and z (each with 2 samples)
    const key = selectedSensor.toLowerCase(); // "accelerometer", "gyroscope", or "magnetometer"
    const sensor = sensorData[key];
    const chartData = {
      labels: ['Sample 1', 'Sample 2'],
      datasets: [
        {
          label: 'X',
          data: sensor.x,
          borderColor: '#FF7F00',
          backgroundColor: 'rgba(255,127,0,0.2)',
          fill: false,
        },
        {
          label: 'Y',
          data: sensor.y,
          borderColor: '#007BFF',
          backgroundColor: 'rgba(0,123,255,0.2)',
          fill: false,
        },
        {
          label: 'Z',
          data: sensor.z,
          borderColor: '#28A745',
          backgroundColor: 'rgba(40,167,69,0.2)',
          fill: false,
        },
      ],
    };
    content = (
      <div>
        <h3>{selectedSensor} Data</h3>
        <Line data={chartData} />
      </div>
    );
  } else if (selectedSensor === 'HR') {
    // For heart rate, display the value
    content = (
      <div>
        <h3>Heart Rate</h3>
        <p>{sensorData.HR} bpm</p>
      </div>
    );
  } else if (selectedSensor === 'ECG') {
    // For ECG, plot a line chart of the ECG values
    const ecgData = sensorData.ecg;
    const chartData = {
      labels: ecgData.map((_, idx) => idx + 1),
      datasets: [
        {
          label: 'ECG',
          data: ecgData,
          borderColor: '#FF007F',
          backgroundColor: 'rgba(255,0,127,0.2)',
          fill: false,
        },
      ],
    };
    content = (
      <div>
        <h3>ECG Data</h3>
        <Line data={chartData} />
      </div>
    );
  }

  return (
    <div className="sensor-monitoring">
      <h2>Sensor Monitoring</h2>
      <div className="tabs">
        {sensorTabs.map((sensor) => (
          <span
            key={sensor}
            onClick={() => setSelectedSensor(sensor)}
            className={selectedSensor === sensor ? 'active' : ''}
            style={{cursor: 'pointer', marginRight: '1rem'}}
          >
            {sensor}
          </span>
        ))}
      </div>
      <div className="sensor-content">{content}</div>
    </div>
  );
}

export default SensorMonitoring;
