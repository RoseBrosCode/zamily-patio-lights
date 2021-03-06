import React, { useState, useRef } from 'react';
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
  const DEFAULT_COLORS = {r: props.initialState.red, g: props.initialState.green, b: props.initialState.blue};
  const SAMPLE_DELAY = 250;
  const ANIMATION_UPDATE_URL = useRef(window.location.origin + '/animation');

  // set up states
  const [animation, setAnimation] = useState(props.initialState.animation); // enum int: WARM: 0, SOLID: 1, RAINBOW: 2, BREATHE: 3, STROBE: 4, RACER: 5, MARQUEE: 6, MUSIC_MATCH: 7
  const [color, setColor] = useState({
    red: DEFAULT_COLORS.r, // int 0-255
    green: DEFAULT_COLORS.g, // int 0-255
    blue: DEFAULT_COLORS.b, // int 0-255
  })
  const [speed, setSpeed] = useState(props.initialState.speed); // float 0.0-1.0
  const [direction, setDirection] = useState(props.initialState.direction) // int: 0 = left, 1 = right
  const [density, setDensity] = useState(props.initialState.density) // float 0.0-1.0
  const [tailLength, setTailLength] = useState(props.initialState.tailLength) // int (0-500)

  // set up handlers
  /**
   * Called when a new animation is selected from the form input
   * @param {*} e event from the select input
   */
  function handleAnimationChange(e) {
    setAnimation(parseInt(e.target.value))
  }

  /**
   * Called when the user has changed the slider that controls the color for a lighting animation
   * @param {Object} newColor RGB color array to be set as the new animation color
   * @param {Object} e Supposedly an event per https://casesandberg.github.io/react-color/#api-onChange, but ends up undefined
   */
  function handleColorChange(newColor, e) {
    setColor({
      red: newColor.rgb.r,
      green: newColor.rgb.g,
      blue: newColor.rgb.b
    })
  }

  /**
   * Called when the user has changed the slider that controls the speed for a lighting animation
   * @param {Object} e event from slider control
   * @param {Int} speedVal Int to be set as the new speed value
   */
  function handleSpeedChange(e, speedVal) {
    console.log('this is the speed e', e)
    setSpeed(speedVal)
  }

  /**
   * Called when a user taps one of the buttons that control the direction of a lighting animation
   * @param {Object} e event from the button that was tapped indicating the direction
   */
  function handleDirectionClick(e) {
    if (e.currentTarget.name === 'leftDirectionButton') {
      setDirection(0)

    } else if (e.currentTarget.name === 'rightDirectionButton') {
      setDirection(1)

    } else {
      console.log('Unexpected event...', e)
      props.setErrorMsgs(['Whoops! That is not a button we recognize...'])
    }
  }

  /**
   * Called when the user has changed the slider that controls the spectral density for a lighting animation
   * @param {Object} e event from slider control
   * @param {Int} densityVal Int to be set as the new density value
   */
  function handleSpectralDensityChange(e, densityVal) {
    setDensity(densityVal)
  }

  /**
   * Called when the user has changed slider that controls the the tail length for a lighting animation
   * @param {Object} e event from slider control
   * @param {Int} tailLengthVal Int to be set as the new tail length value
   */
  function handleTailLengthChange(e, tailLengthVal) {
    setTailLength(tailLengthVal)
  }

  /* not needed now, saving for potential future use
  function updateEntireState(fetchedState) {
    setAnimation(fetchedState.animation)
    setColor({
      red: fetchedState.red,
      green: fetchedState.green,
      blue: fetchedState.blue
    })
    setSpeed(fetchedState.speed)
    setDirection(fetchedState.direction)
    setDensity(fetchedState.density)
    setTailLength(fetchedState.tailLength)
  }
  */

  // set effects
  useUpdateServer(
    {
      animation: animation,
      ...color,
      speed: speed,
      direction: direction,
      density: density,
      tailLength: tailLength
    },
    ANIMATION_UPDATE_URL.current,
    props.setErrorMsgs,
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
    props.setErrorMsgs(['Whoops! That animation is not recognized.'])
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
