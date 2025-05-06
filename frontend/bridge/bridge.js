// bridge.js
// npm install express mqtt cors

const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const MQTT_CONFIG = {
  host: '05407e9daee343cf9fe6245e755cb1be.s1.eu.hivemq.cloud',
  port: '8883', //1883,
  protocol: 'mqtts',
  username: 'Movesense', //'iotuser',
  password: 'Movesense12', //'iotuser2025',
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

const mqttClient = mqtt.connect(MQTT_CONFIG);

mqttClient.on('connect', () => {
  console.log('✅ MQTT connected');
  /* mqttClient.subscribe('sensors/gnss', {qos: 0}, (err) => {
    if (err) console.error('❌ MQTT subscribe failed', err);
    else console.log('📡 Subscribed to sensors/gnss');
  }); */
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT connection error', err);
});

mqttClient.on('message', (topic, payload) => {
  const msg = payload.toString();
  console.log('data received:', topic, msg);
  /* const data = JSON.stringify({topic, msg}); */

  // broadcast to every SSE client
  clients.forEach((res) => {
    res.topic = topic;
    res.payload = msg;
    //res.write(`data: ${msg}\n\n`);
    res.write(`data: ${JSON.stringify({topic, msg})}\n\n`);
    //res.write(`data: ${msg}\n\n`);
  });
});

mqttClient.subscribe('sensors/gnss');
mqttClient.subscribe('sensors/hr');
mqttClient.subscribe('sensors/ecg');
mqttClient.subscribe('sensors/imu');

/*mqttClient.on('connect', () => {
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
}); */
/* mqttClient.on('message', (topic, payload) => {
  const msg = payload.toString();
  console.log('data received:', topic, msg);
  const data = JSON.stringify({topic, msg});

  // broadcast to every SSE client
  clients.forEach((res) => {
    res.write(`data: ${data}\n\n`);
  });
}); */

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🛰️  SSE bridge running on http://localhost:${PORT}/events`);
});
