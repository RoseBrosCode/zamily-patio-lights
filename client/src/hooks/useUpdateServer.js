import { useUpdateEffect } from 'react-use';

export default function useUpdateServer(updateData, updateURL, setErrorMsgs, isLoading, deps) {
  useUpdateEffect(() => {

    // TODO - update to use async/await
    if (isLoading) { 
      console.log('Not sending data - still loading.')
    } else {
      console.log('Sending data: ', updateData);
      console.log('Sending to: ', updateURL)
      fetch(updateURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      .then(response => {
        if (response.ok) {
          console.log('Response to server update request:', response);
        } else {
          console.log('Issue with Response: ', response);
          setErrorMsgs(['Update failed - there was an issue updating the server.'])
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMsgs(['Update failed - there was an issue updating the server.'])
      });
    } 
  }, deps)
}
