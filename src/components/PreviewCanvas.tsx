import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
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
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page, tweenEvents, tweenEventLayers, tweenEventDestinations, tweens, tweenLayers, tweenLayerDestinations, setActiveArtboard, documentImagesById } = props;

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
    // add animation events
    tweenEvents.allIds.forEach((eventId) => {
      const tweenEvent = tweenEvents.byId[eventId];
      const tweenEventArtboard = tweenEventDestinations.byId[tweenEvent.artboard] as em.Artboard;
      const tweenEventDestinationArtboard = tweenEventDestinations.byId[tweenEvent.destinationArtboard] as em.Artboard;
      const tweenEventPaperLayer = paperTweenEventLayersById[tweenEvent.layer];
      const tweenEventTweensById = tweenEvent.tweens.reduce((result: { [id: string]: em.Tween }, current): {[id: string]: em.Tween} => {
        result[current] = tweens.byId[current];
        return result;
      }, {});
      // add tweens for each animation event
      tweenEventPaperLayer.on(tweenEvent.event, (e: paper.MouseEvent | paper.KeyEvent) => {
        if (tweenEvent.tweens.length > 0) {
          tweenEventPaperLayer.off(tweenEvent.event as any);
          const tweenTimeline = gsap.timeline();
          tweenTimeline.then(() => {
            setActiveArtboard({id: tweenEvent.destinationArtboard, scope: 2});
          });
          Object.keys(tweenEventTweensById).forEach((tweenId) => {
            const tweenProp: any = {};
            const tween = tweenEventTweensById[tweenId];
            const tweenLayer = tweenLayers.byId[tween.layer];
            const tweenPaperLayer = paperTweenLayersById[tween.layer];
            const tweenPaperLayerArtboardPosition = getPositionInArtboard(tweenLayer, tweenEventArtboard);
            const tweenDestinationLayer = tweenLayerDestinations.byId[tween.destinationLayer];
            const tweenDestinationLayerPaperLayer = paperTweenLayerDestinationsById[tween.destinationLayer];
            const tweenDestinationLayerArtboardPosition = getPositionInArtboard(tweenDestinationLayer, tweenEventDestinationArtboard);
            const tweenPaperLayerPositionDiffX = tweenDestinationLayerArtboardPosition.x - tweenPaperLayerArtboardPosition.x;
            const tweenPaperLayerPositionDiffY = tweenDestinationLayerArtboardPosition.y - tweenPaperLayerArtboardPosition.y;
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
                tweenProp[`${tween.prop}-before`] = 1;
                tweenProp[`${tween.prop}-after`] = 0;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [`${tween.prop}-before`]: 0,
                  [`${tween.prop}-after`]: 1,
                  onUpdate: () => {
                    beforeRaster.opacity = tweenProp[`${tween.prop}-before`];
                    afterRaster.opacity = tweenProp[`${tween.prop}-after`];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'shape': {
                // clear rotations
                tweenPaperLayer.rotation = -tweenLayer.transform.rotation;
                tweenDestinationLayerPaperLayer.rotation = -tweenDestinationLayer.transform.rotation;
                // get morph data
                const morphData = [
                  (tweenPaperLayer as paper.Path).pathData,
                  (tweenDestinationLayerPaperLayer as paper.Path).pathData
                ];
                MorphSVGPlugin.pathFilter(morphData);
                tweenProp[tween.prop] = morphData[0];
                // reapply rotations
                tweenPaperLayer.rotation = tweenLayer.transform.rotation;
                tweenDestinationLayerPaperLayer.rotation = tweenDestinationLayer.transform.rotation;
                // set tween
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: morphData[1],
                  onUpdate: function() {
                    const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                    const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                    const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                    const startPosition = tweenPaperLayer.position;
                    tweenPaperLayer.rotation = -startRotation;
                    // apply final clone path data to tweenPaperLayer
                    (tweenPaperLayer as paper.Path).pathData = tweenProp[tween.prop];
                    tweenPaperLayer.bounds.width = innerWidth;
                    tweenPaperLayer.bounds.height = innerHeight;
                    tweenPaperLayer.rotation = startRotation;
                    tweenPaperLayer.position = startPosition;
                    // update fill gradient origin/destination if needed
                    if (tweenPaperLayer.fillColor && tweenPaperLayer.fillColor.gradient) {
                      const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                      const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                      const origin = tweenPaperLayer.data.gradientOrigin ? tweenPaperLayer.data.gradientOrigin : tweenLayer.style.fill.gradient.origin;
                      const destination = tweenPaperLayer.data.gradientDestination ? tweenPaperLayer.data.gradientDestination : tweenLayer.style.fill.gradient.destination;
                      const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + tweenPaperLayer.position.x, (origin.y * innerHeight) + tweenPaperLayer.position.y);
                      const nextDestination = new paperPreview.Point((destination.x * innerWidth) + tweenPaperLayer.position.x, (destination.y * innerHeight) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
                    }
                    // if (tweenPaperLayer.strokeColor && tweenPaperLayer.strokeColor.gradient) {
                    //   const origin = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.origin;
                    //   const destination = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.destination;
                    //   (tweenPaperLayer.strokeColor as em.PaperGradientFill).origin = new paperPreview.Point((origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                    //   (tweenPaperLayer.strokeColor as em.PaperGradientFill).destination = new paperPreview.Point((destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                    // }
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
                  tweenProp[tween.prop] = tweenPaperLayer.fillColor.toCSS(true);
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.fillColor = tweenProp[tween.prop];
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
                  tweenProp[tween.prop] = new paperPreview.Color(tinyColor(c2).setAlpha(0).toHex8String()).toCSS(true);
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.fillColor = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                // color fill to no fill
                } else if (
                  tweenPaperLayer.fillColor &&
                  !tweenDestinationLayerPaperLayer.fillColor &&
                  (tweenPaperLayer.fillColor.type === 'rgb' || tweenPaperLayer.fillColor.type === 'hsl')
                ) {
                  tweenProp[tween.prop] = tweenPaperLayer.fillColor.alpha;
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: 0,
                    onUpdate: () => {
                      tweenPaperLayer.fillColor.alpha = tweenProp[tween.prop];
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
                  tweenProp[`${tween.prop}-origin-x`] = tweenLayer.style.fill.gradient.origin.x;
                  tweenProp[`${tween.prop}-origin-y`] = tweenLayer.style.fill.gradient.origin.y;
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [`${tween.prop}-origin-x`]: tweenDestinationLayer.style.fill.gradient.origin.x,
                    [`${tween.prop}-origin-y`]: tweenDestinationLayer.style.fill.gradient.origin.y,
                    onUpdate: () => {
                      const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                      const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                      const nextOriginX = tweenProp[`${tween.prop}-origin-x`];
                      const nextOriginY = tweenProp[`${tween.prop}-origin-y`];
                      const nextOrigin = new paperPreview.Point((nextOriginX * innerWidth) + tweenPaperLayer.position.x, (nextOriginY * innerHeight) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
                      tweenPaperLayer.data.gradientOrigin = { x: nextOriginX, y: nextOriginY };
                    },
                    ease: tween.ease,
                  }, tween.delay);
                  // destination
                  tweenProp[`${tween.prop}-destination-x`] = tweenLayer.style.fill.gradient.destination.x;
                  tweenProp[`${tween.prop}-destination-y`] = tweenLayer.style.fill.gradient.destination.y;
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [`${tween.prop}-destination-x`]: tweenDestinationLayer.style.fill.gradient.destination.x,
                    [`${tween.prop}-destination-y`]: tweenDestinationLayer.style.fill.gradient.destination.y,
                    onUpdate: () => {
                      const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                      const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                      const nextDestinationX = tweenProp[`${tween.prop}-destination-x`];
                      const nextDestinationY = tweenProp[`${tween.prop}-destination-y`];
                      const nextDestination = new paperPreview.Point((nextDestinationX * innerWidth) + tweenPaperLayer.position.x, (nextDestinationY * innerHeight) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
                      tweenPaperLayer.data.gradientDestination = { x: nextDestinationX, y: nextDestinationY };
                    },
                    ease: tween.ease,
                  }, tween.delay);
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
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.toCSS(true);
                    tweenProp[`${tween.prop}-stop-${index}-offset`] = tweenPaperLayer.fillColor.gradient.stops[index].offset;
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.toCSS(true) : closestDestinationStop.color.toCSS(true),
                      [`${tween.prop}-stop-${index}-offset`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].offset : closestDestinationStop.offset,
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                        tweenPaperLayer.fillColor.gradient.stops[index].offset = tweenProp[`${tween.prop}-stop-${index}-offset`];
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
                  tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.toCSS(true);
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
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
                  tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.toCSS(true);
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
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
                  tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.alpha;
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: 0,
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
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
                  tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.alpha;
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.alpha,
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
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
                  tweenProp[tween.prop] = tweenPaperLayer.strokeColor.toCSS(true);
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor = tweenProp[tween.prop];
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
                  tweenProp[tween.prop] = new paperPreview.Color(tinyColor(c2).setAlpha(0).toHex8String()).toCSS(true);
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                  }, tween.delay);
                // color stroke to no stroke
                } else if (
                  tweenPaperLayer.strokeColor &&
                  !tweenDestinationLayerPaperLayer.strokeColor &&
                  (tweenPaperLayer.strokeColor.type === 'rgb' || tweenPaperLayer.strokeColor.type === 'hsl')
                ) {
                  tweenProp[tween.prop] = tweenPaperLayer.strokeColor.alpha;
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: 0,
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor.alpha = tweenProp[tween.prop];
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
                  tweenProp[`${tween.prop}-origin-x`] = tweenLayer.style.stroke.gradient.origin.x;
                  tweenProp[`${tween.prop}-origin-y`] = tweenLayer.style.stroke.gradient.origin.y;
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [`${tween.prop}-origin-x`]: tweenDestinationLayer.style.stroke.gradient.origin.x,
                    [`${tween.prop}-origin-y`]: tweenDestinationLayer.style.stroke.gradient.origin.y,
                    onUpdate: () => {
                      const nextOriginX = tweenProp[`${tween.prop}-origin-x`];
                      const nextOriginY = tweenProp[`${tween.prop}-origin-y`];
                      const nextOrigin = new paperPreview.Point((nextOriginX * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (nextOriginY * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).origin = nextOrigin;
                    },
                    ease: tween.ease,
                  }, tween.delay);
                  // destination
                  tweenProp[`${tween.prop}-destination-x`] = tweenLayer.style.stroke.gradient.destination.x;
                  tweenProp[`${tween.prop}-destination-y`] = tweenLayer.style.stroke.gradient.destination.y;
                  tweenTimeline.to(tweenProp, {
                    duration: tween.duration,
                    [`${tween.prop}-destination-x`]: tweenDestinationLayer.style.stroke.gradient.destination.x,
                    [`${tween.prop}-destination-y`]: tweenDestinationLayer.style.stroke.gradient.destination.y,
                    onUpdate: () => {
                      const nextDestinationX = tweenProp[`${tween.prop}-destination-x`];
                      const nextDestinationY = tweenProp[`${tween.prop}-destination-y`];
                      const nextDestination = new paperPreview.Point((nextDestinationX * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (nextDestinationY * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).destination = nextDestination;
                    },
                    ease: tween.ease,
                  }, tween.delay);
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
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true);
                    tweenProp[`${tween.prop}-stop-${index}-offset`] = tweenPaperLayer.strokeColor.gradient.stops[index].offset;
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true) : closestDestinationStop.color.toCSS(true),
                      [`${tween.prop}-stop-${index}-offset`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].offset : closestDestinationStop.offset,
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                        tweenPaperLayer.strokeColor.gradient.stops[index].offset = tweenProp[`${tween.prop}-stop-${index}-offset`];
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
                  tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true);
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
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
                  tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true);
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
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
                  tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha;
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: 0,
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
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
                  tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha;
                    tweenTimeline.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.alpha,
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                    }, tween.delay);
                  });
                }
                break;
              }
              case 'dashOffset': {
                tweenProp[tween.prop] = tweenPaperLayer.dashOffset;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.dashOffset,
                  onUpdate: () => {
                    tweenPaperLayer.dashOffset = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'dashArrayWidth': {
                tweenProp[tween.prop] = tweenPaperLayer.dashArray[0];
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.dashArray[0],
                  onUpdate: () => {
                    tweenPaperLayer.dashArray = [tweenProp[tween.prop], tweenPaperLayer.dashArray[1]];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'dashArrayGap': {
                tweenProp[tween.prop] = tweenPaperLayer.dashArray[1];
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.dashArray[1],
                  onUpdate: () => {
                    tweenPaperLayer.dashArray = [tweenPaperLayer.dashArray[0], tweenProp[tween.prop]];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'strokeWidth': {
                tweenProp[tween.prop] = tweenPaperLayer.strokeWidth;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.strokeWidth,
                  onUpdate: () => {
                    tweenPaperLayer.strokeWidth = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'x': {
                tweenProp[tween.prop] = tweenPaperLayer.position.x;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: `+=${tweenPaperLayerPositionDiffX}`,
                  onUpdate: () => {
                    tweenPaperLayer.position.x = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'y': {
                tweenProp[tween.prop] = tweenPaperLayer.position.y;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: `+=${tweenPaperLayerPositionDiffY}`,
                  onUpdate: () => {
                    tweenPaperLayer.position.y = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'width': {
                tweenProp[tween.prop] = tweenLayer.frame.innerWidth;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayer.frame.innerWidth,
                  onUpdate: () => {
                    const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                    const startPosition = tweenPaperLayer.position;
                    tweenPaperLayer.rotation = -startRotation;
                    tweenPaperLayer.bounds.width = tweenProp[tween.prop];
                    tweenPaperLayer.data.innerWidth = tweenProp[tween.prop];
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
                tweenProp[tween.prop] = tweenLayer.frame.innerHeight;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayer.frame.innerHeight,
                  onUpdate: () => {
                    const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                    const startPosition = tweenPaperLayer.position;
                    tweenPaperLayer.rotation = -startRotation;
                    tweenPaperLayer.bounds.height = tweenProp[tween.prop];
                    tweenPaperLayer.data.innerHeight = tweenProp[tween.prop];
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
                tweenProp[tween.prop] = tweenLayer.transform.rotation;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayer.transform.rotation,
                  onUpdate: () => {
                    const startPosition = tweenPaperLayer.position;
                    const startRotation = tweenPaperLayer.data.rotation || tweenPaperLayer.data.rotation === 0 ? tweenPaperLayer.data.rotation : tweenLayer.transform.rotation;
                    tweenPaperLayer.rotation = -startRotation;
                    tweenPaperLayer.rotation = tweenProp[tween.prop];
                    tweenPaperLayer.data.rotation = tweenProp[tween.prop];
                    tweenPaperLayer.position = startPosition;
                    if (tweenPaperLayer.fillColor && tweenPaperLayer.fillColor.gradient) {
                      const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                      const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                      const origin = tweenPaperLayer.data.gradientOrigin ? tweenPaperLayer.data.gradientOrigin : tweenLayer.style.fill.gradient.origin;
                      const destination = tweenPaperLayer.data.gradientDestination ? tweenPaperLayer.data.gradientDestination : tweenLayer.style.fill.gradient.destination;
                      const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + tweenPaperLayer.position.x, (origin.y * innerHeight) + tweenPaperLayer.position.y);
                      const nextDestination = new paperPreview.Point((destination.x * innerWidth) + tweenPaperLayer.position.x, (destination.y * innerHeight) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
                    }
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'shadowColor': {
                const tls = tweenLayer.style.shadow.color;
                const tdl = tweenDestinationLayer.style.shadow.color;
                tweenProp[tween.prop] = tinyColor({h: tls.h, s: tls.s, l: tls.l, a: tls.a}).toHslString();
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tinyColor({h: tdl.h, s: tdl.s, l: tdl.l, a: tdl.a}).toHslString(),
                  onUpdate: () => {
                    tweenPaperLayer.shadowColor = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'shadowOffsetX': {
                tweenProp[tween.prop] = tweenPaperLayer.shadowOffset.x;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.x,
                  onUpdate: () => {
                    tweenPaperLayer.shadowOffset = new paperPreview.Point(tweenProp[tween.prop], tweenPaperLayer.shadowOffset.y);
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'shadowOffsetY': {
                tweenProp[tween.prop] = tweenPaperLayer.shadowOffset.y;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.y,
                  onUpdate: () => {
                    tweenPaperLayer.shadowOffset = new paperPreview.Point(tweenPaperLayer.shadowOffset.x, tweenProp[tween.prop]);
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'shadowBlur': {
                tweenProp[tween.prop] = tweenPaperLayer.shadowBlur;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.shadowBlur,
                  onUpdate: () => {
                    tweenPaperLayer.shadowBlur = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'opacity': {
                tweenProp[tween.prop] = tweenPaperLayer.opacity;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.opacity,
                  onUpdate: () => {
                    tweenPaperLayer.opacity = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'fontSize': {
                tweenProp[tween.prop] = (tweenPaperLayer as paper.PointText).fontSize;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: (tweenDestinationLayerPaperLayer as paper.PointText).fontSize,
                  onUpdate: () => {
                    (tweenPaperLayer as paper.PointText).fontSize = tweenProp[tween.prop];
                    tweenPaperLayer.data.innerWidth = tweenPaperLayer.bounds.width;
                    tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                    if (tweenPaperLayer.fillColor && tweenPaperLayer.fillColor.gradient) {
                      const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                      const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                      const origin = tweenPaperLayer.data.gradientOrigin ? tweenPaperLayer.data.gradientOrigin : tweenLayer.style.fill.gradient.origin;
                      const destination = tweenPaperLayer.data.gradientDestination ? tweenPaperLayer.data.gradientDestination : tweenLayer.style.fill.gradient.destination;
                      const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + tweenPaperLayer.position.x, (origin.y * innerHeight) + tweenPaperLayer.position.y);
                      const nextDestination = new paperPreview.Point((destination.x * innerWidth) + tweenPaperLayer.position.x, (destination.y * innerHeight) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
                    }
                  },
                  ease: tween.ease,
                }, tween.delay);
                break;
              }
              case 'lineHeight': {
                tweenProp[tween.prop] = (tweenPaperLayer as paper.PointText).leading;
                tweenTimeline.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: (tweenDestinationLayerPaperLayer as paper.PointText).leading,
                  onUpdate: () => {
                    (tweenPaperLayer as paper.PointText).leading = tweenProp[tween.prop];
                    tweenPaperLayer.data.innerHeight = tweenPaperLayer.bounds.height;
                    // update fill gradient origin/destination if needed
                    if (tweenPaperLayer.fillColor && tweenPaperLayer.fillColor.gradient) {
                      const innerWidth = tweenPaperLayer.data.innerWidth ? tweenPaperLayer.data.innerWidth : tweenLayer.frame.innerWidth;
                      const innerHeight = tweenPaperLayer.data.innerHeight ? tweenPaperLayer.data.innerHeight : tweenLayer.frame.innerHeight;
                      const origin = tweenPaperLayer.data.gradientOrigin ? tweenPaperLayer.data.gradientOrigin : tweenLayer.style.fill.gradient.origin;
                      const destination = tweenPaperLayer.data.gradientDestination ? tweenPaperLayer.data.gradientDestination : tweenLayer.style.fill.gradient.destination;
                      const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + tweenPaperLayer.position.x, (origin.y * innerHeight) + tweenPaperLayer.position.y);
                      const nextDestination = new paperPreview.Point((destination.x * innerWidth) + tweenPaperLayer.position.x, (destination.y * innerHeight) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
                    }
                    if (tweenPaperLayer.strokeColor && tweenPaperLayer.strokeColor.gradient) {
                      const origin = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.origin;
                      const destination = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.destination;
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).origin = new paper.Point((origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).destination = new paper.Point((destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                    }
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
      });
    });
  }, [paperProject, activeArtboard]);

  return (
    <div
      className={`c-canvas`}
      ref={canvasContainerRef}>
      <canvas
        id='canvas-preview'
        ref={canvasRef}
        style={{
          background: theme.background.z0
        }} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer, documentSettings } = state;
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
    documentImagesById
  };
};

export default connect(
  mapStateToProps,
  { setActiveArtboard }
)(PreviewCanvas);