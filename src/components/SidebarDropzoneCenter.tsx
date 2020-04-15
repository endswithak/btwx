import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';
import SidebarDropzoneArea from './SidebarDropzoneArea';

interface SidebarDropzoneCenterProps {
  id: string;
}

const SidebarDropzoneCenter = (props: SidebarDropzoneCenterProps): ReactElement => {
  const dz = 'center';
  const globalState = useContext(store);
  const { theme, dropzone, dragEnterLayer } = globalState;
  const {id} = props;
  const isActive = dragEnterLayer && dragEnterLayer.id === id && dropzone === dz;

  return (
    <SidebarDropzoneArea
      id={id}
      dz={dz}
      style={{
        boxShadow: isActive ? `0 0 0 ${theme.unit / 2}px ${theme.palette.primary} inset` : ''
      }} />
  );
}

export default SidebarDropzoneCenter;