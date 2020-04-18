import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import LayerNode from '../canvas/base/layerNode';

interface SidebarLayerProps {
  layer: LayerNode;
  dragLayer: LayerNode;
  dragEnterLayer: LayerNode;
  dropzone: em.Dropzone;
  depth: number;
}

const SidebarLayer = (props: SidebarLayerProps): ReactElement => {
  const { layer, depth, dragLayer, dragEnterLayer, dropzone } = props;

  return (
    <div
      id={layer.id}
      draggable
      className='c-sidebar-layer'>
      <SidebarLayerItem
        layer={layer}
        depth={depth} />
      {
        dragLayer
        ? <SidebarDropzone
            layer={layer}
            depth={depth}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        : null
      }
      {
        layer.expanded
        ? layer.children.map((layer: LayerNode, index: number) => (
            <SidebarLayer
              key={index}
              layer={layer}
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

export default SidebarLayer;