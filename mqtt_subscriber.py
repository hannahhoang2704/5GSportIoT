import time
from datetime import datetime
import paho.mqtt.client as paho
from paho import mqtt

def on_connect(client, userdata, flags, rc, properties=None):
    print("CONNACK received with code %s." % rc)

def on_publish(client, userdata, mid, properties=None):
    print("mid: " + str(mid))

def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_message(client, userdata, msg):
    try:
        # Decode payload
        payload = msg.payload.decode()
        print(f"Received payload: {payload}")

        # Parse the sent time (assuming it is in ISO format)
        sent_time = datetime.fromisoformat(payload)

        # Get current server time
        received_time = datetime.now()

        # Calculate duration
        duration = (received_time - sent_time).total_seconds()

        print(f"Sent at: {sent_time}, Received at: {received_time}")
        print(f"Duration (seconds): {duration:.6f}")

    except Exception as e:
        print(f"Error handling message: {e}")

# MQTT client setup
client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
client.on_connect = on_connect
client.on_subscribe = on_subscribe
client.on_message = on_message
client.on_publish = on_publish

# Secure connection
client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
client.username_pw_set("Movesense", "Movesense12")
client.connect("05407e9daee343cf9fe6245e755cb1be.s1.eu.hivemq.cloud", 8883)

# Subscribe to all encyclopedia topics
client.subscribe("encyclopedia/#", qos=1)

# Start MQTT loop
client.loop_forever()
