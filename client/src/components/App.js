import React from 'react';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import LightsOnOff from 'components/LightsOnOff';
import GrillLightsControls from 'components/GrillLightsControls';

export default function App() {
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

  // render
  return (
    // <> is shorthand for declaring a React Fragment https://reactjs.org/docs/fragments.html#short-syntax
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box p={2} fontWeight="fontWeightBold" fontSize="2em">Zamily Patio Controller</Box>
        <Box px={2}>
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
        </Box>
      </ThemeProvider>
      
    </>
  );
}
