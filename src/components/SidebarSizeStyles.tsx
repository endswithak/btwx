import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarInput from './SidebarInput';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

const SidebarSizeStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const width = selectedLayer ? selectedLayer.frame.width : '';
  const height = selectedLayer ? selectedLayer.frame.height : '';

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <SidebarInput
          value={width}
          readOnly={true}
          label={'W'} />
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <SidebarInput
          value={height}
          readOnly={true}
          label={'H'} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default SidebarSizeStyles;