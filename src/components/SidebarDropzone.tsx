import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import SidebarDropzoneTop from './SidebarDropzoneTop';
import SidebarDropzoneCenter from './SidebarDropzoneCenter';
import SidebarDropzoneBottom from './SidebarDropzoneBottom';

interface SidebarLayerDropzoneProps {
  layer: em.Layer;
  depth: number;
  dragLayer: string;
  setDragLayer(id: string): void;
}

const SidebarLayerDropzone = (props: SidebarLayerDropzoneProps): ReactElement => {

  return (
    <div className='c-sidebar-dropzone'>
      <SidebarDropzoneCenter
        {...props} />
      <SidebarDropzoneTop
        {...props}/>
      <SidebarDropzoneBottom
        {...props} />
    </div>
  );
}

export default SidebarLayerDropzone;