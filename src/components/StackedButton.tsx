import React, { forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import Button, { ButtonProps } from './Button';
import Icon from './Icon';
// import Icon from './Icon';

export interface StackedButtonProps extends ButtonProps {
  label: string;
  iconName: string;
  activeIconName?: string;
}

const StackedButton: RefForwardingComponent<'button', StackedButtonProps> = forwardRef(function StackedButton({
  label,
  iconName,
  activeIconName,
  ...rest
}: StackedButtonProps, ref: any) {
  const { size, isActive } = rest;

  return (
    <Button
      {...rest}
      ref={ref}
      stacked>
      <span className='c-stacked-button__icon'>
        <Icon
          name={activeIconName && isActive ? activeIconName : iconName}
          size={size} />
      </span>
      <span className='c-stacked-button__label'>
        { label }
      </span>
    </Button>
  );
});

export default StackedButton;