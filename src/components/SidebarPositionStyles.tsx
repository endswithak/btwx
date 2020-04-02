import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import { getAbsLayerByPath } from '../utils';
import SidebarStylesInput from './SidebarStylesInput';

const SidebarPositionStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedArtboard, selectedLayer, theme, dispatch, selectedLayerPath } = globalState;

  const absLayer = selectedLayer ? getAbsLayerByPath({layer: selectedArtboard, path: selectedLayerPath}) : null;
  const x = absLayer ? absLayer.absPosition.x : '';
  const y = absLayer ? absLayer.absPosition.y : '';

  return (
    <div className='c-sidebar-frame-styles__section'>
      <SidebarStylesInput
        value={x}
        readOnly={true}
        label={'X'} />
      <SidebarStylesInput
        value={y}
        readOnly={true}
        label={'Y'} />
    </div>
  );
}

export default SidebarPositionStyles;