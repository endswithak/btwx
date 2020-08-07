/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerSaturationInputProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  setSaturation(saturation: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerSaturationInput = (props: ColorPickerSaturationInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, setRed, setGreen, setBlue, setSaturation, onChange } = props;
  const [saturationValue, setSaturationValue] = useState<number>(saturation !== 'multi' ? Math.round(saturation * 100) : 0);

  useEffect(() => {
    setSaturationValue(saturation !== 'multi' ? Math.round(saturation * 100) : 0);
  }, [saturation]);

  const handleChange = (e: any) => {
    const target = e.target;
    setSaturationValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (saturationValue <= 100 && saturationValue >= 0 && !isNaN(saturationValue) && saturationValue / 100 !== saturation) {
      const nextColor = tinyColor({h: hue !== 'multi' ? hue : 0, s: saturationValue / 100, l: lightness !== 'multi' ? lightness : 0});
      const rgb = nextColor.toRgb();
      setSaturation(saturationValue / 100);
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
      onChange({h: hue !== 'multi' ? hue : 0, s: saturationValue / 100, l: lightness !== 'multi' ? lightness : 0, v: value !== 'multi' ? value : 0, a: alpha !== 'multi' ? alpha : 1});
    } else {
      setSaturationValue(saturation !== 'multi' ? Math.round(saturation * 100) : 0);
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