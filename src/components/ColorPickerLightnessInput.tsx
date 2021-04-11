/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import tinyColor from 'tinycolor2';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface ColorPickerLighnessInputProps {
  lightness: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setLightness(lightness: number | 'multi'): void;
  setHex(hue: string | 'multi'): void;
  setRed(red: number | 'multi'): void;
  setGreen(green: number | 'multi'): void;
  setBlue(blue: number | 'multi'): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerLighnessInput = (props: ColorPickerLighnessInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { lightness, colorValues, setLightness, setHex, setRed, setGreen, setBlue, onChange } = props;

  const handleSubmitSuccess = (nextLightness: any): void => {
    if (nextLightness > 100) {
      nextLightness = 100;
    }
    if (nextLightness < 0) {
      nextLightness = 0;
    }
    let hex: string | 'multi';
    let red: number | 'multi';
    let green: number | 'multi';
    let blue: number | 'multi';
    const newColors = Object.keys(colorValues).reduce((result, current, index) => {
      const colorInstance = tinyColor({h: colorValues[current].h, s: colorValues[current].s, l: nextLightness / 100});
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
        [current]: { l: nextLightness / 100 }
      };
    }, {});
    setLightness(nextLightness / 100);
    setHex(hex);
    setRed(red);
    setGreen(green);
    setBlue(blue);
    onChange(newColors);
  };

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-cp-hsl-lightness'
      value={lightness !== 'multi' ? Math.round(lightness * 100) : lightness}
      size='small'
      right={<Form.Text>L</Form.Text>}
      min={0}
      max={100}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ColorPickerLighnessInput;