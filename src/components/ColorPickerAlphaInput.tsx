/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect } from 'react';
import mexp from 'math-expression-evaluator';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerAlphaInputProps {
  hue: number | 'multi';
  saturation: number | 'multi';
  lightness: number | 'multi';
  value: number | 'multi';
  alpha: number | 'multi';
  setAlpha(alpha: number): void;
  onChange(color: em.Color): void;
}

const ColorPickerAlphaInput = (props: ColorPickerAlphaInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, setAlpha, onChange } = props;
  const [opacity, setOpacity] = useState<number>(alpha !== 'multi' ? Math.round(alpha * 100) : 100);

  useEffect(() => {
    setOpacity(alpha !== 'multi' ? Math.round(alpha * 100) : 100);
  }, [alpha]);

  const handleChange = (e: any) => {
    const target = e.target;
    setOpacity(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextOpacity = mexp.eval(`${opacity}`) as any;
      if (nextOpacity > 100) {
        nextOpacity = 100;
      }
      if (nextOpacity < 0) {
        nextOpacity = 0;
      }
      if (nextOpacity !== alpha) {
        setAlpha(Math.round(nextOpacity) / 100);
        onChange({h: hue !== 'multi' ? hue : 0, s: saturation !== 'multi' ? saturation : 0, l: lightness !== 'multi' ? lightness : 0, v: value !== 'multi' ? value : 0, a: Math.round(nextOpacity) / 100});
      } else {
        setOpacity(alpha !== 'multi' ? Math.round(alpha * 100) : 100);
      }
    } catch(error) {
      setOpacity(alpha !== 'multi' ? Math.round(alpha * 100) : 100);
    }
  };

  return (
    <SidebarInput
      value={opacity}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='%' />
  );
}

export default ColorPickerAlphaInput;