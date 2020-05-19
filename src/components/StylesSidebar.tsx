import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';
import SidebarFillStyles from './SidebarFillStyles';

const StylesSidebar = (): ReactElement => {
  return (
    <Sidebar
      width={320}
      position={'right'}
      resizable={false}>
      <SidebarFrameStyles />
      {/* <SidebarContextStyles />
      <SidebarFillStyles /> */}
    </Sidebar>
  );
}

export default StylesSidebar;