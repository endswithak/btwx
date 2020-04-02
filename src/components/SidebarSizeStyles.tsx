import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarStylesInput from './SidebarStylesInput';

const SidebarSizeStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const width = selectedLayer ? selectedLayer.frame.width : '';
  const height = selectedLayer ? selectedLayer.frame.height : '';

  return (
    <div className='c-sidebar-frame-styles__section'>
      <SidebarStylesInput
        value={width}
        readOnly={true}
        label={'W'} />
      <SidebarStylesInput
        value={height}
        readOnly={true}
        label={'H'} />
    </div>
  );
}

export default SidebarSizeStyles;