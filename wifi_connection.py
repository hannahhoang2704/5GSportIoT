import uasyncio as asyncio
import network
import time
from led import Led
from data_queue import state

SSID = "Linh Xuan"
PASSWORD = "xuanxinh97"
WAITING_FOR_WIFI_CONNECTION_SECONDS = 10

#wifi_connected = False
#rescan_wifi_requested = False

LED3 = 20
led3 = Led(LED3)
led3.led_off()


async def connect_wifi(ssid=SSID, password=PASSWORD):
    #global wifi_connected
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    start_time = time.time()
    connected = False
    while not wlan.isconnected():
        if time.time() - start_time > WAITING_FOR_WIFI_CONNECTION_SECONDS:
            print(f"Can't connect to ssid {ssid}. Press SW2 to retry")
            state.wifi_connected = False
            return False
        print(f"Connecting wifi...")
        time.sleep(1)
        
    if wlan.isconnected():
        state.wifi_connected = True
        #led3.led_on()
        print("Connected!", wlan.ifconfig())
        return True
    return False

async def wifi_task(ssid, password):
    
    #global wifi_connected, rescan_wifi_requested, led3, movesense_scan_requested
    
    await connect_wifi(ssid, password)
    
    while True:
        #if led_wifi:
        if state.wifi_connected:
            led3.toggle_led()
            await asyncio.sleep_ms(200)
        else:
            led3.led_off()
        
        
        # If a rescan is requested, try to reconnect
        if state.rescan_wifi_requested:
            print("WiFi rescan requested. Attempting to connect...")
            await connect_wifi(ssid, password)
            state.rescan_wifi_requested = False
        
        # Check connection status periodically
        if state.wifi_connected:
            state.movesense_scan_requested = True
            print("WiFi connected after rescan, triggering Movesense scan")
             
     # Wait between checks
        await asyncio.sleep_ms(200)
        
        