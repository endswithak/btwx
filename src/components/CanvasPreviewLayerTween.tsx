/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { getTransformedText } from '../utils';
import { positionTextContent } from '../store/utils/paper';
import { EventLayerTimelineData } from './CanvasPreviewLayerEvent';
import { getParagraphs, getContent } from './CanvasTextLayer';

gsap.registerPlugin(MorphSVGPlugin, RoughEase, SlowMo, CustomBounce, CustomWiggle, ScrambleTextPlugin, TextPlugin);

interface CanvasPreviewLayerTweenProps {
  tweenId: string;
  eventTimeline: gsap.core.Timeline;
}

const CanvasPreviewLayerTween = (props: CanvasPreviewLayerTweenProps): ReactElement => {
  const { eventTimeline, tweenId } = props;
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const event = useSelector((state: RootState) => state.layer.present.events.byId[tween.event]);
  const originLayerItem = useSelector((state: RootState) => state.layer.present.byId[tween.layer]);
  const destinationLayerItem = useSelector((state: RootState) => state.layer.present.byId[tween.destinationLayer]);
  const originArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.artboard] as Btwx.Artboard);
  const destinationArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard);
  const documentImages = useSelector((state: RootState) => state.documentSettings.images.byId);
  const originImage = originLayerItem.type === 'Image' ? documentImages[(originLayerItem as Btwx.Image).imageId] : null;
  const destinationImage = destinationLayerItem.type === 'Image' ? documentImages[(destinationLayerItem as Btwx.Image).imageId] : null;
  const [eventLayerTimeline, setEventLayerTimeline] = useState(null);

  const getEaseString = (tween: Btwx.Tween): string => {
    switch(tween.ease) {
      case 'customBounce':
        return `bounce({strength: ${tween.customBounce.strength}, endAtStart: ${tween.customBounce.endAtStart}, squash: ${tween.customBounce.squash}})`;
      case 'customWiggle':
        return `wiggle({type: ${tween.customWiggle.type}, wiggles: ${tween.customWiggle.wiggles}})`;
      case 'slow':
        return `slow(${tween.slow.linearRatio}, ${tween.slow.power}, ${tween.slow.yoyoMode})`;
      case 'rough':
        return tween.rough.ref; // `rough({clamp: ${tween.rough.clamp}, points: ${tween.rough.points}, randomize: ${tween.rough.randomize}, strength: ${tween.rough.strength}, taper: ${tween.rough.taper}, template: ${tween.rough.template}})`;
      case 'steps':
        return `steps(${tween.steps.steps})`;
      default:
        return `${tween.ease}.${tween.power}`;
    }
  }

  const updateGradients = (paperLayers: { paperLayer: paper.Item; textContent: paper.AreaText; textBackground: paper.Path.Rectangle }): void => {
    const { paperLayer, textContent, textBackground } = paperLayers;
    const isText = originLayerItem.type === 'Text';
    const textLines = isText ? paperLayer.getItem({data: {id: 'textLines'}}) : null;
    const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    ['fill', 'stroke'].forEach((style: 'fill' | 'stroke') => {
      if (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] && paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient || isText && textContent[`${style}Color` as 'fillColor' | 'strokeColor'] && textContent[`${style}Color` as 'fillColor' | 'strokeColor'].gradient) {
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (isOriginLayerLine ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (isOriginLayerLine ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = paperLayer.data[`${style}GradientOriginX`] ? paperLayer.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
        const originXEase = paperLayer.data[`${style}GradientOriginX-ease`] ? paperLayer.data[`${style}GradientOriginX-ease`] : null;
        const nextOriginX = originXEase && originXEase === 'customWiggle' ? originX : (originX * innerWidth) + paperLayer.position.x;
        const originY = paperLayer.data[`${style}GradientOriginY`] ? paperLayer.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
        const originYEase = paperLayer.data[`${style}GradientOriginY-ease`] ? paperLayer.data[`${style}GradientOriginY-ease`] : null;
        const nextOriginY = originYEase && originYEase === 'customWiggle' ? originY : (originY * innerHeight) + paperLayer.position.y;
        const destinationX = paperLayer.data[`${style}GradientDestinationX`] ? paperLayer.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
        const destinationXEase = paperLayer.data[`${style}GradientDestinationX-ease`] ? paperLayer.data[`${style}GradientDestinationX-ease`] : null;
        const nextDestinationX = destinationXEase && destinationXEase === 'customWiggle' ? destinationX : (destinationX * innerWidth) + paperLayer.position.x;
        const destinationY = paperLayer.data[`${style}GradientDestinationY`] ? paperLayer.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
        const destinationYEase = paperLayer.data[`${style}GradientDestinationY-ease`] ? paperLayer.data[`${style}GradientDestinationY-ease`] : null;
        const nextDestinationY = destinationYEase && destinationYEase === 'customWiggle' ? destinationY : (destinationY * innerHeight) + paperLayer.position.y;
        const nextOrigin = new paperPreview.Point(nextOriginX, nextOriginY);
        const nextDestination = new paperPreview.Point(nextDestinationX, nextDestinationY);
        if (isText) {
          (textContent[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
          (textContent[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
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
      onStart: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
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
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
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
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
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
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style.fill.color;
    const dfc = destinationLayerItem.style.fill.color;
    eventTimeline.data[tween.layer][tween.prop] = tinyColor(ofc).toRgbString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? tinyColor(tween.customWiggle.strength).toRgbString() : tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: dfc.a}).toRgbString(),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventTimeline.data[tween.layer][tween.prop];
        switch(originLayerItem.type) {
          case 'Artboard':
            artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
            break;
          case 'Text':
            textContent[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
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
    eventTimeline.data[tween.layer][tween.prop] = tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: 0}).toRgbString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tinyColor(dfc).toRgbString(),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventTimeline.data[tween.layer][tween.prop];
        switch(originLayerItem.type) {
          case 'Artboard':
            artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
            break;
          case 'Text':
            textContent[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
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
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventTimeline.data[tween.layer][tween.prop];
        switch(originLayerItem.type) {
          case 'Artboard':
            artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = nextFS;
            break;
          case 'Text':
            textContent[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = nextFS;
            break;
          default:
            paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = nextFS;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginXFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = tween.ease === 'customWiggle' ? (originLayerItem.style[style].gradient.origin.x * originLayerItem.frame.innerWidth) + originLayerItem.frame.x + (originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.x : 0) : originLayerItem.style[style].gradient.origin.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.origin.x,
      onStart: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.data[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const nextOriginX = tween.ease === 'customWiggle' ? eventTimeline.data[tween.layer][tween.prop] : (eventTimeline.data[tween.layer][tween.prop] * innerWidth) + paperLayer.position.x;
        const originY = paperLayer.data[`${style}GradientOriginY`] ? paperLayer.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
        const originYEase = paperLayer.data[`${style}GradientOriginY-ease`] ? paperLayer.data[`${style}GradientOriginY-ease`] : null;
        const nextOriginY = originYEase === 'customWiggle' ? originY : (originY * innerHeight) + paperLayer.position.y;
        const nextOrigin = new paperPreview.Point(nextOriginX, nextOriginY);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            break;
          case 'Text':
            (textContent[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        }
        paperLayer.data[tween.prop] = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginYFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = tween.ease === 'customWiggle' ? (originLayerItem.style[style].gradient.origin.y * originLayerItem.frame.innerHeight) + originLayerItem.frame.y + (originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.y : 0) : originLayerItem.style[style].gradient.origin.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.origin.y,
      onStart: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.data[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = paperLayer.data[`${style}GradientOriginX`] ? paperLayer.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
        const originXEase = paperLayer.data[`${style}GradientOriginX-ease`] ? paperLayer.data[`${style}GradientOriginX-ease`] : null;
        const nextOriginX = originXEase === 'customWiggle' ? originX : (originX * innerWidth) + paperLayer.position.x;
        const nextOriginY = tween.ease === 'customWiggle' ? eventTimeline.data[tween.layer][tween.prop] : (eventTimeline.data[tween.layer][tween.prop] * innerHeight) + paperLayer.position.y;
        const nextOrigin = new paperPreview.Point(nextOriginX, nextOriginY);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            break;
          case 'Text':
            (textContent[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        }
        paperLayer.data[tween.prop] = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationXFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = tween.ease === 'customWiggle' ? (originLayerItem.style[style].gradient.destination.x * originLayerItem.frame.innerWidth) + originLayerItem.frame.x + (originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.x : 0) : originLayerItem.style[style].gradient.destination.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.destination.x,
      onStart: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.data[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const nextDestinationX = tween.ease === 'customWiggle' ? eventTimeline.data[tween.layer][tween.prop] : (eventTimeline.data[tween.layer][tween.prop] * innerWidth) + paperLayer.position.x;
        const destinationY = paperLayer.data[`${style}GradientDestinationY`] ? paperLayer.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
        const destinationYEase = paperLayer.data[`${style}GradientDestinationY-ease`] ? paperLayer.data[`${style}GradientDestinationY-ease`] : null;
        const nextDestinationY = destinationYEase === 'customWiggle' ? destinationY : (destinationY * innerHeight) + paperLayer.position.y;
        const nextDestination = new paperPreview.Point(nextDestinationX, nextDestinationY);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            break;
          case 'Text':
            (textContent[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        }
        paperLayer.data[tween.prop] = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationYFSTween = (style: 'fill' | 'stroke'): void => {
    eventTimeline.data[tween.layer][tween.prop] = tween.ease === 'customWiggle' ? (originLayerItem.style[style].gradient.destination.y * originLayerItem.frame.innerHeight) + originLayerItem.frame.y + (originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.y : 0) : originLayerItem.style[style].gradient.destination.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.destination.y,
      onStart: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.data[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const innerWidth = paperLayer.data.innerWidth ? paperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = paperLayer.data.innerHeight ? paperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const destinationX = paperLayer.data[`${style}GradientDestinationX`] ? paperLayer.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
        const destinationXEase = paperLayer.data[`${style}GradientDestinationX-ease`] ? paperLayer.data[`${style}GradientDestinationX-ease`] : null;
        const nextDestinationX = destinationXEase === 'customWiggle' ? destinationX : (destinationX * innerWidth) + paperLayer.position.x;
        const nextDestinationY = tween.ease === 'customWiggle' ? eventTimeline.data[tween.layer][tween.prop] : (eventTimeline.data[tween.layer][tween.prop] * innerHeight) + paperLayer.position.y;
        const nextDestination = new paperPreview.Point(nextDestinationX, nextDestinationY);
        switch(originLayerItem.type) {
          case 'Artboard':
            (artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            break;
          case 'Text':
            (textContent[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
            break;
          default:
            (paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        }
        paperLayer.data[tween.prop] = eventTimeline.data[tween.layer][tween.prop];
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
          const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const stopDiff = destinationStopCount - originStopCount;
          const paperLayerRef = isText ? textContent : isArtboard ? artboardBackground : paperLayer;
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
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = tinyColor(sc).toRgbString();
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-offset`] = sp;
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tween.ease === 'customWiggle' ? tinyColor(tween.customWiggle.strength).toRgbString() : tinyColor(dc).toRgbString(),
        [`${tween.prop}-stop-${index}-offset`]: dp,
        onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextStopColor = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          const nextStopOffset = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-offset`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextStopColor;
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = nextStopOffset;
              break;
            case 'Text':
              textContent[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextStopColor;
              textContent[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = nextStopOffset;
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
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = tinyColor(sc).toRgbString();
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor(dc).toRgbString(),
        onUpdate: () => {
          const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
              break;
            case 'Text':
              textContent[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
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
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : isArtboard ? artboardBackground : paperLayer;
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
                new paperPreview.Color(tinyColor(oc).toRgbString()),
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
      eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`] = tinyColor(oc).toRgbString();
      stopsTimeline.to(eventTimeline.data[tween.layer], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor(sc).toRgbString(),
        onUpdate: () => {
          const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
              break;
            case 'Text':
              textContent[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
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
          const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
              break;
            case 'Text':
              textContent[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
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
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.data[`${style}GradientOriginX`] = dg.origin.x;
        paperLayer.data[`${style}GradientOriginY`] = dg.origin.y;
        paperLayer.data[`${style}GradientDestinationX`] = dg.destination.x;
        paperLayer.data[`${style}GradientDestinationY`] = dg.destination.y;
        // set origin layer styleColor to destination layer gradient with opaque stops
        const paperLayerRef = isText ? textContent : isArtboard ? artboardBackground : paperLayer;
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
          const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventTimeline.data[tween.layer][`${tween.prop}-stop-${index}-color`];
          switch(originLayerItem.type) {
            case 'Artboard':
              artboardBackground[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
              break;
            case 'Text':
              textContent[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashOffset,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashArray[0],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashArray[1],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.stroke.width,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
        paperLayerRef.strokeWidth = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addXTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.x + originArtboardItem.frame.x;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationLayerItem.frame.x - originLayerItem.frame.x}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.x = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addYTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.y + originArtboardItem.frame.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: `+=${tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationLayerItem.frame.y - originLayerItem.frame.y}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.y = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  // 1. better handling for < 1px text bounds updates
  // 2. figure out how to handle justification w/ text tweens
  // 3. do I even need to store props in data if I can get it from tween object?
  // 4.

  const addWidthTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.innerWidth;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.frame.innerWidth,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startPosition = paperLayer.position;
        paperLayer.rotation = -startRotation;
        if (originLayerItem.type === 'Text') {
          textContent.size = new paperPreview.Size(eventTimeline.data[tween.layer][tween.prop], textContent.size.height);
        } else {
          paperLayer.bounds.width = eventTimeline.data[tween.layer][tween.prop];
        }
        paperLayer.data.innerWidth = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.rotation = startRotation;
        paperLayer.position = startPosition;
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded' && destinationLayerItem.type === 'Shape' && (destinationLayerItem as Btwx.Shape).shapeType === 'Rounded') {
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
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addHeightTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.innerHeight;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.frame.innerHeight,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        const startPosition = paperLayer.position;
        paperLayer.rotation = -startRotation;
        if (originLayerItem.type === 'Text') {
          textContent.size = new paperPreview.Size(textContent.size.width, eventTimeline.data[tween.layer][tween.prop]);
        } else {
          paperLayer.bounds.height = eventTimeline.data[tween.layer][tween.prop];
        }
        paperLayer.data.innerHeight = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.rotation = startRotation;
        paperLayer.position = startPosition;
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded' && destinationLayerItem.type === 'Shape' && (destinationLayerItem as Btwx.Shape).shapeType === 'Rounded') {
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
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addRotationTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.transform.rotation;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.transform.rotation,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        paperLayer.rotation = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.rotation = eventTimeline.data[tween.layer][tween.prop];
        updateGradients({ paperLayer, textContent, textBackground });
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
    eventTimeline.data[tween.layer][tween.prop] = tinyColor(osc).toRgbString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? tinyColor(tween.customWiggle.strength).toRgbString() : tinyColor({h: dsc.h, s: dsc.s, l: dsc.l, a: dsc.a}).toRgbString(),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : dsx,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : dsy,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : dsb,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.opacity,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.opacity = eventTimeline.data[tween.layer][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addBlurTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.style.blur.enabled ? originLayerItem.style.blur.blur : 0;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : (destinationLayerItem.style.blur.enabled ? destinationLayerItem.style.blur.blur : 0),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.style.blur = eventTimeline.data[tween.layer][tween.prop];
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.fontSize,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        textContent.fontSize = eventTimeline.data[tween.layer][tween.prop];
        textBackground.bounds = textContent.bounds;
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textContent, textBackground });
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
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        textContent.fontWeight = eventTimeline.data[tween.layer][tween.prop];
        textBackground.bounds = textContent.bounds;
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  // const addObliqueTween = (): void => {
  //   const originTextItem = originLayerItem as Btwx.Text;
  //   const destinationTextItem = destinationLayerItem as Btwx.Text;
  //   eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.oblique;
  //   eventLayerTimeline.to(eventTimeline.data[tween.layer], {
  //     id: tweenId,
  //     duration: tween.duration,
  //     [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.oblique,
  //     onUpdate: () => {
  //       // const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
  //       const startSkew = paperLayer.data.skew || paperLayer.data.skew === 0 ? paperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
  //       const startLeading = paperLayer.data.leading || paperLayer.data.leading === 0 ? paperLayer.data.leading : originTextItem.textStyle.leading;
  //       paperLayer.rotation = -startRotation;
  //       textContent.leading = line.fontSize;
  //       textContent.skew(new paperPreview.Point(startSkew, 0));
  //       textContent.skew(new paperPreview.Point(-eventTimeline.data[tween.layer][tween.prop], 0));
  //       textContent.leading = line.fontSize;
  //       // textLinesGroup.children.forEach((line: paper.PointText) => {
  //       //   // leading affects horizontal skew
  //       //   line.leading = line.fontSize;
  //       //   line.skew(new paperPreview.Point(startSkew, 0));
  //       //   line.skew(new paperPreview.Point(-eventTimeline.data[tween.layer][tween.prop], 0));
  //       //   line.leading = startLeading;
  //       // });
  //       textBackground.bounds = textLinesGroup.bounds;
  //       paperLayer.data.skew = eventTimeline.data[tween.layer][tween.prop];
  //       paperLayer.rotation = startRotation;
  //       // updateGradients({ paperLayer, textLinesGroup, textBackground });
  //       updateGradients({ paperLayer, textContent, textBackground });
  //     },
  //     ease: getEaseString(tween),
  //   }, tween.delay);
  // };

  const addLineHeightTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.leading;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.leading,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        textContent.leading = eventTimeline.data[tween.layer][tween.prop];
        textBackground.bounds = textContent.bounds;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.data.leading = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addJustificationTween = (): void => {
    return;
  };

  // const addJustificationTween = (): void => {
  //   const originJustification = (originLayerItem as Btwx.Text).textStyle.justification;
  //   const destinationJustification = (destinationLayerItem as Btwx.Text).textStyle.justification;
  //   eventTimeline.data[tween.layer][tween.prop] = 0;
  //   eventLayerTimeline.to(eventTimeline.data[tween.layer], {
  //     id: tweenId,
  //     duration: tween.duration,
  //     [tween.prop]: 1,
  //     onUpdate: () => {
  //       // const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
  //       const startSkew = paperLayer.data.skew || paperLayer.data.skew === 0 ? paperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
  //       const startLeading = paperLayer.data.leading || paperLayer.data.leading === 0 ? paperLayer.data.leading : (originLayerItem as Btwx.Text).textStyle.leading;
  //       const startJustification = paperLayer.data.justification;
  //       // remove rotation
  //       paperLayer.rotation = -startRotation;
  //       // update text lines
  //       if (startJustification) {
  //         textLinesGroup.children.forEach((line: paper.PointText, index) => {
  //           const lineGapDiff = paperLayer.data[`${tween.prop}-${index}-diff`];
  //           const diff = lineGapDiff * (eventTimeline.data[tween.layer][tween.prop] - startJustification);
  //           // leading affects horizontal skew
  //           line.leading = line.fontSize;
  //           line.skew(new paperPreview.Point(startSkew, 0));
  //           switch(originJustification) {
  //             case 'left':
  //               switch(destinationJustification) {
  //                 case 'center':
  //                   line.position.x += diff;
  //                   break;
  //                 case 'right':
  //                   line.position.x += diff;
  //                   break;
  //               }
  //               break;
  //             case 'center':
  //               switch(destinationJustification) {
  //                 case 'left':
  //                   line.position.x -= diff;
  //                   break;
  //                 case 'right':
  //                   line.position.x += diff;
  //                   break;
  //               }
  //               break;
  //             case 'right':
  //               switch(destinationJustification) {
  //                 case 'left':
  //                   line.position.x -= diff;
  //                   break;
  //                 case 'center':
  //                   line.position.x -= diff;
  //                   break;
  //               }
  //               break;
  //           }
  //           line.skew(new paperPreview.Point(-startSkew, 0));
  //           line.leading = startLeading;
  //         });
  //       } else {
  //         // on start...
  //         // 1. set justification to destination justification
  //         //    - makes for less work if there is text tween
  //         // 2. adjust line positions to match previous positions
  //         // 3. set line diff and id on paper layer
  //         // handle content
  //         let contentStart: number;
  //         [...Array(maxTextLineCount).keys()].forEach((key, index) => {
  //           let line = textLinesGroup.children[index] as paper.PointText;
  //           if (line) {
  //             line.leading = line.fontSize;
  //             line.skew(new paperPreview.Point(startSkew, 0));
  //             if (index === 0) {
  //               switch(originJustification) {
  //                 case 'left':
  //                   contentStart = textLinesGroup.children[0].bounds.left;
  //                   break;
  //                 case 'center':
  //                   contentStart = textLinesGroup.children[0].bounds.center.x;
  //                   break;
  //                 case 'right':
  //                   contentStart = textLinesGroup.children[0].bounds.right;
  //                   break;
  //               }
  //             }
  //           } else {
  //             line = new paperPreview.PointText({
  //               point: new paperPreview.Point(
  //                 (textLinesGroup.children[0] as paper.PointText).point.x,
  //                 (textLinesGroup.children[0] as paper.PointText).point.y + (index * startLeading)
  //               ),
  //               content: '',
  //               style: textLinesGroup.children[0].style,
  //               data: textLinesGroup.children[0].data,
  //               parent: textLinesGroup
  //             });
  //             if (originJustification === 'center') {
  //               line.bounds[originJustification].x = contentStart;
  //             } else {
  //               line.bounds[originJustification] = contentStart;
  //             }
  //           }
  //           // 1. change justification to destination justification
  //           // 2. add (origin frame  or current lines group) width to lines pointX to offset justification position change
  //           // 3. get lines diff (longest line width - line width)
  //           // 4. move lines by diff to visually match origin justtification
  //           // 5. use diff as tween ref for lines
  //           line.justification = destinationJustification;
  //           switch(originJustification) {
  //             case 'left':
  //               switch(destinationJustification) {
  //                 case 'center':
  //                   line.position.x += (originLayerItem.frame.innerWidth / 2);
  //                   break;
  //                 case 'right':
  //                   line.position.x += originLayerItem.frame.innerWidth;
  //                   break;
  //               }
  //               break;
  //             case 'center':
  //               switch(destinationJustification) {
  //                 case 'left':
  //                   line.position.x -= (originLayerItem.frame.innerWidth / 2);
  //                   break;
  //                 case 'right':
  //                   line.position.x += (originLayerItem.frame.innerWidth / 2);
  //                   break;
  //               }
  //               break;
  //             case 'right':
  //               switch(destinationJustification) {
  //                 case 'left':
  //                   line.position.x -= originLayerItem.frame.innerWidth;
  //                   break;
  //                 case 'center':
  //                   line.position.x -= (originLayerItem.frame.innerWidth / 2);
  //                   break;
  //               }
  //               break;
  //           }
  //           const lineGap = originLayerItem.frame.innerWidth - line.bounds.width;
  //           const initialMove = lineGap * eventTimeline.data[tween.layer][tween.prop];
  //           switch(originJustification) {
  //             case 'left':
  //               switch(destinationJustification) {
  //                 case 'center':
  //                   line.position.x -= lineGap;
  //                   line.position.x += initialMove;
  //                   break;
  //                 case 'right':
  //                   line.position.x -= lineGap;
  //                   line.position.x += initialMove;
  //                   break;
  //               }
  //               break;
  //             case 'center':
  //               switch(destinationJustification) {
  //                 case 'left':
  //                   line.position.x += lineGap;
  //                   line.position.x -= initialMove;
  //                   break;
  //                 case 'right':
  //                   line.position.x -= lineGap;
  //                   line.position.x += initialMove;
  //                   break;
  //               }
  //               break;
  //             case 'right':
  //               switch(destinationJustification) {
  //                 case 'left':
  //                   line.position.x += lineGap;
  //                   line.position.x -= initialMove;
  //                   break;
  //                 case 'center':
  //                   line.position.x += lineGap;
  //                   line.position.x -= initialMove;
  //                   break;
  //               }
  //               break;
  //           }
  //           line.skew(new paperPreview.Point(-startSkew, 0));
  //           line.leading = startLeading;
  //           paperLayer.data[`${tween.prop}-${index}-diff`] = lineGap;
  //         });
  //       }
  //       // if (destinationJustification === 'center') {
  //       //   textBackground.bounds[destinationJustification].x = textLinesGroup.bounds[destinationJustification].x;
  //       // } else {
  //       //   textBackground.bounds[destinationJustification] = textLinesGroup.bounds[destinationJustification];
  //       // }
  //       // apply rotation
  //       textBackground.bounds = textLinesGroup.bounds;
  //       paperLayer.rotation = startRotation;
  //       paperLayer.data.justification = eventTimeline.data[tween.layer][tween.prop];
  //     },
  //     ease: getEaseString(tween),
  //   }, tween.delay);
  // };

  const addTextTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    const textDOM = document.getElementById(`${originTextItem.id}-text-tween`);
    eventLayerTimeline.to(textDOM, {
      id: tweenId,
      duration: tween.duration,
      ...tween.text.scramble ? {
          scrambleText: {
            text: tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationTextItem.text ? getTransformedText(destinationTextItem.text, destinationTextItem.textStyle.textTransform) : '',
            chars: tween.scrambleText.characters === 'custom' ? tween.scrambleText.customCharacters : tween.scrambleText.characters,
            revealDelay: tween.scrambleText.revealDelay,
            speed: tween.scrambleText.speed,
            delimiter: tween.scrambleText.delimiter,
            rightToLeft: tween.scrambleText.rightToLeft
          }
        }
      : {
          text: {
            value: tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationTextItem.text ? getTransformedText(destinationTextItem.text, destinationTextItem.textStyle.textTransform) : '',
            delimiter: tween.text.delimiter,
            speed: tween.text.speed,
            type: tween.text.diff ? 'diff' : null
          }
        },
      onComplete: () => {
        textDOM.innerHTML = (originLayerItem as Btwx.Text).text
        ? getTransformedText(
            (originLayerItem as Btwx.Text).text,
            (originLayerItem as Btwx.Text).textStyle.textTransform
          )
        : ''
      },
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        // get next paragraphs
        const nextParagraphs = getParagraphs({
          text: textDOM.innerText,
          fontSize: textContent.fontSize as number,
          fontWeight: textContent.fontWeight as number,
          fontFamily: textContent.fontFamily,
          textResize: (originLayerItem as Btwx.Text).textStyle.textResize,
          innerWidth: textBackground.bounds.width,
          letterSpacing: textContent.letterSpacing as number,
          textTransform: textContent.textTransform,
          fontStyle: textContent.fontStyle
        });
        // get next content
        const nextContent = getContent({
          paragraphs: nextParagraphs
        });
        textContent.content = nextContent;
        // positionTextContent({
        //   paperLayer: paperLayer as paper.Group,
        //   verticalAlignment: (originLayerItem as Btwx.Text).textStyle.verticalAlignment,
        //   justification: (originLayerItem as Btwx.Text).textStyle.justification,
        //   textResize: (originLayerItem as Btwx.Text).textStyle.textResize
        // });
        // textBackground.bounds = textContent.bounds;
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addLetterSpacingTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tween.layer][tween.prop] = originTextItem.textStyle.letterSpacing;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.letterSpacing,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
        paperLayer.rotation = -startRotation;
        textContent.letterSpacing = eventTimeline.data[tween.layer][tween.prop];
        textBackground.bounds = textContent.bounds;
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        paperLayer.rotation = startRotation;
        updateGradients({ paperLayer, textContent, textBackground });
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textContent, textBackground });
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textContent, textBackground });
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textContent, textBackground });
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
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : `+=${diff}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        ((paperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.data.innerWidth = paperLayer.bounds.width;
        paperLayer.data.innerHeight = paperLayer.bounds.height;
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  // const addPointXTween = (): void => {
  //   const originTextItem = originLayerItem as Btwx.Text;
  //   const destinationTextItem = destinationLayerItem as Btwx.Text;
  //   const originJustification = originTextItem.textStyle.justification;
  //   const destinationJustification = destinationTextItem.textStyle.justification;
  //   let start: number;
  //   const end = destinationTextItem.point.x;
  //   switch(originJustification) {
  //     case 'left':
  //       switch(destinationJustification) {
  //         case 'left':
  //           start = originTextItem.point.x;
  //           break;
  //         case 'center':
  //           start = originTextItem.point.x + (originTextItem.frame.innerWidth / 2);
  //           break;
  //         case 'right':
  //           start = originTextItem.point.x + originTextItem.frame.innerWidth;
  //           break;
  //       }
  //       break;
  //     case 'center':
  //       switch(destinationJustification) {
  //         case 'left':
  //           start = originTextItem.point.x - (originTextItem.frame.innerWidth / 2);
  //           break;
  //         case 'center':
  //           start = originTextItem.point.x;
  //           break;
  //         case 'right':
  //           start = originTextItem.point.x + (originTextItem.frame.innerWidth / 2)
  //           break;
  //       }
  //       break;
  //     case 'right':
  //       switch(destinationJustification) {
  //         case 'left':
  //           start = originTextItem.point.x - originTextItem.frame.innerWidth;
  //           break;
  //         case 'center':
  //           start = originTextItem.point.x - (originTextItem.frame.innerWidth / 2);
  //           break;
  //         case 'right':
  //           start = originTextItem.point.x;
  //           break;
  //       }
  //       break;
  //   }
  //   const diff = end - start;
  //   eventTimeline.data[tween.layer][tween.prop] = 0;
  //   eventLayerTimeline.to(eventTimeline.data[tween.layer], {
  //     id: tweenId,
  //     duration: tween.duration,
  //     [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : 1,
  //     onUpdate: () => {
  //       // const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
  //       if (tween.ease === 'customWiggle') {
  //         paperLayer.rotation = -startRotation;
  //         const diff = eventTimeline.data[tween.layer][tween.prop] - (textLinesGroup.children[0] as paper.PointText).point.x;
  //         paperLayer.position.x += diff;
  //         paperLayer.rotation = startRotation;
  //       } else {
  //         const startX = paperLayer.data.x || paperLayer.data.x === 0 ? paperLayer.data.x : 0;
  //         const xDiff = diff * (eventTimeline.data[tween.layer][tween.prop] - startX);
  //         paperLayer.rotation = -startRotation;
  //         paperLayer.position.x += xDiff;
  //         paperLayer.rotation = startRotation;
  //         paperLayer.data.x = eventTimeline.data[tween.layer][tween.prop];
  //       }
  //     },
  //     ease: getEaseString(tween),
  //   }, tween.delay);
  // };

  // const addPointYTween = (): void => {
  //   const yPointDiff = (destinationLayerItem as Btwx.Text).point.y - (originLayerItem as Btwx.Text).point.y;
  //   eventTimeline.data[tween.layer][tween.prop] = (originLayerItem as Btwx.Text).point.y + originArtboardItem.frame.y;
  //   eventLayerTimeline.to(eventTimeline.data[tween.layer], {
  //     id: tweenId,
  //     duration: tween.duration,
  //     [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : `+=${yPointDiff}`,
  //     onUpdate: () => {
  //       // const { paperLayer, artboardBackground, textLinesGroup, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const startRotation = paperLayer.data.rotation || paperLayer.data.rotation === 0 ? paperLayer.data.rotation : originLayerItem.transform.rotation;
  //       paperLayer.rotation = -startRotation;
  //       const diff = eventTimeline.data[tween.layer][tween.prop] - (textLinesGroup.children[0] as paper.PointText).point.y;
  //       paperLayer.position.y += diff;
  //       paperLayer.rotation = startRotation;
  //     },
  //     ease: getEaseString(tween),
  //   }, tween.delay);
  // };

  const addTween = () => {
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
      case 'blur':
        addBlurTween();
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
      // case 'oblique':
      //   addObliqueTween();
      //   break;
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
      // case 'pointX':
      //   addPointXTween();
      //   break;
      // case 'pointY':
      //   addPointYTween();
      //   break;
      default:
        return;
    }
  }

  useEffect(() => {
    if (eventLayerTimeline) {
      if (gsap.getById(tweenId)) {
        eventLayerTimeline.remove(gsap.getById(tweenId));
      }
      addTween();
    }
  }, [tween, eventLayerTimeline]);

  useEffect(() => {
    setEventLayerTimeline((eventTimeline as any).getById(`${tween.event}-${tween.layer}`) as GSAPTimeline);
  }, [eventTimeline]);

  return (
    originLayerItem.type === 'Text'
    ? <div
        id={`${originLayerItem.id}-text-tween`}
        style={{
          zIndex: -999999999999,
          position: 'absolute',
          left: -999999999999
        }}>
        { (originLayerItem as Btwx.Text).text }
      </div>
    : null
  );
}

export default CanvasPreviewLayerTween;