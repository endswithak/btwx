import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';
import SidebarDropzoneArea from './SidebarDropzoneArea';

interface SidebarDropzoneBottomProps {
  id: string;
  depth: number;
  canHaveChildren: boolean;
}

const SidebarDropzoneBottom = (props: SidebarDropzoneBottomProps): ReactElement => {
  const dz = 'bottom';
  const globalState = useContext(store);
  const { theme, dropzone, dragEnterLayer, layersSidebarWidth } = globalState;
  const {id, depth, canHaveChildren} = props;
  const isActive = dragEnterLayer && dragEnterLayer.id === id && dropzone === dz;

  return (
    <SidebarDropzoneArea
      id={id}
      dz={dz}
      style={{
        width: layersSidebarWidth - (depth * (theme.unit * 4)),
        boxShadow: isActive ? `0 -${theme.unit / 2}px 0 0 ${theme.palette.primary} inset` : '',
        height: canHaveChildren ? theme.unit * 2 : theme.unit * 4
      }} />
  );
}

export default SidebarDropzoneBottom;