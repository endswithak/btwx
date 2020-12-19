import React, { ReactElement, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardSortedEvents } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import EventDrawerListItem from './EventDrawerListItem';

const EventDrawerActiveArtboardListItems = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const sortedTweenEvents = useSelector((state: RootState) => getActiveArtboardSortedEvents(state));
  const activeArtboardEvents = sortedTweenEvents.activeArtboardEvents;

  return (
    activeArtboardEvents.length > 0
    ? <>
        <div>
          {
            activeArtboardEvents.map((tweenEvent, index) => (
              <EventDrawerListItem
                key={index}
                id={tweenEvent} />
            ))
          }
        </div>
        <div
          className='c-event-drawer-events__divider'
          style={{
            height: 1,
            marginTop: theme.unit / 2,
            marginBottom: theme.unit / 2,
            width: '100%',
            background: theme.name === 'dark' ? theme.background.z4 : theme.background.z5,
            flexShrink: 0
          }} />
      </>
    : null
  );
}

export default EventDrawerActiveArtboardListItems;