/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import tinyColor from 'tinycolor2';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

interface ColorPickerGreenInputProps {
  green: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setGreen(green: number | 'multi'): void;
  setHex(hex: string | 'multi'): void;
  setHue(hue: number | 'multi'): void;
  setSaturation(saturation: number | 'multi'): void;
  setLightness(lightness: number | 'multi'): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerGreenInput = (props: ColorPickerGreenInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { colorValues, green, setGreen, setHex, setHue, setSaturation, setLightness, onChange } = props;

  const handleSubmitSuccess = (nextGreen: any): void => {
    if (nextGreen > 255) {
      nextGreen = 255;
    }
    if (nextGreen < 0) {
      nextGreen = 0;
    }
    let hex: string | 'multi';
    let hue: number | 'multi';
    let saturation: number | 'multi';
    let lightness: number | 'multi';
    const newColors = Object.keys(colorValues).reduce((result, current, index) => {
      const color = colorValues[current];
      const colorInstance = tinyColor({h: color.h, s: color.s, l: color.l});
      const rgb = colorInstance.toRgb();
      const newColor = tinyColor({r: rgb.r, g: nextGreen, b: rgb.b});
      const newHex = newColor.toHex();
      const hsl = newColor.toHsl();
      if (index === 0) {
        hex = newHex;
        hue = hsl.h;
        saturation = hsl.s;
        lightness = hsl.l;
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
      }
      return {
        ...result,
        [current]: { h: hsl.h, s: hsl.s, l: hsl.l }
      }
    }, {});
    setGreen(nextGreen);
    setHex(hex);
    setHue(hue);
    setSaturation(saturation);
    setLightness(lightness);
    onChange(newColors);
  };

  return (
    <MathFormGroup
      ref={formControlRef}
      controlId='control-cp-rgb-green'
      min={0}
      max={255}
      value={green}
      size='small'
      right={<Form.Text>G</Form.Text>}
      onSubmitSuccess={handleSubmitSuccess}
      submitOnBlur
      canvasAutoFocus />
  );
}

export default ColorPickerGreenInput;