import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayers from './TweenDrawerEventLayers';
import TweenDrawerEventLayersTimeline from './TweenDrawerEventLayersTimeline';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

const TweenDrawerEvent = (): ReactElement => {
  const theme = useContext(ThemeContext);

  return (
    <ScrollSync>
      <div className={`c-tween-drawer-event`}>
        <TweenDrawerEventLayers />
        <TweenDrawerEventLayersTimeline />
      </div>
    </ScrollSync>
  );
}

export default TweenDrawerEvent;