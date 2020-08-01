/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';
import tinyColor from 'tinycolor2';

interface ColorPickerHueProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  setHue(hue: number): void;
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  onChange?(color: em.Color): void;
}

interface SliderProps {
  grabbing: boolean;
}

const Slider = styled.input<SliderProps>`
  -webkit-appearance: none;
  margin: 0;
  background: none;
  width: 100%;
  :focus {
    outline: none;
  }
  ::-webkit-slider-runnable-track {
    width: 100%;
    height: ${props => props.theme.unit * 2}px;
    cursor: pointer;
    background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    border-radius: ${props => props.theme.unit * 2}px;
    box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5}
  }
  :disabled::-webkit-slider-runnable-track {
    cursor: inherit;
  }
  ::-webkit-slider-thumb {
    box-shadow: 0 0 0 2px #fff, 0 0 0 1px rgba(0, 0, 0, 0.3) inset, 0 0 0 3px rgba(0, 0, 0, 0.3);
    height: ${props => props.theme.unit * 2}px;
    width: ${props => props.theme.unit * 2}px;
    border-radius: 100%;
    background: none;
    cursor: ${props => props.grabbing ? 'grabbing' : 'grab'};
    -webkit-appearance: none;
  }
  :disabled::-webkit-slider-thumb {
    cursor: inherit;
  }
`;

const ColorPickerHue = (props: ColorPickerHueProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, setHue, saturation, lightness, value, alpha, setRed, setGreen, setBlue, onChange } = props;
  const [hueValue, setHueValue] = useState(hue);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    setHueValue(hue);
  }, [hue]);

  const handleChange = (e: any) => {
    const target = e.target;
    const nextColor = tinyColor({h: target.value, s: saturation, l: lightness});
    const rgb = nextColor.toRgb();
    setRed(rgb.r);
    setGreen(rgb.g);
    setBlue(rgb.b);
    setHueValue(target.value);
    setHue(target.value);
    onChange({h: target.value, s: saturation, l: lightness, v: value, a: alpha });
  };

  const handleMouseDown = () => {
    setGrabbing(true);
  }

  const handleMouseUp = () => {
    setGrabbing(false);
  }

  return (
    <div className='c-color-picker__hue'>
      <Slider
        type='range'
        min={0}
        max={360}
        step={1}
        value={hueValue}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        theme={theme}
        grabbing={grabbing} />
    </div>
  );
}

export default ColorPickerHue;