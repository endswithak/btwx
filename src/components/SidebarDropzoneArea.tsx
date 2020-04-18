import React, { ReactElement } from 'react';

interface SidebarDropzoneAreaProps {
  id: string;
  dz: em.Dropzone;
  style: any;
}

const SidebarDropzoneArea = (props: SidebarDropzoneAreaProps): ReactElement => {
  const {id, dz, style} = props;

  return (
    <div
      className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--${dz.toLowerCase()}`}
      data-dropzone={dz}
      data-id={id}
      style={style} />
  );
}

export default SidebarDropzoneArea;