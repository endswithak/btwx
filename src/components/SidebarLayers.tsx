import React, { ReactElement, memo } from 'react';
import SidebarLayer from './SidebarLayer';

interface SidebarLayersProps {
  layers: string[];
}

const SidebarLayers = memo(function SidebarLayers(props: SidebarLayersProps) {
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
});

export default SidebarLayers;