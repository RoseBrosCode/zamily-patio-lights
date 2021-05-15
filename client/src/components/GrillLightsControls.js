import React, { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorBlock from 'components/ErrorBlock'

export default function GrillLightsControls(props) {
  // constants
  const SAMPLE_DELAY = 250;
  const STATE_URL = useRef(window.location.origin + '/state?component=animation');
  const ANIMATION_UPDATE_URL = useRef(window.location.origin + '/animation');
  const GRILLLIGHTSCONTROL_FALLBACK_DEFAULT = useRef({
    animation: 0,
    r: 252,
    g: 101,
    b: 20,
    speed: 0.5,
    direction: 0,
    density: 0.5,
    tailLength: 250
  });

  // set up states
  const [animation, setAnimation] = useState(GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.animation); // enum int: WARM: 0, SOLID: 1, RAINBOW: 2, BREATHE: 3, STROBE: 4, RACER: 5, MARQUEE: 6, MUSIC_MATCH: 7
  const [color, setColor] = useState({
    r: GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.r, // int 0-255
    g: GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.g, // int 0-255
    b: GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.b, // int 0-255
  })
  const [speed, setSpeed] = useState(GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.speed); // float 0.0-1.0
  const [direction, setDirection] = useState(GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.direction) // int: 0 = left, 1 = right
  const [density, setDensity] = useState(GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.density) // float 0.0-1.0
  const [tailLength, setTailLength] = useState(GRILLLIGHTSCONTROL_FALLBACK_DEFAULT.current.tailLength) // int (0-500)
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsgs, setErrorMsgs] = useState([]);

  // set up handlers
  /**
   * Adds an array of error strings to the existing state.
   * @param {Array} errArray Each element is a user-facing error message string.
   */
    function updateErrors(errArray) {
    if (!errArray.some( el => errorMsgs.includes(el))){ // don't duplicate errors. h/t https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
      setErrorMsgs([...errorMsgs].concat(errArray))
    }
  }

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
      r: newColor.rgb.r,
      g: newColor.rgb.g,
      b: newColor.rgb.b
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

  function updateEntireState(fetchedState) {
    setAnimation(fetchedState.animation)
    setColor({
      r: fetchedState.r,
      g: fetchedState.g,
      b: fetchedState.b
    })
    setSpeed(fetchedState.speed)
    setDirection(fetchedState.direction)
    setDensity(fetchedState.density)
    setTailLength(fetchedState.tailLength)
  }

  // get state from server
  useEffect(() => {    
    // fetch initial server state
    fetch(STATE_URL.current)
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log('Success:', data);
          if ("animation" in data && "r" in data && "g" in data && "b" in data && "speed" in data && "direction" in data && "density" in data && "tailLength" in data) {
            // animation data should be good to go
            // setErrorMsgs(errorMsgs => [...errorMsgs, "Test Error Message - success ani fetch"])
            // setErrorMsgs(errorMsgs => [...errorMsgs, "Test Error Message 2 - success ani fetch 2"])
            updateEntireState(data);
          } else {
            setErrorMsgs(errorMsgs => [...errorMsgs, "Couldn't read the current animation state of the lights from the server. Arbitrary defaults set."])
          }
          setIsLoading(false)
        })
        .catch((error) => { // handle issue parsing JSON
          console.log('Issue parsing JSON! Error: ', error);
          setErrorMsgs(errorMsgs => [...errorMsgs, 'Warning - the state of the animations was not successfully received from the server. Arbitrary defaults set'])
          setIsLoading(false)
        });
      } else {
        console.log('Issue with Response: ', response);
        setErrorMsgs(errorMsgs => [...errorMsgs, 'Warning - the state of the animations was not successfully received from the server. Arbitrary defaults set'])
        setIsLoading(false)
      }
    })
    .catch((error) => {
      console.error('Error from the fetch:', error);
      setErrorMsgs(errorMsgs => [...errorMsgs, 'Warning - the state of the animations was not successfully received from the server. Arbitrary defaults set'])
      setIsLoading(false)
    });
    
  }, [])

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
    updateErrors,
    [animation, color, speed, direction, density, tailLength],
    isLoading 
  )

  // set up the necessary config to render
  let neededConfig;
  
  if (animation === 0) { // default Warm
    neededConfig = <NoConfig />;

  } else if ([1, 7].includes(animation)) { // Solid Color and Music Match
    neededConfig = (
      <ColorConfig
        defaultColors={color}
        onColorChange={handleColorChange}
        sampleDelay={SAMPLE_DELAY}
      />
    );

  } else if ([3, 4, 6].includes(animation)) { // Breathe, Strobe, and Marquee
    neededConfig = (
      <ColorSpeedConfig 
        defaultColors={color}
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
        defaultColors={color}
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
    setErrorMsgs([...errorMsgs, 'Whoops! That animation is not recognized.'])
  }

  // render
  if (isLoading) {
    return (
      <CircularProgress />
    )
  } else {
    return (
      <Box p={2}>
        <Box pb={2} fontWeight="fontWeightBold" fontSize="1.5em">Control Grill Lights</Box>
        {errorMsgs.length > 0 &&
          <ErrorBlock errorMsgs={errorMsgs} setErrorMsgs={setErrorMsgs}/>
        }
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
      </Box>
      
    )
  }
} 
