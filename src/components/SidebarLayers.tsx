import React, { ReactElement } from 'react';
import SidebarLayer from './SidebarLayer';

interface SidebarLayersProps {
  layers: string[];
  dragGhost?: boolean;
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const { layers, dragGhost } = props;

  return (
    <>
      {
        layers.map((layer: string, index: number) => (
          <SidebarLayer
            key={index}
            layer={layer}
            dragGhost={dragGhost} />
        ))
      }
    </>
  )
}

export default SidebarLayers;