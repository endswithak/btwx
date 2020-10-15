import React, { ReactElement, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayer from './SidebarLayer';
import SidebarLayerDragGhosts from './SidebarLayerDragGhosts';
import SidebarLeftSearchEmptyState from './SidebarLeftSearchEmptyState';

interface SidebarLayerTreeProps {
  isDropzone?: boolean;
  layers?: string[];
}

const SidebarLayerTree = (props: SidebarLayerTreeProps): ReactElement => {
  const { layers, isDropzone } = props;

  // useEffect(() => {
  //   console.log('LAYER TREE');
  // }, []);

  return (
    <>
      {
        isDropzone
        ? <SidebarDropzone
            layer={'page'} />
        : null
      }
      {
        layers.length > 0
        ? layers.map((layer: string, index: number) => (
            <SidebarLayer
              key={index}
              layer={layer} />
          ))
        : <SidebarLeftSearchEmptyState />
      }
      <SidebarLayerDragGhosts />
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  const { layer, leftSidebar } = state;
  const page = layer.present.byId[layer.present.page];
  let layers: string[];
  if (leftSidebar.searching) {
    if (!leftSidebar.search || leftSidebar.search.replace(/\s/g, '').length === 0) {
      layers = [...page.children].reverse();
    } else {
      layers = layer.present.allIds.reduce((result, current) => {
        if (layer.present.byId[current].name.toUpperCase().includes(leftSidebar.search.replace(/\s/g, '').toUpperCase()) && current !== 'page') {
          return [...result, current];
        } else {
          return [...result];
        }
      }, []);
    }
  } else {
    layers = [...page.children].reverse();
  }
  const isDropzone = leftSidebar.dragging;
  return { layers, isDropzone };
};

export default connect(
  mapStateToProps
)(SidebarLayerTree);