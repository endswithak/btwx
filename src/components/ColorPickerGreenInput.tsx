/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerGreenInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  setHue: any;
  setSaturation: any;
  setLightness: any;
  setValue: any;
}

const ColorPickerGreenInput = (props: ColorPickerGreenInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, setHue, setSaturation, setLightness, setValue } = props;
  const [green, setGreen] = useState<string | number>(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.g'));

  useEffect(() => {
    setGreen(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.g'));
  }, [hue, saturation, lightness, value]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setGreen(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (green <= 255 && green >= 0) {
      const nextColor = chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).set('rgb.g', green);
      setHue(isNaN(chroma(nextColor).get('hsl.h')) ? 0 : chroma(nextColor).get('hsl.h'));
      setSaturation(chroma(nextColor).get('hsl.s'));
      setLightness(chroma(nextColor).get('hsl.l'));
      setValue(chroma(nextColor).get('hsv.v'));
    } else {
      setGreen(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.g'));
    }
  };

  return (
    <SidebarInput
      value={green}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='G' />
  );
}

export default ColorPickerGreenInput;