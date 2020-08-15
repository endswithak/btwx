import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import TweenEventFrame from './TweenEventFrame';

interface TweenEventFrameWrapProps {
  isEnabled?: boolean;
}

const TweenEventFrameWrap = (props: TweenEventFrameWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <TweenEventFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer, canvasSettings, gradientEditor, textEditor } = state;
  const selected = layer.present.selected;
  const artboardSelected = selected.some(id => layer.present.allArtboardIds.includes(id));
  const isResizing = canvasSettings.resizing;
  const isDragging = canvasSettings.dragging;
  const isGradientEditorOpen = gradientEditor.isOpen;
  const isTextEditorOpen = textEditor.isOpen;
  const isEnabled = tweenDrawer.event !== null && !isGradientEditorOpen && !isTextEditorOpen && !(isResizing && artboardSelected) && !(isDragging && artboardSelected);
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(TweenEventFrameWrap);