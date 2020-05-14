import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventsItems from './TweenDrawerEventsItems';
import TweenDrawerEventsHeader from './TweenDrawerEventsHeader';

const TweenDrawerEvents = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className={`c-tween-drawer-events`}>
      <TweenDrawerEventsHeader />
      <TweenDrawerEventsItems />
    </div>
  );
}

export default TweenDrawerEvents;