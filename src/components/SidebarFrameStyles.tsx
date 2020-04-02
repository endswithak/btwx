import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarPositionStyles from './SidebarPositionStyles';
import SidebarSizeStyles from './SidebarSizeStyles';
import SidebarRotationStyles from './SidebarRotationStyles';
import SidebarFlippedStyles from './SidebarFlippedStyles';

const SidebarFrameStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  return (
    <div className='c-sidebar-frame-styles'>
      <div className='c-sidebar-frame-styles__pos-size'>
        <SidebarPositionStyles />
        <SidebarSizeStyles />
      </div>
      <div className='c-sidebar-frame-styles__rot-flip'>
        <SidebarRotationStyles />
        <SidebarFlippedStyles />
      </div>
    </div>
  );
}

export default SidebarFrameStyles;