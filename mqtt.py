import uasyncio as asyncio
from umqtt.robust import MQTTClient

_MQTT_SERVER = b'd3b9f848475f4921a1bd2e178274dc09.s1.eu.hivemq.cloud'
_MQTT_PORT = 8883
_MQTT_USERNAME = b'PicoW'
_MQTTT_PASSWORD = b'PicoW-123'
_MQTT_KEEPALIVE = 7200
_MQTT_SSL_PARAMS = {'server_hostname': _MQTT_SERVER}
_MQTT_CLIENT_ID = b'raspberrypi-picow'


async def connect_mqtt():
    try:
        print("Connecting MQTT broker")
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
    print("MQTT broker connected")
    return mqtt_client