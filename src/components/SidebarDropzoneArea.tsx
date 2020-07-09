import React, { ReactElement, SyntheticEvent } from 'react';

interface SidebarDropzoneAreaProps {
  id: string;
  dz: em.Dropzone;
  style: any;
  onDragOver?(e: DragEvent): void;
  onDragLeave?(e: DragEvent): void;
}

const SidebarDropzoneArea = (props: SidebarDropzoneAreaProps): ReactElement => {
  const {id, dz, style, onDragOver, onDragLeave} = props;

  return (
    <div
      className={`c-sidebar-dropzone__zone c-sidebar-dropzone__zone--${dz.toLowerCase()}`}
      data-dropzone={dz}
      data-id={id}
      style={style}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave} />
  );
}

export default SidebarDropzoneArea;