import time
from datetime import datetime

import paho.mqtt.client as paho
from paho import mqtt

# MQTT setup
broker = "05407e9daee343cf9fe6245e755cb1be.s1.eu.hivemq.cloud"
port = 8883
username = "Movesense"
password = "Movesense12"
topic = "encyclopedia/temperature"

# Create MQTT client
client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)

# Setup authentication and encryption
client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
client.username_pw_set(username, password)

# Connect to MQTT broker
client.connect(broker, port)

# Start the network loop
client.loop_start()

# Send 10 timestamp messages
for i in range(10):
    now = datetime.now().isoformat()
    result = client.publish(topic, payload=now, qos=1)
    print(f"Sent message {i + 1}: {now}")
    time.sleep(1)  # Optional: wait 1 second between sends

# Give some time to send all messages
time.sleep(2)

# Stop network loop and disconnect
client.loop_stop()
client.disconnect()
