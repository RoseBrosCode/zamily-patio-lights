import os
import abodepy
from flask import Flask, request, jsonify

from clients.particle import Particle


app = Flask(__name__, static_folder='../client/build', static_url_path='/')

particle = Particle()

abode = abodepy.Abode(username=os.environ['ABODE_USERNAME'],
                      password=os.environ['ABODE_PASSWORD'],
                      get_devices=True)

# Set up key devices
# Inner Patio Strings ID: ZW:00000015 UUID: 57229489a414a5e8b19c96335e646235
abode_inner_strings = abode.get_device("ZW:00000015")

# Outer Patio Strings ID: ZW:00000016 UUID: 5595485c4525585c6ebe28f5fdaceb8c
abode_outer_strings = abode.get_device("ZW:00000016")

# Patio Grill Lights ID: ZW:00000017 UUID: cd1954d5f33cf69d4172e4fe1d
abode_grill_lights = abode.get_device("ZW:00000017")

# # Below will print out id and description of all devices
# abode_devices = []
# for device in abode.get_devices():
#     abode_devices.append({
#         "id": device.device_id,
#         "desc": device.desc
#     })
# app.logger.info(abode_devices)

@app.route('/')
def index():
    """Serves the HTML entrypoint to the React app."""
    return app.send_static_file('index.html')


@app.route('/state', methods=['GET'])
def get_state():
    # TODO fetch real state and return it - below is a placeholder
    return jsonify({
        "stringsOn": False,
        "grillOn": False,
        "animation": 1,
        "red": 252,
        "green": 101,
        "blue": 20,
        "speed": 5,
        "direction": 0,
        "density": 0.5,
        "tailLength": 250
    }), 200


@app.route('/animation', methods=['POST'])
def update_animation_state():
    target_animation_state = request.json
    app.logger.info(f"animation update: {target_animation_state}")
    particle.publish_animation_change(target_animation_state)
    return '', 200


@app.route('/lights', methods=['POST'])
def update_lights_state():
    target_light_state = request.json
    app.logger.info(f"lights update: {target_light_state}")

    if target_light_state['stringsOn']:
        abode_inner_strings.switch_on()
        abode_outer_strings.switch_on()
    elif not target_light_state['stringsOn']:
        abode_inner_strings.switch_off()
        abode_outer_strings.switch_off()

    if target_light_state['grillOn']:
        abode_grill_lights.switch_on()
    elif not target_light_state['grillOn']:
        abode_grill_lights.switch_off()

    return '', 200
