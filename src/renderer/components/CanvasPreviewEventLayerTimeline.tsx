import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';
import { addPaperLayerEventListener, removePaperLayerEventListeners } from '../utils';

interface CanvasPreviewEventLayerTimelineProps {
  id: string;
  eventId: string;
  layerTimeline: GSAPTimeline;
  eventTimeline: GSAPTimeline;
  scrollLeft: number;
  scrollTop: number;
}

const CanvasPreviewEventLayerTimeline = (props: CanvasPreviewEventLayerTimelineProps): ReactElement => {
  const { id, eventId, layerTimeline, eventTimeline, scrollLeft, scrollTop } = props;
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const currentEventListener = useSelector((state: RootState) => eventItem ? eventItem.listener : null);
  const currentEventLayer = useSelector((state: RootState) => eventItem ? eventItem.layer : null);
  const currentEventLayerTweens = useSelector((state: RootState) => eventItem ? eventItem.tweens.byLayer[id] : []);
  const [eventLayerTweens, setEventLayerTweens] = useState(currentEventLayerTweens);
  const [eventLayer, setEventLayer] = useState(currentEventLayer);
  const [prevEventListener, setPrevEventListener] = useState(currentEventListener);

  useEffect(() => {
    if (currentEventLayerTweens && (currentEventLayerTweens.length !== eventLayerTweens.length || !currentEventLayerTweens.every(id => eventLayerTweens.includes(id)))) {
      setEventLayerTweens(currentEventLayerTweens);
    }
  }, [currentEventLayerTweens]);

  useEffect(() => {
    if (currentEventListener && (prevEventListener !== currentEventListener && id === eventLayer)) {
      removePaperLayerEventListeners(layerTimeline.data.paperLayer);
      addPaperLayerEventListener({
        eventTimeline,
        eventListener: currentEventListener,
        paperLayer: layerTimeline.data.paperLayer
      });
      setPrevEventListener(currentEventListener);
    }
  }, [currentEventListener]);

  return (
    eventLayerTweens && eventLayerTweens.length > 0
    ? <>
        {
          eventLayerTweens.map((tweenId) => (
            <CanvasPreviewLayerTween
              key={tweenId}
              tweenId={tweenId}
              layerTimeline={layerTimeline}
              eventTimeline={eventTimeline}
              scrollLeft={scrollLeft}
              scrollTop={scrollTop} />
          ))
        }
      </>
    : null
  )
}

export default CanvasPreviewEventLayerTimeline;