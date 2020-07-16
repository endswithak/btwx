/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerLighnessInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerLighnessInput = (props: ColorPickerLighnessInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, onChange } = props;
  const [lightnessValue, setLightnessValue] = useState<number>(Math.round(lightness * 100));

  useEffect(() => {
    setLightnessValue(Math.round(lightness * 100));
  }, [lightness]);

  const handleChange = (e: any) => {
    const target = e.target;
    setLightnessValue(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (lightnessValue <= 100 && lightnessValue >= 0 && !isNaN(lightnessValue) && lightnessValue / 100 !== lightness) {
      onChange({h: hue, s: saturation, l: lightnessValue / 100, v: value, a: alpha});
    } else {
      setLightnessValue(Math.round(lightness * 100));
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