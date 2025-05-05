// src/components/MqttListener.jsx
import React, {useState, useEffect} from 'react';

export default function MqttListener() {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const source = new EventSource('http://localhost:3001/events');

    source.onopen = () => console.log('🛰️ SSE connection opened');
    source.onerror = (e) => {
      console.error('⚠️ SSE error', e);
      source.close();
    };

    source.onmessage = (e) => {
      try {
        // Bridge now sends { topic, payload }
        const {topic, payload} = JSON.parse(e.data);
        setMsgs((prev) => [
          ...prev,
          {
            topic,
            data: payload,
            receivedAt: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (err) {
        console.warn('Malformed SSE data:', e.data);
      }
    };

    return () => {
      source.close();
      console.log('🛑 SSE connection closed');
    };
  }, []);

  return (
    <div>
      <h3>Live MQTT Messages</h3>
      <ul>
        {msgs.map((m, i) => (
          <li key={i}>
            <strong>{m.topic}</strong> @ {m.receivedAt}:
            <pre style={{fontSize: '0.8em'}}>
              {JSON.stringify(m.data, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
