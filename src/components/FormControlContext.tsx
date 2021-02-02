import React, { createContext } from 'react';

interface FormControlContextType {
  size?: Btwx.SizeVariant;
  isActive?: boolean;
  isValid?: boolean;
  isInvalid?: boolean;
}

const FormControlContext = createContext<FormControlContextType>({
  size: null,
  isActive: false,
  isValid: false,
  isInvalid: false
});

export default FormControlContext;