/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { PropWithChildren } from '../utils';
import FormGroupContext from './FormGroupContext';

export interface FormControlAddonProps extends PropWithChildren {
  type: 'left' | 'right';
  readOnly?: boolean;
  size?: Btwx.SizeVariant;
}

const FormControlAddon = (props: FormControlAddonProps): ReactElement => {
  const fg = useContext(FormGroupContext);
  const { type, children, readOnly, size } = props;

  return (
    <span
      id={`${fg.controlId}-addon-${type}`}
      className={`c-form-control__addon c-form-control__addon--${type} ${
        size
        ? `c-form-control__addon--${size}`
        : ''
      } ${
        readOnly
        ? `c-form-control__addon--read-only`
        : ''
      }`}>
      { children }
    </span>
  );
};

export default FormControlAddon;