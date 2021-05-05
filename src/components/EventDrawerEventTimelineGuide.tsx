import React, { ReactElement } from 'react';
import { gsap } from 'gsap';
import { ipcRenderer } from 'electron';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

ipcRenderer.on('setDocumentTimelineGuidePosition', (event, args) => {
  const guide = document.getElementById(`event-drawer-guide`);
  const { time } = JSON.parse(args);
  const position = (time * 100) * 4;
  gsap.set(guide, { x: position });
});

const EventDrawerEventTimelineGuide = (): ReactElement => {
  const scrubbing = useSelector((state: RootState) => state.eventDrawer.tweenEditing && !state.easeEditor.isOpen);
  const tweening = useSelector((state: RootState) => state.preview.tweening);

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