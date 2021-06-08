import React, { ReactElement, forwardRef } from 'react';
import { RefForwardingComponent } from '../utils';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: any;
  id?: string;
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean;
  isActive?: boolean;
  type?: Btwx.ButtonType;
  variant?: Btwx.ColorVariant | Btwx.TextColorVariant;
  size?: Btwx.SizeVariant;
  block?: boolean;
  clear?: boolean;
  toggle?: boolean;
  stacked?: boolean;
  icon?: boolean;
  classNames?: string;
  aspectRatio?: Btwx.AspectRatio;
}

const Button: RefForwardingComponent<'button', ButtonProps> = forwardRef(function Button({
  as: Tag = 'button',
  children,
  variant,
  size,
  disabled,
  type,
  icon,
  block,
  isActive,
  toggle,
  stacked,
  clear,
  aspectRatio,
  classNames,
  ...rest
}: ButtonProps, ref: any) {
  return (
    <Tag
      {...rest}
      ref={ref}
      type={type ? type : 'button'}
      className={`c-button${
        block
        ? `${' '}c-button--block`
        : ''
      }${
        toggle
        ? `${' '}c-button--toggle`
        : ''
      }${
        stacked
        ? `${' '}c-button--stacked`
        : ''
      }${
        clear
        ? `${' '}c-button--clear`
        : ''
      }${
        aspectRatio
        ? `${' '}c-button--${aspectRatio}`
        : ''
      }${
        icon
        ? `${' '}c-button--icon`
        : ''
      }${
        variant
        ? `${' '}c-button--${variant}`
        : ''
      }${
        isActive
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
      }${
        classNames
        ? `${' '}${classNames}`
        : ''
      }`}>
      { children }
    </Tag>
  )
});

export default Button;