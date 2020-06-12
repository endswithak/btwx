/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface ColorPickerColorProps {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

const ColorPickerColor = (props: ColorPickerColorProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, alpha } = props;

  return (
    <div style={{
      background: `hsla(${hue},${saturation * 100}%, ${lightness * 100}%, ${alpha})`,
      boxShadow: `0 0 0 1px ${theme.background.z4}`
    }} />
  );
}

export default ColorPickerColor;