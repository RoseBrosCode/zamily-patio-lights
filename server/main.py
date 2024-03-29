import os
import logging
logging.getLogger().setLevel(logging.INFO)
from homeassistant_api import Client as HaClient
from flask import Flask, request, jsonify

from constants import FLASK_NAME, AnimationType, HA_URL, HA_PATIO_STRINGS_ID, HA_GRILL_LIGHTS_ID
from clients.particle import Particle, DETRANSFORMATION_FUNCTIONS

app = Flask(FLASK_NAME, static_folder='../client/build', static_url_path='/')
logger = logging.getLogger(FLASK_NAME)

particle = Particle()

ha = HaClient(HA_URL, os.environ['HA_TOKEN'])

# Set up key devices
ha_patio_strings = ha.get_entity(entity_id=HA_PATIO_STRINGS_ID)
ha_grill_lights = ha.get_entity(entity_id=HA_GRILL_LIGHTS_ID)
ha_light_services = ha.get_domain("light")

logger.info("Devices Set Up!")

@app.route('/')
def index():
    """Serves the HTML entrypoint to the React app."""
    return app.send_static_file('index.html')


@app.route('/state', methods=['GET'])
def get_state():
    """
    Fetch the latest abode state and the photon state and update the state obj before sending.
    """
    full_state = {}

    if request.args.get('component') is None or request.args.get('component') == 'power':
        power_state = {}

        if ha_patio_strings.state.state == "on": # assume inner and outer strings are same - choosing inner here is arbitrary
            power_state['stringsOn'] = True
        else:
            power_state['stringsOn'] = False

        if ha_grill_lights.state.state == "on": 
            power_state['grillOn'] = True
        else:
            power_state['grillOn'] = False

        # Add power state to full state
        full_state.update(power_state)

    if request.args.get('component') is None or request.args.get('component') == 'animation':
        # Get photon state which has animation info
        photon_state = particle.get_current_state()
        animation_state = { k: DETRANSFORMATION_FUNCTIONS.get(k)(v) if k in DETRANSFORMATION_FUNCTIONS.keys() else v for k, v in photon_state.items() }
        
        # Add animation state to full state
        full_state.update(animation_state)

    if request.args.get('component') == 'power':
        return jsonify(power_state), 200
    elif request.args.get('component') == 'animation':
        return jsonify(animation_state), 200
    else:
        return jsonify(full_state), 200


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
        ha_light_services.turn_on(entity_id=HA_PATIO_STRINGS_ID)
    elif not target_light_state['stringsOn']:
        ha_light_services.turn_off(entity_id=HA_PATIO_STRINGS_ID)

    if target_light_state['grillOn']:
        ha_light_services.turn_on(entity_id=HA_GRILL_LIGHTS_ID) 
    elif not target_light_state['grillOn']:
        ha_light_services.turn_off(entity_id=HA_GRILL_LIGHTS_ID) 

    return '', 200
