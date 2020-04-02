import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

const SidebarPositionStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedPaperLayer, theme, dispatch } = globalState;

  const x = selectedPaperLayer ? selectedPaperLayer.position.x : '';
  const y = selectedPaperLayer ? selectedPaperLayer.position.y : '';

  return (
    <div className='c-sidebar-frame-styles__position'>
      <div className='c-sidebar-frame-styles__input-wrap'>
        <input value={x} readOnly className='c-sidebar-frame-styles__input' />
      </div>
      <div className='c-sidebar-frame-styles__input-wrap'>
        <input value={y} readOnly className='c-sidebar-frame-styles__input' />
      </div>
    </div>
  );
}

export default SidebarPositionStyles;