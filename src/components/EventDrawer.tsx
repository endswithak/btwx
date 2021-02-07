import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import EventDrawerList from './EventDrawerList';
import EventDrawerEvent from './EventDrawerEvent';
import EventDrawerDragHandle from './EventDrawerDragHandle';
import EmptyState from './EmptyState';

const EventDrawer = (): ReactElement => {
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const event = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event]);
  const eventDrawerHeight = useSelector((state: RootState) => state.viewSettings.eventDrawer.height);
  const isEmpty = useSelector((state: RootState) => state.layer.present.events.allIds.length === 0);
  const isOpen = useSelector((state: RootState) => state.viewSettings.eventDrawer.isOpen);

  return (
    isOpen
    ? <>
        <EventDrawerDragHandle />
        <div
          id='event-drawer'
          className='c-event-drawer'
          style={{
            height: eventDrawerHeight
          }}>
          {
            isEmpty
            ? <EmptyState
                icon='tweens'
                text='Events'
                // detail='Events can be added when the document has two or more artboards.'
                style={{paddingLeft: 24, paddingRight: 24}} />
            : null
          }
          {
            ready
            ? event
              ? <EventDrawerEvent />
              : <EventDrawerList />
            : null
          }
        </div>
      </>
    : null
  );
}

export default EventDrawer;