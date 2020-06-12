/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerBlueInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  setHue: any;
  setSaturation: any;
  setLightness: any;
  setValue: any;
}

const ColorPickerBlueInput = (props: ColorPickerBlueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, setHue, setSaturation, setLightness, setValue } = props;
  const [blue, setBlue] = useState<string | number>(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.b'));

  useEffect(() => {
    setBlue(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.b'));
  }, [hue, saturation, lightness, value]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setBlue(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (blue <= 255 && blue >= 0) {
      const nextColor = chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).set('rgb.b', blue);
      setHue(isNaN(chroma(nextColor).get('hsl.h')) ? 0 : chroma(nextColor).get('hsl.h'));
      setSaturation(chroma(nextColor).get('hsl.s'));
      setLightness(chroma(nextColor).get('hsl.l'));
      setValue(chroma(nextColor).get('hsv.v'));
    } else {
      setBlue(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).get('rgb.b'));
    }
  };

  return (
    <SidebarInput
      value={blue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='B' />
  );
}

export default ColorPickerBlueInput;