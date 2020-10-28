/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import mexp from 'math-expression-evaluator';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerRedInputProps {
  red: number | 'multi';
  green: number | 'multi';
  blue: number | 'multi';
  alpha: number | 'multi';
  setRed(red: number): void;
  setHue(hue: number): void;
  setSaturation(saturation: number): void;
  setLightness(lightness: number): void;
  setValue(value: number): void;
  onChange(color: Btwx.Color): void;
}

const ColorPickerRedInput = (props: ColorPickerRedInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { red, green, blue, alpha, setRed, setHue, setSaturation, setLightness, setValue, onChange } = props;
  const [redValue, setRedValue] = useState<number>(red !== 'multi' ? Math.round(red) : 0);

  useEffect(() => {
    setRedValue(red !== 'multi' ? Math.round(red) : 0);
  }, [red]);

  const handleChange = (e: any) => {
    const target = e.target;
    setRedValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextRed = mexp.eval(`${redValue}`) as any;
      if (nextRed > 255) {
        nextRed = 255;
      }
      if (nextRed < 0) {
        nextRed = 0;
      }
      if (nextRed !== red) {
        const nextColor = tinyColor({r: Math.round(nextRed), g: green !== 'multi' ? green : 0, b: blue !== 'multi' ? blue : 0});
        const hsl = nextColor.toHsl();
        const hsv = nextColor.toHsv();
        setRed(Math.round(nextRed));
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        setValue(hsv.v);
        onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha !== 'multi' ? alpha : 1 });
      } else {
        setRedValue(red !== 'multi' ? Math.round(red) : 0);
      }
    } catch(error) {
      setRedValue(red !== 'multi' ? Math.round(red) : 0);
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