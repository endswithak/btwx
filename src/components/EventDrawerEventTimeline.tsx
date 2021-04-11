import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover, deselectLayerEventTweens } from '../store/actions/layer';
import EventDrawerEventTimelineTweens from './EventDrawerEventTimelineTweens';

interface EventDrawerEventTimelineProps {
  id: string;
}

const EventDrawerEventTimeline = (props: EventDrawerEventTimelineProps): ReactElement => {
  const { id } = props;
  const dispatch = useDispatch();

  // const handleMouseEnter = (): void => {
  //   dispatch(setLayerHover({ id }));
  // }

  // const handleMouseLeave = (): void => {
  //   dispatch(setLayerHover({ id: null }));
  // }

  return (
    <div
      className='c-event-drawer-event__layer-timeline'
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      >
      <SpacerTimeline />
      <EventDrawerEventTimelineTweens
        layerId={id} />
    </div>
  );
}

const SpacerTimeline = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const dispatch = useDispatch();

  const handleMouseDown = (e) => {
    if (selected.length > 0 && !e.metaKey) {
      dispatch(deselectLayerEventTweens({tweens: selected}));
    }
  }

  return (
    <div
      className='c-event-drawer-event-layer__tween-timeline'
      onMouseDown={handleMouseDown} />
  );
}

export default EventDrawerEventTimeline;