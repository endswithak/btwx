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
  // const tweensById = useSelector((state: RootState) => state.layer.present.tweens.byId);
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const currentEventListener = useSelector((state: RootState) => eventItem ? eventItem.listener : null);
  const currentEventLayer = useSelector((state: RootState) => eventItem ? eventItem.layer : null);
  const currentEventLayerTweens = useSelector((state: RootState) => eventItem ? eventItem.tweens.byLayer[id] : []);
  // const hasXTween = useSelector((state: RootState) => currentEventLayerTweens ? currentEventLayerTweens.find((id) => state.layer.present.tweens.byId[id].prop === 'x') : false);
  // const hasYTween = useSelector((state: RootState) => currentEventLayerTweens ? currentEventLayerTweens.find((id) => state.layer.present.tweens.byId[id].prop === 'y') : false);
  // const xTweenValue = useSelector((state: RootState) => hasXTween ? state.layer.present.tweens.byId[hasXTween] : null);
  // const yTweenValue = useSelector((state: RootState) => hasYTween ? state.layer.present.tweens.byId[hasYTween] : null);
  const [eventLayerTweens, setEventLayerTweens] = useState(currentEventLayerTweens);
  const [eventLayer, setEventLayer] = useState(currentEventLayer);
  const [prevEventListener, setPrevEventListener] = useState(currentEventListener);
  // const [xTween, setXTween] = useState(xTweenValue);
  // const [yTween, setYTween] = useState(yTweenValue);

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

  // if has scroll, update x tween or create x tween
  // if group has scroll, always add x/y tween to children

  // useEffect(() => {
  //   if (scroll.left && ) {

  //   }
  // }, [scroll.left]);

  return (
    eventLayerTweens && eventLayerTweens.length > 0
    ? <>
        {
          eventLayerTweens.map((tweenId) => (
            <CanvasPreviewLayerTween
              key={tweenId}
              tweenId={tweenId}
              // tween={tweensById[tweenId] || }
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