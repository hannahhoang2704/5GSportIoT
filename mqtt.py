import uasyncio as asyncio
from umqtt.robust import MQTTClient
from data_queue import ecg_queue, hr_queue, imu_queue, gnss_queue

_MQTT_SERVER = b'd3b9f848475f4921a1bd2e178274dc09.s1.eu.hivemq.cloud'
_MQTT_PORT = 8883
_MQTT_USERNAME = b'PicoW'
_MQTTT_PASSWORD = b'PicoW-123'
_MQTT_KEEPALIVE = 7200
_MQTT_SSL_PARAMS = {'server_hostname': _MQTT_SERVER}
_MQTT_CLIENT_ID = b'raspberrypi-picow'

IMU_TOPIC = "imu"
ECG_TOPIC = "ecg"
HR_TOPIC = "hr"
GNSS_TOPIC = "gnss"

async def connect_mqtt():
    try:
        print("Connecting MQTT broker...")
        mqtt_client = MQTTClient(client_id=_MQTT_CLIENT_ID,
                            server=_MQTT_SERVER, 
                            port=_MQTT_PORT, 
                            user=_MQTT_USERNAME, 
                            password=_MQTTT_PASSWORD,
                            keepalive=_MQTT_KEEPALIVE,
                            ssl=True,
                            ssl_params=_MQTT_SSL_PARAMS)
        mqtt_client.connect()
    except Exception as e:
        print(f"Error connecting to MQTT: {e}")
        return None
    print("MQTT broker connected")
    return mqtt_client

async def publish_to_mqtt(mqtt_client):
    """Task to publish data from queues to MQTT broker."""
    while True:
        if mqtt_client:
            if not imu_queue.is_empty():
                imu_data = imu_queue.dequeue()
                mqtt_client.publish(IMU_TOPIC, str(imu_data).encode())
            if not ecg_queue.is_empty():
                ecg_data = ecg_queue.dequeue()
                mqtt_client.publish(ECG_TOPIC, str(ecg_data).encode())
            if not hr_queue.is_empty():
                hr_data = hr_queue.dequeue()
                mqtt_client.publish(HR_TOPIC, str(hr_data).encode())
            if not gnss_queue.is_empty():
                gnss_data = gnss_queue.dequeue()
                mqtt_client.publish(GNSS_TOPIC, str(gnss_data).encode())
        await asyncio.sleep_ms(100)