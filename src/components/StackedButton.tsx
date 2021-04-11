import React, { forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import Button, { ButtonProps } from './Button';

export interface StackedButtonProps extends ButtonProps {
  label: string;
  padded?: boolean;
}

const StackedButton: RefForwardingComponent<'button', StackedButtonProps> = forwardRef(function StackedButton({
  label,
  padded,
  children,
  ...rest
}: StackedButtonProps, ref: any) {
  return (
    <Button
      {...rest}
      ref={ref}
      stacked>
      <span className={`c-stacked-button__top${
        padded
        ? ` c-stacked-button__top--padded`
        : ''
      }`}>
        { children }
      </span>
      <span className='c-stacked-button__label'>
        { label }
      </span>
    </Button>
  );
});

export default StackedButton;