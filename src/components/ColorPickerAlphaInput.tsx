/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerAlphaInputProps {
  hue: number;
  saturation: number;
  lightness: number;
  value: number;
  alpha: number;
  onChange(color: em.Color): void;
}

const ColorPickerAlphaInput = (props: ColorPickerAlphaInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hue, saturation, lightness, value, alpha, onChange } = props;
  const [opacity, setOpacity] = useState<number>(Math.round(alpha * 100));

  useEffect(() => {
    setOpacity(Math.round(alpha * 100));
  }, [alpha]);

  const handleChange = (e: any) => {
    const target = e.target;
    setOpacity(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity !== alpha && !isNaN(nextOpacity)) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        onChange({h: hue, s: saturation, l: lightness, v: value, a: nextOpacity / 100});
      } else {
        setOpacity(Math.round(alpha * 100));
      }
    } catch(error) {
      setOpacity(Math.round(alpha * 100));
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