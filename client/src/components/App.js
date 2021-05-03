import React, { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
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

  // set up theme
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#ad1457',
          },
          secondary: {
            main: '#2e7d32',
          },
        },
      }),
    [prefersDarkMode],
  );

  // set up state
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsgs, setErrorMsgs] = useState([]);

  // initialize children state from the server
  const lightsOnOffInitial = useRef({});
  const grillLightsControlsInitial = useRef({});
  
  useEffect(() => {
    var tempErrorMsgs = []
    
    // fetch initial server state
    fetch(STATE_URL.current)
    .then(response => {
      if (response.ok) {
        
        response.json().then(data => {
          console.log('Success:', data);
          if ("stringsOn" in data && "grillOn" in data) {
            // power data should be good to go
            tempErrorMsgs.concat(["Test Error Message. Test Error Message. Test Error Message. Test Error Message. Test Error Message."])
            lightsOnOffInitial.current = {
              stringsOn: data.stringsOn,
              grillOn: data.grillOn
            };
          } else {
            tempErrorMsgs.concat(["Couldn't read the current power state of the lights from the server. Arbitrary defaults set."])
            lightsOnOffInitial.current = LIGHTSONOFF_FALLBACK_DEFAULT.current;
          }
          if ("animation" in data && "red" in data && "green" in data && "blue" in data && "speed" in data && "direction" in data && "density" in data && "tailLength" in data) {
            // animation data should be good to go
            tempErrorMsgs.concat(["Test Error Message 2. Test Error Message 2. Test Error Message 2. Test Error Message 2. Test Error Message 2."])
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
          } else {
            tempErrorMsgs.concat(["Couldn't read the current animation state of the lights from the server. Arbitrary defaults set."])
            console.log("animation response not present");
            grillLightsControlsInitial.current = GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current;
          }
          
          setIsLoading(false)
          console.log(tempErrorMsgs)
          setErrorMsgs(tempErrorMsgs)
        })
        .catch((error) => { // handle issue parsing JSON
          console.log('Issue parsing JSON! Error: ', error);
          tempErrorMsgs.concat(['Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
          lightsOnOffInitial.current = LIGHTSONOFF_FALLBACK_DEFAULT.current;
          grillLightsControlsInitial.current = GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current;
          setIsLoading(false)
          setErrorMsgs(tempErrorMsgs)
        });
      } else {
        console.log('Issue with Response: ', response);
        tempErrorMsgs.concat(['Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
        lightsOnOffInitial.current = LIGHTSONOFF_FALLBACK_DEFAULT.current;
        grillLightsControlsInitial.current = GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current;
        setIsLoading(false)
        setErrorMsgs(tempErrorMsgs)
      }
    })
    .catch((error) => {
      console.error('Error from the fetch:', error);
      tempErrorMsgs.concat(['Warning - the state of the lights was not successfully received from the server. Arbitrary defaults set'])
      lightsOnOffInitial.current = LIGHTSONOFF_FALLBACK_DEFAULT.current;
      grillLightsControlsInitial.current = GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current;
      setIsLoading(false)
      setErrorMsgs(tempErrorMsgs)
    });
    
  }, [])

    /**
   * Adds an array of error strings to the existing state.
   * @param {Array} errArray Each element is a user-facing error message string.
   */
    function updateErrors(errArray) {
      if (!errArray.some( el => errorMsgs.includes(el))){ // don't duplicate errors. h/t https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
        console.log("current error messages: ", [...errorMsgs]);
        setErrorMsgs([...errorMsgs].concat(errArray))
      }
    }

  // render
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Backdrop open={true} >
          <CircularProgress />
        </Backdrop>
      </ThemeProvider>
      
    )
  } else {
    console.log("rendered App.js");
    return (
      // <> is shorthand for declaring a React Fragment https://reactjs.org/docs/fragments.html#short-syntax
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box p={2} fontWeight="fontWeightBold" fontSize="2em">Zamily Patio Controller</Box>
          {errorMsgs.length > 0 &&
            <Box px={2} pb={2}>
              <Paper>
                <ErrorBlock errorMsgs={errorMsgs} setErrorMsgs={setErrorMsgs}/>
              </Paper>
            </Box>
          }
          <Box px={2}>
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
          </Box>
          
        </ThemeProvider>
        
      </>
    );
  }
}
