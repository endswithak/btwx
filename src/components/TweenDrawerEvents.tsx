import React, { ReactElement } from 'react';
import TweenDrawerEventsItems from './TweenDrawerEventsItems';
import TweenDrawerEventsHeader from './TweenDrawerEventsHeader';

const TweenDrawerEvents = (): ReactElement => {
  return (
    <div className='c-tween-drawer-events'>
      <TweenDrawerEventsHeader />
      <TweenDrawerEventsItems />
    </div>
  );
}

export default TweenDrawerEvents;