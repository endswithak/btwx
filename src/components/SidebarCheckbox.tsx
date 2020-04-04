import React, { useContext, ReactElement, SyntheticEvent } from 'react';
import { store } from '../store';
import styled from 'styled-components';

interface SidebarCheckboxProps {
  checked: boolean;
  id: string;
  onChange(e: SyntheticEvent<HTMLInputElement>): void;
}

const Label = styled.label`
  position: absolute;
  left: 0;
  top: 0;
  padding-left: ${props => props.theme.unit * 4}px;
  cursor: pointer;
  :focus {
    outline: none;
  }
`;

const Checkbox = styled.input`
  position: absolute;
  left: -${props => props.theme.unit * 4}px;
  /* checkbox aspect */
  + ${Label}:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: ${props => props.theme.unit * 4}px;
    height: ${props => props.theme.unit * 4}px;
    background: ${props => props.theme.background.z3};
    border-radius: 4px;
  }
  + ${Label}:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: ${props => props.theme.unit * 4}px;
    height: ${props => props.theme.unit * 4}px;
    background: ${props => props.checked ? props.theme.palette.primary : 'none'};
    border-radius: 4px;
  }
`;

const SidebarCheckbox = (props: SidebarCheckboxProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div className='c-sidebar-input'>
      <div className='c-sidebar-input__inner' style={{
        height: theme.unit * 4,
        width: theme.unit * 4,
        overflow: 'hidden'
      }}>
        <Checkbox
          {...props}
          theme={theme}
          type='checkbox' />
        <Label
          theme={theme}
          htmlFor={props.id} />
      </div>
    </div>
  );
}

export default SidebarCheckbox;