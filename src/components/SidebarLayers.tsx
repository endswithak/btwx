import React, { useContext, ReactElement, useEffect } from 'react';
import { store } from '../store';
import SidebarLayer from './SidebarLayer';
import SortableTree from './SortableTree';

const SidebarLayers = (): ReactElement => {
  const globalState = useContext(store);
  const { layers } = globalState;
  useEffect(() => {
    console.log(layers);
  }, [layers])
  return (
    <SortableTree
      treeData={layers}
      nodeComponent={<SidebarLayer/>} />
  )
}

export default SidebarLayers;