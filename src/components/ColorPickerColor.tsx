/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';

interface ColorPickerColorProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
}

const ColorPickerColor = (props: ColorPickerColorProps): ReactElement => {
  const { hue, saturation, lightness, value, alpha } = props;

  return (
    <div
      className='c-color-picker__swatch'
      style={{
        background: `hsla(${hue !== 'multi' ? hue : 0},${saturation !== 'multi' ? saturation * 100 : 0}%, ${lightness !== 'multi' ? lightness * 100 : 0}%, ${alpha !== 'multi' ? alpha : 1})`,
      }} />
  );
}

export default ColorPickerColor;