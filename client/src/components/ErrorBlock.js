import React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export default function ErrorBlock(props) {

  /**
   * Uses the state setter passed through props (setErrorMsgs) to directly update the error React state when users clear individual errors
   * @param {Int} errToDelete index of the error to delete
   */
  function updateErrorMsgs(errToDelete) {
    let toDelete = [...props.errorMsgs];
    toDelete.splice(errToDelete, 1)
    props.setErrorMsgs(toDelete)
  }

  return (
    <>
      <Box pb={2}>
        <Paper style={{"background-color": "#f44336"}} elevation={2}>
        <Box px={2} py={1} fontWeight="fontWeightBold" fontSize="1.1em">An Error Occurred</Box>
        <Divider />
          {props.errorMsgs.length > 0 &&
            <Box pb={1}>
              <List disablePadding dense>
                {props.errorMsgs.map((msg, idx) =>
                  <ListItem divider key={idx}>
                    <ListItemText
                      primary={msg}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={(e) => {updateErrorMsgs(e.target.id)}}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            </Box>
          }
        </Paper>
      </Box>
    </>
  ) 
}
