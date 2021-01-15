import React, { ReactElement, useState, memo, useEffect, useContext } from 'react';
import { remote } from 'electron';
import { gsap } from 'gsap';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';
import { paperPreview } from '../canvas';

interface CanvasPreviewLayerEventProps {
  id: string;
  eventId: string;
}

interface CanvasPreviewLayerEventStateProps {
  event: Btwx.TweenEvent;
  documentWindowId: number;
}

const CanvasPreviewLayerEvent = (props: CanvasPreviewLayerEventProps & CanvasPreviewLayerEventStateProps): ReactElement => {
  const { id, event, eventId, documentWindowId } = props;
  const [eventTimeline, setEventTimeline] = useState<gsap.core.Timeline>(gsap.timeline({
    id: eventId,
    paused: true,
    data: event.tweens.reduce((result, current) => ({
      ...result,
      [current]: {}
    }), {}),
    onComplete: () => {
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(event.destinationArtboard)})`);
    }
  }));

  const handleEvent = (e: paper.MouseEvent | paper.KeyEvent): void => {
    if (event.event === 'rightclick') {
      if ((e as any).event.which === 3) {
        eventTimeline.play();
      }
    } else {
      eventTimeline.play();
    }
  };

  useEffect(() => {
    // masterTimeline.add(eventTimeline, 0);
    const paperLayer = paperPreview.project.getItem({data:{id}});
    paperLayer.on(event.event === 'rightclick' ? 'click' : event.event, handleEvent);
    return (): void => {
      eventTimeline.kill();
      // masterTimeline.remove(eventTimeline);
    }
  }, []);

  return (
    <>
      {
        event.tweens.map((tweenId, index) => (
          <CanvasPreviewLayerTween
            key={tweenId}
            id={id}
            tweenId={tweenId}
            eventTimeline={eventTimeline} />
        ))
      }
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasPreviewLayerEventProps): CanvasPreviewLayerEventStateProps => {
  const event = state.layer.present.events.byId[ownProps.eventId];
  const documentWindowId = state.preview.documentWindowId;
  return {
    event,
    documentWindowId
  }
}

export default connect(
  mapStateToProps
)(CanvasPreviewLayerEvent);