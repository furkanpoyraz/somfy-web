"""
Control a Somfy 5-channel remote (e.g. Somfy Situo 5 io Pure) with GPIOs from a Raspberry Pi.
Based on: https://github.com/rfkd/somfy-control
"""

import RPi.GPIO as GPIO
import json

from time import sleep

# LED input pin assignments (use GPIO header pin numbers, NOT Broadcom channel numbers)
LEDS = {
    'LED1': 32,
    'LED2': 33,
    'LED3': 35,
    'LED4': 31
}

# Button output pin assignments (GPIO header pin numbers, NOT Broadcom channel numbers)
BUTTONS = {
    'UP':     36,
    'MY':     37,
    'DOWN':   38,
    'SELECT': 40
}


ERRORS = []


def press_button(button):
    """
    Press the given button on the remote.
    :param button: Button to be pressed (UP, STOP, DOWN, SELECT).
    """

    # Delay during which the given button remains pressed
    delay_press = 0.1

    GPIO.output(BUTTONS[button], GPIO.LOW)
    sleep(delay_press)
    GPIO.output(BUTTONS[button], GPIO.HIGH)
    sleep(delay_press)

    print("Button " + button + " pressed.")


def get_channel():
    """
    Get the currently active channel from the remote.
    :return: Currently active channel (1..5), 0 if none is active or None upon errors.
    """

    current_channel = None

    if (GPIO.input(LEDS['LED1']) == GPIO.HIGH
            and GPIO.input(LEDS['LED2']) == GPIO.HIGH
            and GPIO.input(LEDS['LED3']) == GPIO.HIGH
            and GPIO.input(LEDS['LED4']) == GPIO.HIGH):
        current_channel = 0
    elif (GPIO.input(LEDS['LED1']) == GPIO.LOW
            and GPIO.input(LEDS['LED2']) == GPIO.HIGH
            and GPIO.input(LEDS['LED3']) == GPIO.HIGH
            and GPIO.input(LEDS['LED4']) == GPIO.HIGH):
        current_channel = 1
    elif (GPIO.input(LEDS['LED1']) == GPIO.HIGH
            and GPIO.input(LEDS['LED2']) == GPIO.LOW
            and GPIO.input(LEDS['LED3']) == GPIO.HIGH
            and GPIO.input(LEDS['LED4']) == GPIO.HIGH):
        current_channel = 2
    elif (GPIO.input(LEDS['LED1']) == GPIO.HIGH
            and GPIO.input(LEDS['LED2']) == GPIO.HIGH
            and GPIO.input(LEDS['LED3']) == GPIO.LOW
            and GPIO.input(LEDS['LED4']) == GPIO.HIGH):
        current_channel = 3
    elif (GPIO.input(LEDS['LED1']) == GPIO.HIGH
            and GPIO.input(LEDS['LED2']) == GPIO.HIGH
            and GPIO.input(LEDS['LED3']) == GPIO.HIGH
            and GPIO.input(LEDS['LED4']) == GPIO.LOW):
        current_channel = 4
    elif (GPIO.input(LEDS['LED1']) == GPIO.LOW
            and GPIO.input(LEDS['LED2']) == GPIO.LOW
            and GPIO.input(LEDS['LED3']) == GPIO.LOW
            and GPIO.input(LEDS['LED4']) == GPIO.LOW):
        current_channel = 5

    return current_channel


def set_channel(channel):
    """
    Setup the channel on the remote.
    :param channel: Channel number to set (1..5).
    """

    # Activate the remote and check the currently selected channel
    press_button('SELECT')
    current_channel = get_channel()
    print("Channel {} is currently selected.".format(current_channel))
    if current_channel == channel:
        return

    # Select the correct channel
    number_of_channels = 5
    button_presses_needed = (number_of_channels - current_channel + channel) % number_of_channels
    for _ in range(0, button_presses_needed):
        press_button('SELECT')

    # Exit if the channel switch was not successful
    current_channel = get_channel()
    if current_channel != channel:
        ERRORS.append("Unable to select the specified channel. Current channel is {}.".format(current_channel))
        


def controlSomfy(channel, button):
    # Configure RPi.GPIO (use pin numbers instead of Broadcom channel numbers)
    try:
        GPIO.setmode(GPIO.BOARD)
        for name in LEDS:
            GPIO.setup(LEDS[name], GPIO.IN)
        for name in BUTTONS:
            GPIO.setup(BUTTONS[name], GPIO.OUT, initial=GPIO.HIGH)
    except RuntimeError as e:
        ERRORS.append(e)

    # Select the channel
    set_channel(int(channel))

    # Press the button
    press_button(button)

    # Wait for the command confirmation
    sleep(1)

    GPIO.cleanup()

    if not ERRORS:
        return
    else:
        return json.dumps({"errors": ERRORS})