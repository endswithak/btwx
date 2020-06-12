/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerHueInputProps {
  hueValue: number;
  setHueValue: any;
}

const ColorPickerHueInput = (props: ColorPickerHueInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hueValue, setHueValue } = props;
  const [hue, setHue] = useState<number>(hueValue);

  useEffect(() => {
    setHue(hueValue);
  }, [hueValue]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setHue(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    if (hue <= 360 && hue >= 0 && !isNaN(hue)) {
      setHueValue(hue);
    } else {
      setHue(hueValue);
    }
  };

  return (
    <SidebarInput
      value={hue}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='H' />
  );
}

export default ColorPickerHueInput;