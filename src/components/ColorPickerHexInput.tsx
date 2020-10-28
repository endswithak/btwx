/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import tinyColor from 'tinycolor2';

interface ColorPickerHexInputProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  setHue(hue: number): void;
  setSaturation(saturation: number): void;
  setLightness(lightness: number): void;
  setValue(value: number): void;
  onChange(color: Btwx.Color): void;
}

const ColorPickerHexInput = (props: ColorPickerHexInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, setHue, setRed, setGreen, setBlue, saturation, setSaturation, lightness, setLightness, value, setValue, alpha, onChange } = props;
  const [hex, setHex] = useState<string>(hue !== 'multi' ? tinyColor({h: hue, s: saturation as number, l: lightness as number}).toHex() : 'multi');

  useEffect(() => {
    setHex(hue !== 'multi' ? tinyColor({h: hue, s: saturation as number, l: lightness as number}).toHex() : 'multi');
  }, [hue, saturation, lightness, value]);

  const handleChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    setHex(target.value);
  };

  const handleSubmit = (e: any): void => {
    const nextHex = tinyColor(hex);
    if (nextHex.isValid()) {
      const rgb = nextHex.toRgb();
      const hsl = nextHex.toHsl();
      const hsv = nextHex.toHsv();
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setValue(hsv.v);
      onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha !== 'multi' ? alpha : 1 });
    } else {
      setHex(hue !== 'multi' ? tinyColor({h: hue, s: saturation as number, l: lightness as number}).toHex() : 'multi');
    }
  };

  return (
    <SidebarInput
      value={hex}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      leftLabel='#' />
  );
}

export default ColorPickerHexInput;