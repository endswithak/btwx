import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';
import SidebarFillStyles from './SidebarFillStyles';
import SidebarStrokeStyles from './SidebarStrokeStyles';

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
    </Sidebar>
  );
}

export default StylesSidebar;