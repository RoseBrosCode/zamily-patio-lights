import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

export default function DirectionButtons(props) {
    return (
        <>
          <Box>Choose direction:</Box>
          <Button
            name="leftDirectionButton"
            variant="contained"
            color={props.currentDirection === 0 ? 'primary' : 'default'}
            onClick={props.handleDirectionClick}
          >
            Left
          </Button>
          <Button
            name="rightDirectionButton"
            variant="contained"
            color={props.currentDirection === 1 ? 'primary' : 'default'}
            onClick={props.handleDirectionClick}
          >
            Right
          </Button>
        </>
      )
}
