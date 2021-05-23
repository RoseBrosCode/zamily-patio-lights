import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function DirectionButtons(props) {
    return (
        <>
          <Box>Choose direction:</Box>
          <Box py={2}>
            <Grid container align="center" alignItems="center" justify="center" spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  name="leftDirectionButton"
                  variant="contained"
                  color={props.currentDirection === 0 ? 'primary' : 'default'}
                  onClick={props.handleDirectionClick}
                >
                  Left
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  name="rightDirectionButton"
                  variant="contained"
                  color={props.currentDirection === 1 ? 'primary' : 'default'}
                  onClick={props.handleDirectionClick}
                >
                  Right
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )
}
