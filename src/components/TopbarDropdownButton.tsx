/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';
import TopbarButton from './TopbarButton';
import TopbarDropdownButtonOption from './TopbarDropdownButtonOption';
import tinyColor from 'tinycolor2';

interface TopbarDropdownButtonProps {
  onClick?(event: React.SyntheticEvent): void;
  disabled?: boolean;
  icon?: em.Icon;
  text?: string;
  isActive?: boolean;
  label: string;
  options: {
    onClick: any;
    isActive?: boolean;
    disabled?: boolean;
    icon?: em.Icon;
    label: string;
  }[];
}

const ButtonDropdown = styled.div`
  background: ${props => tinyColor(props.theme.name === 'dark' ? props.theme.background.z1 : props.theme.background.z2).setAlpha(0.77).toRgbString()};
  box-shadow: 0 0 0 1px ${props =>  props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5}, 0 4px 16px 0 rgba(0,0,0,0.16);
`;

const TopbarDropdownButton = (props: TopbarDropdownButtonProps): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const { onClick, text, disabled, label, icon, options, isActive } = props;
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

  const handleOptionClick = (option: any) => {
    option.onClick();
    closeDropdown();
  }

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <TopbarButton
        label={label}
        onClick={handleClick}
        icon={icon}
        text={text}
        isActive={showDropdown || isActive}
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
                  onClick={() => handleOptionClick(option)}
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