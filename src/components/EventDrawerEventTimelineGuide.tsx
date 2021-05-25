import React, { ReactElement } from 'react';
import { gsap } from 'gsap';
import { ipcRenderer } from 'electron';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

// comes from CanvasPreviewLayerEvent when event playhead updates
ipcRenderer.on('setDocumentTimelineGuidePosition', (event, args) => {
  const guide = document.getElementById(`event-drawer-guide`);
  const { time } = JSON.parse(args);
  const position = (time * 100) * 4;
  if (guide) {
    gsap.set(guide, { x: position });
  }
});

const EventDrawerEventTimelineGuide = (): ReactElement => {
  // only show guide when dragging event drawer handles...
  // or when event drawer event is playing
  const scrubbing = useSelector((state: RootState) => state.eventDrawer.tweenEditing && !state.easeEditor.isOpen);
  const tweening = useSelector((state: RootState) => state.eventDrawer.event && state.preview.tweening && state.preview.tweening === state.eventDrawer.event);

  return (
    <div
      id='event-drawer-guide'
      className='c-event-drawer-event__guide'
      style={{
        opacity: scrubbing || tweening
        ? 1
        : 0
      }} />
  );
}

export default EventDrawerEventTimelineGuide;