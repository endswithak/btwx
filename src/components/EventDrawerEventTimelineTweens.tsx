import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import EventDrawerEventTimelineTween from './EventDrawerEventTimelineTween';

interface EventDrawerEventTimelineTweensProps {
  layerId: string;
}

const EventDrawerEventTimelineTweens = (props: EventDrawerEventTimelineTweensProps): ReactElement => {
  const { layerId } = props;
  const eventLayerTweens = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event] ? state.layer.present.events.byId[state.eventDrawer.event].tweens.byLayer[layerId] : []);
  const sortedProps: string[] = useSelector((state: RootState) => eventLayerTweens.reduce((result, current) => {
    const tween = state.layer.present.tweens.byId[current];
    result = [...result, tween.prop];
    return result;
  }, []).sort());
  const orderedLayerTweensByProp: string[] = useSelector((state: RootState) => sortedProps.reduce((result, current: Btwx.TweenProp) => {
    const tween = eventLayerTweens.find((id: string) => state.layer.present.tweens.byId[id].prop === current);
    result = [...result, tween];
    return result;
  }, []));

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