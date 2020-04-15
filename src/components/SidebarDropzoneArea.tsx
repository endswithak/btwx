import React, { useContext, ReactElement, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { store } from '../store';

interface SidebarDropzoneAreaProps {
  id: string;
  dz: 'top' | 'center' | 'bottom';
  style: any;
}

const SidebarDropzoneArea = (props: SidebarDropzoneAreaProps): ReactElement => {
  const {id, dz, style} = props;

  return (
    <div
      className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--${dz}`}
      data-dropzone={dz}
      data-id={id}
      style={style} />
  );
}

export default SidebarDropzoneArea;