import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLeftSidebarLayers } from '../store/selectors';
// import SidebarLayerDropzoneWrap from './SidebarLayerDropzoneWrap';
import SidebarLayers from './SidebarLayers';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';
import SidebarLeftSearchEmptyState from './SidebarLeftSearchEmptyState';

interface SidebarLayerTreeProps {
  layers?: string[];
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const { layers } = props;

  useEffect(() => {
    console.log('LAYER TREE');
  }, []);

  return (
    <>
      {
        layers.length > 0
        ? <SidebarLayers
            layers={layers} />
        : <SidebarLeftSearchEmptyState />
      }
      <SidebarLayerDragGhosts />
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    layers: getLeftSidebarLayers(state)
  };
};

export default connect(
  mapStateToProps
)(SidebarLayerTree);