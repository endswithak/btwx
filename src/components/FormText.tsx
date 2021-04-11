/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
// import FormControlContext from './FormControlContext';

interface FormTextProps {
  children: any;
  size?: Btwx.SizeVariant;
  colorVariant?: Btwx.ColorVariant;
}

const FormText = ({
  children,
  size,
  colorVariant
}: FormTextProps): ReactElement => (
  <span
    className={`c-form-text ${
      size
      ? `c-form-text--${size}`
      : ''
    } ${
      colorVariant
      ? `c-form-text--${colorVariant}`
      : ''
    }`}>
    { children }
  </span>
);

export default FormText;