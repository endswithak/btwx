import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import EventDrawerEventLayerTweenProp from './EventDrawerEventLayerTweenProp';
import ListGroup from './ListGroup';

interface EventDrawerEventLayerTweenPropsProps {
  layerId: string;
}

const EventDrawerEventLayerTweenProps = (props: EventDrawerEventLayerTweenPropsProps): ReactElement => {
  const { layerId } = props;
  const eventLayerTweens = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event] && state.layer.present.events.byId[state.eventDrawer.event].tweens.byLayer[layerId] ? state.layer.present.events.byId[state.eventDrawer.event].tweens.byLayer[layerId] : []);
  const sortedProps: string[] = useSelector((state: RootState) => eventLayerTweens.reduce((result, current) => {
    const tween = state.layer.present.tweens.byId[current];
    if (!result.includes(tween.prop)) {
      result = [...result, tween.prop];
    }
    return result;
  }, []).sort());
  const orderedLayerTweensByProp: string[] = useSelector((state: RootState) => sortedProps.reduce((result, current: Btwx.TweenProp) => {
    const tweens = eventLayerTweens.filter((id: string) => state.layer.present.tweens.byId[id].prop === current);
    result = [...result, ...tweens];
    return result;
  }, []));

  return (
    <ListGroup>
      {
        orderedLayerTweensByProp.map((id, index) => (
          <EventDrawerEventLayerTweenProp
            key={index}
            tweenId={id} />
        ))
      }
    </ListGroup>
  );
}

export default EventDrawerEventLayerTweenProps;