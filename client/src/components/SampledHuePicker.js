import React, { Component } from 'react';
import { HuePicker } from 'react-color';
import throttle from 'lodash/throttle';

class SampledHuePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.defaultColors
    };

    this.onStableColorChange = props.onColorChange;
    this.onEveryColorChange = this.onEveryColorChange.bind(this);
    
    this.throttle = throttle((fn, updatedColor) => {
      fn(updatedColor)
    }, props.sampleDelay)

  }

  onEveryColorChange(updatedColor, e) {
    this.throttle(this.onStableColorChange, updatedColor);
    this.setState({
      color: updatedColor
    })
  }

  render() {
    return (
      <HuePicker color={this.state.color} onChange={this.onEveryColorChange} />
    ) 
  }

}

export default SampledHuePicker;