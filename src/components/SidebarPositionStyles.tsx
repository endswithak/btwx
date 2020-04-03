import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import { getAbsLayerByPath } from '../utils';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

const SidebarPositionStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedArtboard, selectedLayer, theme, dispatch, selectedLayerPath } = globalState;

  const absLayer = selectedLayer ? getAbsLayerByPath({layer: selectedArtboard, path: selectedLayerPath}) : null;
  const x = absLayer ? absLayer.absPosition.x : '';
  const y = absLayer ? absLayer.absPosition.y : '';

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <SidebarInput
          value={x}
          readOnly={true}
          label={'X'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <SidebarInput
          value={y}
          readOnly={true}
          label={'Y'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarPositionStyles;