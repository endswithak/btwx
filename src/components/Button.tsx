import React, { ReactElement } from 'react';
import ButtonAddon from './ButtonAddon';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: any;
  id?: string;
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean;
  active?: boolean;
  type?: Btwx.ButtonType;
  variant?: Btwx.ColorVariant | Btwx.TextColorVariant;
  size?: Btwx.SizeVariant;
  left?: ReactElement;
  right?: ReactElement;
  leftReadOnly?: boolean;
  rightReadOnly?: boolean;
  block?: boolean;
  icon?: boolean;
  square?: boolean;
}

const Button: React.FC<ButtonProps & React.HTMLAttributes<HTMLOrSVGElement>> = ({
  as: Tag = 'button',
  children,
  variant,
  size,
  disabled,
  type,
  left,
  right,
  leftReadOnly,
  rightReadOnly,
  icon,
  block,
  active,
  square,
  ...rest
}: ButtonProps) => (
  <Tag
    {...rest}
    type={type ? type : 'button'}
    className={`c-button${
      block
      ? `${' '}c-button--block`
      : ''
    }${
      square
      ? `${' '}c-button--square`
      : ''
    }${
      icon
      ? `${' '}c-button--icon`
      : ''
    }${
      left
      ? `${' '}c-button--left`
      : ''
    }${
      right
      ? `${' '}c-button--right`
      : ''
    }${
      variant
      ? `${' '}c-button--${variant}`
      : ''
    }${
      active
      ? `${' '}c-button--active`
      : ''
    }${
      size
      ? `${' '}c-button--${size}`
      : ''
    }${
      disabled
      ? `${' '}c-button--disabled`
      : ''
    }`}>
    { children }
    {
      left
      ? <ButtonAddon
          type='left'
          size={size}
          readOnly={leftReadOnly}>
          { left }
        </ButtonAddon>
      : null
    }
    {
      right
      ? <ButtonAddon
          type='right'
          size={size}
          readOnly={rightReadOnly}>
          { right }
        </ButtonAddon>
      : null
    }
  </Tag>
);

export default Button;