import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

interface TopbarButtonProps {
  onClick(): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  text?: string;
}

const TopbarButton = (props: TopbarButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const [hover, setHover] = useState(false);
  const { onClick, isActive, disabled, text, icon } = props;

  return (
    <button
      className='c-topbar__button'
      onClick={onClick}
      onMouseEnter={() => setHover(!hover)}
      onMouseLeave={() => setHover(!hover)}
      disabled={disabled}
      style={{
        background: isActive ? theme.palette.primary : theme.background.z4,
        opacity: disabled ? 0.5 : 1
      }}>
      {
        icon
        ? <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            style={{
              fill: isActive
              ? theme.text.onPrimary
              : hover
                ? theme.text.base
                : theme.text.light
            }}>
            <path d={icon} />
          </svg>
        : null
      }
      {text}
    </button>
  );
}

export default TopbarButton;