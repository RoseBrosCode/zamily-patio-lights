import os
import json
import logging
from typing import Dict
from pyparticleio.ParticleCloud import ParticleCloud

from constants import FLASK_NAME, AnimationType
from utils.utils import denormalize_to_range, quantize


PHOTON_DEVICE_ID = "1d0038000847353138383138"
PHOTON_DEVICE_NAME = "zamily-patio"
PHOTON_ANIMATION_EVENT_NAME = "zamily-patio-animation"
PHOTON_MUSIC_PROCESSING_EVENT_NAME = "zamily-patio-music-processing"

logger = logging.getLogger(FLASK_NAME)


def transform_speed(speed):
    """Transforms speed from 0.0-1.0 float to a frame counter value for the photon."""
    return quantize(denormalize_to_range(speed, 15, 0), list(range(16)))


TRANSFORMATION_FUNCTIONS = {
    "speed": transform_speed,
    "density": lambda d: denormalize_to_range(d, 0.0, 0.99)
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
        data_dict = { k: v for k, v in transformed_state.items() if k in ANIMATION_PARAMETERS.get(AnimationType(state.get("animation", 0)), []) + ["animation"] }
        data = json.dumps(data_dict)
        self.photon.publish(PHOTON_ANIMATION_EVENT_NAME, data)

    def publish_music_processing_change(self, value: bool):
        """Publishes an event to turn music processing on or off.

        Args:
            value (bool): Whether music processing should be on or off.
        """
        self.photon.publish(PHOTON_MUSIC_PROCESSING_EVENT_NAME, int(value))
