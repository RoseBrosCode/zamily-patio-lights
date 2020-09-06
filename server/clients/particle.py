import os
import json
import logging
from enum import Enum
from typing import Dict
from pyparticleio.ParticleCloud import ParticleCloud


PHOTON_DEVICE_ID = "1d0038000847353138383138"
PHOTON_DEVICE_NAME = "zamily-patio"
PHOTON_ANIMATION_EVENT_NAME = "zamily-patio-animation"


class AnimationType(Enum):
    WARM = 0
    COLOR = 1
    RAINBOW = 2
    BREATHE = 3
    STROBE = 4
    RACER = 5
    MARQUEE = 6 
    MUSIC_MATCH = 7


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
        data_dict = { k: v for k, v in state.items() if k in ANIMATION_PARAMETERS.get(AnimationType(state.get("animation", 0)), []) + ["animation"] }
        data = json.dumps(data_dict)
        self.photon.publish(PHOTON_ANIMATION_EVENT_NAME, data)