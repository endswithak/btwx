import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
//import SidebarDragHandle from './SidebarDragHandle';

interface SidebarProps {
  children: ReactElement | ReactElement[];
  width: number;
  onDragStart?(e: DragEvent): void;
  onDrag?(e: DragEvent): void;
  position?: 'left' | 'right';
  resizable?: boolean;
}

const Sidebar = (props: SidebarProps): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div
      className='c-sidebar'
      style={{
        width: props.width,
        background: theme.background.z1,
        boxShadow: props.position === 'left' ? `-1px 0 0 0 ${theme.background.z3} inset` : `1px 0 0 0 ${theme.background.z3} inset`
      }}>
      {/* {
        props.resizable
        ? <SidebarDragHandle
            onDrag={props.onDrag}
            onDragStart={props.onDragStart}
            style={{
              order: props.position === 'left' ? 1 : 0
            }} />
        : null
      } */}
      <div className='c-sidebar__scroll'>
        {props.children}
      </div>
    </div>
  );
}

export default Sidebar;