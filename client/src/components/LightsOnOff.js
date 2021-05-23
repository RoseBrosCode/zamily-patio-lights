import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import useUpdateServer from 'hooks/useUpdateServer';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorBlock from 'components/ErrorBlock'

export default function LightsOnOff() {
  // constants
  const STATE_URL = useRef(window.location.origin + '/state?component=power');
  const LIGHTS_UPDATE_URL = useRef(window.location.origin + '/lights');
  const LIGHTSONOFF_FALLBACK_DEFAULT = useRef({
    stringsOn: false,
    grillOn: false
  });

  // set up state
  const [lightsPower, setLightsPower] = useState(LIGHTSONOFF_FALLBACK_DEFAULT.current);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsgs, setErrorMsgs] = useState([]);

  /**
   * Adds an array of error strings to the existing state.
   * @param {Array} errArray Each element is a user-facing error message string.
   */
  function updateErrors(errArray) {
    if (!errArray.some( el => errorMsgs.includes(el))){ // don't duplicate errors. h/t https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
      setErrorMsgs([...errorMsgs].concat(errArray))
    }
  }

  // get state from server
  // TODO - centralize this and the very similar code from GrillLightsControls.js into a shared custom hook. Refactor to use async/await at that time too.
  useEffect(() => {    
    // fetch initial server state
    fetch(STATE_URL.current)
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log('Lights State Fetch Response::', data);
          if ("stringsOn" in data && "grillOn" in data) {
            // power data should be good to go
            setLightsPower({
              stringsOn: data.stringsOn,
              grillOn: data.grillOn
            });
          } else {
            setErrorMsgs(errorMsgs => [...errorMsgs, "Couldn't read the current power state of the lights from the server. Arbitrary defaults set."])
          }
          setIsLoading(false)
        })
        .catch((error) => { // handle issue parsing JSON
          console.log('Issue parsing JSON! Error: ', error);
          setErrorMsgs(errorMsgs => [...errorMsgs, 'Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
          setIsLoading(false)
        });
      } else {
        console.log('Issue with Response: ', response);
        setErrorMsgs(errorMsgs => [...errorMsgs, 'Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
        setIsLoading(false)
      }
    })
    .catch((error) => {
      console.error('Error from the fetch:', error);
      setErrorMsgs(errorMsgs => [...errorMsgs, 'Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
      setIsLoading(false)
    });
    
  }, [])

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
      setErrorMsgs([...errorMsgs, 'Whoops! That is not a button we recognize...'])
    }
  }

  // set effects
  useUpdateServer(
    {
      ...lightsPower 
    },
    LIGHTS_UPDATE_URL.current,
    updateErrors,
    isLoading,
    [lightsPower]
  )

  // render
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    )
  } else {
    return (
      <Box p={2}>
        <Box pb={2} fontWeight="fontWeightBold" fontSize="1.5em">Turn Lights On/Off</Box>
        {errorMsgs.length > 0 &&
          <ErrorBlock errorMsgs={errorMsgs} setErrorMsgs={setErrorMsgs}/>
        }
        <Grid container align="center" alignItems="center" justify="center" spacing={2}>
          <Grid item lg={3} xs={6}>
            <Button
              fullWidth
              name="strings"
              variant="contained"
              color={lightsPower.stringsOn && !lightsPower.grillOn ? 'primary' : 'default'}
              onClick={handleClick}
            >
              Strings Only
            </Button>
          </Grid>
          <Grid item lg={3} xs={6}>
            <Button
              fullWidth
              name="grill"
              variant="contained"
              color={!lightsPower.stringsOn && lightsPower.grillOn ? 'primary' : 'default'}
              onClick={handleClick}
            >
              Grill Only
            </Button>
          </Grid>
          <Grid item lg={3} xs={6}>
            <Button
              fullWidth
              name="bothOn"
              variant="contained"
              color={lightsPower.stringsOn && lightsPower.grillOn ? 'primary' : 'default'}
              onClick={handleClick}
            >
              Both On
            </Button>
          </Grid>
          <Grid item lg={3} xs={6}>
            <Button
              fullWidth
              name="bothOff"
              variant="contained"
              color={!lightsPower.stringsOn && !lightsPower.grillOn ? 'primary' : 'default'}
              onClick={handleClick}
            >
              Both Off
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }
}
