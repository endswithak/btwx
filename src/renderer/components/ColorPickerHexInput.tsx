/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useRef } from 'react';
import tinyColor from 'tinycolor2';
import HexFormGroup from './HexFormGroup';

interface ColorPickerHexInputProps {
  autoFocus?: boolean;
  hex: 'multi' | string;
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setHex(hex: string): void;
  setHue(hue: number): void;
  setSaturation(saturation: number): void;
  setLightness(lightness: number): void;
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerHexInput = (props: ColorPickerHexInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { autoFocus, hex, colorValues, setHex, setHue, setSaturation, setLightness, setRed, setGreen, setBlue, onChange } = props;

  const handleSubmitSuccess = (nextHex: any): void => {
    const hsl = tinyColor(nextHex).toHsl();
    const rgb = tinyColor(nextHex).toRgb();
    setHex(nextHex);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setRed(rgb.r);
    setGreen(rgb.g);
    setBlue(rgb.b);
    onChange(Object.keys(colorValues).reduce((result, current) => ({
      ...result,
      [current]: { h: hsl.h, s: hsl.s, l: hsl.l }
    }), {}));
  };

  useEffect(() => {
    if (formControlRef.current && autoFocus) {
      formControlRef.current.focus();
      formControlRef.current.select();
    }
  }, []);

  return (
    <HexFormGroup
      ref={formControlRef}
      controlId='control-cp-hex'
      value={hex}
      onSubmitSuccess={handleSubmitSuccess}
      canvasAutoFocus
      submitOnBlur
      size='small' />
  );
}

export default ColorPickerHexInput;