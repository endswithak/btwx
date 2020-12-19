import React, { ReactElement, useState } from 'react';
import throttle from 'lodash.throttle';
import { useSelector } from 'react-redux';
import { ScrollSync } from 'react-scroll-sync';
import { getTweenEventLayers } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import EventDrawerEventLayers from './EventDrawerEventLayers';
import EventDrawerEventLayersDragHandle from './EventDrawerEventLayersDragHandle';
import EventDrawerEventTimelines from './EventDrawerEventTimelines';

const EventDrawerEvent = (): ReactElement => {
  const itemHeight = 32;
  const eventLayers = useSelector((state: RootState) => getTweenEventLayers(state.layer.present, state.eventDrawer.event));
  const event = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event]);
  const scrollPositions = eventLayers.allIds.reduce((result: number[], current, index) => {
    const prevY = result[index - 1] ? result[index - 1] : 0;
    let y = itemHeight + prevY;
    const eventTweens = event.tweens;
    const eventLayer = eventLayers.byId[current];
    const layerTweens = eventLayer.tweens.asOrigin;
    layerTweens.forEach((id) => {
      if (eventTweens.includes(id)) {
        y += itemHeight;
      }
    });
    result = [...result, y];
    return result;
  }, []);
  const [scrollLayer, setScrollLayer] = useState(eventLayers.allIds[0]);

  const handleScroll = throttle(() => {
    const tweenLayers = document.getElementById('event-drawer-event-layers');
    if (tweenLayers) {
      const scrollTop = tweenLayers.scrollTop;
      let index = 0;
      while(scrollTop >= (scrollPositions[index] - 16)) {
        index++;
      }
      if (scrollLayer !== eventLayers.allIds[index]) {
        setScrollLayer(eventLayers.allIds[index]);
      }
    }
  }, 150);

  return (
    <ScrollSync>
      <div
        className='c-event-drawer-event'
        onScroll={eventLayers.allIds.length > 0 ? handleScroll : null}>
        <EventDrawerEventLayersDragHandle />
        <EventDrawerEventLayers
          scrollLayer={scrollLayer} />
        <EventDrawerEventTimelines />
      </div>
    </ScrollSync>
  );
}

export default EventDrawerEvent;