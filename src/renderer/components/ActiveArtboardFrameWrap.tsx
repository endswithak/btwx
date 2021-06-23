import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import ActiveArtboardFrame from './ActiveArtboardFrame';

const ActiveArtboardFrameWrap = (): ReactElement => {
  const scrollFrameActive = useSelector((state: RootState) => state.scrollFrameTool.isEnabled);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const isEnabled = activeArtboard && !scrollFrameActive && !isResizing && !isDragging && !isZooming;

  return (
    isEnabled
    ? <ActiveArtboardFrame />
    : null
  );
}

export default ActiveArtboardFrameWrap;