import React, { ReactElement } from 'react';
import EmptyState from './EmptyState';

const EventDrawerEventLayersEmptyState = (): ReactElement => (
  <div style={{
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  }}>
    <EmptyState
      icon='ease-curve'
      text='Event Layers'
      // detail='View and edit event layer ease curves here.'
      style={{width: 211}} />
  </div>
);

export default EventDrawerEventLayersEmptyState;