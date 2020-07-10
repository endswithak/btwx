import React, { useContext, ReactElement, useEffect } from 'react';
import SidebarLayer from './SidebarLayer';

interface SidebarLayersProps {
  layers: string[];
  dragLayers: string[];
  depth: number;
  dragging: boolean;
  dragGhost?: boolean;
  setDragLayers(layers: string[]): void;
  setDragging(dragging: boolean): void;
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const { layers, depth, dragging, dragGhost, dragLayers, setDragLayers, setDragging } = props;

  return (
    <>
      {
        layers.map((child: string, index: number) => (
          <SidebarLayer
            key={index}
            layer={child}
            depth={depth + 1}
            dragLayers={dragLayers}
            setDragLayers={setDragLayers}
            setDragging={setDragging}
            dragging={dragging}
            dragGhost={dragGhost} />
        ))
      }
    </>
  )
}

export default SidebarLayers;