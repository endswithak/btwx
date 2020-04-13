import React, { useContext, ReactElement, useState } from 'react';
import { store } from '../store';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayers from './SidebarLayers';
import TreeNode from '../canvas/base/treeNode';

interface SidebarLayerGroupProps {
  group: TreeNode;
  depth: number;
}

const SidebarLayerGroup = (props: SidebarLayerGroupProps): ReactElement => {
  const globalState = useContext(store);
  const [isOpen, setIsOpen] = useState(false);
  const { group, depth } = props;

  return (
    <div>
      <SidebarLayerItem
        layer={group}
        depth={depth}
        isGroup
        isOpen={isOpen}
        setIsOpen={setIsOpen} />
      {
        isOpen
        ? <SidebarLayers
            layers={group.children}
            depth={depth + 1} />
        : null
      }
    </div>
  );
}

export default SidebarLayerGroup;