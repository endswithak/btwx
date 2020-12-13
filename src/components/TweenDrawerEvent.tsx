import React, { ReactElement, useState } from 'react';
import throttle from 'lodash.throttle';
import { useSelector } from 'react-redux';
import { ScrollSync } from 'react-scroll-sync';
import { getTweenEventLayers } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import TweenDrawerEventLayers from './TweenDrawerEventLayers';
import TweenDrawerLayersDragHandle from './TweenDrawerLayersDragHandle';
import TweenDrawerEventLayersTimeline from './TweenDrawerEventLayersTimeline';

const TweenDrawerEvent = (): ReactElement => {
  const itemHeight = 32;
  const tweenEventLayers = useSelector((state: RootState) => getTweenEventLayers(state.layer.present, state.tweenDrawer.event));
  const event = useSelector((state: RootState) => state.layer.present.events.byId[state.tweenDrawer.event]);
  const scrollPositions = tweenEventLayers.allIds.reduce((result: number[], current, index) => {
    const prevY = result[index - 1] ? result[index - 1] : 0;
    let y = itemHeight + prevY;
    const eventTweens = event.tweens;
    const eventLayer = tweenEventLayers.byId[current];
    const layerTweens = eventLayer.tweens.asOrigin;
    layerTweens.forEach((id) => {
      if (eventTweens.includes(id)) {
        y += itemHeight;
      }
    });
    result = [...result, y];
    return result;
  }, []);
  const [scrollLayer, setScrollLayer] = useState(tweenEventLayers.allIds[0]);

  const handleScroll = throttle(() => {
    const tweenLayers = document.getElementById('tween-drawer-event-layers');
    if (tweenLayers) {
      const scrollTop = tweenLayers.scrollTop;
      let index = 0;
      while(scrollTop >= (scrollPositions[index] - 16)) {
        index++;
      }
      if (scrollLayer !== tweenEventLayers.allIds[index]) {
        setScrollLayer(tweenEventLayers.allIds[index]);
      }
    }
  }, 150);

  return (
    <ScrollSync>
      <div
        className='c-tween-drawer-event'
        onScroll={tweenEventLayers.allIds.length > 0 ? handleScroll : null}>
        <TweenDrawerLayersDragHandle />
        <TweenDrawerEventLayers
          scrollLayer={scrollLayer} />
        <TweenDrawerEventLayersTimeline />
      </div>
    </ScrollSync>
  );
}

export default TweenDrawerEvent;