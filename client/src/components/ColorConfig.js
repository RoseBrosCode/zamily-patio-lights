import React from 'react';
import { HuePicker } from 'react-color';


export default function ColorConfig(props) {
  return (
    <div>
      <HuePicker color={props.currentColor} onChange={props.onColorChange} />
    </div>
  )
}
