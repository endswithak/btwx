import React, { ReactElement, useMemo, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { RootState } from '../store/reducers';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';
import { addPaperLayerEventListener, removePaperLayerEventListeners } from '../utils';

interface CanvasPreviewEventLayerTimelineProps {
  id: string;
  eventId: string;
  layerTimeline: GSAPTimeline;
  eventTimeline: GSAPTimeline;
}

const getEventLayerTweensSelector = () =>
  createSelector(
    (state: RootState) => state.layer.present.events.byId,
    (state: RootState) => state.layer.present.tweens.byId,
    (_: any, props: { eventId: string; layerId: string; }) => props,
    (eventsById, tweensById, props) => {
      if (eventsById[props.eventId]) {
        return eventsById[props.eventId].tweens.filter(tweenId => tweensById[tweenId].layer === props.layerId);
      } else {
        return null;
      }
    }
  );

const CanvasPreviewEventLayerTimeline = (props: CanvasPreviewEventLayerTimelineProps): ReactElement => {
  const { id, eventId, layerTimeline, eventTimeline } = props;
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const eventListener = eventItem ? eventItem.event : null;
  const eventLayer = eventItem ? eventItem.layer : null;
  const eventLayerTweensSelector = useMemo(getEventLayerTweensSelector, []);
  const eventLayerTweens = useSelector((state: RootState) => eventLayerTweensSelector(state, { eventId, layerId: id }));
  const [prevListener, setPrevListener] = useState(eventListener);

  useEffect(() => {
    return () => {
      if (gsap.getById(eventId).isActive()) {
        gsap.getById(eventId).pause(0, false);
      }
    }
  }, []);

  useEffect(() => {
    if (eventListener && (prevListener !== eventListener && id === eventLayer)) {
      removePaperLayerEventListeners(layerTimeline.data.paperLayer);
      addPaperLayerEventListener({
        eventTimeline,
        eventListener: eventListener,
        paperLayer: layerTimeline.data.paperLayer
      });
      setPrevListener(eventListener);
    }
  }, [eventListener]);

  return (
    eventLayerTweens && eventLayerTweens.length > 0
    ? <>
        {
          eventLayerTweens.map((tweenId) => (
            <CanvasPreviewLayerTween
              key={tweenId}
              tweenId={tweenId}
              layerTimeline={layerTimeline}
              eventTimeline={eventTimeline} />
          ))
        }
      </>
    : null
  )
}

export default CanvasPreviewEventLayerTimeline;