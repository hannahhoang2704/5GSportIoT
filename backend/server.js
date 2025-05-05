// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());

app.get('/api/sensor-data', (req, res) => {
  // ← replace this with your real live data
  const sample = {
    Pico_ID: 'e66130100f8c9928',
    Movesense_series: '174630000192',
    Timestamp_ms: 28166,
    Timestamp_UTC: 1609460451,
    ArrayAcc: [
      {z: 9.653, y: -1.443, x: -0.785},
      {z: 9.634, y: -1.426, x: -0.823},
      {z: 9.672, y: -1.457, x: -0.85},
    ],
    ArrayGyro: [
      {z: 1.68, y: -3.01, x: 0.35},
      {z: 1.82, y: -3.36, x: 0.56},
      {z: 1.75, y: -3.36, x: 0.49},
    ],
    ArrayMagn: [
      {z: 104.4, y: 103.65, x: -0.15},
      {z: 105.0, y: 104.25, x: 3.15},
      {z: 103.8, y: 104.85, x: 4.65},
    ],
  };
  res.json(sample);
});

app.listen(port, () => {
  console.log(`Sensor API → http://localhost:${port}/api/sensor-data`);
});
