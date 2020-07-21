import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import styled from 'styled-components';

interface ContextMenuItemProps {
  text: string;
  onClick(e: any): void;
}

const Item = styled.button`
  color: ${props => props.theme.text.base};
  :hover {
    background: ${props => props.theme.palette.primary};
    color: ${props => props.theme.text.onPrimary};
  }
`;

const ContextMenuItem = (props: ContextMenuItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, onClick } = props;

  const handleClick = (e: any) => {
    onClick(e);
  }

  return (
    <Item
      className='c-context-menu__item'
      onClick={handleClick}
      theme={theme}>
      {text}
    </Item>
  );
}

export default ContextMenuItem;