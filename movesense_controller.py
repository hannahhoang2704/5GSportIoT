import aioble
import uasyncio as asyncio
import time
import machine
from movesense_device import MovesenseDevice
from data_queue import state
from led import Led


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
#dev_found = False
#rescan_requested = False
#movesense_scan_requested = False

async def find_movesense(ms_series):
    #global dev_found
    async with aioble.scan(duration_ms=SCAN_DURATION_MS, interval_us=30000, window_us=30000, active=True) as scanner:
        async for result in scanner:
            if result.name() == f"Movesense {ms_series}":
                print("Found Movesense sensor:", result.device)
                state.dev_found = True
                return result.device
    print(f"Movesense series {ms_series} not found")
    state.dev_found = False
    return None

async def movesense_task(pico_id, movesense_series=_MOVESENSE_SERIES):
    #global dev_found
    #global rescan_requested, movesense_scan_requested
    
    print("Movesense task started")
    
#     
#     device = await find_movesense(movesense_series)
#     if not device:
#         print("Initial scan failed. Press SW2 to rescan.")
#     
#    connected = False
    ms = MovesenseDevice(movesense_series, pico_id)
    retry_count = 0
    MAX_RETRIES = 3
    connected = False
    
    while True:
        if state.dev_found:
            led2.toggle_led()
            await asyncio.sleep_ms(200)
        else:
            led2.led_off()
            
            
        # Check if WiFi is connected and a Movesense scan is requested
        if state.wifi_connected and (state.movesense_scan_requested or state.rescan_requested):
            print("WiFi is connected - starting Movesense scan")
            device = await find_movesense(movesense_series)
            state.movesense_scan_requested = False
            state.rescan_requested = False
            
            if state.dev_found:
                print("Movesense device found!")
                retry_count = 0  # Reset retry counter
                
                # Try to connect immediately if running state is active
                if state.running_state and not connected:
                    print("Running state is active - connecting to Movesense")
                    await connect_to_movesense(ms, device)
                    connected = True
            else:
                retry_count += 1
                print(f"Movesense scan failed. Retry {retry_count}/{MAX_RETRIES}")
                if retry_count < MAX_RETRIES:
                    print(f"Will retry in {retry_count * 2} seconds")
                    # Schedule another scan with increasing delay
                    state.rescan_requested = True
                    await asyncio.sleep(retry_count * 2)
                else:
                    print("Max retries reached. Press SW2 to try again.")
                    retry_count = 0
        
        # Handle normal running state changes
        elif state.running_state and not connected and state.dev_found and device:
            print("Running state activated - connecting to Movesense")
            connected = await connect_to_movesense(ms, device)
        elif not state.running_state and connected:
            print(f"Running state deactivated - disconnecting Movesense {movesense_series}")
            await ms.disconnect_ble()
            connected = False
            print("Device disconnected")
        
        # Process notifications or sleep
        if connected:
            await ms.process_notification()
        else:
            await asyncio.sleep_ms(100)

async def connect_to_movesense(ms, device):
    """Helper function to connect and subscribe to Movesense device"""
    if not device:
        print("No device available to connect")
        return False
        
    try:
        print("Connecting to Movesense...")
        await ms.connect_ble(device)
        print("Connected! Subscribing to sensors...")
        await ms.subscribe_sensor("IMU9", IMU_RATE)
        await ms.subscribe_sensor("HR")
        await ms.subscribe_sensor("ECG", ECG_RATE)
        led2.led_on()
        print("Successfully connected and subscribed to all sensors")
        return True
    except Exception as e:
        print(f"Error connecting to Movesense: {e}")
        return False    
#         # Check if rescan is requested if no device is found
#         if state.rescan_requested and not state.dev_found:
#             print("Rescan requested. Looking for Movesense device...")
#             device = await find_movesense(movesense_series)
#             #rescan_requested = False
#             if state.dev_found:
#                 led2.toggle_led()
#                 time.sleep_ms(200)
#                 print("Movesense device found after rescan!")
#             
                      
        
#         if state.running_state and not connected:
#             await ms.connect_ble(device)
#             #print ("debug1")
#             await ms.subscribe_sensor("IMU9", IMU_RATE)
#             #print ("debug2")
#             await ms.subscribe_sensor("HR")
#             await ms.subscribe_sensor("ECG", ECG_RATE)
#             connected = True
#             #dev_found = False
#             led2.led_on()
#             print ("device connected")
#         elif not state.running_state and connected:
#             print(f"Unsubscribing and disconnecting movesense {movesense_series}")
#             await ms.disconnect_ble()
#             connected = False
#             print ("Device disconnected")
#         if connected:
#             await ms.process_notification()
#         else:
#             await asyncio.sleep_ms(100)
#             #print ("end loop")
        
            
async def blink_task():
    while True:
        led.value(not led.value())
        if state.running_state:
            await asyncio.sleep_ms(500)
        else:
            await asyncio.sleep_ms(1000)
