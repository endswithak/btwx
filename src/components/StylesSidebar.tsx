import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import Sidebar from './Sidebar';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';

//let ssDeltaX = 0;

const LayersSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, stylesSidebarWidth } = globalState;

  return (
    <Sidebar
      width={stylesSidebarWidth}
      position={'right'}
      resizable={false}>
      <div>
        <SidebarSectionHead
          text={'position'} />
        <SidebarFrameStyles />
        <SidebarSectionHead
          text={'appearance'} />
        <SidebarContextStyles />
      </div>
    </Sidebar>
  );
}

export default LayersSidebar;