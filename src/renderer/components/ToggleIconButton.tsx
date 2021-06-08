import React, { forwardRef } from 'react';
import Icon from './Icon';
import ToggleButton, { ToggleButtonProps } from './ToggleButton';

interface ToggleIconButtonProps extends ToggleButtonProps {
  iconName: string;
  activeIconName?: string;
  variant?: Btwx.TextColorVariant;
  label: string;
}

const ToggleIconButton = forwardRef(function ToggleIconButton({
  iconName,
  activeIconName,
  variant,
  label,
  ...rest
}: ToggleIconButtonProps, ref: any) {
  const { checked, size } = rest;
  const buttonIcon = activeIconName && checked ? activeIconName : iconName;

  return (
    <ToggleButton
      {...rest}
      ref={ref}
      clear
      icon>
      <Icon
        name={buttonIcon}
        size={size}
        variant={variant} />
      <span className='h-screen-reader'>
        { label }
      </span>
    </ToggleButton>
  );
});

export default ToggleIconButton;