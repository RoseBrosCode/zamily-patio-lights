from enum import Enum

FLASK_NAME = "ZAMILY_PATIO_LIGHTS"

HA_URL = "https://0e6v41nox33cfu81evaxlks9dfmm97wc.ui.nabu.casa/api"
HA_PATIO_STRINGS_ID = "light.lights_group_patio_string_lights"
HA_GRILL_LIGHTS_ID = "light.patio_grill_lights_outlet"

class AnimationType(Enum):
    WARM = 0
    COLOR = 1
    RAINBOW = 2
    BREATHE = 3
    STROBE = 4
    RACER = 5
    MARQUEE = 6 
    MUSIC_MATCH = 7
