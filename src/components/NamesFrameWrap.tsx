import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import NamesFrame from './NamesFrame';

const NamesFrameWrap = (): ReactElement => {
  const artboardSelected = useSelector((state: RootState) => state.layer.present.selected.some(id => state.layer.present.allArtboardIds.includes(id)));
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const isEnabled = !(isResizing && artboardSelected) && !(isDragging && artboardSelected) && !isZooming;

  return (
    isEnabled
    ? <NamesFrame />
    : null
  );
}

export default NamesFrameWrap;