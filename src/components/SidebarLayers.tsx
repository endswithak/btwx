import React, { ReactElement } from 'react';
import SidebarLayer from './SidebarLayer';

interface SidebarLayersProps {
  layers: string[];
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const { layers } = props;

  return (
    <>
      {
        layers.map((layer: string, index: number) => (
          <SidebarLayer
            key={index}
            layer={layer} />
        ))
      }
    </>
  )
}

export default SidebarLayers;