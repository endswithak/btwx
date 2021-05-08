import React, { ReactElement, useState, useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';
import { useSelector } from 'react-redux';
import { ScrollSync } from 'react-scroll-sync';
import { getEventDrawerLayers, getEventDrawerScrollPositions } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import EventDrawerEventLayers from './EventDrawerEventLayers';
import EventDrawerEventLayersDragHandle from './EventDrawerEventLayersDragHandle';
import EventDrawerEventTimelines from './EventDrawerEventTimelines';

const EventDrawerEvent = (): ReactElement => {
  const eventLayers = useSelector((state: RootState) => getEventDrawerLayers(state));
  const scrollPositions = useSelector((state: RootState) => getEventDrawerScrollPositions(state));
  const [scrollLayer, setScrollLayer] = useState(eventLayers.allIds[0]);

  const getScrollLayer = () => {
    const tweenLayers = document.getElementById('event-drawer-event-layers');
    if (tweenLayers) {
      const scrollTop = tweenLayers.scrollTop;
      let index = 0;
      while(scrollTop >= (scrollPositions[index] - 16)) {
        index++;
      }
      return eventLayers.allIds[index];
    }
  }

  const handleScroll = throttle(() => {
    const nextScrollLayer = getScrollLayer();
    if (scrollLayer !== nextScrollLayer) {
      setScrollLayer(nextScrollLayer);
    }
  }, 150);

  useEffect(() => {
    const nextScrollLayer = getScrollLayer();
    if (scrollLayer !== nextScrollLayer) {
      setScrollLayer(nextScrollLayer);
    }
  }, [scrollPositions]);

  return (
    <ScrollSync onSync={handleScroll}>
      <div className='c-event-drawer-event'>
        <EventDrawerEventLayersDragHandle />
        <EventDrawerEventLayers
          scrollLayer={scrollLayer} />
        <EventDrawerEventTimelines />
      </div>
    </ScrollSync>
  );
}

export default EventDrawerEvent;