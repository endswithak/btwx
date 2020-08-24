import React, { useContext, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayers from './TweenDrawerEventLayers';
import TweenDrawerEventLayersTimeline from './TweenDrawerEventLayersTimeline';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

const TweenDrawerEvent = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);

  return (
    <ScrollSync>
      <div className={`c-tween-drawer-event`}>
        <TweenDrawerEventLayers
          scrolled={scrolled}
          setScrolled={setScrolled} />
        <TweenDrawerEventLayersTimeline
          scrolled={scrolled}
          setScrolled={setScrolled} />
      </div>
    </ScrollSync>
  );
}

export default TweenDrawerEvent;