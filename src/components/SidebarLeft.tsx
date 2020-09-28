import React, { ReactElement, useState } from 'react';
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
  const [searchActive, setSearchActive] = useState(false);
  const [search, setSearch] = useState('');

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
            ? <SidebarLayersSearch
                searchActive={searchActive}
                search={search}
                setSearchActive={setSearchActive}
                setSearch={setSearch} />
            : null
          )}>
          {
            ready && !isEmpty
            ? <SidebarLayerTree
                searchActive={searchActive}
                search={search} />
            : <SidebarLeftEmptyState />
          }
        </Sidebar>
      </>
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { documentSettings, layer } = state;
  const isOpen = documentSettings.view.leftSidebar.isOpen;
  const sidebarWidth = documentSettings.view.leftSidebar.width;
  const isEmpty = layer.present.allIds.length <= 1;
  return { isOpen, sidebarWidth, isEmpty };
};

export default connect(
  mapStateToProps
)(SidebarLeft);