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
import { positionTextContent, clearLayerTransforms, applyLayerTransforms } from '../store/utils/paper';
import { EventLayerTimelineData } from './CanvasPreviewLayerEvent';
import { getParagraphs, getContent } from './CanvasTextLayer';

gsap.registerPlugin(MorphSVGPlugin, RoughEase, SlowMo, CustomBounce, CustomEase, CustomWiggle, ScrambleTextPlugin, TextPlugin);

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

  const getCurrentTweenLayerProps = (): {
    innerWidth: number;
    innerHeight: number;
    boundingWidth: number;
    boundingHeight: number;
    scaleX: number;
    scaleY: number;
    prevScaleX: number;
    prevScaleY: number;
    rotation: number;
    prevRotation: number;
    dashArrayWidth: number;
    dashArrayGap: number;
    fontSize: number;
    fontWeight: number;
    letterSpacing: number;
    lineHeight: number;
    text: string;
    shape: string;
  } => {
    const innerWidth = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'innerWidth') ? eventTimeline.data[tween.layer]['innerWidth'] : originLayerItem.frame.innerWidth;
    const innerHeight = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'innerHeight') ? eventTimeline.data[tween.layer]['innerHeight'] : originLayerItem.frame.innerHeight;
    const boundingWidth = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'boundingWidth') ? eventTimeline.data[tween.layer]['boundingWidth'] : originLayerItem.frame.width;
    const boundingHeight = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'boundingHeight') ? eventTimeline.data[tween.layer]['boundingHeight'] : originLayerItem.frame.height;
    const scaleX = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'scaleX') ? eventTimeline.data[tween.layer]['scaleX'] : originLayerItem.transform.horizontalFlip ? -1 : 1;
    const scaleY = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'scaleY') ? eventTimeline.data[tween.layer]['scaleY'] : originLayerItem.transform.verticalFlip ? -1 : 1;
    const prevScaleX = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'prevScaleX') ? eventTimeline.data[tween.layer]['prevScaleX'] : originLayerItem.transform.horizontalFlip ? -1 : 1;
    const prevScaleY = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'prevScaleY') ? eventTimeline.data[tween.layer]['prevScaleY'] : originLayerItem.transform.verticalFlip ? -1 : 1;
    const rotation = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'rotation') ? eventTimeline.data[tween.layer]['rotation'] : originLayerItem.transform.rotation;
    const prevRotation = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'prevRotation') ? eventTimeline.data[tween.layer]['prevRotation'] : originLayerItem.transform.rotation;
    const dashArrayWidth = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'dashArrayWidth') ? eventTimeline.data[tween.layer]['dashArrayWidth'] : originLayerItem.style.strokeOptions.dashArray[0];
    const dashArrayGap = Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'dashArrayGap') ? eventTimeline.data[tween.layer]['dashArrayGap'] : originLayerItem.style.strokeOptions.dashArray[1];
    const fontSize = originLayerItem.type === 'Text' ? Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'fontSize') ? eventTimeline.data[tween.layer]['fontSize'] : (originLayerItem as Btwx.Text).textStyle.fontSize : null;
    const fontWeight = originLayerItem.type === 'Text' ? Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'fontWeight') ? eventTimeline.data[tween.layer]['fontWeight'] : (originLayerItem as Btwx.Text).textStyle.fontWeight : null;
    const letterSpacing = originLayerItem.type === 'Text' ? Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'letterSpacing') ? eventTimeline.data[tween.layer]['letterSpacing'] : (originLayerItem as Btwx.Text).textStyle.letterSpacing : null;
    const lineHeight = originLayerItem.type === 'Text' ? Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'lineHeight') ? eventTimeline.data[tween.layer]['lineHeight'] : (originLayerItem as Btwx.Text).textStyle.leading : null;
    const text = originLayerItem.type === 'Text' ? Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'text') ? eventTimeline.data[tween.layer]['text'] : (originLayerItem as Btwx.Text).text : null;
    const shape = originLayerItem.type === 'Shape' ? Object.prototype.hasOwnProperty.call(eventTimeline.data[tween.layer], 'shape') ? eventTimeline.data[tween.layer]['shape'] : (originLayerItem as Btwx.Shape).pathData : null;
    return {
      innerWidth,
      innerHeight,
      boundingWidth,
      boundingHeight,
      scaleX,
      scaleY,
      prevScaleX,
      prevScaleY,
      rotation,
      prevRotation,
      dashArrayWidth,
      dashArrayGap,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      text,
      shape
    }
  }

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

  const updateGradients = (paperLayers: { paperLayer: paper.Item; textContent: paper.PointText; textBackground: paper.Path.Rectangle }): void => {
    const { paperLayer, textContent, textBackground } = paperLayers;
    const isText = originLayerItem.type === 'Text';
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [`${tween.prop}-before`]: 0,
      [`${tween.prop}-after`]: 1,
      onStart: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        const beforeRaster = paperLayer.getItem({data: {id: 'imageRaster'}}) as paper.Raster;
        const afterRaster = beforeRaster.clone() as paper.Raster;
        afterRaster.source = (paperPreview.project.getItem({data:{id: tween.destinationLayer}}).children[0] as paper.Raster).source;
        afterRaster.bounds = beforeRaster.bounds;
        afterRaster.opacity = 0;
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
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
    eventTimeline.then(() => {
      const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
      const afterRaster = paperLayer.children[1];
      afterRaster.remove();
    });
  };

  const addShapeTween = (): void => {
    const originWithoutRotation = new paperPreview.Path({
      pathData: (originLayerItem as Btwx.Shape).pathData,
      insert: false
    });
    clearLayerTransforms({
      layerType: 'Shape',
      paperLayer: originWithoutRotation,
      transform: originLayerItem.transform
    });
    const destinationWithoutRotation = new paperPreview.Path({
      pathData: (destinationLayerItem as Btwx.Shape).pathData,
      insert: false
    });
    clearLayerTransforms({
      layerType: 'Shape',
      paperLayer: destinationWithoutRotation,
      transform: destinationLayerItem.transform
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: morphData[1],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        (paperLayer as paper.Path).pathData = currentProps.shape;
        if (shapeMask) {
          (shapeMask as paper.Path).pathData = currentProps.shape;
        }
        paperLayer.bounds.width = currentProps.innerWidth;
        paperLayer.bounds.height = currentProps.innerHeight;
        paperLayer.rotation = currentProps.rotation;
        eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
        eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
        paperLayer.rotation = -currentProps.rotation;
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        paperLayer.position = startPosition;
        // update fill gradient origin/destination if needed
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style[style].color;
    const dfc = destinationLayerItem.style[style].color;
    eventTimeline.data[tween.layer][tween.prop] = tinyColor(ofc).toRgbString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? tinyColor(tween.customWiggle.strength).toRgbString() : tinyColor(dfc).toRgbString(),
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
    const dfc = destinationLayerItem.style[style].color;
    eventTimeline.data[tween.layer][tween.prop] = tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: 0}).toRgbString();
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
    const ofc = originLayerItem.style[style].color;
    eventTimeline.data[tween.layer][tween.prop] = ofc.a;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
        repeat: tween.repeat,
        yoyo: tween.yoyo,
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
        repeat: tween.repeat,
        yoyo: tween.yoyo,
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
        repeat: tween.repeat,
        yoyo: tween.yoyo,
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
        repeat: tween.repeat,
        yoyo: tween.yoyo,
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
        repeat: tween.repeat,
        yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashArray[0],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
        paperLayerRef.dashArray = [eventTimeline.data[tween.layer][tween.prop] < 1 ? 0 : eventTimeline.data[tween.layer][tween.prop], paperLayerRef.dashArray[1] < 1 ? 0 : paperLayerRef.dashArray[1]];
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashArray[1],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const paperLayerRef = isText ? textContent : paperLayer;
        paperLayerRef.dashArray = [paperLayerRef.dashArray[0] < 1 ? 0 : paperLayerRef.dashArray[0], eventTimeline.data[tween.layer][tween.prop] < 1 ? 0 : eventTimeline.data[tween.layer][tween.prop]];
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: `+=${tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationLayerItem.frame.x - originLayerItem.frame.x}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.x = eventTimeline.data[tween.layer][tween.prop];
        if (shapeMask) {
          shapeMask.position.x = eventTimeline.data[tween.layer][tween.prop];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addYTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.y + originArtboardItem.frame.y;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: `+=${tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationLayerItem.frame.y - originLayerItem.frame.y}`,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.y = eventTimeline.data[tween.layer][tween.prop];
        if (shapeMask) {
          shapeMask.position.y = eventTimeline.data[tween.layer][tween.prop];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addWidthTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.frame.innerWidth;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.frame.innerWidth,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, textMask, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        if (shapeMask) {
          clearLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true,
            width: currentProps.boundingWidth,
            height: currentProps.boundingHeight
          });
        }
        if (originLayerItem.type === 'Text') {
          const nextParagraphs = getParagraphs({
            text: currentProps.text,
            fontSize: currentProps.fontSize as number,
            fontWeight: currentProps.fontWeight as number,
            fontFamily: (originLayerItem as Btwx.Text).textStyle.fontFamily,
            textResize: (originLayerItem as Btwx.Text).textStyle.textResize,
            innerWidth: eventTimeline.data[tween.layer][tween.prop],
            letterSpacing: currentProps.letterSpacing as number,
            textTransform: (originLayerItem as Btwx.Text).textStyle.textTransform,
            fontStyle: (originLayerItem as Btwx.Text).textStyle.fontStyle,
            preview: true
          });
          const nextContent = getContent({
            paragraphs: nextParagraphs
          });
          textContent.content = nextContent;
          switch((originLayerItem as Btwx.Text).textStyle.justification) {
            case 'left':
              textBackground.pivot = textContent.bounds.leftCenter;
              textMask.pivot = textContent.bounds.leftCenter;
              break;
            case 'center':
              textBackground.pivot = textContent.bounds.center;
              textMask.pivot = textContent.bounds.center;
              break;
            case 'right':
              textBackground.pivot = textContent.bounds.rightCenter;
              textMask.pivot = textContent.bounds.rightCenter;
              break;
          }
          textBackground.bounds.width = eventTimeline.data[tween.layer][tween.prop];
          textMask.bounds.width = eventTimeline.data[tween.layer][tween.prop];
          textMask.pivot = null;
          textBackground.pivot = null;
          positionTextContent({
            paperLayer: paperLayer as paper.Group,
            verticalAlignment: (originLayerItem as Btwx.Text).textStyle.verticalAlignment,
            justification: (originLayerItem as Btwx.Text).textStyle.justification,
            textResize: (originLayerItem as Btwx.Text).textStyle.textResize
          });
        } else {
          paperLayer.bounds.width = eventTimeline.data[tween.layer][tween.prop];
          if (shapeMask) {
            shapeMask.bounds.width = eventTimeline.data[tween.layer][tween.prop];
          }
        }
        paperLayer.rotation = currentProps.rotation;
        eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
        eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
        paperLayer.rotation = -currentProps.rotation;
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        if (shapeMask) {
          applyLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true
          });
        }
        eventTimeline.data[tween.layer]['innerWidth'] = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.position = startPosition;
        if (shapeMask) {
          shapeMask.position = startPosition;
        }
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded' && destinationLayerItem.type === 'Shape' && (destinationLayerItem as Btwx.Shape).shapeType === 'Rounded') {
          clearLayerTransforms({
            paperLayer,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true,
            width: eventTimeline.data[tween.layer]['boundingWidth'],
            height: currentProps.boundingHeight
          });
          if (shapeMask) {
            clearLayerTransforms({
              paperLayer: shapeMask,
              transform: {
                rotation: currentProps.rotation,
                horizontalFlip: currentProps.scaleX,
                verticalFlip: currentProps.scaleY
              } as any,
              variable: true,
              width: eventTimeline.data[tween.layer]['boundingWidth'],
              height: currentProps.boundingHeight
            });
          }
          const newShape = new paperPreview.Path.Rectangle({
            from: paperLayer.bounds.topLeft,
            to: paperLayer.bounds.bottomRight,
            radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
            insert: false
          });
          (paperLayer as paper.Path).pathData = newShape.pathData;
          if (shapeMask) {
            (shapeMask as paper.Path).pathData = newShape.pathData;
          }
          applyLayerTransforms({
            paperLayer,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true
          });
          if (shapeMask) {
            applyLayerTransforms({
              paperLayer: shapeMask,
              transform: {
                rotation: currentProps.rotation,
                horizontalFlip: currentProps.scaleX,
                verticalFlip: currentProps.scaleY
              } as any,
              variable: true
            });
          }
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.frame.innerHeight,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textMask, shapeMask, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        if (shapeMask) {
          clearLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true,
            width: currentProps.boundingWidth,
            height: currentProps.boundingHeight
          });
        }
        if (originLayerItem.type === 'Text') {
          switch((originLayerItem as Btwx.Text).textStyle.verticalAlignment) {
            case 'top':
              textBackground.pivot = textContent.bounds.topCenter;
              textMask.pivot = textContent.bounds.topCenter;
              break;
            case 'middle':
              textBackground.pivot = textContent.bounds.center;
              textMask.pivot = textContent.bounds.center;
              break;
            case 'bottom':
              textBackground.pivot = textContent.bounds.bottomCenter;
              textMask.pivot = textContent.bounds.bottomCenter;
              break;
          }
          textBackground.bounds.height = eventTimeline.data[tween.layer][tween.prop];
          textMask.bounds.height = eventTimeline.data[tween.layer][tween.prop];
          textMask.pivot = null;
          textBackground.pivot = null;
        } else {
          paperLayer.bounds.height = eventTimeline.data[tween.layer][tween.prop];
          if (shapeMask) {
            shapeMask.bounds.height = eventTimeline.data[tween.layer][tween.prop];
          }
        }
        paperLayer.rotation = currentProps.rotation;
        eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
        eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
        paperLayer.rotation = -currentProps.rotation;
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        if (shapeMask) {
          applyLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true
          });
        }
        eventTimeline.data[tween.layer]['innerHeight'] = eventTimeline.data[tween.layer][tween.prop];
        paperLayer.position = startPosition;
        if (shapeMask) {
          shapeMask.position = startPosition;
        }
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded' && destinationLayerItem.type === 'Shape' && (destinationLayerItem as Btwx.Shape).shapeType === 'Rounded') {
          clearLayerTransforms({
            paperLayer,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true,
            width: currentProps.boundingWidth,
            height: eventTimeline.data[tween.layer]['boundingHeight']
          });
          if (shapeMask) {
            clearLayerTransforms({
              paperLayer: shapeMask,
              transform: {
                rotation: currentProps.rotation,
                horizontalFlip: currentProps.scaleX,
                verticalFlip: currentProps.scaleY
              } as any,
              variable: true,
              width: currentProps.boundingWidth,
              height: eventTimeline.data[tween.layer]['boundingHeight']
            });
          }
          const newShape = new paperPreview.Path.Rectangle({
            from: paperLayer.bounds.topLeft,
            to: paperLayer.bounds.bottomRight,
            radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
            insert: false
          });
          (paperLayer as paper.Path).pathData = newShape.pathData;
          if (shapeMask) {
            (shapeMask as paper.Path).pathData = newShape.pathData;
          }
          applyLayerTransforms({
            paperLayer,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true
          });
          if (shapeMask) {
            applyLayerTransforms({
              paperLayer: shapeMask,
              transform: {
                rotation: currentProps.rotation,
                horizontalFlip: currentProps.scaleX,
                verticalFlip: currentProps.scaleY
              } as any,
              variable: true
            });
          }
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.transform.rotation,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.prevRotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        if (shapeMask) {
          clearLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.prevRotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true,
            width: currentProps.boundingWidth,
            height: currentProps.boundingHeight
          });
        }
        paperLayer.rotation = currentProps.rotation;
        eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
        eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
        paperLayer.rotation = -currentProps.rotation;
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        if (shapeMask) {
          applyLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true
          });
        }
        paperLayer.position = startPosition;
        eventTimeline.data[tween.layer]['prevRotation'] = currentProps.rotation;
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
      dsc = {...dsc, a: 0} as Btwx.Color;
    }
    if (!originShadow.enabled && destinationShadow.enabled) {
      osc = {...osc, a: 0} as Btwx.Color;
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.fontSize,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textMask, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        const nextParagraphs = getParagraphs({
          text: currentProps.text,
          fontSize: currentProps.fontSize,
          fontWeight: currentProps.fontWeight,
          fontFamily: originTextItem.textStyle.fontFamily,
          textResize: originTextItem.textStyle.textResize,
          innerWidth: currentProps.innerWidth,
          letterSpacing: currentProps.letterSpacing,
          textTransform: originTextItem.textStyle.textTransform,
          fontStyle: originTextItem.textStyle.fontStyle,
          preview: true
        });
        const nextContent = getContent({
          paragraphs: nextParagraphs
        });
        textContent.fontSize = currentProps.fontSize;
        textContent.content = nextContent;
        switch(originTextItem.textStyle.textResize) {
          case 'autoWidth':
            eventTimeline.data[tween.layer]['innerWidth'] = textContent.bounds.width;
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds.top = textContent.bounds.top;
            textBackground.bounds.top = textContent.bounds.top;
            textMask.pivot = textContent.bounds.topCenter;
            textBackground.pivot = textContent.bounds.topCenter;
            textMask.bounds.height = textContent.bounds.height;
            textBackground.bounds.height = textContent.bounds.height;
            textMask.pivot = null;
            textBackground.pivot = null;
            break;
        }
        positionTextContent({
          paperLayer: paperLayer as paper.Group,
          verticalAlignment: originTextItem.textStyle.verticalAlignment,
          justification: originTextItem.textStyle.justification,
          textResize: originTextItem.textStyle.textResize
        });
        if (originTextItem.textStyle.textResize !== 'fixed') {
          paperLayer.rotation = currentProps.rotation;
          eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
          eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
          paperLayer.rotation = -currentProps.rotation;
        }
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        paperLayer.position = startPosition;
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: destinationTextItem.textStyle.fontWeight,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textMask, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        const nextParagraphs = getParagraphs({
          text: currentProps.text,
          fontSize: currentProps.fontSize,
          fontWeight: currentProps.fontWeight,
          fontFamily: originTextItem.textStyle.fontFamily,
          textResize: originTextItem.textStyle.textResize,
          innerWidth: currentProps.innerWidth,
          letterSpacing: currentProps.letterSpacing,
          textTransform: originTextItem.textStyle.textTransform,
          fontStyle: originTextItem.textStyle.fontStyle,
          preview: true
        });
        const nextContent = getContent({
          paragraphs: nextParagraphs
        });
        textContent.fontWeight = currentProps.fontWeight;
        textContent.content = nextContent;
        switch(originTextItem.textStyle.textResize) {
          case 'autoWidth':
            eventTimeline.data[tween.layer]['innerWidth'] = textContent.bounds.width;
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds.top = textContent.bounds.top;
            textBackground.bounds.top = textContent.bounds.top;
            textMask.pivot = textContent.bounds.topCenter;
            textBackground.pivot = textContent.bounds.topCenter;
            textMask.bounds.height = textContent.bounds.height;
            textBackground.bounds.height = textContent.bounds.height;
            textMask.pivot = null;
            textBackground.pivot = null;
            break;
        }
        positionTextContent({
          paperLayer: paperLayer as paper.Group,
          verticalAlignment: originTextItem.textStyle.verticalAlignment,
          justification: originTextItem.textStyle.justification,
          textResize: originTextItem.textStyle.textResize
        });
        if (originTextItem.textStyle.textResize !== 'fixed') {
          paperLayer.rotation = currentProps.rotation;
          eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
          eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
          paperLayer.rotation = -currentProps.rotation;
        }
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        paperLayer.position = startPosition;
        updateGradients({ paperLayer, textContent, textBackground });
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.leading,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textMask, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        const diff = (currentProps.lineHeight - (textContent.leading as number)) * 0.75;
        textContent.leading = currentProps.lineHeight;
        switch(originTextItem.textStyle.textResize) {
          case 'autoWidth':
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds.top = textContent.bounds.top;
            textBackground.bounds.top = textContent.bounds.top;
            textMask.pivot = textContent.bounds.topCenter;
            textBackground.pivot = textContent.bounds.topCenter;
            textMask.bounds.height = textContent.bounds.height;
            textBackground.bounds.height = textContent.bounds.height;
            textMask.pivot = null;
            textBackground.pivot = null;
            break;
          case 'fixed':
            switch(originTextItem.textStyle.verticalAlignment) {
              case 'top':
                textMask.position.y -= diff;
                textBackground.position.y -= diff;
                break;
            }
            break;
        }
        positionTextContent({
          paperLayer: paperLayer as paper.Group,
          verticalAlignment: originTextItem.textStyle.verticalAlignment,
          justification: originTextItem.textStyle.justification,
          textResize: originTextItem.textStyle.textResize
        });
        if (originTextItem.textStyle.textResize !== 'fixed') {
          paperLayer.rotation = currentProps.rotation;
          eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
          eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
          paperLayer.rotation = -currentProps.rotation;
        }
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        paperLayer.position = startPosition;
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addTextTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    const textDOM = document.getElementById(`${originTextItem.id}-text-tween`);
    eventLayerTimeline.to(textDOM, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      ...tween.text.scramble ? {
          scrambleText: {
            text: tween.ease === 'customWiggle'
            ? tween.customWiggle.strength
            : destinationTextItem.text
              ? getTransformedText(destinationTextItem.text, destinationTextItem.textStyle.textTransform)
              : '',
            chars: tween.scrambleText.characters === 'custom'
            ? tween.scrambleText.customCharacters
            : tween.scrambleText.characters,
            revealDelay: tween.scrambleText.revealDelay,
            speed: tween.scrambleText.speed,
            delimiter: tween.scrambleText.delimiter,
            rightToLeft: tween.scrambleText.rightToLeft
          }
        }
      : {
          text: {
            value: tween.ease === 'customWiggle'
            ? tween.customWiggle.strength
            : destinationTextItem.text
              ? getTransformedText(destinationTextItem.text, destinationTextItem.textStyle.textTransform)
              : '',
            delimiter: tween.text.delimiter,
            speed: tween.text.speed,
            type: tween.text.diff ? 'diff' : null
          }
        },
      onComplete: () => {
        // should be innerText
        textDOM.innerText === (originLayerItem as Btwx.Text).text
        ? getTransformedText(
            (originLayerItem as Btwx.Text).text,
            (originLayerItem as Btwx.Text).textStyle.textTransform
          )
        : ''
      },
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textMask, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        // get next paragraphs
        const nextParagraphs = getParagraphs({
          // should be innerText
          text: textDOM.innerText,
          fontSize: currentProps.fontSize, // textContent.fontSize as number,
          fontWeight: currentProps.fontWeight, // textContent.fontWeight as number,
          fontFamily: originTextItem.textStyle.fontFamily,
          textResize: originTextItem.textStyle.textResize,
          innerWidth: currentProps.innerWidth,
          letterSpacing: currentProps.letterSpacing, // textContent.letterSpacing as number,
          textTransform: originTextItem.textStyle.textTransform,
          fontStyle: originTextItem.textStyle.fontStyle,
          preview: true
        });
        // get next content
        const nextContent = getContent({
          paragraphs: nextParagraphs
        });
        textContent.content = nextContent;
        switch(destinationTextItem.textStyle.textResize) {
          case 'autoWidth':
            eventTimeline.data[tween.layer]['innerWidth'] = textContent.bounds.width;
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds.top = textContent.bounds.top;
            textBackground.bounds.top = textContent.bounds.top;
            textMask.pivot = textContent.bounds.topCenter;
            textBackground.pivot = textContent.bounds.topCenter;
            textMask.bounds.height = textContent.bounds.height;
            textBackground.bounds.height = textContent.bounds.height;
            textMask.pivot = null;
            textBackground.pivot = null;
            break;
        }
        positionTextContent({
          paperLayer: paperLayer as paper.Group,
          verticalAlignment: originTextItem.textStyle.verticalAlignment,
          justification: originTextItem.textStyle.justification,
          textResize: originTextItem.textStyle.textResize
        });
        if (originTextItem.textStyle.textResize !== 'fixed') {
          paperLayer.rotation = currentProps.rotation;
          eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
          eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
          paperLayer.rotation = -currentProps.rotation;
        }
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        paperLayer.position = startPosition;
        eventTimeline.data[tween.layer]['text'] = textDOM.innerText;
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
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.letterSpacing,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textMask, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        const nextParagraphs = getParagraphs({
          text: currentProps.text,
          fontSize: currentProps.fontSize,
          fontWeight: currentProps.fontWeight,
          fontFamily: originTextItem.textStyle.fontFamily,
          textResize: originTextItem.textStyle.textResize,
          innerWidth: currentProps.innerWidth,
          letterSpacing: currentProps.letterSpacing,
          textTransform: originTextItem.textStyle.textTransform,
          fontStyle: originTextItem.textStyle.fontStyle,
          preview: true
        });
        const nextContent = getContent({
          paragraphs: nextParagraphs
        });
        textContent.letterSpacing = currentProps.letterSpacing;
        textContent.content = nextContent;
        switch(destinationTextItem.textStyle.textResize) {
          case 'autoWidth':
            eventTimeline.data[tween.layer]['innerWidth'] = textContent.bounds.width;
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventTimeline.data[tween.layer]['innerHeight'] = textContent.bounds.height;
            textMask.bounds.top = textContent.bounds.top;
            textBackground.bounds.top = textContent.bounds.top;
            textMask.pivot = textContent.bounds.topCenter;
            textBackground.pivot = textContent.bounds.topCenter;
            textMask.bounds.height = textContent.bounds.height;
            textBackground.bounds.height = textContent.bounds.height;
            textMask.pivot = null;
            textBackground.pivot = null;
            break;
        }
        positionTextContent({
          paperLayer: paperLayer as paper.Group,
          verticalAlignment: originTextItem.textStyle.verticalAlignment,
          justification: originTextItem.textStyle.justification,
          textResize: originTextItem.textStyle.textResize
        });
        if (originTextItem.textStyle.textResize !== 'fixed') {
          paperLayer.rotation = currentProps.rotation;
          eventTimeline.data[tween.layer]['boundingWidth'] = paperLayer.bounds.width;
          eventTimeline.data[tween.layer]['boundingHeight'] = paperLayer.bounds.height;
          paperLayer.rotation = -currentProps.rotation;
        }
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        paperLayer.position = startPosition;
        updateGradients({ paperLayer, textContent, textBackground });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addScaleXTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.transform.horizontalFlip ? -1 : 1;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? ((originLayerItem.transform.horizontalFlip ? 1 : -1) * tween.customWiggle.strength) : destinationLayerItem.transform.horizontalFlip ? -1 : 1,
      onUpdate: () => {
        const { paperLayer, textMask, textContent, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.prevScaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        if (shapeMask) {
          clearLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.prevScaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true,
            width: currentProps.boundingWidth,
            height: currentProps.boundingHeight
          });
        }
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        if (shapeMask) {
          applyLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true
          });
        }
        paperLayer.position = startPosition;
        eventTimeline.data[tween.layer]['prevScaleX'] = currentProps.scaleX;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addScaleYTween = (): void => {
    eventTimeline.data[tween.layer][tween.prop] = originLayerItem.transform.verticalFlip ? -1 : 1;
    eventLayerTimeline.to(eventTimeline.data[tween.layer], {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? ((originLayerItem.transform.verticalFlip ? 1 : -1) * tween.customWiggle.strength) : destinationLayerItem.transform.verticalFlip ? -1 : 1,
      onUpdate: () => {
        const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const startPosition = paperLayer.position;
        clearLayerTransforms({
          paperLayer,
          layerType: originLayerItem.type,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.prevScaleY
          } as any,
          variable: true,
          width: currentProps.boundingWidth,
          height: currentProps.boundingHeight
        });
        if (shapeMask) {
          clearLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.prevScaleY
            } as any,
            variable: true,
            width: currentProps.boundingWidth,
            height: currentProps.boundingHeight
          });
        }
        applyLayerTransforms({
          paperLayer,
          transform: {
            rotation: currentProps.rotation,
            horizontalFlip: currentProps.scaleX,
            verticalFlip: currentProps.scaleY
          } as any,
          variable: true
        });
        if (shapeMask) {
          applyLayerTransforms({
            paperLayer: shapeMask,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true
          });
        }
        paperLayer.position = startPosition;
        eventTimeline.data[tween.layer]['prevScaleY'] = currentProps.scaleY;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

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
      case 'lineHeight':
        addLineHeightTween();
        break;
      case 'text':
        addTextTween();
        break;
      case 'scaleX':
        addScaleXTween();
        break;
      case 'scaleY':
        addScaleYTween();
        break;
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