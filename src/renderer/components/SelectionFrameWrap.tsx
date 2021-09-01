import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import SelectionFrame from './SelectionFrame';

const SelectionFrameWrap = (): ReactElement => {
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const editingVector = useSelector((state: RootState) => state.vectorEditTool.isEnabled);
  const isGradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const isTextEditorOpen = useSelector((state: RootState) => state.textEditor.isOpen);
  const scrollFrameToolActive = useSelector((state: RootState) => state.scrollFrameTool.isEnabled);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = selected.length > 0 && !editingVector && !scrollFrameToolActive && !isGradientEditorOpen && !isTextEditorOpen && !isZooming;

  return (
    isEnabled
    ? <SelectionFrame />
    : null
  );
}

export default SelectionFrameWrap;