import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarLayerGroup from './SidebarLayerGroup';
import SidebarLayerItem from './SidebarLayerItem';

interface SidebarLayerProps {
  layer: FileFormat.AnyLayer;
  depth: number;
  path: string;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const globalState = useContext(store);
  const { layer, depth, path } = props;
  const layerPath = path ? path + '/' + layer.do_objectID : layer.do_objectID;

  switch(layer._class) {
    case 'group':
      return (
        <SidebarLayerGroup
          group={layer}
          depth={depth}
          path={layerPath} />
      );
    default:
      return (
        <SidebarLayerItem
          layer={layer}
          depth={depth}
          path={layerPath} />
      );
  }
}

export default SidebarLayer;