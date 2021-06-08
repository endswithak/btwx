import React, { ReactElement } from 'react';
// import Icon from './Icon';
import IconButton from './IconButton';

interface TopbarButtonProps {
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  text?: string;
  label?: string;
  hideLabel?: boolean;
  recording?: boolean;
  isRecord?: boolean;
  id?: string;
  onClick?(event: React.SyntheticEvent): void;
}

const TopbarButton = ({
  text,
  hideLabel,
  isActive,
  disabled,
  label,
  icon,
  recording,
  isRecord,
  id,
  onClick
}: TopbarButtonProps): ReactElement => (
  <button
    id={id ? id : null}
    className={`c-topbar-button${
      disabled
      ? `${' '}c-topbar-button--disabled`
      : ''
    }${
      isActive
      ? `${' '}c-topbar-button--active`
      : ''
    }${
      isRecord
      ? `${' '}c-topbar-button--record`
      : ''
    }${
      recording
      ? `${' '}c-topbar-button--recording`
      : ''
    }`}
    onClick={onClick}>
    <IconButton
      iconName={icon}
      size='small'
      label={label}
      block />
  </button>
);

export default TopbarButton;