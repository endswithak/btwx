/* eslint-disable @typescript-eslint/no-use-before-define */
import paper from 'paper';
import tinyColor from 'tinycolor2';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { paperPreview } from './canvas';
import { getPositionInArtboard } from './store/selectors/layer';

gsap.registerPlugin(MorphSVGPlugin);

export interface AddTweenProps {
  tween: em.Tween;
  timeline: gsap.core.Timeline;
  timelineTweenProps: {
    [prop: string]: any;
  };
  originLayerItem: em.Layer;
  destinationLayerItem: em.Layer;
  originPaperLayer: paper.Item;
  destinationPaperLayer: paper.Item;
  originArtboardLayerItem: em.Artboard;
  destinationArtboardLayerItem: em.Artboard;
  originArtboardPaperLayer: paper.Item;
  destinationArtboardPaperLayer: paper.Item;
}

export const addImageTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const beforeRaster = originPaperLayer.getItem({data: {id: 'Raster'}}) as paper.Raster;
  const destinationRaster = destinationPaperLayer.getItem({data: {id: 'Raster'}}) as paper.Raster;
  const afterRaster = beforeRaster.clone({insert: false}) as paper.Raster;
  afterRaster.source = destinationRaster.source;
  afterRaster.bounds = beforeRaster.bounds;
  afterRaster.position = beforeRaster.position;
  afterRaster.opacity = 0;
  afterRaster.parent = beforeRaster.parent;
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
    ease: tween.ease,
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
    ease: tween.ease,
  }, tween.delay);
};

