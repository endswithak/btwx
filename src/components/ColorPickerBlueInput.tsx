/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import tinyColor from 'tinycolor2';

interface ColorPickerBlueInputProps {
  red: number;
  green: number;
  blue: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerBlueInput = (props: ColorPickerBlueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { red, green, blue, alpha, onChange } = props;
  const [blueValue, setBlueValue] = useState<number>(Math.round(blue));

  useEffect(() => {
    setBlueValue(Math.round(blue));
  }, [blue]);

  const handleChange = (e: any) => {
    const target = e.target;
    setBlueValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (blueValue <= 255 && blueValue >= 0 && blueValue !== blue) {
      const nextColor = tinyColor({r: red, g: green, b: blueValue, a: alpha});
      const hsl = nextColor.toHsl();
      const hsv = nextColor.toHsv();
      onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha });
    } else {
      setBlueValue(Math.round(blue));
    }
  };

  return (
    <SidebarInput
      value={blueValue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='B' />
  );
}

export default ColorPickerBlueInput;