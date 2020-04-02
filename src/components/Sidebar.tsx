import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarDragHandle from './SidebarDragHandle';

interface SidebarProps {
  children: ReactElement;
  width: number;
  onDragStart?(e: DragEvent): void;
  onDrag?(e: DragEvent): void;
  position?: 'left' | 'right';
  resizable?: boolean;
}

const Sidebar = (props: SidebarProps): ReactElement => {
  const globalState = useContext(store);
  const { theme } = globalState;

  return (
    <div
      className='c-sidebar'
      style={{
        width: props.width,
        background: theme.background.z1
      }}>
      {
        props.resizable
        ? <SidebarDragHandle
            onDrag={props.onDrag}
            onDragStart={props.onDragStart}
            style={{
              order: props.position === 'left' ? 1 : 0
            }} />
        : null
      }
      <div className='c-sidebar__scroll'>
        {props.children}
      </div>
    </div>
  );
}

export default Sidebar;