export const updateGradients = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as em.Shape).shapeType === 'Line';
  const isDestinationLayerLine = destinationLayerItem.type === 'Shape' && (destinationLayerItem as em.Shape).shapeType === 'Line';
  if (originPaperLayer.fillColor && originPaperLayer.fillColor.gradient) {
    const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (isOriginLayerLine ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
    const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (isOriginLayerLine ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
    const origin = originPaperLayer.data.fillGradientOrigin ? originPaperLayer.data.fillGradientOrigin : originLayerItem.style.fill.gradient.origin;
    const destination = originPaperLayer.data.fillGradientDestination ? originPaperLayer.data.fillGradientDestination : originLayerItem.style.fill.gradient.destination;
    const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + originPaperLayer.position.x, (origin.y * innerHeight) + originPaperLayer.position.y);
    const nextDestination = new paperPreview.Point((destination.x * innerWidth) + originPaperLayer.position.x, (destination.y * innerHeight) + originPaperLayer.position.y);
    (originPaperLayer.fillColor as em.PaperGradientFill).origin = nextOrigin;
    (originPaperLayer.fillColor as em.PaperGradientFill).destination = nextDestination;
  }
  if (originPaperLayer.strokeColor && originPaperLayer.strokeColor.gradient) {
    const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (isOriginLayerLine ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
    const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (isOriginLayerLine ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
    const origin = originPaperLayer.data.strokeGradientOrigin ? originPaperLayer.data.strokeGradientOrigin : originLayerItem.style.fill.gradient.origin;
    const destination = originPaperLayer.data.strokeGradientDestination ? originPaperLayer.data.strokeGradientDestination : originLayerItem.style.stroke.gradient.destination;
    const nextOrigin = new paperPreview.Point((origin.x * innerWidth) + originPaperLayer.position.x, (origin.y * innerHeight) + originPaperLayer.position.y);
    const nextDestination = new paperPreview.Point((destination.x * innerWidth) + originPaperLayer.position.x, (destination.y * innerHeight) + originPaperLayer.position.y);
    (originPaperLayer.strokeColor as em.PaperGradientFill).origin = nextOrigin;
    (originPaperLayer.strokeColor as em.PaperGradientFill).destination = nextDestination;
  }
};

export const getFSTweenType = (props: AddTweenProps, style: 'fill' | 'stroke'): em.FillStrokeTween => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const paperStyle = `${style}Color` as 'fillColor' | 'strokeColor';
  // color to color style
  if (
    originPaperLayer[paperStyle] &&
    (originPaperLayer[paperStyle].type === 'rgb' || originPaperLayer[paperStyle].type === 'hsl') &&
    destinationPaperLayer[paperStyle] &&
    (destinationPaperLayer[paperStyle].type === 'rgb' || destinationPaperLayer[paperStyle].type === 'hsl')
  ) {
    return 'colorToColor';
  // no style to color style
  } else if (
    !originPaperLayer[paperStyle] &&
    destinationPaperLayer[paperStyle] &&
    (destinationPaperLayer[paperStyle].type === 'rgb' || destinationPaperLayer[paperStyle].type === 'hsl')
  ) {
    return 'nullToColor';
  // color style to no style
  } else if (
    originPaperLayer[paperStyle] &&
    !destinationPaperLayer[paperStyle] &&
    (originPaperLayer[paperStyle].type === 'rgb' || originPaperLayer[paperStyle].type === 'hsl')
  ) {
    return 'colorToNull';
  // gradient style to gradient style
  } else if (
    originPaperLayer[paperStyle] &&
    originPaperLayer[paperStyle].type === 'gradient' &&
    destinationPaperLayer[paperStyle] &&
    destinationPaperLayer[paperStyle].type === 'gradient'
  ) {
    return 'gradientToGradient';
  // gradient style to color style
  } else if (
    originPaperLayer[paperStyle] &&
    originPaperLayer[paperStyle].type === 'gradient' &&
    destinationPaperLayer[paperStyle] &&
    (destinationPaperLayer[paperStyle].type === 'rgb' || destinationPaperLayer[paperStyle].type === 'hsl')
  ) {
    return 'gradientToColor';
  // color style to gradient style
  } else if (
    originPaperLayer[paperStyle] &&
    (originPaperLayer[paperStyle].type === 'rgb' || originPaperLayer[paperStyle].type === 'hsl') &&
    destinationPaperLayer[paperStyle] &&
    destinationPaperLayer[paperStyle].type === 'gradient'
  ) {
    return 'colorToGradient';
  // gradient style to no style
  } else if (
    originPaperLayer[paperStyle] &&
    originPaperLayer[paperStyle].type === 'gradient' &&
    !destinationPaperLayer[paperStyle]
  ) {
    return 'gradientToNull';
  // no style to gradient style
  } else if (
    !originPaperLayer[paperStyle] &&
    destinationPaperLayer[paperStyle] &&
    destinationPaperLayer[paperStyle].type === 'gradient'
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

export const addFSGradientOriginTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[`${tween.prop}-origin-x`] = originLayerItem.style[style].gradient.origin.x;
  timelineTweenProps[`${tween.prop}-origin-y`] = originLayerItem.style[style].gradient.origin.y;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [`${tween.prop}-origin-x`]: destinationLayerItem.style[style].gradient.origin.x,
    [`${tween.prop}-origin-y`]: destinationLayerItem.style[style].gradient.origin.y,
    onUpdate: () => {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as em.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as em.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
      const nextOriginX = timelineTweenProps[`${tween.prop}-origin-x`];
      const nextOriginY = timelineTweenProps[`${tween.prop}-origin-y`];
      const nextOrigin = new paperPreview.Point((nextOriginX * innerWidth) + originPaperLayer.position.x, (nextOriginY * innerHeight) + originPaperLayer.position.y);
      (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).origin = nextOrigin;
      originPaperLayer.data[`${style}GradientOrigin`] = { x: nextOriginX, y: nextOriginY };
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addFSGradientDestinationTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[`${tween.prop}-destination-x`] = originLayerItem.style[style].gradient.destination.x;
  timelineTweenProps[`${tween.prop}-destination-y`] = originLayerItem.style[style].gradient.destination.y;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [`${tween.prop}-destination-x`]: destinationLayerItem.style[style].gradient.destination.x,
    [`${tween.prop}-destination-y`]: destinationLayerItem.style[style].gradient.destination.y,
    onUpdate: () => {
      const innerWidth = originPaperLayer.data.innerWidth ? originPaperLayer.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as em.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
      const innerHeight = originPaperLayer.data.innerHeight ? originPaperLayer.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as em.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
      const nextDestinationX = timelineTweenProps[`${tween.prop}-destination-x`];
      const nextDestinationY = timelineTweenProps[`${tween.prop}-destination-y`];
      const nextDestination = new paperPreview.Point((nextDestinationX * innerWidth) + originPaperLayer.position.x, (nextDestinationY * innerHeight) + originPaperLayer.position.y);
      (originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] as em.PaperGradientFill).destination = nextDestination;
      originPaperLayer.data[`${style}GradientDestination`] = { x: nextDestinationX, y: nextDestinationY };
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addColorToColorFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].toCSS(true);
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].toCSS(true),
    onUpdate: () => {
      originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = timelineTweenProps[tween.prop];
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addNullToColorFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const c2 = destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].toCSS(true);
  timelineTweenProps[tween.prop] = new paperPreview.Color(tinyColor(c2).setAlpha(0).toHex8String()).toCSS(true);
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].toCSS(true),
    onUpdate: () => {
      originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = timelineTweenProps[tween.prop];
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addColorToNullFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].alpha;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: 0,
    onUpdate: () => {
      originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = timelineTweenProps[tween.prop];
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addGradientToGradientFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  // origin
  addFSGradientOriginTween(props, style);
  // destination
  addFSGradientDestinationTween(props, style);
  // stops
  const layerStopCount = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.length;
  const destinationStopCount = destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.length;
  if (destinationStopCount > layerStopCount) {
    const diff = destinationStopCount - layerStopCount;
    for (let i = 0; i < diff; i++) {
      const test = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[0].clone();
      originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.push(test);
    }
  }
  originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.forEach((stop, index) => {
    const closestDestinationStop = destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.reduce((result, current) => {
      return (Math.abs(current.offset - stop.offset) < Math.abs(result.offset - stop.offset) ? current : result);
    });
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.toCSS(true);
    timelineTweenProps[`${tween.prop}-stop-${index}-offset`] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset;
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index] ? destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.toCSS(true) : closestDestinationStop.color.toCSS(true),
      [`${tween.prop}-stop-${index}-offset`]: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index] ? destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset : closestDestinationStop.offset,
      onUpdate: () => {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = timelineTweenProps[`${tween.prop}-stop-${index}-offset`];
      },
      ease: tween.ease,
    }, tween.delay);
  });
};

