/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerSaturationInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerSaturationInput = (props: ColorPickerSaturationInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, onChange } = props;
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