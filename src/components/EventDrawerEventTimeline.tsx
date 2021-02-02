import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { setLayerHover } from '../store/actions/layer';
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
      <div className='c-event-drawer-event-layer__tween-timeline' />
      <EventDrawerEventTimelineTweens layerId={id} />
    </div>
  );
}

export default EventDrawerEventTimeline;