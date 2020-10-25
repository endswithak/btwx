import React, { ReactElement, useEffect, memo, useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import debounce from 'lodash.debounce';
import { SetDraggingPayload, SetDragOverPayload, LeftSidebarTypes } from '../store/actionTypes/leftSidebar';
import { setDragging, setDragOver } from '../store/actions/leftSidebar';
import SidebarLayerDropzoneWrap from './SidebarLayerDropzoneWrap';
import SidebarLayerItem from './SidebarLayerItem';
import SidebarLayerChildren from './SidebarLayerChildren';
import SidebarDropzoneGroupContext from './SidebarDropzoneGroupContext';

// add drag enter/exit event to conditionaly load dropzones with new "dragHover" prop...so they dont all render at once

interface SidebarLayerProps {
  layer: string;
  dragging?: string;
  isDragGhost?: boolean;
  setDragging?(payload: SetDraggingPayload): LeftSidebarTypes;
  setDragOver?(payload: SetDragOverPayload): LeftSidebarTypes;
}

const SidebarLayer = memo(function SidebarLayer(props: SidebarLayerProps) {
  const { layer, setDragging, isDragGhost, dragging, setDragOver } = props;

  const debounceDragOver = useCallback(
    debounce((payload: SetDragOverPayload) => {
      setDragOver(payload);
    }, 20),
    []
  );

  const handleDragStart = (e: any): void => {
    setDragging({dragging: layer});
    e.dataTransfer.setDragImage(document.getElementById('sidebarDragGhosts'), 0, 0);
  }

  const handleDragEnd = (e: any): void => {
    setDragging({dragging: null});
  }

  const handleDragEnter = (e: any) => {
    e.stopPropagation();
    if (dragging) {
      debounceDragOver({dragOver: layer});
    }
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
      onDragEnd={isDragGhost ? null : handleDragEnd}
      onDragEnter={handleDragEnter}>
      <SidebarLayerItem
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarLayerDropzoneWrap
        layer={layer}
        isDragGhost={isDragGhost} />
      <SidebarLayerChildren
        layer={layer}
        isDragGhost={isDragGhost} />
    </div>
  );
});

const mapStateToProps = (state: RootState) => {
  const { leftSidebar } = state;
  const dragging = leftSidebar.dragging;
  return { dragging };
};

export default connect(
  mapStateToProps,
  { setDragging, setDragOver }
)(SidebarLayer);