import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { rawRectToPaperRect } from '../utils';
import getTheme from '../theme';
import { activateUI } from './CanvasUI';

export const measureFrameId = 'measureFrame';

export const measureFrameJSON = `[
  "Group", {
    "applyMatrix": true,
    "name": "Measure Guides",
    "data":{
      "id": "${measureFrameId}",
      "type": "UIElement"
    }
  }
]`;

export const getMeasureFrame = (): paper.Group =>
  paperMain.projects[0].getItem({ data: { id: measureFrameId } }) as paper.Group;

export const clearMeasureFrame = () => {
  const measureFrame = getMeasureFrame();
  if (measureFrame) {
    measureFrame.removeChildren();
  }
}

export class MeasureGuide {
  guide: 'top' | 'bottom' | 'left' | 'right';
  from: paper.Point;
  to: paper.Point;
  distance: number;
  paperLayer: paper.Group;
  constructor({
    from,
    to,
    guide,
    themeName,
    removeOpts
  }: {
    from: paper.Point;
    to: paper.Point;
    guide: 'top' | 'bottom' | 'left' | 'right';
    themeName: Btwx.ThemeName;
    removeOpts?: any;
  }) {
    activateUI();
    this.from = from;
    this.to = to;
    this.guide = guide;
    const theme = getTheme(themeName);
    const measureGuideLine = new paperMain.Path.Line({
      from: this.from,
      to: this.to,
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideLine',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    this.distance = Math.round(measureGuideLine.length);
    const measureGuideLineStartLeg = new paperMain.Path.Line({
      from: this.guide === 'top' || this.guide === 'bottom'
        ? new paperMain.Point(this.from.x - ((1 / paperMain.view.zoom) * 4), this.from.y)
        : new paperMain.Point(this.from.x, this.from.y - ((1 / paperMain.view.zoom) * 4)),
      to: this.guide === 'top' || this.guide === 'bottom'
        ? new paperMain.Point(this.from.x + ((1 / paperMain.view.zoom) * 4), this.from.y)
        : new paperMain.Point(this.from.x, this.from.y + ((1 / paperMain.view.zoom) * 4)),
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideStartLeg',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    const measureGuideLineEndLeg = new paperMain.Path.Line({
      from: this.guide === 'top' || this.guide === 'bottom'
        ? new paperMain.Point(this.to.x - ((1 / paperMain.view.zoom) * 4), this.to.y)
        : new paperMain.Point(this.to.x, this.to.y - ((1 / paperMain.view.zoom) * 4)),
      to: this.guide === 'top' || this.guide === 'bottom'
        ? new paperMain.Point(this.to.x + ((1 / paperMain.view.zoom) * 4), this.to.y)
        : new paperMain.Point(this.to.x, this.to.y + ((1 / paperMain.view.zoom) * 4)),
      strokeColor: theme.palette.primary,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideEndLeg',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    const measureGuideText = new paperMain.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 10 / paperMain.view.zoom,
      content: this.distance,
      justification: 'center',
      insert: false,
      data: {
        id: 'measureGuideText',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    const measureGuideTextBackground = new paperMain.Path.Rectangle({
      point: measureGuideLine.bounds.center,
      size: [measureGuideText.bounds.width + (8 / paperMain.view.zoom), measureGuideText.bounds.height + (8 / paperMain.view.zoom)],
      fillColor: theme.palette.primary,
      radius: (4 / paperMain.view.zoom),
      insert: false,
      data: {
        id: 'measureGuideBackground',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    measureGuideTextBackground.position = measureGuideLine.bounds.center;
    measureGuideText.position = measureGuideTextBackground.position;
    const measureGuide = new paperMain.Group({
      children: [measureGuideLineStartLeg, measureGuideLine, measureGuideLineEndLeg, measureGuideTextBackground, measureGuideText],
      data: {
        id: 'measureGuide',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      },
      parent: paperMain.project.getItem({data: {id: measureFrameId}})
    });
    if (removeOpts) {
      measureGuide.removeOn({
        ...removeOpts
      });
    }
    this.paperLayer = measureGuide;
  }
}

export const updateMeasureFrame = ({
  bounds,
  measureTo,
  themeName
}: {
  bounds: paper.Rectangle;
  measureTo: {
    top?: paper.Rectangle;
    bottom?: paper.Rectangle;
    left?: paper.Rectangle;
    right?: paper.Rectangle;
    all?: paper.Rectangle
  },
  themeName: Btwx.ThemeName
}): void => {
  activateUI();
  clearMeasureFrame();
  if (measureTo) {
    let hasTopMeasure;
    let hasBottomMeasure;
    let hasLeftMeasure;
    let hasRightMeasure;
    let topMeasureTo;
    let bottomMeasureTo;
    let leftMeasureTo;
    let rightMeasureTo;
    Object.keys(measureTo).forEach((current: 'top' | 'bottom' | 'left' | 'right' | 'all') => {
      const measureToBounds = measureTo[current];
      if (measureToBounds) {
        if (measureToBounds.contains(bounds)) {
          switch(current) {
            case 'top':
              hasTopMeasure = true;
              topMeasureTo = measureToBounds.top;
              break;
            case 'bottom':
              hasBottomMeasure = true;
              bottomMeasureTo = measureToBounds.bottom;
              break;
            case 'left':
              hasLeftMeasure = true;
              leftMeasureTo = measureToBounds.left;
              break;
            case 'right':
              hasRightMeasure = true;
              rightMeasureTo = measureToBounds.right;
              break;
            case 'all':
              hasTopMeasure = true;
              hasBottomMeasure = true;
              hasLeftMeasure = true;
              hasRightMeasure = true;
              topMeasureTo = measureToBounds.top;
              bottomMeasureTo = measureToBounds.bottom;
              leftMeasureTo = measureToBounds.left;
              rightMeasureTo = measureToBounds.right;
              break;
          }
        } else {
          switch(current) {
            case 'top':
              hasTopMeasure = bounds.top > measureToBounds.top;
              topMeasureTo = bounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
              break;
            case 'bottom':
              hasBottomMeasure = bounds.bottom < measureToBounds.bottom;
              bottomMeasureTo = bounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
              break;
            case 'left':
              hasLeftMeasure = bounds.left > measureToBounds.left;
              leftMeasureTo = bounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
              break;
            case 'right':
              hasRightMeasure = bounds.right < measureToBounds.right;
              rightMeasureTo = bounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
              break;
            case 'all':
              hasTopMeasure = bounds.top > measureToBounds.top;
              hasBottomMeasure = bounds.bottom < measureToBounds.bottom;
              hasLeftMeasure = bounds.left > measureToBounds.left;
              hasRightMeasure = bounds.right < measureToBounds.right;
              topMeasureTo = bounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
              bottomMeasureTo = bounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
              leftMeasureTo = bounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
              rightMeasureTo = bounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
              break;
          }
        }
      }
    });
    if (hasTopMeasure && (measureTo['all'] || measureTo['top'])) {
      const topMeasureFromPoint = bounds.topCenter;
      const topMeasureToPoint = new paperMain.Point(topMeasureFromPoint.x, topMeasureTo);
      new MeasureGuide({
        from: topMeasureFromPoint,
        to: topMeasureToPoint,
        guide: 'top',
        themeName,
        removeOpts:{ down: true, up: true }
      });
    }
    if (hasBottomMeasure && (measureTo['all'] || measureTo['bottom'])) {
      const bottomMeasureFromPoint = bounds.bottomCenter;
      const bottomMeasureToPoint = new paperMain.Point(bottomMeasureFromPoint.x, bottomMeasureTo);
      new MeasureGuide({
        from: bottomMeasureFromPoint,
        to: bottomMeasureToPoint,
        guide: 'bottom',
        themeName,
        removeOpts: { down: true, up: true }
      });
    }
    if (hasLeftMeasure && (measureTo['all'] || measureTo['left'])) {
      const leftMeasureFromPoint = bounds.leftCenter;
      const leftMeasureToPoint = new paperMain.Point(leftMeasureTo, leftMeasureFromPoint.y);
      new MeasureGuide({
        from: leftMeasureFromPoint,
        to: leftMeasureToPoint,
        guide: 'left',
        themeName,
        removeOpts: { down: true, up: true }
      });
    }
    if (hasRightMeasure && (measureTo['all'] || measureTo['right'])) {
      const rightMeasureFromPoint = bounds.rightCenter;
      const rightMeasureToPoint = new paperMain.Point(rightMeasureTo, rightMeasureFromPoint.y);
      new MeasureGuide({
        from: rightMeasureFromPoint,
        to: rightMeasureToPoint,
        guide: 'right',
        themeName,
        removeOpts: { down: true, up: true }
      });
    }
  }
};

const MeasureFrame = (): ReactElement => {
  const themeName = useSelector((state: RootState) => state.preferences.theme);
  const measureFrameBounds = useSelector((state: RootState) => state.measureTool.bounds);
  const measureFrameMeasureTo = useSelector((state: RootState) => state.measureTool.measureTo);

  useEffect(() => {
    updateMeasureFrame({
      bounds: rawRectToPaperRect(measureFrameBounds),
      measureTo: {
        top: measureFrameMeasureTo.top && rawRectToPaperRect(measureFrameMeasureTo.top),
        bottom: measureFrameMeasureTo.bottom && rawRectToPaperRect(measureFrameMeasureTo.bottom),
        left: measureFrameMeasureTo.left && rawRectToPaperRect(measureFrameMeasureTo.left),
        right: measureFrameMeasureTo.right && rawRectToPaperRect(measureFrameMeasureTo.right),
        all: measureFrameMeasureTo.all && rawRectToPaperRect(measureFrameMeasureTo.all)
      },
      themeName
    });
    return () => {
      clearMeasureFrame();
    }
  }, [measureFrameBounds, measureFrameMeasureTo, themeName]);

  return null;
}

export default MeasureFrame;