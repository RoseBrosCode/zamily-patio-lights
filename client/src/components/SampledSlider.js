import React, { useState } from 'react';
import Slider from '@material-ui/core/Slider';
import { useThrottledFn } from 'beautiful-react-hooks'; 

export default function SampledSlider(props) {
  const [sliderValue, setSliderValue] = useState(props.defaultValue);
  
  const stableSliderHandler = useThrottledFn(props.onChange, props.sampleDelay, {leading: true, trailing: true}, []);

  function onEverySliderChange(e, updatedVal) {
    stableSliderHandler(e, updatedVal)
    setSliderValue(updatedVal)
  }

  return (
      <Slider
      value={sliderValue}
      onChange={onEverySliderChange}
      aria-labelledby="continuous-slider"
      max={props.max}
      min={props.min}
      step={props.step ? props.step : 1}
    />
  ) 
}
