import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';
import Sidebar from './Sidebar';
import SidebarSectionHead from './SidebarSectionHead';
import SidebarSectionWrap from './SidebarSectionWrap';
import SidebarTree from './SidebarTree';

const LayersSidebar = (): ReactElement => {
  const globalState = useContext(store);
  const { theme, dispatch, layersSidebarWidth,  paperApp, treeData } = globalState;

  return (
    <Sidebar
      //resizable
      width={layersSidebarWidth}
      position={'left'}
      //onDrag={handleDrag}
      //onDragStart={handleDragStart}
      >
      <SidebarSectionWrap>
        <SidebarSectionHead
          text={'layers'} />
      </SidebarSectionWrap>
      {
        treeData
        ? <SidebarTree />
        : null
      }
    </Sidebar>
  );
}

export default LayersSidebar;

// let lsDeltaX = 0;

// const handleDragStart = (e) => {
//   lsDeltaX = e.clientX;
// }

// const handleDrag = (e) => {
//   if (e.clientX !== 0) {
//     dispatch({
//       type: 'set-layers-sidebar-width',
//       layersSidebarWidth: layersSidebarWidth + (e.clientX - lsDeltaX)
//     });
//     lsDeltaX = e.clientX;
//   }
// }