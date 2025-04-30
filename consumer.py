from kafka import KafkaConsumer

consumer = KafkaConsumer(
  bootstrap_servers="d08cjqhqploprptk1oa0.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092",
  security_protocol="SASL_SSL",
  sasl_mechanism="SCRAM-SHA-256",
  sasl_plain_username="iot5Gsport",
  sasl_plain_password="iot5Gsport",
  auto_offset_reset="earliest",
  enable_auto_commit=False,
  consumer_timeout_ms=10000
)
consumer.subscribe("sensors")

for message in consumer:
  topic_info = f"topic: {message.topic} ({message.partition}|{message.offset})"
  message_info = f"key: {message.key}, {message.value}"
  print(f"{topic_info}, {message_info}")