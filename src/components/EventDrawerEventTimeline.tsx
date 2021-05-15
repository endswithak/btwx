import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover, deselectLayerEventTweens } from '../store/actions/layer';
import EventDrawerEventTimelineTweens from './EventDrawerEventTimelineTweens';
import EventDrawerEventTimelineClickZone from './EventDrawerEventTimelineClickZone';

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
      <EventDrawerEventTimelineClickZone />
      <EventDrawerEventTimelineTweens
        layerId={id} />
    </div>
  );
}

export default EventDrawerEventTimeline;