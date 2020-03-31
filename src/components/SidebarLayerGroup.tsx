import React, { useContext, ReactElement, useState } from 'react';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { store } from '../store';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerGroupProps {
  group: FileFormat.Group;
  path: string;
  depth: number;
}

const SidebarLayerGroup = (props: SidebarLayerGroupProps): ReactElement => {
  const globalState = useContext(store);
  const [isOpen, setIsOpen] = useState(false);
  const { group, depth, path } = props;

  return (
    <div className='c-layers-sidebar__layer-group'>
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
            layers={group.layers}
            depth={depth + 1}
            path={path} />
        : null
      }
    </div>
  );
}

export default SidebarLayerGroup;