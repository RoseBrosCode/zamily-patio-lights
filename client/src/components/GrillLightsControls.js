import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import NoConfig from 'components/NoConfig';
import ColorConfig from 'components/ColorConfig';
import ColorSpeedConfig from 'components/ColorSpeedConfig';


class GrillLightsControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: 0, // enum int: WARM: 0, SOLID: 1, RAINBOW: 2, BREATHE: 3, STROBE: 4, RACER: 5, MARQUEE: 6, MUSIC_FREQ: 7, MUSIC_TIBMRE: 8, MUSIC_BEAT: 9    
      red: 0, // int 0-255 TODO - change to WARM default
      green: 0, // int 0-255 TODO - change to WARM default
      blue: 0, // int 0-255 TODO - change to WARM default
      speed: 5, // int 1-10
      direction: 1, // int: 0 = left, 1 = right
      density: 0.5, // float 0.0-1.0
      tailLength: 250 // int (0-500)
    };
    this.handleAnimationChange = this.handleAnimationChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);

  }

  handleAnimationChange(e) {
    console.log(e.target);
    this.setState({
      animation: parseInt(e.target.value)
    })
  }

  handleColorChange(color, e) {
    this.setState({
      red: color.rgb.r,
      green: color.rgb.g,
      blue: color.rgb.b
    })
  }

  handleSpeedChange(e, speedVal) {
    this.setState({
      speed: speedVal
    })
  }

  render() { 
    const currentColor = {
      r: this.state.red,
      g: this.state.green,
      b: this.state.blue
    };
    const needsNoConfig = [0, 7, 8];
    const needsColorConfig = [1, 9];
    const needsColorSpeedConfig = [3, 4, 6];
    let neededConfig;

    console.log('rendering with state: ', this.state);
    
    if (needsNoConfig.includes(this.state.animation)) {
      neededConfig = <NoConfig />;

    } else if (needsColorConfig.includes(this.state.animation)) {
      neededConfig = <ColorConfig currentColor={currentColor} onColorChange={this.handleColorChange} />;

    } else if (needsColorSpeedConfig.includes(this.state.animation)) {
      neededConfig = (
        <ColorSpeedConfig 
          currentColor={currentColor}
          onColorChange={this.handleColorChange}
          currentSpeed={this.state.speed}
          onSpeedChange={this.handleSpeedChange}
        />
      );

    } else if (this.state.animation === 2) { // Rainbow
      neededConfig = <p>TODO RainbowConfig Component</p>

    } else if (this.state.animation === 5) { // Racer
      neededConfig = <p>TODO RacerConfig Component</p>

    } else {
      console.log('invalid animation enum...');
      // TODO show error
    }

    return (
      <div>
        <h2>Grill Lights Controls</h2>
        <br />
        <FormControl>
          <InputLabel htmlFor="animation-selector">Select Animation</InputLabel>
          <NativeSelect
            value={this.state.animation}
            onChange={this.handleAnimationChange}
            inputProps={{
              name: 'animation',
              id: 'animation-selector',
            }}
          >
            <option aria-label="None" value="" />
            <option value={0}>Default Warm</option>
            <option value={1}>Solid Color</option>
            <option value={2}>Revolving Rainbow</option>
            <option value={3}>Breathing</option>
            <option value={4}>Strobe</option>
            <option value={5}>Racer</option>
            <option value={6}>Marquee</option>
            <option value={7}>Music Levels</option>
            <option value={8}>Music Texture</option>
            <option value={9}>Music Beat Match</option>
          </NativeSelect>
          <FormHelperText>Make the lights dance!</FormHelperText>
        </FormControl>
        {neededConfig}
      </div>
      
    )
  }
}

export default GrillLightsControls; 
