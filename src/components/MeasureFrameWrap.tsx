import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import MeasureFrame from './MeasureFrame';

interface MeasuringFrameWrapProps {
  isEnabled: boolean;
}

const MeasuringFrameWrap = (props: MeasuringFrameWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <MeasureFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, gradientEditor, textEditor, canvasSettings } = state;
  const isResizing = canvasSettings.resizing;
  const isDragging = canvasSettings.dragging;
  const isMeasuring = canvasSettings.measuring;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const selected = layer.present.selected;
  const hover = layer.present.hover;
  const isEnabled = selected.length > 0 && hover && !selected.includes(hover) && isMeasuring && !isGradientEditorOpen && !isTextEditorOpen && !isResizing && !isDragging;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(MeasuringFrameWrap);