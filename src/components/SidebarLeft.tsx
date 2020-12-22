import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';
import SidebarLayerSearchTree from './SidebarLayerSearchTree';
import SidebarLeftDragHandle from './SidebarLeftDragHandle';
import SidebarLayersSearch from './SidebarLayersSearch';

const SidebarLeft = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const isOpen = useSelector((state: RootState) => state.viewSettings.leftSidebar.isOpen);
  const sidebarWidth = useSelector((state: RootState) => state.viewSettings.leftSidebar.width);
  const isEmpty = useSelector((state: RootState) => state.layer.present.childrenById.root.length === 0);
  const searchActive = useSelector((state: RootState) => state.leftSidebar.search.replace(/\s/g, '').length > 0);

  return (
    isOpen
    ? <>
        <SidebarLeftDragHandle />
        <Sidebar
          width={sidebarWidth}
          position='left'
          header
          headerChildren={(
            ready && !isEmpty
            ? <SidebarLayersSearch />
            : null
          )}>
          {
            ready
            ? <SidebarLayerTree />
            : null
          }
          {
            ready && searchActive
            ? <SidebarLayerSearchTree />
            : null
          }
        </Sidebar>
      </>
    : null
  );
}

export default SidebarLeft;