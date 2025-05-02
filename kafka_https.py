import json
import time
import requests

from datetime import datetime


def pretty(text):
    print(json.dumps(text, indent=2))


base_uri = "https://d08cjqhqploprptk1oa0.registry.eu-central-1.mpx.prd.cloud.redpanda.com"
headers = {
    'Content-Type': 'application/vnd.schemaregistry.v1+json'
}

schema = {
    "type": "record",
    "name": "SensorSample",
    "fields": [
        {
            "name": "send_time",
            "type": "long",
            "time": f"{datetime.now()}"
        }
    ]
}

payload = {
    'schema': json.dumps(schema),

}

def send_data(id:int):

    before_send = datetime.now()
    response = requests.post(
        # f"{base_uri}/subjects/movesense/versions",
        f"{base_uri}/subjects/sensors/versions",
        headers=headers,
        auth=('iot5Gsport', 'iot5Gsport'),  # This if authentication required!
        data=json.dumps(payload)
    )
    after_send = datetime.now()
    print(f"Response: {response.status_code}; value {response.text}; Duration (before send post - after post successfully) {(after_send-before_send).total_seconds()}")
    res = requests.get(f'{base_uri}/schemas/ids/{id}',
                       # f'{base_uri}/subjects',
                       headers=headers,
                       auth=('iot5Gsport', 'iot5Gsport'),  # This if authentication required!
                       data=json.dumps(payload)).json()

    after_get =datetime.now()
    print(f"Duration(before send post - after get successfully): = {(after_get-before_send).total_seconds()}, Duration(after post successfully - after get successfully) {(after_get-after_send).total_seconds()}")
    #pretty(res)


for i in range(5):
    send_data(19)