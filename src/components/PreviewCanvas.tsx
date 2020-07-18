import paper from 'paper';
import { connect } from 'react-redux';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { setActiveArtboard } from '../store/actions/layer';
import { SetActiveArtboardPayload, LayerTypes } from '../store/actionTypes/layer';
import { getLongestEventTween, getPositionInArtboard, getAllArtboardTweenEvents, getAllArtboardTweenEventDestinations, getAllArtboardTweens, getAllArtboardTweenLayers, getAllArtboardTweenLayerDestinations, getAllArtboardTweenEventLayers, getGradientDestinationPoint, getGradientOriginPoint, getGradientStops } from '../store/selectors/layer';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import tinyColor from 'tinycolor2';
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
  canvasImagesById: {
    [id: string]: em.CanvasImage;
  };
  setActiveArtboard?(payload: SetActiveArtboardPayload): LayerTypes;
}

const PreviewCanvas = (props: PreviewCanvasProps): ReactElement => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  const { paperProject, activeArtboard, page, tweenEvents, tweenEventLayers, tweenEventDestinations, tweens, tweenLayers, tweenLayerDestinations, setActiveArtboard, canvasImagesById } = props;

  useEffect(() => {
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    paperPreview.setup(canvasRef.current);
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
      const tweenEventDestinationArtboardPaperLayer = paperTweenEventDestinationsById[tweenEvent.destinationArtboard];
      const tweenEventPaperLayer = paperTweenEventLayersById[tweenEvent.layer];
      const tweenEventTweensById = tweenEvent.tweens.reduce((result: { [id: string]: em.Tween }, current): {[id: string]: em.Tween} => {
        result[current] = tweens.byId[current];
        return result;
      }, {});
      // add tweens for each animation event
      tweenEventPaperLayer.on(tweenEvent.event, (e: paper.MouseEvent | paper.KeyEvent) => {
        if (tweenEvent.tweens.length > 0) {
          const longestTween = getLongestEventTween(tweenEventTweensById);
          Object.keys(tweenEventTweensById).forEach((tweenId) => {
            let paperTween: gsap.core.Tween;
            const tweenProp: any = {};
            const tween = tweenEventTweensById[tweenId];
            const tweenLayer = tweenLayers.byId[tween.layer];
            const tweenPaperLayer = paperTweenLayersById[tween.layer];
            const tweenPaperLayerArtboardPosition = getPositionInArtboard(tweenPaperLayer, paperActiveArtboard);
            const tweenDestinationLayer = tweenLayerDestinations.byId[tween.destinationLayer];
            const tweenDestinationLayerPaperLayer = paperTweenLayerDestinationsById[tween.destinationLayer];
            const tweenDestinationLayerArtboardPosition = getPositionInArtboard(tweenDestinationLayerPaperLayer, tweenEventDestinationArtboardPaperLayer);
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
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [`${tween.prop}-before`]: 0,
                  [`${tween.prop}-after`]: 1,
                  onUpdate: () => {
                    beforeRaster.opacity = tweenProp[`${tween.prop}-before`];
                    afterRaster.opacity = tweenProp[`${tween.prop}-after`];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'shape': {
                const morphData = [
                  (tweenPaperLayer as paper.Path).pathData,
                  (tweenDestinationLayerPaperLayer as paper.Path).pathData
                ];
                MorphSVGPlugin.pathFilter(morphData);
                tweenProp[tween.prop] = morphData[0];
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: morphData[1],
                  onUpdate: () => {
                    // clone tweenPaperLayer
                    const clone = tweenPaperLayer.clone({insert: false, deep: false}) as paper.Path;
                    // apply path data to clone
                    clone.pathData = tweenProp[tween.prop];
                    // apply tweenPaperLayer bounds to clone...
                    // needed to give the final path data the correct x/y position
                    clone.bounds.center.x = tweenPaperLayer.bounds.center.x;
                    clone.bounds.center.y = tweenPaperLayer.bounds.center.y;
                    // apply final clone path data to tweenPaperLayer
                    (tweenPaperLayer as paper.Path).pathData = clone.pathData;
                    // update fill gradient origin/destination if needed
                    if (tweenPaperLayer.fillColor && tweenPaperLayer.fillColor.gradient) {
                      const origin = tweenLayers.byId[tweenPaperLayer.data.id].style.fill.gradient.origin;
                      const destination = tweenLayers.byId[tweenPaperLayer.data.id].style.fill.gradient.destination;
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = new paper.Point((origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = new paper.Point((destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                    }
                    if (tweenPaperLayer.strokeColor && tweenPaperLayer.strokeColor.gradient) {
                      const origin = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.origin;
                      const destination = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.destination;
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).origin = new paper.Point((origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).destination = new paper.Point((destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                    }
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
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
                  paperTween = gsap.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.fillColor = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                    delay: tween.delay
                  });
                // no fill to color fill
                } else if (
                  !tweenPaperLayer.fillColor &&
                  tweenDestinationLayerPaperLayer.fillColor &&
                  (tweenDestinationLayerPaperLayer.fillColor.type === 'rgb' || tweenDestinationLayerPaperLayer.fillColor.type === 'hsl')
                ) {
                  const c2 = tweenDestinationLayerPaperLayer.fillColor.toCSS(true);
                  tweenProp[tween.prop] = new paperPreview.Color(tinyColor(c2).setAlpha(0).toHex8String()).toCSS(true);
                  paperTween = gsap.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.fillColor = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                    delay: tween.delay
                  });
                // color fill to no fill
                } else if (
                  tweenPaperLayer.fillColor &&
                  !tweenDestinationLayerPaperLayer.fillColor &&
                  (tweenPaperLayer.fillColor.type === 'rgb' || tweenPaperLayer.fillColor.type === 'hsl')
                ) {
                  tweenProp[tween.prop] = tweenPaperLayer.fillColor.alpha;
                  paperTween = gsap.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: 0,
                    onUpdate: () => {
                      tweenPaperLayer.fillColor.alpha = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                    delay: tween.delay
                  });
                // gradient fill to gradient fill
                } else if (
                  tweenPaperLayer.fillColor &&
                  tweenPaperLayer.fillColor.type === 'gradient' &&
                  tweenDestinationLayerPaperLayer.fillColor &&
                  tweenDestinationLayerPaperLayer.fillColor.type === 'gradient'
                ) {
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.toCSS(true) : closestDestinationStop.color.toCSS(true),
                      [`${tween.prop}-stop-${index}-offset`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].offset : closestDestinationStop.offset,
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                        tweenPaperLayer.fillColor.gradient.stops[index].offset = tweenProp[`${tween.prop}-stop-${index}-offset`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
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
                      stops: tweenDestinationLayer.style.fill.gradient.stops.allIds.map((id) => {
                        const stop = tweenDestinationLayer.style.fill.gradient.stops.byId[id];
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
                  });
                // gradient fill to no fill
                } else if (
                  tweenPaperLayer.fillColor &&
                  tweenPaperLayer.fillColor.type === 'gradient' &&
                  !tweenDestinationLayerPaperLayer.fillColor
                ) {
                  tweenPaperLayer.fillColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.fillColor.gradient.stops[index].color.alpha;
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: 0,
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
                  });
                // no fill to gradient fill
                } else if (
                  !tweenPaperLayer.fillColor &&
                  tweenDestinationLayerPaperLayer.fillColor &&
                  tweenDestinationLayerPaperLayer.fillColor.type === 'gradient'
                ) {
                  tweenPaperLayer.fillColor = {
                    gradient: {
                      stops: tweenDestinationLayer.style.fill.gradient.stops.allIds.map((id) => {
                        const stop = tweenDestinationLayer.style.fill.gradient.stops.byId[id];
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.fillColor.gradient.stops[index].color.alpha,
                      onUpdate: () => {
                        tweenPaperLayer.fillColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
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
                  paperTween = gsap.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                    delay: tween.delay
                  });
                // no stroke to color stroke
                } else if (
                  !tweenPaperLayer.strokeColor &&
                  tweenDestinationLayerPaperLayer.strokeColor &&
                  (tweenDestinationLayerPaperLayer.strokeColor.type === 'rgb' || tweenDestinationLayerPaperLayer.strokeColor.type === 'hsl')
                ) {
                  const c2 = tweenDestinationLayerPaperLayer.strokeColor.toCSS(true);
                  tweenProp[tween.prop] = new paperPreview.Color(tinyColor(c2).setAlpha(0).toHex8String()).toCSS(true);
                  paperTween = gsap.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                    delay: tween.delay
                  });
                // color stroke to no stroke
                } else if (
                  tweenPaperLayer.strokeColor &&
                  !tweenDestinationLayerPaperLayer.strokeColor &&
                  (tweenPaperLayer.strokeColor.type === 'rgb' || tweenPaperLayer.strokeColor.type === 'hsl')
                ) {
                  tweenProp[tween.prop] = tweenPaperLayer.strokeColor.alpha;
                  paperTween = gsap.to(tweenProp, {
                    duration: tween.duration,
                    [tween.prop]: 0,
                    onUpdate: () => {
                      tweenPaperLayer.strokeColor.alpha = tweenProp[tween.prop];
                    },
                    ease: tween.ease,
                    delay: tween.delay
                  });
                // gradient stroke to gradient stroke
                } else if (
                  tweenPaperLayer.strokeColor &&
                  tweenPaperLayer.strokeColor.type === 'gradient' &&
                  tweenDestinationLayerPaperLayer.strokeColor &&
                  tweenDestinationLayerPaperLayer.strokeColor.type === 'gradient'
                ) {
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true) : closestDestinationStop.color.toCSS(true),
                      [`${tween.prop}-stop-${index}-offset`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index] ? tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].offset : closestDestinationStop.offset,
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                        tweenPaperLayer.strokeColor.gradient.stops[index].offset = tweenProp[`${tween.prop}-stop-${index}-offset`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
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
                      stops: tweenDestinationLayer.style.stroke.gradient.stops.allIds.map((id) => {
                        const stop = tweenDestinationLayer.style.stroke.gradient.stops.byId[id];
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.toCSS(true),
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
                  });
                // gradient stroke to no stroke
                } else if (
                  tweenPaperLayer.strokeColor &&
                  tweenPaperLayer.strokeColor.type === 'gradient' &&
                  !tweenDestinationLayerPaperLayer.strokeColor
                ) {
                  tweenPaperLayer.strokeColor.gradient.stops.forEach((stop, index) => {
                    tweenProp[`${tween.prop}-stop-${index}-color`] = tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha;
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: 0,
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
                  });
                // no stroke to gradient stroke
                } else if (
                  !tweenPaperLayer.strokeColor &&
                  tweenDestinationLayerPaperLayer.strokeColor &&
                  tweenDestinationLayerPaperLayer.strokeColor.type === 'gradient'
                ) {
                  tweenPaperLayer.strokeColor = {
                    gradient: {
                      stops: tweenDestinationLayer.style.stroke.gradient.stops.allIds.map((id) => {
                        const stop = tweenDestinationLayer.style.stroke.gradient.stops.byId[id];
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
                    paperTween = gsap.to(tweenProp, {
                      duration: tween.duration,
                      [`${tween.prop}-stop-${index}-color`]: tweenDestinationLayerPaperLayer.strokeColor.gradient.stops[index].color.alpha,
                      onUpdate: () => {
                        tweenPaperLayer.strokeColor.gradient.stops[index].color.alpha = tweenProp[`${tween.prop}-stop-${index}-color`];
                      },
                      ease: tween.ease,
                      delay: tween.delay
                    });
                  });
                }
                break;
              }
              case 'strokeDashWidth': {
                tweenProp[tween.prop] = tweenPaperLayer.dashArray[0];
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.dashArray[0],
                  onUpdate: () => {
                    tweenPaperLayer.dashArray = [tweenProp[tween.prop], tweenPaperLayer.dashArray[1]];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'strokeDashGap': {
                tweenProp[tween.prop] = tweenPaperLayer.dashArray[1];
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.dashArray[1],
                  onUpdate: () => {
                    tweenPaperLayer.dashArray = [tweenPaperLayer.dashArray[0], tweenProp[tween.prop]];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'strokeWidth': {
                tweenProp[tween.prop] = tweenPaperLayer.strokeWidth;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.strokeWidth,
                  onUpdate: () => {
                    tweenPaperLayer.strokeWidth = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'x': {
                tweenProp[tween.prop] = tweenPaperLayer.position.x;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: `-=${tweenPaperLayerPositionDiffX}`,
                  onUpdate: () => {
                    tweenPaperLayer.position.x = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'y': {
                tweenProp[tween.prop] = tweenPaperLayer.position.y;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: `-=${tweenPaperLayerPositionDiffY}`,
                  onUpdate: () => {
                    tweenPaperLayer.position.y = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'width': {
                tweenProp[tween.prop] = tweenPaperLayer.bounds.width;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.bounds.width,
                  onUpdate: () => {
                    const scaleX = tweenProp[tween.prop] / tweenPaperLayer.bounds.width;
                    tweenPaperLayer.scale(scaleX, 1);
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'height': {
                tweenProp[tween.prop] = tweenPaperLayer.bounds.height;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.bounds.height,
                  onUpdate: () => {
                    const scaleY = tweenProp[tween.prop] / tweenPaperLayer.bounds.height;
                    tweenPaperLayer.scale(1, scaleY);
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'rotation': {
                tweenProp[tween.prop] = tweenPaperLayer.rotation;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.rotation,
                  onUpdate: () => {
                    tweenPaperLayer.rotation = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'shadowColor': {
                const tls = tweenLayer.style.shadow.color;
                const tdl = tweenDestinationLayer.style.shadow.color;
                tweenProp[tween.prop] = tinyColor({h: tls.h, s: tls.s, l: tls.l, a: tls.a}).toHslString();
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tinyColor({h: tdl.h, s: tdl.s, l: tdl.l, a: tdl.a}).toHslString(),
                  onUpdate: () => {
                    tweenPaperLayer.shadowColor = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'shadowOffsetX': {
                tweenProp[tween.prop] = tweenPaperLayer.shadowOffset.x;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.x,
                  onUpdate: () => {
                    tweenPaperLayer.shadowOffset = new paperPreview.Point(tweenProp[tween.prop], tweenPaperLayer.shadowOffset.y);
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'shadowOffsetY': {
                tweenProp[tween.prop] = tweenPaperLayer.shadowOffset.y;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.shadowOffset.y,
                  onUpdate: () => {
                    tweenPaperLayer.shadowOffset = new paperPreview.Point(tweenPaperLayer.shadowOffset.x, tweenProp[tween.prop]);
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'shadowBlur': {
                tweenProp[tween.prop] = tweenPaperLayer.shadowBlur;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.shadowBlur,
                  onUpdate: () => {
                    tweenPaperLayer.shadowBlur = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'opacity': {
                tweenProp[tween.prop] = tweenPaperLayer.opacity;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: tweenDestinationLayerPaperLayer.opacity,
                  onUpdate: () => {
                    tweenPaperLayer.opacity = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'fontSize': {
                tweenProp[tween.prop] = (tweenPaperLayer as paper.PointText).fontSize;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: (tweenDestinationLayerPaperLayer as paper.PointText).fontSize,
                  onUpdate: () => {
                    (tweenPaperLayer as paper.PointText).fontSize = tweenProp[tween.prop];
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
              case 'lineHeight': {
                tweenProp[tween.prop] = (tweenPaperLayer as paper.PointText).leading;
                paperTween = gsap.to(tweenProp, {
                  duration: tween.duration,
                  [tween.prop]: (tweenDestinationLayerPaperLayer as paper.PointText).leading,
                  onUpdate: () => {
                    (tweenPaperLayer as paper.PointText).leading = tweenProp[tween.prop];
                    // update fill gradient origin/destination if needed
                    if (tweenPaperLayer.fillColor && tweenPaperLayer.fillColor.gradient) {
                      const origin = tweenLayers.byId[tweenPaperLayer.data.id].style.fill.gradient.origin;
                      const destination = tweenLayers.byId[tweenPaperLayer.data.id].style.fill.gradient.destination;
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).origin = new paper.Point((origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.fillColor as em.PaperGradientFill).destination = new paper.Point((destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                    }
                    if (tweenPaperLayer.strokeColor && tweenPaperLayer.strokeColor.gradient) {
                      const origin = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.origin;
                      const destination = tweenLayers.byId[tweenPaperLayer.data.id].style.stroke.gradient.destination;
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).origin = new paper.Point((origin.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (origin.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                      (tweenPaperLayer.strokeColor as em.PaperGradientFill).destination = new paper.Point((destination.x * tweenPaperLayer.bounds.width) + tweenPaperLayer.position.x, (destination.y * tweenPaperLayer.bounds.height) + tweenPaperLayer.position.y);
                    }
                  },
                  ease: tween.ease,
                  delay: tween.delay
                });
                break;
              }
            }
            if (tween.id === longestTween.id) {
              paperTween.then(() => {
                setActiveArtboard({id: tweenEvent.destinationArtboard, scope: 2});
              });
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
  const { layer, canvasSettings } = state;
  const paperProject = canvasSettings.allImageIds.reduce((result, current) => {
    const rasterBase64 = bufferToBase64(Buffer.from(canvasSettings.imageById[current].buffer));
    const base64 = `data:image/webp;base64,${rasterBase64}`;
    return result.replace(`"source":"${current}"`, `"source":"${base64}"`);
  }, layer.present.paperProject);
  const tweenEvents = getAllArtboardTweenEvents(layer.present, layer.present.activeArtboard);
  const tweenEventDestinations = getAllArtboardTweenEventDestinations(layer.present, layer.present.activeArtboard);
  const tweenEventLayers = getAllArtboardTweenEventLayers(layer.present, layer.present.activeArtboard);
  const tweens = getAllArtboardTweens(layer.present, layer.present.activeArtboard);
  const tweenLayers = getAllArtboardTweenLayers(layer.present, layer.present.activeArtboard);
  const tweenLayerDestinations = getAllArtboardTweenLayerDestinations(layer.present, layer.present.activeArtboard);
  const canvasImagesById = canvasSettings.imageById;
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
    canvasImagesById
  };
};

export default connect(
  mapStateToProps,
  { setActiveArtboard }
)(PreviewCanvas);