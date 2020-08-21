import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import NoConfig from 'components/NoConfig';
import ColorConfig from 'components/ColorConfig';
import ColorSpeedConfig from 'components/ColorSpeedConfig';
import RacerConfig from 'components/RacerConfig';
import RainbowConfig from 'components/RainbowConfig';
import useUpdateServer from 'hooks/useUpdateServer';

export default function GrillLightsControls(props) {
  // constants
  const DEFAULT_COLORS = {r: 252, g: 101, b: 20};
  const SAMPLE_DELAY = 250;
  
  // set up states
  const [animation, setAnimation] = useState(0); // enum int: WARM: 0, SOLID: 1, RAINBOW: 2, BREATHE: 3, STROBE: 4, RACER: 5, MARQUEE: 6, MUSIC_MATCH: 7
  const [color, setColor] = useState({
    red: DEFAULT_COLORS.r, // int 0-255
    green: DEFAULT_COLORS.g, // int 0-255
    blue: DEFAULT_COLORS.b, // int 0-255
  })
  const [speed, setSpeed] = useState(5); // int 1-10
  const [direction, setDirection] = useState(0) // int: 0 = left, 1 = right
  const [density, setDensity] = useState(0.5) // float 0.0-1.0
  const [tailLength, setTailLength] = useState(250) // int (0-500)

  // set up handlers
  function handleAnimationChange(e) {
    setAnimation(parseInt(e.target.value))
  }

  function handleColorChange(newColor, e) {
    console.log('color change registered');
    setColor({
      red: newColor.rgb.r,
      green: newColor.rgb.g,
      blue: newColor.rgb.b
    })
  }

  function handleSpeedChange(e, speedVal) {
    setSpeed(speedVal)
  }

  function handleDirectionClick(e) {
    if (e.currentTarget.name === 'leftDirectionButton') {
      setDirection(0)

    } else if (e.currentTarget.name === 'rightDirectionButton') {
      setDirection(1)

    } else {
      console.log('Unexpected event...', e)
      // TODO show error
    }
  }

  function handleSpectralDensityChange(e, densityVal) {
    setDensity(densityVal)
  }

  function handleTailLengthChange(e, tailLengthVal) {
    setTailLength(tailLengthVal)
  }

  // set effects
  // 
  useUpdateServer({
    animation: animation,
    ...color,
    speed: speed,
    direction: direction,
    density: density,
    tailLength: tailLength
  },
  'grill-update-url',
  [animation, color, speed, direction, density, tailLength] 
  )


  // set up the necessary config to render
  let neededConfig;
  
  if (animation === 0) { // default Warm
    neededConfig = <NoConfig />;

  } else if ([1, 7].includes(animation)) { // Solid Color and Music Match
    neededConfig = (
      <ColorConfig
        defaultColors={DEFAULT_COLORS}
        onColorChange={handleColorChange}
        sampleDelay={SAMPLE_DELAY}
      />
    );

  } else if ([3, 4, 6].includes(animation)) { // Breathe, Strobe, and Marquee
    neededConfig = (
      <ColorSpeedConfig 
        defaultColors={DEFAULT_COLORS}
        onColorChange={handleColorChange}
        currentSpeed={speed}
        onSpeedChange={handleSpeedChange}
        sampleDelay={SAMPLE_DELAY}
      />
    );

  } else if (animation === 2) { // Rainbow
    neededConfig = (
      <RainbowConfig 
        currentSpeed={speed}
        onSpeedChange={handleSpeedChange}
        currentSpectralDensity={density}
        onSpectralDensityChange={handleSpectralDensityChange}
        currentDirection={direction}
        handleDirectionClick={handleDirectionClick}
        sampleDelay={SAMPLE_DELAY}
      />
    );

  } else if (animation === 5) { // Racer
    neededConfig = (
      <RacerConfig 
        defaultColors={DEFAULT_COLORS}
        onColorChange={handleColorChange}
        currentSpeed={speed}
        onSpeedChange={handleSpeedChange}
        currentTailLength={tailLength}
        onTailLengthChange={handleTailLengthChange}
        currentDirection={direction}
        handleDirectionClick={handleDirectionClick}
        sampleDelay={SAMPLE_DELAY}
      />
    );

  } else {
    console.log('invalid animation enum...');
    // TODO show error
  }

  // render
  return (
    <div>
      <h2>Grill Lights Controls</h2>
      <br />
      <FormControl>
        <InputLabel htmlFor="animation-selector">Select Animation</InputLabel>
        <NativeSelect
          value={animation}
          onChange={handleAnimationChange}
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
