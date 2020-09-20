import React, { useState, useEffect, useRef } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import LightsOnOff from 'components/LightsOnOff';
import GrillLightsControls from 'components/GrillLightsControls';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorBlock from 'components/ErrorBlock'

export default function App() {
  // constants
  const STATE_URL = useRef(window.location.origin + '/state');
  const LIGHTSONOFF_FALLBACK_DEFAULT = useRef({
    stringsOn: false,
    grillOn: false
  });
  const GRILLLIGHTSCONTROL_FALLBACK_DEFAULT = useRef({
    animation: 0,
    red: 252,
    green: 101,
    blue: 20,
    speed: 0.5,
    direction: 0,
    density: 0.5,
    tailLength: 250
  });

  // set up state
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsgs, setErrorMsgs] = useState([]);

  // initialize children state from the server
  const lightsOnOffInitial = useRef({});
  const grillLightsControlsInitial = useRef({});
  
  useEffect(() => {
    // fetch initial server state
    fetch(STATE_URL.current)
    .then(response => {
      if (response.ok) {
        console.log('Success:', response);
        response.json().then(data => {
          lightsOnOffInitial.current = {
            stringsOn: data.stringsOn,
            grillOn: data.grillOn
          };
          grillLightsControlsInitial.current = {
            animation: data.animation,
            red: data.red,
            green: data.green,
            blue: data.blue,
            speed: data.speed,
            direction: data.direction,
            density: data.density,
            tailLength: data.tailLength
          };
          setIsLoading(false) 
        })
        .catch((error) => { // handle issue parsing JSON
          console.log('Issue parsing JSON! Error: ', error);
          setErrorMsgs(['Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
          lightsOnOffInitial.current = LIGHTSONOFF_FALLBACK_DEFAULT.current;
          grillLightsControlsInitial.current = GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current;
          setIsLoading(false) 
        });
      } else {
        console.log('Issue with Response: ', response);
        setErrorMsgs(['Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
        lightsOnOffInitial.current = LIGHTSONOFF_FALLBACK_DEFAULT.current;
        grillLightsControlsInitial.current = GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current;
        setIsLoading(false) 
      }
    })
    .catch((error) => {
      console.error('Error from the fetch:', error);
      setErrorMsgs(['Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
      lightsOnOffInitial.current = LIGHTSONOFF_FALLBACK_DEFAULT.current;
      grillLightsControlsInitial.current = GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current;
      setIsLoading(false) 
    });
    
  }, [])

  /**
   * Adds an array of error strings to the existing state.
   * @param {Array} errArray Each element is a user-facing error message string.
   */
  function updateErrors(errArray) { 
    if (!errArray.some( el => errorMsgs.includes(el))){ // don't duplicate errors. h/t https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
      setErrorMsgs([...errorMsgs].concat(errArray))
    }
  }

  // render
  if (isLoading) {
    return (
      <Backdrop open={true} >
        <CircularProgress />
      </Backdrop>
    )
  } else {
    return (
      // <> is shorthand for declaring a React Fragment https://reactjs.org/docs/fragments.html#short-syntax
      <>
        <CssBaseline />
        <h1>Zamily Patio Controller</h1>
        <ErrorBlock errorMsgs={errorMsgs} setErrorMsgs={setErrorMsgs}/>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper>
              <LightsOnOff currentErrors={errorMsgs} setErrorMsgs={updateErrors} initialState={lightsOnOffInitial.current} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <GrillLightsControls currentErrors={errorMsgs} setErrorMsgs={updateErrors} initialState={grillLightsControlsInitial.current} />
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
}
