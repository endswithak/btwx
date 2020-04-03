import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

interface SidebarSectionProps {
  children: ReactElement | ReactElement[];
}

const SidebarSection = (props: SidebarSectionProps): ReactElement => {
  const globalState = useContext(store);
  const { selectedLayer, theme, dispatch } = globalState;

  return (
    <div className='c-sidebar-section'>
      { props.children }
    </div>
  );
}

export default SidebarSection;