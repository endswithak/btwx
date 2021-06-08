import React, { ReactElement } from 'react';
import EmptyState from './EmptyState';

const EventDrawerEventTimelinesEmptyState = (): ReactElement => (
  <div style={{
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  }}>
    <div className='c-event-drawer-event-layers-timeline__header' />
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>
      <EmptyState
        icon='tweens'
        text='Event Timelines'
        // detail='Timelines are added when the event origin and destination have corresponding layers (same name and type) with mismatched style props.'
        style={{width: 550}} />
    </div>
  </div>
)

export default EventDrawerEventTimelinesEmptyState;