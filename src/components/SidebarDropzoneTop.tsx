import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';
import SidebarDropzoneArea from './SidebarDropzoneArea';
import LayerNode from '../canvas/base/layerNode';

interface SidebarDropzoneTopProps {
  layer: LayerNode;
  depth: number;
  dragLayer: LayerNode;
  dragEnterLayer: LayerNode;
  dropzone: em.Dropzone;
}

const SidebarDropzoneTop = (props: SidebarDropzoneTopProps): ReactElement => {
  const dz = 'Top';
  const globalState = useContext(store);
  const { theme, layersSidebarWidth } = globalState;
  const {layer, depth, dragLayer, dragEnterLayer, dropzone} = props;
  const isActive = dragEnterLayer && dragEnterLayer.id === layer.id && dropzone === dz;

  return (
    <SidebarDropzoneArea
      id={layer.id}
      dz={dz}
      style={{
        width: layersSidebarWidth - (depth * (theme.unit * 4)),
        boxShadow: isActive ? `0 -${theme.unit / 2}px 0 0 ${theme.palette.primary}` : '',
        height: layer.canHaveLayers ? theme.unit * 2 : theme.unit * 4
      }} />
  );
}

export default SidebarDropzoneTop;