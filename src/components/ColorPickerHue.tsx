/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ColorPickerHueProps {
  hue: number;
  setHue: any;
}

const Slider = styled.input`
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

const ColorPickerHue = (props: ColorPickerHueProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, setHue } = props;

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setHue(target.value);
  };

  return (
    <div className='c-color-picker__hue'>
      <Slider
        {...props}
        type='range'
        min={0}
        max={360}
        value={hue}
        onChange={handleChange}
        theme={theme} />
    </div>
  );
}

export default ColorPickerHue;