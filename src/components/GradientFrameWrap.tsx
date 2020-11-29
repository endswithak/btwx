import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import GradientFrame from './GradientFrame';

interface GradientFrameWrapProps {
  isEnabled?: boolean;
}

const GradientFrameWrap = (props: GradientFrameWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <GradientFrame />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { gradientEditor, textEditor, canvasSettings } = state;
  const isDragging = canvasSettings.dragging;
  const isZooming = canvasSettings.zooming;
  const isSelecting = canvasSettings.selecting;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const isEnabled = isGradientEditorOpen && !isSelecting && !isTextEditorOpen && !isDragging && !isZooming;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(GradientFrameWrap);