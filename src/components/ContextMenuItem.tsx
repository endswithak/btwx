import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ContextMenuItemProps {
  text: string;
  disabled: boolean;
  onClick(e: any): void;
}

const Item = styled.button`
  color: ${props => props.theme.text.base};
  :disabled {
    cursor: default;
    opacity: 0.5;
    :hover {
      background: none;
      color: ${props => props.theme.text.base};
    }
  }
  :hover {
    background: ${props => props.theme.palette.primary};
    color: ${props => props.theme.text.onPrimary};
  }
`;

const ContextMenuItem = (props: ContextMenuItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, onClick, disabled } = props;

  const handleClick = (e: any) => {
    onClick(e);
  }

  return (
    <Item
      className='c-context-menu__item'
      onClick={handleClick}
      disabled={disabled}
      theme={theme}>
      {text}
    </Item>
  );
}

export default ContextMenuItem;