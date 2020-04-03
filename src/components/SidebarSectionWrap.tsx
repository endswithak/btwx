import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

interface SidebarSectionWrapProps {
  children: ReactElement | ReactElement[];
}

const SidebarSectionWrap = (props: SidebarSectionWrapProps): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  return (
    <div className='c-sidebar-section-wrap'>
      { props.children }
    </div>
  );
}

export default SidebarSectionWrap;