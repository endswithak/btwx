import React, { ReactElement } from 'react';
import { PropWithChildren } from '../utils';

export interface ButtonGroupProps extends PropWithChildren {
  role?: string;
  size?: Btwx.SizeVariant;
  block?: boolean;
  disabled?: boolean;
  toggle?: boolean;
  vertical?: boolean;
}

const ButtonGroup = ({
  role,
  size,
  disabled,
  block,
  toggle,
  vertical,
  children
}: ButtonGroupProps): ReactElement => (
  <div
    className={`c-button-group${
      size
      ? `${' '}c-button-group--${size}`
      : ''
    }${
      block
      ? `${' '}c-button-group--block`
      : ''
    }${
      toggle
      ? `${' '}c-button-group--toggle`
      : ''
    }${
      vertical
      ? `${' '}c-button-group--vertical`
      : ''
    }${
      disabled
      ? `${' '}c-button-group--disabled`
      : ''
    }`}
    role={role ? role : 'group'}>
    { children }
  </div>
);

export default ButtonGroup;