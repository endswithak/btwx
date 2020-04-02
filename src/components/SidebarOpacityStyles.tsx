import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import { getBlendMode } from '../canvas/layer/utils/contextUtils';
import Slider from 'rc-slider';
import SidebarStylesInput from './SidebarStylesInput';

const SidebarOpacityStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const disabled = selectedLayer === null;
  const opacity = selectedLayer ? Math.round(100 * selectedLayer.style.contextSettings.opacity) : 3
  const formattedOpacity = selectedLayer ? opacity : '';

  return (
    <div className='c-sidebar-context-styles__opacity'>
      <div className='c-sidebar-context-styles__opacity-slider'>
        <Slider
          value={opacity}
          handleStyle={[{
            background: theme.backgroundInverse.z6,
            borderColor: theme.backgroundInverse.z6,
            boxShadow: `0 0 5px ${theme.background.z0}`
          }]}
          trackStyle={[{
            background: theme.palette.primary
          }]}
          railStyle={{
            background: theme.background.z4
          }} />
      </div>
      <div className='c-sidebar-context-styles__opacity-input'>
        <SidebarStylesInput
          value={formattedOpacity}
          readOnly={true}
          label={'%'} />
      </div>
    </div>
  );
}

export default SidebarOpacityStyles;