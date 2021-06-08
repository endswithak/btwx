import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardSortedEvents } from '../store/selectors/layer';
import EventDrawerListItem from './EventDrawerListItem';
import ListGroup from './ListGroup';

const EventDrawerActiveArtboardListItems = (): ReactElement => {
  const sortedEvents = useSelector((state: RootState) => getActiveArtboardSortedEvents(state));
  const activeArtboardEvents = sortedEvents.activeArtboardEvents;

  return (
    activeArtboardEvents.length > 0
    ? <>
        <ListGroup>
          {
            activeArtboardEvents.map((event, index) => (
              <EventDrawerListItem
                key={index}
                id={event} />
            ))
          }
        </ListGroup>
        <div className='c-event-drawer-events__divider' />
      </>
    : null
  );
}

export default EventDrawerActiveArtboardListItems;