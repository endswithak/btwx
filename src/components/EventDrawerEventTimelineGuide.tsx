import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

const EventDrawerEventTimelineGuide = (): ReactElement => {
  const scrubbing = useSelector((state: RootState) => state.eventDrawer.tweenEditing && !state.easeEditor.isOpen);

  return (
    <div
      id='event-drawer-guide'
      className='c-event-drawer-event__guide'
      style={{
        opacity: scrubbing
        ? 1
        : 0
      }} />
  );
}

export default EventDrawerEventTimelineGuide;