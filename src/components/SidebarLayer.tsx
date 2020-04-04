import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarLayerGroup from './SidebarLayerGroup';
import SidebarLayerItem from './SidebarLayerItem';

interface SidebarLayerProps {
  layer: paper.Item;
  depth: number;
  path: string;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const globalState = useContext(store);
  const { layer, depth, path } = props;
  const layerPath = path ? `${path}/${layer.id}` : `${layer.id}`;

  switch(layer.className) {
    case 'Group':
      return (
        <SidebarLayerGroup
          group={layer as paper.Group}
          depth={depth}
          path={layerPath} />
      );
    case 'Layer':
      return (
        <SidebarLayerItem
          layer={layer as paper.Layer}
          depth={depth}
          path={layerPath} />
      );
  }
}

export default SidebarLayer;