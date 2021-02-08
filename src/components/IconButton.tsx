import React, { ReactElement } from 'react';
import Icon from './Icon';
import Button, { ButtonProps } from './Button';

interface IconButtonProps extends ButtonProps {
  iconName: string;
  activeIconName?: string;
  description?: string;
}

const IconButton = ({
  iconName,
  activeIconName,
  description,
  ...rest
}: IconButtonProps): ReactElement => {
  const { active, size } = rest;

  return (
    <Button
      {...rest}
      icon>
      <Icon
        name={activeIconName && active ? activeIconName : iconName}
        size={size} />
      <span className='h-screen-reader'>{description ? description : iconName}</span>
    </Button>
  );
}

export default IconButton;