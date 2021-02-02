/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import PercentageFormGroup from './PercentageFormGroup';

interface ColorPickerAlphaInputProps {
  alpha: number | 'multi';
  colorValues: {
    [id: string]: Btwx.Color;
  };
  setAlpha(alpha: number): void;
  onChange(colors: { [id: string]: { [P in keyof Btwx.Color]?: Btwx.Color[P] } }): void;
}

const ColorPickerAlphaInput = (props: ColorPickerAlphaInputProps): ReactElement => {
  const inputControlRef = useRef(null);
  const { alpha, colorValues, setAlpha, onChange } = props;

  const handleSubmitSuccess = (nextOpacity: any): void => {
    setAlpha(nextOpacity);
    onChange(Object.keys(colorValues).reduce((result, current) => ({
      ...result,
      [current]: { a: nextOpacity }
    }), {}));
  };

  return (
    <PercentageFormGroup
      controlId='control-cp-alpha'
      value={alpha}
      ref={inputControlRef}
      submitOnBlur
      canvasAutoFocus
      size='small'
      onSubmitSuccess={handleSubmitSuccess} />
  );
}

export default ColorPickerAlphaInput;