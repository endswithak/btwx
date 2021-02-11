import React, { useContext, forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import Button, { ButtonProps } from './Button';
import ToggleButtonGroupContext from './ToggleButtonGroupContext';
// import Icon from './Icon';

export interface ToggleButtonProps extends ButtonProps {
  type?: 'checkbox' | 'radio';
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value: any;
  inputRef?: React.LegacyRef<HTMLInputElement>;
}

const ToggleButton: RefForwardingComponent<'button', ToggleButtonProps> = forwardRef(function ToggleButton({
  type,
  size,
  name,
  disabled,
  checked,
  value,
  children,
  onChange,
  ...rest
}: ToggleButtonProps, ref: any) {
  const tg = useContext(ToggleButtonGroupContext);

  return (
    <Button
      {...rest}
      as='label'
      size={size || tg.size}
      type={undefined}
      isActive={!!checked || tg.value === value}
      disabled={!!disabled || tg.disabled}
      toggle>
      <input
        name={name || tg.name}
        type={type || tg.type}
        value={value as any}
        ref={ref}
        autoComplete="off"
        checked={!!checked || tg.value === value}
        disabled={!!disabled || tg.disabled}
        onChange={onChange || tg.onChange} />
      { children }
    </Button>
  );
});

export default ToggleButton;