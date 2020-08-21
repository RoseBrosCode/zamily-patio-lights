import { useUpdateEffect } from 'react-use';

export default function useUpdateServer(updateData, updateURL, deps) {
  useUpdateEffect(() => {
    // TODO implement actual data sending and error handling
    console.log('will send data: ', updateData);
    console.log('sending to: ', updateURL)
    
  }, deps)
}
