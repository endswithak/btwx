import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

const SidebarSizeStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedPaperLayer, theme, dispatch } = globalState;

  const width = selectedPaperLayer ? selectedPaperLayer.bounds.width : '';
  const height = selectedPaperLayer ? selectedPaperLayer.bounds.height : '';

  return (
    <div className='c-sidebar-frame-styles__size'>
      <div className='c-sidebar-frame-styles__input-wrap'>
        <input value={width} readOnly className='c-sidebar-frame-styles__input' />
      </div>
      <div className='c-sidebar-frame-styles__input-wrap'>
        <input value={height} readOnly className='c-sidebar-frame-styles__input' />
      </div>
    </div>
  );
}

export default SidebarSizeStyles;