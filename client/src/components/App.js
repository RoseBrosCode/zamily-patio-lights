import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import LightsOnOff from 'components/LightsOnOff';
import GrillLightsControls from 'components/GrillLightsControls';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function App() {
  // set up state
  const [isLoading, setIsLoading] = useState(true);

  // initialize children state from the server
  const lightsOnOffInitial = useRef({});
  const grillLightsControlsInitial = useRef({});
  useEffect(() => {
    // TODO implement actual data fetching
    console.log('getting initial state from server');
    lightsOnOffInitial.current = {
      stringsOn: false,
      grillOn: false
    };
    grillLightsControlsInitial.current = {
      animation: 1,
      red: 200,
      green: 200,
      blue: 200,
      speed: 7,
      direction: 1,
      density: 0.7,
      tailLength: 377
    }
    setTimeout(() => {setIsLoading(false)}, 3000) // simulate loading time
  }, [])

  console.log(isLoading);

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
        {/* TODO add error component */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper>
              <LightsOnOff initialState={lightsOnOffInitial.current} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <GrillLightsControls initialState={grillLightsControlsInitial.current} />
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
}
