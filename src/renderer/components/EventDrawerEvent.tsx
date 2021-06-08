import React, { ReactElement, useState, useEffect } from 'react';
import throttle from 'lodash.throttle';
import { useSelector } from 'react-redux';
import { ScrollSync } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import EventDrawerEventLayers from './EventDrawerEventLayers';
import EventDrawerEventLayersDragHandle from './EventDrawerEventLayersDragHandle';
import EventDrawerEventTimelines from './EventDrawerEventTimelines';

const EventDrawerEvent = (): ReactElement => {
  const eventLayers = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event] ? state.layer.present.events.byId[state.eventDrawer.event].layers : []);
  const scrollPositions = useSelector((state: RootState) => eventLayers.reduce((result: number[], current, index) => {
    const prevY = result[index - 1] ? result[index - 1] : 0;
    let y = 32 + prevY;
    if (state.layer.present.events.byId[state.eventDrawer.event] && state.layer.present.events.byId[state.eventDrawer.event].tweens.byLayer[current]) {
      const layerTweens = state.layer.present.events.byId[state.eventDrawer.event].tweens.byLayer[current];
      layerTweens.forEach((id) => {
        if (state.layer.present.events.byId[state.eventDrawer.event].tweens.allIds.includes(id)) {
          y += 32;
        }
      });
      result = [...result, y];
    }
    return result;
  }, []));
  const [scrollLayer, setScrollLayer] = useState(eventLayers.length > 0 ? eventLayers[0] : null);

  const getScrollLayer = () => {
    const tweenLayers = document.getElementById('event-drawer-event-layers');
    if (tweenLayers) {
      const scrollTop = tweenLayers.scrollTop;
      let index = 0;
      while(scrollTop >= (scrollPositions[index] - 16)) {
        index++;
      }
      return eventLayers[index];
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