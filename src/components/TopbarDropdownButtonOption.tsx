/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement, useState, useEffect, useRef } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';
import TopbarButton from './TopbarButton';

interface TopbarDropdownButtonOptionProps {
  onClick(event: React.SyntheticEvent): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  label: string;
}

const Button = styled.button`
  background: ${props => props.isActive ? props.theme.palette.primary : 'none'};
  .c-topbar-dropdown-button__icon {
    svg {
      fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
    }
  }
  .c-topbar-dropdown-button__label {
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
  }
  :hover {
    background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.palette.primary};
    .c-topbar-dropdown-button__icon {
      svg {
        fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
      }
    }
    .c-topbar-dropdown-button__label {
      color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
    }
  }
`;

const TopbarDropdownButtonOption = (props: TopbarDropdownButtonOptionProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onClick, isActive, disabled, label, icon } = props;

  return (
    <Button
      className='c-topbar-dropdown-button__option'
      onClick={onClick}
      disabled={disabled}
      theme={theme}
      isActive={isActive}>
      <span className='c-topbar-dropdown-button__icon'>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'>
          <path d={icon} />
        </svg>
      </span>
      <span className='c-topbar-dropdown-button__label'>
        {label}
      </span>
    </Button>
  );
}

export default TopbarDropdownButtonOption;