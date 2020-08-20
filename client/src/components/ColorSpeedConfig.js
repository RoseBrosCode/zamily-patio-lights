import React from 'react';
import { HuePicker } from 'react-color';
import Slider from '@material-ui/core/Slider';


export default function ColorSpeedConfig(props) {
  return (
    <div>
      <p>Pick a color:</p>
      <HuePicker color={props.currentColor} onChange={props.onColorChange} />
      <p>Pick a speed:</p>
      <Slider
        value={props.currentSpeed}
        onChange={props.onSpeedChange}
        aria-labelledby="continuous-slider"
        max={10}
        min={1}
      />
    </div>
  )
}
