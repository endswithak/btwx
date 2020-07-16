/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerHueInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerHueInput = (props: ColorPickerHueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, onChange } = props;
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