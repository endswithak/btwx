import React, { createContext } from 'react';

interface ToggleButtonGroupContextType {
  name: string;
  disabled?: boolean;
  type: 'radio' | 'checkbox';
  size?: Btwx.SizeVariant;
  value?: any;
  onChange?: any;
}

const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextType>({
  name: null,
  disabled: false,
  type: null,
  size: null,
  value: null,
  onChange: () => {}
});

export default ToggleButtonGroupContext;