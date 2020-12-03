import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';
import SidebarLeftDragHandle from './SidebarLeftDragHandle';
import SidebarLeftEmptyState from './SidebarLeftEmptyState';
import SidebarLayersSearch from './SidebarLayersSearch';

interface SidebarLeftProps {
  isOpen: boolean;
  sidebarWidth: number;
  ready: boolean;
  isEmpty?: boolean;
}

const SidebarLeft = (props: SidebarLeftProps): ReactElement => {
  const { isOpen, sidebarWidth, ready, isEmpty } = props;

  useEffect(() => {
    console.log('LEFT SIDEBAR');
  }, [isOpen, isEmpty, ready]);

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
            ready && !isEmpty
            ? <SidebarLayerTree />
            : <SidebarLeftEmptyState />
          }
        </Sidebar>
      </>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { viewSettings, layer } = state;
  const isOpen = viewSettings.leftSidebar.isOpen;
  const sidebarWidth = viewSettings.leftSidebar.width;
  const isEmpty = layer.present.allIds.length === 1;
  return { isOpen, sidebarWidth, isEmpty };
};

export default connect(
  mapStateToProps
)(SidebarLeft);