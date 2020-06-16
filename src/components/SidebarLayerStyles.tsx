import React, { ReactElement } from 'react';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';
import SidebarFillStyles from './SidebarFillStyles';
import SidebarStrokeStyles from './SidebarStrokeStyles';
import SidebarShadowStyles from './SidebarShadowStyles';
import SidebarTextStyles from './SidebarTextStyles';

const SidebarLayerStyles = (): ReactElement => {
  return (
    <>
      <SidebarFrameStyles />
      <SidebarContextStyles />
      <SidebarTextStyles />
      <SidebarFillStyles />
      <SidebarStrokeStyles />
      {/* <SidebarShadowStyles /> */}
    </>
  );
}

export default SidebarLayerStyles;