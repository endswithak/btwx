/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import tinyColor from 'tinycolor2';

interface ColorPickerHexInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerHexInput = (props: ColorPickerHexInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, onChange } = props;
  const [hex, setHex] = useState<string>(tinyColor({h: hue, s: saturation, l: lightness}).toHex());

  useEffect(() => {
    setHex(tinyColor({h: hue, s: saturation, l: lightness}).toHex());
  }, [hue, saturation, lightness, value]);

  const handleChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    setHex(target.value);
  };

  const handleSubmit = (e: any): void => {
    const nextHex = tinyColor(hex);
    if (nextHex.isValid()) {
      const hsl = nextHex.toHsl();
      const hsv = nextHex.toHsv();
      onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha });
    } else {
      setHex(tinyColor({h: hue, s: saturation, l: lightness}).toHex());
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