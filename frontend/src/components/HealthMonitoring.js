// src/components/HealthMonitoring.js
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

function HealthMonitoring({healthData}) {
  const [selectedMetric, setSelectedMetric] = useState('stressLevel');

  const metricMapping = {
    stressLevel: 'Stress Level',
    pulse: 'Pulse',
    temperature: 'Temperature',
    caloriesBurned: 'Calories Burned',
  };

  const chartData = {
    labels: healthData.labels,
    datasets: [
      {
        label: metricMapping[selectedMetric],
        data: healthData[selectedMetric],
        borderColor: '#FF7F00',
        backgroundColor: 'rgba(255,127,0,0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {position: 'top'},
      title: {
        display: true,
        text: `${metricMapping[selectedMetric]} Over Time`,
      },
    },
  };

  return (
    <div className="health-monitoring">
      <h2>Health Monitoring</h2>
      <div className="tabs">
        <span
          className={selectedMetric === 'stressLevel' ? 'active' : ''}
          onClick={() => setSelectedMetric('stressLevel')}
          style={{cursor: 'pointer'}}
        >
          Stress level
        </span>
        <span
          className={selectedMetric === 'pulse' ? 'active' : ''}
          onClick={() => setSelectedMetric('pulse')}
          style={{cursor: 'pointer'}}
        >
          Pulse
        </span>
        <span
          className={selectedMetric === 'temperature' ? 'active' : ''}
          onClick={() => setSelectedMetric('temperature')}
          style={{cursor: 'pointer'}}
        >
          Temperature
        </span>
        <span
          className={selectedMetric === 'caloriesBurned' ? 'active' : ''}
          onClick={() => setSelectedMetric('caloriesBurned')}
          style={{cursor: 'pointer'}}
        >
          Calories burned
        </span>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default HealthMonitoring;
