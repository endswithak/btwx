/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerHexInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  setHue: any;
  setSaturation: any;
  setLightness: any;
  setValue: any;
}

const ColorPickerHexInput = (props: ColorPickerHexInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, setHue, setSaturation, setLightness, setValue } = props;
  const [hex, setHex] = useState<string | number>(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).hex().replace('#', ''));

  useEffect(() => {
    setHex(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).hex().replace('#', ''));
  }, [hue, saturation, lightness, value]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setHex(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (chroma.valid(hex)) {
      setHue(isNaN(chroma(hex).get('hsl.h')) ? 0 : chroma(hex).get('hsl.h'));
      setSaturation(chroma(hex).get('hsl.s'));
      setLightness(chroma(hex).get('hsl.l'));
      setValue(chroma(hex).get('hsv.v'));
      setHex(chroma(hex).hex().replace('#', ''));
    } else {
      setHex(chroma({h: hue, s: saturation, l: lightness}).set('hsv.v', value).hex().replace('#', ''));
    }
  };

  return (
    <SidebarInput
      value={hex}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      leftLabel='#' />
  );
}

export default ColorPickerHexInput;