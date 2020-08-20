import React from 'react';
import SampledHuePicker from 'components/SampledHuePicker'

export default function ColorConfig(props) {
  return (
    <div>
      <SampledHuePicker
        defaultColors={props.defaultColors}
        onColorChange={props.onColorChange}
        sampleDelay={props.sampleDelay}
      />
    </div>
  )
}