export const addGradientToColorFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  // origin
  addFSGradientOriginTween(props, style);
  // destination
  addFSGradientDestinationTween(props, style);
  // stops
  originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.forEach((stop, index) => {
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.toCSS(true);
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].toCSS(true),
      onUpdate: () => {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
      },
      ease: tween.ease
    }, tween.delay);
  });
};

export const addColorToGradientFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  // set origin layer styleColor to destination layer gradient
  // with all the stop colors as origin color
  originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = {
    gradient: {
      stops: destinationLayerItem.style[style].gradient.stops.map((stop) => {
        return new paperPreview.GradientStop(
          new paperPreview.Color(originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].toCSS(true)),
          stop.position
        );
      }),
      radial: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.radial
    },
    origin: new paperPreview.Point((destinationLayerItem.style[style].gradient.origin.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (destinationLayerItem.style[style].gradient.origin.y * originPaperLayer.bounds.height) + originPaperLayer.position.y),
    destination: new paperPreview.Point((destinationLayerItem.style[style].gradient.destination.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (destinationLayerItem.style[style].gradient.destination.y * originPaperLayer.bounds.height) + originPaperLayer.position.y)
  } as em.PaperGradientFill;
  // origin
  addFSGradientOriginTween(props, style);
  // destination
  addFSGradientDestinationTween(props, style);
  // stops
  originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.forEach((stop, index) => {
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.toCSS(true);
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.toCSS(true),
      onUpdate: () => {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
      },
      ease: tween.ease,
    }, tween.delay);
  });
};

