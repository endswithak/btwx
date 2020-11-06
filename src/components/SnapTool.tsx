/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useState, useEffect, memo } from 'react';
import capitalize from 'lodash.capitalize';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { ThemeContext } from './ThemeProvider';
import { getPaperLayer, getPaperLayersBounds } from '../store/selectors/layer';

interface SnapToolProps {
  toolEvent: paper.ToolEvent;
  bounds: paper.Rectangle;
  hitTestZones: {
    all?: boolean;
    top?: boolean;
    middle?: boolean;
    bottom?: boolean;
    left?: boolean;
    center?: boolean;
    right?: boolean;
  };
  snapRule: 'move' | 'resize';
  resizeHandle?: Btwx.ResizeHandle;
  preserveAspectRatio?: boolean;
  aspectRatio?: number;
  onUpdate?(snapBounds: paper.Rectangle): any;
  scope?: string[];
  whiteListLayers?: string[];
  blackListLayers?: string[];
}

const snapToolDebug = true;

const SnapTool = memo(function SnapTool(props: SnapToolProps) {
  const theme = useContext(ThemeContext);
  const { toolEvent, bounds, scope, onUpdate, hitTestZones, snapRule, whiteListLayers, blackListLayers, preserveAspectRatio, aspectRatio, resizeHandle } = props;
  const [snapBounds, setSnapBounds] = useState(null);
  const [xSnapPoint, setXSnapPoint] = useState(null);
  const [ySnapPoint, setYSnapPoint] = useState(null);
  const [xSnapPointBreakThreshold, setXSnapPointBreakThreshold] = useState(0);
  const [ySnapPointBreakThreshold, setYSnapPointBreakThreshold] = useState(0);
  const [snapBreakThreshholdMin, setSnapBreakThreshholdMin] = useState(null);
  const [snapBreakThreshholdMax, setSnapBreakThreshholdMax] = useState(null);
  const [snapZoneTop, setSnapZoneTop] = useState<paper.Rectangle>(null);
  const [snapZoneMiddle, setSnapZoneMiddle] = useState<paper.Rectangle>(null);
  const [snapZoneBottom, setSnapZoneBottom] = useState<paper.Rectangle>(null);
  const [snapZoneLeft, setSnapZoneLeft] = useState<paper.Rectangle>(null);
  const [snapZoneCenter, setSnapZoneCenter] = useState<paper.Rectangle>(null);
  const [snapZoneRight, setSnapZoneRight] = useState<paper.Rectangle>(null);

  const getSnapZones = (currentToBounds: paper.Rectangle, scaleOverride?: number): {
    top: paper.Rectangle;
    middle: paper.Rectangle;
    bottom: paper.Rectangle;
    left: paper.Rectangle;
    center: paper.Rectangle;
    right: paper.Rectangle;
  } => {
    const zoneMin = 0.5;
    const zoneMax = 20;
    const zoneScale = scaleOverride ? scaleOverride : 0.5 * (16 / paperMain.view.zoom);
    const scale = zoneScale < zoneMin ? zoneMin : zoneScale > zoneMax ? zoneMax : zoneScale;
    const top = hitTestZones.all || hitTestZones.top ? new paperMain.Rectangle({
      from: new paperMain.Point(paperMain.view.bounds.left, currentToBounds.top - scale),
      to: new paperMain.Point(paperMain.view.bounds.right, currentToBounds.top + scale)
    }) : null;
    const middle = hitTestZones.all || hitTestZones.middle ? new paperMain.Rectangle({
      from: new paperMain.Point(paperMain.view.bounds.left, currentToBounds.center.y - scale),
      to: new paperMain.Point(paperMain.view.bounds.right, currentToBounds.center.y + scale)
    }) : null;
    const bottom = hitTestZones.all || hitTestZones.bottom ? new paperMain.Rectangle({
      from: new paperMain.Point(paperMain.view.bounds.left, currentToBounds.bottom - scale),
      to: new paperMain.Point(paperMain.view.bounds.right, currentToBounds.bottom + scale)
    }) : null;
    const left = hitTestZones.all || hitTestZones.left ? new paperMain.Rectangle({
      from: new paperMain.Point(currentToBounds.left - scale, paperMain.view.bounds.top),
      to: new paperMain.Point(currentToBounds.left + scale, paperMain.view.bounds.bottom)
    }) : null;
    const center = hitTestZones.all || hitTestZones.center ? new paperMain.Rectangle({
      from: new paperMain.Point(currentToBounds.center.x - scale, paperMain.view.bounds.top),
      to: new paperMain.Point(currentToBounds.center.x + scale, paperMain.view.bounds.bottom)
    }) : null;
    const right = hitTestZones.all || hitTestZones.right ? new paperMain.Rectangle({
      from: new paperMain.Point(currentToBounds.right - scale, paperMain.view.bounds.top),
      to: new paperMain.Point(currentToBounds.right + scale, paperMain.view.bounds.bottom)
    }) : null;
    return {
      top,
      middle,
      bottom,
      left,
      center,
      right
    }
  }

  const getGuideLayersBySnapZone = (snapZones: any, snapZone: Btwx.SnapZoneType): paper.Item[] => {
    return paperMain.project.getItems({
      data: (data: any) => {
        const notPage = data.type === 'Layer' && data.layerType !== 'Page';
        const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
        const isTopScopeGroup = data.id && data.type === 'Group' && data.id === scope[scope.length - 1];
        if (whiteListLayers && whiteListLayers.length > 0) {
          const whiteListed = data.scope && whiteListLayers.includes(data.id) || data.scope.some((id: string) => whiteListLayers.includes(id));
          return whiteListed && notPage && isScopeLayer && !isTopScopeGroup;
        } else if (blackListLayers && blackListLayers.length > 0) {
          const notBlackListed = data.scope && !blackListLayers.includes(data.id) && data.scope.every((id: string) => !blackListLayers.includes(id));
          return notBlackListed && notPage && isScopeLayer && !isTopScopeGroup;
        } else {
          return notPage && isScopeLayer && !isTopScopeGroup;
        }
      },
      bounds: (bounds: paper.Rectangle) => {
        switch(snapZone) {
          case 'top':
          case 'middle':
          case 'bottom':
            return (
              bounds.topCenter.isInside(snapZones[snapZone]) ||
              bounds.center.isInside(snapZones[snapZone]) ||
              bounds.bottomCenter.isInside(snapZones[snapZone])
            );
          case 'left':
          case 'center':
          case 'right':
            return (
              bounds.leftCenter.isInside(snapZones[snapZone]) ||
              bounds.center.isInside(snapZones[snapZone]) ||
              bounds.rightCenter.isInside(snapZones[snapZone])
            );
        }
      }
    });
  }

  const getYSnapToLayer = (snapZones: any): paper.Item => {
    return paperMain.project.getItem({
      data: (data: any) => {
        const notPage = data.type === 'Layer' && data.layerType !== 'Page';
        const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
        const isTopScopeGroup = data.id && data.type === 'Group' && data.id === scope[scope.length - 1];
        if (whiteListLayers && whiteListLayers.length > 0) {
          const whiteListed = data.scope && whiteListLayers.includes(data.id) || data.scope.some((id: string) => whiteListLayers.includes(id));
          return whiteListed && notPage && isScopeLayer && !isTopScopeGroup;
        } else if (blackListLayers && blackListLayers.length > 0) {
          const notBlackListed = data.scope && !blackListLayers.includes(data.id) && data.scope.every((id: string) => !blackListLayers.includes(id));
          return notBlackListed && notPage && isScopeLayer && !isTopScopeGroup;
        } else {
          return notPage && isScopeLayer && !isTopScopeGroup;
        }
      },
      bounds: (bounds: paper.Rectangle) => {
        return (
          bounds.topCenter.isInside(snapZones.top) ||
          bounds.center.isInside(snapZones.top) ||
          bounds.bottomCenter.isInside(snapZones.top) ||
          bounds.topCenter.isInside(snapZones.middle) ||
          bounds.center.isInside(snapZones.middle) ||
          bounds.bottomCenter.isInside(snapZones.middle) ||
          bounds.topCenter.isInside(snapZones.bottom) ||
          bounds.center.isInside(snapZones.bottom) ||
          bounds.bottomCenter.isInside(snapZones.bottom)
        )
      }
    });
  }

  const getXSnapToLayer = (snapZones: any): paper.Item => {
    return paperMain.project.getItem({
      data: (data: any) => {
        const notPage = data.type === 'Layer' && data.layerType !== 'Page';
        const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
        const isTopScopeGroup = data.id && data.type === 'Group' && data.id === scope[scope.length - 1];
        if (whiteListLayers && whiteListLayers.length > 0) {
          const whiteListed = data.scope && whiteListLayers.includes(data.id) || data.scope.some((id: string) => whiteListLayers.includes(id));
          return whiteListed && notPage && isScopeLayer && !isTopScopeGroup;
        } else if (blackListLayers && blackListLayers.length > 0) {
          const notBlackListed = data.scope && !blackListLayers.includes(data.id) && data.scope.every((id: string) => !blackListLayers.includes(id));
          return notBlackListed && notPage && isScopeLayer && !isTopScopeGroup;
        } else {
          return notPage && isScopeLayer && !isTopScopeGroup;
        }
      },
      bounds: (bounds: paper.Rectangle) => {
        return (
          bounds.leftCenter.isInside(snapZones.left) ||
          bounds.center.isInside(snapZones.left) ||
          bounds.rightCenter.isInside(snapZones.left) ||
          bounds.leftCenter.isInside(snapZones.center) ||
          bounds.center.isInside(snapZones.center) ||
          bounds.rightCenter.isInside(snapZones.center) ||
          bounds.leftCenter.isInside(snapZones.right) ||
          bounds.center.isInside(snapZones.right) ||
          bounds.rightCenter.isInside(snapZones.right)
        )
      }
    });
  }

  const getYSnapPoint = (snapZones: any): {
    snapZone: Btwx.SnapZoneType;
    layerSnapZone: Btwx.SnapZoneType;
    layerBounds: paper.Rectangle;
    y: number;
  } => {
    const ySnapToLayer = getYSnapToLayer(snapZones);
    if (ySnapToLayer) {
      if (ySnapToLayer.bounds.topCenter.isInside(snapZones.top)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.topCenter.y
        }
      } else if (ySnapToLayer.bounds.center.isInside(snapZones.top)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.center.y
        }
      } else if (ySnapToLayer.bounds.bottomCenter.isInside(snapZones.top)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      } else if (ySnapToLayer.bounds.topCenter.isInside(snapZones.middle)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.topCenter.y
        }
      } else if (ySnapToLayer.bounds.center.isInside(snapZones.middle)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.center.y
        }
      } else if (ySnapToLayer.bounds.bottomCenter.isInside(snapZones.middle)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      } else if (ySnapToLayer.bounds.topCenter.isInside(snapZones.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.topCenter.y
        }
      } else if (ySnapToLayer.bounds.center.isInside(snapZones.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.center.y
        }
      } else if (ySnapToLayer.bounds.bottomCenter.isInside(snapZones.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      }
    } else {
      return null;
    }
  }

  const getXSnapPoint = (snapZones: any): {
    snapZone: Btwx.SnapZoneType;
    layerSnapZone: Btwx.SnapZoneType;
    layerBounds: paper.Rectangle;
    x: number;
  } => {
    const xSnapToLayer = getXSnapToLayer(snapZones);
    if (xSnapToLayer) {
      if (xSnapToLayer.bounds.leftCenter.isInside(snapZones.left)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      } else if (xSnapToLayer.bounds.center.isInside(snapZones.left)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.center.x
        }
      } else if (xSnapToLayer.bounds.rightCenter.isInside(snapZones.left)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      } else if (xSnapToLayer.bounds.leftCenter.isInside(snapZones.center)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      } else if (xSnapToLayer.bounds.center.isInside(snapZones.center)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.center.x
        }
      } else if (xSnapToLayer.bounds.rightCenter.isInside(snapZones.center)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      } else if (xSnapToLayer.bounds.leftCenter.isInside(snapZones.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      } else if (xSnapToLayer.bounds.center.isInside(snapZones.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.center.x
        }
      } else if (xSnapToLayer.bounds.rightCenter.isInside(snapZones.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      }
    } else {
      return null;
    }
  }

  const getNextYSnapState = (snapZones: any) => {
    if (ySnapPoint) {
      const breaksMinThreshold = ySnapPointBreakThreshold + toolEvent.delta.y < snapBreakThreshholdMin;
      const breaksMaxThreshold = ySnapPointBreakThreshold + toolEvent.delta.y > snapBreakThreshholdMax;
      if (breaksMinThreshold || breaksMaxThreshold) {
        if (breaksMinThreshold) {
          return {
            snapPoint: getYSnapPoint(snapZones),
            breakThreshold: (ySnapPointBreakThreshold + toolEvent.delta.y) - snapBreakThreshholdMin
          };
        } else if (breaksMaxThreshold) {
          return {
            snapPoint: getYSnapPoint(snapZones),
            breakThreshold: (ySnapPointBreakThreshold + toolEvent.delta.y) - snapBreakThreshholdMax
          };
        }
      } else {
        return {
          snapPoint: ySnapPoint,
          breakThreshold: ySnapPointBreakThreshold + toolEvent.delta.y
        };
      }
    } else {
      return {
        snapPoint: getYSnapPoint(snapZones),
        breakThreshold: 0
      };
    }
  }

  const getNextXSnapState = (snapZones: any) => {
    if (xSnapPoint) {
      const breaksMinThreshold = xSnapPointBreakThreshold + toolEvent.delta.x < snapBreakThreshholdMin;
      const breaksMaxThreshold = xSnapPointBreakThreshold + toolEvent.delta.x > snapBreakThreshholdMax;
      if (breaksMinThreshold || breaksMaxThreshold) {
        if (breaksMinThreshold) {
          return {
            snapPoint: getXSnapPoint(snapZones),
            breakThreshold: (xSnapPointBreakThreshold + toolEvent.delta.x) - snapBreakThreshholdMin
          };
        } else if (breaksMaxThreshold) {
          return {
            snapPoint: getXSnapPoint(snapZones),
            breakThreshold: (xSnapPointBreakThreshold + toolEvent.delta.x) - snapBreakThreshholdMax
          };
        }
      } else {
        return {
          snapPoint: xSnapPoint,
          breakThreshold: xSnapPointBreakThreshold + toolEvent.delta.x
        }
      }
    } else {
      return {
        snapPoint: getXSnapPoint(snapZones),
        breakThreshold: 0
      }
    }
  }

  const getNextSnapBounds = (nextXSnapPoint: any, nextYSnapPoint: any) => {
    let currentSnapBounds = new paperMain.Rectangle(bounds);
    if (nextYSnapPoint.snapPoint) {
      switch(snapRule) {
        case 'move':
          switch(nextYSnapPoint.snapPoint.snapZone) {
            case 'top':
              currentSnapBounds.center.y = nextYSnapPoint.snapPoint.y + (bounds.height / 2);
              break;
            case 'middle':
              currentSnapBounds.center.y = nextYSnapPoint.snapPoint.y;
              break;
            case 'bottom':
              currentSnapBounds.center.y = nextYSnapPoint.snapPoint.y - (bounds.height / 2);
              break;
          }
          break;
        case 'resize': {
          let top;
          let bottom;
          let left;
          let right
          switch(nextYSnapPoint.snapPoint.snapZone) {
            case 'top': {
              if (preserveAspectRatio) {
                const height = currentSnapBounds.bottom - nextYSnapPoint.snapPoint.y;
                const width = height * aspectRatio;
                top = nextYSnapPoint.snapPoint.y;
                bottom = currentSnapBounds.bottom;
                switch(resizeHandle) {
                  case 'topLeft':
                    left = currentSnapBounds.right - width;
                    right = currentSnapBounds.right;
                    break;
                  case 'topRight':
                    left = currentSnapBounds.left;
                    right = currentSnapBounds.left + width;
                    break;
                  case 'topCenter':
                    left = currentSnapBounds.center.x - (width / 2);
                    right = currentSnapBounds.center.x + (width / 2);
                    break;
                }
              } else {
                top = nextYSnapPoint.snapPoint.y;
                left = currentSnapBounds.left;
                right = currentSnapBounds.right;
                bottom = currentSnapBounds.bottom;
              }
              break;
            }
            case 'bottom': {
              if (preserveAspectRatio) {
                const height = currentSnapBounds.top - nextYSnapPoint.snapPoint.y;
                const width = height * aspectRatio;
                top = currentSnapBounds.top;
                bottom = nextYSnapPoint.snapPoint.y;
                switch(resizeHandle) {
                  case 'bottomLeft':
                    left = currentSnapBounds.right + width;
                    right = currentSnapBounds.right;
                    break;
                  case 'bottomRight':
                    left = currentSnapBounds.left;
                    right = currentSnapBounds.left - width;
                    break;
                  case 'bottomCenter':
                    left = currentSnapBounds.center.x + (width / 2);
                    right = currentSnapBounds.center.x - (width / 2);
                    break;
                }
              } else {
                top = currentSnapBounds.top;
                left = currentSnapBounds.left;
                right = currentSnapBounds.right;
                bottom = nextYSnapPoint.snapPoint.y;
              }
              break;
            }
          }
          currentSnapBounds = new paperMain.Rectangle({
            top, left, right, bottom
          });
          break;
        }
      }
    }
    if (nextXSnapPoint.snapPoint) {
      switch(snapRule) {
        case 'move':
          switch(nextXSnapPoint.snapPoint.snapZone) {
            case 'left':
              currentSnapBounds.center.x = nextXSnapPoint.snapPoint.x + (bounds.width / 2);
              break;
            case 'center':
              currentSnapBounds.center.x = nextXSnapPoint.snapPoint.x;
              break;
            case 'right':
              currentSnapBounds.center.x = nextXSnapPoint.snapPoint.x - (bounds.width / 2);
              break;
          }
          break;
        case 'resize': {
          let top;
          let bottom;
          let left;
          let right
          switch(nextXSnapPoint.snapPoint.snapZone) {
            case 'left': {
              if (preserveAspectRatio) {
                const width = currentSnapBounds.right - nextXSnapPoint.snapPoint.x;
                const height = width / aspectRatio;
                left = nextXSnapPoint.snapPoint.x;
                right = currentSnapBounds.right;
                switch(resizeHandle) {
                  case 'topLeft':
                    top = currentSnapBounds.bottom - height;
                    bottom = currentSnapBounds.bottom;
                    break;
                  case 'bottomLeft':
                    top = currentSnapBounds.top;
                    bottom = currentSnapBounds.top + height;
                    break;
                  case 'leftCenter':
                    top = currentSnapBounds.center.y - (height / 2);
                    bottom = currentSnapBounds.center.y + (height / 2);
                    break;
                }
              } else {
                top = currentSnapBounds.top;
                left = nextXSnapPoint.snapPoint.x;
                right = currentSnapBounds.right;
                bottom = currentSnapBounds.bottom;
              }
              break;
            }
            case 'right': {
              if (preserveAspectRatio) {
                const width = currentSnapBounds.left - nextXSnapPoint.snapPoint.x;
                const height = width / aspectRatio;
                left = currentSnapBounds.left;
                right = nextXSnapPoint.snapPoint.x;
                switch(resizeHandle) {
                  case 'topRight':
                    top = currentSnapBounds.bottom + height;
                    bottom = currentSnapBounds.bottom;
                    break;
                  case 'bottomRight':
                    top = currentSnapBounds.top;
                    bottom = currentSnapBounds.top - height;
                    break;
                  case 'rightCenter':
                    top = currentSnapBounds.center.y + (height / 2);
                    bottom = currentSnapBounds.center.y - (height / 2);
                    break;
                }
              } else {
                top = currentSnapBounds.top;
                left = currentSnapBounds.left;
                right = nextXSnapPoint.snapPoint.x;
                bottom = currentSnapBounds.bottom;
              }
              break;
            }
          }
          currentSnapBounds = new paperMain.Rectangle({
            top, left, right, bottom
          });
          break;
        }
      }
    }
    return currentSnapBounds;
  }

  useEffect(() => {
    if (bounds) {
      const snapZones = getSnapZones(bounds);
      const nextXSnapState = getNextXSnapState(snapZones);
      const nextYSnapState = getNextYSnapState(snapZones);
      const nextSnapBounds = getNextSnapBounds(nextXSnapState, nextYSnapState);
      setXSnapPoint(nextXSnapState.snapPoint);
      setYSnapPoint(nextYSnapState.snapPoint);
      setXSnapPointBreakThreshold(nextXSnapState.breakThreshold);
      setYSnapPointBreakThreshold(nextYSnapState.breakThreshold);
      setSnapZoneTop(snapZones.top);
      setSnapZoneBottom(snapZones.bottom);
      setSnapZoneCenter(snapZones.center);
      setSnapZoneLeft(snapZones.left);
      setSnapZoneRight(snapZones.right);
      setSnapZoneMiddle(snapZones.middle);
      if (!nextSnapBounds.equals(snapBounds)) {
        setSnapBounds(nextSnapBounds);
        if (onUpdate) {
          onUpdate(nextSnapBounds);
        }
      }
    }
  }, [toolEvent, preserveAspectRatio]);

  useEffect(() => {
    setSnapBreakThreshholdMin(-8 / paperMain.view.zoom);
    setSnapBreakThreshholdMax(8 / paperMain.view.zoom);
    return () => {
      const guideIds = ['SnapGuideTop', 'SnapGuideMiddle', 'SnapGuideBottom', 'SnapGuideLeft', 'SnapGuideCenter', 'SnapGuideRight'];
      const uiElementIds = ['SnapPointXGuide', 'SnapPointYGuide', 'SnapZoneTop', 'SnapZoneMiddle', 'SnapZoneBottom', 'SnapZoneLeft', 'SnapZoneCenter', 'SnapZoneRight'];
      [...uiElementIds, ...guideIds].forEach((elementId) => {
        const paperLayer = getPaperLayer(elementId);
        if (paperLayer) {
          paperLayer.remove();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (snapBounds) {
      const guideIds = ['SnapGuideTop', 'SnapGuideMiddle', 'SnapGuideBottom', 'SnapGuideLeft', 'SnapGuideCenter', 'SnapGuideRight'];
      guideIds.forEach((elementId) => {
        const paperLayer = getPaperLayer(elementId);
        if (paperLayer) {
          paperLayer.remove();
        }
      });
      const guideSnapZones = getSnapZones(snapBounds, 0.5);
      Object.keys(guideSnapZones).forEach((key: Btwx.SnapZoneType) => {
        const guideLayers = getGuideLayersBySnapZone(guideSnapZones, key);
        if (guideLayers.length > 0) {
          const paperLayerBounds = getPaperLayersBounds([...guideLayers, new paperMain.Path.Rectangle({rectangle: snapBounds, insert: false})]);
          let from: paper.Point;
          let to: paper.Point;
          switch(key) {
            case 'top':
              from = new paperMain.Point(paperLayerBounds.left, snapBounds.top);
              to = new paperMain.Point(paperLayerBounds.right, snapBounds.top);
              break;
            case 'middle':
              from = new paperMain.Point(paperLayerBounds.left, snapBounds.center.y);
              to = new paperMain.Point(paperLayerBounds.right, snapBounds.center.y);
              break;
            case 'bottom':
              from = new paperMain.Point(paperLayerBounds.left, snapBounds.bottom);
              to = new paperMain.Point(paperLayerBounds.right, snapBounds.bottom);
              break;
            case 'left':
              from = new paperMain.Point(snapBounds.left, paperLayerBounds.top);
              to = new paperMain.Point(snapBounds.left, paperLayerBounds.bottom);
              break;
            case 'center':
              from = new paperMain.Point(snapBounds.center.x, paperLayerBounds.top);
              to = new paperMain.Point(snapBounds.center.x, paperLayerBounds.bottom);
              break;
            case 'right':
              from = new paperMain.Point(snapBounds.right, paperLayerBounds.top);
              to = new paperMain.Point(snapBounds.right, paperLayerBounds.bottom);
              break;
          }
          const guide = new paperMain.Path.Line({
            from,
            to,
            data: { id: `SnapGuide${capitalize(key)}`, type: 'UIElement' },
            strokeColor: theme.palette.recording,
            strokeWidth: 1
          });
          guide.removeOn({
            up: true
          });
        }
      });
    }
  }, [snapBounds]);

  if (snapToolDebug) {
    useEffect(() => {
      const id = 'SnapZoneTop';
      const paperLayer = getPaperLayer(id);
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneTop) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneTop,
          fillColor: 'magenta',
          opacity: 0.25,
          data: {
            id: id,
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: id
          }
        });
      }
    }, [snapZoneTop]);

    useEffect(() => {
      const id = 'SnapZoneMiddle';
      const paperLayer = getPaperLayer(id);
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneMiddle) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneMiddle,
          fillColor: 'red',
          opacity: 0.25,
          data: {
            id: 'SnapZoneMiddle',
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: 'SnapZoneMiddle'
          }
        });
      }
    }, [snapZoneMiddle]);

    useEffect(() => {
      const id = 'SnapZoneBottom';
      const paperLayer = getPaperLayer(id);
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneBottom) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneBottom,
          fillColor: 'yellow',
          opacity: 0.25,
          data: {
            id: id,
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: id
          }
        });
      }
    }, [snapZoneBottom]);

    useEffect(() => {
      const id = 'SnapZoneLeft';
      const paperLayer = getPaperLayer(id);
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneLeft) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneLeft,
          fillColor: 'cyan',
          opacity: 0.25,
          data: {
            id: id,
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: id
          }
        });
      }
    }, [snapZoneLeft]);

    useEffect(() => {
      const id = 'SnapZoneCenter';
      const paperLayer = getPaperLayer(id);
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneCenter) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneCenter,
          fillColor: 'orange',
          opacity: 0.25,
          data: {
            id: id,
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: id
          }
        });
      }
    }, [snapZoneCenter]);

    useEffect(() => {
      const id = 'SnapZoneRight';
      const paperLayer = getPaperLayer(id);
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneRight) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneRight,
          fillColor: theme.text.lightest,
          data: {
            id: id,
            type: 'UIElement',
            interactive: false,
            interactiveType: null,
            elementId: id
          }
        });
      }
    }, [snapZoneRight]);
  }

  return (
    <></>
  );
});

const mapStateToProps = (state: RootState): {
  scope: string[];
} => {
  const { layer } = state;
  const scope = layer.present.scope;
  return {
    scope
  };
};

export default connect(
  mapStateToProps
)(SnapTool);