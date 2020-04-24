import React, { useContext, ReactElement, useEffect } from 'react';
import SidebarLayer from './SidebarLayer';

interface SidebarLayersProps {
  layers: string[];
  dragLayer: em.Layer;
  dragEnterLayer: em.Layer;
  dropzone: em.Dropzone;
  depth: number;
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const { layers, depth, dragLayer, dragEnterLayer, dropzone } = props;

  return (
    <>
      {
        layers.map((child: string, index: number) => (
          <SidebarLayer
            key={index}
            layer={child}
            depth={depth + 1}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        ))
      }
    </>
  )
}

export default SidebarLayers;