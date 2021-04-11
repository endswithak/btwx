/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';

interface FormRowProps {
  children?: ReactElement | ReactElement[];
}

const FormRow = (props: FormRowProps): ReactElement => {
  const { children } = props;

  return (
    <div className='c-form-row'>
      { children }
    </div>
  );
};

export default FormRow;