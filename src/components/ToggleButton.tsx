import React, { useContext, forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import { ThemeContext } from './ThemeProvider';
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

const ToggleButton: RefForwardingComponent<'button', ToggleButtonProps> = forwardRef(function ToggleButton(props: ToggleButtonProps, ref: any) {
  const { type, size, name, disabled, onChange, checked, value, children } = props;
  const tg = useContext(ToggleButtonGroupContext);
  const theme = useContext(ThemeContext);

  return (
    <Button
      {...props}
      size={size || tg.size}
      type={undefined}
      active={!!checked || tg.value === value}
      disabled={!!disabled || tg.disabled}
      as='label'>
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