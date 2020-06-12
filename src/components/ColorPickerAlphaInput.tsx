/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { evaluate } from 'mathjs';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';

interface ColorPickerAlphaInputProps {
  alpha: number;
  setAlpha: any;
}

const ColorPickerAlphaInput = (props: ColorPickerAlphaInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { alpha, setAlpha } = props;
  const [opacity, setOpacity] = useState<string | number>(Math.round(alpha * 100));

  useEffect(() => {
    setOpacity(Math.round(alpha * 100));
  }, [alpha]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity !== (alpha * 100)) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        setAlpha(nextOpacity / 100);
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