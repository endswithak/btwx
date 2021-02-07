import React, { ReactElement, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

const EventDrawerEventTimelineGuide = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const scrubbing = useSelector((state: RootState) => state.eventDrawer.tweenEditing && !state.easeEditor.isOpen);

  return (
    <div
      id='event-drawer-guide'
      className='c-event-drawer-event__guide'
      style={{
        background: theme.palette.error,
        opacity: scrubbing
        ? 1
        : 0
      }} />
  );
}

export default EventDrawerEventTimelineGuide;