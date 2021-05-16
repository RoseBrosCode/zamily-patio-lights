import React from 'react';
import Box from '@material-ui/core/Box';
import SampledHuePicker from 'components/SampledHuePicker'

export default function ColorConfig(props) {
  return (
    <div>
      <Box>Pick a color:</Box>
      <SampledHuePicker
        defaultColors={props.defaultColors}
        onColorChange={props.onColorChange}
        sampleDelay={props.sampleDelay}
      />
    </div>
  )
}
