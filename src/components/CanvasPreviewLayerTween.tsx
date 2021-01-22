/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { gsap } from 'gsap';
import tinyColor from 'tinycolor2';
import { CustomEase } from 'gsap/CustomEase';
import { TextPlugin } from 'gsap/TextPlugin';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';
import { EventLayerTimelineData } from './CanvasPreviewLayerEvent';

gsap.registerPlugin(MorphSVGPlugin, RoughEase, SlowMo, CustomBounce, CustomWiggle, ScrambleTextPlugin, TextPlugin);

interface CanvasPreviewLayerTweenProps {
  tweenId: string;
  eventTimeline: gsap.core.Timeline;
}

interface CanvasPreviewLayerTweenStateProps {
  tween: Btwx.Tween;
  originLayerItem: Btwx.Layer;
  destinationLayerItem: Btwx.Layer;
  originArtboardItem: Btwx.Artboard;
  destinationArtboardItem: Btwx.Artboard;
  originImage: Btwx.DocumentImage;
  destinationImage: Btwx.DocumentImage;
  maxTextLineCount: number;
}

const CanvasPreviewLayerTween = (props: CanvasPreviewLayerTweenProps & CanvasPreviewLayerTweenStateProps): ReactElement => {
  const { eventTimeline, tween, tweenId, originLayerItem, destinationLayerItem, originArtboardItem, destinationArtboardItem, originImage, destinationImage, maxTextLineCount } = props;
  const [eventLayerTimeline, setEventLayerTimeline] = useState((eventTimeline as any).getById(`${tween.event}-${tween.layer}`) as gsap.core.Timeline)

  const getEaseString = (tween: Btwx.Tween): string => {
    switch(tween.ease) {
      case 'customBounce':
        return `bounce({strength: ${tween.customBounce.strength}, endAtStart: ${tween.customBounce.endAtStart}, squash: ${tween.customBounce.squash}})`;
      case 'customWiggle':
        return `wiggle({type: ${tween.customWiggle.type}, wiggles: ${tween.customWiggle.wiggles}})`;
      case 'slow':
        return `slow(${tween.slow.linearRatio}, ${tween.slow.power}, ${tween.slow.yoyoMode})`;
      case 'rough':
        return `rough({clamp: ${tween.rough.clamp}, points: ${tween.rough.points}, randomize: ${tween.rough.randomize}, strength: ${tween.rough.strength}, taper: ${tween.rough.taper}, template: ${tween.rough.template}})`;
      case 'steps':
        return `steps(${tween.steps.steps})`;
      default:
        return `${tween.ease}.${tween.power}`;
    }
  }

  const updateGradients = (paperLayers: { paperLayer: paper.Item; textLinesGroup: paper.Group; textBackground: paper.Path.Rectangle }): void => {
    const { paperLayer, textLinesGroup, textBackground } = paperLayers;
    const isText = originLayerItem.type === 'Text';
    const textLines = isText ? paperLayer.getItem({data: {id: 'textLines'}}) : null;
    const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    ['fill', 'stroke'].forEach((style: 'fill' | 'stroke') => {
      if (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] && paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient || isText && textLines.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] && textLines.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient) {
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (isOriginLayerLine ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (isOriginLayerLine ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = paperLayer.data[`${style}GradientOriginX`] ? paperLayer.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
        const originY = paperLayer.data[`${style}GradientOriginY`] ? paperLayer.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
        const destinationX = paperLayer.data[`${style}GradientDestinationX`] ? paperLayer.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
        const destinationY = paperLayer.data[`${style}GradientDestinationY`] ? paperLayer.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
        const nextOrigin = new paperPreview.Point((originX * innerWidth) + paperLayer.position.x, (originY * innerHeight) + paperLayer.position.y);
        const nextDestination = new paperPreview.Point((destinationX * innerWidth) + paperLayer.position.x, (destinationY * innerHeight) + paperLayer.position.y);
        if (isText) {
          textLines.children.forEach((line) => {
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
          });
        } else {
          (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
          (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        }
      }
    });
  };

  const getFSTweenType = (style: 'fill' | 'stroke'): Btwx.FillStrokeTween => {
    const os = originLayerItem.style[style];
    const ds = destinationLayerItem.style[style];
    // color to color style
    if (os.enabled && ds.enabled && os.fillType === 'color' && ds.fillType === 'color') {
      return 'colorToColor';
    // no style to color style
    } else if (!os.enabled && ds.enabled && ds.fillType === 'color') {
      return 'nullToColor';
    // color style to no style
    } else if (os.enabled && !ds.enabled && os.fillType === 'color') {
      return 'colorToNull';
    // gradient style to gradient style
    } else if (os.enabled && ds.enabled && os.fillType === 'gradient' && ds.fillType === 'gradient') {
      return 'gradientToGradient';
    // gradient style to color style
    } else if (os.enabled && ds.enabled && os.fillType === 'gradient' && ds.fillType === 'color') {
      return 'gradientToColor';
    // color style to gradient style
    } else if (os.enabled && ds.enabled && os.fillType === 'color' && ds.fillType === 'gradient') {
      return 'colorToGradient';
    // gradient style to no style
    } else if (os.enabled && !ds.enabled && os.fillType === 'gradient') {
      return 'gradientToNull';
    // no style to gradient style
    } else if (!os.enabled && ds.enabled && ds.fillType === 'gradient') {
      return 'nullToGradient';
    }
  };

  const addFSTween = (style: 'fill' | 'stroke'): void => {
    const fillTweenType = getFSTweenType(style);
    switch(fillTweenType) {
      case 'colorToColor':
        addColorToColorFSTween(style);
        break;
      case 'nullToColor':
        addNullToColorFSTween(style);
        break;
      case 'colorToNull':
        addColorToNullFSTween(style);
        break;
      case 'gradientToGradient':
        addGradientToGradientFSTween(style);
        break;
      case 'gradientToColor':
        addGradientToColorFSTween(style);
        break;
      case 'colorToGradient':
        addColorToGradientFSTween(style);
        break;
      case 'gradientToNull':
        addGradientToNullFSTween(style);
        break;
      case 'nullToGradient':
        addNullToGradientFSTween(style);
        break;
    }
  };

  const addImageTween = (): void => {
    eventTimeline.data[tween.layer][`${tween.prop}-before`] = 1;
    eventTimeline.data[tween.layer][`${tween.prop}-after`] = 0;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [`${tween.prop}-before`]: 0,
      [`${tween.prop}-after`]: 1,
      onStart: function() {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startPosition = paperLayer.position;
        paperLayer.rotation = -startRotation;
        const beforeRaster = paperLayer.getItem({data: {id: 'raster'}}) as paper.Raster;
        const afterRaster = beforeRaster.clone() as paper.Raster;
        afterRaster.source = (paperPreview.project.getItem({data:{id: tween.destinationLayer}}).children[0] as paper.Raster).source;
        afterRaster.bounds = beforeRaster.bounds;
        afterRaster.opacity = 0;
        paperLayer.rotation = startRotation;
        paperLayer.position = startPosition;
      },
      onUpdate: function() {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const beforeRaster = paperLayer.children[0];
        const afterRaster = paperLayer.children[1];
        beforeRaster.opacity = eventTimeline.data[tween.layer][`${tween.prop}-before`];
        afterRaster.opacity = eventTimeline.data[tween.layer][`${tween.prop}-after`];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShapeTween = (): void => {
    const originWithoutRotation = new paperPreview.Path({
      pathData: (originLayerItem as Btwx.Shape).pathData,
      rotation: -originLayerItem.transform.rotation,
      insert: false
    });
    const destinationWithoutRotation = new paperPreview.Path({
      pathData: (destinationLayerItem as Btwx.Shape).pathData,
      rotation: -destinationLayerItem.transform.rotation,
      insert: false
    });
    // get morph data
    const morphData = [
      originWithoutRotation.pathData,
      destinationWithoutRotation.pathData
    ];
    MorphSVGPlugin.pathFilter(morphData);
    eventTimeline.data[tween.layer][tween.prop] = morphData[0];
    // set tween
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: morphData[1],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : originLayerItem.frame.innerWidth;
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : originLayerItem.frame.innerHeight;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startPosition = paperLayer.position;
        paperLayer.rotation = -startRotation;
        // apply final clone path data to tweenPaperLayer
        (paperLayer as paper.Path).pathData = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.bounds.width = innerWidth;
        paperLayer.bounds.height = innerHeight;
        paperLayer.rotation = startRotation;
        paperLayer.position = startPosition;
        // update fill gradient origin/destination if needed
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style.fill.color;
    const dfc = destinationLayerItem.style.fill.color;
    eventTimeline.data[tween.layer][tween.prop] = tinyColor({h: ofc.h, s: ofc.s, l: ofc.l, a: ofc.a}).toHslString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: dfc.a}).toHslString(),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventTimeline.data[tween.layer][tween.prop];
        switch(originLayerItem.type) {
          case 'Artboard':
            artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
            break;
          case 'Text':
            textLinesGroup.children.forEach((line: paper.PointText) => {
              line[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
            });
            break;
          default:
            paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addNullToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const dfc = destinationLayerItem.style.fill.color;
    eventTimeline.data[tween.layer][tween.prop] = tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: 0}).toHslString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: dfc.a}).toHslString(),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventTimeline.data[tween.layer][tween.prop];
        switch(originLayerItem.type) {
          case 'Artboard':
            artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
            break;
          case 'Text':
            textLinesGroup.children.forEach((line: paper.PointText) => {
              line[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
            });
            break;
          default:
            paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToNullFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style.fill.color;
    eventTimeline.data[tween.layer][tween.prop] = ofc.a;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: 0,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventTimeline.data[tween.layer][tween.prop];
        switch(originLayerItem.type) {
          case 'Artboard':
            artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = nextFS;
            break;
          case 'Text':
            textLinesGroup.children.forEach((line: paper.PointText) => {
              line[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = nextFS;
            });
            break;
          default:
            paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = nextFS;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginXFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style[style].gradient.origin.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.origin.x,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = eventTimeline.data[tween.layer][tween.prop];
        const originY = paperLayer.data[`${style}GradientOriginY`] ? paperLayer.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
        const nextOrigin = new paperPreview.Point((originX * innerWidth) + paperLayer.position.x, (originY * innerHeight) + paperLayer.position.y);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            break;
          case 'Text':
            textLinesGroup.children.forEach((line: paper.PointText) => {
              (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            });
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        }
        paperLayer.data[tween.prop] = originX;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginYFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style[style].gradient.origin.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.origin.y,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = paperLayer.data[`${style}GradientOriginX`] ? paperLayer.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
        const originY = eventTimeline.data[tween.layer][tween.prop];
        const nextOrigin = new paperPreview.Point((originX * innerWidth) + paperLayer.position.x, (originY * innerHeight) + paperLayer.position.y);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            break;
          case 'Text':
            textLinesGroup.children.forEach((line: paper.PointText) => {
              (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            });
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        }
        paperLayer.data[tween.prop] = originY;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationXFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style[style].gradient.destination.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.destination.x,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const destinationX = eventTimeline.data[tween.layer][tween.prop];
        const destinationY = paperLayer.data[`${style}GradientDestinationY`] ? paperLayer.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
        const nextDestination = new paperPreview.Point((destinationX * innerWidth) + paperLayer.position.x, (destinationY * innerHeight) + paperLayer.position.y);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            break;
          case 'Text':
            textLinesGroup.children.forEach((line: paper.PointText) => {
              (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            });
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        }
        paperLayer.data[tween.prop] = destinationX;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationYFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style[style].gradient.destination.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.destination.y,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const destinationX = paperLayer.data[`${style}GradientDestinationX`] ? paperLayer.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
        const destinationY = eventTimeline.data[tween.layer][tween.prop];
        const nextDestination = new paperPreview.Point((destinationX * innerWidth) + paperLayer.position.x, (destinationY * innerHeight) + paperLayer.position.y);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            break;
          case 'Text':
            textLinesGroup.children.forEach((line: paper.PointText) => {
              (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            });
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        }
        paperLayer.data[tween.prop] = destinationY;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const isArtboard = originLayerItem.type === 'Artboard';
    const isText = originLayerItem.type === 'Text';
    const og = originLayerItem.style.fill.gradient;
    const dg = destinationLayerItem.style.fill.gradient;
    const originStopCount = og.stops.length;
    const destinationStopCount = dg.stops.length;
    const stopDiff = destinationStopCount - originStopCount;
    const stops = og.stops;
    if (destinationStopCount > originStopCount) {
      for (let i = 0; i < stopDiff; i++) {
        const stopClone = {...stops[0]};
        stops.push(stopClone);
      }
    }
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        if (destinationStopCount > originStopCount) {
          const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const stopDiff = destinationStopCount - originStopCount;
          const paperLayerRef = isText ? textLinesGroup : isArtboard ? artboardBackground : paperLayer;
          const gradientRef = isText ? paperLayerRef.children[0] : isArtboard ? artboardBackground : paperLayer;
          for (let i = 0; i < stopDiff; i++) {
            const stopClone = gradientRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[0].clone();
            gradientRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.push(stopClone);
          }
          paperLayerRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: gradientRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
              radial: dg.gradientType === 'radial'
            },
            origin: (gradientRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
            destination: (gradientRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
          } as Btwx.PaperGradientFill;
        }
      }
    });
    stops.forEach((stop, index) => {
      const sc = stop.color;
      const sp = stop.position;
      // get closest destination stop if index is greater than destination stop length
      const cds = dg.stops.reduce((result, current) => {
        return (Math.abs(current.position - stop.position) < Math.abs(result.position - stop.position) ? current : result);
      });
      const dc = dg.stops[index] ? dg.stops[index].color : cds.color;
      const dp = dg.stops[index] ? dg.stops[index].position : cds.position;
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString();
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-offset`] = sp;
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor({h: dc.h, s: dc.s, l: dc.l, a: dc.a}).toHslString(),
        [`${tween.prop}-stop-${index}-offset`]: dp,
        onUpdate: () => {
          const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextStopColor = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          const nextStopOffset = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-offset`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextStopColor;
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = nextStopOffset;
              break;
            case 'Text':
              textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextStopColor;
              textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = nextStopOffset;
              textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
                gradient: {
                  stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                  radial: dg.gradientType === 'radial'
                },
                origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
                destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
              } as Btwx.PaperGradientFill;
              break;
            default:
              paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextStopColor;
              paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = nextStopOffset;
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addGradientToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const stopsTimeline = gsap.timeline({id: tweenId});
    const og = originLayerItem.style[style].gradient;
    const dc = destinationLayerItem.style[style].color;
    og.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString();
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor({h: dc.h, s: dc.s, l: dc.l, a: dc.a}).toHslString(),
        onUpdate: () => {
          const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
              break;
            case 'Text':
              textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
              textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
                gradient: {
                  stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                  radial: og.gradientType === 'radial'
                },
                origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
                destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
              } as Btwx.PaperGradientFill;
              break;
            default:
              paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addColorToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    const isArtboard = originLayerItem.type === 'Artboard';
    const oc = originLayerItem.style[style].color;
    const dg = destinationLayerItem.style[style].gradient;
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : isArtboard ? artboardBackground : paperLayer;
        paperLayer.data[`${style}GradientOriginX`] = dg.origin.x;
        paperLayer.data[`${style}GradientOriginY`] = dg.origin.y;
        paperLayer.data[`${style}GradientDestinationX`] = dg.destination.x;
        paperLayer.data[`${style}GradientDestinationY`] = dg.destination.y;
        // set origin layer styleColor to destination layer gradient...
        // with all the stop colors as origin color
        paperLayerRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
          gradient: {
            stops: destinationLayerItem.style[style].gradient.stops.map((stop) => {
              return new paperPreview.GradientStop(
                new paperPreview.Color(tinyColor({h: oc.h, s: oc.s, l: oc.l, a: oc.a}).toHslString()),
                stop.position
              );
            }),
            radial: dg.gradientType === 'radial'
          },
          origin: new paperPreview.Point((destinationLayerItem.style[style].gradient.origin.x * paperLayer.bounds.width) + paperLayer.position.x, (destinationLayerItem.style[style].gradient.origin.y * paperLayer.bounds.height) + paperLayer.position.y),
          destination: new paperPreview.Point((destinationLayerItem.style[style].gradient.destination.x * paperLayer.bounds.width) + paperLayer.position.x, (destinationLayerItem.style[style].gradient.destination.y * paperLayer.bounds.height) + paperLayer.position.y)
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = tinyColor({h: oc.h, s: oc.s, l: oc.l, a: oc.a}).toHslString();
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString(),
        onUpdate: () => {
          const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
              break;
            case 'Text':
              textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
              textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
                gradient: {
                  stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                  radial: dg.gradientType === 'radial'
                },
                origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
                destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
              } as Btwx.PaperGradientFill;
              break;
            default:
              paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addGradientToNullFSTween = (style: 'fill' | 'stroke'): void => {
    const stopsTimeline = gsap.timeline({id: tweenId});
    const og = originLayerItem.style[style].gradient;
    og.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = sc.a;
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: 0,
        onUpdate: () => {
          const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
              break;
            case 'Text':
              textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
              textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
                gradient: {
                  stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                  radial: og.gradientType === 'radial'
                },
                origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
                destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
              } as Btwx.PaperGradientFill;
              break;
            default:
              paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addNullToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    const isArtboard = originLayerItem.type === 'Artboard';
    const dg = destinationLayerItem.style[style].gradient;
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.data[`${style}GradientOriginX`] = dg.origin.x;
        paperLayer.data[`${style}GradientOriginY`] = dg.origin.y;
        paperLayer.data[`${style}GradientDestinationX`] = dg.destination.x;
        paperLayer.data[`${style}GradientDestinationY`] = dg.destination.y;
        // set origin layer styleColor to destination layer gradient with opaque stops
        const paperLayerRef = isText ? textLinesGroup : isArtboard ? artboardBackground : paperLayer;
        paperLayerRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
          gradient: {
            stops: dg.stops.map((stop) => {
              const sc = stop.color;
              const sp = stop.position;
              return new paperPreview.GradientStop({hue: sc.h, saturation: sc.s, lightness: sc.l, alpha: 0} as paper.Color, sp);
            }),
            radial: dg.gradientType === 'radial'
          },
          origin: new paperPreview.Point((dg.origin.x * paperLayer.bounds.width) + paperLayer.position.x, (dg.origin.y * paperLayer.bounds.height) + paperLayer.position.y),
          destination: new paperPreview.Point((dg.destination.x * paperLayer.bounds.width) + paperLayer.position.x, (dg.destination.y * paperLayer.bounds.height) + paperLayer.position.y)
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = 0;
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: sc.a,
        onUpdate: () => {
          const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
              break;
            case 'Text':
              textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
              textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
                gradient: {
                  stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                  radial: dg.gradientType === 'radial'
                },
                origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
                destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
              } as Btwx.PaperGradientFill;
              break;
            default:
              paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addDashOffsetTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style.strokeOptions.dashOffset;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.strokeOptions.dashOffset,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        paperLayerRef.dashOffset = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addDashArrayWidthTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style.strokeOptions.dashArray[0];
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.strokeOptions.dashArray[0],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        paperLayerRef.dashArray = [eventTimeline.data[tween.layer][tween.prop], paperLayerRef.dashArray[1]];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addDashArrayGapTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style.strokeOptions.dashArray[1];
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.strokeOptions.dashArray[1],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        paperLayerRef.dashArray = [paperLayerRef.dashArray[0], eventTimeline.data[tween.layer][tween.prop]];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addStrokeWidthTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style.stroke.width;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.stroke.width,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        paperLayerRef.strokeWidth = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addXTween = (): void => {
    const originPaperLayerPositionDiffX = destinationLayerItem.frame.x - originLayerItem.frame.x;
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.x + originArtboardItem.frame.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${originPaperLayerPositionDiffX}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.x = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addYTween = (): void => {
    const frameDiff = destinationLayerItem.frame.y - originLayerItem.frame.y;
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.y + originArtboardItem.frame.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${frameDiff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.y = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addWidthTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.innerWidth;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.frame.innerWidth,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startPosition = paperLayer.position;
        paperLayer.rotation = -startRotation;
        paperLayer.bounds.width = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.rotation = startRotation;
        paperLayer.position = startPosition;
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded') {
          paperLayer.rotation = -startRotation;
          const newShape = new paperPreview.Path.Rectangle({
            from: paperLayer.bounds.topLeft,
            to: paperLayer.bounds.bottomRight,
            radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
            insert: false
          });
          (paperLayer as paper.Path).pathData = newShape.pathData;
          paperLayer.rotation = startRotation;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addHeightTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.innerHeight;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.frame.innerHeight,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startPosition = paperLayer.position;
        paperLayer.rotation = -startRotation;
        paperLayer.bounds.height = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerHeight = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.rotation = startRotation;
        paperLayer.position = startPosition;
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded') {
          paperLayer.rotation = -startRotation;
          const newShape = new paperPreview.Path.Rectangle({
            from: paperLayer.bounds.topLeft,
            to: paperLayer.bounds.bottomRight,
            radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
            insert: false
          });
          (paperLayer as paper.Path).pathData = newShape.pathData;
          paperLayer.rotation = startRotation;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addRotationTween = (): void => {
    // const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.transform.rotation;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.transform.rotation,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        // const startPosition = originPaperLayer.position;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        paperLayer.rotation = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.rotation = eventTimeline.data[tween.layer][tween.prop];
        // originPaperLayer.position = startPosition;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowColorTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osc = originLayerItem.style.shadow.color;
    let dsc = destinationLayerItem.style.shadow.color;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsc = {h: dsc.h, s: dsc.s, l: dsc.l, a: 0} as Btwx.Color;
    }
    if (!originShadow.enabled && destinationShadow.enabled) {
      osc = {h: osc.h, s: osc.s, l: osc.l, a: 0} as Btwx.Color;
    }
    eventTimeline.data[tween.layer][tween.prop] = tinyColor({h: osc.h, s: osc.s, l: osc.l, a: osc.a}).toHslString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tinyColor({h: dsc.h, s: dsc.s, l: dsc.l, a: dsc.a}).toHslString(),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        paperLayerRef.shadowColor = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowXOffsetTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osx = originLayerItem.style.shadow.offset.x;
    let dsx = destinationLayerItem.style.shadow.offset.x;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsx = 0;
    }
    if (!originShadow.enabled && destinationShadow.enabled) {
      osx = 0;
    }
    eventTimeline.data[tween.layer][tween.prop] = osx;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: dsx,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        const y = paperLayerRef.shadowOffset ? paperLayerRef.shadowOffset.y : originShadow.offset.y;
        paperLayerRef.shadowOffset = new paperPreview.Point(eventTimeline.data[tween.layer][tween.prop], y);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowYOffsetTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osy = originLayerItem.style.shadow.offset.y;
    let dsy = destinationLayerItem.style.shadow.offset.y;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsy = 0;
    }
    if (!originShadow.enabled && destinationShadow.enabled) {
      osy = 0;
    }
    eventTimeline.data[tween.layer][tween.prop] = osy;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: dsy,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        const x = paperLayerRef.shadowOffset ? paperLayerRef.shadowOffset.x : originShadow.offset.x;
        paperLayerRef.shadowOffset = new paperPreview.Point(x, eventTimeline.data[tween.layer][tween.prop]);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowBlurTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osb = originLayerItem.style.shadow.blur;
    let dsb = destinationLayerItem.style.shadow.blur;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsb = 0;
    }
    if (!originShadow.enabled && destinationShadow.enabled) {
      osb = 0;
    }
    eventTimeline.data[tween.layer][tween.prop] = osb;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: dsb,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textLinesGroup : paperLayer;
        paperLayerRef.shadowBlur = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addOpacityTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style.opacity;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.opacity,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.opacity = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFontSizeTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.fontSize;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.fontSize,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        textLinesGroup.children.forEach((line: paper.PointText) => {
          line.fontSize = eventTimeline.data[tween.layer][tween.prop];
        });
        textBackground.bounds = textLinesGroup.bounds;
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFontWeightTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.fontWeight;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.fontWeight,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        textLinesGroup.children.forEach((line: paper.PointText) => {
          line.fontWeight = eventTimeline.data[tween.layer][tween.prop];
        });
        textBackground.bounds = textLinesGroup.bounds;
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addObliqueTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.oblique;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.oblique,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startSkew = paperLayer.data.skew || paperLayer.data.skew === 0 ? paperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
        const startLeading = paperLayer.data.leading || paperLayer.data.leading === 0 ? paperLayer.data.leading : originTextItem.textStyle.leading;
        paperLayer.rotation = -startRotation;
        textLinesGroup.children.forEach((line: paper.PointText) => {
          // leading affects horizontal skew
          line.leading = line.fontSize;
          line.skew(new paperPreview.Point(startSkew, 0));
          line.skew(new paperPreview.Point(-eventTimeline.data[tween.layer][tween.prop], 0));
          line.leading = startLeading;
        });
        textBackground.bounds = textLinesGroup.bounds;
        paperLayer.data.skew = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addLineHeightTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.leading;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.leading,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startLeading = paperLayer.data.leading || paperLayer.data.leading === 0 ? paperLayer.data.leading : originTextItem.textStyle.leading;
        paperLayer.rotation = -startRotation;
        const diff = eventTimeline.data[tween.layer][tween.prop] - startLeading;
        textLinesGroup.children.forEach((line: paper.PointText, index) => {
          line.leading = eventTimeline.data[tween.layer][tween.prop];
          line.point.y += (diff * index);
        });
        textBackground.bounds = textLinesGroup.bounds;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.data.leading = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addJustificationTween = (): void => {
    const originJustification = (originLayerItem as Btwx.Text).textStyle.justification;
    const destinationJustification = (destinationLayerItem as Btwx.Text).textStyle.justification;
    eventTimeline.data[tween.layer][tween.prop] = 0;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: 1,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startSkew = paperLayer.data.skew || paperLayer.data.skew === 0 ? paperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
        const startLeading = paperLayer.data.leading || paperLayer.data.leading === 0 ? paperLayer.data.leading : (originLayerItem as Btwx.Text).textStyle.leading;
        const startJustification = paperLayer.data.justification;
        // remove rotation
        paperLayer.rotation = -startRotation;
        // update text lines
        if (startJustification) {
          textLinesGroup.children.forEach((line: paper.PointText, index) => {
            const lineGapDiff = paperLayer.data[`${tween.prop}-${index}-diff`];
            const diff = lineGapDiff * (eventTimeline.data[tween.layer][tween.prop] - startJustification);
            // leading affects horizontal skew
            line.leading = line.fontSize;
            line.skew(new paperPreview.Point(startSkew, 0));
            switch(originJustification) {
              case 'left':
                switch(destinationJustification) {
                  case 'center':
                    line.position.x += diff;
                    break;
                  case 'right':
                    line.position.x += diff;
                    break;
                }
                break;
              case 'center':
                switch(destinationJustification) {
                  case 'left':
                    line.position.x -= diff;
                    break;
                  case 'right':
                    line.position.x += diff;
                    break;
                }
                break;
              case 'right':
                switch(destinationJustification) {
                  case 'left':
                    line.position.x -= diff;
                    break;
                  case 'center':
                    line.position.x -= diff;
                    break;
                }
                break;
            }
            line.skew(new paperPreview.Point(-startSkew, 0));
            line.leading = startLeading;
          });
        } else {
          // on start...
          // 1. set justification to destination justification
          //    - makes for less work if there is text tween
          // 2. adjust line positions to match previous positions
          // 3. set line diff and id on paper layer
          // handle content
          let contentStart: number;
          [...Array(maxTextLineCount).keys()].forEach((key, index) => {
            let line = textLinesGroup.children[index] as paper.PointText;
            if (line) {
              line.leading = line.fontSize;
              line.skew(new paperPreview.Point(startSkew, 0));
              if (index === 0) {
                switch(originJustification) {
                  case 'left':
                    contentStart = textLinesGroup.children[0].bounds.left;
                    break;
                  case 'center':
                    contentStart = textLinesGroup.children[0].bounds.center.x;
                    break;
                  case 'right':
                    contentStart = textLinesGroup.children[0].bounds.right;
                    break;
                }
              }
            } else {
              line = new paperPreview.PointText({
                point: new paperPreview.Point(
                  (textLinesGroup.children[0] as paper.PointText).point.x,
                  (textLinesGroup.children[0] as paper.PointText).point.y + (index * startLeading)
                ),
                content: '',
                style: textLinesGroup.children[0].style,
                data: textLinesGroup.children[0].data,
                parent: textLinesGroup
              });
              if (originJustification === 'center') {
                line.bounds[originJustification].x = contentStart;
              } else {
                line.bounds[originJustification] = contentStart;
              }
            }
            // 1. change justification to destination justification
            // 2. add (origin frame  or current lines group) width to lines pointX to offset justification position change
            // 3. get lines diff (longest line width - line width)
            // 4. move lines by diff to visually match origin justtification
            // 5. use diff as tween ref for lines
            line.justification = destinationJustification;
            switch(originJustification) {
              case 'left':
                switch(destinationJustification) {
                  case 'center':
                    line.position.x += (originLayerItem.frame.innerWidth / 2);
                    break;
                  case 'right':
                    line.position.x += originLayerItem.frame.innerWidth;
                    break;
                }
                break;
              case 'center':
                switch(destinationJustification) {
                  case 'left':
                    line.position.x -= (originLayerItem.frame.innerWidth / 2);
                    break;
                  case 'right':
                    line.position.x += (originLayerItem.frame.innerWidth / 2);
                    break;
                }
                break;
              case 'right':
                switch(destinationJustification) {
                  case 'left':
                    line.position.x -= originLayerItem.frame.innerWidth;
                    break;
                  case 'center':
                    line.position.x -= (originLayerItem.frame.innerWidth / 2);
                    break;
                }
                break;
            }
            const lineGap = originLayerItem.frame.innerWidth - line.bounds.width;
            const initialMove = lineGap * eventTimeline.data[tween.layer][tween.prop];
            switch(originJustification) {
              case 'left':
                switch(destinationJustification) {
                  case 'center':
                    line.position.x -= lineGap;
                    line.position.x += initialMove;
                    break;
                  case 'right':
                    line.position.x -= lineGap;
                    line.position.x += initialMove;
                    break;
                }
                break;
              case 'center':
                switch(destinationJustification) {
                  case 'left':
                    line.position.x += lineGap;
                    line.position.x -= initialMove;
                    break;
                  case 'right':
                    line.position.x -= lineGap;
                    line.position.x += initialMove;
                    break;
                }
                break;
              case 'right':
                switch(destinationJustification) {
                  case 'left':
                    line.position.x += lineGap;
                    line.position.x -= initialMove;
                    break;
                  case 'center':
                    line.position.x += lineGap;
                    line.position.x -= initialMove;
                    break;
                }
                break;
            }
            line.skew(new paperPreview.Point(-startSkew, 0));
            line.leading = startLeading;
            paperLayer.data[`${tween.prop}-${index}-diff`] = lineGap;
          });
        }
        // if (destinationJustification === 'center') {
        //   textBackground.bounds[destinationJustification].x = textLinesGroup.bounds[destinationJustification].x;
        // } else {
        //   textBackground.bounds[destinationJustification] = textLinesGroup.bounds[destinationJustification];
        // }
        // apply rotation
        textBackground.bounds = textLinesGroup.bounds;
        paperLayer.rotation = startRotation;
        paperLayer.data.justification = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addTextTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    const textLinesTimeline = gsap.timeline({id: tweenId});
    [...Array(maxTextLineCount).keys()].forEach((line, index) => {
      const textDOM = document.getElementById(`${originTextItem.id}-${index}`);
      textLinesTimeline.to(textDOM, {
        duration: tween.duration,
        ...(() => {
          return tween.text.scramble
          ? {
              scrambleText: {
                text: destinationTextItem.lines[index] ? destinationTextItem.lines[index].text : '',
                chars: tween.scrambleText.characters === 'custom' ? tween.scrambleText.customCharacters : tween.scrambleText.characters,
                revealDelay: tween.scrambleText.revealDelay,
                speed: tween.scrambleText.speed,
                delimiter: tween.scrambleText.delimiter,
                rightToLeft: tween.scrambleText.rightToLeft
              }
            }
          : {
              text: {
                value: destinationTextItem.lines[index] ? destinationTextItem.lines[index].text : '',
                delimiter: tween.text.delimiter,
                speed: tween.text.speed,
                type: tween.text.diff ? 'diff' : null
              }
            }
        })(),
        onUpdate: () => {
          const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
          const startLeading = paperLayer.data.leading || paperLayer.data.leading === 0 ? paperLayer.data.leading : (originLayerItem as Btwx.Text).textStyle.leading;
          const textLine = textLinesGroup.children[index] as paper.PointText;
          const firstLine = textLinesGroup.children[0] as paper.PointText;
          const startSkew = paperLayer.data.skew || paperLayer.data.skew === 0 ? paperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
          paperLayer.rotation = -startRotation;
          if (textLine) {
            textLine.content = textDOM.innerText;
          } else {
            const point = new paperPreview.Point(firstLine.point.x, firstLine.point.y + (index * startLeading));
            const newLine = new paperPreview.PointText({
              point: point,
              content: textDOM.innerText,
              style: textLinesGroup.children[0].style,
              data: textLinesGroup.children[0].data,
              parent: textLinesGroup
            });
            newLine.leading = newLine.fontSize;
            newLine.skew(new paperPreview.Point(-startSkew, 0));
            newLine.leading = startLeading;
          }
          textBackground.bounds = textLinesGroup.bounds;
          paperLayer.rotation = startRotation;
          paperLayer.data[`text-${index}`] = textDOM.innerText;
          updateGradients({ paperLayer, textLinesGroup, textBackground });
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(textLinesTimeline, 0);
  };

  const addLetterSpacingTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.letterSpacing;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.letterSpacing,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        textLinesGroup.children.forEach((line: paper.PointText, index) => {
          line.letterSpacing = eventTimeline.data[tween.layer][tween.prop];
        });
        textBackground.bounds = textLinesGroup.bounds;
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFromXTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.from.x - originLineItem.from.x;
    eventTimeline.data[tween.layer][tween.prop] = originLineItem.from.x + originArtboardItem.frame.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFromYTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.from.y - originLineItem.from.y;
    eventTimeline.data[tween.layer][tween.prop] = originLineItem.from.y + originArtboardItem.frame.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addToXTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.to.x - originLineItem.to.x;
    eventTimeline.data[tween.layer][tween.prop] = originLineItem.to.x + originArtboardItem.frame.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addToYTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.to.y - originLineItem.to.y;
    eventTimeline.data[tween.layer][tween.prop] = originLineItem.to.y + originArtboardItem.frame.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textLinesGroup, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addPointXTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    const originJustification = originTextItem.textStyle.justification;
    const destinationJustification = destinationTextItem.textStyle.justification;
    let start: number;
    const end = destinationTextItem.point.x;
    switch(originJustification) {
      case 'left':
        switch(destinationJustification) {
          case 'left':
            start = originTextItem.point.x;
            break;
          case 'center':
            start = originTextItem.point.x + (originTextItem.frame.innerWidth / 2);
            break;
          case 'right':
            start = originTextItem.point.x + originTextItem.frame.innerWidth;
            break;
        }
        break;
      case 'center':
        switch(destinationJustification) {
          case 'left':
            start = originTextItem.point.x - (originTextItem.frame.innerWidth / 2);
            break;
          case 'center':
            start = originTextItem.point.x;
            break;
          case 'right':
            start = originTextItem.point.x + (originTextItem.frame.innerWidth / 2)
            break;
        }
        break;
      case 'right':
        switch(destinationJustification) {
          case 'left':
            start = originTextItem.point.x - originTextItem.frame.innerWidth;
            break;
          case 'center':
            start = originTextItem.point.x - (originTextItem.frame.innerWidth / 2);
            break;
          case 'right':
            start = originTextItem.point.x;
            break;
        }
        break;
    }
    const diff = end - start;
    eventTimeline.data[tween.layer][tween.prop] = 0;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: 1,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startX = paperLayer.data.x || paperLayer.data.x === 0 ? paperLayer.data.x : 0;
        const xDiff = diff * (eventTimeline.data[tween.layer][tween.prop] - startX);
        paperLayer.rotation = -startRotation;
        paperLayer.position.x += xDiff;
        paperLayer.rotation = startRotation;
        paperLayer.data.x = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addPointYTween = (): void => {
    const yPointDiff = (destinationLayerItem as Btwx.Text).point.y - (originLayerItem as Btwx.Text).point.y;
    eventTimeline.data[tween.layer][tween.prop] = (originLayerItem as Btwx.Text).point.y + originArtboardItem.frame.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${yPointDiff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        const diff = eventTimeline.data[tween.layer][tween.prop] - (textLinesGroup.children[0] as paper.PointText).point.y;
        paperLayer.position.y += diff;
        paperLayer.rotation = startRotation;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  useEffect(() => {
    if (gsap.getById(tweenId)) {
      eventLayerTimeline.remove(gsap.getById(tweenId));
    }
    switch(tween.prop) {
      case 'image':
      addImageTween();
      break;
    case 'shape':
      addShapeTween();
      break;
    case 'fill':
      addFSTween('fill');
      break;
    case 'fillGradientOriginX':
      addGradientOriginXFSTween('fill');
      break;
    case 'fillGradientOriginY':
      addGradientOriginYFSTween('fill');
      break;
    case 'fillGradientDestinationX':
      addGradientDestinationXFSTween('fill');
      break;
    case 'fillGradientDestinationY':
      addGradientDestinationYFSTween('fill');
      break;
    case 'stroke':
      addFSTween('stroke');
      break;
    case 'strokeGradientOriginX':
      addGradientOriginXFSTween('stroke');
      break;
    case 'strokeGradientOriginY':
      addGradientOriginYFSTween('stroke');
      break;
    case 'strokeGradientDestinationX':
      addGradientDestinationXFSTween('stroke');
      break;
    case 'strokeGradientDestinationY':
      addGradientDestinationYFSTween('stroke');
      break;
    case 'dashOffset':
      addDashOffsetTween();
      break;
    case 'dashArrayWidth':
      addDashArrayWidthTween();
      break;
    case 'dashArrayGap':
      addDashArrayGapTween();
      break;
    case 'strokeWidth':
      addStrokeWidthTween();
      break;
    case 'x':
      addXTween();
      break;
    case 'y':
      addYTween();
      break;
    case 'width':
      addWidthTween();
      break;
    case 'height':
      addHeightTween();
      break;
    case 'rotation':
      addRotationTween();
      break;
    case 'shadowColor':
      addShadowColorTween();
      break;
    case 'shadowOffsetX':
      addShadowXOffsetTween();
      break;
    case 'shadowOffsetY':
      addShadowYOffsetTween();
      break;
    case 'shadowBlur':
      addShadowBlurTween();
      break;
    case 'opacity':
      addOpacityTween();
      break;
    case 'fontSize':
      addFontSizeTween();
      break;
    case 'fontWeight':
      addFontWeightTween();
      break;
    case 'letterSpacing':
      addLetterSpacingTween();
      break;
    case 'oblique':
      addObliqueTween();
      break;
    case 'lineHeight':
      addLineHeightTween();
      break;
    case 'justification':
      addJustificationTween();
      break;
    case 'text':
      addTextTween();
      break;
    case 'fromX':
      addFromXTween();
      break;
    case 'fromY':
      addFromYTween();
      break;
    case 'toX':
      addToXTween();
      break;
    case 'toY':
      addToYTween();
      break;
    case 'pointX':
      addPointXTween();
      break;
    case 'pointY':
      addPointYTween();
      break;
    }
  }, [tween]);

  return (
    <>
      {
        originLayerItem.type === 'Text'
        ? <>
            {
              [...Array(maxTextLineCount).keys()].map((line, index) => (
                <div
                  id={`${originLayerItem.id}-${index}`}
                  key={index}
                  style={{
                    zIndex: -999999999999,
                    position: 'absolute',
                    left: -999999999999
                  }}>
                  {
                    (originLayerItem as Btwx.Text).lines[index]
                    ? (originLayerItem as Btwx.Text).lines[index].text
                    : ' '
                  }
                </div>
              ))
            }
          </>
        : null
      }
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasPreviewLayerTweenProps): CanvasPreviewLayerTweenStateProps => {
  const tween = state.layer.present.tweens.byId[ownProps.tweenId];
  const event = state.layer.present.events.byId[tween.event];
  const originLayerItem = state.layer.present.byId[tween.layer];
  const destinationLayerItem = state.layer.present.byId[tween.destinationLayer];
  const originArtboardItem = state.layer.present.byId[event.artboard] as Btwx.Artboard;
  const destinationArtboardItem = state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard;
  const documentImages = state.documentSettings.images.byId;
  const originImage = originLayerItem.type === 'Image' ? documentImages[(originLayerItem as Btwx.Image).imageId] : null;
  const destinationImage = destinationLayerItem.type === 'Image' ? documentImages[(destinationLayerItem as Btwx.Image).imageId] : null;
  const maxTextLineCount = originLayerItem.type === 'Text' ? Math.max((originLayerItem as Btwx.Text).lines.length, (destinationLayerItem as Btwx.Text).lines.length) : null;
  return {
    tween,
    originLayerItem,
    destinationLayerItem,
    originArtboardItem,
    destinationArtboardItem,
    originImage,
    destinationImage,
    maxTextLineCount
  }
}

export default connect(
  mapStateToProps
)(CanvasPreviewLayerTween);