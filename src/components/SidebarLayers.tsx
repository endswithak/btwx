import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import SidebarLayer from './SidebarLayer';
import PaperArtboard from '../canvas/base/artboard';
import PaperGroup from '../canvas/base/group';
import PaperShape from '../canvas/base/shape';

interface SidebarLayersProps {
  layers: (PaperArtboard | PaperGroup | PaperShape)[];
  depth: number;
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const globalState = useContext(store);
  return (
    <div>
      {
        props.layers.map((layer: PaperArtboard | PaperGroup | PaperShape, index: number) => (
          <SidebarLayer
            key={index}
            layer={layer}
            depth={props.depth} />
        ))
      }
    </div>
  )
}

export default SidebarLayers;