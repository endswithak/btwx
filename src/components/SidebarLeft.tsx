import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';
import SidebarLayerSearchTree from './SidebarLayerSearchTree';
import SidebarLeftDragHandle from './SidebarLeftDragHandle';
import SidebarLayersSearch from './SidebarLayersSearch';

interface SidebarLeftProps {
  isOpen: boolean;
  sidebarWidth: number;
  ready: boolean;
  isEmpty?: boolean;
  searchActive?: boolean;
}

const SidebarLeft = (props: SidebarLeftProps): ReactElement => {
  const { isOpen, sidebarWidth, ready, isEmpty, searchActive } = props;

  // useEffect(() => {
  //   console.log('LEFT SIDEBAR');
  // }, [isOpen, isEmpty, ready]);

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

const mapStateToProps = (state: RootState) => {
  const { viewSettings, layer, leftSidebar } = state;
  const isOpen = viewSettings.leftSidebar.isOpen;
  const sidebarWidth = viewSettings.leftSidebar.width;
  const isEmpty = layer.present.childrenById.root.length === 0;
  const searchActive = leftSidebar.search.replace(/\s/g, '').length > 0;
  return { isOpen, sidebarWidth, isEmpty, searchActive };
};

export default connect(
  mapStateToProps
)(SidebarLeft);