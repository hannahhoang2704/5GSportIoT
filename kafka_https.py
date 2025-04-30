import requests
import json
from datetime import datetime
import time

def pretty(text):
  print(json.dumps(text, indent=2))
  
base_uri = "https://d08cjqhqploprptk1oa0.registry.eu-central-1.mpx.prd.cloud.redpanda.com"

start_time= time.time()

schema = {
    "type": "record",
    "name": "SensorSample",
    "fields": [
        {
            "name": "send_time",
            "type": "long",
            "logicalType": "timestamp-millis",
            "time": f"{start_time}"
            
        }
    ]
}

headers = {
    'Content-Type': 'application/vnd.schemaregistry.v1+json'
}

current_timestamp = int(datetime.now().timestamp() * 1000)  # Convert to milliseconds
payload = {
    'schema': json.dumps(schema),

}

start_time = datetime.now()
# print(f"start_time: {start_time}")
# Important: You probably need authentication headers or auth!
response = requests.post(
    # f"{base_uri}/subjects/movesense/versions",
    f"{base_uri}/subjects/sensors/versions",
    headers=headers,
    auth=('iot5Gsport', 'iot5Gsport'),  # This if authentication required!
    data=json.dumps(payload)
)

# end_time = datetime.now()
# print(f"end_time: {end_time}")
print(f"Response: {response.status_code}; value {response.text}")
# print(f"Duration = {(end_time-start_time).total_seconds()}")
res = requests.get(f'{base_uri}/schemas/ids/10',
                    # f'{base_uri}/subjects', 
                   headers=headers,
            auth=('iot5Gsport', 'iot5Gsport'),  # This if authentication required!
            data=json.dumps(payload)).json()

pretty(res)