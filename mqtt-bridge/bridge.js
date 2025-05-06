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
  const express = require('express');
  const mqtt = require('mqtt');
  const cors = require('cors');

  // Configuration
  const MQTT_CONFIG = {
    host: '51.21.239.39',
    port: 1883,
    username: 'iotuser',
    password: 'iotuser2025',
    reconnectPeriod: 5000, // Reconnect every 5 seconds if connection fails
  };

  const TOPICS = ['sensors/gnss', 'sensors/hr', 'sensors/ecg', 'sensors/imu'];

  // Initialize Express app
  const app = express();
  app.use(cors());
  app.use(express.json());

  // SSE Clients management
  let clients = new Set();

  // Helper function to normalize sensor data
  const normalizeSensorData = (payload) => {
    try {
      // Handle different payload formats
      if (typeof payload === 'string') {
        // Try to parse stringified JSON
        try {
          payload = JSON.parse(payload);
        } catch {
          // Handle custom string format (like your ArrayAcc format)
          const fixed = payload
            .replace(/'/g, '"')
            .replace(/(\w+):/g, '"$1":')
            .replace(/\*Y/g, '"Y"')
            .replace(/Y"/g, '"Y"')
            .replace(/\*:/g, '"Z":');
          payload = JSON.parse(fixed);
        }
      }

      // Ensure IMU data has proper structure
      if (payload.ArrayAcc && !Array.isArray(payload.ArrayAcc)) {
        payload.ArrayAcc = [[0, 0, 0]];
      }
      if (payload.ArrayGyro && !Array.isArray(payload.ArrayGyro)) {
        payload.ArrayGyro = [[0, 0, 0]];
      }
      if (payload.ArrayMag && !Array.isArray(payload.ArrayMag)) {
        payload.ArrayMag = [[0, 0, 0]];
      }

      return payload;
    } catch (error) {
      console.error('Normalization error:', error);
      return {error: 'Data normalization failed', raw: payload};
    }
  };

  // SSE Endpoint
  app.get('/events', (req, res) => {
    console.log('New SSE client connected');

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.flushHeaders();

    // Send initial connection message
    res.write('event: connection\ndata: Connected\n\n');

    // Add client to tracking set
    clients.add(res);

    // Remove client when connection closes
    req.on('close', () => {
      console.log('SSE client disconnected');
      clients.delete(res);
      res.end();
    });
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      clients: clients.size,
      mqttConnected: mqttClient.connected,
    });
  });

  // Initialize MQTT Client
  const mqttClient = mqtt.connect(MQTT_CONFIG);

  // MQTT Connection handlers
  mqttClient.on('connect', () => {
    console.log('✅ MQTT connected to broker');

    // Subscribe to topics
    TOPICS.forEach((topic) => {
      mqttClient.subscribe(topic, {qos: 0}, (err) => {
        if (err) {
          console.error(`❌ Subscription failed for ${topic}:`, err);
        } else {
          console.log(`📡 Subscribed to ${topic}`);
        }
      });
    });
  });

  mqttClient.on('error', (err) => {
    console.error('MQTT error:', err);
  });

  mqttClient.on('reconnect', () => {
    console.log('Attempting MQTT reconnection...');
  });

  mqttClient.on('offline', () => {
    console.log('MQTT connection lost');
  });

  // Message handler
  mqttClient.on('message', (topic, message) => {
    try {
      console.log(`Received MQTT message on ${topic}`);

      let payload;
      try {
        payload = JSON.parse(message.toString());
      } catch {
        payload = message.toString();
      }

      // Normalize the payload
      const normalizedPayload = normalizeSensorData(payload);

      const eventData = JSON.stringify({
        topic,
        payload: normalizedPayload,
        timestamp: new Date().toISOString(),
      });

      // Broadcast to all SSE clients
      clients.forEach((client) => {
        try {
          client.write(`data: ${eventData}\n\n`);
        } catch (err) {
          console.error('Error writing to client:', err);
          clients.delete(client);
        }
      });
    } catch (err) {
      console.error('Error processing MQTT message:', err);
    }
  });

  // Cleanup on server close
  process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    mqttClient.end();
    clients.forEach((client) => client.end());
    process.exit();
  });

  // Start server
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 SSE bridge running on port ${PORT}`);
    console.log(
      `🔌 Connecting to MQTT broker at ${MQTT_CONFIG.host}:${MQTT_CONFIG.port}`
    );
  });
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
  try {
    const raw = buf.toString();
    let payload;

    try {
      // First try to parse as JSON
      payload = JSON.parse(raw);
    } catch {
      // If not JSON, handle custom format
      try {
        const fixed = raw
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":')
          .replace(/\*Y/g, 'Y')
          .replace(/Y"/g, 'Y')
          .replace(/\*:/g, 'Z:');
        payload = JSON.parse(fixed);
      } catch (e) {
        payload = {raw, error: `Failed to parse: ${e.message}`};
      }
    }

    const data = JSON.stringify({
      topic,
      payload,
      timestamp: new Date().toISOString(),
    });

    clients.forEach((res) => res.write(`data: ${data}\n\n`));
  } catch (err) {
    console.error('Error processing message:', err);
  }
});

app.listen(3001, () => console.log('🚀 SSE bridge listening on 3001'));
