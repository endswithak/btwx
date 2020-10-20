import React, { ReactElement, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetDraggingPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging } from '../store/actions/leftSidebar';
import SidebarDropzone from './SidebarDropzone';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayerChildren from './SidebarLayerChildren';

// add drag enter/exit event to conditionaly load dropzones with new "dragHover" prop...so they dont all render at once

interface SidebarLayerProps {
  layer: string;
  isDragGhost?: boolean;
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
}

const SidebarLayer = memo(function SidebarLayer(props: SidebarLayerProps) {
  const { layer, setDragging, isDragGhost } = props;

  const handleDragStart = (e: any): void => {
    setDragging({dragging: true});
    e.dataTransfer.setDragImage(document.getElementById('sidebarDragGhosts'), 0, 0);
  }

  const handleDragEnd = (e: any): void => {
    setDragging({dragging: false});
  }

  useEffect(() => {
    console.log('LAYER');
  }, []);

  return (
    <div
      id={isDragGhost ? `dragGhost-${layer}` : layer}
      draggable={!isDragGhost}
      className='c-sidebar-layer'
      onDragStart={isDragGhost ? null : handleDragStart}
      onDragEnd={isDragGhost ? null : handleDragEnd}>
      <SidebarLayerItem
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarDropzone
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarLayerChildren
        layer={layer}
        isDragGhost={isDragGhost} />
    </div>
  );
});

export default connect(
  null,
  { setDragging }
)(SidebarLayer);