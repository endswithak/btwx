import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import EmptyState from './EmptyState';

const EventDrawerEventTimelinesEmptyState = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
      <div
        className='c-event-drawer-event-layers-timeline__header'
        style={{
          background: theme.name === 'dark'
          ? theme.background.z3
          : theme.background.z0,
          boxShadow: `0 -1px 0 ${theme.name === 'dark'
          ? theme.background.z4
          : theme.background.z5} inset`
        }} />
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden'}}>
        <EmptyState
          icon='tweens'
          text='Event Timelines'
          // detail='Timelines are added when the event origin and destination have corresponding layers (same name and type) with mismatched style props.'
          style={{width: 550}} />
      </div>
    </div>
  );
}

export default EventDrawerEventTimelinesEmptyState;