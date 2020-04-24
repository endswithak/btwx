import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarDropzoneArea from './SidebarDropzoneArea';

interface SidebarDropzoneBottomProps {
  layer: em.Layer;
  depth: number;
  dragLayer: em.Layer;
  dragEnterLayer: em.Layer;
  dropzone: em.Dropzone;
}

const SidebarDropzoneBottom = (props: SidebarDropzoneBottomProps): ReactElement => {
  const dz = 'Bottom';
  const theme = useContext(ThemeContext);
  const {layer, depth, dragLayer, dragEnterLayer, dropzone} = props;
  const isActive = dragEnterLayer && dragEnterLayer.id === layer.id && dropzone === dz;

  return (
    <SidebarDropzoneArea
      id={layer.id}
      dz={dz}
      style={{
        //width: layersSidebarWidth - (depth * (theme.unit * 4)),
        width: '100%',
        boxShadow: isActive ? `0 -${theme.unit / 2}px 0 0 ${theme.palette.primary} inset` : '',
        height: layer.children ? theme.unit * 2 : theme.unit * 4
      }} />
  );
}

export default SidebarDropzoneBottom;