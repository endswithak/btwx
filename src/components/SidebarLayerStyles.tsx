import React, { ReactElement } from 'react';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarOpacityStyles from './SidebarOpacityStyles';
import SidebarFillStyles from './SidebarFillStyles';
import SidebarStrokeStyles from './SidebarStrokeStyles';
import SidebarShadowStyles from './SidebarShadowStyles';
import SidebarTextStyles from './SidebarTextStyles';
import AlignDistribute from './AlignDistribute';
import SwatchEditor from './SwatchEditor';
import SidebarShapeStyles from './SidebarShapeStyles';
import FontFamilySelectorWrap from './FontFamilySelectorWrap';

const SidebarLayerStyles = (): ReactElement => {
  return (
    <>
      <AlignDistribute />
      <SidebarFrameStyles />
      <SidebarShapeStyles />
      <SidebarOpacityStyles />
      <SidebarTextStyles />
      <SidebarFillStyles />
      <SidebarStrokeStyles />
      <SidebarShadowStyles />
      <SwatchEditor />
      <FontFamilySelectorWrap />
    </>
  );
}

export default SidebarLayerStyles;