// bridge.js
// npm install express mqtt cors

const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const MQTT_CONFIG = {
  host: '51.21.239.39',
  port: 1883,
  username: 'iotuser',
  password: 'iotuser2025',
};

const app = express();
app.use(cors()); // allow requests from your React dev server

// Keep track of open SSE connections
let clients = [];

app.get('/events', (req, res) => {
  // SSE headers
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  // add this response to our clients list
  clients.push(res);

  req.on('close', () => {
    // remove when client disconnects
    clients = clients.filter((c) => c !== res);
  });
});

const mqttClient = mqtt.connect({
  host: MQTT_CONFIG.host,
  port: MQTT_CONFIG.port,
  username: MQTT_CONFIG.username,
  password: MQTT_CONFIG.password,
});

mqttClient.on('connect', () => {
  console.log('✅ MQTT connected');
  mqttClient.subscribe('sensors/gnss', {qos: 0}, (err) => {
    if (err) console.error('❌ MQTT subscribe failed', err);
    else console.log('📡 Subscribed to sensors/gnss');
  });
});
mqttClient.on('connect', () => {
  console.log('✅ MQTT connected');
  mqttClient.subscribe('sensors/hr', {qos: 0}, (err) => {
    if (err) console.error('❌ MQTT subscribe failed', err);
    else console.log('📡 Subscribed to sensors/hr');
  });
});
mqttClient.on('connect', () => {
  console.log('✅ MQTT connected');
  mqttClient.subscribe('sensors/ecg', {qos: 0}, (err) => {
    if (err) console.error('❌ MQTT subscribe failed', err);
    else console.log('📡 Subscribed to sensors/ecg');
  });
});
mqttClient.on('connect', () => {
  console.log('✅ MQTT connected');
  mqttClient.subscribe('sensors/imu', {qos: 0}, (err) => {
    if (err) console.error('❌ MQTT subscribe failed', err);
    else console.log('📡 Subscribed to sensors/imu');
  });
});
mqttClient.on('message', (topic, payload) => {
  const msg = payload.toString();
  const data = JSON.stringify({topic, msg});

  // broadcast to every SSE client
  clients.forEach((res) => {
    res.write(`data: ${data}\n\n`);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🛰️  SSE bridge running on http://localhost:${PORT}/events`);
});
