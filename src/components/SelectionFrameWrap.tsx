import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import SelectionFrame from './SelectionFrame';

const SelectionFrameWrap = (): ReactElement => {
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isGradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const isTextEditorOpen = useSelector((state: RootState) => state.textEditor.isOpen);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = selected.length > 0 && !isGradientEditorOpen && !isTextEditorOpen && !isZooming && !isDragging && !isResizing;

  return (
    isEnabled
    ? <SelectionFrame />
    : null
  );
}

export default SelectionFrameWrap;