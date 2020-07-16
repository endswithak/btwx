/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import tinyColor from 'tinycolor2';

interface ColorPickerGreenInputProps {
  red: number;
  green: number;
  blue: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerGreenInput = (props: ColorPickerGreenInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { red, green, blue, alpha, onChange } = props;
  const [greenValue, setGreenValue] = useState<number>(Math.round(green));

  useEffect(() => {
    setGreenValue(Math.round(green));
  }, [green]);

  const handleChange = (e: any) => {
    const target = e.target;
    setGreenValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (greenValue <= 255 && greenValue >= 0 && greenValue !== green) {
      const nextColor = tinyColor({r: red, g: greenValue, b: blue, a: alpha});
      const hsl = nextColor.toHsl();
      const hsv = nextColor.toHsv();
      onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha });
    } else {
      setGreenValue(Math.round(green));
    }
  };

  return (
    <SidebarInput
      value={greenValue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='G' />
  );
}

export default ColorPickerGreenInput;