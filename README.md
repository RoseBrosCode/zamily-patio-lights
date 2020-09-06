# zamily-patio-lights
Web app for controlling smart patio lights for Zamily

## `/raspberry-pi`

Contains code to be run on the Raspberry Pi server on the Zamily network.

### `/raspberry-pi/audio`

Contains python code that extracts audio features from an input audio device and sends them over OSC to the Particle. Uses [pyo](http://ajaxsoundstudio.com/pyodoc/) for audio processing.
