import React from 'react';
import SampledHuePicker from 'components/SampledHuePicker'
import SampledSlider from 'components/SampledSlider';


export default function ColorSpeedConfig(props) {
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
    </div>
  )
}
