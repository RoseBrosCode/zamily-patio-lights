import { useUpdateEffect } from 'react-use';

export default function useUpdateServer(updateData, updateURL, setErrorMsgs, deps, isLoading) {
  useUpdateEffect(() => {

    if (isLoading) { 
      console.log('Not fetching data - still loading.')
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
          console.log('Success:', response);
        } else {
          console.log('Issue with Response: ', response);
          setErrorMsgs(['Update failed - there was an issue contacting the server.'])
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMsgs(['Update failed - there was an issue contacting the server.'])
      });
    } 
  }, deps)
}
