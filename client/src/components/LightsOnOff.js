import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import useUpdateServer from 'hooks/useUpdateServer';

export default function LightsOnOff() {
  // set up state
  const [lightsPower, setLightsPower] = useState({
    stringsOn: false,
    grillOn: false
  });

  // set up handlers
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
      // TODO show error
    }
  }

  // set effects
  useUpdateServer({
    ...lightsPower
  },
  'lights-update-url',
  [lightsPower]
  )

  // render
  return (
    <div>
      <h2>Lights On/Off</h2>
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
    </div>
  )
}
