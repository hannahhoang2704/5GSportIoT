// bridge.js
const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const MQTT_CONFIG = {
  host: '51.21.239.39',
  port: 1883,
  username: 'iotuser',
  password: 'iotuser2025',
};

const TOPICS = ['sensors/gnss', 'sensors/hr', 'sensors/ecg', 'sensors/imu'];

const app = express();
app.use(cors());

let clients = [];
app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
  clients.push(res);
  req.on('close', () => {
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
  TOPICS.forEach((topic) => {
    mqttClient.subscribe(topic, {qos: 0}, (err) => {
      if (err) console.error(`❌ Subscribe failed [${topic}]`, err);
      else console.log(`📡 Subscribed to ${topic}`);
    });
  });
});

mqttClient.on('message', (topic, buf) => {
  let payload;
  const raw = buf.toString();
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = raw;
  }
  const data = JSON.stringify({topic, payload});
  clients.forEach((res) => res.write(`data: ${data}\n\n`));
});

app.listen(3001, () => console.log('🚀 SSE bridge listening on 3001'));
