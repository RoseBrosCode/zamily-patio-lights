import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { HuePicker } from 'react-color';
import { useThrottledFn } from 'beautiful-react-hooks'; 

export default function SampledHuePicker(props) {
  const [colorValue, setColorValue] = useState(props.defaultColors)

  const stableColorHandler = useThrottledFn(props.onColorChange, props.sampleDelay, {leading: true, trailing: true}, []);

  function onEveryColorChange(updatedColor, e) {
    stableColorHandler(updatedColor)
    setColorValue(updatedColor)
  }

  return (
    <Box py={2.5}>
      <HuePicker color={colorValue} onChange={onEveryColorChange} />
    </Box>
  ) 

}
