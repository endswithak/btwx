import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

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