import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import HoverFrame from './HoverFrame';

interface HoverFrameWrapProps {
  isEnabled?: boolean;
}

const HoverFrameWrap = (props: HoverFrameWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <HoverFrame />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
} => {
  const { layer, gradientEditor, textEditor, canvasSettings } = state;
  const isResizing = canvasSettings.resizing;
  const isDragging = canvasSettings.dragging;
  const isZooming = canvasSettings.zooming;
  const isSelecting = canvasSettings.selecting;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const hover = layer.present.hover;
  const isEnabled = hover && !isGradientEditorOpen && !isSelecting && !isTextEditorOpen && !isResizing && !isDragging && !isZooming;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(HoverFrameWrap);