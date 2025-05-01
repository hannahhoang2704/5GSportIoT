import time
from DFRobot_GNSS import DFRobot_GNSS, GPS_BeiDou_GLONASS
import machine
import uasyncio as asyncio
from data_queue import gnss_queue, state


# I2C setup (GPIO 4 and 5 on Raspberry Pi Pico WH)
i2c = machine.I2C(0, scl=machine.Pin(5), sda=machine.Pin(4), freq=115200)

gnss = DFRobot_GNSS(i2c=i2c)

async def set_up_gnss_sensor():
    # Start GNSS
    if gnss.begin():
        print("GNSS started successfully!")
        print("Satellites used:", gnss.get_num_sta_used())
        print("GNSS mode:", gnss.get_gnss_mode())
        gnss.set_gnss(GPS_BeiDou_GLONASS)
        await asyncio.sleep(2)  # Sleep to give time to lock in
    else:
        print("Failed to initialize GNSS.")

async def gnss_task(picoW_id):
    while state.running_state:
        date = gnss.get_date()
        time_data = gnss.get_utc()
        lat = gnss.get_lat()
        lon = gnss.get_lon()
        gnss_id = gnss.get_gnss_id()
        gnss_data = {
            "Pico_ID": picoW_id,
            "GNSS_ID": gnss_id,
            "Date": f"{date.year}-{date.month}-{date.daxte} {time_data.hour + 3}:{time_data.minute}:{time_data.second}",
            "Latitude": f"{lat.latitude_degree}",
            "Longitude": f"{lon.lonitude_degree}",
        }
        if gnss_data:
            print(f"GNSS data: {gnss_data}")
            gnss_queue.enqueue(gnss_data)
        await asyncio.sleep_ms(1000)

