import React, { forwardRef } from 'react';
import Icon from './Icon';
import Button, { ButtonProps } from './Button';

interface IconButtonProps extends ButtonProps {
  iconName: string;
  activeIconName?: string;
  variant?: Btwx.TextColorVariant;
  label?: string;
}

const IconButton = forwardRef(function IconButton({
  iconName,
  activeIconName,
  variant,
  label,
  ...rest
}: IconButtonProps, ref: any) {
  const { isActive, size } = rest;

  return (
    <Button
      {...rest}
      ref={ref}
      clear
      icon>
      <Icon
        name={activeIconName && isActive ? activeIconName : iconName}
        size={size}
        variant={variant} />
      <span className='h-screen-reader'>
        { label ? label : iconName }
      </span>
    </Button>
  );
});

export default IconButton;