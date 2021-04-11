import React, { useContext, forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import StackedButton, { StackedButtonProps } from './StackedButton';
import ToggleButtonGroupContext from './ToggleGroupContext';

export interface ToggleStackedButtonProps extends StackedButtonProps {
  type?: 'checkbox' | 'radio';
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  value: any;
  inputRef?: React.LegacyRef<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ToggleStackedButton: RefForwardingComponent<'button', ToggleStackedButtonProps> = forwardRef(function ToggleStackedButton({
  type,
  size,
  name,
  disabled,
  checked,
  value,
  children,
  onChange,
  ...rest
}: ToggleStackedButtonProps, ref: any) {
  const tg = useContext(ToggleButtonGroupContext);

  return (
    <StackedButton
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
    </StackedButton>
  );
});

export default ToggleStackedButton;