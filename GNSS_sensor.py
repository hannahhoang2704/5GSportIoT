import ujson as json
import time
from DFRobot_GNSS import *

# I2C setup (GPIO 4 and 5 on Raspberry Pi Pico WH)
i2c = machine.I2C(0, scl=machine.Pin(5), sda=machine.Pin(4), freq=115200)

gnss = DFRobot_GNSS(i2c=i2c)

# Start GNSS
if gnss.begin():
    print("GNSS started successfully!")
    print("Satellites used:", gnss.get_num_sta_used())
    print("GNSS mode:", gnss.get_gnss_mode())
    gnss.set_gnss(GPS_BeiDou_GLONASS)
    time.sleep(2)  # Sleep to give time to lock in
else:
    print("Failed to initialize GNSS.")
    while True:
        time.sleep(1)

# Main
while True:
    # Read date
    date = gnss.get_date()
    time_data = gnss.get_utc()

    # Read latitude + longitude in decimal degrees
    lat = gnss.get_lat()
    lon = gnss.get_lon()

    gnss_data = {
        "datetime": f"{date.year}-{date.month}-{date.date} {time_data.hour + 3}:{time_data.minute}:{time_data.second}",
        "lat": f"{lat.latitude_degree}",
        "lon": f"{lon.lonitude_degree}",
    }

    json_data = json.dumps(gnss_data)

    print(json_data)

    time.sleep(1)
