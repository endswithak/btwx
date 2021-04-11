/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import FormGroupContext from './FormGroupContext';

interface FormLabelProps {
  children: any;
  htmlFor?: string;
}

const FormLabel = (props: FormLabelProps): ReactElement => {
  const fg = useContext(FormGroupContext);
  const { htmlFor, children } = props;

  return (
    <label
      className='c-form-label'
      htmlFor={htmlFor || fg.controlId}>
      { children }
    </label>
  );
};

export default FormLabel;