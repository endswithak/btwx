import React, { useContext, ReactElement } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarLayerGroup from './SidebarLayerGroup';
import SidebarLayerItem from './SidebarLayerItem';
import TreeNode from '../canvas/base/treeNode';

interface SidebarLayerProps {
  layer: TreeNode;
  depth: number;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const globalState = useContext(store);
  const { layer, depth } = props;

  switch(layer.type) {
    case 'Group':
    case 'Artboard':
      return (
        <SidebarLayerGroup
          group={layer as TreeNode}
          depth={depth} />
      );
    case 'Shape':
      return (
        <SidebarLayerItem
          layer={layer as TreeNode}
          depth={depth} />
      );
    default:
      return <div></div>
  }
}

export default SidebarLayer;