import React from 'react';
import Box from '@material-ui/core/Box';
import SampledHuePicker from 'components/SampledHuePicker'
import SampledSlider from 'components/SampledSlider';
import DirectionButtons from 'components/DirectionButtons';


export default function RacerConfig(props) {
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
      <Box>Set the tail length:</Box>
      <SampledSlider
        defaultValue={props.currentTailLength}
        onChange={props.onTailLengthChange}
        sampleDelay={props.sampleDelay}
        max={500}
        min={0}
      />
      <DirectionButtons
        currentDirection={props.currentDirection}
        handleDirectionClick={props.handleDirectionClick}
      />
    </div>
  )
}
