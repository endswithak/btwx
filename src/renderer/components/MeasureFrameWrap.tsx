import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import MeasureFrame from './MeasureFrame';

const MeasuringFrameWrap = (): ReactElement => {
  const isGradientEditorOpen = useSelector((state: RootState) => state.gradientEditor.isOpen);
  const isTextEditorOpen = useSelector((state: RootState) => state.textEditor.isOpen);
  const measureToolActive = useSelector((state: RootState) => state.measureTool.isEnabled);
  const isEnabled = measureToolActive && !isGradientEditorOpen && !isTextEditorOpen;

  return (
    isEnabled
    ? <MeasureFrame />
    : null
  );
}

export default MeasuringFrameWrap;