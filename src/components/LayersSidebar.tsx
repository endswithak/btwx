import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import SidebarLayers from './SidebarLayers';

const LayersSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedArtboard, theme } = globalState;

  return (
    <div className='c-layers-sidebar'>
      <SidebarLayers
        layers={selectedArtboard.layers}
        depth={0}
        path={''} />
    </div>
  );
}

export default LayersSidebar;