import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getEventLayers } from '../store/selectors/layer';
import EventDrawerEventTimeline from './EventDrawerEventTimeline';
import EventDrawerEventTimelinesEmptyState from './EventDrawerEventTimelinesEmptyState';
import EventDrawerEventTimelinesHeaders from './EventDrawerEventTimelinesHeaders';
import EventDrawerEventTimelineGuide from './EventDrawerEventTimelineGuide';
import EventDrawerEventClearSelection from './EventDrawerEventClearSelection';

const EventDrawerEventTimelines = (): ReactElement => {
  const timelineRef = useRef<HTMLDivElement>(null);
  // const selected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const eventLayers = useSelector((state: RootState) => getEventLayers(state.layer.present, state.eventDrawer.event));
  const isEmpty = eventLayers.allIds.length === 0;
  // const dispatch = useDispatch();

  // const handleMouseDown = () => {
  //   if (selected.length > 0) {
  //     dispatch(deselectLayerEventTweens({tweens: selected}));
  //   }
  // }

  return (
    <div
      className='c-event-drawer-event__layers-timeline-wrap'>
      {
        isEmpty
        ? <EventDrawerEventTimelinesEmptyState />
        : <div className='c-event-drawer-event__layers-timeline'>
            <EventDrawerEventTimelinesHeaders />
            <ScrollSyncPane>
              <div
                ref={timelineRef}
                id='event-drawer-event-timelines'
                className='c-event-drawer-event-layers-timeline__layers'>
                <EventDrawerEventClearSelection />
                {
                  eventLayers.allIds.map((layer, index) => (
                    <EventDrawerEventTimeline
                      key={index}
                      id={layer} />
                  ))
                }
              </div>
            </ScrollSyncPane>
            <EventDrawerEventTimelineGuide />
          </div>
      }
    </div>
  );
}

export default EventDrawerEventTimelines;