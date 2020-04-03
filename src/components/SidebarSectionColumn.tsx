import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

interface SidebarSectionColumnProps {
  children: ReactElement | ReactElement[];
  width?: number | string;
  justifyContent?: string;
  alignItems?: string;
}

const SidebarSectionColumn = (props: SidebarSectionColumnProps): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  return (
    <div
      className='c-sidebar-section__column'
      style={{
        width: props.width,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems
      }}>
      { props.children }
    </div>
  );
}

export default SidebarSectionColumn;