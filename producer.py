import socket
from kafka import KafkaProducer
from kafka.errors import KafkaError

producer = KafkaProducer(
  bootstrap_servers="d08cjqhqploprptk1oa0.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092",
  security_protocol="SASL_SSL",
  sasl_mechanism="SCRAM-SHA-512",
  sasl_plain_username="kafka-connect",
  sasl_plain_password="kafka-connect",
)
hostname = str.encode(socket.gethostname())

def on_success(metadata):
  print(f"Sent to topic '{metadata.topic}' at offset {metadata.offset}")

def on_error(e):
  print(f"Error sending message: {e}")

# Produce 100 messages asynchronously
for i in range(100):
  msg = f"asynchronous message #{i}"
  future = producer.send(
    "sensors",
    key=hostname,
    value=str.encode(msg)
  )
  future.add_callback(on_success)
  future.add_errback(on_error)
producer.flush()
producer.close()