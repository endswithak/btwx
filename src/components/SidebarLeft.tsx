import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Sidebar from './Sidebar';
import SidebarLayerTree from './SidebarLayerTree';
import SidebarLeftDragHandle from './SidebarLeftDragHandle';
import SidebarLeftEmptyState from './SidebarLeftEmptyState';
import SidebarLayersSearch from './SidebarLayersSearch';

interface SidebarLeftProps {
  sidebarWidth: number;
  ready: boolean;
  isEmpty?: boolean;
}

const SidebarLeft = (props: SidebarLeftProps): ReactElement => {
  const { sidebarWidth, ready, isEmpty } = props;
  const [searchActive, setSearchActive] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <>
      <SidebarLeftDragHandle />
      <Sidebar
        width={sidebarWidth}
        position='left'
        header
        headerChildren={(
          <SidebarLayersSearch
            searchActive={searchActive}
            search={search}
            setSearchActive={setSearchActive}
            setSearch={setSearch} />
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
  );
}

const mapStateToProps = (state: RootState) => {
  const { documentSettings, layer } = state;
  const sidebarWidth = documentSettings.leftSidebarWidth;
  const isEmpty = layer.present.allIds.length <= 1;
  return { sidebarWidth, isEmpty };
};

export default connect(
  mapStateToProps
)(SidebarLeft);