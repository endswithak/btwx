import React, { createContext } from 'react';

interface FormGroupContextType {
  controlId: string;
}

const FormGroupContext = createContext<FormGroupContextType>({
  controlId: undefined,
});

export default FormGroupContext;