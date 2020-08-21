import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import LightsOnOff from 'components/LightsOnOff';
import GrillLightsControls from 'components/GrillLightsControls';

export default function App() {
  const [errors, setErrors] = useState([]);
  return (
    // <> is shorthand for declaring a React Fragment https://reactjs.org/docs/fragments.html#short-syntax
    <>
      <CssBaseline />
      <h1>Zamily Patio Controller</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper>
            <LightsOnOff />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper>
            <GrillLightsControls />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
