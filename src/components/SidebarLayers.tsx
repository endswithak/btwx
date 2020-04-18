import React, { useContext, ReactElement } from 'react';
import { store } from '../store';
import SidebarLayer from './SidebarLayer';
import SortableTree from './SortableTree';

const SidebarLayers = (): ReactElement => {
  const globalState = useContext(store);
  const { treeData } = globalState;
  return (
    <SortableTree
      treeData={treeData.root}
      nodeComponent={<SidebarLayer/>} />
  )
}

export default SidebarLayers;