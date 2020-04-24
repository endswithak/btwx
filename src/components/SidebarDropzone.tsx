import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import SidebarDropzoneTop from './SidebarDropzoneTop';
import SidebarDropzoneCenter from './SidebarDropzoneCenter';
import SidebarDropzoneBottom from './SidebarDropzoneBottom';

interface SidebarLayerDropzoneProps {
  layer: em.Layer;
  depth: number;
  dragLayer: em.Layer;
  dragEnterLayer: em.Layer;
  dropzone: em.Dropzone;
}

const SidebarLayerDropzone = (props: SidebarLayerDropzoneProps): ReactElement => {
  const {layer, depth, dragLayer, dragEnterLayer, dropzone} = props;

  return (
    <div className='c-sidebar-dropzone'>
      <SidebarDropzoneCenter
        layer={layer}
        dragLayer={dragLayer}
        dragEnterLayer={dragEnterLayer}
        dropzone={dropzone} />
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