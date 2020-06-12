/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerHueInputProps {
  hueValue: number;
  saturationValue: number;
  lightnessValue: number;
  setValue: any;
  setSaturationValue: any;
}

const ColorPickerHueInput = (props: ColorPickerHueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hueValue, saturationValue, lightnessValue, setSaturationValue, setValue } = props;
  const [saturation, setSaturation] = useState<number>(Math.round(saturationValue * 100));

  useEffect(() => {
    setSaturation(Math.round(saturationValue * 100));
  }, [saturationValue]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setSaturation(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (saturation <= 100 && saturation >= 0 && !isNaN(saturation)) {
      setSaturationValue(saturation / 100);
      setValue(chroma({h: hueValue, s: saturation / 100, l: lightnessValue}).get('hsv.v'));
    } else {
      setSaturation(Math.round(saturationValue * 100));
    }
  };

  return (
    <SidebarInput
      value={saturation}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='S' />
  );
}

export default ColorPickerHueInput;