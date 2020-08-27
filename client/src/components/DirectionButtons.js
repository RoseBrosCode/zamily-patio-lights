import React from 'react';
import Button from '@material-ui/core/Button';

export default function DirectionButtons(props) {
    return (
        <>
          <p>Choose direction:</p>
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
