import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardSortedEvents } from '../store/selectors/layer';
import EventDrawerListItem from './EventDrawerListItem';
import ListGroup from './ListGroup';

const EventDrawerActiveArtboardListItems = (): ReactElement => {
  const sortedTweenEvents = useSelector((state: RootState) => getActiveArtboardSortedEvents(state));
  const activeArtboardEvents = sortedTweenEvents.activeArtboardEvents;

  return (
    activeArtboardEvents.length > 0
    ? <>
        <ListGroup>
          {
            activeArtboardEvents.map((tweenEvent, index) => (
              <EventDrawerListItem
                key={index}
                id={tweenEvent} />
            ))
          }
        </ListGroup>
        <div className='c-event-drawer-events__divider' />
      </>
    : null
  );
}

export default EventDrawerActiveArtboardListItems;