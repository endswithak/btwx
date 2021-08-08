import { gsap } from 'gsap';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setPreviewTweening } from '../store/actions/preview';
import { setActiveArtboard } from '../store/actions/layer';
import { getPaperFillColor } from '../store/utils/paper';
import { applyLayerTimelines, killTimeline } from '../utils';
import { paperMain, paperPreview } from '../canvas';
import { getAllArtboardItems, getAllEventOriginTweenLayers } from '../store/selectors/layer';
import CanvasLayer from './CanvasLayer';
import CanvasPreviewEventLayerTimeline from './CanvasPreviewEventLayerTimeline';

interface CanvasArtboardLayerProps {
  id: string;
  paperScope: Btwx.PaperScope;
  wheelEvent?: any;
}

const CanvasArtboardLayer = (props: CanvasArtboardLayerProps): ReactElement => {
  const { id, paperScope, wheelEvent } = props;
  const allEventTweenLayers = useSelector((state: RootState) => paperScope === 'preview' ? getAllEventOriginTweenLayers(state, id) : null);
  const artboardItems = useSelector((state: RootState) => getAllArtboardItems(state));
  const electronInstanceId = useSelector((state: RootState) => state.session.instance);
  const layerItem: Btwx.Artboard = useSelector((state: RootState) => state.layer.present.byId[id] as Btwx.Artboard);
  const eventsById = useSelector((state: RootState) => state.layer.present.events.byId);
  const projectIndex: number = useSelector((state: RootState) => state.layer.present.byId[id] ? (state.layer.present.byId[id] as Btwx.Artboard).projectIndex : null);
  const paperLayerScope = paperScope === 'main' ? paperMain : paperPreview;
  const [rendered, setRendered] = useState<boolean>(false);
  const [eventTimelines, setEventTimelines] = useState(null);
  const [layerTimelines, setLayerTimelines] = useState(null);
  const [eventLayers, setEventLayers] = useState(allEventTweenLayers);
  const [originEvents, setOriginEvents] = useState(layerItem.originForEvents);
  const [project, setProject] = useState(paperScope === 'main' ? projectIndex ? paperMain.projects[projectIndex] : null : paperPreview.project);
  const dispatch = useDispatch();

  ///////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////////////////////////////

  const getPaperLayer = (): {
    paperLayer: paper.Group;
    layers: paper.Group;
    layersMask: paper.Path.Rectangle;
    maskedLayers: paper.Group;
    background: paper.Path.Rectangle;
  } => {
    const paperLayer = project.getItem({ data: { id } }) as paper.Group;
    if (paperLayer) {
      const layers = paperLayer.getItem({ data: { id: 'artboardLayers' } }) as paper.Group;
      const layersMask = paperLayer.getItem({ data: { id: 'artboardLayersMask' } }) as paper.Path.Rectangle;
      const maskedLayers = paperLayer.getItem({ data: { id: 'artboardMaskedLayers' } }) as paper.Group;
      const background = paperLayer.getItem({ data: { id: 'artboardBackground' } }) as paper.Path.Rectangle;
      return {
        paperLayer,
        layers,
        layersMask,
        maskedLayers,
        background
      };
    } else {
      return {
        paperLayer: null,
        layers: null,
        layersMask: null,
        maskedLayers: null,
        background: null
      }
    }
  }

  const createArtboard = (paperProject = project) => {
    const artboardBounds = new paperLayerScope.Rectangle({
      from: new paperLayerScope.Point(
        layerItem.frame.x - (layerItem.frame.width / 2),
        layerItem.frame.y - (layerItem.frame.height / 2)
      ),
      to: new paperLayerScope.Point(
        layerItem.frame.x + (layerItem.frame.width / 2),
        layerItem.frame.y + (layerItem.frame.height / 2)
      )
    });
    new paperLayerScope.Group({
      name: `artboard-${layerItem.name}`,
      data: {
        id,
        type: 'Layer',
        layerType: 'Artboard',
        scope: ['root']
      },
      children: [
        new paperLayerScope.Path.Rectangle({
          name: 'Artboard Background',
          rectangle: artboardBounds,
          data: {
            id: 'artboardBackground',
            type: 'LayerChild',
            layerType: 'Artboard',
            layerId: id
          },
          fillColor: getPaperFillColor({
            fill: layerItem.style.fill,
            isLine: false,
            layerFrame: layerItem.frame,
            artboardFrame: null
          }),
          shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
          shadowOffset: new paperLayerScope.Point(0, 2),
          shadowBlur: 10
        }),
        new paperLayerScope.Group({
          name: 'Artboard Masked Layers',
          data: {
            id: 'artboardMaskedLayers',
            type: 'LayerChild',
            layerType: 'Artboard',
            layerId: id
          },
          children: [
            new paperLayerScope.Path.Rectangle({
              name: 'Artboard Layers Mask',
              rectangle: artboardBounds,
              data: {
                id: 'artboardLayersMask',
                type: 'LayerChild',
                layerType: 'Artboard',
                layerId: id
              },
              fillColor: '#fff',
              clipMask: true
            }),
            new paperLayerScope.Group({
              name: 'Artboard Layers',
              data: {
                id: 'artboardLayers',
                type: 'LayerChild',
                layerType: 'Artboard',
                layerId: id
              }
            })
          ]
        })
      ],
      parent: paperProject.activeLayer
    });
  }

  const applyFill = (): void => {
    const { background } = getPaperLayer();
    background.fillColor = getPaperFillColor({
      fill: layerItem.style.fill,
      isLine: false,
      layerFrame: layerItem.frame,
      artboardFrame: null
    });
  }

  ///////////////////////////////////////////////////////
  // INIT
  ///////////////////////////////////////////////////////

  useEffect(() => {
    // build layer
    createArtboard();
    setRendered(true);
    return (): void => {
      // remove layer
      const paperLayer = project.getItem({ data: { id } });
      if (paperLayer) {
        paperLayer.remove();
      }
    }
  }, []);

  ///////////////////////////////////////////////////////
  // FRAME
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer, layersMask, background } = getPaperLayer();
      layersMask.bounds.width = layerItem.frame.innerWidth;
      background.bounds.width = layerItem.frame.innerWidth;
      layersMask.position.x = layerItem.frame.x;
      background.position.x = layerItem.frame.x;
      if (rendered && layerItem.style.fill.fillType === 'gradient') {
        applyFill();
      }
    }
  }, [layerItem.frame.innerWidth]);

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer, layersMask, background } = getPaperLayer();
      layersMask.bounds.height = layerItem.frame.innerHeight;
      background.bounds.height = layerItem.frame.innerHeight;
      layersMask.position.y = layerItem.frame.y;
      background.position.y = layerItem.frame.y;
      if (rendered && layerItem.style.fill.fillType === 'gradient') {
        applyFill();
      }
    }
  }, [layerItem.frame.innerHeight]);

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer } = getPaperLayer();
      paperLayer.position.x = layerItem.frame.x;
    }
  }, [layerItem.frame.x]);

  useEffect(() => {
    if (rendered && layerItem) {
      const { paperLayer } = getPaperLayer();
      paperLayer.position.y = layerItem.frame.y;
    }
  }, [layerItem.frame.y]);

  ///////////////////////////////////////////////////////
  // FILL STYLE
  ///////////////////////////////////////////////////////

  useEffect(() => {
    if (rendered && layerItem) {
      applyFill();
    }
  }, [layerItem.style.fill]);

  ///////////////////////////////////////////////////////
  // EVENT TIMELINES
  ///////////////////////////////////////////////////////

  const buildTimeline = (eventId) => {
    killTimeline(eventId);
    const eventItem = eventsById[eventId];
    const originArtboardItem = artboardItems[eventItem.origin];
    const destinationArtboardItem = artboardItems[eventItem.destination];
    const destinationArtboardPosition = new paperPreview.Point(
      destinationArtboardItem.frame.x,
      destinationArtboardItem.frame.y
    );
    const originArtboardPosition = new paperPreview.Point(
      originArtboardItem.frame.x,
      originArtboardItem.frame.y
    );
    return gsap.timeline({
      id: eventId,
      paused: true,
      onStart: function() {
        paperPreview.view.center = originArtboardPosition;
        dispatch(setPreviewTweening({
          tweening: eventId
        }));
        dispatch(setActiveArtboard({
          id: eventItem.origin
        }));
        (window as any).api.setDocumentPreviewTweening(JSON.stringify({
          instanceId: electronInstanceId,
          tweening: eventId
        }));
        (window as any).api.setDocumentActiveArtboard(JSON.stringify({
          instanceId: electronInstanceId,
          activeArtboard: eventItem.origin
        }));
      },
      onUpdate: function() {
        (window as any).api.setDocumentTimelineGuidePosition(JSON.stringify({
          instanceId: electronInstanceId,
          time: this.time()
        }));
      },
      onComplete: function() {
        paperPreview.view.center = destinationArtboardPosition;
        dispatch(setPreviewTweening({
          tweening: null
        }));
        dispatch(setActiveArtboard({
          id: eventItem.destination
        }));
        (window as any).api.setDocumentPreviewTweening(JSON.stringify({
          instanceId: electronInstanceId,
          tweening: null
        }));
        (window as any).api.setDocumentActiveArtboard(JSON.stringify({
          instanceId: electronInstanceId,
          activeArtboard: eventItem.destination
        }));
        if (this) {
          this.pause(0, false);
        }
      }
    });
  }

  const buildTimelines = () => {
    if (layerItem.originForEvents.length > 0) {
      setEventTimelines(layerItem.originForEvents.reduce((result, current) => ({
        ...result,
        [current]: buildTimeline(current)
      }), {} as { [id: string]: GSAPTimeline }));
    } else {
      setEventTimelines(null);
    }
  }

  if (paperScope === 'preview') {
    useEffect(() => {
      buildTimelines();
    }, []);

    // extra prop check since we're hydrating layers on every edit...
    // causing array/objects to flag as changed
    useEffect(() => {
      if (((eventLayers.length !== allEventTweenLayers.length) || !allEventTweenLayers.every(id => eventLayers.includes(id)))) {
        setEventLayers(allEventTweenLayers);
        buildTimelines();
      }
    }, [allEventTweenLayers]);

    // extra prop check since we're hydrating layers on every edit...
    // causing array/objects to flag as changed
    useEffect(() => {
      if (((originEvents.length !== layerItem.originForEvents.length) || !layerItem.originForEvents.every(id => originEvents.includes(id)))) {
        setOriginEvents(layerItem.originForEvents);
        buildTimelines();
      }
    }, [layerItem.originForEvents]);
  }

  ///////////////////////////////////////////////////////
  // EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    useEffect(() => {
      if (rendered && eventTimelines) {
        const { paperLayer } = getPaperLayer();
        setLayerTimelines(applyLayerTimelines({
          paperLayer,
          eventTimelines,
          eventsById,
          layerItem
        }));
      } else {
        if (layerTimelines) {
          setLayerTimelines(null);
        }
      }
    }, [eventTimelines, rendered]);
  }

  ///////////////////////////////////////////////////////
  // CHILDREN & EVENTS
  ///////////////////////////////////////////////////////

  if (paperScope === 'preview') {
    return (
      rendered && layerItem
      ? <>
          {
            layerItem.children.length > 0
            ? layerItem.children.map((childId) => (
                <CanvasLayer
                  key={childId}
                  id={childId}
                  paperScope={paperScope}
                  eventTimelines={eventTimelines}
                  wheelEvent={wheelEvent} />
              ))
            : null
          }
          {
            layerTimelines && eventTimelines
            ? Object.keys(layerTimelines).map((eventId) => (
                <CanvasPreviewEventLayerTimeline
                  key={eventId}
                  id={id}
                  eventId={eventId}
                  layerTimeline={layerTimelines[eventId]}
                  eventTimeline={eventTimelines[eventId]} />
              ))
            : null
          }
        </>
      : null
    )
  } else {
    return (
      rendered && layerItem && layerItem.children.length > 0
      ? <>
          {
            layerItem.children.map((childId) => (
              <CanvasLayer
                key={childId}
                id={childId}
                paperScope={paperScope} />
            ))
          }
        </>
      : null
    );
  }
}

export default CanvasArtboardLayer;