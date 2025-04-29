import aioble
import uasyncio as asyncio
import time
import machine
from movesense_device import MovesenseDevice
# import sys
# sys.path.append('/')
from data_queue import state
from led import Led

LED2 = 21
led2 = Led(LED2)
led2.led_off()

# Movesense series ID
_MOVESENSE_SERIES = "213030001405"

# Sensor Data Rate
IMU_RATE = 52   #Sample rate can be 13, 26, 52, 104, 208, 416, 833, 1666
ECG_RATE = 125  #Sample rate can be 125, 128, 200, 250, 256, 500, 512

# Onboard LED
led = machine.Pin("LED", machine.Pin.OUT)

SCAN_DURATION_MS = 10000
dev_found = False
rescan_requested = False

async def find_movesense(ms_series):
    global dev_found
    async with aioble.scan(duration_ms=SCAN_DURATION_MS, interval_us=30000, window_us=30000, active=True) as scanner:
        async for result in scanner:
            if result.name() == f"Movesense {ms_series}":
                print("Found Movesense sensor:", result.device)
                dev_found = True
                return result.device
    print(f"Movesense series {ms_series} not found")
    dev_found = False
    return None

async def movesense_task(pico_id, movesense_series=_MOVESENSE_SERIES):
    global dev_found
    global rescan_requested
    
    device = await find_movesense(movesense_series)
    if not device:
        print("Initial scan failed. Press SW2 to rescan.")
    
    connected = False
    ms = MovesenseDevice(movesense_series, pico_id)
    while True:
        if dev_found:
            led2.toggle_led()
            time.sleep_ms(200)
        else:
            led2.led_off()
        #print ("debug0")
            
        # Check if rescan is requested if no device is found
        #print (rescan_requested, dev_found)
        if rescan_requested and not dev_found:
            print("Rescan requested. Looking for Movesense device...")
            device = await find_movesense(movesense_series)
            #rescan_requested = False
            if dev_found:
                led2.toggle_led()
                time.sleep_ms(200)
                print("Movesense device found after rescan!")
            else:
                print("Rescan failed. Press SW2 to try again.")
                      
        
        if state.running_state and not connected:
            await ms.connect_ble(device)
            #print ("debug1")
            await ms.subscribe_sensor("IMU9", IMU_RATE)
            #print ("debug2")
            await ms.subscribe_sensor("HR")
            await ms.subscribe_sensor("ECG", ECG_RATE)
            connected = True
            #dev_found = False
            led2.led_on()
            print ("device connected")
        elif not state.running_state and connected:
            print(f"Unsubscribing and disconnecting movesense {movesense_series}")
            await ms.disconnect_ble()
            connected = False
            print ("Device disconnected")
        if connected:
            await ms.process_notification()
        else:
            await asyncio.sleep_ms(100)
            #print ("end loop")
        
            
async def blink_task():
    while True:
        led.value(not led.value())
        if state.running_state:
            await asyncio.sleep_ms(500)
        else:
            await asyncio.sleep_ms(1000)
