// src/contexts/MqttContext.js
import React, {createContext, useContext, useState, useEffect} from 'react';
// use the browser‐friendly build
import mqtt from 'mqtt/dist/mqtt.min';

const MqttContext = createContext({messages: {}});

export const MqttProvider = ({children}) => {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    // Build a full WSS URL, using HiveMQ Cloud’s default WS path of "/mqtt".
    const url = `05407e9daee343cf9fe6245e755cb1be.s1.eu.hivemq.cloud`;

    const client = mqtt.connect(url, {
      username: 'Movesense',
      password: 'Movesense12',
      port: 8883,
      // debug flags you can enable during dev:
      // protocolId: 'MQTT',
      // protocolVersion: 4,
    });

    client.on('connect', () => {
      console.log('✅ MQTT over WSS connected');
      // subscribe to all your sensor topics
      ['sensors/gnss', 'sensors/hr', 'sensors/ecg', 'sensors/imu'].forEach(
        (t) =>
          client.subscribe(t, (err) => {
            if (err) console.error(`❌ subscribe ${t}`, err);
          })
      );
    });

    client.on('error', (err) => {
      console.error('❌ MQTT error', err);
      client.end();
    });

    client.on('message', (topic, buffer) => {
      const msg = buffer.toString();
      console.log('📥', topic, msg);
      setMessages((prev) => ({...prev, [topic]: msg}));
    });

    return () => {
      client.end(true);
      console.log('🛑 MQTT client disconnected');
    };
  }, []);

  return (
    <MqttContext.Provider value={{messages}}>{children}</MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const ctx = useContext(MqttContext);
  if (!ctx) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return ctx;
};
