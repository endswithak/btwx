/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface TopbarDropdownButtonOptionProps {
  onClick(event: React.SyntheticEvent): void;
  isActive?: boolean;
  disabled?: boolean;
  icon?: string;
  label: string;
}

const Button = styled.button<TopbarDropdownButtonOptionProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : 'none'};
  .c-topbar-dropdown-button__icon {
    svg {
      fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
    }
  }
  .c-topbar-dropdown-button__label {
    color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
  }
  :disabled {
    background: none;
    opacity: 0.5;
    cursor: default;
    .c-topbar-dropdown-button__label {
      color: ${props => props.theme.text.lighter};
    }
  }
  :hover {
    background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.palette.primary};
    .c-topbar-dropdown-button__icon {
      svg {
        fill: ${props => props.theme.text.onPrimary};
      }
    }
    .c-topbar-dropdown-button__label {
      color: ${props => props.theme.text.onPrimary};
    }
    :disabled {
      background: none;
      .c-topbar-dropdown-button__icon {
        svg {
          fill: ${props => props.theme.text.lighter};
        }
      }
      .c-topbar-dropdown-button__label {
        color: ${props => props.theme.text.lighter};
      }
    }
  }
`;

const TopbarDropdownButtonOption = (props: TopbarDropdownButtonOptionProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { label, icon } = props;

  return (
    <Button
      className='c-topbar-dropdown-button__option'
      {...props}
      theme={theme}>
      {
        icon
        ? <span className='c-topbar-dropdown-button__icon'>
            <Icon name={icon} />
          </span>
        : null
      }
      <span className='c-topbar-dropdown-button__label'>
        {label}
      </span>
    </Button>
  );
}

export default TopbarDropdownButtonOption;