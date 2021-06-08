import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getActiveArtboardSortedEvents } from '../store/selectors/layer';
import { deselectLayerEvents } from '../store/actions/layer';
import EventDrawerActiveArtboardListItems from './EventDrawerActiveArtboardListItems';
import EventDrawerListItem from './EventDrawerListItem';
import ListGroup from './ListGroup';

const EventDrawerListItems = (): ReactElement => {
  const sortedEvents = useSelector((state: RootState) => getActiveArtboardSortedEvents(state));
  const eventsRest = sortedEvents.otherEventIds;

  return (
    <div className='c-event-drawer-list__items'>
      <ClearSelectionArea />
      <EventDrawerActiveArtboardListItems />
      <ListGroup>
        {
          eventsRest.map((event, index) => (
            <EventDrawerListItem
              key={index}
              id={event} />
          ))
        }
      </ListGroup>
    </div>
  );
}

const ClearSelectionArea = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.events.selected);
  const dispatch = useDispatch();

  const handleMouseDown = (e) => {
    if (selected.length > 0 && !e.metaKey) {
      dispatch(deselectLayerEvents({events: selected}));
    }
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} />
  );
}

export default EventDrawerListItems;