export const addGradientToNullFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  // origin
  addFSGradientOriginTween(props, style);
  // destination
  addFSGradientDestinationTween(props, style);
  // stops
  originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.forEach((stop, index) => {
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha;
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: 0,
      onUpdate: () => {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
      },
      ease: tween.ease,
    }, tween.delay);
  });
};

export const addNullToGradientFSTween = (props: AddTweenProps, style: 'fill' | 'stroke'): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  // set origin layer styleColor to destination layer gradient with opaque stops
  originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = {
    gradient: {
      stops: destinationLayerItem.style[style].gradient.stops.map((stop) => {
        const stopColor = stop.color;
        return new paperPreview.GradientStop({hue: stopColor.h, saturation: stopColor.s, lightness: stopColor.l, alpha: 0} as paper.Color, stop.position);
      }),
      radial: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.radial
    },
    origin: new paperPreview.Point((destinationLayerItem.style[style].gradient.origin.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (destinationLayerItem.style[style].gradient.origin.y * originPaperLayer.bounds.height) + originPaperLayer.position.y),
    destination: new paperPreview.Point((destinationLayerItem.style[style].gradient.destination.x * originPaperLayer.bounds.width) + originPaperLayer.position.x, (destinationLayerItem.style[style].gradient.destination.y * originPaperLayer.bounds.height) + originPaperLayer.position.y)
  } as em.PaperGradientFill;
  // origin
  addFSGradientOriginTween(props, style);
  // destination
  addFSGradientDestinationTween(props, style);
  // stops
  originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops.forEach((stop, index) => {
    timelineTweenProps[`${tween.prop}-stop-${index}-color`] = originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha;
    timeline.to(timelineTweenProps, {
      duration: tween.duration,
      [`${tween.prop}-stop-${index}-color`]: destinationPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha,
      onUpdate: () => {
        originPaperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = timelineTweenProps[`${tween.prop}-stop-${index}-color`];
      },
      ease: tween.ease,
    }, tween.delay);
  });
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
    ease: tween.ease,
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
    ease: tween.ease,
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
    ease: tween.ease,
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
    ease: tween.ease,
  }, tween.delay);
};

