import React, { createContext } from 'react';

interface ToggleGroupContextType {
  name: string;
  disabled?: boolean;
  type: 'radio' | 'checkbox';
  size?: Btwx.SizeVariant;
  value?: any;
  onChange?: any;
}

const ToggleGroupContext = createContext<ToggleGroupContextType>({
  name: null,
  disabled: false,
  type: null,
  size: null,
  value: null,
  onChange: () => {}
});

export default ToggleGroupContext;