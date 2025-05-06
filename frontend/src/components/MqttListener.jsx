// MqttListener.jsx
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

    /*     source.onmessage = (e) => {
      try {
        console.log('📡 SSE message received:', e.data);
        const {topic, msg} = JSON.parse(e.data);
        if (!e.data.trim()) return;

        setMsgs((prev) => [...prev, {topic, msg}]);
      } catch {
        console.warn('Malformed SSE data:', e.data);
      }
    }; */
    source.onmessage = (e) => {
      try {
        //console.log('📡 SSE message received:', e.data);
        let {topic, msg} = JSON.parse(e.data); // Parse topic and msg
        //if (!topic || !msg) return; // Ensure both topic and msg exist
        console.log(msg);
        console.log(topic);

        setMsgs((prev) => [...prev, {topic, msg}]); // Store topic and msg
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
            <strong>{m.topic}</strong>: {m.msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