export const addXTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originLayerRelArtboardPosition = getPositionInArtboard(originLayerItem, originArtboardLayerItem);
  const destinationLayerRelArtboardPosition = getPositionInArtboard(destinationLayerItem, destinationArtboardLayerItem);
  const originPaperLayerPositionDiffX = destinationLayerRelArtboardPosition.x - originLayerRelArtboardPosition.x;
  timelineTweenProps[tween.prop] = originPaperLayer.position.x;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${originPaperLayerPositionDiffX}`,
    onUpdate: () => {
      originPaperLayer.position.x = timelineTweenProps[tween.prop];
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addYTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originLayerRelArtboardPosition = getPositionInArtboard(originLayerItem, originArtboardLayerItem);
  const destinationLayerRelArtboardPosition = getPositionInArtboard(destinationLayerItem, destinationArtboardLayerItem);
  const originPaperLayerPositionDiffY = destinationLayerRelArtboardPosition.y - originLayerRelArtboardPosition.y;
  timelineTweenProps[tween.prop] = originPaperLayer.position.y;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${originPaperLayerPositionDiffY}`,
    onUpdate: () => {
      originPaperLayer.position.y = timelineTweenProps[tween.prop];
    },
    ease: tween.ease,
  }, tween.delay);
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
      if (originLayerItem.type === 'Shape' && (originLayerItem as em.Shape).shapeType === 'Rounded') {
        originPaperLayer.rotation = -startRotation;
        const newShape = new paperPreview.Path.Rectangle({
          from: originPaperLayer.bounds.topLeft,
          to: originPaperLayer.bounds.bottomRight,
          radius: (Math.max(originPaperLayer.bounds.width, originPaperLayer.bounds.height) / 2) * (originLayerItem as em.Rounded).radius,
          insert: false
        });
        (originPaperLayer as paper.Path).pathData = newShape.pathData;
        originPaperLayer.rotation = startRotation;
      }
    },
    ease: tween.ease,
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
      if (originLayerItem.type === 'Shape' && (originLayerItem as em.Shape).shapeType === 'Rounded') {
        originPaperLayer.rotation = -startRotation;
        const newShape = new paperPreview.Path.Rectangle({
          from: originPaperLayer.bounds.topLeft,
          to: originPaperLayer.bounds.bottomRight,
          radius: (Math.max(originPaperLayer.bounds.width, originPaperLayer.bounds.height) / 2) * (originLayerItem as em.Rounded).radius,
          insert: false
        });
        (originPaperLayer as paper.Path).pathData = newShape.pathData;
        originPaperLayer.rotation = startRotation;
      }
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addRotationTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = originLayerItem.transform.rotation;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: destinationLayerItem.transform.rotation,
    onUpdate: () => {
      const startPosition = originPaperLayer.position;
      const startRotation = originPaperLayer.data.rotation || originPaperLayer.data.rotation === 0 ? originPaperLayer.data.rotation : originLayerItem.transform.rotation;
      originPaperLayer.rotation = -startRotation;
      originPaperLayer.rotation = timelineTweenProps[tween.prop];
      originPaperLayer.data.rotation = timelineTweenProps[tween.prop];
      originPaperLayer.position = startPosition;
      updateGradients(props);
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addShadowColorTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const originShadow = originLayerItem.style.shadow;
  const destinationShadow = destinationLayerItem.style.shadow;
  let osc = originLayerItem.style.shadow.color;
  let dsc = destinationLayerItem.style.shadow.color;
  if (originShadow.enabled && !destinationShadow.enabled) {
    dsc = {h: dsc.h, s: dsc.s, l: dsc.l, a: 0} as em.Color;
  }
  if (!originShadow.enabled && destinationShadow.enabled) {
    osc = {h: osc.h, s: osc.s, l: osc.l, a: 0} as em.Color;
  }
  timelineTweenProps[tween.prop] = tinyColor({h: osc.h, s: osc.s, l: osc.l, a: osc.a}).toHslString();
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: tinyColor({h: dsc.h, s: dsc.s, l: dsc.l, a: dsc.a}).toHslString(),
    onUpdate: () => {
      originPaperLayer.shadowColor = timelineTweenProps[tween.prop];
    },
    ease: tween.ease,
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
      originPaperLayer.shadowOffset = new paperPreview.Point(timelineTweenProps[tween.prop], originPaperLayer.shadowOffset.y);
    },
    ease: tween.ease,
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
      originPaperLayer.shadowOffset = new paperPreview.Point(originPaperLayer.shadowOffset.x, timelineTweenProps[tween.prop]);
    },
    ease: tween.ease,
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
    ease: tween.ease,
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
    ease: tween.ease,
  }, tween.delay);
};

