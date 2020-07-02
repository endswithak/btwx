/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';
import TopbarButton from './TopbarButton';
import TopbarDropdownButtonOption from './TopbarDropdownButtonOption';

interface TopbarDropdownButtonProps {
  onClick(event: React.SyntheticEvent): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  label: string;
  options: [{
    onClick(event: React.SyntheticEvent): void;
    isActive?: boolean;
    disabled?: boolean;
    icon?: string;
    label: string;
  }];
}

const ButtonDropdown = styled.div`
  background: ${props => props.theme.background.z1};
  box-shadow: 0 0 0 -1px ${props => props.theme.background.z4} inset;
`;

const TopbarDropdownButton = (props: TopbarDropdownButtonProps): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { onClick, isActive, disabled, label, icon, options } = props;
  const [showDropdown, setShowDropdown] = useState(false);

  const onMouseDown = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  }

  const handleClick = (event: React.SyntheticEvent) => {
    showDropdown ? closeDropdown() : openDropdown();
    if (onClick) {
      onClick(event);
    }
  }

  const closeDropdown = () => {
    setShowDropdown(false);
    document.removeEventListener('mousedown', onMouseDown);
  }

  const openDropdown = () => {
    setShowDropdown(true);
    document.addEventListener('mousedown', onMouseDown, false);
  }

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <TopbarButton
        label={label}
        onClick={handleClick}
        icon={icon}
        isActive={showDropdown}
        disabled={disabled} />
      {
        showDropdown
        ? <ButtonDropdown
            className='c-topbar-dropdown-button__dropdown'
            theme={theme}>
            {
              options.map((option, index) => (
                <TopbarDropdownButtonOption
                  {...option}
                  key={index} />
              ))
            }
          </ButtonDropdown>
        : null
      }
    </div>
  );
}

export default TopbarDropdownButton;