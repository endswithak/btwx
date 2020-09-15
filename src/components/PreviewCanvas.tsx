import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import tinyColor from 'tinycolor2';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { setActiveArtboard } from '../store/actions/layer';
import { SetActiveArtboardPayload, LayerTypes } from '../store/actionTypes/layer';
import { getPositionInArtboard, getAllArtboardTweenEvents, getAllArtboardTweenEventArtboards, getAllArtboardTweens, getAllArtboardTweenLayers, getAllArtboardTweenLayerDestinations, getAllArtboardTweenEventLayers, getGradientDestinationPoint, getGradientOriginPoint, getGradientStops } from '../store/selectors/layer';
import { bufferToBase64 } from '../utils';

gsap.registerPlugin(MorphSVGPlugin);

interface PreviewCanvasProps {
  layer?: any;
  paperProject?: string;
  activeArtboard?: em.Artboard;
  page?: string;
  tweenEvents: {
    allIds: string[];
    byId: {
      [id: string]: em.TweenEvent;
    };
  };
  tweenEventLayers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  tweenEventDestinations: {
    allIds: string[];
    byId: {
      [id: string]: em.Artboard;
    };
  };
  tweens: {
    allIds: string[];
    byId: {
      [id: string]: em.Tween;
    };
  };
  tweenLayers: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  tweenLayerDestinations: {
    allIds: string[];
    byId: {
      [id: string]: em.Layer;
    };
  };
  documentImagesById: {
    [id: string]: em.DocumentImage;
  };
  touchCursor: boolean;
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const [playing, setPlaying] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page, touchCursor, tweenEvents, tweenEventLayers, tweenEventDestinations, tweens, tweenLayers, tweenLayerDestinations, setActiveArtboard, documentImagesById } = props;

  const handleResize = (): void => {
    paperPreview.view.viewSize = new paperPreview.Size(
      canvasContainerRef.current.clientWidth,
      canvasContainerRef.current.clientHeight
    );
    paperPreview.view.center = new paperPreview.Point(activeArtboard.frame.x, activeArtboard.frame.y);
  }

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperPreview.setup(canvasRef.current);
    paperPreview.view.center = new paperPreview.Point(activeArtboard.frame.x, activeArtboard.frame.y);
    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    paperPreview.project.clear();
    paperPreview.project.importJSON(paperProject);
    const paperActiveArtboard = paperPreview.project.getItem({ data: { id: activeArtboard.id } });
    const paperTweenEventLayersById = tweenEventLayers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenEventDestinationsById = tweenEventDestinations.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenLayersById = tweenLayers.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    const paperTweenLayerDestinationsById = tweenLayerDestinations.allIds.reduce((result: {[id: string]: paper.Item}, current) => {
      result[current] = paperPreview.project.getItem({ data: { id: current } });
      return result;
    }, {});
    paperPreview.project.clear();
    const rootLayer = new paperPreview.Layer();
    paperPreview.project.addLayer(rootLayer);
    paperActiveArtboard.parent = rootLayer;
    paperActiveArtboard.position = paperPreview.view.center;
    //
    const timelines = {} as { [id: string]: gsap.core.Timeline };
    const timelineProps = {} as { [id: string]: any };
    // add animation events
    tweenEvents.allIds.forEach((eventId) => {
      const tweenEvent = tweenEvents.byId[eventId];
      const tweenEventArtboard = tweenEventDestinations.byId[tweenEvent.artboard] as em.Artboard;
      const tweenEventArtboardPaperLayer = paperTweenEventDestinationsById[tweenEvent.artboard];
      const tweenEventDestinationArtboard = tweenEventDestinations.byId[tweenEvent.destinationArtboard] as em.Artboard;
      const tweenEventDestinationArtboardPaperLayer = paperTweenEventDestinationsById[tweenEvent.destinationArtboard];
      const tweenEventPaperLayer = paperTweenEventLayersById[tweenEvent.layer];
      const tweenEventTweensById = tweenEvent.tweens.reduce((result: { [id: string]: em.Tween }, current): {[id: string]: em.Tween} => {
        result[current] = tweens.byId[current];
        return result;
      }, {});
      // create event timeline and add it to global timelines
      timelines[eventId] = gsap.timeline({
        paused: true,
        onStart: () => {
          setPlaying(true);
        },
        onComplete: () => {
          setPlaying(false);
          setActiveArtboard({id: tweenEvent.destinationArtboard, scope: 2});
        }
      });
      // add tweens to event timeline
      if (tweenEvent.tweens.length > 0) {
        tweenEventPaperLayer.off(tweenEvent.event as any);
        Object.keys(tweenEventTweensById).forEach((tweenId) => {
          timelineProps[tweenId] = {};
          const tween = tweenEventTweensById[tweenId];
          const tweenLayer = tweenLayers.byId[tween.layer];
          const tweenPaperLayer = paperTweenLayersById[tween.layer];
          const tweenPaperLayerArtboardPosition = getPositionInArtboard(tweenLayer, tweenEventArtboard);
          const tweenDestinationLayer = tweenLayerDestinations.byId[tween.destinationLayer];
          const tweenDestinationLayerPaperLayer = paperTweenLayerDestinationsById[tween.destinationLayer];
          const tweenDestinationLayerArtboardPosition = getPositionInArtboard(tweenDestinationLayer, tweenEventDestinationArtboard);
          const tweenPaperLayerPositionDiffX = tweenDestinationLayerArtboardPosition.x - tweenPaperLayerArtboardPosition.x;
          const tweenPaperLayerPositionDiffY = tweenDestinationLayerArtboardPosition.y - tweenPaperLayerArtboardPosition.y;
          const isOriginLayerLine = tweenLayer.type === 'Shape' && (tweenLayer as em.Shape).shapeType === 'Line';
          const isDestinationLayerLine = tweenDestinationLayer.type === 'Shape' && (tweenDestinationLayer as em.Shape).shapeType === 'Line';
          const updateGradients = () => {
            if (tweenPaperLayer.fillColor && tweenPaperLayer.fillColor.gradient) {
              const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : (isOriginLayerLine ? tweenLayer.frame.width : tweenLayer.frame.innerWidth);
              const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : (isOriginLayerLine ? tweenLayer.frame.height : tweenLayer.frame.innerHeight);
              const origin = tweenPaperLayer.data.fillGradientOrigin ? tweenPaperLayer.data.fillGradientOrigin : tweenLayer.style.fill.gradient.origin;
              const destination = tweenPaperLayer.data.fillGradientDestination ? tweenPaperLayer.data.fillGradientDestination : tweenLayer.style.fill.gradient.destination;
              const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + tweenPaperLayer.position.x, (origin.y * innerHeight) + tweenPaperLayer.position.y);
              const nextDestination = new paperPreview.Point((destination.x * innerWidth) + tweenPaperLayer.position.x, (destination.y * innerHeight) + tweenPaperLayer.position.y);
              (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
              (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
            }
            if (tweenPaperLayer.strokeColor && tweenPaperLayer.strokeColor.gradient) {
              const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : (isOriginLayerLine ? tweenLayer.frame.width : tweenLayer.frame.innerWidth);
              const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : (isOriginLayerLine ? tweenLayer.frame.height : tweenLayer.frame.innerHeight);
              const origin = tweenPaperLayer.data.strokeGradientOrigin ? tweenPaperLayer.data.strokeGradientOrigin : tweenLayer.style.fill.gradient.origin;
              const destination = tweenPaperLayer.data.strokeGradientDestination ? tweenPaperLayer.data.strokeGradientDestination : tweenLayer.style.stroke.gradient.destination;
              const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + tweenPaperLayer.position.x, (origin.y * innerHeight) + tweenPaperLayer.position.y);
              const nextDestination = new paperPreview.Point((destination.x * innerWidth) + tweenPaperLayer.position.x, (destination.y * innerHeight) + tweenPaperLayer.position.y);
              (tweenPaperLayer.strokeColor as em.PaperGradientFill).origin = nextOrigin;
              (tweenPaperLayer.strokeColor as em.PaperGradientFill).destination = nextDestination;
            }
          }
          const setFillGradientOrigin = () => {
            timelineProps[tweenId][`${tween.prop}-origin-x`] = tweenLayer.style.fill.gradient.origin.x;
            timelineProps[tweenId][`${tween.prop}-origin-y`] = tweenLayer.style.fill.gradient.origin.y;
            timelines[eventId].to(timelineProps[tweenId], {
              duration: tween.duration,
              [`${tween.prop}-origin-x`]: tweenDestinationLayer.style.fill.gradient.origin.x,
              [`${tween.prop}-origin-y`]: tweenDestinationLayer.style.fill.gradient.origin.y,
              onUpdate: () => {
                const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                const nextOriginX = timelineProps[tweenId][`${tween.prop}-origin-x`];
                const nextOriginY = timelineProps[tweenId][`${tween.prop}-origin-y`];
                const nextOrigin = new paperPreview.Point((nextOriginX * innerWidth) + tweenPaperLayer.position.x, (nextOriginY * innerHeight) + tweenPaperLayer.position.y);
                (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
                tweenPaperLayer.data.fillGradientOrigin = { x: nextOriginX, y: nextOriginY };
              },
              ease: tween.ease,
            }, tween.delay);
          }
          const setFillGradientDestination = () => {
            timelineProps[tweenId][`${tween.prop}-destination-x`] = tweenLayer.style.fill.gradient.destination.x;
            timelineProps[tweenId][`${tween.prop}-destination-y`] = tweenLayer.style.fill.gradient.destination.y;
            timelines[eventId].to(timelineProps[tweenId], {
              duration: tween.duration,
              [`${tween.prop}-destination-x`]: tweenDestinationLayer.style.fill.gradient.destination.x,
              [`${tween.prop}-destination-y`]: tweenDestinationLayer.style.fill.gradient.destination.y,
              onUpdate: () => {
                const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                const nextDestinationX = timelineProps[tweenId][`${tween.prop}-destination-x`];
                const nextDestinationY = timelineProps[tweenId][`${tween.prop}-destination-y`];
                const nextDestination = new paperPreview.Point((nextDestinationX * innerWidth) + tweenPaperLayer.position.x, (nextDestinationY * innerHeight) + tweenPaperLayer.position.y);
                (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
                tweenPaperLayer.data.fillGradientDestination = { x: nextDestinationX, y: nextDestinationY };
              },
              ease: tween.ease,
            }, tween.delay);
          }
          const setStrokeGradientOrigin = () => {
            timelineProps[tweenId][`${tween.prop}-origin-x`] = tweenLayer.style.stroke.gradient.origin.x;
            timelineProps[tweenId][`${tween.prop}-origin-y`] = tweenLayer.style.stroke.gradient.origin.y;
            timelines[eventId].to(timelineProps[tweenId], {
              duration: tween.duration,
              [`${tween.prop}-origin-x`]: tweenDestinationLayer.style.stroke.gradient.origin.x,
              [`${tween.prop}-origin-y`]: tweenDestinationLayer.style.stroke.gradient.origin.y,
              onUpdate: () => {
                const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : (tweenLayer.type === 'Shape' && (tweenLayer as em.Shape).shapeType === 'Line' ? tweenLayer.frame.width : tweenLayer.frame.innerWidth);
                const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : (tweenLayer.type === 'Shape' && (tweenLayer as em.Shape).shapeType === 'Line' ? tweenLayer.frame.height : tweenLayer.frame.innerHeight);
                const nextOriginX = timelineProps[tweenId][`${tween.prop}-origin-x`];
                const nextOriginY = timelineProps[tweenId][`${tween.prop}-origin-y`];
                const nextOrigin = new paperPreview.Point((nextOriginX * innerWidth) + tweenPaperLayer.position.x, (nextOriginY * innerHeight) + tweenPaperLayer.position.y);
                (tweenPaperLayer.strokeColor as em.PaperGradientFill).origin = nextOrigin;
                tweenPaperLayer.data.strokeGradientOrigin = { x: nextOriginX, y: nextOriginY };
              },
              ease: tween.ease,
            }, tween.delay);
          }
          const setStrokeGradientDestination = () => {
            timelineProps[tweenId][`${tween.prop}-destination-x`] = tweenLayer.style.stroke.gradient.destination.x;
            timelineProps[tweenId][`${tween.prop}-destination-y`] = tweenLayer.style.stroke.gradient.destination.y;
            timelines[eventId].to(timelineProps[tweenId], {
              duration: tween.duration,
              [`${tween.prop}-destination-x`]: tweenDestinationLayer.style.stroke.gradient.destination.x,
              [`${tween.prop}-destination-y`]: tweenDestinationLayer.style.stroke.gradient.destination.y,
              onUpdate: () => {
                const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : (tweenLayer.type === 'Shape' && (tweenLayer as em.Shape).shapeType === 'Line' ? tweenLayer.frame.width : tweenLayer.frame.innerWidth);
                const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : (tweenLayer.type === 'Shape' && (tweenLayer as em.Shape).shapeType === 'Line' ? tweenLayer.frame.height : tweenLayer.frame.innerHeight);
                const nextDestinationX = timelineProps[tweenId][`${tween.prop}-destination-x`];
                const nextDestinationY = timelineProps[tweenId][`${tween.prop}-destination-y`];
                const nextDestination = new paperPreview.Point((nextDestinationX * innerWidth) + tweenPaperLayer.position.x, (nextDestinationY * innerHeight) + tweenPaperLayer.position.y);
                (tweenPaperLayer.strokeColor as em.PaperGradientFill).destination = nextDestination;
                tweenPaperLayer.data.strokeGradientDestination = { x: nextDestinationX, y: nextDestinationY };
              },
              ease: tween.ease,
            }, tween.delay);
          }
          switch(tween.prop) {
            case 'image': {
              const beforeRaster = tweenPaperLayer.getItem({data: {id: 'Raster'}}) as paper.Raster;
              const destinationRaster = tweenDestinationLayerPaperLayer.getItem({data: {id: 'Raster'}}) as paper.Raster;
              const afterRaster = beforeRaster.clone({insert: false}) as paper.Raster;
              afterRaster.source = destinationRaster.source;
              afterRaster.bounds = beforeRaster.bounds;
              afterRaster.position = beforeRaster.position;
              afterRaster.opacity = 0;
              afterRaster.parent = beforeRaster.parent;
              timelineProps[tweenId][`${tween.prop}-before`] = 1;
              timelineProps[tweenId][`${tween.prop}-after`] = 0;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [`${tween.prop}-before`]: 0,
                [`${tween.prop}-after`]: 1,
                onUpdate: () => {
                  beforeRaster.opacity = timelineProps[tweenId][`${tween.prop}-before`];
                  afterRaster.opacity = timelineProps[tweenId][`${tween.prop}-after`];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'shape': {
              // get shapes without rotation
              const tweenPaperLayerClone = tweenPaperLayer.clone({insert: false});
              const tweenDestinationLayerPaperLayerClone = tweenDestinationLayerPaperLayer.clone({insert: false});
              tweenPaperLayerClone.rotation = -tweenLayer.transform.rotation;
              tweenDestinationLayerPaperLayerClone.rotation = -tweenDestinationLayer.transform.rotation;
              // get morph data
              const morphData = [
                (tweenPaperLayerClone as paper.Path).pathData,
                (tweenDestinationLayerPaperLayerClone as paper.Path).pathData
              ];
              MorphSVGPlugin.pathFilter(morphData);
              timelineProps[tweenId][tween.prop] = morphData[0];
              // set tween
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: morphData[1],
                onUpdate: function() {
                  const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                  const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                  const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                  const startPosition = tweenPaperLayer.position;
                  tweenPaperLayer.rotation = -startRotation;
                  // apply final clone path data to tweenPaperLayer
                  (tweenPaperLayer as paper.Path).pathData = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.bounds.width = innerWidth;
                  tweenPaperLayer.bounds.height = innerHeight;
                  tweenPaperLayer.rotation = startRotation;
                  tweenPaperLayer.position = startPosition;
                  // update fill gradient origin/destination if needed
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'fill': {
              // color fill to color fill
              if (
                tweenPaperLayer.fillColor &&
                (tweenPaperLayer.fillColor.type === 'rgb' || tweenPaperLayer.fillColor.type === 'hsl') &&
                tweenDestinationLayerPaperLayer.fillColor &&
                (tweenDestinationLayerPaperLayer.fillColor.type === 'rgb' || tweenDestinationLayerPaperLayer.fillColor.type === 'hsl')
              ) {
                timelineProps[tweenId][tween.prop] = tweenPaperLayer.fillColor.toCSS(true);
                timelines[eventId].to(timelineProps[tweenId], {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                  onUpdate: () => {
                    tweenPaperLayer.fillColor = timelineProps[tweenId][tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
              // no fill to color fill
              } else if (
                !tweenPaperLayer.fillColor &&
                tweenDestinationLayerPaperLayer.fillColor &&
                (tweenDestinationLayerPaperLayer.fillColor.type === 'rgb' || tweenDestinationLayerPaperLayer.fillColor.type === 'hsl')
              ) {
                const c2 = tweenDestinationLayerPaperLayer.fillColor.toCSS(true);
                timelineProps[tweenId][tween.prop] = new paperPreview.Color(tinyColor(c2).setAlpha(0).toHex8String()).toCSS(true);
                timelines[eventId].to(timelineProps[tweenId], {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                  onUpdate: () => {
                    tweenPaperLayer.fillColor = timelineProps[tweenId][tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
              // color fill to no fill
              } else if (
                tweenPaperLayer.fillColor &&
                !tweenDestinationLayerPaperLayer.fillColor &&
                (tweenPaperLayer.fillColor.type === 'rgb' || tweenPaperLayer.fillColor.type === 'hsl')
              ) {
                timelineProps[tweenId][tween.prop] = tweenPaperLayer.fillColor.alpha;
                timelines[eventId].to(timelineProps[tweenId], {
                  duration: tween.duration,
                  [tween.prop]: 0,
                  onUpdate: () => {
                    tweenPaperLayer.fillColor.alpha = timelineProps[tweenId][tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
              // gradient fill to gradient fill
              } else if (
                tweenPaperLayer.fillColor &&
                tweenPaperLayer.fillColor.type === 'gradient' &&
                tweenDestinationLayerPaperLayer.fillColor &&
                tweenDestinationLayerPaperLayer.fillColor.type === 'gradient'
              ) {
                // origin
                setFillGradientOrigin();
                // destination
                setFillGradientDestination();
                // stops
                const layerStopCount = tweenPaperLayer.fillColor.gradient.stops.length;
                const destinationStopCount = tweenDestinationLayerPaperLayer.fillColor.gradient.stops.length;
                if (destinationStopCount > layerStopCount) {
                  const diff = destinationStopCount - layerStopCount;
                  for (let i = 0; i < diff; i++) {
                    const test = tweenPaperLayer.fillColor.gradient.stops[0].clone();
                    tweenPaperLayer.fillColor.gradient.stops.push(test);
                  }
                }
                tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                  const closestDestinationStop = tweenDestinationLayerPaperLayer.fillColor.gradient.stops.reduce((result, current) => {
                    return (Math.abs(current.offset - stop.offset) < Math.abs(result.offset - stop.offset) ? current : result);
                  });
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.toCSS(true);
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-offset`] = tweenPaperLayer.fillColor.gradient.stops[index].offset;
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.toCSS(true) : closestDestinationStop.color.toCSS(true),
                    [`${tween.prop}-stop-${index}-offset`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].offset : closestDestinationStop.offset,
                    onUpdate: () => {
                      tweenPaperLayer.fillColor.gradient.stops[index].color = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                      tweenPaperLayer.fillColor.gradient.stops[index].offset = timelineProps[tweenId][`${tween.prop}-stop-${index}-offset`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              // gradient fill to color fill
              } else if (
                tweenPaperLayer.fillColor &&
                tweenPaperLayer.fillColor.type === 'gradient' &&
                tweenDestinationLayerPaperLayer.fillColor &&
                (tweenDestinationLayerPaperLayer.fillColor.type === 'rgb' || tweenDestinationLayerPaperLayer.fillColor.type === 'hsl')
              ) {
                // origin
                setFillGradientOrigin();
                // destination
                setFillGradientDestination();
                // stops
                tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.toCSS(true);
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.fillColor.gradient.stops[index].color = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease
                  }, tween.delay);
                });
              // color fill to gradient fill
              } else if (
                tweenPaperLayer.fillColor &&
                (tweenPaperLayer.fillColor.type === 'rgb' || tweenPaperLayer.fillColor.type === 'hsl') &&
                tweenDestinationLayerPaperLayer.fillColor &&
                tweenDestinationLayerPaperLayer.fillColor.type === 'gradient'
              ) {
                tweenPaperLayer.fillColor = {
                  gradient: {
                    stops: tweenDestinationLayer.style.fill.gradient.stops.map((stop) => {
                      return new paperPreview.GradientStop(
                        new paperPreview.Color(tweenPaperLayer.fillColor.toCSS(true)),
                        stop.position
                      );
                    }),
                    radial: tweenDestinationLayerPaperLayer.fillColor.gradient.radial
                  },
                  origin: new paperPreview.Point((tweenDestinationLayer.style.fill.gradient.origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.fill.gradient.origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y),
                  destination: new paperPreview.Point((tweenDestinationLayer.style.fill.gradient.destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.fill.gradient.destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y)
                } as em.PaperGradientFill;
                // origin
                setFillGradientOrigin();
                // destination
                setFillGradientDestination();
                // stops
                tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.toCSS(true);
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.fillColor.gradient.stops[index].color = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              // gradient fill to no fill
              } else if (
                tweenPaperLayer.fillColor &&
                tweenPaperLayer.fillColor.type === 'gradient' &&
                !tweenDestinationLayerPaperLayer.fillColor
              ) {
                // origin
                setFillGradientOrigin();
                // destination
                setFillGradientDestination();
                // stops
                tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.alpha;
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: 0,
                    onUpdate: () => {
                      tweenPaperLayer.fillColor.gradient.stops[index].color.alpha = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              // no fill to gradient fill
              } else if (
                !tweenPaperLayer.fillColor &&
                tweenDestinationLayerPaperLayer.fillColor &&
                tweenDestinationLayerPaperLayer.fillColor.type === 'gradient'
              ) {
                tweenPaperLayer.fillColor = {
                  gradient: {
                    stops: tweenDestinationLayer.style.fill.gradient.stops.map((stop) => {
                      const stopColor = stop.color;
                      return new paperPreview.GradientStop({hue: stopColor.h, saturation: stopColor.s, lightness: stopColor.l, alpha: 0} as paper.Color, stop.position);
                    }),
                    radial: tweenDestinationLayerPaperLayer.fillColor.gradient.radial
                  },
                  origin: new paperPreview.Point((tweenDestinationLayer.style.fill.gradient.origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.fill.gradient.origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y),
                  destination: new paperPreview.Point((tweenDestinationLayer.style.fill.gradient.destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.fill.gradient.destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y)
                } as em.PaperGradientFill;
                // origin
                setFillGradientOrigin();
                // destination
                setFillGradientDestination();
                // stops
                tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.alpha;
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.alpha,
                    onUpdate: () => {
                      tweenPaperLayer.fillColor.gradient.stops[index].color.alpha = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              }
              break;
            }
            case 'stroke': {
              // color stroke to color stroke
              if (
                tweenPaperLayer.strokeColor &&
                (tweenPaperLayer.strokeColor.type === 'rgb' || tweenPaperLayer.strokeColor.type === 'hsl') &&
                tweenDestinationLayerPaperLayer.strokeColor &&
                (tweenDestinationLayerPaperLayer.strokeColor.type === 'rgb' || tweenDestinationLayerPaperLayer.strokeColor.type === 'hsl')
              ) {
                timelineProps[tweenId][tween.prop] = tweenPaperLayer.strokeColor.toCSS(true);
                timelines[eventId].to(timelineProps[tweenId], {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                  onUpdate: () => {
                    tweenPaperLayer.strokeColor = timelineProps[tweenId][tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
              // no stroke to color stroke
              } else if (
                !tweenPaperLayer.strokeColor &&
                tweenDestinationLayerPaperLayer.strokeColor &&
                (tweenDestinationLayerPaperLayer.strokeColor.type === 'rgb' || tweenDestinationLayerPaperLayer.strokeColor.type === 'hsl')
              ) {
                const c2 = tweenDestinationLayerPaperLayer.strokeColor.toCSS(true);
                timelineProps[tweenId][tween.prop] = new paperPreview.Color(tinyColor(c2).setAlpha(0).toHex8String()).toCSS(true);
                timelines[eventId].to(timelineProps[tweenId], {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                  onUpdate: () => {
                    tweenPaperLayer.strokeColor = timelineProps[tweenId][tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
              // color stroke to no stroke
              } else if (
                tweenPaperLayer.strokeColor &&
                !tweenDestinationLayerPaperLayer.strokeColor &&
                (tweenPaperLayer.strokeColor.type === 'rgb' || tweenPaperLayer.strokeColor.type === 'hsl')
              ) {
                timelineProps[tweenId][tween.prop] = tweenPaperLayer.strokeColor.alpha;
                timelines[eventId].to(timelineProps[tweenId], {
                  duration: tween.duration,
                  [tween.prop]: 0,
                  onUpdate: () => {
                    tweenPaperLayer.strokeColor.alpha = timelineProps[tweenId][tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
              // gradient stroke to gradient stroke
              } else if (
                tweenPaperLayer.strokeColor &&
                tweenPaperLayer.strokeColor.type === 'gradient' &&
                tweenDestinationLayerPaperLayer.strokeColor &&
                tweenDestinationLayerPaperLayer.strokeColor.type === 'gradient'
              ) {
                // origin
                setStrokeGradientOrigin();
                // destination
                setStrokeGradientDestination();
                // stops
                const layerStopCount = tweenPaperLayer.strokeColor.gradient.stops.length;
                const destinationStopCount = tweenDestinationLayerPaperLayer.strokeColor.gradient.stops.length;
                if (destinationStopCount > layerStopCount) {
                  const diff = destinationStopCount - layerStopCount;
                  for (let i = 0; i < diff; i++) {
                    const test = tweenPaperLayer.strokeColor.gradient.stops[0].clone();
                    tweenPaperLayer.strokeColor.gradient.stops.push(test);
                  }
                }
                tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                  const closestDestinationStop = tweenDestinationLayerPaperLayer.strokeColor.gradient.stops.reduce((result, current) => {
                    return (Math.abs(current.offset - stop.offset) < Math.abs(result.offset - stop.offset) ? current : result);
                  });
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true);
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-offset`] = tweenPaperLayer.strokeColor.gradient.stops[index].offset;
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true) : closestDestinationStop.color.toCSS(true),
                    [`${tween.prop}-stop-${index}-offset`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].offset : closestDestinationStop.offset,
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor.gradient.stops[index].color = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                      tweenPaperLayer.strokeColor.gradient.stops[index].offset = timelineProps[tweenId][`${tween.prop}-stop-${index}-offset`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              // gradient stroke to color stroke
              } else if (
                tweenPaperLayer.strokeColor &&
                tweenPaperLayer.strokeColor.type === 'gradient' &&
                tweenDestinationLayerPaperLayer.strokeColor &&
                (tweenDestinationLayerPaperLayer.strokeColor.type === 'rgb' || tweenDestinationLayerPaperLayer.strokeColor.type === 'hsl')
              ) {
                // origin
                setStrokeGradientOrigin();
                // destination
                setStrokeGradientDestination();
                // stops
                tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true);
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor.gradient.stops[index].color = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              // color stroke to gradient stroke
              } else if (
                tweenPaperLayer.strokeColor &&
                (tweenPaperLayer.strokeColor.type === 'rgb' || tweenPaperLayer.strokeColor.type === 'hsl') &&
                tweenDestinationLayerPaperLayer.strokeColor &&
                tweenDestinationLayerPaperLayer.strokeColor.type === 'gradient'
              ) {
                // set stroke color to gradient with all stops as the origin color
                tweenPaperLayer.strokeColor = {
                  gradient: {
                    stops: tweenDestinationLayer.style.stroke.gradient.stops.map((stop) => {
                      return new paperPreview.GradientStop(
                        new paperPreview.Color(tweenPaperLayer.strokeColor.toCSS(true)),
                        stop.position
                      );
                    }),
                    radial: tweenDestinationLayerPaperLayer.strokeColor.gradient.radial
                  },
                  origin: new paperPreview.Point((tweenDestinationLayer.style.stroke.gradient.origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.stroke.gradient.origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y),
                  destination: new paperPreview.Point((tweenDestinationLayer.style.stroke.gradient.destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.stroke.gradient.destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y)
                } as em.PaperGradientFill;
                // origin
                setStrokeGradientOrigin();
                // destination
                setStrokeGradientDestination();
                // stops
                tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true);
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor.gradient.stops[index].color = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              // gradient stroke to no stroke
              } else if (
                tweenPaperLayer.strokeColor &&
                tweenPaperLayer.strokeColor.type === 'gradient' &&
                !tweenDestinationLayerPaperLayer.strokeColor
              ) {
                // origin
                setStrokeGradientOrigin();
                // destination
                setStrokeGradientDestination();
                // stops
                tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha;
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: 0,
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              // no stroke to gradient stroke
              } else if (
                !tweenPaperLayer.strokeColor &&
                tweenDestinationLayerPaperLayer.strokeColor &&
                tweenDestinationLayerPaperLayer.strokeColor.type === 'gradient'
              ) {
                // set stroke color to gradient with opaque destination stops
                tweenPaperLayer.strokeColor = {
                  gradient: {
                    stops: tweenDestinationLayer.style.stroke.gradient.stops.map((stop) => {
                      const stopColor = stop.color;
                      return new paperPreview.GradientStop({hue: stopColor.h, saturation: stopColor.s, lightness: stopColor.l, alpha: 0} as paper.Color, stop.position);
                    }),
                    radial: tweenDestinationLayerPaperLayer.strokeColor.gradient.radial
                  },
                  origin: new paperPreview.Point((tweenDestinationLayer.style.stroke.gradient.origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.stroke.gradient.origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y),
                  destination: new paperPreview.Point((tweenDestinationLayer.style.stroke.gradient.destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (tweenDestinationLayer.style.stroke.gradient.destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y)
                } as em.PaperGradientFill;
                // origin
                setStrokeGradientOrigin();
                // destination
                setStrokeGradientDestination();
                // stops
                tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                  timelineProps[tweenId][`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha;
                  timelines[eventId].to(timelineProps[tweenId], {
                    duration: tween.duration,
                    [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.alpha,
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha = timelineProps[tweenId][`${tween.prop}-stop-${index}-color`];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                });
              }
              break;
            }
            case 'dashOffset': {
              timelineProps[tweenId][tween.prop] = tweenPaperLayer.dashOffset;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.dashOffset,
                onUpdate: () => {
                  tweenPaperLayer.dashOffset = timelineProps[tweenId][tween.prop];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'dashArrayWidth': {
              timelineProps[tweenId][tween.prop] = tweenPaperLayer.dashArray[0];
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.dashArray[0],
                onUpdate: () => {
                  tweenPaperLayer.dashArray = [timelineProps[tweenId][tween.prop], tweenPaperLayer.dashArray[1]];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'dashArrayGap': {
              timelineProps[tweenId][tween.prop] = tweenPaperLayer.dashArray[1];
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.dashArray[1],
                onUpdate: () => {
                  tweenPaperLayer.dashArray = [tweenPaperLayer.dashArray[0], timelineProps[tweenId][tween.prop]];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'strokeWidth': {
              timelineProps[tweenId][tween.prop] = tweenPaperLayer.strokeWidth;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.strokeWidth,
                onUpdate: () => {
                  tweenPaperLayer.strokeWidth = timelineProps[tweenId][tween.prop];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'x': {
              timelineProps[tweenId][tween.prop] = tweenPaperLayer.position.x;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: `+=${tweenPaperLayerPositionDiffX}`,
                onUpdate: () => {
                  tweenPaperLayer.position.x = timelineProps[tweenId][tween.prop];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'y': {
              timelineProps[tweenId][tween.prop] = tweenPaperLayer.position.y;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: `+=${tweenPaperLayerPositionDiffY}`,
                onUpdate: () => {
                  tweenPaperLayer.position.y = timelineProps[tweenId][tween.prop];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'width': {
              timelineProps[tweenId][tween.prop] = tweenLayer.frame.innerWidth;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayer.frame.innerWidth,
                onUpdate: () => {
                  const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                  const startPosition = tweenPaperLayer.position;
                  tweenPaperLayer.rotation = -startRotation;
                  tweenPaperLayer.bounds.width = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerWidth = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.rotation = startRotation;
                  tweenPaperLayer.position = startPosition;
                  if (tweenLayer.type === 'Shape' && (tweenLayer as em.Shape).shapeType === 'Rounded') {
                    tweenPaperLayer.rotation = -startRotation;
                    const newShape = new paperPreview.Path.Rectangle({
                      from: tweenPaperLayer.bounds.topLeft,
                      to: tweenPaperLayer.bounds.bottomRight,
                      radius: (Math.max(tweenPaperLayer.bounds.width, tweenPaperLayer.bounds.height) / 2) * (tweenLayer as em.Rounded).radius,
                      insert: false
                    });
                    (tweenPaperLayer as paper.Path).pathData = newShape.pathData;
                    tweenPaperLayer.rotation = startRotation;
                  }
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'height': {
              timelineProps[tweenId][tween.prop] = tweenLayer.frame.innerHeight;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayer.frame.innerHeight,
                onUpdate: () => {
                  const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                  const startPosition = tweenPaperLayer.position;
                  tweenPaperLayer.rotation = -startRotation;
                  tweenPaperLayer.bounds.height = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerHeight = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.rotation = startRotation;
                  tweenPaperLayer.position = startPosition;
                  if (tweenLayer.type === 'Shape' && (tweenLayer as em.Shape).shapeType === 'Rounded') {
                    tweenPaperLayer.rotation = -startRotation;
                    const newShape = new paperPreview.Path.Rectangle({
                      from: tweenPaperLayer.bounds.topLeft,
                      to: tweenPaperLayer.bounds.bottomRight,
                      radius: (Math.max(tweenPaperLayer.bounds.width, tweenPaperLayer.bounds.height) / 2) * (tweenLayer as em.Rounded).radius,
                      insert: false
                    });
                    (tweenPaperLayer as paper.Path).pathData = newShape.pathData;
                    tweenPaperLayer.rotation = startRotation;
                  }
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'rotation': {
              timelineProps[tweenId][tween.prop] = tweenLayer.transform.rotation;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayer.transform.rotation,
                onUpdate: () => {
                  const startPosition = tweenPaperLayer.position;
                  const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                  tweenPaperLayer.rotation = -startRotation;
                  tweenPaperLayer.rotation = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.rotation = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.position = startPosition;
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'shadowColor': {
              const originShadow = tweenLayer.style.shadow;
              const destinationShadow = tweenDestinationLayer.style.shadow;
              let osc = tweenLayer.style.shadow.color;
              let dsc = tweenDestinationLayer.style.shadow.color;
              if (originShadow.enabled && !destinationShadow.enabled) {
                dsc = {h: dsc.h, s: dsc.s, l: dsc.l, a: 0} as em.Color;
              }
              if (!originShadow.enabled && destinationShadow.enabled) {
                osc = {h: osc.h, s: osc.s, l: osc.l, a: 0} as em.Color;
              }
              timelineProps[tweenId][tween.prop] = tinyColor({h: osc.h, s: osc.s, l: osc.l, a: osc.a}).toHslString();
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tinyColor({h: dsc.h, s: dsc.s, l: dsc.l, a: dsc.a}).toHslString(),
                onUpdate: () => {
                  tweenPaperLayer.shadowColor = timelineProps[tweenId][tween.prop];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'shadowOffsetX': {
              const originShadow = tweenLayer.style.shadow;
              const destinationShadow = tweenDestinationLayer.style.shadow;
              let osx = tweenLayer.style.shadow.offset.x;
              let dsx = tweenDestinationLayer.style.shadow.offset.x;
              if (originShadow.enabled && !destinationShadow.enabled) {
                dsx = 0;
              }
              if (!originShadow.enabled && destinationShadow.enabled) {
                osx = 0;
              }
              timelineProps[tweenId][tween.prop] = osx;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: dsx,
                onUpdate: () => {
                  tweenPaperLayer.shadowOffset = new paperPreview.Point(timelineProps[tweenId][tween.prop], tweenPaperLayer.shadowOffset.y);
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'shadowOffsetY': {
              const originShadow = tweenLayer.style.shadow;
              const destinationShadow = tweenDestinationLayer.style.shadow;
              let osy = tweenLayer.style.shadow.offset.y;
              let dsy = tweenDestinationLayer.style.shadow.offset.y;
              if (originShadow.enabled && !destinationShadow.enabled) {
                dsy = 0;
              }
              if (!originShadow.enabled && destinationShadow.enabled) {
                osy = 0;
              }
              timelineProps[tweenId][tween.prop] = osy;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: dsy,
                onUpdate: () => {
                  tweenPaperLayer.shadowOffset = new paperPreview.Point(tweenPaperLayer.shadowOffset.x, timelineProps[tweenId][tween.prop]);
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'shadowBlur': {
              const originShadow = tweenLayer.style.shadow;
              const destinationShadow = tweenDestinationLayer.style.shadow;
              let osb = tweenLayer.style.shadow.blur;
              let dsb = tweenDestinationLayer.style.shadow.blur;
              if (originShadow.enabled && !destinationShadow.enabled) {
                dsb = 0;
              }
              if (!originShadow.enabled && destinationShadow.enabled) {
                osb = 0;
              }
              timelineProps[tweenId][tween.prop] = osb;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: dsb,
                onUpdate: () => {
                  tweenPaperLayer.shadowBlur = timelineProps[tweenId][tween.prop];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'opacity': {
              timelineProps[tweenId][tween.prop] = tweenPaperLayer.opacity;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: tweenDestinationLayerPaperLayer.opacity,
                onUpdate: () => {
                  tweenPaperLayer.opacity = timelineProps[tweenId][tween.prop];
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'fontSize': {
              timelineProps[tweenId][tween.prop] = (tweenPaperLayer as paper.PointText).fontSize;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: (tweenDestinationLayerPaperLayer as paper.PointText).fontSize,
                onUpdate: () => {
                  (tweenPaperLayer as paper.PointText).fontSize = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerWidth = tweenPaperLayer.bounds.width;
                  tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'lineHeight': {
              timelineProps[tweenId][tween.prop] = (tweenPaperLayer as paper.PointText).leading;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: (tweenDestinationLayerPaperLayer as paper.PointText).leading,
                onUpdate: () => {
                  (tweenPaperLayer as paper.PointText).leading = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'fromX': {
              const pla = ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x;
              const plb = ((tweenDestinationLayerPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x;
              const relativeA = pla - tweenEventArtboardPaperLayer.position.x;
              const relativeB = plb - tweenEventDestinationArtboardPaperLayer.position.x;
              const diff = relativeB - relativeA;
              timelineProps[tweenId][tween.prop] = pla;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: `+=${diff}`,
                onUpdate: () => {
                  ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerWidth = tweenPaperLayer.bounds.width;
                  tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'fromY': {
              const pla = ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y;
              const plb = ((tweenDestinationLayerPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y;
              const relativeA = pla - tweenEventArtboardPaperLayer.position.y;
              const relativeB = plb - tweenEventDestinationArtboardPaperLayer.position.y;
              const diff = relativeB - relativeA;
              timelineProps[tweenId][tween.prop] = pla;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: `+=${diff}`,
                onUpdate: () => {
                  ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerWidth = tweenPaperLayer.bounds.width;
                  tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'toX': {
              const pla = ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x;
              const plb = ((tweenDestinationLayerPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x;
              const relativeA = pla - tweenEventArtboardPaperLayer.position.x;
              const relativeB = plb - tweenEventDestinationArtboardPaperLayer.position.x;
              const diff = relativeB - relativeA;
              timelineProps[tweenId][tween.prop] = pla;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: `+=${diff}`,
                onUpdate: () => {
                  ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerWidth = tweenPaperLayer.bounds.width;
                  tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
            case 'toY': {
              const pla = ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y;
              const plb = ((tweenDestinationLayerPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y;
              const relativeA = pla - tweenEventArtboardPaperLayer.position.y;
              const relativeB = plb - tweenEventDestinationArtboardPaperLayer.position.y;
              const diff = relativeB - relativeA;
              timelineProps[tweenId][tween.prop] = pla;
              timelines[eventId].to(timelineProps[tweenId], {
                duration: tween.duration,
                [tween.prop]: `+=${diff}`,
                onUpdate: () => {
                  ((tweenPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y = timelineProps[tweenId][tween.prop];
                  tweenPaperLayer.data.innerWidth = tweenPaperLayer.bounds.width;
                  tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                  updateGradients();
                },
                ease: tween.ease,
              }, tween.delay);
              break;
            }
          }
        });
      } else {
        setActiveArtboard({id: tweenEvent.destinationArtboard, scope: 2});
      }
      // play timeline on event
      tweenEventPaperLayer.on(tweenEvent.event, (e: paper.MouseEvent | paper.KeyEvent) => {
        timelines[eventId].play();
      });
    });
  }, [paperProject, activeArtboard]);

  return (
    <div
      className={`c-canvas`}
      ref={canvasContainerRef}
      style={{
        cursor: touchCursor ? `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAGqADAAQAAAABAAAAGgAAAABvAZQwAAADhElEQVRIDbWWT0tbQRTFk6hNrbYSFWyphUIWFdy4FFwZd25dKn4R134AP4Lixq0Ll4ILwaXLWLAtNKUVlFCxtol/0vO7fed1jJZCoRduZub+OefOvPfupFj4uxQVUpIyWsnqJHqbzbE/KCT+SQBHH0nLmfZlNg0FwK+krUzbmQ37PXmICBsEgA9MTExUlpeXR2q12tPx8fFHo6OjsavT09PbRqPR2t3dvdjY2Dir1+tNxX+TQnxvh91ErHukT8bGxkZWV1dfLS0tPSuXy9g5KgA81zRiO61Wq7C5uXm+srLy8eTk5Ez2S+mNlJyQlMgkg9PT0y+U+LparfYqigTHMUdMRlEIgKXj4+MbFfbh4ODgs9YX0pzMALJFdQMiebmzs1OtVCr4CPQuTOgqu8lY9zSbzc78/PyxyD5pzVFGcSaKZ6Ljer6/vz+R7MRn7WNTXr4bE5GLMIays5mZmbqO8Yts8czYelSicWhtba06NzfXrznABvfco3epkIhxsaxjPjw83KsTKW9vb5/LBlEHB9qvt2v88PDwjR48uzAY4D4y22QKca53RNHeVVEvSGlqauqt3saG7N/tKPMKi8RV/4L6/WsS/BTSXQyRzmUs8KaCyVRa4q2isnKtVhvM5qxTQD8nE9ivsFzYDX77YswwISqaqI+PMQumeogIRk2QjjLHMTFawPKuwOgRJiR0kyJHB1hJX7zPWsu8MhLwW1Iy5oj9rD1n7GSYwfEQeAQlSXHmyVrTO5L6fRLpGMEQYbyld2XpTmQZ1SR21qlmrtiJd5PnCzOwFdQx0RUNUgYeqr8tJwBgcHw8CzS1mcRjYGSYdPicKLqwDAgEJBAMGKPn3aT4U5vJA4POLn98sDg4shatXh+ZSWTKxTaTGiwtxsGOLdDRwZQjWhBJSJv7hFavuQE8pgTeGbZ4bTXa751HnrC+ZncUF2KAMhJc7mqq7NQdgRi/LABROcIcRSAKEjXV6+6mCgECSJtLi/tErZ51JGlMK2ae2u3L7eSCkV2Avt6jCuXmcqM3pb23t3c9Ozs7pC4MAGIgSKzY7ijXw8LCwvvs4uMu8incI+JIrkX2Y2tr61Kt/vHk5GR/by9v8x0CyExCpy6ur6+fLy4uvjs6OjqRzxeejziSAUnFIPSp7j8nfW5VfIx8J//65yQldMX/7e9WSsbcO/SzYUQ4FivPIj8mnN3yE/4Ik03mkJJbAAAAAElFTkSuQmCC) 12 12, auto` : 'default'
      }}>
      <canvas
        id='canvas-preview'
        ref={canvasRef}
        style={{
          background: theme.background.z0
        }} />
      {
        playing
        ? <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }} />
        : null
      }
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, documentSettings, preview } = state;
  const paperProject = documentSettings.images.allIds.reduce((result, current) => {
    const rasterBase64 = bufferToBase64(Buffer.from(documentSettings.images.byId[current].buffer));
    const base64 = `data:image/webp;base64,${rasterBase64}`;
    return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
  }, layer.present.paperProject);
  const tweenEvents = getAllArtboardTweenEvents(layer.present, layer.present.activeArtboard);
  const tweenEventDestinations = getAllArtboardTweenEventArtboards(layer.present, layer.present.activeArtboard);
  const tweenEventLayers = getAllArtboardTweenEventLayers(layer.present, layer.present.activeArtboard);
  const tweens = getAllArtboardTweens(layer.present, layer.present.activeArtboard);
  const tweenLayers = getAllArtboardTweenLayers(layer.present, layer.present.activeArtboard);
  const tweenLayerDestinations = getAllArtboardTweenLayerDestinations(layer.present, layer.present.activeArtboard);
  const documentImagesById = documentSettings.images.byId;
  const touchCursor = preview.touchCursor;
  return {
    activeArtboard: layer.present.byId[layer.present.activeArtboard],
    page: layer.present.page,
    paperProject,
    tweenEvents,
    tweenEventLayers,
    tweenEventDestinations,
    tweens,
    tweenLayers,
    tweenLayerDestinations,
    documentImagesById,
    touchCursor
  };
};

export default connect(
  mapStateToProps,
  { setActiveArtboard }
)(PreviewCanvas);