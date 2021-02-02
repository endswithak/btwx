/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ColorPickerHueProps {
  hue: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setHue(hue: number | 'multi'): void;
  setHex(hue: string | 'multi'): void;
  setRed(red: number | 'multi'): void;
  setGreen(green: number | 'multi'): void;
  setBlue(blue: number | 'multi'): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
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
  const { hue, colorValues, setHue, setHex, setRed, setGreen, setBlue, onChange } = props;
  const [hueValue, setHueValue] = useState(hue !== 'multi' ? hue : 0);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    setHueValue(hue !== 'multi' ? hue : 0);
  }, [hue]);

  const handleChange = (e: any) => {
    const target = e.target;
    let hex: string | 'multi';
    let red: number | 'multi';
    let green: number | 'multi';
    let blue: number | 'multi';
    const newColors = Object.keys(colorValues).reduce((result, current, index) => {
      const colorInstance = tinyColor({h: target.value, s: colorValues[current].s, l: colorValues[current].l, v: colorValues[current].v});
      const newHex = colorInstance.toHex();
      const rgb = colorInstance.toRgb();
      if (index === 0) {
        hex = newHex;
        red = rgb.r;
        green = rgb.g;
        blue = rgb.b;
      } else {
        if (hex !== 'multi' && hex !== newHex) {
          hex = 'multi';
        }
        if (red !== 'multi' && red !== rgb.r) {
          red = 'multi';
        }
        if (green !== 'multi' && green !== rgb.g) {
          green = 'multi';
        }
        if (blue !== 'multi' && blue !== rgb.b) {
          blue = 'multi';
        }
      }
      return {
        ...result,
        [current]: { h: target.value }
      };
    }, {});
    setHueValue(target.value);
    setHue(target.value);
    setHex(hex);
    setRed(red);
    setGreen(green);
    setBlue(blue);
    onChange(newColors);
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