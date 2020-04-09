import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarLayerGroup from './SidebarLayerGroup';
import SidebarLayerItem from './SidebarLayerItem';
import PaperArtboard from '../canvas/base/artboard';
import PaperGroup from '../canvas/base/group';
import PaperShape from '../canvas/base/shape';

interface SidebarLayerProps {
  layer: PaperArtboard | PaperGroup | PaperShape;
  depth: number;
  path: string;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const globalState = useContext(store);
  const { layer, depth, path } = props;

  if (layer.type === 'Group' || layer.type === 'Artboard') {
    return (
      <SidebarLayerGroup
        group={layer as PaperGroup | PaperArtboard}
        depth={depth} />
    );
  } else {
    return (
      <SidebarLayerItem
        layer={layer as PaperShape}
        depth={depth} />
    );
  }
}

export default SidebarLayer;