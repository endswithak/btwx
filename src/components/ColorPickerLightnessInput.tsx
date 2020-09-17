/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import mexp from 'math-expression-evaluator';
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerLighnessInputProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
  setRed(red: number): void;
  setGreen(green: number): void;
  setBlue(blue: number): void;
  setLightness(lightness: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerLighnessInput = (props: ColorPickerLighnessInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, setRed, setGreen, setBlue, setLightness, onChange } = props;
  const [lightnessValue, setLightnessValue] = useState<number>(lightness !== 'multi' ? Math.round(lightness * 100) : 0);

  useEffect(() => {
    setLightnessValue(lightness !== 'multi' ? Math.round(lightness * 100) : 0);
  }, [lightness]);

  const handleChange = (e: any) => {
    const target = e.target;
    setLightnessValue(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextLightness = mexp.eval(`${lightnessValue}`) as any;
      if (nextLightness > 100) {
        nextLightness = 100;
      }
      if (nextLightness < 0) {
        nextLightness = 0;
      }
      if (nextLightness !== (lightness !== 'multi' ? Math.round(lightness * 100) : 0)) {
        const nextColor = tinyColor({h: hue !== 'multi' ? hue : 0, s: saturation !== 'multi' ? saturation : 0, l: Math.round(nextLightness) / 100});
        const rgb = nextColor.toRgb();
        setLightness(Math.round(nextLightness) / 100);
        setRed(rgb.r);
        setGreen(rgb.g);
        setBlue(rgb.b);
        onChange({h: hue !== 'multi' ? hue : 0, s: saturation !== 'multi' ? saturation : 0, l: Math.round(nextLightness) / 100, v: value !== 'multi' ? value : 0, a: alpha !== 'multi' ? alpha : 1});
      } else {
        setLightnessValue(lightness !== 'multi' ? Math.round(lightness * 100) : 0);
      }
    } catch(error) {
      setLightnessValue(lightness !== 'multi' ? Math.round(lightness * 100) : 0);
    }
  };

  return (
    <SidebarInput
      value={lightnessValue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='L' />
  );
}

export default ColorPickerLighnessInput;