import React from 'react';
import SampledSlider from 'components/SampledSlider';
import DirectionButtons from 'components/DirectionButtons';


export default function RainbowConfig(props) {
  return (
    <div>
      <p>Pick a speed:</p>
      <SampledSlider
        defaultValue={props.currentSpeed}
        onChange={props.onSpeedChange}
        sampleDelay={props.sampleDelay}
        max={1.0}
        min={0.0}
        step={0.01}
      />
      <p>Set the spectral density:</p>
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
