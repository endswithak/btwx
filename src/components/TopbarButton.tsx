import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface TopbarButtonProps {
  onClick(): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  label: string;
}

const Button = styled.div`
  .c-topbar-button__button {
    background: ${props => props.isActive ? props.theme.palette.primary : props.theme.background.z4};
    svg {
      fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
    }
    :hover {
      background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.background.z3};
      svg {
        fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
      }
      :disabled {
        background: ${props => props.isActive ? props.theme.palette.primary : props.theme.background.z4};
        svg {
          fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
        }
      }
    }
  }
  .c-topbar-button__label {
    color: ${props => props.theme.text.light};
  }
`;

const TopbarButton = (props: TopbarButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onClick, isActive, disabled, label, icon } = props;

  return (
    <Button
      className={`c-topbar-button ${disabled ? 'c-topbar-button--disabled' : null}`}
      theme={theme}
      isActive={isActive}>
      <button
        className='c-topbar-button__button'
        onClick={onClick}
        disabled={disabled}>
        {
          icon
          ? <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'>
              <path d={icon} />
            </svg>
          : null
        }
      </button>
      <div className='c-topbar-button__label'>
        {label}
      </div>
    </Button>
  );
}

export default TopbarButton;