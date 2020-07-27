/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ColorPickerAlphaProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  onChange(color: em.Color): void;
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

const ColorPickerAlpha = (props: ColorPickerAlphaProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, onChange } = props;
  const [alphaValue, setAlphaValue] = useState(alpha);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    setAlphaValue(alpha);
  }, [alpha]);

  const handleChange = (e: any) => {
    const target = e.target;
    setAlphaValue(target.value);
    onChange({h: hue, s: saturation, l: lightness, v: value, a: target.value});
  };

  const handleMouseDown = () => {
    setGrabbing(true);
  }

  const handleMouseUp = () => {
    setGrabbing(false);
  }

  return (
    <div className='c-color-picker__alpha'>
      <style>
        {`
          ::-webkit-slider-runnable-track {
            width: 100%;
            height: ${theme.unit * 2}px;
            cursor: pointer;
            background: linear-gradient(to right, hsla(${hue},${saturation * 100}%, ${lightness * 100}%, 0) 0%, hsla(${hue},${saturation * 100}%, ${lightness * 100}%, 1) 100%);
            border-radius: ${theme.unit * 2}px;
            box-shadow: 0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5};
          }
        `}
      </style>
      <Slider
        type='range'
        min={0}
        max={1}
        step={0.01}
        value={alphaValue}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        theme={theme}
        grabbing={grabbing} />
    </div>
  );
}

export default ColorPickerAlpha;