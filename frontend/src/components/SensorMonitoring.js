import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
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
import './SensorMonitoring.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SensorMonitoring() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(false);
  const [rate, setRate] = useState(52);
  const [range, setRange] = useState(2);
  const [current, setCurrent] = useState({x: 0, y: 0, z: 0});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!active) return;
    const fetchSensor = () => {
      axios
        .get('http://localhost:3001/api/sensor-data')
        .then((res) => {
          const d = res.data;
          setData(d);
          const last = d.ArrayAcc[d.ArrayAcc.length - 1];
          setCurrent({x: last.x, y: last.y, z: last.z});
        })
        .catch((err) => setError(err.message));
    };
    fetchSensor();
    const interval = setInterval(fetchSensor, 1000);
    return () => clearInterval(interval);
  }, [active]);

  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;

  // Prepare chart data
  const chartData = data
    ? {
        labels: data.ArrayAcc.map((_, i) => i + 1),
        datasets: [
          {
            label: 'X',
            data: data.ArrayAcc.map((p) => p.x),
            borderColor: '#FF007F',
            fill: false,
          },
          {
            label: 'Y',
            data: data.ArrayAcc.map((p) => p.y),
            borderColor: '#007BFF',
            fill: false,
          },
          {
            label: 'Z',
            data: data.ArrayAcc.map((p) => p.z),
            borderColor: '#FF7F00',
            fill: false,
          },
        ],
      }
    : {labels: [], datasets: []};

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          boxWidth: 12,
          padding: 16,
          color: '#000',
          font: {size: 14, weight: 600},
        },
      },
    },
    scales: {
      x: {
        grid: {color: '#DDD', lineWidth: 1},
        ticks: {color: '#333', font: {size: 12}, padding: 8},
      },
      y: {
        grid: {color: '#DDD', lineWidth: 1},
        ticks: {color: '#333', font: {size: 12}, padding: 8},
      },
    },
  };

  return (
    <div className="sensor-monitoring">
      <div className="sensor-header">
        <h2>Linear Acceleration</h2>
        <label className="switch">
          <input
            type="checkbox"
            checked={active}
            onChange={() => setActive((a) => !a)}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="chart-wrapper">
        {data ? (
          <Line data={chartData} options={options} />
        ) : (
          <p style={{textAlign: 'center'}}>Turn sensor on to load data</p>
        )}
      </div>

      <div className="axis-values">
        <span className="axis x">x: {current.x.toFixed(2)}</span>
        <span className="axis y">y: {current.y.toFixed(2)}</span>
        <span className="axis z">z: {current.z.toFixed(2)}</span>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Rate</label>
          <Slider
            min={13}
            max={1666}
            step={null}
            marks={{
              13: '13',
              26: '26',
              52: '52',
              104: '104',
              208: '208',
              416: '416',
              833: '833',
              1666: '1666',
            }}
            value={rate}
            onChange={setRate}
            railStyle={{backgroundColor: '#EEE', height: 4}}
            trackStyle={{backgroundColor: '#FF007F', height: 4}}
            handleStyle={{
              borderColor: '#FF007F',
              height: 24,
              width: 24,
              marginTop: -10,
              backgroundColor: '#FF007F',
            }}
            dotStyle={{borderColor: '#CCC'}}
            activeDotStyle={{
              borderColor: '#FF007F',
              backgroundColor: '#FF007F',
            }}
          />
          <div className="rate-label">{rate} Hz</div>
        </div>

        <div className="control-group">
          <label>G-Range</label>
          <div className="range-options">
            {[2, 4, 8, 16].map((g) => (
              <button
                key={g}
                className={range === g ? 'active' : ''}
                onClick={() => setRange(g)}
              >
                {g}G
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
