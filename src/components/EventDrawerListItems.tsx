import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardSortedEvents } from '../store/selectors/layer';
import EventDrawerActiveArtboardListItems from './EventDrawerActiveArtboardListItems';
import EventDrawerListItem from './EventDrawerListItem';

const EventDrawerListItems = (): ReactElement => {
  const sortedTweenEvents = useSelector((state: RootState) => getActiveArtboardSortedEvents(state));
  const eventsRest = sortedTweenEvents.otherEventIds;

  return (
    <div className='c-event-drawer-list__items'>
      <EventDrawerActiveArtboardListItems />
      <div>
        {
          eventsRest.map((tweenEvent, index) => (
            <EventDrawerListItem
              key={index}
              id={tweenEvent} />
          ))
        }
      </div>
    </div>
  );
}

export default EventDrawerListItems;