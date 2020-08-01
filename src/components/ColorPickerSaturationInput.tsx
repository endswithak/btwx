/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerSaturationInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  setSaturation(saturation: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerSaturationInput = (props: ColorPickerSaturationInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, setRed, setGreen, setBlue, setSaturation, onChange } = props;
  const [saturationValue, setSaturationValue] = useState<number>(Math.round(saturation * 100));

  useEffect(() => {
    setSaturationValue(Math.round(saturation * 100));
  }, [saturation]);

  const handleChange = (e: any) => {
    const target = e.target;
    setSaturationValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (saturationValue <= 100 && saturationValue >= 0 && !isNaN(saturationValue) && saturationValue / 100 !== saturation) {
      const nextColor = tinyColor({h: hue, s: saturationValue / 100, l: lightness});
      const rgb = nextColor.toRgb();
      setSaturation(saturationValue / 100);
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
      onChange({h: hue, s: saturationValue / 100, l: lightness, v: value, a: alpha});
    } else {
      setSaturationValue(Math.round(saturation * 100));
    }
  };

  return (
    <SidebarInput
      value={saturationValue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='S' />
  );
}

export default ColorPickerSaturationInput;