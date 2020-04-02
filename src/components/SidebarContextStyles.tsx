import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import { getBlendMode } from '../canvas/layer/utils/contextUtils';
import SidebarStylesInput from './SidebarStylesInput';
import SidebarOpacityStyles from './SidebarOpacityStyles';

const SidebarContextStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const opacity = selectedLayer ? `${100 * selectedLayer.style.contextSettings.opacity}%` : '';
  const blendMode = selectedLayer ? getBlendMode({blendMode: selectedLayer.style.contextSettings.blendMode}) : '';
  const formattedBlendMode = selectedLayer ? blendMode.charAt(0).toUpperCase() + blendMode.slice(1) : '';

  return (
    <div className='c-sidebar-context-styles'>
      <SidebarOpacityStyles />
      <div className='c-sidebar-context-styles__section'>
        <SidebarStylesInput
          value={formattedBlendMode}
          readOnly={true} />
      </div>
    </div>
  );
}

export default SidebarContextStyles;