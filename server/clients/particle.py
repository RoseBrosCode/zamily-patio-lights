import os
import json
import logging
from typing import Dict
from pyparticleio.ParticleCloud import ParticleCloud

from constants import FLASK_NAME, AnimationType
from utils.utils import denormalize_to_range, normalize_from_range, quantize


PHOTON_DEVICE_ID = "1d0038000847353138383138"
PHOTON_DEVICE_NAME = "zamily-patio"
PHOTON_ANIMATION_EVENT_NAME = "zamily-patio-animation"
PHOTON_MUSIC_PROCESSING_EVENT_NAME = "zamily-patio-music-processing"

logger = logging.getLogger(FLASK_NAME)


TRANSFORMATION_FUNCTIONS = {
    # Transforms speed from 0.0-1.0 float to a frame counter value for the photon.
    "speed": lambda s: quantize(denormalize_to_range(s, 100, 0), list(range(101))),
    "density": lambda d: denormalize_to_range(d, 0.01, 0.99)
}

DETRANSFORMATION_FUNCTIONS = {
    # Detransforms speed from a frame counter value from the photon to a 0.0-1.0 float for the client.
    "speed": lambda s: normalize_from_range(s, 100, 0),
    "density": lambda d: normalize_from_range(d, 0.01, 0.99)
}


ANIMATION_PARAMETERS = {
    AnimationType.WARM: [],
    AnimationType.COLOR: ["red", "green", "blue"],
    AnimationType.RAINBOW: ["density", "speed", "direction"],
    AnimationType.BREATHE: ["red", "green", "blue", "speed"],
    AnimationType.STROBE: ["red", "green", "blue", "speed"],
    AnimationType.RACER: ["red", "green", "blue", "speed", "tailLength", "direction"],
    AnimationType.MARQUEE: ["red", "green", "blue", "speed"],
    AnimationType.MUSIC_MATCH: ["red", "green", "blue"]
}


class Particle:

    def __init__(self):
        """Sets up interface to Particle Photon."""
        self.pc = ParticleCloud(os.environ.get("PARTICLE_ACCESS_TOKEN"), device_ids=[PHOTON_DEVICE_ID])
        self.photon = self.pc.devices.get(PHOTON_DEVICE_NAME)
        
    def publish_animation_change(self, state: Dict):
        """Publishes an animation change given a dictionary of the desired state.
        
        Args:
            state (Dict): Dictionary representing the desired animation state.
        """
        transformed_state = { k: TRANSFORMATION_FUNCTIONS.get(k)(v) if k in TRANSFORMATION_FUNCTIONS.keys() else v for k, v in state.items() }
        data = json.dumps(transformed_state)
        self.photon.publish(PHOTON_ANIMATION_EVENT_NAME, data)

    def publish_music_processing_change(self, value: bool):
        """Publishes an event to turn music processing on or off.

        Args:
            value (bool): Whether music processing should be on or off.
        """
        self.photon.publish(PHOTON_MUSIC_PROCESSING_EVENT_NAME, int(value))

    def get_current_state(self):
        """Gets the curentState variable from the Photon."""
        try:
            return json.loads(self.photon.currentState)
        except Exception as e:
            logger.error(f"error getting Photon state: {e}")
        return {}
