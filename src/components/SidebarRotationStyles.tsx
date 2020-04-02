import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

const SidebarRotationStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedPaperLayer, theme, dispatch } = globalState;

  const rotation = selectedPaperLayer ? selectedPaperLayer.rotation : '';

  return (
    <div className='c-sidebar-frame-styles__rotation'>
      <div className='c-sidebar-frame-styles__input-wrap'>
        <input value={rotation} readOnly className='c-sidebar-frame-styles__input' />
      </div>
    </div>
  );
}

export default SidebarRotationStyles;