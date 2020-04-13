import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import SidebarLayer from './SidebarLayer';
import TreeNode from '../canvas/base/treeNode';

interface SidebarLayersProps {
  layers: TreeNode[];
  depth: number;
}

const SidebarLayers = (props: SidebarLayersProps): ReactElement => {
  const globalState = useContext(store);
  return (
    <div>
      {
        props.layers.map((layer: TreeNode, index: number) => (
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