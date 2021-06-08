/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';

interface TextProps {
  size?: Btwx.TextSizeVariant;
  variant?: Btwx.ColorVariant | Btwx.TextColorVariant;
  textStyle?: Btwx.TextStyle | string;
  style?: any;
  children: any;
}

const Text = (props: TextProps): ReactElement => {
  const { children, size, variant, textStyle, ...rest } = props;

  return (
    <span
      {...rest}
      className={`c-text${
        size
        ? `${' '}c-text--${size}`
        : ''
      }${
        variant
        ? `${' '}c-text--${variant}`
        : `${' '}c-text--base`
      }${
        textStyle
        ? `${' '}c-text--${textStyle}`
        : ''
      }`}>
      { children }
    </span>
  );
};

export default Text;