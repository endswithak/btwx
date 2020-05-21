import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';
import SidebarFillStyles from './SidebarFillStyles';
import SidebarStrokeStyles from './SidebarStrokeStyles';
import SidebarShadowStyles from './SidebarShadowStyles';

const StylesSidebar = (): ReactElement => {
  return (
    <Sidebar
      width={280}
      position={'right'}
      resizable={false}>
      <SidebarFrameStyles />
      <SidebarContextStyles />
      <SidebarFillStyles />
      <SidebarStrokeStyles />
      <SidebarShadowStyles />
    </Sidebar>
  );
}

export default StylesSidebar;