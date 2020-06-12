/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerRedInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  setHue: any;
  setSaturation: any;
  setLightness: any;
  setValue: any;
}

const ColorPickerRedInput = (props: ColorPickerRedInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, setHue, setSaturation, setLightness, setValue } = props;
  const [red, setRed] = useState<string | number>(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.r'));

  useEffect(() => {
    setRed(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.r'));
  }, [hue, saturation, lightness, value]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setRed(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (red <= 255 && red >= 0) {
      const nextColor = chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).set('rgb.r', red);
      setHue(isNaN(chroma(nextColor).get('hsl.h')) ? 0 : chroma(nextColor).get('hsl.h'));
      setSaturation(chroma(nextColor).get('hsl.s'));
      setLightness(chroma(nextColor).get('hsl.l'));
      setValue(chroma(nextColor).get('hsv.v'));
    } else {
      setRed(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.r'));
    }
  };

  return (
    <SidebarInput
      value={red}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='R' />
  );
}

export default ColorPickerRedInput;