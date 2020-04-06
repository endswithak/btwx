import React, { useContext, ReactElement, useState } from 'react';
import { store } from '../store';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerGroupProps {
  group: paper.Group;
  layers: paper.Item[];
  path: string;
  depth: number;
}

const SidebarLayerGroup = (props: SidebarLayerGroupProps): ReactElement => {
  const globalState = useContext(store);
  const [isOpen, setIsOpen] = useState(false);
  const { group, depth, path, layers } = props;

  return (
    <div>
      <SidebarLayerItem
        layer={group}
        depth={depth}
        isGroup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        path={path} />
      {
        isOpen
        ? <SidebarLayers
            layers={layers}
            depth={depth + 1}
            path={path} />
        : null
      }
    </div>
  );
}

export default SidebarLayerGroup;