/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import FormGroupContext from './FormGroupContext';

interface TextProps {
  size?: Btwx.TextSizeVariant;
  variant?: Btwx.TextColorVariant;
  children: any;
}

const Text = (props: TextProps): ReactElement => {
  const { children, size, variant } = props;

  return (
    <span
      className={`c-text${
        size
        ? `${' '}c-text--${size}`
        : ''
      }${
        variant
        ? `${' '}c-text--${variant}`
        : `${' '}c-text--base`
      }`}>
      { children }
    </span>
  );
};

export default Text;