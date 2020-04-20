import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarDropzoneArea from './SidebarDropzoneArea';
import LayerNode from '../canvas/base/layerNode';

interface SidebarDropzoneCenterProps {
  layer: LayerNode;
  dragLayer: LayerNode;
  dragEnterLayer: LayerNode;
  dropzone: em.Dropzone;
}

const SidebarDropzoneCenter = (props: SidebarDropzoneCenterProps): ReactElement => {
  const dz = 'Center';
  const theme = useContext(ThemeContext);
  const {layer, dragLayer, dragEnterLayer, dropzone} = props;
  const isActive = dragEnterLayer && dragEnterLayer.id === layer.id && dropzone === dz;

  return (
    <SidebarDropzoneArea
      id={layer.id}
      dz={dz}
      style={{
        boxShadow: isActive ? `0 0 0 ${theme.unit / 2}px ${theme.palette.primary} inset` : ''
      }} />
  );
}

export default SidebarDropzoneCenter;