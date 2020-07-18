import React, { useContext, ReactElement, useEffect, useState } from 'react';
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

const mapStateToProps = (state: RootState) => {
  const { layer, gradientEditor, textEditor, canvasSettings } = state;
  const isResizing = canvasSettings.resizing;
  const isDragging = canvasSettings.dragging;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const hover = layer.present.hover;
  const isEnabled = hover && !isGradientEditorOpen && !isTextEditorOpen && !isResizing && !isDragging;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(HoverFrameWrap);