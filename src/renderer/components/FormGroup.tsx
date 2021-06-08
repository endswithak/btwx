/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useMemo, ReactElement } from 'react';
import FormGroupContext from './FormGroupContext';

interface FormGroupProps {
  controlId: string;
  children?: ReactElement | ReactElement[];
}

const FormGroup = (props: FormGroupProps): ReactElement => {
  const { controlId, children } = props;
  const context = useMemo(() => ({ controlId }), [controlId]);

  return (
    <FormGroupContext.Provider value={context}>
      <div className='c-form-group'>
        { children }
      </div>
    </FormGroupContext.Provider>
  );
};

export default FormGroup;