import React, { forwardRef } from 'react';
import Icon from './Icon';
import Button, { ButtonProps } from './Button';

interface IconButtonProps extends ButtonProps {
  iconName: string;
  activeIconName?: string;
  variant?: Btwx.TextColorVariant;
  label?: string;
  activeLabel?: string;
}

const IconButton = forwardRef(function IconButton({
  iconName,
  activeIconName,
  variant,
  label,
  activeLabel,
  ...rest
}: IconButtonProps, ref: any) {
  const { isActive, size } = rest;
  const buttonIcon = activeIconName && isActive ? activeIconName : iconName;
  const buttonLabel = activeLabel && isActive ? activeLabel : label ? label : iconName;

  return (
    <Button
      {...rest}
      ref={ref}
      clear
      icon>
      <Icon
        name={buttonIcon}
        size={size}
        variant={variant} />
      <span className='h-screen-reader'>
        { buttonLabel }
      </span>
    </Button>
  );
});

export default IconButton;