import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';
import Sidebar from './Sidebar';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarLayers from './SidebarLayers';
import SortableTree from 'react-sortable-tree';

let lsDeltaX = 0;

const LayersSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, layersSidebarWidth,  paperApp, treeData } = globalState;

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

  const handleChange = (treeData) => {
    dispatch({
      type: 'update-tree-data',
      treeData: treeData
    });
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
      {/* {
        paperApp
        ? <SidebarLayers
            layers={paperApp.page.children}
            depth={0} />
        : null
      } */}
      <SortableTree
        treeData={treeData}
        onChange={treeData => handleChange(treeData)}
      />
    </Sidebar>
  );
}

export default LayersSidebar;