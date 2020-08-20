import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import throttle from 'lodash/throttle';

class SampledSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue
    };

    this.onStableSliderChange = props.onChange;
    this.onEverySliderChange = this.onEverySliderChange.bind(this);
    
    this.throttle = throttle((fn, e, updatedVal) => {
      fn(e, updatedVal)
    }, props.sampleDelay)

  }

  onEverySliderChange(e, updatedVal) {
    this.throttle(this.onStableSliderChange, e, updatedVal);
    this.setState({
      value: updatedVal
    })
  }

  render() {
    return (
        <Slider
        value={this.state.value}
        onChange={this.onEverySliderChange}
        aria-labelledby="continuous-slider"
        max={this.props.max}
        min={this.props.min}
        step={this.props.step ? this.props.step : 1}
      />
    ) 
  }

}

export default SampledSlider;