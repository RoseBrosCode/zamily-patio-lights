import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import useUpdateServer from 'hooks/useUpdateServer';

export default function LightsOnOff(props) {
  // constants
  const LIGHTS_UPDATE_URL = useRef(window.location.origin + '/lights');

  // set up state
  const [lightsPower, setLightsPower] = useState(props.initialState);

  // set up handlers
  /**
   * Called when a user taps one of the buttons that updates the power state of the lights 
   * @param {Object} e event from the button that was tapped the desired lighting power state
   */
  function handleClick(e) {
    if (e.currentTarget.name === 'strings') {
      setLightsPower({
        stringsOn: true,
        grillOn: false
      });

    } else if (e.currentTarget.name === 'grill') {
      setLightsPower({
        stringsOn: false,
        grillOn: true
      });

    } else if (e.currentTarget.name === 'bothOn' ) {
      setLightsPower({
        stringsOn: true,
        grillOn: true
      });

    } else if (e.currentTarget.name === 'bothOff') {
      setLightsPower({
        stringsOn: false,
        grillOn: false
      });

    } else {
      console.log('Unexpected event...', e)
      props.setErrorMsgs(['Whoops! That is not a button we recognize...'])
    }
  }

  // set effects
  useUpdateServer(
    {
      ...lightsPower 
    },
    LIGHTS_UPDATE_URL.current,
    props.setErrorMsgs,
    [lightsPower]
  )

  // render
  console.log("rendered LightsOnOff.js");
  return (
    <Box p={2}>
      <Box fontWeight="fontWeightBold" fontSize="1.5em">Turn Lights On/Off</Box>
      <br />
      <Button
        name="strings"
        variant="contained"
        color={lightsPower.stringsOn && !lightsPower.grillOn ? 'primary' : 'default'}
        onClick={handleClick}
      >
        Strings Only
      </Button>
      <Button
        name="grill"
        variant="contained"
        color={!lightsPower.stringsOn && lightsPower.grillOn ? 'primary' : 'default'}
        onClick={handleClick}
      >
        Grill Only
      </Button>
      <Button
        name="bothOn"
        variant="contained"
        color={lightsPower.stringsOn && lightsPower.grillOn ? 'primary' : 'default'}
        onClick={handleClick}
      >
        Both On
      </Button>
      <Button
        name="bothOff"
        variant="contained"
        color={!lightsPower.stringsOn && !lightsPower.grillOn ? 'primary' : 'default'}
        onClick={handleClick}
      >
        Both Off
      </Button>
    </Box>
  )
}
