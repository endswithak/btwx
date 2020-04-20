import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import LayerNode from '../canvas/base/layerNode';

interface SidebarLayerProps {
  layer: string;
  dragLayer: LayerNode;
  dragEnterLayer: LayerNode;
  dropzone: em.Dropzone;
  depth: number;
  layerItem?: LayerNode;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { layer, depth, dragLayer, dragEnterLayer, dropzone, layerItem } = props;

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
        layerItem.expanded
        ? layerItem.children.map((child: string, index: number) => (
            <SidebarLayer
              key={index}
              layer={child}
              depth={depth + 1}
              dragLayer={dragLayer}
              dragEnterLayer={dragEnterLayer}
              dropzone={dropzone} />
          ))
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: SidebarLayerProps) => {
  const { layers } = state;
  const layerItem = layers.byId[ownProps.layer];
  return { layerItem };
};

export default connect(mapStateToProps)(SidebarLayer);