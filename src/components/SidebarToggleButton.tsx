import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface SidebarToggleButtonProps {
  text?: string | number;
  onClick: any;
  active: boolean;
  disabled?: boolean;
  children?: React.ReactElement | React.ReactElement[];
}

const Button = styled.button`
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  svg {
    fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.lighter};
  }
  :hover {
    background: ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primaryHover : props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    svg {
      fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
    }
  }
  :disabled {
    opacity: 0.5;
  }
`;

const SidebarToggleButton = (props: SidebarToggleButtonProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className={`c-sidebar-input c-sidebar-input--button ${props.disabled ? 'c-sidebar-input--disabled' : null}`}>
      <Button
        className={`c-sidebar-input__field c-sidebar-input__field--button ${props.disabled ? 'c-sidebar-input__field--disabled' : null}`}
        onClick={props.onClick}
        disabled={props.disabled}
        isActive={props.active}
        theme={theme}>
        { props.text }
        { props.children }
      </Button>
    </div>
  );
}

export default SidebarToggleButton;