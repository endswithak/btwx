/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import tinyColor from 'tinycolor2';

interface ColorPickerBlueInputProps {
  red: number | 'multi';
  green: number | 'multi';
  blue: number | 'multi';
  alpha: number | 'multi';
  setBlue(blue: number): void;
  setHue(hue: number): void;
  setSaturation(saturation: number): void;
  setLightness(lightness: number): void;
  setValue(value: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerBlueInput = (props: ColorPickerBlueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { red, green, blue, alpha, setBlue, setHue, setSaturation, setLightness, setValue, onChange } = props;
  const [blueValue, setBlueValue] = useState<number>(blue !== 'multi' ? Math.round(blue) : 0);

  useEffect(() => {
    setBlueValue(blue !== 'multi' ? Math.round(blue) : 0);
  }, [blue]);

  const handleChange = (e: any) => {
    const target = e.target;
    setBlueValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    if (blueValue <= 255 && blueValue >= 0 && blueValue !== blue) {
      const nextColor = tinyColor({r: red !== 'multi' ? red : 0, g: green !== 'multi' ? green : 0, b: blueValue});
      const hsl = nextColor.toHsl();
      const hsv = nextColor.toHsv();
      setBlue(blueValue);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setValue(hsv.v);
      onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha !== 'multi' ? alpha : 1 });
    } else {
      setBlueValue(blue !== 'multi' ? Math.round(blue) : 0);
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