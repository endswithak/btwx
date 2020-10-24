import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLeftSidebarLayers } from '../store/selectors';
// import SidebarDropzone from './SidebarDropzone';
import SidebarLayers from './SidebarLayers';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';
import SidebarLeftSearchEmptyState from './SidebarLeftSearchEmptyState';
import SidebarDropzoneGroupContext from './SidebarDropzoneGroupContext';

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
      {/* <SidebarDropzone
        layer={'page'} /> */}
      {
        layers.length > 0
        ? <SidebarLayers
            layers={layers} />
        : <SidebarLeftSearchEmptyState />
      }
      <SidebarDropzoneGroupContext
        layer='page' />
      <SidebarLayerDragGhosts />
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  // const { layer, leftSidebar } = state;
  // const page = layer.present.byId[layer.present.page];
  // let layers: string[];
  // if (leftSidebar.searching) {
  //   if (!leftSidebar.search || leftSidebar.search.replace(/\s/g, '').length === 0) {
  //     layers = [...page.children].reverse();
  //   } else {
  //     layers = layer.present.allIds.reduce((result, current) => {
  //       if (layer.present.byId[current].name.toUpperCase().includes(leftSidebar.search.replace(/\s/g, '').toUpperCase()) && current !== 'page') {
  //         return [...result, current];
  //       } else {
  //         return [...result];
  //       }
  //     }, []);
  //   }
  // } else {
  //   layers = [...page.children].reverse();
  // }
  return {
    layers: getLeftSidebarLayers(state)
  };
};

export default connect(
  mapStateToProps
)(SidebarLayerTree);