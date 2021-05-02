/* eslint-disable @typescript-eslint/no-use-before-define */
import { ipcRenderer } from 'electron';
import React, { ReactElement, useCallback, useEffect, useState, useMemo } from 'react';
import { createSelector } from 'reselect';
import { gsap } from 'gsap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { getEventTweenLayers } from '../store/selectors/layer';
import { setPreviewTweening } from '../store/actions/preview';
import { setActiveArtboard } from '../store/actions/layer';
import CanvasPreviewLayerTween from './CanvasPreviewLayerTween';

interface CanvasPreviewLayerEventProps {
  eventId: string;
  // instanceId: string;
}

export interface EventLayerTimelineData {
  paperLayer: paper.Item;
  artboardBackground: paper.Path.Rectangle;
  // textLinesGroup: paper.Group;
  textContent: paper.PointText;
  textBackground: paper.Path.Rectangle;
  textMask: paper.Path.Rectangle;
  shapeMask?: paper.CompoundPath;
}

const getEventTweensSelector = () =>
  createSelector(
    (state: RootState) => state.layer.present.tweens.byId,
    (_: any, eventTweens: string[]) => eventTweens,
    (tweensById, eventTweens) => eventTweens.reduce((result, current) => ({
      ...result,
      [current]: tweensById[current]
    }), {})
  );

