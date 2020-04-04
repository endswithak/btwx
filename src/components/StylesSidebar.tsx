import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import Sidebar from './Sidebar';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';
import SidebarFillStyles from './SidebarFillStyles';

const StylesSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, stylesSidebarWidth, canvas } = globalState;

  return (
    <Sidebar
      width={stylesSidebarWidth}
      position={'right'}
      resizable={false}>
      <SidebarFrameStyles />
      <SidebarContextStyles />
      <SidebarFillStyles />
    </Sidebar>
  );
}

export default StylesSidebar;