/* eslint-disable @typescript-eslint/no-use-before-define */
import { ipcRenderer } from 'electron';
import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { setActiveArtboard } from '../store/actions/layer';
import { positionTextContent, clearLayerTransforms, applyLayerTransforms, getPaperFillColor, getPaperStrokeColor } from '../store/utils/paper';
import { EventLayerTimelineData } from './CanvasPreviewLayerEvent';
import { getParagraphs, getContent, getLeading } from './CanvasTextLayer';

gsap.registerPlugin(MorphSVGPlugin, RoughEase, SlowMo, CustomBounce, CustomEase, CustomWiggle, ScrambleTextPlugin, TextPlugin);

interface CanvasPreviewLayerTweenProps {
  tweenId: string;
  layerTimeline: GSAPTimeline;
}

const CanvasPreviewLayerTween = (props: CanvasPreviewLayerTweenProps): ReactElement => {
  const { layerTimeline, tweenId } = props;
  const electronInstanceId = useSelector((state: RootState) => state.session.instance);
  const isPreviewOpen = useSelector((state: RootState) => state.preview.isOpen);
  const edit = useSelector((state: RootState) => state.layer.present.edit);
  const autoplay = useSelector((state: RootState) => state.preview.autoplay);
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const event = useSelector((state: RootState) => state.layer.present.events.byId[tween.event]);
  const eventDrawerEvent = useSelector((state: RootState) => state.eventDrawer.event);
  const originLayerItem = useSelector((state: RootState) => state.layer.present.byId[tween.layer]);
  const destinationLayerItem = useSelector((state: RootState) => state.layer.present.byId[tween.destinationLayer]);
  const originArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.artboard] as Btwx.Artboard);
  const destinationArtboardItem = useSelector((state: RootState) => state.layer.present.byId[event.destinationArtboard] as Btwx.Artboard);
  // const sessionImages = useSelector((state: RootState) => state.session.images.byId);
  // const originImage = originLayerItem.type === 'Image' ? sessionImages[(originLayerItem as Btwx.Image).imageId] : null;
  // const destinationImage = destinationLayerItem.type === 'Image' ? sessionImages[(destinationLayerItem as Btwx.Image).imageId] : null;
  const [eventLayerTimeline, setEventLayerTimeline] = useState(null);
  const dispatch = useDispatch();

  interface CurrentTweenProps {
    width: number;
    height: number;
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
    prevLineHeight: number;
    text: string;
    shape: string;
    strokeGradientOriginX: number;
    strokeGradientOriginY: number;
    strokeGradientDestinationX: number;
    strokeGradientDestinationY: number;
    fillGradientOriginX: number;
    fillGradientOriginY: number;
    fillGradientDestinationX: number;
    fillGradientDestinationY: number;
    strokeGradientOriginXEase: string;
    strokeGradientOriginYEase: string;
    strokeGradientDestinationXEase: string;
    strokeGradientDestinationYEase: string;
    fillGradientOriginXEase: string;
    fillGradientOriginYEase: string;
    fillGradientDestinationXEase: string;
    fillGradientDestinationYEase: string;
  }

  const hasTweenProp = (prop, value) => {
    if (Object.prototype.hasOwnProperty.call(eventLayerTimeline.data.props, prop)) {
      return eventLayerTimeline.data.props[prop];
    } else {
      return value;
    }
  }

  const getCurrentTweenLayerProps = (): CurrentTweenProps => {
    const width = hasTweenProp('width', originLayerItem.frame.innerWidth);
    const height = hasTweenProp('height', originLayerItem.frame.innerHeight);
    const boundingWidth = hasTweenProp('boundingWidth', originLayerItem.frame.width);
    const boundingHeight = hasTweenProp('boundingHeight', originLayerItem.frame.height);
    const scaleX = hasTweenProp('scaleX', originLayerItem.transform.horizontalFlip ? -1 : 1);
    const scaleY = hasTweenProp('scaleY', originLayerItem.transform.verticalFlip ? -1 : 1);
    const prevScaleX = hasTweenProp('scaleXPrevious', originLayerItem.transform.horizontalFlip ? -1 : 1);
    const prevScaleY = hasTweenProp('scaleYPrevious', originLayerItem.transform.verticalFlip ? -1 : 1);
    const rotation = hasTweenProp('rotation', originLayerItem.transform.rotation);
    const prevRotation = hasTweenProp('rotationPrevious', originLayerItem.transform.rotation);
    const dashArrayWidth = hasTweenProp('dashArrayWidth', originLayerItem.style.strokeOptions.dashArray[0]);
    const dashArrayGap = hasTweenProp('dashArrayGap', originLayerItem.style.strokeOptions.dashArray[1]);
    // Gradient origin/destination
    const strokeGradientOriginX = hasTweenProp('strokeGradientOriginX', originLayerItem.style.stroke.gradient.origin.x);
    const strokeGradientOriginY = hasTweenProp('strokeGradientOriginY', originLayerItem.style.stroke.gradient.origin.y);
    const strokeGradientDestinationX = hasTweenProp('strokeGradientDestinationX', originLayerItem.style.stroke.gradient.destination.x);
    const strokeGradientDestinationY = hasTweenProp('strokeGradientDestinationY', originLayerItem.style.stroke.gradient.destination.y);
    const fillGradientOriginX = hasTweenProp('fillGradientOriginX', originLayerItem.style.fill.gradient.origin.x);
    const fillGradientOriginY = hasTweenProp('fillGradientOriginY', originLayerItem.style.fill.gradient.origin.y);
    const fillGradientDestinationX = hasTweenProp('fillGradientDestinationX', originLayerItem.style.fill.gradient.destination.x);
    const fillGradientDestinationY = hasTweenProp('fillGradientDestinationY', originLayerItem.style.fill.gradient.destination.y);
    // Gradient origin/destination ease
    const strokeGradientOriginXEase = hasTweenProp('strokeGradientOriginX-ease', null);
    const strokeGradientOriginYEase = hasTweenProp('strokeGradientOriginY-ease', null);
    const strokeGradientDestinationXEase = hasTweenProp('strokeGradientDestinationX-ease', null);
    const strokeGradientDestinationYEase = hasTweenProp('strokeGradientDestinationY-ease', null);
    const fillGradientOriginXEase = hasTweenProp('fillGradientOriginX-ease', null);
    const fillGradientOriginYEase = hasTweenProp('fillGradientOriginY-ease', null);
    const fillGradientDestinationXEase = hasTweenProp('fillGradientDestinationX-ease', null);
    const fillGradientDestinationYEase = hasTweenProp('fillGradientDestinationY-ease', null);
    //
    const fontSize = originLayerItem.type === 'Text' ? hasTweenProp('fontSize', (originLayerItem as Btwx.Text).textStyle.fontSize) : null;
    const fontWeight = originLayerItem.type === 'Text' ? hasTweenProp('fontWeight', (originLayerItem as Btwx.Text).textStyle.fontWeight) : null;
    const letterSpacing = originLayerItem.type === 'Text' ? hasTweenProp('letterSpacing', (originLayerItem as Btwx.Text).textStyle.letterSpacing) : null;
    const lineHeight = originLayerItem.type === 'Text' ? hasTweenProp('lineHeight', (originLayerItem as Btwx.Text).textStyle.leading) : null;
    const prevLineHeight = originLayerItem.type === 'Text' ? hasTweenProp('lineHeightPrevious', (originLayerItem as Btwx.Text).textStyle.leading) : null;
    const text = originLayerItem.type === 'Text' ? hasTweenProp('text', (originLayerItem as Btwx.Text).text) : null;
    const shape = originLayerItem.type === 'Shape' ? hasTweenProp('shape', (originLayerItem as Btwx.Shape).pathData) : null;
    return {
      width,
      height,
      boundingWidth,
      boundingHeight,
      scaleX,
      scaleY,
      strokeGradientOriginX,
      strokeGradientOriginY,
      strokeGradientDestinationX,
      strokeGradientDestinationY,
      fillGradientOriginX,
      fillGradientOriginY,
      fillGradientDestinationX,
      fillGradientDestinationY,
      strokeGradientOriginXEase,
      strokeGradientOriginYEase,
      strokeGradientDestinationXEase,
      strokeGradientDestinationYEase,
      fillGradientOriginXEase,
      fillGradientOriginYEase,
      fillGradientDestinationXEase,
      fillGradientDestinationYEase,
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
      prevLineHeight,
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

  const getFSOrigin = (props: { paperLayer: paper.Item, style: 'fill' | 'stroke' }): paper.Point => {
    const currentProps = getCurrentTweenLayerProps();
    const { paperLayer, style } = props;
    const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    const widthRef = isOriginLayerLine ? currentProps.boundingWidth : currentProps.width;
    const heightRef = isOriginLayerLine ? currentProps.boundingHeight : currentProps.height;
    const originX = currentProps[`${style}GradientOriginX`];
    const originXEase = currentProps[`${style}GradientOriginX-ease`];
    const nextOriginX = originXEase && originXEase === 'customWiggle' ? originX : (originX * widthRef) + paperLayer.position.x;
    const originY = currentProps[`${style}GradientOriginY`];
    const originYEase = currentProps[`${style}GradientOriginY-ease`];
    const nextOriginY = originYEase && originYEase === 'customWiggle' ? originY : (originY * heightRef) + paperLayer.position.y;
    return new paperPreview.Point(nextOriginX, nextOriginY);
  };

  const getFSDestination = (props: { paperLayer: paper.Item, style: 'fill' | 'stroke' }): paper.Point => {
    const currentProps = getCurrentTweenLayerProps();
    const { paperLayer, style } = props;
    const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    const widthRef = isOriginLayerLine ? currentProps.boundingWidth : currentProps.width;
    const heightRef = isOriginLayerLine ? currentProps.boundingHeight : currentProps.height;
    const destinationX = currentProps[`${style}GradientDestinationX`];
    const destinationXEase = currentProps[`${style}GradientDestinationX-ease`];
    const nextDestinationX = destinationXEase && destinationXEase === 'customWiggle' ? destinationX : (destinationX * widthRef) + paperLayer.position.x;
    const destinationY = currentProps[`${style}GradientDestinationY`];
    const destinationYEase = currentProps[`${style}GradientDestinationY-ease`];
    const nextDestinationY = destinationYEase && destinationYEase === 'customWiggle' ? destinationY : (destinationY * heightRef) + paperLayer.position.y;
    return new paperPreview.Point(nextDestinationX, nextDestinationY);
  };

  const updateGradientsOD = (paperLayers: { paperLayer: paper.Item, fillRef: paper.Item }): void => {
    const { paperLayer, fillRef } = paperLayers;
    ['fill', 'stroke'].forEach((style: 'fill' | 'stroke') => {
      if (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] && fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient) {
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = getFSOrigin({paperLayer, style});
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = getFSDestination({paperLayer, style});
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

  // const addImageTween = (): void => {
  //   eventLayerTimeline.data.props[`${tween.prop}-before`] = 1;
  //   eventLayerTimeline.data.props[`${tween.prop}-after`] = 0;
  //   eventLayerTimeline.to(eventLayerTimeline.data.props, {
  //     id: tweenId,
  //     duration: tween.duration,
  //     repeat: tween.repeat,
  //     yoyo: tween.yoyo,
  //     [`${tween.prop}-before`]: 0,
  //     [`${tween.prop}-after`]: 1,
  //     onStart: () => {
  //       const { paperLayer, fillRef, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const currentProps = getCurrentTweenLayerProps();
  //       const startPosition = paperLayer.position;
  //       clearLayerTransforms({
  //         paperLayer,
  //         layerType: originLayerItem.type,
  //         transform: {
  //           rotation: currentProps.rotation,
  //           horizontalFlip: currentProps.scaleX,
  //           verticalFlip: currentProps.scaleY
  //         } as any,
  //         variable: true,
  //         width: currentProps.boundingWidth,
  //         height: currentProps.boundingHeight
  //       });
  //       const originRaster = fillRef;
  //       const destinationRaster = originRaster.clone() as paper.Raster;
  //       destinationRaster.source = (paperPreview.project.getItem({data: {id: tween.destinationLayer}}).children[0] as paper.Raster).source;
  //       destinationRaster.bounds = originRaster.bounds;
  //       destinationRaster.opacity = 0;
  //       applyLayerTransforms({
  //         paperLayer,
  //         transform: {
  //           rotation: currentProps.rotation,
  //           horizontalFlip: currentProps.scaleX,
  //           verticalFlip: currentProps.scaleY
  //         } as any,
  //         variable: true
  //       });
  //       paperLayer.position = startPosition;
  //     },
  //     onUpdate: () => {
  //       const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
  //       const beforeRaster = paperLayer.children[0];
  //       const afterRaster = paperLayer.children[1];
  //       beforeRaster.opacity = eventLayerTimeline.data.props[`${tween.prop}-before`];
  //       afterRaster.opacity = eventLayerTimeline.data.props[`${tween.prop}-after`];
  //     },
  //     ease: getEaseString(tween),
  //   }, tween.delay);
  // };

  const addShapeTween = (): void => {
    const originWithoutRotation = new paperPreview.Path({
      pathData: (originLayerItem as Btwx.Shape).pathData,
      insert: false
    });
    clearLayerTransforms({
      layerType: originLayerItem.type,
      paperLayer: originWithoutRotation,
      transform: originLayerItem.transform
    });
    const destinationWithoutRotation = new paperPreview.Path({
      pathData: (destinationLayerItem as Btwx.Shape).pathData,
      insert: false
    });
    clearLayerTransforms({
      layerType: originLayerItem.type,
      paperLayer: destinationWithoutRotation,
      transform: destinationLayerItem.transform
    });
    // get morph data
    const morphData = [
      originWithoutRotation.pathData,
      destinationWithoutRotation.pathData
    ];
    MorphSVGPlugin.pathFilter(morphData);
    eventLayerTimeline.data.props[tween.prop] = morphData[0];
    // set tween
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: morphData[1],
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, fillRef, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
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
        }
        (paperLayer as paper.Path).pathData = currentProps.shape;
        if (shapeMask) {
          (shapeMask as paper.Path).pathData = currentProps.shape;
        }
        paperLayer.bounds.width = currentProps.width;
        paperLayer.bounds.height = currentProps.height;
        if (shapeMask) {
          (shapeMask as paper.Path).bounds.width = currentProps.width;
          (shapeMask as paper.Path).bounds.height = currentProps.height;
        }
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        if (shapeMask) {
          shapeMask.position = startPosition;
        }
        // update fill gradient origin/destination if needed
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style[style].color;
    const dfc = destinationLayerItem.style[style].color;
    eventLayerTimeline.data.props[tween.prop] = tinyColor(ofc).toRgbString();
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? tinyColor(tween.customWiggle.strength).toRgbString() : tinyColor(dfc).toRgbString(),
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventLayerTimeline.data.props[tween.prop];
        fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addNullToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const dfc = destinationLayerItem.style[style].color;
    eventLayerTimeline.data.props[tween.prop] = tinyColor({...dfc, a: 0}).toRgbString();
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tinyColor(dfc).toRgbString(),
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventLayerTimeline.data.props[tween.prop];
        fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] = nextFS;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToNullFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style[style].color;
    eventLayerTimeline.data.props[tween.prop] = ofc.a;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: 0,
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextFS = eventLayerTimeline.data.props[tween.prop];
        fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = nextFS;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginXFSTween = (style: 'fill' | 'stroke'): void => {
    const artboardX = originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.x : 0;
    const originX = originLayerItem.style[style].gradient.origin.x;
    const relOriginX = (originX * originLayerItem.frame.innerWidth) + originLayerItem.frame.x;
    const absOriginX = relOriginX + artboardX;
    const initialOrigin = tween.ease === 'customWiggle' ? absOriginX : originX;
    const isLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    eventLayerTimeline.data.props[tween.prop] = initialOrigin;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.origin.x,
      onStart: () => {
        eventLayerTimeline.data.props[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const widthRef = isLine ? currentProps.boundingWidth : currentProps.width;
        const heightRef = isLine ? currentProps.boundingHeight : currentProps.height;
        const originX = currentProps[`${style}GradientOriginX`];
        const originY = currentProps[`${style}GradientOriginY`];
        const originYEase = currentProps[`${style}GradientOriginY-ease`];
        const nextOriginX = tween.ease === 'customWiggle' ? originX : (originX * widthRef) + paperLayer.position.x;
        const nextOriginY = originYEase === 'customWiggle' ? originY : (originY * heightRef) + paperLayer.position.y;
        const nextOrigin = new paperPreview.Point(nextOriginX, nextOriginY);
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginYFSTween = (style: 'fill' | 'stroke'): void => {
    const isLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    eventLayerTimeline.data.props[tween.prop] = tween.ease === 'customWiggle' ? (originLayerItem.style[style].gradient.origin.y * originLayerItem.frame.innerHeight) + originLayerItem.frame.y + (originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.y : 0) : originLayerItem.style[style].gradient.origin.y;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.origin.y,
      onStart: () => {
        eventLayerTimeline.data.props[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const widthRef = isLine ? currentProps.boundingWidth : currentProps.width;
        const heightRef = isLine ? currentProps.boundingHeight : currentProps.height;
        const originX = currentProps[`${style}GradientOriginX`];
        const originY = currentProps[`${style}GradientOriginY`];
        const originXEase = currentProps[`${style}GradientOriginX-ease`];
        const nextOriginX = originXEase === 'customWiggle' ? originX : (originX * widthRef) + paperLayer.position.x;
        const nextOriginY = tween.ease === 'customWiggle' ? originY : (originY * heightRef) + paperLayer.position.y;
        const nextOrigin = new paperPreview.Point(nextOriginX, nextOriginY);
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationXFSTween = (style: 'fill' | 'stroke'): void => {
    const isLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    eventLayerTimeline.data.props[tween.prop] = tween.ease === 'customWiggle' ? (originLayerItem.style[style].gradient.destination.x * originLayerItem.frame.innerWidth) + originLayerItem.frame.x + (originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.x : 0) : originLayerItem.style[style].gradient.destination.x;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.destination.x,
      onStart: () => {
        eventLayerTimeline.data.props[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const widthRef = isLine ? currentProps.boundingWidth : currentProps.width;
        const heightRef = isLine ? currentProps.boundingHeight : currentProps.height;
        const destinationX = currentProps[`${style}GradientDestinationX`];
        const destinationY = currentProps[`${style}GradientDestinationY`];
        const destinationYEase = currentProps[`${style}GradientDestinationY-ease`];
        const nextDestinationX = tween.ease === 'customWiggle' ? destinationX : (destinationX * widthRef) + paperLayer.position.x;
        const nextDestinationY = destinationYEase === 'customWiggle' ? destinationY : (destinationY * heightRef) + paperLayer.position.y;
        const nextDestination = new paperPreview.Point(nextDestinationX, nextDestinationY);
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationYFSTween = (style: 'fill' | 'stroke'): void => {
    const isLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    eventLayerTimeline.data.props[tween.prop] = tween.ease === 'customWiggle' ? (originLayerItem.style[style].gradient.destination.y * originLayerItem.frame.innerHeight) + originLayerItem.frame.y + (originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.y : 0) : originLayerItem.style[style].gradient.destination.y;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style[style].gradient.destination.y,
      onStart: () => {
        eventLayerTimeline.data.props[`${tween.prop}-ease`] = tween.ease;
      },
      onUpdate: () => {
        const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const currentProps = getCurrentTweenLayerProps();
        const widthRef = isLine ? currentProps.boundingWidth : currentProps.width;
        const heightRef = isLine ? currentProps.boundingHeight : currentProps.height;
        const destinationX = currentProps[`${style}GradientDestinationX`];
        const destinationY = currentProps[`${style}GradientDestinationY`];
        const destinationXEase = currentProps[`${style}GradientDestinationX-ease`];
        const nextDestinationX = destinationXEase === 'customWiggle' ? destinationX : (destinationX * widthRef) + paperLayer.position.x;
        const nextDestinationY = tween.ease === 'customWiggle' ? destinationY : (destinationY * heightRef) + paperLayer.position.y;
        const nextDestination = new paperPreview.Point(nextDestinationX, nextDestinationY);
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const og = originLayerItem.style[style].gradient;
    const dg = destinationLayerItem.style[style].gradient;
    const originStopCount = og.stops.length;
    const destinationStopCount = dg.stops.length;
    const stopDiff = destinationStopCount - originStopCount;
    let stops = og.stops;
    if (destinationStopCount > originStopCount) {
      for (let i = 0; i < stopDiff; i++) {
        const stopClone = {...stops[stops.length - 1]};
        stops = [...stops, stopClone];
      }
    }
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        if (destinationStopCount > originStopCount) {
          const stopDiff = destinationStopCount - originStopCount;
          // set to current gradient
          // needed for when event resets
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: og.stops.reduce((result, current) => {
                result = [
                  ...result,
                  new paperPreview.GradientStop({
                    hue: current.color.h,
                    saturation: current.color.s,
                    lightness: current.color.l,
                    alpha: current.color.a
                  } as paper.Color, current.position)
                ];
                return result;
              }, []) as paper.GradientStop[],
              radial: og.gradientType === 'radial'
            },
            origin: getFSOrigin({ paperLayer, style }),
            destination: getFSDestination({ paperLayer, style })
          } as Btwx.PaperGradientFill;
          // add missing stops
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: [...Array(stopDiff).keys()].reduce((result, current) => [
                ...result,
                fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.length - 1].clone()
              ], fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops),
              radial: dg.gradientType === 'radial'
            },
            origin: getFSOrigin({ paperLayer, style }),
            destination: getFSDestination({ paperLayer, style })
          } as Btwx.PaperGradientFill;
        }
      }
    });
    stops.forEach((stop, index) => {
      const sc = stop.color;
      const sp = stop.position;
      // when destination stops is less than origin stops...
      // get closest destination stop if index is greater than destination stop length
      const cds = dg.stops.reduce((result, current) => {
        return (Math.abs(current.position - stop.position) < Math.abs(result.position - stop.position) ? current : result);
      });
      const dc = dg.stops[index] ? dg.stops[index].color : cds.color;
      const dp = dg.stops[index] ? dg.stops[index].position : cds.position;
      eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`] = tinyColor(sc).toRgbString();
      eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-offset`] = sp;
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}-stop-${index}-color`]: tween.ease === 'customWiggle'
          ? tinyColor(tween.customWiggle.strength).toRgbString()
          : tinyColor(dc).toRgbString(),
        [`${tween.prop}-stop-${index}-offset`]: dp,
        onUpdate: () => {
          const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextStopColor = eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`];
          const nextStopOffset = eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-offset`];
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextStopColor;
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = nextStopOffset;
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
      eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`] = tinyColor(sc).toRgbString();
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}-stop-${index}-color`]: tinyColor(dc).toRgbString(),
        onUpdate: () => {
          const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`];
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addColorToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const oc = originLayerItem.style[style].color;
    const dg = destinationLayerItem.style[style].gradient;
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        eventLayerTimeline.data.props[`${style}GradientOriginX`] = dg.origin.x;
        eventLayerTimeline.data.props[`${style}GradientOriginY`] = dg.origin.y;
        eventLayerTimeline.data.props[`${style}GradientDestinationX`] = dg.destination.x;
        eventLayerTimeline.data.props[`${style}GradientDestinationY`] = dg.destination.y;
        // set origin layer styleColor to destination layer gradient...
        // with all the stop colors as origin color
        fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
          gradient: {
            stops: destinationLayerItem.style[style].gradient.stops.map((stop) => {
              return new paperPreview.GradientStop(
                new paperPreview.Color(tinyColor(oc).toRgbString()),
                stop.position
              );
            }),
            radial: dg.gradientType === 'radial'
          },
          origin: getFSOrigin({ paperLayer, style }),
          destination: getFSDestination({ paperLayer, style })
          // origin: new paperPreview.Point(
          //   (destinationLayerItem.style[style].gradient.origin.x * paperLayer.bounds.width) + paperLayer.position.x,
          //   (destinationLayerItem.style[style].gradient.origin.y * paperLayer.bounds.height) + paperLayer.position.y
          // ),
          // destination: new paperPreview.Point(
          //   (destinationLayerItem.style[style].gradient.destination.x * paperLayer.bounds.width) + paperLayer.position.x,
          //   (destinationLayerItem.style[style].gradient.destination.y * paperLayer.bounds.height) + paperLayer.position.y
          // )
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`] = tinyColor(oc).toRgbString();
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}-stop-${index}-color`]: tinyColor(sc).toRgbString(),
        onUpdate: () => {
          const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`];
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = nextFS;
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
      eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`] = sc.a;
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}-stop-${index}-color`]: 0,
        onUpdate: () => {
          const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`];
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addNullToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const dg = destinationLayerItem.style[style].gradient;
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        eventLayerTimeline.data.props[`${style}GradientOriginX`] = dg.origin.x;
        eventLayerTimeline.data.props[`${style}GradientOriginY`] = dg.origin.y;
        eventLayerTimeline.data.props[`${style}GradientDestinationX`] = dg.destination.x;
        eventLayerTimeline.data.props[`${style}GradientDestinationY`] = dg.destination.y;
        // set origin layer styleColor to destination layer gradient with opaque stops
        fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
          gradient: {
            stops: dg.stops.map((stop) => {
              const sc = stop.color;
              const sp = stop.position;
              return new paperPreview.GradientStop({
                hue: sc.h,
                saturation: sc.s,
                lightness: sc.l,
                alpha: 0
              } as paper.Color, sp);
            }),
            radial: dg.gradientType === 'radial'
          },
          origin: getFSOrigin({ paperLayer, style }),
          destination: getFSDestination({ paperLayer, style })
          // origin: new paperPreview.Point(
          //   (dg.origin.x * paperLayer.bounds.width) + paperLayer.position.x,
          //   (dg.origin.y * paperLayer.bounds.height) + paperLayer.position.y
          // ),
          // destination: new paperPreview.Point(
          //   (dg.destination.x * paperLayer.bounds.width) + paperLayer.position.x,
          //   (dg.destination.y * paperLayer.bounds.height) + paperLayer.position.y
          // )
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`] = 0;
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}-stop-${index}-color`]: sc.a,
        onUpdate: () => {
          const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
          const nextFS = eventLayerTimeline.data.props[`${tween.prop}-stop-${index}-color`];
          fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = nextFS;
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addDashOffsetTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.style.strokeOptions.dashOffset;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashOffset,
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        fillRef.dashOffset = eventLayerTimeline.data.props[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addDashArrayWidthTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.style.strokeOptions.dashArray[0];
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashArray[0],
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        fillRef.dashArray = [eventLayerTimeline.data.props[tween.prop] < 1 ? 0 : eventLayerTimeline.data.props[tween.prop], fillRef.dashArray[1] < 1 ? 0 : fillRef.dashArray[1]];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addDashArrayGapTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.style.strokeOptions.dashArray[1];
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.strokeOptions.dashArray[1],
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        fillRef.dashArray = [fillRef.dashArray[0] < 1 ? 0 : fillRef.dashArray[0], eventLayerTimeline.data.props[tween.prop] < 1 ? 0 : eventLayerTimeline.data.props[tween.prop]];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addStrokeWidthTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.style.stroke.width;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.stroke.width,
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        fillRef.strokeWidth = eventLayerTimeline.data.props[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addXTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.frame.x + originArtboardItem.frame.x;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: `+=${tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationLayerItem.frame.x - originLayerItem.frame.x}`,
      onUpdate: () => {
        const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.x = eventLayerTimeline.data.props[tween.prop];
        if (shapeMask) {
          shapeMask.position.x = eventLayerTimeline.data.props[tween.prop];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addYTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.frame.y + originArtboardItem.frame.y;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: `+=${tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationLayerItem.frame.y - originLayerItem.frame.y}`,
      onUpdate: () => {
        const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.position.y = eventLayerTimeline.data.props[tween.prop];
        if (shapeMask) {
          shapeMask.position.y = eventLayerTimeline.data.props[tween.prop];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addWidthTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.frame.innerWidth;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.frame.innerWidth,
      onUpdate: () => {
        const { paperLayer, textContent, textBackground, textMask, shapeMask, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
        }
        if (originLayerItem.type === 'Text') {
          const nextParagraphs = getParagraphs({
            text: currentProps.text,
            fontSize: currentProps.fontSize as number,
            fontWeight: currentProps.fontWeight as number,
            fontFamily: (originLayerItem as Btwx.Text).textStyle.fontFamily,
            textResize: (originLayerItem as Btwx.Text).textStyle.textResize,
            innerWidth: currentProps.width,
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
          textBackground.bounds.width = currentProps.width;
          textMask.bounds.width = currentProps.width;
          textMask.pivot = null;
          textBackground.pivot = null;
          positionTextContent({
            paperLayer: paperLayer as paper.Group,
            verticalAlignment: (originLayerItem as Btwx.Text).textStyle.verticalAlignment,
            justification: (originLayerItem as Btwx.Text).textStyle.justification,
            textResize: (originLayerItem as Btwx.Text).textStyle.textResize
          });
          switch((originLayerItem as Btwx.Text).textStyle.textResize) {
            case 'autoHeight':
              eventLayerTimeline.data.props['height'] = textContent.bounds.height;
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
        } else {
          paperLayer.bounds.width = currentProps.width;
          if (shapeMask) {
            shapeMask.bounds.width = currentProps.width;
          }
        }
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        if (shapeMask) {
          shapeMask.position = startPosition;
        }
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded' && destinationLayerItem.type === 'Shape' && (destinationLayerItem as Btwx.Shape).shapeType === 'Rounded') {
          clearLayerTransforms({
            paperLayer,
            layerType: originLayerItem.type,
            transform: {
              rotation: currentProps.rotation,
              horizontalFlip: currentProps.scaleX,
              verticalFlip: currentProps.scaleY
            } as any,
            variable: true,
            width: eventLayerTimeline.data.props['boundingWidth'],
            height: currentProps.boundingHeight
          });
          if (shapeMask) {
            clearLayerTransforms({
              paperLayer: shapeMask,
              layerType: originLayerItem.type,
              transform: {
                rotation: currentProps.rotation,
                horizontalFlip: currentProps.scaleX,
                verticalFlip: currentProps.scaleY
              } as any,
              variable: true,
              width: eventLayerTimeline.data.props['boundingWidth'],
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
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addHeightTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.frame.innerHeight;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.frame.innerHeight,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textMask, shapeMask, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
          textBackground.bounds.height = currentProps.height;
          textMask.bounds.height = currentProps.height;
          textMask.pivot = null;
          textBackground.pivot = null;
          positionTextContent({
            paperLayer: paperLayer as paper.Group,
            verticalAlignment: (originLayerItem as Btwx.Text).textStyle.verticalAlignment,
            justification: (originLayerItem as Btwx.Text).textStyle.justification,
            textResize: (originLayerItem as Btwx.Text).textStyle.textResize
          });
        } else {
          paperLayer.bounds.height = currentProps.height;
          if (shapeMask) {
            shapeMask.bounds.height = currentProps.height;
          }
        }
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        if (shapeMask) {
          shapeMask.position = startPosition;
        }
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded' && destinationLayerItem.type === 'Shape' && (destinationLayerItem as Btwx.Shape).shapeType === 'Rounded') {
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
            height: eventLayerTimeline.data.props['boundingHeight']
          });
          if (shapeMask) {
            clearLayerTransforms({
              paperLayer: shapeMask,
              layerType: originLayerItem.type,
              transform: {
                rotation: currentProps.rotation,
                horizontalFlip: currentProps.scaleX,
                verticalFlip: currentProps.scaleY
              } as any,
              variable: true,
              width: currentProps.boundingWidth,
              height: eventLayerTimeline.data.props['boundingHeight']
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
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addRotationTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.transform.rotation;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.transform.rotation,
      onUpdate: () => {
        const { paperLayer, fillRef, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
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
        }
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        eventLayerTimeline.data.props['rotationPrevious'] = currentProps.rotation;
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowColorTween = (): void => {
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
    eventLayerTimeline.data.props[tween.prop] = tinyColor(osc).toRgbString();
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle' ? tinyColor(tween.customWiggle.strength).toRgbString() : tinyColor({h: dsc.h, s: dsc.s, l: dsc.l, a: dsc.a}).toRgbString(),
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        fillRef.shadowColor = eventLayerTimeline.data.props[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowXOffsetTween = (): void => {
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
    eventLayerTimeline.data.props[tween.prop] = osx;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : dsx,
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const y = fillRef.shadowOffset ? fillRef.shadowOffset.y : originShadow.offset.y;
        fillRef.shadowOffset = new paperPreview.Point(eventLayerTimeline.data.props[tween.prop], y);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowYOffsetTween = (): void => {
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
    eventLayerTimeline.data.props[tween.prop] = osy;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : dsy,
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const x = fillRef.shadowOffset ? fillRef.shadowOffset.x : originShadow.offset.x;
        fillRef.shadowOffset = new paperPreview.Point(x, eventLayerTimeline.data.props[tween.prop]);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addShadowBlurTween = (): void => {
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
    eventLayerTimeline.data.props[tween.prop] = osb;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : dsb,
      onUpdate: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        fillRef.shadowBlur = eventLayerTimeline.data.props[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addOpacityTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.style.opacity;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationLayerItem.style.opacity,
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
        paperLayer.opacity = eventLayerTimeline.data.props[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addBlurTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.style.blur.enabled ? originLayerItem.style.blur.radius : 0;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : (destinationLayerItem.style.blur.enabled ? destinationLayerItem.style.blur.radius : 0),
      onUpdate: () => {
        const { paperLayer, artboardBackground, textContent, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        fillRef.style.blur = eventLayerTimeline.data.props[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFontSizeTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventLayerTimeline.data.props[tween.prop] = originTextItem.textStyle.fontSize;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.fontSize,
      onUpdate: () => {
        const { paperLayer, textContent, textMask, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
          innerWidth: currentProps.width,
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
            eventLayerTimeline.data.props['width'] = textContent.bounds.width;
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
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
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFontWeightTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventLayerTimeline.data.props[tween.prop] = originTextItem.textStyle.fontWeight;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: destinationTextItem.textStyle.fontWeight,
      onUpdate: () => {
        const { paperLayer, textContent, textMask, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
          innerWidth: currentProps.width,
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
            eventLayerTimeline.data.props['width'] = textContent.bounds.width;
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
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
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addLineHeightTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventLayerTimeline.data.props[tween.prop] = getLeading({
      leading: originTextItem.textStyle.leading,
      fontSize: originTextItem.textStyle.fontSize
    });
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : getLeading({
        leading: destinationTextItem.textStyle.leading,
        fontSize: destinationTextItem.textStyle.fontSize
      }),
      onUpdate: () => {
        const { paperLayer, textContent, textMask, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
        const diff = (currentProps.lineHeight - currentProps.prevLineHeight) * 0.75;
        textContent.leading = currentProps.lineHeight;
        switch(originTextItem.textStyle.textResize) {
          case 'autoWidth':
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
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
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        updateGradientsOD({ paperLayer, fillRef });
        eventLayerTimeline.data.props['lineHeightPrevious'] = currentProps.lineHeight;
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
      onUpdate: () => {
        const { paperLayer, textContent, textMask, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
          innerWidth: currentProps.width,
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
            eventLayerTimeline.data.props['width'] = textContent.bounds.width;
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
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
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        eventLayerTimeline.data.props['text'] = textDOM.innerText;
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addLetterSpacingTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventLayerTimeline.data.props[tween.prop] = originTextItem.textStyle.letterSpacing;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle' ? `+=${tween.customWiggle.strength}` : destinationTextItem.textStyle.letterSpacing,
      onUpdate: () => {
        const { paperLayer, textContent, textMask, textBackground, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
          innerWidth: currentProps.width,
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
            eventLayerTimeline.data.props['width'] = textContent.bounds.width;
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
            textMask.bounds = textContent.bounds;
            textBackground.bounds = textContent.bounds;
            break;
          case 'autoHeight':
            eventLayerTimeline.data.props['height'] = textContent.bounds.height;
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
        paperLayer.rotation = currentProps.rotation;
        eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
        eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
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
        updateGradientsOD({ paperLayer, fillRef });
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addScaleXTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.transform.horizontalFlip ? -1 : 1;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
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
        eventLayerTimeline.data.props['scaleXPrevious'] = currentProps.scaleX;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addScaleYTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.transform.verticalFlip ? -1 : 1;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
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
        eventLayerTimeline.data.props['scaleYPrevious'] = currentProps.scaleY;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addTween = () => {
    switch(tween.prop) {
      // case 'image':
      //   addImageTween();
      //   break;
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
    return () => {
      if (gsap.getById(tweenId) && eventLayerTimeline) {
        eventLayerTimeline.remove(gsap.getById(tweenId));
        eventLayerTimeline.data.props = Object.keys(eventLayerTimeline.data.props).reduce((result, current) => {
          if (current !== tween.prop && !current.startsWith(tween.prop)) {
            result = {
              ...result,
              [current]: eventLayerTimeline.data.props[current]
            }
          }
          return result;
        }, {});
      }
    }
  }, [tween, eventLayerTimeline]);

  useEffect(() => {
    setEventLayerTimeline(layerTimeline);
  }, [layerTimeline]);

  // useEffect(() => {
  //   if (edit.tweenEdit && layerTimeline && autoplay && isPreviewOpen && edit.tweenEdit[0] === tweenId) {
  //     paperPreview.view.center = new paperPreview.Point(originArtboardItem.frame.x, originArtboardItem.frame.y);
  //     dispatch(setActiveArtboard({
  //       id: event.artboard
  //     }));
  //     ipcRenderer.invoke('setDocumentActiveArtboard', JSON.stringify({
  //       instanceId: electronInstanceId,
  //       activeArtboard: event.artboard
  //     }));
  //     layerTimeline.parent.play(0, false);
  //   }
  // }, [edit.id]);

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