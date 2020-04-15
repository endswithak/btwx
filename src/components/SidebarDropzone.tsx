import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';
import SidebarDropzoneTop from './SidebarDropzoneTop';
import SidebarDropzoneCenter from './SidebarDropzoneCenter';
import SidebarDropzoneBottom from './SidebarDropzoneBottom';

interface SidebarLayerDropzoneProps {
  id: string;
  depth: number;
  canHaveChildren: boolean;
}

const SidebarLayerDropzone = (props: SidebarLayerDropzoneProps): ReactElement => {
  const layerRef = useRef<HTMLDivElement>(null);
  const globalState = useContext(store);
  const { theme, dropzone, dragEnterLayer } = globalState;
  const {id, depth, canHaveChildren} = props;

  return (
    <div className='c-sidebar-dropzone'>
      {
        canHaveChildren
        ? <SidebarDropzoneCenter
            id={id} />
        : null
      }
      <SidebarDropzoneTop
        id={id}
        depth={depth}
        canHaveChildren={canHaveChildren} />
      <SidebarDropzoneBottom
        id={id}
        depth={depth}
        canHaveChildren={canHaveChildren} />
    </div>
  );
}

export default SidebarLayerDropzone;