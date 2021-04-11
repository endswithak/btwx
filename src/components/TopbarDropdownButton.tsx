/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState, useRef } from 'react';
import StackedButton from './StackedButton';
import TopbarDropdownButtonOption, { TopbarDropdownButtonOptionProps } from './TopbarDropdownButtonOption';

interface TopbarDropdownButtonProps {
  disabled?: boolean;
  icon?: string;
  text?: string;
  isActive?: boolean;
  keepOpenOnSelect?: boolean;
  label: string;
  dropdownPosition: 'left' | 'right';
  options: TopbarDropdownButtonOptionProps[];
  onClick?(event: React.SyntheticEvent): void;
}

const TopbarDropdownButton = (props: TopbarDropdownButtonProps): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { onClick, text, disabled, label, icon, options, isActive, keepOpenOnSelect, dropdownPosition } = props;
  const [showDropdown, setShowDropdown] = useState(false);

  const onMouseDown = (event: any): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  }

  const handleClick = (event: React.SyntheticEvent): void => {
    showDropdown ? closeDropdown() : openDropdown();
    if (onClick) {
      onClick(event);
    }
  }

  const closeDropdown = (): void => {
    setShowDropdown(false);
    document.removeEventListener('mousedown', onMouseDown);
  }

  const openDropdown = (): void => {
    setShowDropdown(true);
    document.addEventListener('mousedown', onMouseDown);
  }

  const handleOptionClick = (option: any) => {
    option.onClick();
    if (!keepOpenOnSelect) {
      closeDropdown();
    }
  }

  return (
    <div
      className='c-topbar-dropdown-button'
      ref={dropdownRef}>
      <StackedButton
        label={label}
        onClick={handleClick}
        iconName={icon}
        size='small'
        isActive={showDropdown || isActive}
        disabled={disabled} />
      {
        showDropdown
        ? <div className={`c-topbar-dropdown-button__dropdown c-topbar-dropdown-button__dropdown--${dropdownPosition}`}>
            {
              options.map((option, index) => (
                <TopbarDropdownButtonOption
                  {...option}
                  onClick={() => handleOptionClick(option)}
                  key={index} />
              ))
            }
          </div>
        : null
      }
    </div>
  );
}

export default TopbarDropdownButton;