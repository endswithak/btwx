/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import tinyColor from 'tinycolor2';

interface ColorPickerRedInputProps {
  red: number;
  green: number;
  blue: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerRedInput = (props: ColorPickerRedInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { red, green, blue, alpha, onChange } = props;
  const [redValue, setRedValue] = useState<number>(Math.round(red));

  useEffect(() => {
    setRedValue(Math.round(red));
  }, [red]);

  const handleChange = (e: any) => {
    const target = e.target;
    setRedValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (redValue <= 255 && redValue >= 0 && redValue !== red) {
      const nextColor = tinyColor({r: redValue, g: green, b: blue, a: alpha});
      const hsl = nextColor.toHsl();
      const hsv = nextColor.toHsv();
      onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha });
    } else {
      setRedValue(Math.round(red));
    }
  };

  return (
    <SidebarInput
      value={redValue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='R' />
  );
}

export default ColorPickerRedInput;