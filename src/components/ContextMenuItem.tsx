import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';

interface ContextMenuItemProps {
  text: string;
  onClick(e: any): void;
}

const ContextMenuItem = (props: ContextMenuItemProps): ReactElement => {
  const [hover, setHover] = useState(false);
  const theme = useContext(ThemeContext);
  const { text, onClick } = props;

  const handleClick = (e: any) => {
    onClick(e);
  }

  return (
    <div
      className='c-context-menu__item'
      onClick={handleClick}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      style={{
        background: hover
        ? theme.palette.primary
        : 'none',
        color: hover
        ? theme.text.onPrimary
        : theme.text.base
      }}>
      {text}
    </div>
  );
}

export default ContextMenuItem;