import React, { ReactElement, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getWiggleLayersSelector } from '../store/selectors/layer';
import EventDrawerEventTimeline from './EventDrawerEventTimeline';
import EventDrawerEventTimelinesEmptyState from './EventDrawerEventTimelinesEmptyState';
import EventDrawerEventTimelinesHeaders from './EventDrawerEventTimelinesHeaders';
import EventDrawerEventTimelineGuide from './EventDrawerEventTimelineGuide';
import EventDrawerEventClearSelection from './EventDrawerEventClearSelection';
import EventDrawerEventTimelineClickZone from './EventDrawerEventTimelineClickZone';

const EventDrawerEventTimelines = (): ReactElement => {
  const timelineRef = useRef<HTMLDivElement>(null);
  // const selected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const eventLayers = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event] ? state.layer.present.events.byId[state.eventDrawer.event].layers : []);
  const wiggleLayers = useSelector((state: RootState) => getWiggleLayersSelector(state, state.eventDrawer.event));
  const isEmpty = eventLayers.length === 0;
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
                  eventLayers.map((layer, index) => (
                    <EventDrawerEventTimeline
                      key={index}
                      id={layer} />
                  ))
                }
                {/* make space for wiggle layers */}
                {
                  wiggleLayers.allIds.filter((id) => !eventLayers.includes(id)).map((layer) => (
                    <div
                      className='c-event-drawer-event__layer-timeline'>
                      <EventDrawerEventTimelineClickZone />
                    </div>
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