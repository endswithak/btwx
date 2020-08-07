/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerHueInputProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  setHue(hue: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerHueInput = (props: ColorPickerHueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, setRed, setGreen, setBlue, setHue, onChange } = props;
  const [hueValue, setHueValue] = useState<number>(hue !== 'multi' ? Math.round(hue) : 0);

  useEffect(() => {
    setHueValue(hue !== 'multi' ? Math.round(hue) : 0);
  }, [hue]);

  const handleChange = (e: any) => {
    const target = e.target;
    setHueValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (hueValue <= 360 && hueValue >= 0 && !isNaN(hueValue) && hueValue !== hue) {
      const nextColor = tinyColor({h: hueValue, s: saturation !== 'multi' ? saturation : 0, l: lightness !== 'multi' ? lightness : 0});
      const rgb = nextColor.toRgb();
      setHue(hueValue);
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
      onChange({h: hueValue, s: saturation !== 'multi' ? saturation : 0, l: lightness !== 'multi' ? lightness : 0, v: value !== 'multi' ? value : 0, a: alpha !== 'multi' ? alpha : 1});
    } else {
      setHueValue(hue !== 'multi' ? Math.round(hue) : 0);
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