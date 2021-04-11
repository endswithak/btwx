/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import tinyColor from 'tinycolor2';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface ColorPickerHueInputProps {
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

const ColorPickerHueInput = (props: ColorPickerHueInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { hue, colorValues, setHue, setHex, setRed, setGreen, setBlue, onChange } = props;

  const handleSubmitSuccess = (nextHue: any): void => {
    if (nextHue > 360) {
      nextHue = 360;
    }
    if (nextHue < 0) {
      nextHue = 0;
    }
    let hex: string | 'multi';
    let red: number | 'multi';
    let green: number | 'multi';
    let blue: number | 'multi';
    const newColors = Object.keys(colorValues).reduce((result, current, index) => {
      const colorInstance = tinyColor({h: nextHue, s: colorValues[current].s, l: colorValues[current].l});
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
        [current]: { h: nextHue }
      };
    }, {});
    setHue(nextHue);
    setHex(hex);
    setRed(red);
    setGreen(green);
    setBlue(blue);
    onChange(newColors);
  };

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-cp-hsl-hue'
      min={0}
      max={360}
      value={hue}
      size='small'
      right={<Form.Text>H</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ColorPickerHueInput;