/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface ColorPickerColorProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
}

const ColorPickerColor = (props: ColorPickerColorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha } = props;

  return (
    <div style={{
      background: `hsla(${hue !== 'multi' ? hue : 0},${saturation !== 'multi' ? saturation * 100 : 0}%, ${lightness !== 'multi' ? lightness * 100 : 0}%, ${alpha !== 'multi' ? alpha : 1})`,
      boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
    }} />
  );
}

export default ColorPickerColor;