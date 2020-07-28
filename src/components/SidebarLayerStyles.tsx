import React, { ReactElement } from 'react';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarContextStyles from './SidebarContextStyles';
import SidebarFillStyles from './SidebarFillStyles';
import SidebarStrokeStyles from './SidebarStrokeStyles';
import SidebarShadowStyles from './SidebarShadowStyles';
import SidebarTextStyles from './SidebarTextStyles';
import AlignDistribute from './AlignDistribute';
// import FillEditor from './FillEditor';
// import StrokeEditor from './StrokeEditor';
// import ShadowEditor from './ShadowEditor';
import SwatchEditor from './SwatchEditor';
import SidebarShapeStyles from './SidebarShapeStyles';

const SidebarLayerStyles = (): ReactElement => {
  return (
    <>
      <AlignDistribute />
      <SidebarFrameStyles />
      <SidebarShapeStyles />
      <SidebarContextStyles />
      <SidebarTextStyles />
      <SidebarFillStyles />
      <SidebarStrokeStyles />
      <SidebarShadowStyles />
      <SwatchEditor />
      {/* <FillEditor />
      <StrokeEditor />
      <ShadowEditor /> */}
    </>
  );
}

export default SidebarLayerStyles;