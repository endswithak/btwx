/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface ColorPickerColorProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
}

const ColorPickerColor = (props: ColorPickerColorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha } = props;

  return (
    <div style={{
      background: `hsla(${hue},${saturation * 100}%, ${lightness * 100}%, ${alpha})`,
      boxShadow: `0 0 0 1px ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
    }} />
  );
}

export default ColorPickerColor;