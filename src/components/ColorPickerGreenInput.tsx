/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import mexp from 'math-expression-evaluator';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import tinyColor from 'tinycolor2';

interface ColorPickerGreenInputProps {
  red: number | 'multi';
  green: number | 'multi';
  blue: number | 'multi';
  alpha: number | 'multi';
  setGreen(green: number): void;
  setHue(hue: number): void;
  setSaturation(saturation: number): void;
  setLightness(lightness: number): void;
  setValue(value: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerGreenInput = (props: ColorPickerGreenInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { red, green, blue, alpha, setGreen, setHue, setSaturation, setLightness, setValue, onChange } = props;
  const [greenValue, setGreenValue] = useState<number>(green !== 'multi' ? Math.round(green) : 0);

  useEffect(() => {
    setGreenValue(green !== 'multi' ? Math.round(green) : 0);
  }, [green]);

  const handleChange = (e: any) => {
    const target = e.target;
    setGreenValue(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextGreen = mexp.eval(`${greenValue}`) as any;
      if (nextGreen > 255) {
        nextGreen = 255;
      }
      if (nextGreen < 0) {
        nextGreen = 0;
      }
      if (nextGreen !== green) {
        const nextColor = tinyColor({r: red !== 'multi' ? red : 0, g: Math.round(nextGreen), b: blue !== 'multi' ? blue : 0});
        const hsl = nextColor.toHsl();
        const hsv = nextColor.toHsv();
        setGreen(Math.round(nextGreen));
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        setValue(hsv.v);
        onChange({ h: hsl.h, s: hsl.s, l: hsl.l, v: hsv.v, a: alpha !== 'multi' ? alpha : 1 });
      } else {
        setGreenValue(green !== 'multi' ? Math.round(green) : 0);
      }
    } catch(error) {
      setGreenValue(green !== 'multi' ? Math.round(green) : 0);
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