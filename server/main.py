import os
import abodepy
import logging
from flask import Flask, request, jsonify

from constants import FLASK_NAME, AnimationType
from clients.particle import Particle, DETRANSFORMATION_FUNCTIONS


app = Flask(FLASK_NAME, static_folder='../client/build', static_url_path='/')
logger = logging.getLogger(FLASK_NAME)

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


@app.route('/')
def index():
    """Serves the HTML entrypoint to the React app."""
    return app.send_static_file('index.html')


@app.route('/state', methods=['GET'])
def get_state():
    """
    Fetch the latest abode state and the photon state and update the state obj before sending.
    """
    state = {}

    # Refresh abode device state
    abode_inner_strings.refresh()
    abode_grill_lights.refresh()

    if abode_inner_strings.is_on: # assume inner and outer strings are same - choosing inner here is arbitrary
        state['stringsOn'] = True
    else:
        state['stringsOn'] = False

    if abode_grill_lights.is_on: 
        state['grillOn'] = True
    else:
        state['grillOn'] = False

    # Get photon state
    photon_state = particle.get_current_state()
    detransformed_photon_state = { k: DETRANSFORMATION_FUNCTIONS.get(k)(v) if k in DETRANSFORMATION_FUNCTIONS.keys() else v for k, v in photon_state.items() }
    state.update(detransformed_photon_state)

    return jsonify(state), 200


@app.route('/animation', methods=['POST'])
def update_animation_state():
    target_animation_state = request.json
    target_animation_state = {k: v for k, v in target_animation_state.items() if k not in ["stringsOn", "grillOn"]}

    # if MUSIC_MATCH, turn on audio processing
    if target_animation_state["animation"] == AnimationType.MUSIC_MATCH.value:
        logger.info("telling raspberry pi to start processing audio")
        particle.publish_music_processing_change(True)
    else:
        particle.publish_music_processing_change(False)

    # change animation
    particle.publish_animation_change(target_animation_state)
    return '', 200


@app.route('/lights', methods=['POST'])
def update_lights_state():
    target_light_state = request.json
    logger.info(f"lights update: {target_light_state}")

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
