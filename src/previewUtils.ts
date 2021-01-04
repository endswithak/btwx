/* eslint-disable @typescript-eslint/no-use-before-define */
import tinyColor from 'tinycolor2';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { paperPreview } from './canvas';

gsap.registerPlugin(MorphSVGPlugin, RoughEase, SlowMo, CustomBounce, CustomWiggle, ScrambleTextPlugin);

export const getEaseString = (tween: Btwx.Tween): string => {
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

export interface AddTweenProps {
  tween: Btwx.Tween;
  timeline: gsap.core.Timeline;
  timelineTweenProps: {
    [prop: string]: any;
  };
  originLayerItem: Btwx.Layer;
  destinationLayerItem: Btwx.Layer;
  originPaperLayer: paper.Item;
  destinationPaperLayer: paper.Item;
  originArtboardLayerItem: Btwx.Artboard;
  destinationArtboardLayerItem: Btwx.Artboard;
  originArtboardPaperLayer: paper.Item;
  destinationArtboardPaperLayer: paper.Item;
}

export const addImageTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const beforeRaster = originPaperLayer.getItem({data: {id: 'raster'}}) as paper.Raster;
  const destinationRaster = destinationPaperLayer.getItem({data: {id: 'raster'}}) as paper.Raster;
  const afterRaster = beforeRaster.clone() as paper.Raster;
  afterRaster.source = destinationRaster.source;
  // afterRaster.bounds = beforeRaster.bounds;
  // afterRaster.position = beforeRaster.position;
  afterRaster.opacity = 0;
  // afterRaster.parent = beforeRaster.parent;
  timelineTweenProps[`${tween.prop}-before`] = 1;
  timelineTweenProps[`${tween.prop}-after`] = 0;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [`${tween.prop}-before`]: 0,
    [`${tween.prop}-after`]: 1,
    onUpdate: () => {
      beforeRaster.opacity = timelineTweenProps[`${tween.prop}-before`];
      afterRaster.opacity = timelineTweenProps[`${tween.prop}-after`];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addShapeTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  // get shapes without rotation
  const tweenPaperLayerClone = originPaperLayer.clone({insert: false});
  const tweenDestinationLayerPaperLayerClone = destinationPaperLayer.clone({insert: false});
  tweenPaperLayerClone.rotation = -originLayerItem.transform.rotation;
  tweenDestinationLayerPaperLayerClone.rotation = -destinationLayerItem.transform.rotation;
  // get morph data
  const morphData = [
    (tweenPaperLayerClone as paper.Path).pathData,
    (tweenDestinationLayerPaperLayerClone as paper.Path).pathData
  ];
  MorphSVGPlugin.pathFilter(morphData);
  timelineTweenProps[tween.prop] = morphData[0];
  // set tween
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: morphData[1],
    onUpdate: function() {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : originLayerItem.frame.innerWidth;
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : originLayerItem.frame.innerHeight;
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      const startPosition = originPaperLayer.position;
      originPaperLayer.rotation = -startRotation;
      // apply final clone path data to tweenPaperLayer
      (originPaperLayer as paper.Path).pathData = timelineTweenProps[tween.prop];
      originPaperLayer.bounds.width = innerWidth;
      originPaperLayer.bounds.height = innerHeight;
      originPaperLayer.rotation = startRotation;
      originPaperLayer.position = startPosition;
      // update fill gradient origin/destination if needed
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const updateGradients = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textLines = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
  ['fill', 'stroke'].forEach((style: 'fill' | 'stroke') => {
    if (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] && originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient || isText && textLines.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] && textLines.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient) {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (isOriginLayerLine ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (isOriginLayerLine ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
      const originX = originPaperLayer.data[`${style}GradientOriginX`] ? originPaperLayer.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
      const originY = originPaperLayer.data[`${style}GradientOriginY`] ? originPaperLayer.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
      const destinationX = originPaperLayer.data[`${style}GradientDestinationX`] ? originPaperLayer.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
      const destinationY = originPaperLayer.data[`${style}GradientDestinationY`] ? originPaperLayer.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
      const nextOrigin = new paperPreview.Point((originX * innerWidth) + originPaperLayer.position.x, (originY * innerHeight) + originPaperLayer.position.y);
      const nextDestination = new paperPreview.Point((destinationX * innerWidth) + originPaperLayer.position.x, (destinationY * innerHeight) + originPaperLayer.position.y);
      if (isText) {
        textLines.children.forEach((line) => {
          (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
          (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        });
      } else {
        (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
      }
    }
  });
};

export const getFSTweenType = (props: AddTweenProps, style: 'fill' | 'stroke'): Btwx.FillStrokeTween => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const paperStyle = `${style}Color` as 'fillColor' | 'strokeColor';
  const isText = originLayerItem.type === 'Text';
  const originPaperRef = isText ? originPaperLayer.getItem({data: {id: 'textLine'}}) : originPaperLayer;
  const destinationPaperRef = isText ? destinationPaperLayer.getItem({data: {id: 'textLine'}}) : destinationPaperLayer;
  // color to color style
  if (
    originPaperRef[paperStyle] &&
    (originPaperRef[paperStyle].type === 'rgb' || originPaperRef[paperStyle].type === 'hsl') &&
    destinationPaperRef[paperStyle] &&
    (destinationPaperRef[paperStyle].type === 'rgb' || destinationPaperRef[paperStyle].type === 'hsl')
  ) {
    return 'colorToColor';
  // no style to color style
  } else if (
    !originPaperRef[paperStyle] &&
    destinationPaperRef[paperStyle] &&
    (destinationPaperRef[paperStyle].type === 'rgb' || destinationPaperRef[paperStyle].type === 'hsl')
  ) {
    return 'nullToColor';
  // color style to no style
  } else if (
    originPaperRef[paperStyle] &&
    !destinationPaperRef[paperStyle] &&
    (originPaperRef[paperStyle].type === 'rgb' || originPaperRef[paperStyle].type === 'hsl')
  ) {
    return 'colorToNull';
  // gradient style to gradient style
  } else if (
    originPaperRef[paperStyle] &&
    originPaperRef[paperStyle].type === 'gradient' &&
    destinationPaperRef[paperStyle] &&
    destinationPaperRef[paperStyle].type === 'gradient'
  ) {
    return 'gradientToGradient';
  // gradient style to color style
  } else if (
    originPaperRef[paperStyle] &&
    originPaperRef[paperStyle].type === 'gradient' &&
    destinationPaperRef[paperStyle] &&
    (destinationPaperRef[paperStyle].type === 'rgb' || destinationPaperRef[paperStyle].type === 'hsl')
  ) {
    return 'gradientToColor';
  // color style to gradient style
  } else if (
    originPaperRef[paperStyle] &&
    (originPaperRef[paperStyle].type === 'rgb' || originPaperRef[paperStyle].type === 'hsl') &&
    destinationPaperRef[paperStyle] &&
    destinationPaperRef[paperStyle].type === 'gradient'
  ) {
    return 'colorToGradient';
  // gradient style to no style
  } else if (
    originPaperRef[paperStyle] &&
    originPaperRef[paperStyle].type === 'gradient' &&
    !destinationPaperRef[paperStyle]
  ) {
    return 'gradientToNull';
  // no style to gradient style
  } else if (
    !originPaperRef[paperStyle] &&
    destinationPaperRef[paperStyle] &&
    destinationPaperRef[paperStyle].type === 'gradient'
  ) {
    return 'nullToGradient';
  }
};

export const addFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const fillTweenType = getFSTweenType(props, style);
  switch(fillTweenType) {
    case 'colorToColor':
      addColorToColorFSTween(props, style);
      break;
    case 'nullToColor':
      addNullToColorFSTween(props, style);
      break;
    case 'colorToNull':
      addColorToNullFSTween(props, style);
      break;
    case 'gradientToGradient':
      addGradientToGradientFSTween(props, style);
      break;
    case 'gradientToColor':
      addGradientToColorFSTween(props, style);
      break;
    case 'colorToGradient':
      addColorToGradientFSTween(props, style);
      break;
    case 'gradientToNull':
      addGradientToNullFSTween(props, style);
      break;
    case 'nullToGradient':
      addNullToGradientFSTween(props, style);
      break;
  }
};

export const addColorToColorFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textContent = isText ? originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText : null;
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const ofc = originLayerItem.style.fill.color;
  const dfc = destinationLayerItem.style.fill.color;
  timelineTweenProps[tween.prop] = tinyColor({h: ofc.h, s: ofc.s, l: ofc.l, a: ofc.a}).toHslString();
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: dfc.a}).toHslString(),
    onUpdate: () => {
      if (isText) {
        textLinesGroup.children.forEach((line) => {
          line[`${style}Color` as 'fillColor' | 'strokeColor'] = timelineTweenProps[tween.prop];
        });
      } else {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = timelineTweenProps[tween.prop];
      }
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addNullToColorFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const dfc = destinationLayerItem.style.fill.color;
  timelineTweenProps[tween.prop] = tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: 0}).toHslString();
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: dfc.a}).toHslString(),
    onUpdate: () => {
      if (isText) {
        textLinesGroup.children.forEach((line) => {
          line[`${style}Color` as 'fillColor' | 'strokeColor'] = timelineTweenProps[tween.prop];
        });
      } else {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = timelineTweenProps[tween.prop];
      }
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addColorToNullFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const ofc = originLayerItem.style.fill.color;
  timelineTweenProps[tween.prop] = ofc.a;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: 0,
    onUpdate: () => {
      if (isText) {
        textLinesGroup.children.forEach((line) => {
          line[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = timelineTweenProps[tween.prop];
        });
      } else {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = timelineTweenProps[tween.prop];
      }
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addGradientOriginXFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  timelineTweenProps[tween.prop] = originLayerItem.style[style].gradient.origin.x;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.style[style].gradient.origin.x,
    onUpdate: () => {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
      const originX = timelineTweenProps[tween.prop];
      const originY = originPaperLayer.data[`${style}GradientOriginY`] ? originPaperLayer.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
      const nextOrigin = new paperPreview.Point((originX * innerWidth) + originPaperLayer.position.x, (originY * innerHeight) + originPaperLayer.position.y);
      if (isText) {
        textLinesGroup.children.forEach((line) => {
          (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        });
      } else {
        (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
      }
      originPaperLayer.data[tween.prop] = originX;
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addGradientOriginYFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  timelineTweenProps[tween.prop] = originLayerItem.style[style].gradient.origin.y;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.style[style].gradient.origin.y,
    onUpdate: () => {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
      const originX = originPaperLayer.data[`${style}GradientOriginX`] ? originPaperLayer.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
      const originY = timelineTweenProps[tween.prop];
      const nextOrigin = new paperPreview.Point((originX * innerWidth) + originPaperLayer.position.x, (originY * innerHeight) + originPaperLayer.position.y);
      if (isText) {
        textLinesGroup.children.forEach((line) => {
          (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        });
      } else {
        (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
      }
      originPaperLayer.data[tween.prop] = originY;
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addGradientDestinationXFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  timelineTweenProps[tween.prop] = originLayerItem.style[style].gradient.destination.x;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.style[style].gradient.destination.x,
    onUpdate: () => {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
      const destinationX = timelineTweenProps[tween.prop];
      const destinationY = originPaperLayer.data[`${style}GradientDestinationY`] ? originPaperLayer.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
      const nextDestination = new paperPreview.Point((destinationX * innerWidth) + originPaperLayer.position.x, (destinationY * innerHeight) + originPaperLayer.position.y);
      if (isText) {
        textLinesGroup.children.forEach((line) => {
          (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        });
      } else {
        (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
      }
      originPaperLayer.data[tween.prop] = destinationX;
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addGradientDestinationYFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  timelineTweenProps[tween.prop] = originLayerItem.style[style].gradient.destination.y;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.style[style].gradient.destination.y,
    onUpdate: () => {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
      const destinationX = originPaperLayer.data[`${style}GradientDestinationX`] ? originPaperLayer.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
      const destinationY = timelineTweenProps[tween.prop];
      const nextDestination = new paperPreview.Point((destinationX * innerWidth) + originPaperLayer.position.x, (destinationY * innerHeight) + originPaperLayer.position.y);
      if (isText) {
        textLinesGroup.children.forEach((line) => {
          (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        });
      } else {
        (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
      }
      originPaperLayer.data[tween.prop] = destinationY;
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addGradientToGradientFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const stopsTimeline = gsap.timeline();
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const og = originLayerItem.style.fill.gradient;
  const dg = destinationLayerItem.style.fill.gradient;
  const originStopCount = og.stops.length;
  const destinationStopCount = dg.stops.length;
  if (destinationStopCount > originStopCount) {
    const diff = destinationStopCount - originStopCount;
    for (let i = 0; i < diff; i++) {
      const stopClone = {...og.stops[0]};
      og.stops.push(stopClone);
    }
    stopsTimeline.eventCallback('onStart', () => {
      const diff = destinationStopCount - originStopCount;
      const paperLayerRef = isText ? textLinesGroup : originPaperLayer;
      const gradientRef = isText ? paperLayerRef.children[0] : originPaperLayer;
      for (let i = 0; i < diff; i++) {
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
    });
  }
  og.stops.forEach((stop, index) => {
    const sc = stop.color;
    const sp = stop.position;
    // get closest destination stop if index is greater than destination stop length
    const cds = dg.stops.reduce((result, current) => {
      return (Math.abs(current.position - stop.position) < Math.abs(result.position - stop.position) ? current : result);
    });
    const dc = dg.stops[index] ? dg.stops[index].color : cds.color;
    const dp = dg.stops[index] ? dg.stops[index].position : cds.position;
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString();
    timelineTweenProps[`${tween.prop}-stop-${index}-offset`] = sp;
    stopsTimeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: tinyColor({h: dc.h, s: dc.s, l: dc.l, a: dc.a}).toHslString(),
      [`${tween.prop}-stop-${index}-offset`]: dp,
      onUpdate: () => {
        if (isText) {
          textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
          textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = timelineTweenProps[`${tween.prop}-stop-${index}-offset`];
          textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
              radial: dg.gradientType === 'radial'
            },
            origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
            destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
          } as Btwx.PaperGradientFill;
        } else {
          originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
          originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = timelineTweenProps[`${tween.prop}-stop-${index}-offset`];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  });
  timeline.add(stopsTimeline, 0);
};

export const addGradientToColorFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const stopsTimeline = gsap.timeline();
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const og = originLayerItem.style[style].gradient;
  const dc = destinationLayerItem.style[style].color;
  og.stops.forEach((stop, index) => {
    const sc = stop.color;
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString();
    stopsTimeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: tinyColor({h: dc.h, s: dc.s, l: dc.l, a: dc.a}).toHslString(),
      onUpdate: () => {
        if (isText) {
          textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
          textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
              radial: og.gradientType === 'radial'
            },
            origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
            destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
          } as Btwx.PaperGradientFill;
        } else {
          originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  });
  timeline.add(stopsTimeline, 0);
};

export const addColorToGradientFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const stopsTimeline = gsap.timeline();
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const paperLayerRef = isText ? textLinesGroup : originPaperLayer;
  const oc = originLayerItem.style[style].color;
  const dg = destinationLayerItem.style[style].gradient;
  stopsTimeline.eventCallback('onStart', () => {
    originPaperLayer.data[`${style}GradientOriginX`] = dg.origin.x;
    originPaperLayer.data[`${style}GradientOriginY`] = dg.origin.y;
    originPaperLayer.data[`${style}GradientDestinationX`] = dg.destination.x;
    originPaperLayer.data[`${style}GradientDestinationY`] = dg.destination.y;
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
      origin: new paperPreview.Point((destinationLayerItem.style[style].gradient.origin.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (destinationLayerItem.style[style].gradient.origin.y * originPaperLayer.bounds.height) + originPaperLayer.position.y),
      destination: new paperPreview.Point((destinationLayerItem.style[style].gradient.destination.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (destinationLayerItem.style[style].gradient.destination.y * originPaperLayer.bounds.height) + originPaperLayer.position.y)
    } as Btwx.PaperGradientFill;
  });
  dg.stops.forEach((stop, index) => {
    const sc = stop.color;
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = tinyColor({h: oc.h, s: oc.s, l: oc.l, a: oc.a}).toHslString();
    stopsTimeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString(),
      onUpdate: () => {
        if (isText) {
          textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
          textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
              radial: dg.gradientType === 'radial'
            },
            origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
            destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
          } as Btwx.PaperGradientFill;
        } else {
          originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  });
  timeline.add(stopsTimeline, 0);
};

export const addGradientToNullFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const stopsTimeline = gsap.timeline();
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const og = originLayerItem.style[style].gradient;
  og.stops.forEach((stop, index) => {
    const sc = stop.color;
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = sc.a;
    stopsTimeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: 0,
      onUpdate: () => {
        if (isText) {
          textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
          textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
              radial: og.gradientType === 'radial'
            },
            origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
            destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
          } as Btwx.PaperGradientFill;
        } else {
          originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  });
  timeline.add(stopsTimeline, 0);
};

export const addNullToGradientFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const stopsTimeline = gsap.timeline();
  const isText = originLayerItem.type === 'Text';
  const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
  const dg = destinationLayerItem.style[style].gradient;
  stopsTimeline.eventCallback('onStart', () => {
    originPaperLayer.data[`${style}GradientOriginX`] = dg.origin.x;
    originPaperLayer.data[`${style}GradientOriginY`] = dg.origin.y;
    originPaperLayer.data[`${style}GradientDestinationX`] = dg.destination.x;
    originPaperLayer.data[`${style}GradientDestinationY`] = dg.destination.y;
    // set origin layer styleColor to destination layer gradient with opaque stops
    const paperLayerRef = isText ? textLinesGroup : originPaperLayer;
    paperLayerRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
      gradient: {
        stops: dg.stops.map((stop) => {
          const sc = stop.color;
          const sp = stop.position;
          return new paperPreview.GradientStop({hue: sc.h, saturation: sc.s, lightness: sc.l, alpha: 0} as paper.Color, sp);
        }),
        radial: dg.gradientType === 'radial'
      },
      origin: new paperPreview.Point((dg.origin.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (dg.origin.y * originPaperLayer.bounds.height) + originPaperLayer.position.y),
      destination: new paperPreview.Point((dg.destination.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (dg.destination.y * originPaperLayer.bounds.height) + originPaperLayer.position.y)
    } as Btwx.PaperGradientFill;
  });
  dg.stops.forEach((stop, index) => {
    const sc = stop.color;
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = 0;
    stopsTimeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: sc.a,
      onUpdate: () => {
        if (isText) {
          textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
          textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
            gradient: {
              stops: textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
              radial: dg.gradientType === 'radial'
            },
            origin: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
            destination: (textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
          } as Btwx.PaperGradientFill;
        } else {
          originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  });
  timeline.add(stopsTimeline, 0);
};

export const addDashOffsetTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originPaperLayer.dashOffset;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationPaperLayer.dashOffset,
    onUpdate: () => {
      originPaperLayer.dashOffset = timelineTweenProps[tween.prop];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addDashArrayWidthTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originPaperLayer.dashArray[0];
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationPaperLayer.dashArray[0],
    onUpdate: () => {
      originPaperLayer.dashArray = [timelineTweenProps[tween.prop], originPaperLayer.dashArray[1]];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addDashArrayGapTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originPaperLayer.dashArray[1];
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationPaperLayer.dashArray[1],
    onUpdate: () => {
      originPaperLayer.dashArray = [originPaperLayer.dashArray[0], timelineTweenProps[tween.prop]];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addStrokeWidthTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originPaperLayer.strokeWidth;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationPaperLayer.strokeWidth,
    onUpdate: () => {
      originPaperLayer.strokeWidth = timelineTweenProps[tween.prop];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addXTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  if (isText) {
    const destinationJustification = (destinationLayerItem as Btwx.Text).textStyle.justification;
    const originClone = originPaperLayer.clone({insert: false});
    const destinationClone = destinationPaperLayer.clone({insert: false});
    const originCloneContent = originClone.getItem({data: {id: 'textContent'}}) as paper.PointText;
    const destinationCloneContent = destinationClone.getItem({data: {id: 'textContent'}}) as paper.PointText;
    originClone.rotation = -originLayerItem.transform.rotation;
    destinationClone.rotation = -destinationLayerItem.transform.rotation;
    let start: number;
    let end: number;
    switch(destinationJustification) {
      case 'left':
        start = originCloneContent.bounds.left - originArtboardPaperLayer.bounds.left;
        end = destinationCloneContent.bounds.left - destinationArtboardPaperLayer.bounds.left;
        break;
      case 'center':
        start = originCloneContent.bounds.center.x - originArtboardPaperLayer.bounds.center.x;
        end = destinationCloneContent.bounds.center.x - destinationArtboardPaperLayer.bounds.center.x;
        break;
      case 'right':
        start = originCloneContent.bounds.right - originArtboardPaperLayer.bounds.right;
        end = destinationCloneContent.bounds.right - destinationArtboardPaperLayer.bounds.right;
        break;
    }
    const diff = end - start;
    timelineTweenProps[tween.prop] = 0;
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [tween.prop]: 1,
      onUpdate: () => {
        const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
        const startX = originPaperLayer.data.x || originPaperLayer.data.x === 0 ? originPaperLayer.data.x : 0;
        const xDiff = diff * (timelineTweenProps[tween.prop] - startX);
        originPaperLayer.rotation = -startRotation;
        originPaperLayer.position.x += xDiff;
        originPaperLayer.rotation = startRotation;
        originPaperLayer.data.x = timelineTweenProps[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  } else {
    const originPaperLayerPositionDiffX = destinationLayerItem.frame.x - originLayerItem.frame.x;
    timelineTweenProps[tween.prop] = originLayerItem.type === 'Image' ? originPaperLayer.getItem({data: {id: 'raster'}}).position.x : originPaperLayer.position.x;
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [tween.prop]: `+=${originPaperLayerPositionDiffX}`,
      onUpdate: () => {
        originPaperLayer.position.x = timelineTweenProps[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  }
};

export const addYTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isText = originLayerItem.type === 'Text';
  if (isText) {
    const textContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
    const yPointDiff = (destinationLayerItem as Btwx.Text).point.y - (originLayerItem as Btwx.Text).point.y;
    const originY = (() => {
      const clone = originPaperLayer.clone({insert: false});
      clone.rotation = -originLayerItem.transform.rotation;
      const tc = clone.getItem({data: {id: 'textContent'}}) as paper.PointText;
      return tc.point.y;
    })();
    timelineTweenProps[tween.prop] = originY;
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [tween.prop]: `+=${yPointDiff}`,
      onUpdate: () => {
        const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
          originPaperLayer.rotation = -startRotation;
          const diff = timelineTweenProps[tween.prop] - textContent.point.y;
          originPaperLayer.position.y += diff;
          originPaperLayer.rotation = startRotation;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  } else {
    const frameDiff = destinationLayerItem.frame.y - originLayerItem.frame.y;
    timelineTweenProps[tween.prop] = originLayerItem.type === 'Image' ? originPaperLayer.getItem({data: {id: 'raster'}}).position.y : originPaperLayer.position.y;
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [tween.prop]: `+=${frameDiff}`,
      onUpdate: () => {
        originPaperLayer.position.y = timelineTweenProps[tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  }
};

export const addWidthTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originLayerItem.frame.innerWidth;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.frame.innerWidth,
    onUpdate: () => {
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      const startPosition = originPaperLayer.position;
      originPaperLayer.rotation = -startRotation;
      originPaperLayer.bounds.width = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = timelineTweenProps[tween.prop];
      originPaperLayer.rotation = startRotation;
      originPaperLayer.position = startPosition;
      if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded') {
        originPaperLayer.rotation = -startRotation;
        const newShape = new paperPreview.Path.Rectangle({
          from: originPaperLayer.bounds.topLeft,
          to: originPaperLayer.bounds.bottomRight,
          radius: (Math.max(originPaperLayer.bounds.width, originPaperLayer.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
          insert: false
        });
        (originPaperLayer as paper.Path).pathData = newShape.pathData;
        originPaperLayer.rotation = startRotation;
      }
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addHeightTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originLayerItem.frame.innerHeight;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.frame.innerHeight,
    onUpdate: () => {
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      const startPosition = originPaperLayer.position;
      originPaperLayer.rotation = -startRotation;
      originPaperLayer.bounds.height = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerHeight = timelineTweenProps[tween.prop];
      originPaperLayer.rotation = startRotation;
      originPaperLayer.position = startPosition;
      if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded') {
        originPaperLayer.rotation = -startRotation;
        const newShape = new paperPreview.Path.Rectangle({
          from: originPaperLayer.bounds.topLeft,
          to: originPaperLayer.bounds.bottomRight,
          radius: (Math.max(originPaperLayer.bounds.width, originPaperLayer.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
          insert: false
        });
        (originPaperLayer as paper.Path).pathData = newShape.pathData;
        originPaperLayer.rotation = startRotation;
      }
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addRotationTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  // const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
  timelineTweenProps[tween.prop] = originLayerItem.transform.rotation;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.transform.rotation,
    onUpdate: () => {
      // const startPosition = originPaperLayer.position;
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      originPaperLayer.rotation = -startRotation;
      originPaperLayer.rotation = timelineTweenProps[tween.prop];
      originPaperLayer.data.rotation = timelineTweenProps[tween.prop];
      // originPaperLayer.position = startPosition;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addShadowColorTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
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
  timelineTweenProps[tween.prop] = tinyColor({h: osc.h, s: osc.s, l: osc.l, a: osc.a}).toHslString();
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: tinyColor({h: dsc.h, s: dsc.s, l: dsc.l, a: dsc.a}).toHslString(),
    onUpdate: () => {
      originPaperLayer.shadowColor = timelineTweenProps[tween.prop];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addShadowXOffsetTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
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
  timelineTweenProps[tween.prop] = osx;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: dsx,
    onUpdate: () => {
      const y = originPaperLayer.shadowOffset ? originPaperLayer.shadowOffset.y : originShadow.offset.y;
      originPaperLayer.shadowOffset = new paperPreview.Point(timelineTweenProps[tween.prop], y);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addShadowYOffsetTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
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
  timelineTweenProps[tween.prop] = osy;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: dsy,
    onUpdate: () => {
      const x = originPaperLayer.shadowOffset ? originPaperLayer.shadowOffset.x : originShadow.offset.x;
      originPaperLayer.shadowOffset = new paperPreview.Point(x, timelineTweenProps[tween.prop]);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addShadowBlurTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
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
  timelineTweenProps[tween.prop] = osb;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: dsb,
    onUpdate: () => {
      originPaperLayer.shadowBlur = timelineTweenProps[tween.prop];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addOpacityTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originPaperLayer.opacity;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationPaperLayer.opacity,
    onUpdate: () => {
      originPaperLayer.opacity = timelineTweenProps[tween.prop];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addFontSizeTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originTextItem = originLayerItem as Btwx.Text;
  const destinationTextItem = destinationLayerItem as Btwx.Text;
  const maxLines = Math.max(originTextItem.lines.length, destinationTextItem.lines.length);
  const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
  const originTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextBackground = originPaperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  const destinationTextContent = destinationPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextLines = originPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
  timelineTweenProps[tween.prop] = originTextContent.fontSize;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationTextContent.fontSize,
    onUpdate: () => {
      // const startPosition = originPaperLayer.position;
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      originPaperLayer.rotation = -startRotation;
      // originTextContent.fontSize = timelineTweenProps[tween.prop];
      // originTextBackground.bounds = originTextContent.bounds;
      [...Array(maxLines).keys()].forEach((key, index) => {
        const line = originTextLinesGroup.children[index] as paper.PointText;
        if (line) {
          line.fontSize = timelineTweenProps[tween.prop];
        }
      });
      originTextBackground.bounds = originTextLinesGroup.bounds;
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      originPaperLayer.rotation = startRotation;
      // originPaperLayer.position = startPosition;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addFontWeightTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originTextItem = originLayerItem as Btwx.Text;
  const destinationTextItem = destinationLayerItem as Btwx.Text;
  const maxLines = Math.max(originTextItem.lines.length, destinationTextItem.lines.length);
  const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
  const originTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextBackground = originPaperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  const destinationTextContent = destinationPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextLines = originPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
  timelineTweenProps[tween.prop] = originTextContent.fontWeight;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationTextContent.fontWeight,
    onUpdate: () => {
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      originPaperLayer.rotation = -startRotation;
      [...Array(maxLines).keys()].forEach((key, index) => {
        const line = originTextLinesGroup.children[index] as paper.PointText;
        if (line) {
          line.fontWeight = timelineTweenProps[tween.prop];
        }
      });
      originTextBackground.bounds = originTextLinesGroup.bounds;
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      originPaperLayer.rotation = startRotation;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addObliqueTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originTextItem = originLayerItem as Btwx.Text;
  const destinationTextItem = destinationLayerItem as Btwx.Text;
  const maxLines = Math.max(originTextItem.lines.length, destinationTextItem.lines.length);
  const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
  const originTextBackground = originPaperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  const originTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextLines = originPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
  timelineTweenProps[tween.prop] = (originLayerItem as Btwx.Text).textStyle.oblique;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: (destinationLayerItem as Btwx.Text).textStyle.oblique,
    onUpdate: () => {
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      const startSkew = originPaperLayer.data.skew || originPaperLayer.data.skew === 0 ? originPaperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
      const startLeading = originPaperLayer.data.leading || originPaperLayer.data.leading === 0 ? originPaperLayer.data.leading : originTextItem.textStyle.leading;
      originPaperLayer.rotation = -startRotation;
      [...Array(maxLines).keys()].forEach((key, index) => {
        const line = originTextLinesGroup.children[index] as paper.PointText;
        // leading affects horizontal skew
        if (line) {
          line.leading = line.fontSize;
          line.skew(new paperPreview.Point(startSkew, 0));
          line.skew(new paperPreview.Point(-timelineTweenProps[tween.prop], 0));
          line.leading = startLeading;
        }
      });
      originTextBackground.bounds = originTextLinesGroup.bounds;
      originPaperLayer.data.skew = timelineTweenProps[tween.prop];
      originPaperLayer.rotation = startRotation;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addLineHeightTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originTextItem = originLayerItem as Btwx.Text;
  const destinationTextItem = destinationLayerItem as Btwx.Text;
  const maxLines = Math.max(originTextItem.lines.length, destinationTextItem.lines.length);
  const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
  const originTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextBackground = originPaperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  const destinationTextContent = destinationPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextLines = originPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
  timelineTweenProps[tween.prop] = originTextContent.leading;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationTextContent.leading,
    onUpdate: () => {
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      const startLeading = originPaperLayer.data.leading || originPaperLayer.data.leading === 0 ? originPaperLayer.data.leading : originTextItem.textStyle.leading;
      originPaperLayer.rotation = -startRotation;
      const diff = timelineTweenProps[tween.prop] - startLeading;
      [...Array(maxLines).keys()].forEach((key, index: number) => {
        const line = originTextLinesGroup.children[index] as paper.PointText;
        if (line) {
          line.leading = timelineTweenProps[tween.prop];
          line.point.y += (diff * index);
        }
      });
      originTextBackground.bounds = originTextLinesGroup.bounds;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      originPaperLayer.data.leading = timelineTweenProps[tween.prop];
      originPaperLayer.rotation = startRotation;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addJustificationTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originTextItem = originLayerItem as Btwx.Text;
  const destinationTextItem = destinationLayerItem as Btwx.Text;
  const originTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const destinationTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const textBackground = originPaperLayer.getItem({data: {id: 'textBackground'}});
  const textLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
  const textLines = originPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
  const originJustification = (originLayerItem as Btwx.Text).textStyle.justification;
  const destinationJustification = (destinationLayerItem as Btwx.Text).textStyle.justification;
  const maxLines = Math.max(originTextItem.lines.length, destinationTextItem.lines.length);
  timelineTweenProps[tween.prop] = 0;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: 1,
    onUpdate: () => {
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      const startSkew = originPaperLayer.data.skew || originPaperLayer.data.skew === 0 ? originPaperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
      const startLeading = originPaperLayer.data.leading || originPaperLayer.data.leading === 0 ? originPaperLayer.data.leading : (originLayerItem as Btwx.Text).textStyle.leading;
      const startJustification = originPaperLayer.data.justification; // originPaperLayer.data.justification || originPaperLayer.data.justification === 0 ? originPaperLayer.data.justification : 0;
      // remove rotation
      originPaperLayer.rotation = -startRotation;
      // update text lines
      if (startJustification) {
        [...Array(maxLines).keys()].forEach((key, index) => {
          const line = textLinesGroup.children[index] as paper.PointText; // originPaperLayer.getItem({id: originPaperLayer.data[`${tween.prop}-${index}-id`]}) as paper.PointText;
          const lineGapDiff = originPaperLayer.data[`${tween.prop}-${index}-diff`];
          if (line) {
            const diff = lineGapDiff * (timelineTweenProps[tween.prop] - startJustification);
            // leading affects horizontal skew
            line.leading = line.fontSize;
            line.skew(new paperPreview.Point(startSkew, 0));
            line.position.x += diff;
            line.skew(new paperPreview.Point(-startSkew, 0));
            line.leading = startLeading;
          }
        });
      } else {
        // on start...
        // 1. set justification to destination justification
        //    - makes for less work if there is text tween
        // 2. adjust line positions to match previous positions
        // 3. set line diff and id on paper layer
        // handle content
        let contentStart: number;
        switch(originJustification) {
          case 'left':
            contentStart = originTextContent.bounds.left;
            break;
          case 'center':
            contentStart = originTextContent.bounds.center.x;
            break;
          case 'right':
            contentStart = originTextContent.bounds.right;
            break;
        }
        originTextContent.justification = destinationJustification;
        if (originJustification === 'center') {
          originTextContent.bounds[originJustification].x = contentStart;
        } else {
          originTextContent.bounds[originJustification] = contentStart;
        }
        // textBackground.bounds = originTextContent.bounds;
        [...Array(maxLines).keys()].forEach((key, index) => {
          let line = textLinesGroup.children[index] as paper.PointText;
          if (line) {
            line.leading = line.fontSize;
            line.skew(new paperPreview.Point(startSkew, 0));
          } else {
            line = new paperPreview.PointText({
              point: new paperPreview.Point((textLinesGroup.children[0] as paper.PointText).point.x, (textLinesGroup.children[0] as paper.PointText).point.y + (index * startLeading)),
              content: ' ',
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
          let startBounds;
          let start;
          let end;
          switch(originJustification) {
            case 'left':
              startBounds = line.bounds.left;
              break;
            case 'center':
              startBounds = line.bounds.center.x;
              break;
            case 'right':
              startBounds = line.bounds.right;
              break;
          }
          line.justification = destinationJustification;
          if (originJustification === 'center') {
            line.bounds[originJustification].x = startBounds;
          } else {
            line.bounds[originJustification] = startBounds;
          }
          if (destinationJustification === 'center') {
            start = line.bounds[destinationJustification].x - originArtboardPaperLayer.bounds.center.x;
            end = originTextContent.bounds[destinationJustification].x - originArtboardPaperLayer.bounds.center.x;
          } else {
            start = line.bounds[destinationJustification] - originArtboardPaperLayer.bounds[destinationJustification];
            end = originTextContent.bounds[destinationJustification] - originArtboardPaperLayer.bounds[destinationJustification];
          }
          const lineGapDiff = end - start;
          const initialMove = lineGapDiff * timelineTweenProps[tween.prop];
          line.position.x += initialMove;
          line.skew(new paperPreview.Point(-startSkew, 0));
          line.leading = startLeading;
          originPaperLayer.data[`${tween.prop}-${index}-diff`] = end - start;
        });
      }
      if (destinationJustification === 'center') {
        textBackground.bounds[destinationJustification].x = textLinesGroup.bounds[destinationJustification].x;
      } else {
        textBackground.bounds[destinationJustification] = textLinesGroup.bounds[destinationJustification];
      }
      // apply rotation
      textBackground.bounds = textLinesGroup.bounds;
      originPaperLayer.rotation = startRotation;
      originPaperLayer.data.justification = timelineTweenProps[tween.prop];
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addTextTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originTextItem = originLayerItem as Btwx.Text;
  const destinationTextItem = destinationLayerItem as Btwx.Text;
  const originTextContent = originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextBackground = originPaperLayer.getItem({data: {id: 'textBackground'}});
  const destinationTextContent = destinationPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const originTextLines = originPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
  const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
  const destinationTextLines = destinationPaperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
  const maxLines = Math.max(originTextItem.lines.length, destinationTextItem.lines.length);
  [...Array(maxLines).keys()].forEach((line, index) => {
    // timelineTweenProps[tween.prop] = 0;
    const textDOM = document.getElementById(`${originTextItem.id}-${index}`);
    timeline.to(textDOM, {
      duration: tween.duration,
      scrambleText: destinationTextItem.lines[index] ? destinationTextItem.lines[index].text : ' ',
      onUpdate: () => {
        const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
        const startLeading = originPaperLayer.data.leading || originPaperLayer.data.leading === 0 ? originPaperLayer.data.leading : (originLayerItem as Btwx.Text).textStyle.leading;
        const line = originTextLinesGroup.children[index] as paper.PointText;
        const firstLine = originTextLinesGroup.children[0] as paper.PointText;
        const startSkew = originPaperLayer.data.skew || originPaperLayer.data.skew === 0 ? originPaperLayer.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
        // const startJustification = originPaperLayer.data.justification || originPaperLayer.data.justification === 0 ? originPaperLayer.data.justification : 0;
        originPaperLayer.rotation = -startRotation;
        if (line) {
          line.content = textDOM.innerHTML;
        } else {
          originTextContent.content = `${originTextContent.content}\n`;
          const point = new paperPreview.Point(firstLine.point.x, firstLine.point.y + (index * startLeading));
          const newLine = new paperPreview.PointText({
            point: point,
            content: textDOM.innerHTML,
            style: originTextLines[0].style,
            data: originTextLines[0].data,
            parent: originTextLinesGroup
          });
          newLine.leading = newLine.fontSize;
          newLine.skew(new paperPreview.Point(-startSkew, 0));
          newLine.leading = startLeading;
        }
        originTextBackground.bounds = originTextLinesGroup.bounds;
        originPaperLayer.rotation = startRotation;
        updateGradients(props);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  });
};

export const addFromXTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const diff = (destinationLayerItem as Btwx.Line).from.x - (originLayerItem as Btwx.Line).from.x;
  timelineTweenProps[tween.prop] = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addFromYTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const diff = (destinationLayerItem as Btwx.Line).from.y - (originLayerItem as Btwx.Line).from.y;
  timelineTweenProps[tween.prop] = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addToXTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const diff = (destinationLayerItem as Btwx.Line).to.x - (originLayerItem as Btwx.Line).to.x;
  timelineTweenProps[tween.prop] = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addToYTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const diff = (destinationLayerItem as Btwx.Line).to.y - (originLayerItem as Btwx.Line).to.y;
  timelineTweenProps[tween.prop] = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: getEaseString(tween),
  }, tween.delay);
};

export const addTweens = (tweenProps: AddTweenProps): void => {
  switch(tweenProps.tween.prop) {
    case 'image':
      addImageTween(tweenProps);
      break;
    case 'shape':
      addShapeTween(tweenProps);
      break;
    case 'fill':
      addFSTween(tweenProps, 'fill');
      break;
    case 'fillGradientOriginX':
      addGradientOriginXFSTween(tweenProps, 'fill');
      break;
    case 'fillGradientOriginY':
      addGradientOriginYFSTween(tweenProps, 'fill');
      break;
    case 'fillGradientDestinationX':
      addGradientDestinationXFSTween(tweenProps, 'fill');
      break;
    case 'fillGradientDestinationY':
      addGradientDestinationYFSTween(tweenProps, 'fill');
      break;
    case 'stroke':
      addFSTween(tweenProps, 'stroke');
      break;
    case 'strokeGradientOriginX':
      addGradientOriginXFSTween(tweenProps, 'stroke');
      break;
    case 'strokeGradientOriginY':
      addGradientOriginYFSTween(tweenProps, 'stroke');
      break;
    case 'strokeGradientDestinationX':
      addGradientDestinationXFSTween(tweenProps, 'stroke');
      break;
    case 'strokeGradientDestinationY':
      addGradientDestinationYFSTween(tweenProps, 'stroke');
      break;
    case 'dashOffset':
      addDashOffsetTween(tweenProps);
      break;
    case 'dashArrayWidth':
      addDashArrayWidthTween(tweenProps);
      break;
    case 'dashArrayGap':
      addDashArrayGapTween(tweenProps);
      break;
    case 'strokeWidth':
      addStrokeWidthTween(tweenProps);
      break;
    case 'x':
      addXTween(tweenProps);
      break;
    case 'y':
      addYTween(tweenProps);
      break;
    case 'width':
      addWidthTween(tweenProps);
      break;
    case 'height':
      addHeightTween(tweenProps);
      break;
    case 'rotation':
      addRotationTween(tweenProps);
      break;
    case 'shadowColor':
      addShadowColorTween(tweenProps);
      break;
    case 'shadowOffsetX':
      addShadowXOffsetTween(tweenProps);
      break;
    case 'shadowOffsetY':
      addShadowYOffsetTween(tweenProps);
      break;
    case 'shadowBlur':
      addShadowBlurTween(tweenProps);
      break;
    case 'opacity':
      addOpacityTween(tweenProps);
      break;
    case 'fontSize':
      addFontSizeTween(tweenProps);
      break;
    case 'fontWeight':
      addFontWeightTween(tweenProps);
      break;
    case 'oblique':
      addObliqueTween(tweenProps);
      break;
    case 'lineHeight':
      addLineHeightTween(tweenProps);
      break;
    case 'justification':
      addJustificationTween(tweenProps);
      break;
    case 'text':
      addTextTween(tweenProps);
      break;
    case 'fromX':
      addFromXTween(tweenProps);
      break;
    case 'fromY':
      addFromYTween(tweenProps);
      break;
    case 'toX':
      addToXTween(tweenProps);
      break;
    case 'toY':
      addToYTween(tweenProps);
      break;
  }
};