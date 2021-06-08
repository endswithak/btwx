import React, { ReactElement } from 'react';
import EventDrawerListItems from './EventDrawerListItems';
import EventDrawerListHeader from './EventDrawerListHeader';

const EventDrawerList = (): ReactElement => (
  <div className='c-event-drawer-list'>
    <EventDrawerListHeader />
    <EventDrawerListItems />
  </div>
);

export default EventDrawerList;