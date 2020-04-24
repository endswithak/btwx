import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import { SelectionPayload, LayersTypes } from '../store/actionTypes/layers';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerProps {
  layer: string;
  dragLayer: em.Layer;
  dragEnterLayer: em.Layer;
  dropzone: em.Dropzone;
  depth: number;
  layerItem?: em.Layer;
  addToSelection?(payload: SelectionPayload): LayersTypes;
  removeFromSelection?(payload: SelectionPayload): LayersTypes;
  newSelection?(payload: SelectionPayload): LayersTypes;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { layer, depth, dragLayer, dragEnterLayer, dropzone, layerItem, addToSelection, removeFromSelection, newSelection } = props;

  return (
    <div
      id={layer}
      draggable
      className='c-sidebar-layer'>
      <SidebarLayerItem
        layer={layerItem}
        depth={depth} />
      {
        dragLayer
        ? <SidebarDropzone
            layer={layerItem}
            depth={depth}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        : null
      }
      {
        layerItem.type === 'Group' && (layerItem as em.Group).expanded
        ? <SidebarLayers
            layers={(layerItem as em.Group).children}
            depth={depth + 1}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerProps) => {
  const { layers } = state;
  const layerItem = layers.layerById[ownProps.layer];
  const selection = layers.selection;
  return { layerItem, selection };
};

export default connect(
  mapStateToProps
)(SidebarLayer);