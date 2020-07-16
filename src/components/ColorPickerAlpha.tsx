/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';
import chroma from 'chroma-js';

interface ColorPickerAlphaProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const Slider = styled.input`
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
    box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);
    height: ${props => props.theme.unit * 2}px;
    width: ${props => props.theme.unit * 2}px;
    border-radius: 100%;
    background: none;
    cursor: pointer;
    -webkit-appearance: none;
  }
  :disabled::-webkit-slider-thumb {
    cursor: inherit;
  }
  /* :hover::-webkit-slider-thumb {
    background: ${props => props.theme.backgroundInverse.z3};
  } */
`;

const ColorPickerAlpha = (props: ColorPickerAlphaProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, onChange } = props;
  const [alphaValue, setAlphaValue] = useState(alpha);

  useEffect(() => {
    setAlphaValue(alpha);
  }, [alpha]);

  const handleChange = (e: any) => {
    const target = e.target;
    setAlphaValue(target.value);
    onChange({h: hue, s: saturation, l: lightness, v: value, a: target.value});
  };

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
        theme={theme} />
    </div>
  );
}

export default ColorPickerAlpha;