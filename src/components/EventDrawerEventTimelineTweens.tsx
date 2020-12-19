import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { getTweenEventLayerTweens } from '../store/selectors/layer';
import EventDrawerEventTimelineTween from './EventDrawerEventTimelineTween';

interface EventDrawerEventTimelineTweensProps {
  layerId: string;
}

const EventDrawerEventTimelineTweens = (props: EventDrawerEventTimelineTweensProps): ReactElement => {
  const { layerId } = props;
  const eventLayerTweens = useSelector((state: RootState) => getTweenEventLayerTweens(state.layer.present, state.eventDrawer.event, layerId));
  const sortedProps: string[] = eventLayerTweens.allIds.reduce((result, current) => {
    const tween = eventLayerTweens.byId[current];
    result = [...result, tween.prop];
    return result;
  }, []).sort();
  const orderedLayerTweensByProp: string[] = sortedProps.reduce((result, current: Btwx.TweenProp) => {
    const tween = eventLayerTweens.allIds.find((id: string) => eventLayerTweens.byId[id].prop === current);
    result = [...result, tween];
    return result;
  }, []);

  return (
    <>
      {
        orderedLayerTweensByProp.map((id, index) => (
          <EventDrawerEventTimelineTween
            key={index}
            tweenId={id} />
        ))
      }
    </>
  );
}

export default EventDrawerEventTimelineTweens;