export const addFontSizeTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = (originPaperLayer as paper.PointText).fontSize;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: (destinationPaperLayer as paper.PointText).fontSize,
    onUpdate: () => {
      (originPaperLayer as paper.PointText).fontSize = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addLineHeightTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  timelineTweenProps[tween.prop] = (originPaperLayer as paper.PointText).leading;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: (destinationPaperLayer as paper.PointText).leading,
    onUpdate: () => {
      (originPaperLayer as paper.PointText).leading = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addFromXTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const pla = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x;
  const plb = ((destinationPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x;
  const relativeA = pla - originArtboardPaperLayer.position.x;
  const relativeB = plb - destinationArtboardPaperLayer.position.x;
  const diff = relativeB - relativeA;
  timelineTweenProps[tween.prop] = pla;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addFromYTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const pla = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y;
  const plb = ((destinationPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y;
  const relativeA = pla - originArtboardPaperLayer.position.y;
  const relativeB = plb - destinationArtboardPaperLayer.position.y;
  const diff = relativeB - relativeA;
  timelineTweenProps[tween.prop] = pla;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addToXTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const pla = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x;
  const plb = ((destinationPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x;
  const relativeA = pla - originArtboardPaperLayer.position.x;
  const relativeB = plb - destinationArtboardPaperLayer.position.x;
  const diff = relativeB - relativeA;
  timelineTweenProps[tween.prop] = pla;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addToYTween = (props: AddTweenProps): void => {
  const { tween, timeline, timelineTweenProps, originLayerItem, destinationLayerItem, originPaperLayer, destinationPaperLayer, originArtboardLayerItem, destinationArtboardLayerItem, originArtboardPaperLayer, destinationArtboardPaperLayer } = props;
  const pla = ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y;
  const plb = ((destinationPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y;
  const relativeA = pla - originArtboardPaperLayer.position.y;
  const relativeB = plb - destinationArtboardPaperLayer.position.y;
  const diff = relativeB - relativeA;
  timelineTweenProps[tween.prop] = pla;
  timeline.to(timelineTweenProps, {
    duration: tween.duration,
    [tween.prop]: `+=${diff}`,
    onUpdate: () => {
      ((originPaperLayer as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y = timelineTweenProps[tween.prop];
      originPaperLayer.data.innerWidth = originPaperLayer.bounds.width;
      originPaperLayer.data.innerHeight = originPaperLayer.bounds.height;
      updateGradients(props);
    },
    ease: tween.ease,
  }, tween.delay);
};

export const addTweens = (tweenProps: AddTweenProps): void => {
  switch(tweenProps.tween.prop) {
    case 'image': {
      addImageTween(tweenProps);
      break;
    }
    case 'shape': {
      addShapeTween(tweenProps);
      break;
    }
    case 'fill': {
      addFSTween(tweenProps, 'fill');
      break;
    }
    case 'stroke': {
      addFSTween(tweenProps, 'stroke');
      break;
    }
    case 'dashOffset': {
      addDashOffsetTween(tweenProps);
      break;
    }
    case 'dashArrayWidth': {
      addDashArrayWidthTween(tweenProps);
      break;
    }
    case 'dashArrayGap': {
      addDashArrayGapTween(tweenProps);
      break;
    }
    case 'strokeWidth': {
      addStrokeWidthTween(tweenProps);
      break;
    }
    case 'x': {
      addXTween(tweenProps);
      break;
    }
    case 'y': {
      addYTween(tweenProps);
      break;
    }
    case 'width': {
      addWidthTween(tweenProps);
      break;
    }
    case 'height': {
      addHeightTween(tweenProps);
      break;
    }
    case 'rotation': {
      addRotationTween(tweenProps);
      break;
    }
    case 'shadowColor': {
      addShadowColorTween(tweenProps);
      break;
    }
    case 'shadowOffsetX': {
      addShadowXOffsetTween(tweenProps);
      break;
    }
    case 'shadowOffsetY': {
      addShadowYOffsetTween(tweenProps);
      break;
    }
    case 'shadowBlur': {
      addShadowBlurTween(tweenProps);
      break;
    }
    case 'opacity': {
      addOpacityTween(tweenProps);
      break;
    }
    case 'fontSize': {
      addFontSizeTween(tweenProps);
      break;
    }
    case 'lineHeight': {
      addLineHeightTween(tweenProps);
      break;
    }
    case 'fromX': {
      addFromXTween(tweenProps);
      break;
    }
    case 'fromY': {
      addFromYTween(tweenProps);
      break;
    }
    case 'toX': {
      addToXTween(tweenProps);
      break;
    }
    case 'toY': {
      addToYTween(tweenProps);
      break;
    }
  }
};