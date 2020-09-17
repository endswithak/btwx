/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import mexp from 'math-expression-evaluator';
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
    try {
      let nextHue = mexp.eval(`${hueValue}`) as any;
      if (nextHue > 360) {
        nextHue = 360;
      }
      if (nextHue < 0) {
        nextHue = 0;
      }
      if (nextHue !== hue) {
        const nextColor = tinyColor({h: Math.round(nextHue), s: saturation !== 'multi' ? saturation : 0, l: lightness !== 'multi' ? lightness : 0});
        const rgb = nextColor.toRgb();
        setHue(Math.round(nextHue));
        setRed(rgb.r);
        setGreen(rgb.g);
        setBlue(rgb.b);
        onChange({h: Math.round(nextHue), s: saturation !== 'multi' ? saturation : 0, l: lightness !== 'multi' ? lightness : 0, v: value !== 'multi' ? value : 0, a: alpha !== 'multi' ? alpha : 1});
      } else {
        setHueValue(hue !== 'multi' ? Math.round(hue) : 0);
      }
    } catch(error) {
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