import React, { ReactElement, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import EventDrawerEventTimeline from './EventDrawerEventTimeline';
import EventDrawerEventTimelinesEmptyState from './EventDrawerEventTimelinesEmptyState';
import EventDrawerEventTimelinesHeaders from './EventDrawerEventTimelinesHeaders';
import EventDrawerEventTimelineGuide from './EventDrawerEventTimelineGuide';

const EventDrawerEventTimelines = (): ReactElement => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const tweenEventLayers = useSelector((state: RootState) => getTweenEventLayers(state.layer.present, state.eventDrawer.event));
  const isEmpty = tweenEventLayers.allIds.length === 0;

  return (
    <div className='c-event-drawer-event__layers-timeline-wrap'>
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
                {
                  tweenEventLayers.allIds.map((layer, index) => (
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