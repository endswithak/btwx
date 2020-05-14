import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayers from './TweenDrawerEventLayers';
import TweenDrawerEventLayersTimeline from './TweenDrawerEventLayersTimeline';

const TweenDrawerEvent = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <div className={`c-tween-drawer-event`}>
      <TweenDrawerEventLayers />
      <TweenDrawerEventLayersTimeline />
    </div>
  );
}

export default TweenDrawerEvent;