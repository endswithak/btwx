import React, { ReactElement } from 'react';
import SidebarFrameStyles from './SidebarFrameStyles';
import SidebarOpacityStyles from './SidebarOpacityStyles';
import SidebarFillStyles from './SidebarFillStyles';
import SidebarStrokeStyles from './SidebarStrokeStyles';
import SidebarShadowStyles from './SidebarShadowStyles';
import SidebarTextStyles from './SidebarTextStyles';
import SidebarAlignmentStyles from './SidebarAlignmentStyles';
import SidebarBlurStyles from './SidebarBlurStyles';
import AlignDistribute from './AlignDistribute';
import SwatchEditor from './SwatchEditor';
import SidebarShapeStyles from './SidebarShapeStyles';
import FontFamilySelectorWrap from './FontFamilySelectorWrap';

const SidebarLayerStyles = (): ReactElement => {
  return (
    <>
      {/* sections */}
      <AlignDistribute />
      <SidebarFrameStyles />
      <SidebarShapeStyles />
      <SidebarOpacityStyles />
      <SidebarTextStyles />
      <SidebarAlignmentStyles />
      <SidebarFillStyles />
      <SidebarStrokeStyles />
      <SidebarShadowStyles />
      <SidebarBlurStyles />
      {/* abs items */}
      <SwatchEditor />
      <FontFamilySelectorWrap />
    </>
  );
}

export default SidebarLayerStyles;