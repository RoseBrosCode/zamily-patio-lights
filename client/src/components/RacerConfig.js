import React from 'react';
import SampledHuePicker from 'components/SampledHuePicker'
import SampledSlider from 'components/SampledSlider';
import DirectionButtons from 'components/DirectionButtons';


export default function RacerConfig(props) {
  return (
    <div>
      <p>Pick a color:</p>
      <SampledHuePicker
        defaultColors={props.defaultColors}
        onColorChange={props.onColorChange}
        sampleDelay={props.sampleDelay}
      />
      <p>Pick a speed:</p>
      <SampledSlider
        defaultValue={props.currentSpeed}
        onChange={props.onSpeedChange}
        sampleDelay={props.sampleDelay}
        aria-labelledby="continuous-slider"
        max={10}
        min={1}
      />
      <p>Set the tail length:</p>
      <SampledSlider
        defaultValue={props.currentTailLength}
        onChange={props.onTailLengthChange}
        sampleDelay={props.sampleDelay}
        aria-labelledby="continuous-slider"
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
