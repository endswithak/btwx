import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

const SidebarFlippedStyles = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  return (
    <div className='c-sidebar-frame-styles__flipped'>
      <div className='c-sidebar-frame-styles__input-wrap'>
        <button className='c-sidebar-frame-styles__input'>H</button>
      </div>
      <div className='c-sidebar-frame-styles__input-wrap'>
        <button className='c-sidebar-frame-styles__input'>V</button>
      </div>
    </div>
  );
}

export default SidebarFlippedStyles;