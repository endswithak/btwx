import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

const SidebarRotationStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const rotation = selectedLayer ? selectedLayer.rotation * -1 : '';

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <SidebarInput
          value={rotation}
          readOnly={true}
          label={'°'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarRotationStyles;