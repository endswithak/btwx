/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerLighnessInputProps {
  hueValue: number;
  saturationValue: number;
  lightnessValue: number;
  setLightnessValue: any;
  setValue: any;
}

const ColorPickerLighnessInput = (props: ColorPickerLighnessInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hueValue, saturationValue, lightnessValue, setLightnessValue, setValue } = props;
  const [lightness, setLightness] = useState<number>(Math.round(lightnessValue * 100));

  useEffect(() => {
    setLightness(Math.round(lightnessValue * 100));
  }, [lightnessValue]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setLightness(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (lightness <= 100 && lightness >= 0 && !isNaN(lightness)) {
      setLightnessValue(lightness / 100);
      setValue(chroma({h: hueValue, s: saturationValue, l: lightness / 100}).get('hsv.v'));
    } else {
      setLightness(Math.round(lightnessValue * 100));
    }
  };

  return (
    <SidebarInput
      value={lightness}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='L' />
  );
}

export default ColorPickerLighnessInput;