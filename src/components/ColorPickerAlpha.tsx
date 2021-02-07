/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState, useEffect, useRef } from 'react';
import Form from './Form';

interface ColorPickerAlphaProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setAlpha(alpha: number): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerAlpha = (props: ColorPickerAlphaProps): ReactElement => {
  const controlRef = useRef(null);
  const { hue, saturation, lightness, value, alpha, colorValues, setAlpha, onChange } = props;
  const [alphaValue, setAlphaValue] = useState(alpha !== 'multi' ? alpha : 1);

  useEffect(() => {
    setAlphaValue(alpha !== 'multi' ? alpha : 1);
  }, [alpha]);

  const handleChange = (e: any) => {
    const target = e.target;
    setAlphaValue(target.value);
    setAlpha(target.value);
    onChange(Object.keys(colorValues).reduce((result, current) => ({
      ...result,
      [current]: { a: target.value }
    }), {}));
  };

  return (
    <div className='c-color-picker__alpha'>
      <Form.Control
        ref={controlRef}
        as='input'
        type='range'
        sliderType='alpha'
        sliderProps={{hue, saturation, lightness, thicc: true}}
        size='small'
        min={0}
        max={1}
        step={0.01}
        onChange={handleChange}
        value={alphaValue} />
    </div>
  );
}

export default ColorPickerAlpha;