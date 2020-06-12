import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayers from './SidebarLayers';

interface SidebarLayerProps {
  layer: string;
  dragLayer: em.Layer;
  dragEnterLayer: em.Layer;
  dropzone: em.Dropzone;
  depth: number;
  layerItem?: em.Layer;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const [draggable, setDraggable] = useState(true);
  const { layer, depth, dragLayer, dragEnterLayer, dropzone, layerItem } = props;

  return (
    <div
      id={layer}
      draggable={draggable}
      className='c-sidebar-layer'>
      <SidebarLayerItem
        layer={layerItem}
        depth={depth}
        setDraggable={setDraggable} />
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
        (layerItem.type === 'Group' || layerItem.type === 'Artboard') && (layerItem as em.Group).showChildren
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
  const { layer } = state;
  const layerItem = layer.present.byId[ownProps.layer];
  return { layerItem };
};

export default connect(
  mapStateToProps
)(SidebarLayer);