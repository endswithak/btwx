import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ContextMenuItemProps {
  text: string;
  disabled: boolean;
  onClick(e: any): void;
  onMouseEnter?(e: any): void;
  onMouseLeave?(e: any): void;
}

interface ItemProps {
  isDisabled: boolean;
}

const Item = styled.div<ItemProps>`
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer' };
  button {
    opacity: ${props => props.isDisabled ? 0.5 : 1 };
    pointer-events: ${props => props.isDisabled ? 'none' : 'auto' };
    color: ${props => props.theme.text.base};
    :hover {
      background: ${props => props.isDisabled ? 'none' : props.theme.palette.primary};
      color: ${props => props.isDisabled ? props.theme.text.base : props.theme.text.onPrimary};
    }
  }
`;

const ContextMenuItem = (props: ContextMenuItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, onClick, disabled, onMouseEnter, onMouseLeave } = props;

  return (
    <Item
      className='c-context-menu__item'
      onMouseEnter={onMouseEnter}
      isDisabled={disabled}
      onMouseLeave={onMouseLeave}
      theme={theme}>
      <button onClick={onClick}>
        {text}
      </button>
    </Item>
  );
}

export default ContextMenuItem;