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
import { bufferToBase64 } from '../utils';
import { RootState } from '../store/reducers';
import { paperPreview } from '../canvas';

gsap.registerPlugin(MorphSVGPlugin, RoughEase, SlowMo, CustomBounce, CustomWiggle, ScrambleTextPlugin, TextPlugin);

interface CanvasPreviewLayerTweenProps {
  id: string;
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
  const { id, eventTimeline, tween, tweenId, originLayerItem, destinationLayerItem, originArtboardItem, destinationArtboardItem, originImage, destinationImage, maxTextLineCount } = props;
  const [tweenTimeline, setTweenTimeline] = useState(gsap.timeline({
    id: tweenId,
    data: {
      paperLayer: null,
      textLinesGroup: null,
      textContent: null,
      textBackground: null
    },
    onStart: function() {
      this.data.paperLayer = paperPreview.project.getItem({data:{id: tween.layer}});
      if (originLayerItem.type === 'Text') {
        this.data.textLinesGroup = this.data.paperLayer.getItem({data:{id:'textLines'}});
        this.data.textContent = this.data.paperLayer.getItem({data:{id:'textContent'}});
        this.data.textBackground = this.data.paperLayer.getItem({data:{id:'textBackground'}});
      }
    }
  }));

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

  const updateGradients = (opl: paper.Item): void => {
    const isText = originLayerItem.type === 'Text';
    const textLines = isText ? opl.getItem({data: {id: 'textLines'}}) : null;
    const isOriginLayerLine = originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line';
    ['fill', 'stroke'].forEach((style: 'fill' | 'stroke') => {
      if (opl[`${style}Color` as 'fillColor' | 'strokeColor'] && opl[`${style}Color` as 'fillColor' | 'strokeColor'].gradient || isText && textLines.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] && textLines.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient) {
        const innerWidth = opl.data.innerWidth ? opl.data.innerWidth : (isOriginLayerLine ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = opl.data.innerHeight ? opl.data.innerHeight : (isOriginLayerLine ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = opl.data[`${style}GradientOriginX`] ? opl.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
        const originY = opl.data[`${style}GradientOriginY`] ? opl.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
        const destinationX = opl.data[`${style}GradientDestinationX`] ? opl.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
        const destinationY = opl.data[`${style}GradientDestinationY`] ? opl.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
        const nextOrigin = new paperPreview.Point((originX * innerWidth) + opl.position.x, (originY * innerHeight) + opl.position.y);
        const nextDestination = new paperPreview.Point((destinationX * innerWidth) + opl.position.x, (destinationY * innerHeight) + opl.position.y);
        if (isText) {
          textLines.children.forEach((line) => {
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
          });
        } else {
          (opl[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
          (opl[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
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
    const destinationImageBase64 = bufferToBase64(destinationImage.buffer);
    // const beforeRaster = originPaperLayer.getItem({data: {id: 'raster'}}) as paper.Raster;
    // const destinationRaster = destinationPaperLayer.getItem({data: {id: 'raster'}}) as paper.Raster;
    // const afterRaster = beforeRaster.clone() as paper.Raster;
    // afterRaster.source = destinationRaster.source;
    // afterRaster.bounds = beforeRaster.bounds;
    // afterRaster.position = beforeRaster.position;
    // afterRaster.opacity = 0;
    // afterRaster.parent = beforeRaster.parent;
    eventTimeline.data[tweenId][`${tween.prop}-before`] = 1;
    eventTimeline.data[tweenId][`${tween.prop}-after`] = 0;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [`${tween.prop}-before`]: 0,
      [`${tween.prop}-after`]: 1,
      onStart: function() {
        const opl = this.data.paperLayer;
        const beforeRaster = opl.getItem({data: {id: 'raster'}}) as paper.Raster;
        const afterRaster = beforeRaster.clone() as paper.Raster;
        afterRaster.source = destinationImageBase64;
        afterRaster.opacity = 0;
      },
      onUpdate: function() {
        const opl = this.data.paperLayer as paper.Group;
        const beforeRaster = opl.children[0];
        const afterRaster = opl.children[1];
        beforeRaster.opacity = eventTimeline.data[tweenId][`${tween.prop}-before`];
        afterRaster.opacity = eventTimeline.data[tweenId][`${tween.prop}-after`];
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
    eventTimeline.data[tweenId][tween.prop] = morphData[0];
    // set tween
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: morphData[1],
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer;
        const innerWidth = opl.data.innerWidth ? opl.data.innerWidth : originLayerItem.frame.innerWidth;
        const innerHeight = opl.data.innerHeight ? opl.data.innerHeight : originLayerItem.frame.innerHeight;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        const startPosition = opl.position;
        opl.rotation = -startRotation;
        // apply final clone path data to tweenPaperLayer
        (opl as paper.Path).pathData = eventTimeline.data[tweenId][tween.prop];
        opl.bounds.width = innerWidth;
        opl.bounds.height = innerHeight;
        opl.rotation = startRotation;
        opl.position = startPosition;
        // update fill gradient origin/destination if needed
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    // const textContent = isText ? originPaperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText : null;
    // const textLinesGroup = isText ? originPaperLayer.getItem({data: {id: 'textLines'}}) : null;
    const ofc = originLayerItem.style.fill.color;
    const dfc = destinationLayerItem.style.fill.color;
    eventTimeline.data[tweenId][tween.prop] = tinyColor({h: ofc.h, s: ofc.s, l: ofc.l, a: ofc.a}).toHslString();
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: dfc.a}).toHslString(),
      onUpdate: () => {
        if (isText) {
          tweenTimeline.data.textLinesGroup.children.forEach((line: paper.PointText) => {
            line[`${style}Color` as 'fillColor' | 'strokeColor'] = eventTimeline.data[tweenId][tween.prop];
          });
        } else {
          tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = eventTimeline.data[tweenId][tween.prop];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addNullToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    const dfc = destinationLayerItem.style.fill.color;
    eventTimeline.data[tweenId][tween.prop] = tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: 0}).toHslString();
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: tinyColor({h: dfc.h, s: dfc.s, l: dfc.l, a: dfc.a}).toHslString(),
      onUpdate: () => {
        if (isText) {
          tweenTimeline.data.textLinesGroup.children.forEach((line: paper.PointText) => {
            line[`${style}Color` as 'fillColor' | 'strokeColor'] = eventTimeline.data[tweenId][tween.prop];
          });
        } else {
          tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'] = eventTimeline.data[tweenId][tween.prop];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addColorToNullFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    const ofc = originLayerItem.style.fill.color;
    eventTimeline.data[tweenId][tween.prop] = ofc.a;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: 0,
      onUpdate: () => {
        if (isText) {
          tweenTimeline.data.textLinesGroup.children.forEach((line: paper.PointText) => {
            line[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = eventTimeline.data[tweenId][tween.prop];
          });
        } else {
          tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].alpha = eventTimeline.data[tweenId][tween.prop];
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginXFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style[style].gradient.origin.x;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.origin.x,
      onUpdate: () => {
        const pl = tweenTimeline.data.paperLayer as paper.Item;
        const innerWidth = pl.data.innerWidth ? pl.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = pl.data.innerHeight ? pl.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = eventTimeline.data[tweenId][tween.prop];
        const originY = pl.data[`${style}GradientOriginY`] ? pl.data[`${style}GradientOriginY`] : originLayerItem.style[style].gradient.origin.y;
        const nextOrigin = new paperPreview.Point((originX * innerWidth) + pl.position.x, (originY * innerHeight) + pl.position.y);
        if (isText) {
          const textLines = tweenTimeline.data.textLinesGroup as paper.Group;
          textLines.children.forEach((line: paper.PointText) => {
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
          });
        } else {
          (pl[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        }
        pl.data[tween.prop] = originX;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientOriginYFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style[style].gradient.origin.y;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.origin.y,
      onUpdate: () => {
        const pl = tweenTimeline.data.paperLayer as paper.Item;
        const innerWidth = pl.data.innerWidth ? pl.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = pl.data.innerHeight ? pl.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const originX = pl.data[`${style}GradientOriginX`] ? pl.data[`${style}GradientOriginX`] : originLayerItem.style[style].gradient.origin.x;
        const originY = eventTimeline.data[tweenId][tween.prop];
        const nextOrigin = new paperPreview.Point((originX * innerWidth) + pl.position.x, (originY * innerHeight) + pl.position.y);
        if (isText) {
          tweenTimeline.data.textLinesGroup.children.forEach((line: paper.PointText) => {
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
          });
        } else {
          (pl[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin = nextOrigin;
        }
        pl.data[tween.prop] = originY;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationXFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style[style].gradient.destination.x;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.destination.x,
      onUpdate: () => {
        const pl = tweenTimeline.data.paperLayer as paper.Item;
        const innerWidth = pl.data.innerWidth ? pl.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = pl.data.innerHeight ? pl.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const destinationX = eventTimeline.data[tweenId][tween.prop];
        const destinationY = pl.data[`${style}GradientDestinationY`] ? pl.data[`${style}GradientDestinationY`] : originLayerItem.style[style].gradient.destination.y;
        const nextDestination = new paperPreview.Point((destinationX * innerWidth) + pl.position.x, (destinationY * innerHeight) + pl.position.y);
        if (isText) {
          tweenTimeline.data.textLinesGroup.children.forEach((line: paper.PointText) => {
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
          });
        } else {
          (pl[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        }
        pl.data[tween.prop] = destinationX;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientDestinationYFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style[style].gradient.destination.y;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style[style].gradient.destination.y,
      onUpdate: () => {
        const pl = tweenTimeline.data.paperLayer as paper.Item;
        const innerWidth = pl.data.innerWidth ? pl.data.innerWidth : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.width : originLayerItem.frame.innerWidth);
        const innerHeight = pl.data.innerHeight ? pl.data.innerHeight : (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Line' ? originLayerItem.frame.height : originLayerItem.frame.innerHeight);
        const destinationX = pl.data[`${style}GradientDestinationX`] ? pl.data[`${style}GradientDestinationX`] : originLayerItem.style[style].gradient.destination.x;
        const destinationY = eventTimeline.data[tweenId][tween.prop];
        const nextDestination = new paperPreview.Point((destinationX * innerWidth) + pl.position.x, (destinationY * innerHeight) + pl.position.y);
        if (isText) {
          tweenTimeline.data.textLinesGroup.children.forEach((line: paper.PointText) => {
            (line[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
          });
        } else {
          (pl[`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination = nextDestination;
        }
        pl.data[tween.prop] = destinationY;
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addGradientToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    const og = originLayerItem.style.fill.gradient;
    const dg = destinationLayerItem.style.fill.gradient;
    const originStopCount = og.stops.length;
    const destinationStopCount = dg.stops.length;
    const stopsTimeline = gsap.timeline({
      onStart: () => {
        if (destinationStopCount > originStopCount) {
          const diff = destinationStopCount - originStopCount;
          for (let i = 0; i < diff; i++) {
            const stopClone = {...og.stops[0]};
            og.stops.push(stopClone);
          }
          stopsTimeline.eventCallback('onStart', () => {
            const diff = destinationStopCount - originStopCount;
            const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
            const gradientRef = isText ? paperLayerRef.children[0] : tweenTimeline.data.paperLayer;
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
      }
    });
    og.stops.forEach((stop, index) => {
      const sc = stop.color;
      const sp = stop.position;
      // get closest destination stop if index is greater than destination stop length
      const cds = dg.stops.reduce((result, current) => {
        return (Math.abs(current.position - stop.position) < Math.abs(result.position - stop.position) ? current : result);
      });
      const dc = dg.stops[index] ? dg.stops[index].color : cds.color;
      const dp = dg.stops[index] ? dg.stops[index].position : cds.position;
      eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`] = tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString();
      eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-offset`] = sp;
      stopsTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor({h: dc.h, s: dc.s, l: dc.l, a: dc.a}).toHslString(),
        [`${tween.prop}-stop-${index}-offset`]: dp,
        onUpdate: () => {
          if (isText) {
            tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
            tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-offset`];
            tweenTimeline.data.textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
              gradient: {
                stops: tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                radial: dg.gradientType === 'radial'
              },
              origin: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
              destination: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
            } as Btwx.PaperGradientFill;
          } else {
            tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
            tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].offset = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-offset`];
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    tweenTimeline.add(stopsTimeline, 0);
  };

  const addGradientToColorFSTween = (style: 'fill' | 'stroke'): void => {
    const stopsTimeline = gsap.timeline();
    const isText = originLayerItem.type === 'Text';
    const og = originLayerItem.style[style].gradient;
    const dc = destinationLayerItem.style[style].color;
    og.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`] = tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString();
      stopsTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor({h: dc.h, s: dc.s, l: dc.l, a: dc.a}).toHslString(),
        onUpdate: () => {
          if (isText) {
            tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
            tweenTimeline.data.textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
              gradient: {
                stops: tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                radial: og.gradientType === 'radial'
              },
              origin: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
              destination: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
            } as Btwx.PaperGradientFill;
          } else {
            tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    tweenTimeline.add(stopsTimeline, 0);
  };

  const addColorToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    const oc = originLayerItem.style[style].color;
    const dg = destinationLayerItem.style[style].gradient;
    const stopsTimeline = gsap.timeline({
      onStart: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : opl;
        opl.data[`${style}GradientOriginX`] = dg.origin.x;
        opl.data[`${style}GradientOriginY`] = dg.origin.y;
        opl.data[`${style}GradientDestinationX`] = dg.destination.x;
        opl.data[`${style}GradientDestinationY`] = dg.destination.y;
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
          origin: new paperPreview.Point((destinationLayerItem.style[style].gradient.origin.x * opl.bounds.width) + opl.position.x, (destinationLayerItem.style[style].gradient.origin.y * opl.bounds.height) + opl.position.y),
          destination: new paperPreview.Point((destinationLayerItem.style[style].gradient.destination.x * opl.bounds.width) + opl.position.x, (destinationLayerItem.style[style].gradient.destination.y * opl.bounds.height) + opl.position.y)
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`] = tinyColor({h: oc.h, s: oc.s, l: oc.l, a: oc.a}).toHslString();
      stopsTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: tinyColor({h: sc.h, s: sc.s, l: sc.l, a: sc.a}).toHslString(),
        onUpdate: () => {
          if (isText) {
            tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
            tweenTimeline.data.textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
              gradient: {
                stops: tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                radial: dg.gradientType === 'radial'
              },
              origin: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
              destination: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
            } as Btwx.PaperGradientFill;
          } else {
            tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    tweenTimeline.add(stopsTimeline, 0);
  };

  const addGradientToNullFSTween = (style: 'fill' | 'stroke'): void => {
    const stopsTimeline = gsap.timeline();
    const isText = originLayerItem.type === 'Text';
    const og = originLayerItem.style[style].gradient;
    og.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`] = sc.a;
      stopsTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: 0,
        onUpdate: () => {
          if (isText) {
            tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
            tweenTimeline.data.textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
              gradient: {
                stops: tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                radial: og.gradientType === 'radial'
              },
              origin: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
              destination: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
            } as Btwx.PaperGradientFill;
          } else {
            tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    tweenTimeline.add(stopsTimeline, 0);
  };

  const addNullToGradientFSTween = (style: 'fill' | 'stroke'): void => {
    const isText = originLayerItem.type === 'Text';
    const dg = destinationLayerItem.style[style].gradient;
    const stopsTimeline = gsap.timeline({
      onStart: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        opl.data[`${style}GradientOriginX`] = dg.origin.x;
        opl.data[`${style}GradientOriginY`] = dg.origin.y;
        opl.data[`${style}GradientDestinationX`] = dg.destination.x;
        opl.data[`${style}GradientDestinationY`] = dg.destination.y;
        // set origin layer styleColor to destination layer gradient with opaque stops
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : opl;
        paperLayerRef[`${style}Color` as 'fillColor' | 'strokeColor'] = {
          gradient: {
            stops: dg.stops.map((stop) => {
              const sc = stop.color;
              const sp = stop.position;
              return new paperPreview.GradientStop({hue: sc.h, saturation: sc.s, lightness: sc.l, alpha: 0} as paper.Color, sp);
            }),
            radial: dg.gradientType === 'radial'
          },
          origin: new paperPreview.Point((dg.origin.x * opl.bounds.width) + opl.position.x, (dg.origin.y * opl.bounds.height) + opl.position.y),
          destination: new paperPreview.Point((dg.destination.x * opl.bounds.width) + opl.position.x, (dg.destination.y * opl.bounds.height) + opl.position.y)
        } as Btwx.PaperGradientFill;
      }
    });
    dg.stops.forEach((stop, index) => {
      const sc = stop.color;
      eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`] = 0;
      stopsTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [`${tween.prop}-stop-${index}-color`]: sc.a,
        onUpdate: () => {
          if (isText) {
            tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
            tweenTimeline.data.textLinesGroup[`${style}Color` as 'fillColor' | 'strokeColor'] = {
              gradient: {
                stops: tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops,
                radial: dg.gradientType === 'radial'
              },
              origin: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).origin,
              destination: (tweenTimeline.data.textLinesGroup.children[0][`${style}Color` as 'fillColor' | 'strokeColor'] as Btwx.PaperGradientFill).destination
            } as Btwx.PaperGradientFill;
          } else {
            tweenTimeline.data.paperLayer[`${style}Color` as 'fillColor' | 'strokeColor'].gradient.stops[index].color.alpha = eventTimeline.data[tweenId][`${tween.prop}-stop-${index}-color`];
          }
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
    tweenTimeline.add(stopsTimeline, 0);
  };

  const addDashOffsetTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style.strokeOptions.dashOffset;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.strokeOptions.dashOffset,
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        paperLayerRef.dashOffset = eventTimeline.data[tweenId][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addDashArrayWidthTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style.strokeOptions.dashArray[0];
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.strokeOptions.dashArray[0],
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        paperLayerRef.dashArray = [eventTimeline.data[tweenId][tween.prop], paperLayerRef.dashArray[1]];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addDashArrayGapTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style.strokeOptions.dashArray[1];
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.strokeOptions.dashArray[1],
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        paperLayerRef.dashArray = [paperLayerRef.dashArray[0], eventTimeline.data[tweenId][tween.prop]];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addStrokeWidthTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style.stroke.width;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.stroke.width,
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        paperLayerRef.strokeWidth = eventTimeline.data[tweenId][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addXTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    if (isText) {
      const destinationJustification = (destinationLayerItem as Btwx.Text).textStyle.justification;
      // const originClone = originPaperLayer.clone({insert: false});
      // const destinationClone = destinationPaperLayer.clone({insert: false});
      // const originCloneContent = originClone.getItem({data: {id: 'textContent'}}) as paper.PointText;
      // const destinationCloneContent = destinationClone.getItem({data: {id: 'textContent'}}) as paper.PointText;
      // originClone.rotation = -originLayerItem.transform.rotation;
      // destinationClone.rotation = -destinationLayerItem.transform.rotation;
      let start: number;
      let end: number;
      switch(destinationJustification) {
        case 'left':
          start = originLayerItem.frame.x - (originLayerItem.frame.innerWidth / 2);
          end = destinationLayerItem.frame.x - (destinationLayerItem.frame.innerWidth / 2);
          break;
        case 'center':
          start = originLayerItem.frame.x;
          end = destinationLayerItem.frame.x;
          break;
        case 'right':
          start = originLayerItem.frame.x + (originLayerItem.frame.innerWidth / 2);
          end = destinationLayerItem.frame.x + (destinationLayerItem.frame.innerWidth / 2);
          break;
      }
      const diff = end - start;
      eventTimeline.data[tweenId][tween.prop] = 0;
      tweenTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [tween.prop]: 1,
        onUpdate: () => {
          const opl = tweenTimeline.data.paperLayer as paper.Item;
          const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
          const startX = opl.data.x || opl.data.x === 0 ? opl.data.x : 0;
          const xDiff = diff * (eventTimeline.data[tweenId][tween.prop] - startX);
          opl.rotation = -startRotation;
          opl.position.x += xDiff;
          opl.rotation = startRotation;
          opl.data.x = eventTimeline.data[tweenId][tween.prop];
        },
        ease: getEaseString(tween),
      }, tween.delay);
    } else {
      const originPaperLayerPositionDiffX = destinationLayerItem.frame.x - originLayerItem.frame.x;
      eventTimeline.data[tweenId][tween.prop] = originLayerItem.frame.x + originArtboardItem.frame.x;
      tweenTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [tween.prop]: `+=${originPaperLayerPositionDiffX}`,
        onUpdate: () => {
          tweenTimeline.data.paperLayer.position.x = eventTimeline.data[tweenId][tween.prop];
        },
        ease: getEaseString(tween),
      }, tween.delay);
    }
  };

  const addYTween = (): void => {
    const isText = originLayerItem.type === 'Text';
    if (isText) {
      const yPointDiff = (destinationLayerItem as Btwx.Text).point.y - (originLayerItem as Btwx.Text).point.y;
      eventTimeline.data[tweenId][tween.prop] = (originLayerItem as Btwx.Text).point.y + originArtboardItem.frame.y;
      tweenTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [tween.prop]: `+=${yPointDiff}`,
        onUpdate: () => {
          const opl = tweenTimeline.data.paperLayer as paper.Item;
          const textContent = tweenTimeline.data.textContent as paper.PointText;
          const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
          opl.rotation = -startRotation;
          const diff = eventTimeline.data[tweenId][tween.prop] - textContent.point.y;
          opl.position.y += diff;
          opl.rotation = startRotation;
        },
        ease: getEaseString(tween),
      }, tween.delay);
    } else {
      const frameDiff = destinationLayerItem.frame.y - originLayerItem.frame.y;
      eventTimeline.data[tweenId][tween.prop] = originLayerItem.frame.y + originArtboardItem.frame.y;
      tweenTimeline.to(eventTimeline.data[tweenId], {
        duration: tween.duration,
        [tween.prop]: `+=${frameDiff}`,
        onUpdate: () => {
          const opl = tweenTimeline.data.paperLayer as paper.Item;
          opl.position.y = eventTimeline.data[tweenId][tween.prop];
        },
        ease: getEaseString(tween),
      }, tween.delay);
    }
  };

  const addWidthTween = (): void => {
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.frame.innerWidth;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.frame.innerWidth,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        const startPosition = opl.position;
        opl.rotation = -startRotation;
        opl.bounds.width = eventTimeline.data[tweenId][tween.prop];
        opl.data.innerWidth = eventTimeline.data[tweenId][tween.prop];
        opl.rotation = startRotation;
        opl.position = startPosition;
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded') {
          opl.rotation = -startRotation;
          const newShape = new paperPreview.Path.Rectangle({
            from: opl.bounds.topLeft,
            to: opl.bounds.bottomRight,
            radius: (Math.max(opl.bounds.width, opl.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
            insert: false
          });
          (opl as paper.Path).pathData = newShape.pathData;
          opl.rotation = startRotation;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addHeightTween = (): void => {
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.frame.innerHeight;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.frame.innerHeight,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        const startPosition = opl.position;
        opl.rotation = -startRotation;
        opl.bounds.height = eventTimeline.data[tweenId][tween.prop];
        opl.data.innerHeight = eventTimeline.data[tweenId][tween.prop];
        opl.rotation = startRotation;
        opl.position = startPosition;
        if (originLayerItem.type === 'Shape' && (originLayerItem as Btwx.Shape).shapeType === 'Rounded') {
          opl.rotation = -startRotation;
          const newShape = new paperPreview.Path.Rectangle({
            from: opl.bounds.topLeft,
            to: opl.bounds.bottomRight,
            radius: (Math.max(opl.bounds.width, opl.bounds.height) / 2) * (originLayerItem as Btwx.Rounded).radius,
            insert: false
          });
          (opl as paper.Path).pathData = newShape.pathData;
          opl.rotation = startRotation;
        }
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addRotationTween = (): void => {
    // const originTextLinesGroup = originPaperLayer.getItem({data: {id: 'textLines'}});
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.transform.rotation;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.transform.rotation,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        // const startPosition = originPaperLayer.position;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        opl.rotation = -startRotation;
        opl.rotation = eventTimeline.data[tweenId][tween.prop];
        opl.data.rotation = eventTimeline.data[tweenId][tween.prop];
        // originPaperLayer.position = startPosition;
        updateGradients(opl);
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
    eventTimeline.data[tweenId][tween.prop] = tinyColor({h: osc.h, s: osc.s, l: osc.l, a: osc.a}).toHslString();
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: tinyColor({h: dsc.h, s: dsc.s, l: dsc.l, a: dsc.a}).toHslString(),
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        paperLayerRef.shadowColor = eventTimeline.data[tweenId][tween.prop];
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
    eventTimeline.data[tweenId][tween.prop] = osx;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: dsx,
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        const y = paperLayerRef.shadowOffset ? paperLayerRef.shadowOffset.y : originShadow.offset.y;
        paperLayerRef.shadowOffset = new paperPreview.Point(eventTimeline.data[tweenId][tween.prop], y);
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
    eventTimeline.data[tweenId][tween.prop] = osy;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: dsy,
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        const x = paperLayerRef.shadowOffset ? paperLayerRef.shadowOffset.x : originShadow.offset.x;
        paperLayerRef.shadowOffset = new paperPreview.Point(x, eventTimeline.data[tweenId][tween.prop]);
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
    eventTimeline.data[tweenId][tween.prop] = osb;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: dsb,
      onUpdate: () => {
        const paperLayerRef = isText ? tweenTimeline.data.textLinesGroup : tweenTimeline.data.paperLayer;
        paperLayerRef.shadowBlur = eventTimeline.data[tweenId][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addOpacityTween = (): void => {
    eventTimeline.data[tweenId][tween.prop] = originLayerItem.style.opacity;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationLayerItem.style.opacity,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer;
        opl.opacity = eventTimeline.data[tweenId][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFontSizeTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tweenId][tween.prop] = originTextItem.textStyle.fontSize;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.fontSize,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const textLinesGroup = tweenTimeline.data.textLinesGroup as paper.Group;
        const textBackground = tweenTimeline.data.textBackground as paper.Path.Rectangle;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        opl.rotation = -startRotation;
        textLinesGroup.children.forEach((line: paper.PointText) => {
          line.fontSize = eventTimeline.data[tweenId][tween.prop];
        });
        textBackground.bounds = textLinesGroup.bounds;
        opl.data.innerWidth = opl.bounds.width;
        opl.data.innerHeight = opl.bounds.height;
        opl.rotation = startRotation;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFontWeightTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tweenId][tween.prop] = originTextItem.textStyle.fontWeight;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.fontWeight,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const textLinesGroup = tweenTimeline.data.textLinesGroup as paper.Group;
        const textBackground = tweenTimeline.data.textBackground as paper.Path.Rectangle;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        opl.rotation = -startRotation;
        textLinesGroup.children.forEach((line: paper.PointText) => {
          line.fontWeight = eventTimeline.data[tweenId][tween.prop];
        });
        textBackground.bounds = textLinesGroup.bounds;
        opl.data.innerWidth = opl.bounds.width;
        opl.data.innerHeight = opl.bounds.height;
        opl.rotation = startRotation;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addObliqueTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tweenId][tween.prop] = originTextItem.textStyle.oblique;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.oblique,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const textLinesGroup = tweenTimeline.data.textLinesGroup as paper.Group;
        const textBackground = tweenTimeline.data.textBackground as paper.Path.Rectangle;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        const startSkew = opl.data.skew || opl.data.skew === 0 ? opl.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
        const startLeading = opl.data.leading || opl.data.leading === 0 ? opl.data.leading : originTextItem.textStyle.leading;
        opl.rotation = -startRotation;
        textLinesGroup.children.forEach((line: paper.PointText) => {
          // leading affects horizontal skew
          line.leading = line.fontSize;
          line.skew(new paperPreview.Point(startSkew, 0));
          line.skew(new paperPreview.Point(-eventTimeline.data[tweenId][tween.prop], 0));
          line.leading = startLeading;
        });
        textBackground.bounds = textLinesGroup.bounds;
        opl.data.skew = eventTimeline.data[tweenId][tween.prop];
        opl.rotation = startRotation;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addLineHeightTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    eventTimeline.data[tweenId][tween.prop] = originTextItem.textStyle.leading;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: destinationTextItem.textStyle.leading,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const textLinesGroup = tweenTimeline.data.textLinesGroup as paper.Group;
        const textBackground = tweenTimeline.data.textBackground as paper.Path.Rectangle;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        const startLeading = opl.data.leading || opl.data.leading === 0 ? opl.data.leading : originTextItem.textStyle.leading;
        opl.rotation = -startRotation;
        const diff = eventTimeline.data[tweenId][tween.prop] - startLeading;
        textLinesGroup.children.forEach((line: paper.PointText, index) => {
          line.leading = eventTimeline.data[tweenId][tween.prop];
          line.point.y += (diff * index);
        });
        textBackground.bounds = textLinesGroup.bounds;
        opl.data.innerHeight = opl.bounds.height;
        opl.data.leading = eventTimeline.data[tweenId][tween.prop];
        opl.rotation = startRotation;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addJustificationTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    const originJustification = (originLayerItem as Btwx.Text).textStyle.justification;
    const destinationJustification = (destinationLayerItem as Btwx.Text).textStyle.justification;
    eventTimeline.data[tweenId][tween.prop] = 0;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: 1,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        const textContent = tweenTimeline.data.textContent as paper.PointText;
        const textLinesGroup = tweenTimeline.data.textLinesGroup as paper.Group;
        const textBackground = tweenTimeline.data.textBackground as paper.Path.Rectangle;
        const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
        const startSkew = opl.data.skew || opl.data.skew === 0 ? opl.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
        const startLeading = opl.data.leading || opl.data.leading === 0 ? opl.data.leading : (originLayerItem as Btwx.Text).textStyle.leading;
        const startJustification = opl.data.justification;
        // remove rotation
        opl.rotation = -startRotation;
        // update text lines
        if (startJustification) {
          textLinesGroup.children.forEach((line: paper.PointText, index) => {
            const lineGapDiff = opl.data[`${tween.prop}-${index}-diff`];
            const diff = lineGapDiff * (eventTimeline.data[tweenId][tween.prop] - startJustification);
            // leading affects horizontal skew
            line.leading = line.fontSize;
            line.skew(new paperPreview.Point(startSkew, 0));
            line.position.x += diff;
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
          switch(originJustification) {
            case 'left':
              contentStart = textContent.bounds.left;
              break;
            case 'center':
              contentStart = textContent.bounds.center.x;
              break;
            case 'right':
              contentStart = textContent.bounds.right;
              break;
          }
          textContent.justification = destinationJustification;
          if (originJustification === 'center') {
            textContent.bounds[originJustification].x = contentStart;
          } else {
            textContent.bounds[originJustification] = contentStart;
          }
          // textBackground.bounds = originTextContent.bounds;
          [...Array(maxTextLineCount).keys()].forEach((key, index) => {
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
            switch(destinationJustification) {
              case 'left':
                start = line.bounds[destinationJustification] - (originArtboardItem.frame.x - (originArtboardItem.frame.width / 2));
                end = textContent.bounds[destinationJustification] - (originArtboardItem.frame.x - (originArtboardItem.frame.width / 2));
                break;
              case 'center':
                start = line.bounds[destinationJustification].x - originArtboardItem.frame.x;
                end = textContent.bounds[destinationJustification].x - originArtboardItem.frame.x;
                break;
              case 'right':
                start = line.bounds[destinationJustification] - (originArtboardItem.frame.x + (originArtboardItem.frame.width / 2));
                end = textContent.bounds[destinationJustification] - (originArtboardItem.frame.x + (originArtboardItem.frame.width / 2));
                break;
            }
            const lineGapDiff = end - start;
            const initialMove = lineGapDiff * eventTimeline.data[tweenId][tween.prop];
            line.position.x += initialMove;
            line.skew(new paperPreview.Point(-startSkew, 0));
            line.leading = startLeading;
            opl.data[`${tween.prop}-${index}-diff`] = end - start;
          });
        }
        if (destinationJustification === 'center') {
          textBackground.bounds[destinationJustification].x = textLinesGroup.bounds[destinationJustification].x;
        } else {
          textBackground.bounds[destinationJustification] = textLinesGroup.bounds[destinationJustification];
        }
        // apply rotation
        textBackground.bounds = textLinesGroup.bounds;
        opl.rotation = startRotation;
        opl.data.justification = eventTimeline.data[tweenId][tween.prop];
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addTextTween = (): void => {
    const originTextItem = originLayerItem as Btwx.Text;
    const destinationTextItem = destinationLayerItem as Btwx.Text;
    [...Array(maxTextLineCount).keys()].forEach((line, index) => {
      const textDOM = document.getElementById(`${originTextItem.id}-${index}`);
      tweenTimeline.to(textDOM, {
        duration: tween.duration,
        ...(() => {
          return tween.text.scramble
          ? {
              scrambleText: {
                text: destinationTextItem.lines[index] ? destinationTextItem.lines[index].text : ' ',
                chars: tween.scrambleText.characters === 'custom' ? tween.scrambleText.customCharacters : tween.scrambleText.characters,
                revealDelay: tween.scrambleText.revealDelay,
                speed: tween.scrambleText.speed,
                delimiter: tween.scrambleText.delimiter,
                rightToLeft: tween.scrambleText.rightToLeft
              }
            }
          : {
              text: {
                value: destinationTextItem.lines[index] ? destinationTextItem.lines[index].text : ' ',
                delimiter: tween.text.delimiter,
                speed: tween.text.speed,
                type: tween.text.diff ? 'diff' : null
              }
            }
        })(),
        onUpdate: () => {
          const opl = tweenTimeline.data.paperLayer as paper.Item;
          const textContent = tweenTimeline.data.textContent as paper.PointText;
          const textLinesGroup = tweenTimeline.data.textLinesGroup as paper.Group;
          const textBackground = tweenTimeline.data.textBackground as paper.Path.Rectangle;
          const startRotation = opl.data.rotation || opl.data.rotation === 0 ? opl.data.rotation : originLayerItem.transform.rotation;
          const startLeading = opl.data.leading || opl.data.leading === 0 ? opl.data.leading : (originLayerItem as Btwx.Text).textStyle.leading;
          const line = textLinesGroup.children[index] as paper.PointText;
          const firstLine = textLinesGroup.children[0] as paper.PointText;
          const startSkew = opl.data.skew || opl.data.skew === 0 ? opl.data.skew : (originLayerItem as Btwx.Text).textStyle.oblique;
          opl.rotation = -startRotation;
          if (line) {
            line.content = textDOM.innerHTML;
          } else {
            textContent.content = `${textContent.content}\n`;
            const point = new paperPreview.Point(firstLine.point.x, firstLine.point.y + (index * startLeading));
            const newLine = new paperPreview.PointText({
              point: point,
              content: textDOM.innerHTML,
              style: textLinesGroup.children[0].style,
              data: textLinesGroup.children[0].data,
              parent: textLinesGroup
            });
            newLine.leading = newLine.fontSize;
            newLine.skew(new paperPreview.Point(-startSkew, 0));
            newLine.leading = startLeading;
          }
          textBackground.bounds = textLinesGroup.bounds;
          opl.rotation = startRotation;
          updateGradients(opl);
        },
        ease: getEaseString(tween),
      }, tween.delay);
    });
  };

  const addFromXTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.from.x - originLineItem.from.x;
    eventTimeline.data[tweenId][tween.prop] = originLineItem.from.x + originArtboardItem.frame.x;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        ((opl as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.x = eventTimeline.data[tweenId][tween.prop];
        opl.data.innerWidth = opl.bounds.width;
        opl.data.innerHeight = opl.bounds.height;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addFromYTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.from.y - originLineItem.from.y;
    eventTimeline.data[tweenId][tween.prop] = originLineItem.from.y + originArtboardItem.frame.y;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        ((opl as paper.CompoundPath).children[0] as paper.Path).firstSegment.point.y = eventTimeline.data[tweenId][tween.prop];
        opl.data.innerWidth = opl.bounds.width;
        opl.data.innerHeight = opl.bounds.height;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addToXTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.to.x - originLineItem.to.x;
    eventTimeline.data[tweenId][tween.prop] = originLineItem.to.x + originArtboardItem.frame.x;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        ((opl as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.x = eventTimeline.data[tweenId][tween.prop];
        opl.data.innerWidth = opl.bounds.width;
        opl.data.innerHeight = opl.bounds.height;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  const addToYTween = (): void => {
    const originLineItem = originLayerItem as Btwx.Line;
    const destinationLineItem = destinationLayerItem as Btwx.Line;
    const diff = destinationLineItem.to.y - originLineItem.to.y;
    eventTimeline.data[tweenId][tween.prop] = originLineItem.to.y + originArtboardItem.frame.y;
    tweenTimeline.to(eventTimeline.data[tweenId], {
      duration: tween.duration,
      [tween.prop]: `+=${diff}`,
      onUpdate: () => {
        const opl = tweenTimeline.data.paperLayer as paper.Item;
        ((opl as paper.CompoundPath).children[0] as paper.Path).lastSegment.point.y = eventTimeline.data[tweenId][tween.prop];
        opl.data.innerWidth = opl.bounds.width;
        opl.data.innerHeight = opl.bounds.height;
        updateGradients(opl);
      },
      ease: getEaseString(tween),
    }, tween.delay);
  };

  useEffect(() => {
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
    }
    eventTimeline.add(tweenTimeline, 0);
  }, []);

  return (
    <>
      {
        originLayerItem.type === 'Text'
        ? <>
            {
              [...Array(maxTextLineCount).keys()].map((line, index) => (
                <div
                  id={`${id}-${index}`}
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