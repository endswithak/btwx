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
import { getParagraphs, getContent, getLeading } from './CanvasTextLayer';

gsap.registerPlugin(MorphSVGPlugin, RoughEase, SlowMo, CustomBounce, CustomEase, CustomWiggle, ScrambleTextPlugin, TextPlugin);

interface CanvasPreviewLayerTweenProps {
  tweenId: string;
  layerTimeline: GSAPTimeline;
  eventTimeline: GSAPTimeline;
}

export interface EventLayerTimelineData {
  paperLayer: paper.Item;
  artboardBackground: paper.Path.Rectangle;
  imageRaster: paper.Raster;
  textContent: paper.PointText;
  textBackground: paper.Path.Rectangle;
  textMask: paper.Path.Rectangle;
  shapeMask?: paper.CompoundPath;
  fillRef: paper.Item;
  props: any;
  prevProps: any;
}

const CanvasPreviewLayerTween = (props: CanvasPreviewLayerTweenProps): ReactElement => {
  const { layerTimeline, tweenId, eventTimeline } = props;
  // const electronInstanceId = useSelector((state: RootState) => state.session.instance);
  const isPreviewOpen = useSelector((state: RootState) => state.preview.isOpen);
  const edit = useSelector((state: RootState) => state.layer.present.edit);
  const autoplay = useSelector((state: RootState) => state.preview.autoplay);
  const tween = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId]);
  const event = useSelector((state: RootState) => tween ? state.layer.present.events.byId[tween.event] : null);
  // const eventDrawerEvent = useSelector((state: RootState) => state.eventDrawer.event);
  const originLayerItem = useSelector((state: RootState) => tween ? state.layer.present.byId[tween.layer] : null);
  const destinationLayerItem = useSelector((state: RootState) => tween ? state.layer.present.byId[tween.destinationLayer] : null);
  const originArtboardItem = useSelector((state: RootState) => event ? state.layer.present.byId[event.origin] as Btwx.Artboard : null);
  const destinationArtboardItem = useSelector((state: RootState) => event ? state.layer.present.byId[event.destination] as Btwx.Artboard : null);
  // const sessionImages = useSelector((state: RootState) => state.session.images.byId);
  // const originImage = originLayerItem.type === 'Image' ? sessionImages[(originLayerItem as Btwx.Image).imageId] : null;
  // const destinationImage = destinationLayerItem.type === 'Image' ? sessionImages[(destinationLayerItem as Btwx.Image).imageId] : null;
  const [eventLayerTimeline, setEventLayerTimeline] = useState(null);
  const [autoplayInstance, setAutoplayInstance] = useState(null);

  interface TweenProps {
    x: number;
    y: number;
    width: number;
    height: number;
    boundingWidth: number;
    boundingHeight: number;
    rotation: number;
    dashOffset: number;
    fontSize: number;
    fontWeight: number;
    letterSpacing: number;
    lineHeight: number;
    text: string;
    shape: string;
    opacity: number;
    blur: number;
    strokeWidth: number;
    scaleX: number;
    scaleY: number;
    dashArrayWidth: number;
    dashArrayGap: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    fillType: Btwx.FillStrokeTween;
    fill: string;
    fillGradientOriginX: number;
    fillGradientOriginY: number;
    fillGradientDestinationX: number;
    fillGradientDestinationY: number;
    fillGradientOriginXEase: string;
    fillGradientOriginYEase: string;
    fillGradientDestinationXEase: string;
    fillGradientDestinationYEase: string;
    strokeType: Btwx.FillStrokeTween;
    stroke: string;
    strokeGradientOriginX: number;
    strokeGradientOriginY: number;
    strokeGradientDestinationX: number;
    strokeGradientDestinationY: number;
    strokeGradientOriginXEase: string;
    strokeGradientOriginYEase: string;
    strokeGradientDestinationXEase: string;
    strokeGradientDestinationYEase: string;
  }

  const getCurrentTweenProp = (prop, value) => {
    if (prop === 'fill' || prop === 'stroke') {
      switch(eventLayerTimeline.data.props[`${prop}Type`]) {
        case 'colorToColor':
        case 'colorToNull':
        case 'nullToColor': {
          if (Object.prototype.hasOwnProperty.call(eventLayerTimeline.data.props, prop)) {
            return { [prop]: eventLayerTimeline.data.props[prop] };
          } else {
            return value;
          }
        }
        case 'colorToGradient':
        case 'gradientToGradient':
        case 'gradientToColor':
        case 'gradientToNull':
        case 'nullToGradient': {
          if (Object.keys(eventLayerTimeline.data.props).some((key) => key.startsWith(`${prop}Stop`))) {
            return Object.keys(eventLayerTimeline.data.props).reduce((result, current) => {
              if (current.startsWith(`${prop}Stop`)) {
                result = {
                  ...result,
                  [current]: eventLayerTimeline.data.props[current]
                }
              }
              return result;
            }, {});
          } else {
            return value;
          }
        }
        default:
          return null;
      }
    } else {
      if (Object.prototype.hasOwnProperty.call(eventLayerTimeline.data.props, prop)) {
        return eventLayerTimeline.data.props[prop];
      } else {
        return value;
      }
    }
  }

  const getPastTweenProp = (prop, value) => {
    if (prop === 'fill' || prop === 'stroke') {
      switch(eventLayerTimeline.data.prevProps[`${prop}Type`]) {
        case 'colorToColor':
        case 'colorToNull':
        case 'nullToColor': {
          if (Object.prototype.hasOwnProperty.call(eventLayerTimeline.data.prevProps, prop)) {
            return { [prop]: eventLayerTimeline.data.prevProps[prop] };
          } else {
            return value;
          }
        }
        case 'colorToGradient':
        case 'gradientToGradient':
        case 'gradientToColor':
        case 'gradientToNull':
        case 'nullToGradient': {
          if (Object.keys(eventLayerTimeline.data.prevProps).some((key) => key.startsWith(`${prop}Stop`))) {
            return Object.keys(eventLayerTimeline.data.prevProps).reduce((result, current) => {
              if (current.startsWith(`${prop}Stop`)) {
                result = {
                  ...result,
                  [current]: eventLayerTimeline.data.prevProps[current]
                }
              }
              return result;
            }, {});
          } else {
            return value;
          }
        }
        default:
          return null;
      }
    } else {
      if (Object.prototype.hasOwnProperty.call(eventLayerTimeline.data.prevProps, prop)) {
        return eventLayerTimeline.data.prevProps[prop];
      } else {
        return value;
      }
    }
  }

  const getProp = (prop, value, past) => {
    if (past) {
      return getPastTweenProp(prop, value);
    } else {
      return getCurrentTweenProp(prop, value);
    }
  }

  const getProps = (prev?: boolean): TweenProps => {
    const x = originLayerItem && getProp('x', originLayerItem.frame.x + originArtboardItem.frame.x, prev);
    const y = originLayerItem && getProp('y', originLayerItem.frame.y + originArtboardItem.frame.y, prev);
    const width = originLayerItem && getProp('width', originLayerItem.frame.innerWidth, prev);
    const height = originLayerItem && getProp('height', originLayerItem.frame.innerHeight, prev);
    const boundingWidth = originLayerItem && getProp('boundingWidth', originLayerItem.frame.width, prev);
    const boundingHeight = originLayerItem && getProp('boundingHeight', originLayerItem.frame.height, prev);
    const scaleX = originLayerItem && getProp('scaleX', originLayerItem.transform.horizontalFlip ? -1 : 1, prev);
    const scaleY = originLayerItem && getProp('scaleY', originLayerItem.transform.verticalFlip ? -1 : 1, prev);
    const rotation = originLayerItem && getProp('rotation', originLayerItem.transform.rotation, prev);
    // stroke options
    const dashOffset = originLayerItem && getProp('dashOffset', originLayerItem.style.strokeOptions.dashOffset, prev);
    const dashArrayWidth = originLayerItem && getProp('dashArrayWidth', originLayerItem.style.strokeOptions.dashArray[0], prev);
    const dashArrayGap = originLayerItem && getProp('dashArrayGap', originLayerItem.style.strokeOptions.dashArray[1], prev);
    // context
    const opacity = originLayerItem && getProp('opacity', originLayerItem.style.opacity, prev);
    const blur = originLayerItem && getProp('blur', originLayerItem.style.blur.radius, prev);
    // shadow
    const shadowColor = originLayerItem && getProp('shadowColor', getOriginShadowColor(), prev);
    const shadowOffsetX = originLayerItem && getProp('shadowOffsetX', getOriginShadowOffsetX(), prev);
    const shadowOffsetY = originLayerItem && getProp('shadowOffsetY', getOriginShadowOffsetY(), prev);
    const shadowBlur = originLayerItem && getProp('shadowBlur', getOriginShadowBlur(), prev);
    // fill
    const fillType = originLayerItem && getProp('fillType', null, prev);
    const fill = originLayerItem && getProp('fill', getInitialFSColor('fill', fillType), prev);
    // stroke
    const strokeType = originLayerItem && getProp('strokeType', null, prev);
    const stroke = originLayerItem && getProp('stroke', getInitialFSColor('stroke', strokeType), prev);
    const strokeWidth = originLayerItem && getProp('strokeWidth', originLayerItem.style.stroke.width, prev);
    // Gradient origin/destination
    const strokeGradientOriginX = originLayerItem && getProp('strokeGradientOriginX', originLayerItem.style.stroke.gradient.origin.x, prev);
    const strokeGradientOriginY = originLayerItem && getProp('strokeGradientOriginY', originLayerItem.style.stroke.gradient.origin.y, prev);
    const strokeGradientDestinationX = originLayerItem && getProp('strokeGradientDestinationX', originLayerItem.style.stroke.gradient.destination.x, prev);
    const strokeGradientDestinationY = originLayerItem && getProp('strokeGradientDestinationY', originLayerItem.style.stroke.gradient.destination.y, prev);
    const fillGradientOriginX = originLayerItem && getProp('fillGradientOriginX', originLayerItem.style.fill.gradient.origin.x, prev);
    const fillGradientOriginY = originLayerItem && getProp('fillGradientOriginY', originLayerItem.style.fill.gradient.origin.y, prev);
    const fillGradientDestinationX = originLayerItem && getProp('fillGradientDestinationX', originLayerItem.style.fill.gradient.destination.x, prev);
    const fillGradientDestinationY = originLayerItem && getProp('fillGradientDestinationY', originLayerItem.style.fill.gradient.destination.y, prev);
    // Gradient origin/destination ease
    const strokeGradientOriginXEase = originLayerItem && getProp('strokeGradientOriginXEase', null, prev);
    const strokeGradientOriginYEase = originLayerItem && getProp('strokeGradientOriginYEase', null, prev);
    const strokeGradientDestinationXEase = originLayerItem && getProp('strokeGradientDestinationXEase', null, prev);
    const strokeGradientDestinationYEase = originLayerItem && getProp('strokeGradientDestinationYEase', null, prev);
    const fillGradientOriginXEase = originLayerItem && getProp('fillGradientOriginXEase', null, prev);
    const fillGradientOriginYEase = originLayerItem && getProp('fillGradientOriginYEase', null, prev);
    const fillGradientDestinationXEase = originLayerItem && getProp('fillGradientDestinationXEase', null, prev);
    const fillGradientDestinationYEase = originLayerItem && getProp('fillGradientDestinationYEase', null, prev);
    //
    const fontSize = originLayerItem && originLayerItem.type === 'Text' ? getProp('fontSize', (originLayerItem as Btwx.Text).textStyle.fontSize, prev) : null;
    const fontWeight = originLayerItem && originLayerItem.type === 'Text' ? getProp('fontWeight', (originLayerItem as Btwx.Text).textStyle.fontWeight, prev) : null;
    const letterSpacing = originLayerItem && originLayerItem.type === 'Text' ? getProp('letterSpacing', (originLayerItem as Btwx.Text).textStyle.letterSpacing, prev) : null;
    const lineHeight = originLayerItem && originLayerItem.type === 'Text' ? getProp('lineHeight', getLeading({
      leading: (originLayerItem as Btwx.Text).textStyle.leading,
      fontSize: (originLayerItem as Btwx.Text).textStyle.fontSize
    }), prev) : null;
    const text = originLayerItem && originLayerItem.type === 'Text' ? getProp('text', (originLayerItem as Btwx.Text).text, prev) : null;
    const shape = originLayerItem && originLayerItem.type === 'Shape' ? getProp('shape', (originLayerItem as Btwx.Shape).pathData, prev) : null;
    return {
      x,
      y,
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
      rotation,
      dashOffset,
      dashArrayWidth,
      dashArrayGap,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      text,
      shape,
      opacity,
      blur,
      shadowColor,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur,
      strokeWidth,
      fillType,
      strokeType,
      ...fill,
      ...stroke,
    }
  }

  const getHasPropChange = (currentProps: TweenProps, prevProps: TweenProps) => Object.keys(currentProps).some(key =>
    getHasSinglePropChange(currentProps, prevProps, key)
  );

  const getHasSinglePropChange = (currentProps: TweenProps, prevProps: TweenProps, prop: string): boolean => {
    const currentProp = currentProps[prop];
    const prevProp = prevProps[prop];
    if (prop === 'stroke' || prop === 'fill') {
      if (currentProps[`${prop}Type`]) {
        switch(currentProps[`${prop}Type`]) {
          case 'colorToColor':
          case 'colorToNull':
          case 'nullToColor': {
            return currentProp !== prevProp;
          }
          case 'colorToGradient':
          case 'gradientToGradient':
          case 'gradientToColor':
          case 'gradientToNull':
          case 'nullToGradient': {
            return Object.keys(currentProps).some(key => {
              if (key.startsWith(`${prop}Stop`)) {
                const currentStop = currentProps[key];
                const prevStop = prevProps[key];
                return currentStop !== prevStop;
              } else {
                return false;
              }
            });
          }
        }
      } else {
        return false;
      }
    } else {
      return currentProp !== prevProp;
    }
  }

  const hasSomePropsChange = (currentProps: TweenProps, prevProps: TweenProps, props: string[]) =>
    props.some(prop => getHasSinglePropChange(currentProps, prevProps, prop));

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

  const getFSOrigin = (style: 'fill' | 'stroke'): paper.Point => {
    const currentProps = getProps();
    const { paperLayer } = eventLayerTimeline.data as EventLayerTimelineData;
    const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    const widthRef = isOriginLayerLine ? currentProps.boundingWidth : currentProps.width;
    const heightRef = isOriginLayerLine ? currentProps.boundingHeight : currentProps.height;
    const originX = currentProps[`${style}GradientOriginX`];
    const originXEase = currentProps[`${style}GradientOriginXEase`];
    const nextOriginX = originXEase && originXEase === 'customWiggle' ? originX : (originX * widthRef) + paperLayer.position.x;
    const originY = currentProps[`${style}GradientOriginY`];
    const originYEase = currentProps[`${style}GradientOriginYEase`];
    const nextOriginY = originYEase && originYEase === 'customWiggle' ? originY : (originY * heightRef) + paperLayer.position.y;
    return new paperPreview.Point(nextOriginX, nextOriginY);
  };

  const getFSDestination = (style: 'fill' | 'stroke'): paper.Point => {
    const currentProps = getProps();
    const { paperLayer } = eventLayerTimeline.data as EventLayerTimelineData;
    const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    const widthRef = isOriginLayerLine ? currentProps.boundingWidth : currentProps.width;
    const heightRef = isOriginLayerLine ? currentProps.boundingHeight : currentProps.height;
    const destinationX = currentProps[`${style}GradientDestinationX`];
    const destinationXEase = currentProps[`${style}GradientDestinationXEase`];
    const nextDestinationX = destinationXEase && destinationXEase === 'customWiggle' ? destinationX : (destinationX * widthRef) + paperLayer.position.x;
    const destinationY = currentProps[`${style}GradientDestinationY`];
    const destinationYEase = currentProps[`${style}GradientDestinationYEase`];
    const nextDestinationY = destinationYEase && destinationYEase === 'customWiggle' ? destinationY : (destinationY * heightRef) + paperLayer.position.y;
    return new paperPreview.Point(nextDestinationX, nextDestinationY);
  };

  const updateGradientsOD = (): void => {
    const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
    ['fill', 'stroke'].forEach((style: 'fill' | 'stroke') => {
      if (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] && fillRef[`${style}Color` as 'fillColor' | 'strokeColor'].gradient) {
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = getFSOrigin(style);
        (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = getFSDestination(style);
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

  const getInitialFSColor = (style: 'fill' | 'stroke', fillType: Btwx.FillStrokeTween): {
    [id: string]: string
  } => {
    switch(fillType) {
      case 'colorToColor':
      case 'colorToNull':
        return {
          [style]: tinyColor(originLayerItem.style[style].color).toRgbString()
        };
      case 'nullToColor':
        return {
          [style]: tinyColor({...destinationLayerItem.style[style].color, a: 0}).toRgbString()
        };
      case 'gradientToGradient':
      case 'gradientToColor':
      case 'gradientToNull':
        return originLayerItem.style[style].gradient.stops.reduce((result, current, index) => ({
          ...result,
          [`${style}Stop${index}Color`]: tinyColor(current.color).toRgbString(),
          [`${style}Stop${index}Offset`]: current.position,
        }), {});
      case 'colorToGradient':
      case 'nullToGradient':
        return destinationLayerItem.style[style].gradient.stops.reduce((result, current, index) => ({
          ...result,
          [`${style}Stop${index}Color`]: tinyColor({...current.color, a: 0}).toRgbString(),
          [`${style}Stop${index}Offset`]: current.position
        }), {});
      default:
        return null;
    }
  };

  const addColorToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style[style].color;
    const dfc = destinationLayerItem.style[style].color;
    eventLayerTimeline.data.props[tween.prop] = tinyColor(ofc).toRgbString();
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'colorToColor';
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? tinyColor(tween.customWiggle.strength).toRgbString()
        : tinyColor(dfc).toRgbString(),
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addNullToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const dfc = destinationLayerItem.style[style].color;
    eventLayerTimeline.data.props[tween.prop] = tinyColor({...dfc, a: 0}).toRgbString();
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'nullToColor';
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? tinyColor(tween.customWiggle.strength).toRgbString()
        : tinyColor(dfc).toRgbString(),
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToNullFSTween = (style: 'fill' | 'stroke'): void => {
    const ofc = originLayerItem.style[style].color;
    eventLayerTimeline.data.props[tween.prop] = tinyColor(ofc).toRgbString();
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'colorToNull';
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? tinyColor(tween.customWiggle.strength).toRgbString()
        : tinyColor({...ofc, a: 0}).toRgbString(),
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginXFSTween = (style: 'fill' | 'stroke'): void => {
    const artboardX = originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.x : 0;
    const originX = originLayerItem.style[style].gradient.origin.x;
    const relOriginX = (originX * originLayerItem.frame.innerWidth) + originLayerItem.frame.x;
    const absOriginX = relOriginX + artboardX;
    const initialOriginX = tween.ease === 'customWiggle' ? absOriginX : originX;
    eventLayerTimeline.data.props[tween.prop] = initialOriginX;
    eventLayerTimeline.data.props[`${tween.prop}Ease`] = tween.ease;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style[style].gradient.origin.x,
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginYFSTween = (style: 'fill' | 'stroke'): void => {
    const artboardY = originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.y : 0;
    const originY = originLayerItem.style[style].gradient.origin.y;
    const relOriginY = (originY * originLayerItem.frame.innerHeight) + originLayerItem.frame.y;
    const absOriginY = relOriginY + artboardY;
    const initialOriginY = tween.ease === 'customWiggle' ? absOriginY : originY;
    eventLayerTimeline.data.props[tween.prop] = initialOriginY;
    eventLayerTimeline.data.props[`${tween.prop}Ease`] = tween.ease;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style[style].gradient.origin.y,
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationXFSTween = (style: 'fill' | 'stroke'): void => {
    const artboardX = originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.x : 0;
    const destinationX = originLayerItem.style[style].gradient.destination.x;
    const relDestinationX = (destinationX * originLayerItem.frame.innerWidth) + originLayerItem.frame.x;
    const absDestinationX = relDestinationX + artboardX;
    const initialDestinationX = tween.ease === 'customWiggle' ? absDestinationX : destinationX;
    eventLayerTimeline.data.props[tween.prop] = initialDestinationX;
    eventLayerTimeline.data.props[`${tween.prop}Ease`] = tween.ease;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style[style].gradient.destination.x,
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationYFSTween = (style: 'fill' | 'stroke'): void => {
    const artboardY = originLayerItem.type !== 'Artboard' ? originArtboardItem.frame.y : 0;
    const destinationY = originLayerItem.style[style].gradient.destination.y;
    const relDestinationY = (destinationY * originLayerItem.frame.innerHeight) + originLayerItem.frame.y;
    const absDestinationY = relDestinationY + artboardY;
    const initialDestinationY = tween.ease === 'customWiggle' ? absDestinationY : destinationY;
    eventLayerTimeline.data.props[tween.prop] = initialDestinationY;
    eventLayerTimeline.data.props[`${tween.prop}Ease`] = tween.ease;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style[style].gradient.destination.y,
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
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'gradientToGradient';
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
            origin: getFSOrigin(style),
            destination: getFSDestination(style)
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
            origin: getFSOrigin(style),
            destination: getFSDestination(style)
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
      eventLayerTimeline.data.props[`${tween.prop}Stop${index}Color`] = tinyColor(sc).toRgbString();
      eventLayerTimeline.data.props[`${tween.prop}Stop${index}Offset`] = sp;
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}Stop${index}Color`]: tween.ease === 'customWiggle'
          ? tinyColor(tween.customWiggle.strength).toRgbString()
          : tinyColor(dc).toRgbString(),
        [`${tween.prop}Stop${index}Offset`]: dp,
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addGradientToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const stopsTimeline = gsap.timeline({id: tweenId});
    const og = originLayerItem.style[style].gradient;
    const dc = destinationLayerItem.style[style].color;
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'gradientToColor';
    og.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventLayerTimeline.data.props[`${tween.prop}Stop${index}Color`] = tinyColor(sc).toRgbString();
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}Stop${index}Color`]: tween.ease === 'customWiggle'
          ? tinyColor(tween.customWiggle.strength).toRgbString()
          : tinyColor(dc).toRgbString(),
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addColorToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const oc = originLayerItem.style[style].color;
    const dg = destinationLayerItem.style[style].gradient;
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'colorToGradient';
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        // set origin layer styleColor to destination layer gradient...
        // with all the stop colors as origin color
        eventLayerTimeline.data.props[`${style}GradientOriginX`] = dg.origin.x;
        eventLayerTimeline.data.props[`${style}GradientOriginY`] = dg.origin.y;
        eventLayerTimeline.data.props[`${style}GradientDestinationX`] = dg.destination.x;
        eventLayerTimeline.data.props[`${style}GradientDestinationY`] = dg.destination.y;
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
          origin: getFSOrigin(style),
          destination: getFSDestination(style)
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventLayerTimeline.data.props[`${tween.prop}Stop${index}Color`] = tinyColor(oc).toRgbString();
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}Stop${index}Color`]: tween.ease === 'customWiggle'
          ? tinyColor(tween.customWiggle.strength).toRgbString()
          : tinyColor(sc).toRgbString(),
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addGradientToNullFSTween = (style: 'fill' | 'stroke'): void => {
    const stopsTimeline = gsap.timeline({id: tweenId});
    const og = originLayerItem.style[style].gradient;
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'gradientToNull';
    og.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventLayerTimeline.data.props[`${tween.prop}Stop${index}Color`] = tinyColor(sc).toRgbString();
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}Stop${index}Color`]: tween.ease === 'customWiggle'
          ? tinyColor(tween.customWiggle.strength).toRgbString()
          : tinyColor({...sc, a: 0}).toRgbString(),
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

  const addNullToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const dg = destinationLayerItem.style[style].gradient;
    eventLayerTimeline.data.props[`${tween.prop}Type`] = 'nullToGradient';
    const stopsTimeline = gsap.timeline({
      id: tweenId,
      onStart: () => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
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
          origin: getFSOrigin(style),
          destination: getFSDestination(style)
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventLayerTimeline.data.props[`${tween.prop}Stop${index}Color`] = tinyColor({...sc, a: 0}).toRgbString();
      stopsTimeline.to(eventLayerTimeline.data.props, {
        duration: tween.duration,
        repeat: tween.repeat,
        yoyo: tween.yoyo,
        [`${tween.prop}Stop${index}Color`]: tween.ease === 'customWiggle'
          ? tinyColor(tween.customWiggle.strength).toRgbString()
          : tinyColor(sc).toRgbString(),
        ease: getEaseString(tween),
      }, tween.delay);
    });
    eventLayerTimeline.add(stopsTimeline, 0);
  };

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
      tween.ease === 'customWiggle' ? tween.customWiggle.strength : destinationWithoutRotation.pathData
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
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addDashOffsetTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = originLayerItem.style.strokeOptions.dashOffset;
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style.strokeOptions.dashOffset,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style.strokeOptions.dashArray[0],
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style.strokeOptions.dashArray[1],
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style.stroke.width,
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
      [tween.prop]: `+=${tween.ease === 'customWiggle'
        ? tween.customWiggle.strength
        : destinationLayerItem.frame.x - originLayerItem.frame.x}`,
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
      [tween.prop]: `+=${tween.ease === 'customWiggle'
        ? tween.customWiggle.strength
        : destinationLayerItem.frame.y - originLayerItem.frame.y}`,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.frame.innerWidth,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.frame.innerHeight,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.transform.rotation,
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const getOriginShadowColor = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osc = originLayerItem.style.shadow.color;
    if (!originShadow.enabled && destinationShadow.enabled) {
      osc = {...osc, a: 0} as Btwx.Color;
    }
    return tinyColor(osc).toRgbString();
  }

  const getDestinationShadowColor = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let dsc = destinationLayerItem.style.shadow.color;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsc = {...dsc, a: 0} as Btwx.Color;
    }
    return tinyColor(dsc).toRgbString();
  }

  const addShadowColorTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = getOriginShadowColor();
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      [tween.prop]: tween.ease === 'customWiggle'
        ? tinyColor(tween.customWiggle.strength).toRgbString()
        : getDestinationShadowColor(),
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const getOriginShadowOffsetX = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osx = originLayerItem.style.shadow.offset.x;
    if (!originShadow.enabled && destinationShadow.enabled) {
      osx = 0;
    }
    return osx;
  }

  const getDestinationShadowOffsetX = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let dsx = destinationLayerItem.style.shadow.offset.x;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsx = 0;
    }
    return dsx;
  }

  const addShadowOffsetXTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = getOriginShadowOffsetX();
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : getDestinationShadowOffsetX(),
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const getOriginShadowOffsetY = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osy = originLayerItem.style.shadow.offset.y;
    if (!originShadow.enabled && destinationShadow.enabled) {
      osy = 0;
    }
    return osy;
  }

  const getDestinationShadowOffsetY = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let dsy = destinationLayerItem.style.shadow.offset.y;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsy = 0;
    }
    return dsy;
  }

  const addShadowOffsetYTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = getOriginShadowOffsetY();
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : getDestinationShadowOffsetY(),
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const getOriginShadowBlur = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let osb = originLayerItem.style.shadow.blur;
    if (!originShadow.enabled && destinationShadow.enabled) {
      osb = 0;
    }
    return osb;
  }

  const getDestinationShadowBlur = () => {
    const originShadow = originLayerItem.style.shadow;
    const destinationShadow = destinationLayerItem.style.shadow;
    let dsb = destinationLayerItem.style.shadow.blur;
    if (originShadow.enabled && !destinationShadow.enabled) {
      dsb = 0;
    }
    return dsb;
  }

  const addShadowBlurTween = (): void => {
    eventLayerTimeline.data.props[tween.prop] = getOriginShadowBlur();
    eventLayerTimeline.to(eventLayerTimeline.data.props, {
      id: tweenId,
      duration: tween.duration,
      repeat: tween.repeat,
      yoyo: tween.yoyo,
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : getDestinationShadowBlur(),
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style.opacity,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationLayerItem.style.blur.enabled
          ? destinationLayerItem.style.blur.radius
          : 0,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationTextItem.textStyle.fontSize,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationTextItem.textStyle.fontWeight,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : getLeading({
            leading: destinationTextItem.textStyle.leading,
            fontSize: destinationTextItem.textStyle.fontSize
          }),
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
              ? getTransformedText(
                  destinationTextItem.text,
                  destinationTextItem.textStyle.textTransform
                )
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
              ? getTransformedText(
                  destinationTextItem.text,
                  destinationTextItem.textStyle.textTransform
                )
              : '',
          delimiter: tween.text.delimiter,
          speed: tween.text.speed,
          type: tween.text.diff ? 'diff' : null
        }
      },
      ease: getEaseString(tween),
      onUpdate: () => {
        eventLayerTimeline.data.props['text'] = textDOM.innerText;
      }
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? `+=${tween.customWiggle.strength}`
        : destinationTextItem.textStyle.letterSpacing,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? ((originLayerItem.transform.horizontalFlip ? 1 : -1) * tween.customWiggle.strength)
        : destinationLayerItem.transform.horizontalFlip ? -1 : 1,
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
      [tween.prop]: tween.ease === 'customWiggle'
        ? ((originLayerItem.transform.verticalFlip ? 1 : -1) * tween.customWiggle.strength)
        : destinationLayerItem.transform.verticalFlip ? -1 : 1,
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const handleXTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'x')) {
      const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
      paperLayer.position.x = currentProps.x;
      if (shapeMask) {
        shapeMask.position.y = currentProps.y;
      }
    }
  }

  const handleYTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'y')) {
      const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
      paperLayer.position.y = currentProps.y;
      if (shapeMask) {
        shapeMask.position.y = currentProps.y;
      }
    }
  }

  const handleClearTransforms = (currentProps: TweenProps, prevProps: TweenProps) => {
    const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
    clearLayerTransforms({
      paperLayer,
      layerType: originLayerItem.type,
      transform: {
        rotation: prevProps.rotation,
        horizontalFlip: prevProps.scaleX,
        verticalFlip: prevProps.scaleY
      } as any,
      variable: true,
      width: prevProps.boundingWidth,
      height: prevProps.boundingHeight
    });
    if (shapeMask) {
      clearLayerTransforms({
        paperLayer: shapeMask,
        layerType: originLayerItem.type,
        transform: {
          rotation: prevProps.rotation,
          horizontalFlip: prevProps.scaleX,
          verticalFlip: prevProps.scaleY
        } as any,
        variable: true,
        width: prevProps.boundingWidth,
        height: prevProps.boundingHeight
      });
    }
  }

  const handleWidthTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    const { paperLayer, textContent, textMask, textBackground, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
    if (getHasSinglePropChange(currentProps, prevProps, 'width')) {
      if (originLayerItem.type === 'Text') {
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
    }
  }

  const handleHeightTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    const { paperLayer, textContent, textMask, textBackground, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
    if (getHasSinglePropChange(currentProps, prevProps, 'height')) {
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
    }
  }

  const handleFontSizeTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'fontSize')) {
      const { textContent } = eventLayerTimeline.data as EventLayerTimelineData;
      textContent.fontSize = currentProps.fontSize;
    }
  }

  const handleFontWeightTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'fontWeight')) {
      const { textContent } = eventLayerTimeline.data as EventLayerTimelineData;
      textContent.fontWeight = currentProps.fontWeight;
    }
  }

  const handleLetterSpacingTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'letterSpacing')) {
      const { textContent } = eventLayerTimeline.data as EventLayerTimelineData;
      textContent.letterSpacing = currentProps.letterSpacing;
    }
  }

  const handleLineHeightTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'lineHeight')) {
      const { textContent } = eventLayerTimeline.data as EventLayerTimelineData;
      textContent.leading = currentProps.lineHeight;
    }
  }

  const handleTextContentTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    const { paperLayer, textContent, textMask, textBackground } = eventLayerTimeline.data as EventLayerTimelineData;
    const textContentProps = ['width', 'fontSize', 'fontWeight', 'text', 'letterSpacing', 'lineHeight'];
    const hasTextContentPropChange = hasSomePropsChange(currentProps, prevProps, textContentProps);
    if (hasTextContentPropChange && originLayerItem.type === 'Text') {
      textContent.content = getContent({
        paragraphs: getParagraphs({
          text: currentProps.text,
          fontSize: currentProps.fontSize,
          fontWeight: currentProps.fontWeight,
          fontFamily: (originLayerItem as Btwx.Text).textStyle.fontFamily,
          textResize: (originLayerItem as Btwx.Text).textStyle.textResize,
          innerWidth: currentProps.width,
          letterSpacing: currentProps.letterSpacing,
          textTransform: (originLayerItem as Btwx.Text).textStyle.textTransform,
          fontStyle: (originLayerItem as Btwx.Text).textStyle.fontStyle,
          preview: true
        })
      });
      switch((originLayerItem as Btwx.Text).textStyle.textResize) {
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
        case 'fixed': {
          if ((originLayerItem as Btwx.Text).textStyle.verticalAlignment === 'top') {
            const diff = (currentProps.lineHeight - prevProps.lineHeight) * 0.75;
            textMask.position.y -= diff;
            textBackground.position.y -= diff;
          }
          break;
        }
      }
      positionTextContent({
        paperLayer: paperLayer as paper.Group,
        verticalAlignment: (originLayerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (originLayerItem as Btwx.Text).textStyle.justification,
        textResize: (originLayerItem as Btwx.Text).textStyle.textResize
      });
    }
  }

  const handleOpacityTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'opacity')) {
      const { paperLayer } = eventLayerTimeline.data as EventLayerTimelineData;
      paperLayer.opacity = currentProps.opacity;
    }
  }

  const handleBlurTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'blur')) {
      const { paperLayer } = eventLayerTimeline.data as EventLayerTimelineData;
      paperLayer.style.blur = currentProps.blur;
    }
  }

  const handleShapeTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'shape')) {
      const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
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
    }
  }

  const handleDashOffsetTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'dashOffset')) {
      const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
      fillRef.dashOffset = currentProps.dashOffset;
    }
  }

  const handleDashArrayWidthTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'dashArrayWidth')) {
      const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
      fillRef.dashArray = [currentProps.dashArrayWidth < 1 ? 0 : currentProps.dashArrayWidth, fillRef.dashArray[1] < 1 ? 0 : fillRef.dashArray[1]];
    }
  }

  const handleDashArrayGapTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'dashArrayGap')) {
      const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
      fillRef.dashArray = [fillRef.dashArray[0] < 1 ? 0 : fillRef.dashArray[0], currentProps.dashArrayGap < 1 ? 0 : currentProps.dashArrayGap];
    }
  }

  const handleStrokeWidthTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'strokeWidth')) {
      const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
      fillRef.strokeWidth = currentProps.strokeWidth;
    }
  }

  const applyShadow = (currentProps: TweenProps) => {
    const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
    fillRef.shadowColor = currentProps.shadowColor as any;
    fillRef.shadowOffset = new paperPreview.Point(currentProps.shadowOffsetX, currentProps.shadowOffsetY);
    fillRef.shadowBlur = currentProps.shadowBlur;
  }

  const handleShadowColorTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'shadowColor')) {
      applyShadow(currentProps);
    }
  }

  const handleShadowOffsetXTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'shadowOffsetX')) {
      applyShadow(currentProps);
    }
  }

  const handleShadowOffsetYTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'shadowOffsetY')) {
      applyShadow(currentProps);
    }
  }

  const handleShadowBlurTween = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (getHasSinglePropChange(currentProps, prevProps, 'shadowBlur')) {
      applyShadow(currentProps);
    }
  }

  const handleGradientOriginFSTween = (currentProps: TweenProps, prevProps: TweenProps, style: 'fill' | 'stroke', prop: 'x' | 'y') => {
    if (getHasSinglePropChange(currentProps, prevProps, `${style}GradientOrigin${prop.toUpperCase()}`)) {
      const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
      const isLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
      const widthRef = isLine ? currentProps.boundingWidth : currentProps.width;
      const heightRef = isLine ? currentProps.boundingHeight : currentProps.height;
      const originX = currentProps[`${style}GradientOriginX`];
      const originY = currentProps[`${style}GradientOriginY`];
      const originXEase = currentProps[`${style}GradientOriginXEase`];
      const originYEase = currentProps[`${style}GradientOriginYEase`];
      const nextOriginX = originXEase === 'customWiggle' ? originX : (originX * widthRef) + paperLayer.position.x;
      const nextOriginY = originYEase === 'customWiggle' ? originY : (originY * heightRef) + paperLayer.position.y;
      const nextOrigin = new paperPreview.Point(nextOriginX, nextOriginY);
      (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
    }
  }

  const handleGradientDestinationFSTween = (currentProps: TweenProps, prevProps: TweenProps, style: 'fill' | 'stroke', prop: 'x' | 'y') => {
    if (getHasSinglePropChange(currentProps, prevProps, `${style}GradientDestination${prop.toUpperCase()}`)) {
      const { paperLayer, fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
      const isLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
      const widthRef = isLine ? currentProps.boundingWidth : currentProps.width;
      const heightRef = isLine ? currentProps.boundingHeight : currentProps.height;
      const destinationX = currentProps[`${style}GradientDestinationX`];
      const destinationY = currentProps[`${style}GradientDestinationY`];
      const destinationXEase = currentProps[`${style}GradientDestinationXEase`];
      const destinationYEase = currentProps[`${style}GradientDestinationYEase`];
      const nextDestinationX = destinationXEase === 'customWiggle' ? destinationX : (destinationX * widthRef) + paperLayer.position.x;
      const nextDestinationY = destinationYEase === 'customWiggle' ? destinationY : (destinationY * heightRef) + paperLayer.position.y;
      const nextDestination = new paperPreview.Point(nextDestinationX, nextDestinationY);
      (fillRef[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
    }
  }

  const handleFSTween = (currentProps: TweenProps, prevProps: TweenProps, style: 'fill' | 'stroke') => {
    if (getHasSinglePropChange(currentProps, prevProps, style)) {
      const originStyle = originLayerItem.style[style];
      const destinationStyle = destinationLayerItem.style[style];
      const originGradient = originStyle.gradient;
      const ogStops = originGradient.stops;
      const destinationGradient = destinationStyle.gradient;
      const dgStops = destinationGradient.stops;
      const handleStopColorTween = (count, withOffset: boolean = false) => [...Array(count).keys()].forEach((id, index) => {
        const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
        const nextStopColor = currentProps[`${style}Stop${index}Color`];
        const nextStopOffset = currentProps[`${style}Stop${index}Offset`];
        if (fillRef[`${style}Color`] && fillRef[`${style}Color`].gradient && fillRef[`${style}Color`].gradient.stops[index]) {
          fillRef[`${style}Color`].gradient.stops[index].color = nextStopColor;
          if (withOffset) {
            fillRef[`${style}Color`].gradient.stops[index].offset = nextStopOffset;
          }
        }
      });
      switch(currentProps[`${style}Type`]) {
        case 'colorToColor':
        case 'colorToNull':
        case 'nullToColor': {
          const { fillRef } = eventLayerTimeline.data as EventLayerTimelineData;
          fillRef[`${style}Color`] = currentProps[style] as any;
          break;
        }
        case 'gradientToGradient': {
          handleStopColorTween(ogStops.length > dgStops.length ? ogStops.length : dgStops.length, true);
          break;
        }
        case 'gradientToColor':
        case 'gradientToNull': {
          handleStopColorTween(ogStops.length);
          break;
        }
        case 'colorToGradient':
        case 'nullToGradient': {
          handleStopColorTween(dgStops.length);
          break;
        }
      }
    }
  }

  const handleBoundingSizeUpdate = (currentProps: TweenProps) => {
    const { paperLayer } = eventLayerTimeline.data as EventLayerTimelineData;
    if (currentProps.rotation) {
      paperLayer.rotation = currentProps.rotation;
    }
    eventLayerTimeline.data.props['boundingWidth'] = paperLayer.bounds.width;
    eventLayerTimeline.data.props['boundingHeight'] = paperLayer.bounds.height;
    if (currentProps.rotation) {
      paperLayer.rotation = -currentProps.rotation;
    }
  }

  const handleGradientOD = (currentProps: TweenProps, prevProps: TweenProps) => {
    if (currentProps.strokeType || currentProps.fillType) {
      updateGradientsOD();
    }
  }

  const handleApplyTransforms = (currentProps: TweenProps) => {
    const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
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

  const handleTimelineUpdate = () => {
    const { paperLayer, shapeMask } = eventLayerTimeline.data as EventLayerTimelineData;
    const currentProps = getProps();
    const prevProps = getProps(true);
    // position tweens
    handleXTween(currentProps, prevProps);
    handleYTween(currentProps, prevProps);
    // store start position
    const startPosition = paperLayer.position;
    // clear transforms
    handleClearTransforms(currentProps, prevProps);
    // size tweens
    handleShapeTween(currentProps, prevProps);
    handleWidthTween(currentProps, prevProps);
    handleHeightTween(currentProps, prevProps);
    // text tweens
    handleFontSizeTween(currentProps, prevProps);
    handleFontWeightTween(currentProps, prevProps);
    handleLineHeightTween(currentProps, prevProps);
    handleTextContentTween(currentProps, prevProps);
    handleLetterSpacingTween(currentProps, prevProps);
    // stroke option tweens
    handleDashOffsetTween(currentProps, prevProps);
    handleDashArrayWidthTween(currentProps, prevProps);
    handleDashArrayGapTween(currentProps, prevProps);
    // shadow tweens
    handleShadowColorTween(currentProps, prevProps);
    handleShadowOffsetXTween(currentProps, prevProps);
    handleShadowOffsetYTween(currentProps, prevProps);
    handleShadowBlurTween(currentProps, prevProps);
    // fill tweens
    handleFSTween(currentProps, prevProps, 'fill');
    handleGradientOriginFSTween(currentProps, prevProps, 'fill', 'x');
    handleGradientOriginFSTween(currentProps, prevProps, 'fill', 'y');
    handleGradientDestinationFSTween(currentProps, prevProps, 'fill', 'x');
    handleGradientDestinationFSTween(currentProps, prevProps, 'fill', 'y');
    // stroke tweens
    handleFSTween(currentProps, prevProps, 'stroke');
    handleStrokeWidthTween(currentProps, prevProps);
    handleGradientOriginFSTween(currentProps, prevProps, 'stroke', 'x');
    handleGradientOriginFSTween(currentProps, prevProps, 'stroke', 'y');
    handleGradientDestinationFSTween(currentProps, prevProps, 'stroke', 'x');
    handleGradientDestinationFSTween(currentProps, prevProps, 'stroke', 'y');
    // update boundingWidth and boundingHeight props
    handleBoundingSizeUpdate(currentProps);
    // context tweens
    handleOpacityTween(currentProps, prevProps);
    handleBlurTween(currentProps, prevProps);
    // apply transforms
    handleApplyTransforms(currentProps);
    // apply start position
    paperLayer.position = startPosition;
    if (shapeMask) {
      shapeMask.position = startPosition;
    }
    // update gradients if position/size change
    handleGradientOD(currentProps, prevProps);
    // set prevProps
    eventLayerTimeline.data.prevProps = currentProps;
  }

  const addTween = () => {
    switch(tween.prop) {
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
        addShadowOffsetXTween();
        break;
      case 'shadowOffsetY':
        addShadowOffsetYTween();
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
    if (eventLayerTimeline && tween) {
      if (gsap.getById(tweenId)) {
        eventLayerTimeline.remove(gsap.getById(tweenId));
      }
      addTween();
      (eventLayerTimeline as GSAPTimeline).eventCallback('onUpdate', handleTimelineUpdate);
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
        eventLayerTimeline.data.prevProps = Object.keys(eventLayerTimeline.data.prevProps).reduce((result, current) => {
          if (current !== tween.prop && !current.startsWith(tween.prop)) {
            result = {
              ...result,
              [current]: eventLayerTimeline.data.prevProps[current]
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

  // add flag for autoplay
  useEffect(() => {
    if (tween && edit.id && edit.tweenEdit && eventLayerTimeline && autoplay && isPreviewOpen && edit.tweenEdit[0] === tweenId) {
      setAutoplayInstance(autoplayInstance ? autoplayInstance + 1 : 1);
    }
  }, [edit.id]);

  // autoplay on next render
  useEffect(() => {
    if (autoplayInstance) {
      eventTimeline.play(0, false);
    }
  }, [autoplayInstance]);

  return (
    originLayerItem && originLayerItem.type === 'Text'
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