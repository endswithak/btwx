/* eslint-disable @typescript-eslint/no-use-before-define */
import { ipcRenderer } from 'electron';
import React, { ReactElement, useEffect, useState } from 'react';
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
  instanceId: string;
}

export interface EventLayerTimelineData {
  paperLayer: paper.Item;
  artboardBackground: paper.Path.Rectangle;
  // textLinesGroup: paper.Group;
  textContent: paper.PointText;
  textBackground: paper.Path.Rectangle;
  textMask: paper.Path.Rectangle;
}

const CanvasPreviewLayerEvent = (props: CanvasPreviewLayerEventProps): ReactElement => {
  const { eventId, instanceId } = props;
  const event = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const instance = useSelector((state: RootState) => state.session.instance);
  const originArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.artboard] as Btwx.Artboard);
  const originArtboardPosition = new paperPreview.Point(originArtboardItem.frame.x, originArtboardItem.frame.y);
  const destinationArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard);
  const destinationArtboardPosition = new paperPreview.Point(destinationArtboardItem.frame.x, destinationArtboardItem.frame.y);
  const eventTweenLayers = useSelector((state: RootState) => getEventTweenLayers(state, eventId));
  // const easeEditor = useSelector((state: RootState) => state.easeEditor);
  const editingEvent = useSelector((state: RootState) => state.eventDrawer.event === eventId);
  const edit = useSelector((state: RootState) => state.layer.present.edit.id);
  const payloadString = useSelector((state: RootState) => JSON.stringify(state.layer.present.edit.payload));
  const tweenEdit = event.tweens.some((id) => payloadString.includes(id));
  const [prevEdit, setPrevEdit] = useState(null);
  const [eventTimeline, setEventTimeline] = useState<GSAPTimeline>(null);
  const dispatch = useDispatch();

  const buildTimeline = () => gsap.timeline({
    id: eventId,
    paused: true,
    data: eventTweenLayers.reduce((result, current) => ({
      ...result,
      [current]: {}
    }), {}),
    onStart: handleEventStart,
    onComplete: handleEventComplete
  })
  // add timelines for all event layers
  .add(buildLayerTimelines(), 0);

  const handleEventStart = () => {
    dispatch(setPreviewTweening({tweening: event.artboard}));
    ipcRenderer.send('setDocumentPreviewTweening', JSON.stringify({
      instanceId: instance,
      tweening: event.artboard
    }));
  }

  const handleEventComplete = () => {
    paperPreview.view.center = destinationArtboardPosition;
    dispatch(setActiveArtboard({id: event.destinationArtboard}));
    dispatch(setPreviewTweening({tweening: null}));
    ipcRenderer.send('setDocumentActiveArtboard', JSON.stringify({
      instanceId: instance,
      activeArtboard: event.destinationArtboard
    }));
    ipcRenderer.send('setDocumentPreviewTweening', JSON.stringify({
      instanceId: instance,
      tweening: event.artboard
    }));
  }

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
        // textLinesGroup: paperLayer.data.layerType === 'Text'
        //   ? paperLayer.getItem({ data: { id: 'textLines' } }) as paper.Group
        //   : null,
        textContent: paperLayer.data.layerType === 'Text'
          ? paperLayer.getItem({ data: { id: 'textContent' } }) as paper.PointText
          : null,
        textMask: paperLayer.data.layerType === 'Text'
          ? paperLayer.getItem({ data: { id: 'textMask' } }) as paper.Path.Rectangle
          : null,
        textBackground: paperLayer.data.layerType === 'Text'
          ? paperLayer.getItem({ data: { id: 'textBackground' } }) as paper.Path.Rectangle
          : null
      };
    }
  })], []);

  const getEventFunction = (timeline: any = eventTimeline): any =>
    (e: paper.MouseEvent | paper.KeyEvent): void => {
      if (event.event === 'rightclick') {
        if ((e as any).event.which === 3) {
          timeline.play();
        }
      } else {
        timeline.play();
      }
    };

  useEffect(() => {
    if (eventTimeline) {
      eventTimeline.kill();
    }
    const newTimeline = buildTimeline();
    const paperLayer = paperPreview.project.getItem({ data: { id: event.layer } });
    const eventFunc = getEventFunction(newTimeline);
    const eventType = event.event === 'rightclick' ? 'click' : event.event;
    paperLayer.on(eventType, eventFunc);
    setPrevEdit(edit);
    setEventTimeline(newTimeline);
  }, [instanceId]);

  // useEffect(() => {
  //   if (tweenEdit && prevEdit) {
  //     paperPreview.view.center = originArtboardPosition;
  //     dispatch(setActiveArtboard({id: event.artboard}));
  //     ipcRenderer.send('setDocumentActiveArtboard', JSON.stringify({
  //       instanceId: instance,
  //       activeArtboard: event.artboard
  //     }));
  //     eventTimeline.play();
  //   }
  // }, [edit]);

  // attach tweens to event layer timelines
  return (
    eventTimeline
    ? <>
        {
          event.tweens.map((tweenId) => (
            <CanvasPreviewLayerTween
              key={tweenId}
              tweenId={tweenId}
              eventTimeline={eventTimeline} />
          ))
        }
      </>
    : null
  );
}

export default CanvasPreviewLayerEvent;