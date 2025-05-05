import {useState, useEffect} from 'react';

export default function useLiveSensorData(topicFilter, maxPoints = 100) {
  const [data, setData] = useState([]);
  useEffect(() => {
    const src = new EventSource('http://localhost:3001/events');
    src.onmessage = (e) => {
      const {topic, payload} = JSON.parse(e.data);
      if (topic === topicFilter) {
        const time = new Date(payload.Timestamp_ms || Date.now());
        // for HR use payload.average, else customize
        const value = Number(payload.average ?? NaN);
        setData((prev) => {
          const next = [...prev, {time, value}];
          return next.length > maxPoints ? next.slice(-maxPoints) : next;
        });
      }
    };
    return () => src.close();
  }, [topicFilter, maxPoints]);
  return data;
}
