import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import TweenEventsFrame from './TweenEventsFrame';

interface TweenEventsFrameWrapProps {
  isEnabled?: boolean;
}

const TweenEventsFrameWrap = (props: TweenEventsFrameWrapProps): ReactElement => {
  const { isEnabled } = props;

  return (
    isEnabled
    ? <TweenEventsFrame />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer, canvasSettings, textEditor, documentSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const selected = layer.present.selected;
  const artboardSelected = selected.some(id => layer.present.allArtboardIds.includes(id));
  const isResizing = canvasSettings.resizing;
  const isDragging = canvasSettings.dragging;
  const isZooming = canvasSettings.zooming;
  const isTextEditorOpen = textEditor.isOpen;
  const tweenEvents = layer.present.allTweenEventIds.length > 0;
  const hasTweenEvent = tweenEvents && activeArtboard && layer.present.allTweenEventIds.some((id) => layer.present.tweenEventById[id].artboard === activeArtboard);
  const isEnabled = documentSettings.view.tweenDrawer.isOpen && tweenEvents && (tweenDrawer.event || hasTweenEvent) && !isTextEditorOpen && !(isResizing && artboardSelected) && !(isDragging && artboardSelected) && !isZooming;
  return { isEnabled };
};

export default connect(
  mapStateToProps
)(TweenEventsFrameWrap);