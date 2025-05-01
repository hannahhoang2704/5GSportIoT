import uasyncio as asyncio
import machine
import time
import wifi_connection as wifi
from wifi_connection import connect_wifi, wifi_task, SSID, PASSWORD
from data_queue import state
import movesense_controller as mc
from movesense_controller import movesense_task, blink_task
from led import Led
from gnss_device import GNSSDevice, gnss_task

SW_0_PIN = 9
SW_1_PIN = 8
SW_2_PIN = 7
LED1 = 22
LED2 = 21
LED3 = 20

# led1 = machine.Pin(LED1, machine.Pin.OUT)
led1 = Led(LED1)
led2 = Led(LED2)
led3 = Led(LED3)
button = machine.Pin(SW_1_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
button2 = machine.Pin(SW_2_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
button_pressed = False
#rescan_requested = False
last_pressed_btn = 0
last_pressed_btn2 = 0
DEBOUNCE_MS = 500

def button_handler(pin):
    global last_pressed_btn
    current_time = time.ticks_ms()
    if time.ticks_diff(current_time, last_pressed_btn) > DEBOUNCE_MS:
        state.running_state = not state.running_state
        # print(f"Button pressed. Running state {state.running_state}")
        last_pressed_btn = current_time
        
def button2_handler(pin):
    global last_pressed_btn2
    #global wifi_connected
    current_time = time.ticks_ms()
    if time.ticks_diff(current_time, last_pressed_btn2) > DEBOUNCE_MS:
        print("SW2 pressed. Checking for connection retries...")
        
         # Check if WiFi needs to be reconnected
        if not state.wifi_connected:
            print("WiFi not connected - initiating reconnection")
            state.rescan_wifi_requested = True
            
        # Check if Movesense needs to be found
        else:
            print("Find Movesense")
            if not state.dev_found:
                #dev_found = False
                print("Movesense not found - initiating device scan")
                state.rescan_requested = True
                state.movesense_scan_requested = True
        
        
        last_pressed_btn2 = current_time

async def running_state_on_led():
    while True:
        led1.led_on() if state.running_state else led1.led_off()
        await asyncio.sleep_ms(500)

def read_picoW_unique_id():
    id_bytes = machine.unique_id()
    picoW_id = id_bytes.hex()
    return picoW_id

async def main():
    try:
        picoW_id = read_picoW_unique_id()
        print(f"PicoW ID is {picoW_id}")
        #await connect_wifi()
        await asyncio.gather(
            wifi_task(SSID, PASSWORD),
            movesense_task(picoW_id),
            # gnss_task,
            blink_task(),
            running_state_on_led()
        )
    except Exception as e:
        print(f"Error: {e}")
    finally:
        print("Shutting down event loop...")
        loop = asyncio.get_event_loop()
        loop.stop()  # Stops event loop gracefully

button.irq(trigger=machine.Pin.IRQ_FALLING, handler=button_handler)
button2.irq(trigger=machine.Pin.IRQ_FALLING, handler=button2_handler)

# Run the event loop manually
loop = asyncio.get_event_loop()
loop.create_task(main())

try:
    print("Start running...")
    loop.run_forever()
except KeyboardInterrupt:
    print("Stopped by user")
finally:
    loop.close()