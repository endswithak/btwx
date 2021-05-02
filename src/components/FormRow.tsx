/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement } from 'react';

interface FormRowProps {
  fill?: boolean;
  children?: ReactElement | ReactElement[];
}

const FormRow = (props: FormRowProps): ReactElement => {
  const { children, fill } = props;

  return (
    <div className={`c-form-row${
      fill
      ? `${' '}c-form-row--fill`
      : ''
    }`}>
      { children }
    </div>
  );
};

export default FormRow;