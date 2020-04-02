import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import Sidebar from './Sidebar';
import SidebarFrameStyles from './SidebarFrameStyles';

//let ssDeltaX = 0;

const LayersSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, stylesSidebarWidth } = globalState;

  // const handleDragStart = (e) => {
  //   ssDeltaX = e.clientX;
  // }

  // const handleDrag = (e) => {
  //   if (e.clientX !== 0) {
  //     dispatch({
  //       type: 'set-styles-sidebar-width',
  //       stylesSidebarWidth: stylesSidebarWidth - (e.clientX - ssDeltaX)
  //     });
  //     ssDeltaX = e.clientX;
  //   }
  // }

  return (
    <Sidebar
      width={stylesSidebarWidth}
      position={'right'}
      resizable={false}>
      <SidebarFrameStyles />
    </Sidebar>
  );
}

export default LayersSidebar;