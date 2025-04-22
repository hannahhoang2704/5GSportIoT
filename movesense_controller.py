import aioble
import uasyncio as asyncio
import machine
from movesense_device import MovesenseDevice
# import sys
# sys.path.append('/')
from data_queue import state

# Movesense series ID
_MOVESENSE_SERIES = "174630000192"

# Sensor Data Rate
IMU_RATE = 52   #Sample rate can be 13, 26, 52, 104, 208, 416, 833, 1666
ECG_RATE = 125  #Sample rate can be 125, 128, 200, 250, 256, 500, 512

# Onboard LED
led = machine.Pin("LED", machine.Pin.OUT)

SCAN_DURATION_MS = 10000

async def find_movesense(ms_series):
    async with aioble.scan(duration_ms=SCAN_DURATION_MS, interval_us=30000, window_us=30000, active=True) as scanner:
        async for result in scanner:
            if result.name() == f"Movesense {ms_series}":
                print("Found Movesense sensor:", result.device)
                return result.device
    print(f"Movesense series {ms_series} not found")
    return None


async def movesense_task(pico_id, movesense_series=_MOVESENSE_SERIES):
    device = await find_movesense(movesense_series)
    if not device:
        return
    connected = False
    ms = MovesenseDevice(movesense_series, pico_id)
    while True:
        if state.running_state and not connected:
            await ms.connect_ble(device)
            await ms.subscribe_sensor("IMU9", IMU_RATE)
            await ms.subscribe_sensor("HR")
            await ms.subscribe_sensor("ECG", ECG_RATE)
            connected = True
        elif not state.running_state and connected:
            print(f"Unsubscribing and disconnecting movesense {movesense_series}")
            await ms.disconnect_ble()
            connected = False
        if connected:
            await ms.process_notification()
        else:
            await asyncio.sleep_ms(100)
        
            

async def blink_task():
    while True:
        led.value(not led.value())
        if state.running_state:
            await asyncio.sleep_ms(500)
        else:
            await asyncio.sleep_ms(1000)
