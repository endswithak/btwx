import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import TweenEventsFrame from './TweenEventsFrame';

const TweenEventsFrameWrap = (): ReactElement => {
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const artboardSelected = useSelector((state: RootState) => state.layer.present.selected.some(id => state.layer.present.allArtboardIds.includes(id)));
  const isResizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const isDragging = useSelector((state: RootState) => state.canvasSettings.dragging);
  const isZooming = useSelector((state: RootState) => state.canvasSettings.zooming);
  const isTweenDrawerOpen = useSelector((state: RootState) => state.viewSettings.tweenDrawer.isOpen);
  const tweenDrawerEvent = useSelector((state: RootState) => state.tweenDrawer.event);
  const isTextEditorOpen = useSelector((state: RootState) => state.textEditor.isOpen);
  const events = useSelector((state: RootState) => state.layer.present.events.allIds.length > 0);
  const hasTweenEvent = useSelector((state: RootState) => events && activeArtboard && state.layer.present.events.allIds.some((id) => state.layer.present.events.byId[id].artboard === activeArtboard));
  const isEnabled = isTweenDrawerOpen && events && (tweenDrawerEvent || hasTweenEvent) && !isTextEditorOpen && !(isResizing && artboardSelected) && !(isDragging && artboardSelected) && !isZooming;

  return (
    isEnabled
    ? <TweenEventsFrame />
    : null
  );
}

export default TweenEventsFrameWrap;