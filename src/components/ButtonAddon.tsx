/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';
import { PropWithChildren } from '../utils';

export interface ButtonAddonProps extends PropWithChildren {
  type: 'left' | 'right';
  size?: Btwx.SizeVariant;
  readOnly?: boolean;
}

const ButtonAddon = (props: ButtonAddonProps): ReactElement => {
  const { type, children, size, readOnly } = props;

  return (
    <span
      className={`c-button__addon c-button__addon--${type} ${
        size
        ? `c-button__addon--${size}`
        : ''
      } ${
        readOnly
        ? `c-button__addon--read-only`
        : ''
      }`}>
      { children }
    </span>
  );
};

export default ButtonAddon;