import React, { useContext, ReactElement, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface TopbarButtonProps {
  onClick(): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  text?: string;
}

const Button = styled.button`
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
  :disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const TopbarButton = (props: TopbarButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { onClick, isActive, disabled, text, icon } = props;

  return (
    <Button
      className='c-topbar__button'
      onClick={onClick}
      disabled={disabled}
      theme={theme}
      isActive={isActive}>
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
      {text}
    </Button>
  );
}

export default TopbarButton;