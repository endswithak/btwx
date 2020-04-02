import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';
import SidebarStylesInput from './SidebarStylesInput';

const SidebarRotationStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  const rotation = selectedLayer ? selectedLayer.rotation * -1 : '';

  return (
    <div className='c-sidebar-frame-styles__section'>
      <SidebarStylesInput
        value={rotation}
        readOnly={true}
        label={'°'} />
    </div>
  );
}

export default SidebarRotationStyles;