/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { remote } from 'electron';
import { gsap } from 'gsap';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { getEventTweenLayers } from '../store/selectors/layer';
import { setPreviewTweening } from '../store/actions/preview';
import { setActiveArtboard } from '../store/actions/layer';
import { SetPreviewTweeningPayload, PreviewTypes } from '../store/actionTypes/preview';
import { SetActiveArtboardPayload, LayerTypes } from '../store/actionTypes/layer';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';

interface CanvasPreviewLayerEventProps {
  eventId: string;
}

interface CanvasPreviewLayerEventStateProps {
  event: Btwx.TweenEvent;
  eventTweenLayers: string[];
  documentWindowId: number;
  originArtboardPosition: paper.Point;
  destinationArtboardPosition: paper.Point;
  editingEvent: boolean;
  edit: string;
  tweenEdit: boolean;
  setPreviewTweening?(payload: SetPreviewTweeningPayload): PreviewTypes;
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

export interface EventLayerTimelineData {
  paperLayer: paper.Item;
  artboardBackground: paper.Path.Rectangle;
  textLinesGroup: paper.Group;
  textBackground: paper.Path.Rectangle;
}

const CanvasPreviewLayerEvent = (props: CanvasPreviewLayerEventProps & CanvasPreviewLayerEventStateProps): ReactElement => {
  const { tweenEdit, edit, event, eventId, documentWindowId, destinationArtboardPosition, originArtboardPosition, eventTweenLayers, editingEvent, setPreviewTweening, setActiveArtboard } = props;
  const [prevEdit, setPrevEdit] = useState(null);
  const [eventTimeline, setEventTimeline] = useState(
    // create event timeline
    gsap.timeline({
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
        setActiveArtboard({id: event.destinationArtboard});
        remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(event.destinationArtboard)})`);
        setPreviewTweening({tweening: null});
        remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setPreviewTweening(${JSON.stringify(null)})`);
      }
    })
    // add timelines for all event layers
    .add(eventTweenLayers.reduce((result, current) => [...result, gsap.timeline({
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
    })], []), 0)
  );

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
    setPrevEdit(edit);
    return (): void => {
      paperLayer.off(event.event === 'rightclick' ? 'click' : event.event, eventFunction);
    }
  }, []);

  useEffect(() => {
    if (tweenEdit && prevEdit) {
      paperPreview.view.center = originArtboardPosition;
      setActiveArtboard({id: event.artboard});
      remote.BrowserWindow.fromId(documentWindowId).webContents.executeJavaScript(`setActiveArtboard(${JSON.stringify(event.artboard)})`);
      eventTimeline.play();
    }
  }, [edit]);

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
  const originArtboardItem = state.layer.present.byId[event.artboard] as Btwx.Artboard;
  const originArtboardPosition = new paperPreview.Point(originArtboardItem.frame.x, originArtboardItem.frame.y);
  const destinationArtboardItem = state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard;
  const destinationArtboardPosition = new paperPreview.Point(destinationArtboardItem.frame.x, destinationArtboardItem.frame.y);
  const eventTweenLayers = getEventTweenLayers(state, ownProps.eventId);
  // const easeEditor = state.easeEditor;
  const editingEvent = state.eventDrawer.event === ownProps.eventId; // easeEditor.tween && event.tweens.includes(easeEditor.tween);
  const edit = state.layer.present.edit.id;
  const payloadString = JSON.stringify(state.layer.present.edit.payload);
  const tweenEdit = event.tweens.some((id) => payloadString.includes(id));
  return {
    event,
    eventTweenLayers,
    documentWindowId,
    destinationArtboardPosition,
    originArtboardPosition,
    editingEvent,
    edit,
    tweenEdit
  }
}

export default connect(
  mapStateToProps,
  { setPreviewTweening, setActiveArtboard }
)(CanvasPreviewLayerEvent);