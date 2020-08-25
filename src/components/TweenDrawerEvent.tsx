import React, { ReactElement } from 'react';
import TweenDrawerEventLayers from './TweenDrawerEventLayers';
import TweenDrawerLayersDragHandle from './TweenDrawerLayersDragHandle';
import TweenDrawerEventLayersTimeline from './TweenDrawerEventLayersTimeline';
import { ScrollSync } from 'react-scroll-sync';

const TweenDrawerEvent = (): ReactElement => {
  return (
    <ScrollSync>
      <div className='c-tween-drawer-event'>
        <TweenDrawerLayersDragHandle />
        <TweenDrawerEventLayers />
        <TweenDrawerEventLayersTimeline />
      </div>
    </ScrollSync>
  );
}

export default TweenDrawerEvent;