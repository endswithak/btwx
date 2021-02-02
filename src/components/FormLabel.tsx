/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import FormGroupContext from './FormGroupContext';

interface FormLabelProps {
  children: any;
  htmlFor?: string;
}

const FormLabel = (props: FormLabelProps): ReactElement => {
  const fg = useContext(FormGroupContext);
  const theme = useContext(ThemeContext);
  const { htmlFor, children } = props;

  return (
    <label
      className='c-form-label'
      htmlFor={htmlFor || fg.controlId}
      style={{
        color: theme.text.base
      }}>
      { children }
    </label>
  );
};

export default FormLabel;