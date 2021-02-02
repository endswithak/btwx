import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface ButtonItemProps {
  disabled: boolean;
  active: boolean;
}

const StyledButton = styled.button<ButtonItemProps>`
  color: ${props => props.active ? props.theme.text.onPrimary : props.theme.text.light};
  background: ${props => props.active ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.active ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  svg {
    fill: ${props => props.active ? props.theme.text.onPrimary : props.theme.text.lighter};
  }
  :hover {
    color: ${props => props.active ? props.theme.text.onPrimary : props.theme.text.base};
    background: ${props => props.active ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow:  0 0 0 1px ${props => props.active ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    svg {
      fill: ${props => props.active ? props.theme.text.onPrimary : props.theme.text.base};
    }
    :disabled {
      color: ${props => props.active ? props.theme.text.onPrimary : props.theme.text.light};
      box-shadow:  0 0 0 1px ${props => props.active ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
    }
  }
  :disabled {
    opacity: 50%;
  }
  &.c-button--select {
    color: ${props => props.active ? props.theme.text.base : props.theme.text.light};
    background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    svg {
      fill: ${props => props.active ? props.theme.palette.primary : props.theme.text.lighter};
    }
    :hover {
      color: ${props => props.theme.text.base};
      background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
      svg {
        fill: ${props => props.active ? props.theme.palette.primary : props.theme.text.base};
      }
      :disabled {
        color: ${props => props.active ? props.theme.text.base : props.theme.text.light};
      }
    }
  }
  &.c-button--group {
    background: ${props => props.active ? props.theme.palette.primary : 'none'};
    box-shadow: none;

    :hover {
      background: ${props => props.active ? props.theme.palette.primary : 'none'};
      box-shadow: none;
    }
  }
`;

interface ButtonProps {
  text?: string;
  icon?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: any;
  select?: boolean;
  groupButton?: boolean;
}

const Button = (props: ButtonProps): ReactElement => {
  const { text, icon, disabled, active, onClick, select, groupButton } = props;
  const theme = useContext(ThemeContext);

  return (
    <StyledButton
      className={`c-button ${
        text && icon
        ? 'c-button--icon-text'
        : ''
      } ${
        !text && icon
        ? 'c-button--icon'
        : ''
      } ${
        select
        ? 'c-button--select'
        : ''
      } ${
        groupButton
        ? 'c-button--group'
        : ''
      }`}
      theme={theme}
      disabled={disabled}
      onClick={onClick}
      active={active}>
      {
        icon
        ? <span className='c-button__icon'>
            <Icon
              name={icon}
              size='small' />
          </span>
        : null
      }
      {
        text
        ? <span className='c-button__text'>
            { text }
          </span>
        : null
      }
      {
        select
        ? <span className='c-button__icon c-button__icon--chevron'>
            <Icon
              name='thicc-chevron-down'
              size='small' />
          </span>
        : null
      }
    </StyledButton>
  );
}

export default Button;