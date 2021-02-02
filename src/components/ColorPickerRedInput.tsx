/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import tinyColor from 'tinycolor2';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface ColorPickerRedInputProps {
  red: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setRed(red: number | 'multi'): void;
  setHex(hex: string | 'multi'): void;
  setHue(hue: number | 'multi'): void;
  setSaturation(saturation: number | 'multi'): void;
  setLightness(lightness: number | 'multi'): void;
  setValue(value: number | 'multi'): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerRedInput = (props: ColorPickerRedInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { red, colorValues, setRed, setHex, setHue, setSaturation, setLightness, setValue, onChange } = props;

  const handleSubmitSuccess = (nextRed: any): void => {
    if (nextRed > 255) {
      nextRed = 255;
    }
    if (nextRed < 0) {
      nextRed = 0;
    }
    let hex: string | 'multi';
    let hue: number | 'multi';
    let saturation: number | 'multi';
    let lightness: number | 'multi';
    let value: number | 'multi';
    const newColors = Object.keys(colorValues).reduce((result, current, index) => {
      const color = colorValues[current];
      const colorInstance = tinyColor({h: color.h, s: color.s, l: color.l, v: color.v});
      const rgb = colorInstance.toRgb();
      const newColor = tinyColor({r: nextRed, g: rgb.g, b: rgb.b});
      const newHex = newColor.toHex();
      const hsl = newColor.toHsl();
      const hsv = newColor.toHsv();
      if (index === 0) {
        hex = newHex;
        hue = hsl.h;
        saturation = hsl.s;
        lightness = hsl.l;
        value = hsv.v;
      } else {
        if (hex !== 'multi' && hex !== newHex) {
          hex = 'multi';
        }
        if (hue !== 'multi' && hue !== hsl.h) {
          hue = 'multi';
        }
        if (saturation !== 'multi' && saturation !== hsl.s) {
          saturation = 'multi';
        }
        if (lightness !== 'multi' && lightness !== hsl.l) {
          lightness = 'multi';
        }
        if (value !== 'multi' && value !== hsv.v) {
          value = 'multi';
        }
      }
      return {
        ...result,
        [current]: { h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v }
      }
    }, {});
    setRed(nextRed);
    setHex(hex);
    setHue(hue);
    setSaturation(saturation);
    setLightness(lightness);
    setValue(value);
    onChange(newColors);
  };

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-cp-rgb-red'
      value={red}
      size='small'
      right={<Form.Text>R</Form.Text>}
      min={0}
      max={255}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ColorPickerRedInput;