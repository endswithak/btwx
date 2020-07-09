import React, { useContext, ReactElement, useEffect } from 'react';
import SidebarLayer from './SidebarLayer';

interface SidebarLayersProps {
  layers: string[];
  dragLayer: string;
  depth: number;
  setDragLayer(id: string): void;
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const { layers, depth, dragLayer, setDragLayer } = props;

  return (
    <>
      {
        layers.map((child: string, index: number) => (
          <SidebarLayer
            key={index}
            layer={child}
            depth={depth + 1}
            dragLayer={dragLayer}
            setDragLayer={setDragLayer} />
        ))
      }
    </>
  )
}

export default SidebarLayers;