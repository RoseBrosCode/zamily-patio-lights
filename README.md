# zamily-patio-lights
Web app for controlling smart patio lights for Zamily

## `/raspberry-pi`

Contains code to be run on the Raspberry Pi server on the Zamily network.

### `/raspberry-pi/audio`

Contains python code that extracts audio features from an input audio device and sends them over OSC to the Particle. Uses [pyo](http://ajaxsoundstudio.com/pyodoc/) for audio processing.

## TODO
- Add music match (particle)
- Racer can be set to 0 length, which is effectively off (server)
- Changing Animation from Racer -> Color doesn't change the color to the color of the slider, it changes it to the last color (client)
- Breathing seems too fast (client/server)
- Racer resets position on color change (particle)
