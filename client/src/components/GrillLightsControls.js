import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import NoConfig from 'components/NoConfig';
import ColorConfig from 'components/ColorConfig';
import ColorSpeedConfig from 'components/ColorSpeedConfig';
import RacerConfig from 'components/RacerConfig';
import RainbowConfig from 'components/RainbowConfig';

class GrillLightsControls extends Component {
  constructor(props) {
    super(props);

    // constants 
    this.DEFAULT_COLORS = {r: 252, g: 101, b: 20};
    this.SAMPLE_DELAY = 250;

    // initial state
    this.state = {
      animation: 0, // enum int: WARM: 0, SOLID: 1, RAINBOW: 2, BREATHE: 3, STROBE: 4, RACER: 5, MARQUEE: 6, MUSIC_FREQ: 7, MUSIC_TIBMRE: 8, MUSIC_BEAT: 9    
      red: this.DEFAULT_COLORS.r, // int 0-255
      green: this.DEFAULT_COLORS.g, // int 0-255
      blue: this.DEFAULT_COLORS.b, // int 0-255
      speed: 5, // int 1-10
      direction: 0, // int: 0 = left, 1 = right
      density: 0.5, // float 0.0-1.0
      tailLength: 250 // int (0-500)
    };

    // function bindings
    this.handleAnimationChange = this.handleAnimationChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
    this.handleTailLengthChange = this.handleTailLengthChange.bind(this);
    this.handleSpectralDensityChange = this.handleSpectralDensityChange.bind(this);
    this.handleDirectionClick = this.handleDirectionClick.bind(this);
  }

  handleAnimationChange(e) {
    this.setState({
      animation: parseInt(e.target.value)
    })
  }

  handleColorChange(color, e) {
    console.log('color change registered');
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

  handleTailLengthChange(e, tailLengthVal) {
    this.setState({
      tailLength: tailLengthVal
    })
  }

  handleSpectralDensityChange(e, densityVal) {
    this.setState({
      density: densityVal
    })
  }

  handleDirectionClick(e) {
    if (e.currentTarget.name === 'leftDirectionButton') {
      this.setState({
        direction: 0
      })

    } else if (e.currentTarget.name === 'rightDirectionButton') {
      this.setState({
        direction: 1
      })

    } else {
      console.log('Unexpected event...', e)
      // TODO show error
    }
  }

  render() { 
    const needsColorConfig = [1, 7];
    const needsColorSpeedConfig = [3, 4, 6];
    let neededConfig;

    console.log('rendering with state: ', this.state);
    
    if (this.state.animation === 0) { // default Warm
      neededConfig = <NoConfig />;

    } else if (needsColorConfig.includes(this.state.animation)) {
      neededConfig = (
        <ColorConfig
          defaultColors={this.DEFAULT_COLORS}
          onColorChange={this.handleColorChange}
          sampleDelay={this.SAMPLE_DELAY}
        />
      );

    } else if (needsColorSpeedConfig.includes(this.state.animation)) {
      neededConfig = (
        <ColorSpeedConfig 
          defaultColors={this.DEFAULT_COLORS}
          onColorChange={this.handleColorChange}
          currentSpeed={this.state.speed}
          onSpeedChange={this.handleSpeedChange}
          sampleDelay={this.SAMPLE_DELAY}
        />
      );

    } else if (this.state.animation === 2) { // Rainbow
      neededConfig = (
        <RainbowConfig 
          currentSpeed={this.state.speed}
          onSpeedChange={this.handleSpeedChange}
          currentSpectralDensity={this.state.density}
          onSpectralDensityChange={this.handleSpectralDensityChange}
          currentDirection={this.state.direction}
          handleDirectionClick={this.handleDirectionClick}
          sampleDelay={this.SAMPLE_DELAY}
        />
      );

    } else if (this.state.animation === 5) { // Racer
      neededConfig = (
        <RacerConfig 
          defaultColors={this.DEFAULT_COLORS}
          onColorChange={this.handleColorChange}
          currentSpeed={this.state.speed}
          onSpeedChange={this.handleSpeedChange}
          currentTailLength={this.state.tailLength}
          onTailLengthChange={this.handleTailLengthChange}
          currentDirection={this.state.direction}
          handleDirectionClick={this.handleDirectionClick}
          sampleDelay={this.SAMPLE_DELAY}
        />
      );

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
            <option value={7}>Music Match</option>
          </NativeSelect>
          <FormHelperText>Make the lights dance!</FormHelperText>
        </FormControl>
        {neededConfig}
      </div>
      
    )
  }
}

export default GrillLightsControls; 
