import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import Sidebar from './Sidebar';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarLayers from './SidebarLayers';

let lsDeltaX = 0;

const LayersSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { selectedArtboard, theme, dispatch, layersSidebarWidth } = globalState;

  const handleDragStart = (e) => {
    lsDeltaX = e.clientX;
  }

  const handleDrag = (e) => {
    if (e.clientX !== 0) {
      dispatch({
        type: 'set-layers-sidebar-width',
        layersSidebarWidth: layersSidebarWidth + (e.clientX - lsDeltaX)
      });
      lsDeltaX = e.clientX;
    }
  }

  return (
    <Sidebar
      resizable
      width={layersSidebarWidth}
      position={'left'}
      onDrag={handleDrag}
      onDragStart={handleDragStart}>
      <SidebarSectionWrap>
        <SidebarSectionHead
          text={'layers'} />
      </SidebarSectionWrap>
      <SidebarLayers
        layers={selectedArtboard.layers}
        depth={0}
        path={''} />
    </Sidebar>
  );
}

export default LayersSidebar;