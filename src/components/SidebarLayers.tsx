import React, { useContext, ReactElement, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarLayer from './SidebarLayer';
import SortableTree from './SortableTree';

interface SidebarLayersStateProps {
  layers: any;
}

const SidebarLayers = (props: SidebarLayersStateProps): ReactElement => {
  return (
    props.layers.activePage
    ? <SortableTree
        treeData={props.layers.byId[props.layers.activePage]}
        nodeComponent={<SidebarLayer/>} />
    : null
  )
}

const mapStateToProps = (state: RootState) => {
  const { layers } = state;
  return { layers };
};

export default connect(mapStateToProps)(SidebarLayers);