import React, { useContext, ReactElement } from 'react';
import { PropWithChildren } from '../utils';
import { ThemeContext } from './ThemeProvider';

export interface ButtonGroupProps extends PropWithChildren {
  role?: string;
  size?: Btwx.SizeVariant;
  disabled?: boolean;
  toggle?: boolean;
  vertical?: boolean;
}

const ButtonGroup = (props: ButtonGroupProps): ReactElement => {
  const { role, size, disabled, toggle, vertical, children } = props;
  const theme = useContext(ThemeContext);

  return (
    <div
      className={`c-button-group ${
        size
        ? `c-button-group--${size}`
        : ''
      } ${
        toggle
        ? `c-button-group--toggle`
        : ''
      } ${
        vertical
        ? `c-button-group--vertical`
        : ''
      } ${
        disabled
        ? `c-button-group--disabled`
        : ''
      }`}
      role={role ? role : 'group'}>
      { children }
    </div>
  );
}

export default ButtonGroup;