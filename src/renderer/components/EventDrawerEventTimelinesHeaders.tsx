import React, { ReactElement } from 'react';
import EventDrawerRuler from './EventDrawerRuler';

const EventDrawerEventTimelinesHeaders = (): ReactElement => (
  <>
    <div className='c-event-drawer-event-layers-timeline__header' />
    <EventDrawerRuler />
  </>
);

export default EventDrawerEventTimelinesHeaders;