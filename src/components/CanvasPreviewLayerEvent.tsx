/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect } from 'react';
import { remote } from 'electron';
import { gsap } from 'gsap';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { getEventTweenLayers } from '../store/selectors/layer';
import { setPreviewTweening } from '../store/actions/preview';
import { SetPreviewTweeningPayload, PreviewTypes } from '../store/actionTypes/preview';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';

interface CanvasPreviewLayerEventProps {
  eventId: string;
}

interface CanvasPreviewLayerEventStateProps {
  event: Btwx.TweenEvent;
  eventTweenLayers: string[];
  documentWindowId: number;
  destinationArtboardPosition: paper.Point;
  setPreviewTweening?(payload: SetPreviewTweeningPayload): PreviewTypes;
}

export interface EventLayerTimelineData {
  paperLayer: paper.Item;
  artboardBackground: paper.Path.Rectangle;
  textLinesGroup: paper.Group;
  textBackground: paper.Path.Rectangle;
}

const CanvasPreviewLayerEvent = (props: CanvasPreviewLayerEventProps & CanvasPreviewLayerEventStateProps): ReactElement => {
  const { event, eventId, documentWindowId, destinationArtboardPosition, eventTweenLayers, setPreviewTweening } = props;

  // create event timeline
  const eventTimeline = gsap.timeline({
    id: eventId,
    paused: true,
    data: eventTweenLayers.reduce((result, current) => ({
      ...result,
      [current]: {}
    }), {}),
    onStart: () => {
      setPreviewTweening({tweening: event.artboard});
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setPreviewTweening(${JSON.stringify(event.artboard)})`);
    },
    onComplete: () => {
      paperPreview.view.center = destinationArtboardPosition;
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(event.destinationArtboard)})`);
      setPreviewTweening({tweening: null});
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setPreviewTweening(${JSON.stringify(null)})`);
    }
  })

  // create timelines for all event layers
  eventTweenLayers.reduce((result, current) => {
    const eventLayerTimeline = gsap.timeline({
      id: `${eventId}-${current}`,
      data: {
        paperLayer: null,
        artboardBackground: null,
        textLinesGroup: null,
        textBackground: null
      },
      // on start supply layer timeline with relevant paper layers
      onStart: function() {
        this.data = ((): EventLayerTimelineData => {
          const paperLayer = paperPreview.project.getItem({data:{id: current}});
          let textLinesGroup: paper.Group = null;
          let artboardBackground: paper.Path.Rectangle = null;
          let textBackground: paper.Path.Rectangle = null;
          if (paperLayer.data.layerType === 'Artboard') {
            artboardBackground = paperLayer.getItem({data:{id:'artboardBackground'}}) as paper.Path.Rectangle;
          }
          if (paperLayer.data.layerType === 'Text') {
            textLinesGroup = paperLayer.getItem({data:{id:'textLines'}}) as paper.Group;
            textBackground = paperLayer.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
          }
          return {
            paperLayer,
            artboardBackground,
            textLinesGroup,
            textBackground
          }
        })();
      }
    });
    eventTimeline.add(eventLayerTimeline, 0);
    return {
      ...result,
      [current]: eventLayerTimeline
    }
  }, {});

  const eventFunction = (e: paper.MouseEvent | paper.KeyEvent): void => {
    if (event.event === 'rightclick') {
      if ((e as any).event.which === 3) {
        eventTimeline.play();
      }
    } else {
      eventTimeline.play();
    }
  };

  // add event listener to event paper layer
  useEffect(() => {
    const paperLayer = paperPreview.project.getItem({data:{id: event.layer}});
    paperLayer.on(event.event === 'rightclick' ? 'click' : event.event, eventFunction);
    return (): void => {
      paperLayer.off(event.event === 'rightclick' ? 'click' : event.event, eventFunction);
    }
  }, []);

  // attach tweens to event layer timelines
  return (
    <>
      {
        event.tweens.map((tweenId, index) => (
          <CanvasPreviewLayerTween
            key={tweenId}
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
  const destinationArtboardItem = state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard;
  const destinationArtboardPosition = new paperPreview.Point(destinationArtboardItem.frame.x, destinationArtboardItem.frame.y);
  const eventTweenLayers = getEventTweenLayers(state, ownProps.eventId);
  return {
    event,
    eventTweenLayers,
    documentWindowId,
    destinationArtboardPosition
  }
}

export default connect(
  mapStateToProps,
  { setPreviewTweening }
)(CanvasPreviewLayerEvent);