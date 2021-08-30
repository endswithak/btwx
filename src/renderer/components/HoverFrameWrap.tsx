import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import HoverFrame from './HoverFrame';

const HoverFrameWrap = (): ReactElement => {
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const editingVector = useSelector((state: RootState) => state.vectorEditTool.isEnabled);
  const isGradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const isTextEditorOpen = useSelector((state: RootState) => state.textEditor.isOpen);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const isEnabled = hover && !editingVector && !isGradientEditorOpen && !isTextEditorOpen && !isZooming && !isDragging && !isResizing;

  return (
    isEnabled
    ? <HoverFrame />
    : null
  );
}

export default HoverFrameWrap;