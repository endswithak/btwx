import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import MeasureFrame from './MeasureFrame';

const MeasuringFrameWrap = (): ReactElement => {
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isMeasuring = useSelector((state: RootState) => state.canvasSettings.measuring);
  const isGradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const isTextEditorOpen = useSelector((state: RootState) => state.textEditor.isOpen);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const hover = useSelector((state: RootState) => state.layer.present.hover);
  const isEnabled = selected.length > 0 && hover && !selected.includes(hover) && isMeasuring && !isGradientEditorOpen && !isTextEditorOpen && !isResizing && !isDragging;

  return (
    isEnabled
    ? <MeasureFrame />
    : null
  );
}

export default MeasuringFrameWrap;