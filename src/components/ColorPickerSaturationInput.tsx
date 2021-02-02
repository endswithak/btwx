/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import tinyColor from 'tinycolor2';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface ColorPickerSaturationInputProps {
  saturation: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setSaturation(saturation: number | 'multi'): void;
  setHex(hue: string | 'multi'): void;
  setRed(red: number | 'multi'): void;
  setGreen(green: number | 'multi'): void;
  setBlue(blue: number | 'multi'): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerSaturationInput = (props: ColorPickerSaturationInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { saturation, colorValues, setSaturation, setHex, setRed, setGreen, setBlue, onChange } = props;

  const handleSubmitSuccess = (nextSaturation: any): void => {
    if (nextSaturation > 100) {
      nextSaturation = 100;
    }
    if (nextSaturation < 0) {
      nextSaturation = 0;
    }
    let hex: string | 'multi';
    let red: number | 'multi';
    let green: number | 'multi';
    let blue: number | 'multi';
    const newColors = Object.keys(colorValues).reduce((result, current, index) => {
      const colorInstance = tinyColor({h: colorValues[current].h, s: nextSaturation / 100, l: colorValues[current].l, v: colorValues[current].v});
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
        [current]: { s: nextSaturation / 100 }
      };
    }, {});
    setSaturation(nextSaturation / 100);
    setHex(hex);
    setRed(red);
    setGreen(green);
    setBlue(blue);
    onChange(newColors);
  };

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-cp-hsl-saturation'
      value={saturation !== 'multi' ? Math.round(saturation * 100) : saturation}
      size='small'
      right={<Form.Text>S</Form.Text>}
      min={0}
      max={100}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ColorPickerSaturationInput;