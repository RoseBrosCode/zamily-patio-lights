import os
import sys
import signal

from pyo import *
from pyo_client import PyoClient


class APStates:
    VOL = "vol"


class AudioProcessor:
    def __init__(self, remote_host, remote_port):
        """Configures audio client and audio processing nodes, as well as OSC client."""
        # Particle OSC destination
        self.remote_host = remote_host
        self.remote_port = remote_port

        # Pyo client
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
        self.state = APStates.VOL

    def process(self):
        """Called every self.rate seconds, grabs audio features and sends them over OSC."""
        if self.state == APStates.VOL:
            # Follows envelope of expanded signal
            amp = self.follower.get()
            
            # Approximate max of 10
            val = min(amp/10, 1.0)

            # Send to Particle
            self.vol_sender.send([val])

    def stop(self):
        """Stops the audio server, allowing the program to exit."""
        self.c.audio_server.shutdown()


if __name__ == "__main__":
    audio_processor = AudioProcessor("127.0.0.1", 5000)
    try:
        signal.pause()
    except:
        audio_processor.stop()
