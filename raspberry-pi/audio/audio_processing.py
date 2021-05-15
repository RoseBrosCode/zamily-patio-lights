import os
import datetime
import logging

# Define log file
filename = f'audio-processing-{datetime.date.today().strftime("%b-%d-%Y")}.log'
pi_dir = "/home/pi/zamily-patio-lights/raspberry-pi/audio"
if os.path.isdir(pi_dir):
    filename = os.path.join(pi_dir, filename)
# Ensure log file exists
open(filename, "a+")
# Configure logging to file
logging.basicConfig(filename=filename, level=logging.DEBUG)
# Configure logging to stderr
logging.getLogger().addHandler(logging.StreamHandler())

import signal
import json

from dotenv import load_dotenv
load_dotenv()

from pyparticleio.ParticleCloud import ParticleCloud
from pyo import *

from pyo_client import PyoClient


PHOTON_DEVICE_ID = "1d0038000847353138383138"
PHOTON_DEVICE_NAME = "zamily-patio"
PHOTON_MUSIC_PROCESSING_EVENT_NAME = "zamily-patio-music-processing"


class APStates:
    OFF = "off"
    VOL = "vol"


class AudioProcessor:
    def __init__(self, remote_host, remote_port):
        """Configures audio client and audio processing nodes, as well as OSC client."""
        # Particle OSC destination
        self.remote_host = remote_host
        self.remote_port = remote_port

        # Pyo client
        if os.environ.get("PI"):
            self.c = PyoClient(audio_backend='jack')
        else:
            self.c = PyoClient(prompt_for_audio_devices=True)

        # How often continuous signals are sampled
        self.rate = 0.05

        # Listen to a single channel of input
        self.i = Input(0)

        # Try to account for volume inconsistency
        self.expanded = Expand(self.i, upthresh=-40, ratio=8)
        
        # Follow amplitude envelope
        self.follower = Follower(self.expanded)

        # OSC command senders
        self.vol_sender = OscDataSend(types="f", address="/vol", port=self.remote_port, host=self.remote_host)
        
        # Continuous audio processing loop
        self.pattern = Pattern(self.process, self.rate)
        self.pattern.play()

        # State of the audio processor
        self.state = APStates.OFF

    def process(self):
        """Called every self.rate seconds, grabs audio features and sends them over OSC."""
        try:
            if self.state == APStates.VOL:
                # Follows envelope of expanded signal
                amp = self.follower.get()

                # Adjust signal and clamp at 1.0
                val = min(amp / 2, 1.0)

                # Send to Particle
                self.vol_sender.send([val])
        except Exception as e:
            logging.error(f"error in processing: {e}")

    def stop(self):
        """Stops the audio server, allowing the program to exit."""
        self.c.audio_server.shutdown()


if __name__ == "__main__":
    # Setup particle connection
    pc = ParticleCloud(os.environ.get("PARTICLE_ACCESS_TOKEN"), device_ids=[PHOTON_DEVICE_ID])
    photon = pc.devices.get(PHOTON_DEVICE_NAME)

    # Setup audio processor
    audio_processor = AudioProcessor("192.168.86.127", 34568)

    # Handle particle event
    def handle_music_processing_event(event):
        """Receives an event from the server to turn on/off audio processing."""
        data = json.loads(event.data).get("data")

        # data is 0 or 1
        value = int(data)
        if value:
            logging.debug("starting audio processing")
            audio_processor.state = APStates.VOL
        else:
            logging.debug("stopping audio processing")
            audio_processor.state = APStates.OFF

    photon.cloud_subscribe(PHOTON_MUSIC_PROCESSING_EVENT_NAME, handle_music_processing_event)

    # Wait for signal to close
    try:
        signal.pause()
    except:
        audio_processor.stop()
