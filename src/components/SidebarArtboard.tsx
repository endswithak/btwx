import React, { useContext, ReactElement, useState } from 'react';
import { store } from '../store';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayers from './SidebarLayers';

interface SidebarArtboardProps {
  artboard: paper.Group;
  path: string;
  depth: number;
}

const SidebarArtboard = (props: SidebarArtboardProps): ReactElement => {
  const globalState = useContext(store);
  const [isOpen, setIsOpen] = useState(false);
  const { artboard, depth, path } = props;

  return (
    <div>
      <SidebarLayerItem
        layer={artboard}
        depth={depth}
        isGroup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        path={path} />
      {
        isOpen
        ? <SidebarLayers
            layers={artboard.children.find((child) => child.name === 'layers').children}
            depth={depth + 1}
            path={path} />
        : null
      }
    </div>
  );
}

export default SidebarArtboard;