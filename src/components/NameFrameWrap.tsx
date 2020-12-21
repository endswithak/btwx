import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import NameFrame from './NameFrame';

const NameFrameWrap = (): ReactElement => {
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const isEnabled = !isResizing && !isDragging && !isZooming;

  return (
    isEnabled
    ? <NameFrame />
    : null
  );
}

export default NameFrameWrap;