import React from 'react';
import Box from '@material-ui/core/Box';
import SampledHuePicker from 'components/SampledHuePicker'
import SampledSlider from 'components/SampledSlider';


export default function ColorSpeedConfig(props) {
  return (
    <div>
      <Box>Pick a color:</Box>
      <SampledHuePicker
        defaultColors={props.defaultColors}
        onColorChange={props.onColorChange}
        sampleDelay={props.sampleDelay}
      />
      <Box>Pick a speed:</Box>
      <SampledSlider
        defaultValue={props.currentSpeed}
        onChange={props.onSpeedChange}
        sampleDelay={props.sampleDelay}
        max={1.0}
        min={0.0}
        step={0.01}
      />
    </div>
  )
}
