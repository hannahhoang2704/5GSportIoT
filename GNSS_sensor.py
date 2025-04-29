import ujson as json  # MicroPython uses 'ujson' instead of 'json'
import time
from DFRobot_GNSS import DFRobot_GNSS

gnss = DFRobot_GNSS(bus=1)  # <-- for I2C

# Start GNSS
if gnss.begin():
    print("GNSS started successfully!")
else:
    print("Failed to initialize GNSS.")
    while True:
        time.sleep(1)

# Main loop
while True:
    # Read date
    date = gnss.get_date()

    # Read latitude
    lat = gnss.get_lat()

    # Read longitude
    lon = gnss.get_lon()

    # Create a dictionary
    gnss_data = {
        "date": {
            "year": date.year,
            "month": date.month,
            "day": date.date
        },
        "latitude": {
            "degree": lat.latitude_degree,
            "direction": lat.lat_direction
        },
        "longitude": {
            "degree": lon.lonitude_degree,
            "direction": lon.lon_direction
        }
    }

    # Convert to JSON
    json_data = json.dumps(gnss_data)

    # Print JSON
    print(json_data)

    time.sleep(1)  # Read every 1 second

