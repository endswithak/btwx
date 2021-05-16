import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';

interface CanvasPreviewEventLayerTimelineProps {
  id: string;
  eventId: string;
  layerTimeline: GSAPTimeline;
}


const CanvasPreviewEventLayerTimeline = (props: CanvasPreviewEventLayerTimelineProps): ReactElement => {
  const { id, eventId, layerTimeline } = props;
  const layerItem: Btwx.Shape = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Shape);
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const eventLayerTweens = useSelector((state: RootState) => {
    if (state.layer.present.events.byId[eventId]) {
      return eventItem.tweens.filter(id => layerItem.tweens.allIds.includes(id));
    } else {
      return null;
    }
  });

  return (
    eventLayerTweens && eventLayerTweens.length > 0
    ? <>
        {
          eventLayerTweens.map((tweenId, index) => (
            <CanvasPreviewLayerTween
              key={tweenId}
              tweenId={tweenId}
              layerTimeline={layerTimeline} />
          ))
        }
      </>
    : null
  )
}

export default CanvasPreviewEventLayerTimeline;