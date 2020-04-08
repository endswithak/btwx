import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarLayerGroup from './SidebarLayerGroup';
import SidebarLayerItem from './SidebarLayerItem';
import PaperLayer from '../canvas/base/layer';

interface SidebarLayerProps {
  layer: PaperLayer;
  depth: number;
  path: string;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const globalState = useContext(store);
  const { layer, depth, path } = props;
  const layerPath = path ? `${path}/${layer.layer.id}` : `${layer.layer.id}`;

  if (layer.isGroup) {
    return (
      <SidebarLayerGroup
        group={layer as PaperLayer}
        depth={depth}
        path={layerPath} />
    );
  } else {
    return (
      <SidebarLayerItem
        layer={layer as PaperLayer}
        depth={depth}
        path={layerPath} />
    );
  }
}

export default SidebarLayer;