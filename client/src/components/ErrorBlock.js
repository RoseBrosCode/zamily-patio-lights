import React from 'react';
import Box from '@material-ui/core/Box';

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

  /**
   * Uses the state setter passed through props (setErrorMsgs) to directly update the error React state when users clears all errors
   */
  function clearErrorMsgs() {
    props.setErrorMsgs([])
  }

  return (
    <>
      <Box p={2}>
        {props.errorMsgs.length > 0 &&
          <div>
            <div>
              <Box fontWeight="fontWeightBold" fontSize="1em">Something Went Wrong </Box>
              <div>
                {props.errorMsgs.map((msg, idx) =>
                  <div key={idx}>{msg} <button id={idx} onClick={(e) => {updateErrorMsgs(e.target.id)}}>X</button></div>
                )}
              </div>
            </div>
            <div>
              <button onClick={() => {clearErrorMsgs()}}>Clear All</button>
            </div>
          </div>
        }
      </Box>
    </>
  ) 
}
