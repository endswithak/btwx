import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import SidebarDropzoneTop from './SidebarDropzoneTop';
import SidebarDropzoneCenter from './SidebarDropzoneCenter';
import SidebarDropzoneBottom from './SidebarDropzoneBottom';
import LayerNode from '../canvas/base/layerNode';

interface SidebarLayerDropzoneProps {
  layer: LayerNode;
  depth: number;
  dragLayer: LayerNode;
  dragEnterLayer: LayerNode;
  dropzone: em.Dropzone;
}

const SidebarLayerDropzone = (props: SidebarLayerDropzoneProps): ReactElement => {
  const {layer, depth, dragLayer, dragEnterLayer, dropzone} = props;

  return (
    <div className='c-sidebar-dropzone'>
      {
        layer.canHaveLayers
        ? <SidebarDropzoneCenter
            layer={layer}
            dragLayer={dragLayer}
            dragEnterLayer={dragEnterLayer}
            dropzone={dropzone} />
        : null
      }
      <SidebarDropzoneTop
        layer={layer}
        depth={depth}
        dragLayer={dragLayer}
        dragEnterLayer={dragEnterLayer}
        dropzone={dropzone} />
      <SidebarDropzoneBottom
        layer={layer}
        depth={depth}
        dragLayer={dragLayer}
        dragEnterLayer={dragEnterLayer}
        dropzone={dropzone} />
    </div>
  );
}

export default SidebarLayerDropzone;