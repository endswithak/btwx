import React, { useContext, ReactElement, useRef, useEffect, useState } from 'react';
import { store } from '../store';

interface SidebarDragHandleProps {
  onDragStart(e: DragEvent): void;
  onDrag(e: DragEvent): void;
  style?: any;
}

const SidebarDragHandle = (props: SidebarDragHandleProps): ReactElement => {
  const dragImage = useRef<HTMLDivElement>(null);
  const globalState = useContext(store);
  const { theme } = globalState;

  const handleDragStart = (e) => {
    e.dataTransfer.setDragImage(dragImage.current, 0, 0);
    props.onDragStart(e);
  }

  const handleDrag = (e) => {
    props.onDrag(e);
  }

  return (
    <div
      className='c-sidebar-drag-handle-wrap'
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      draggable
      style={{
        ...props.style,
        background: theme.background.z0
      }}>
      <div className='c-sidebar-drag-handle__inner' />
      <div
        className='c-sidebar-drag-handle__image'
        ref={dragImage} />
    </div>
  );
}

export default SidebarDragHandle;