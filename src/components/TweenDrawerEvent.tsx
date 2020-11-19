import React, { ReactElement, useState } from 'react';
import throttle from 'lodash.throttle';
import { connect } from 'react-redux';
import { ScrollSync } from 'react-scroll-sync';
import { getTweenEventLayers } from '../store/selectors/layer';
import { RootState } from '../store/reducers';
import TweenDrawerEventLayers from './TweenDrawerEventLayers';
import TweenDrawerLayersDragHandle from './TweenDrawerLayersDragHandle';
import TweenDrawerEventLayersTimeline from './TweenDrawerEventLayersTimeline';

interface TweenDrawerEventProps {
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.Layer;
    };
  };
  scrollPositions?: number[];
}

const TweenDrawerEvent = (props: TweenDrawerEventProps): ReactElement => {
  const { tweenEventLayers, scrollPositions } = props;
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

const mapStateToProps = (state: RootState) => {
  const { layer, tweenDrawer } = state;
  const itemHeight = 32;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  const scrollPositions = tweenEventLayers.allIds.reduce((result: number[], current, index) => {
    const prevY = result[index - 1] ? result[index - 1] : 0;
    let y = itemHeight + prevY;
    const event = layer.present.events.byId[tweenDrawer.event];
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
  return { tweenEventLayers, scrollPositions };
};

export default connect(
  mapStateToProps
)(TweenDrawerEvent);