const CanvasPreviewLayerEvent = (props: CanvasPreviewLayerEventProps): ReactElement => {
  const { eventId } = props;
  const event = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const eventTweensSelector = useMemo(getEventTweensSelector, []);
  const eventTweensById = useSelector((state: RootState) => eventTweensSelector(state, event.tweens));
  const electronInstanceId = useSelector((state: RootState) => state.session.instance);
  const originArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.artboard] as Btwx.Artboard);
  const originArtboardPosition = new paperPreview.Point(originArtboardItem.frame.x, originArtboardItem.frame.y);
  const destinationArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard);
  const destinationArtboardPosition = new paperPreview.Point(destinationArtboardItem.frame.x, destinationArtboardItem.frame.y);
  const eventTweenLayers = useSelector((state: RootState) => getEventTweenLayers(state, eventId));
  // const easeEditor = useSelector((state: RootState) => state.easeEditor);
  // const editingEvent = useSelector((state: RootState) => state.eventDrawer.event === eventId);
  const edit = useSelector((state: RootState) => state.layer.present.edit.id);
  const autoplay = useSelector((state: RootState) => state.preview.autoplay);
  const payloadString = useSelector((state: RootState) => JSON.stringify(state.layer.present.edit.payload));
  const tweenEdit = event.tweens.some((id) => payloadString.includes(id));
  const [eventTimeline, setEventTimeline] = useState<GSAPTimeline>(null);
  const [eventType, setEventType] = useState(event.event);
  const [eventLayer, setEventLayer] = useState(event.layer);
  // const [eventLayers, setEventLayers] = useState(eventTweenLayers);
  const [instance, setNewInstance] = useState(0);
  const dispatch = useDispatch();

  const buildTimeline = () => gsap.timeline({
    id: eventId,
    paused: true,
    data: eventTweenLayers.reduce((result, current) => ({
      ...result,
      [current]: {}
    }), {}),
    onStart: function() {
      dispatch(setPreviewTweening({
        tweening: event.artboard
      }));
      ipcRenderer.send('setDocumentPreviewTweening', JSON.stringify({
        instanceId: electronInstanceId,
        tweening: event.artboard
      }));
    },
    onComplete: function() {
      paperPreview.view.center = destinationArtboardPosition;
      dispatch(setActiveArtboard({
        id: event.destinationArtboard
      }));
      dispatch(setPreviewTweening({
        tweening: null
      }));
      ipcRenderer.send('setDocumentActiveArtboard', JSON.stringify({
        instanceId: electronInstanceId,
        activeArtboard: event.destinationArtboard
      }));
      ipcRenderer.send('setDocumentPreviewTweening', JSON.stringify({
        instanceId: electronInstanceId,
        tweening: event.artboard
      }));
      this.progress(0, false).pause();
      createTimeline();
    }
  })
  // add timelines for all event layers
  .add(buildLayerTimelines(), 0);

  const buildLayerTimelines = () => eventTweenLayers.reduce((result, current) => [...result, gsap.timeline({
    id: `${eventId}-${current}`,
    // on start supply layer timeline with relevant paper layers
    onStart: function() {
      const paperLayer = paperPreview.project.getItem({ data: { id: current } });
      this.data = {
        paperLayer: paperLayer,
        artboardBackground: paperLayer.data.layerType === 'Artboard'
          ? paperLayer.getItem({ data: { id: 'artboardBackground' } }) as paper.Path.Rectangle
          : null,
        textContent: paperLayer.data.layerType === 'Text'
          ? paperLayer.getItem({ data: { id: 'textContent' } }) as paper.PointText
          : null,
        textMask: paperLayer.data.layerType === 'Text'
          ? paperLayer.getItem({ data: { id: 'textMask' } }) as paper.Path.Rectangle
          : null,
        textBackground: paperLayer.data.layerType === 'Text'
          ? paperLayer.getItem({ data: { id: 'textBackground' } }) as paper.Path.Rectangle
          : null,
        shapeMask: paperLayer.data.layerType === 'Shape' && paperLayer.parent.data && paperLayer.parent.data.id === 'maskGroup'
          ? paperLayer.parent.getItem({ data: { id: 'mask' } }) as paper.CompoundPath
          : null
      };
    }
  })], []);

  const addPaperLayerEventListener = (timeline: any = eventTimeline): any => {
    const paperLayer = paperPreview.project.getItem({ data: { id: eventLayer } });
    if (paperLayer) {
      const callback = (e: paper.MouseEvent | paper.KeyEvent): void => {
        if (event.event === 'rightclick') {
          if ((e as any).event.which === 3) {
            timeline.play();
          }
        } else {
          timeline.play();
        }
      };
      paperLayer.on(eventType === 'rightclick' ? 'click' : eventType, callback);
    }
  }

  const removePaperLayerEventListener = () => {
    const paperLayer = paperPreview.project.getItem({ data: { id: eventLayer } });
    if (paperLayer) {
      paperLayer.off((eventType === 'rightclick' ? 'click' : eventType) as any);
    }
  }

  const killTimeline = () => {
    if (eventTimeline) {
      eventTimeline.kill();
    }
    removePaperLayerEventListener();
  }

  const createTimeline = () => {
    killTimeline();
    const newTimeline = buildTimeline();
    addPaperLayerEventListener(newTimeline);
    setEventTimeline(newTimeline);
    setNewInstance(instance + 1);
  }

  // create initial timeline
  useEffect(() => {
    createTimeline();
    return () => {
      killTimeline();
    }
  }, []);

  useEffect(() => {
    if (eventTimeline) {
      createTimeline();
    }
  }, [eventTweensById]);

  // autoplay feature...
  // plays timeline whenever any event tween layer tween prop changes
  useEffect(() => {
    if (tweenEdit && eventTimeline && autoplay) {
      paperPreview.view.center = originArtboardPosition;
      dispatch(setActiveArtboard({
        id: event.artboard
      }));
      ipcRenderer.invoke('setDocumentActiveArtboard', JSON.stringify({
        instanceId: electronInstanceId,
        activeArtboard: event.artboard
      }));
      eventTimeline.play();
    }
  }, [edit]);

  // attach tweens to event layer timelines
  return (
    eventTimeline
    ? <>
        {
          event.tweens.map((tweenId) => (
            <CanvasPreviewLayerTween
              key={`${tweenId}-${instance}`}
              tweenId={tweenId}
              eventTimeline={eventTimeline} />
          ))
        }
      </>
    : null
  );
}

export default CanvasPreviewLayerEvent;