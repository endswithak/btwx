import React, { ReactElement } from 'react';
import SidebarDropzoneTop from './SidebarDropzoneTop';
import SidebarDropzoneCenter from './SidebarDropzoneCenter';
import SidebarDropzoneBottom from './SidebarDropzoneBottom';

interface SidebarLayerDropzoneProps {
  layer: string;
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