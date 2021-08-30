import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import VectorEditFrame from './VectorEditFrame';

const VectorEditFrameWrap = (): ReactElement => {
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isGradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const isTextEditorOpen = useSelector((state: RootState) => state.textEditor.isOpen);
  const vectorEditToolActive = useSelector((state: RootState) => state.vectorEditTool.isEnabled);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = selected.length > 0 && vectorEditToolActive && !isGradientEditorOpen && !isTextEditorOpen && !isZooming && !isDragging && !isResizing;

  return (
    isEnabled
    ? <VectorEditFrame />
    : null
  );
}

export default VectorEditFrameWrap;