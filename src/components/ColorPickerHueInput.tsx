/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerHueInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  setHue(hue: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerHueInput = (props: ColorPickerHueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, setRed, setGreen, setBlue, setHue, onChange } = props;
  const [hueValue, setHueValue] = useState<number>(Math.round(hue));

  useEffect(() => {
    setHueValue(Math.round(hue));
  }, [hue]);

  const handleChange = (e: any) => {
    const target = e.target;
    setHueValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (hueValue <= 360 && hueValue >= 0 && !isNaN(hueValue) && hueValue !== hue) {
      const nextColor = tinyColor({h: hueValue, s: saturation, l: lightness});
      const rgb = nextColor.toRgb();
      setHue(hueValue);
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
      onChange({h: hueValue, s: saturation, l: lightness, v: value, a: alpha});
    } else {
      setHueValue(Math.round(hue));
    }
  };

  return (
    <SidebarInput
      value={hueValue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='H' />
  );
}

export default ColorPickerHueInput;