import React from 'react';
import Box from '@material-ui/core/Box';
import SampledSlider from 'components/SampledSlider';
import DirectionButtons from 'components/DirectionButtons';


export default function RainbowConfig(props) {
  return (
    <div>
      <Box>Pick a speed:</Box>
      <SampledSlider
        defaultValue={props.currentSpeed}
        onChange={props.onSpeedChange}
        sampleDelay={props.sampleDelay}
        max={1.0}
        min={0.0}
        step={0.01}
      />
      <Box>Set the spectral density:</Box>
      <SampledSlider
        defaultValue={props.currentSpectralDensity}
        onChange={props.onSpectralDensityChange}
        sampleDelay={props.sampleDelay}
        max={1.0}
        min={0.0}
        step={0.01}
      />
      <DirectionButtons
        currentDirection={props.currentDirection}
        handleDirectionClick={props.handleDirectionClick}
      />
    </div>
  )
}
