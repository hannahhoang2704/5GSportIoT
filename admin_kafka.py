from kafka import KafkaAdminClient
from kafka.admin import NewTopic
from kafka.errors import TopicAlreadyExistsError

admin = KafkaAdminClient(
  bootstrap_servers="d08cjqhqploprptk1oa0.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092",
  security_protocol="SASL_SSL",
  sasl_mechanism="SCRAM-SHA-512", 
  sasl_plain_username="kafka-connect",
  sasl_plain_password="kafka-connect",
)

try:
  topic = NewTopic(name="test_topic", num_partitions=1, replication_factor=-1, replica_assignments=[])
  admin.create_topics(new_topics=[topic])
  print("Created topic")
except TopicAlreadyExistsError as e:
  print("Topic already exists")
finally:
  admin.close()