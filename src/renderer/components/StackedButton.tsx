import React, { forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';
import Button, { ButtonProps } from './Button';

export interface StackedButtonProps extends ButtonProps {
  label: string;
  recording?: boolean;
  padded?: boolean;
}

const StackedButton: RefForwardingComponent<'button', StackedButtonProps> = forwardRef(function StackedButton({
  label,
  recording,
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
        ? `${' '}c-stacked-button__top--padded`
        : ''
      }${
        recording
        ? `${' '}c-stacked-button__top--recording`
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