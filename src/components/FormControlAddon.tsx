/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { PropWithChildren } from '../utils';
import FormControlContext from './FormControlContext';
import FormGroupContext from './FormGroupContext';

export interface FormControlAddonProps extends PropWithChildren {
  type: 'left' | 'right';
  readOnly?: boolean;
}

const FormControlAddon = (props: FormControlAddonProps): ReactElement => {
  const fg = useContext(FormGroupContext);
  const fc = useContext(FormControlContext);
  const { type, children, readOnly } = props;

  return (
    <span
      id={`${fg.controlId}-addon-${type}`}
      className={`c-form-control__addon c-form-control__addon--${type} ${
        fc.size
        ? `c-form-control__addon--${fc.size}`
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