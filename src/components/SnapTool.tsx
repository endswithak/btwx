/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useState, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import { updateMeasureGuides } from '../store/actions/layer';
import { getPaperLayersBounds, getClosestPaperLayer, getLayerPaperScopes } from '../store/selectors/layer';
import Guide from '../canvas/guide';

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
  scope?: string[];
  paperScope?: number;
  layerPaperScopes: {
    [id: string]: number;
  };
  whiteListLayers?: string[];
  blackListLayers?: string[];
  measure?: boolean;
  onUpdate?(snapBounds: paper.Rectangle, xSnapPoint: any, ySnapPoint: any): any;
}

const snapToolDebug = false;

const SnapTool = (props: SnapToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { toolEvent, bounds, scope, paperScope, layerPaperScopes, onUpdate, hitTestZones, snapRule, whiteListLayers, blackListLayers, preserveAspectRatio, aspectRatio, resizeHandle, measure } = props;
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [xSnapPoint, setXSnapPoint] = useState<Btwx.SnapPoint>(null);
  const [ySnapPoint, setYSnapPoint] = useState<Btwx.SnapPoint>(null);
  const [xSnapPointBreakThreshold, setXSnapPointBreakThreshold] = useState<number>(0);
  const [ySnapPointBreakThreshold, setYSnapPointBreakThreshold] = useState<number>(0);
  const [snapBreakThreshholdMin, setSnapBreakThreshholdMin] = useState<number>(null);
  const [snapBreakThreshholdMax, setSnapBreakThreshholdMax] = useState<number>(null);
  const [snapZoneTop, setSnapZoneTop] = useState<paper.Rectangle>(null);
  const [snapZoneMiddle, setSnapZoneMiddle] = useState<paper.Rectangle>(null);
  const [snapZoneBottom, setSnapZoneBottom] = useState<paper.Rectangle>(null);
  const [snapZoneLeft, setSnapZoneLeft] = useState<paper.Rectangle>(null);
  const [snapZoneCenter, setSnapZoneCenter] = useState<paper.Rectangle>(null);
  const [snapZoneRight, setSnapZoneRight] = useState<paper.Rectangle>(null);

  const getSnapZones = (currentToBounds: paper.Rectangle, scaleOverride?: number): Btwx.SnapZones => {
    const zoneMin = 0.5;
    const zoneMax = 20;
    const zoneScale = scaleOverride ? scaleOverride : 0.5 * (8 / uiPaperScope.view.zoom);
    const scale = zoneScale < zoneMin ? zoneMin : zoneScale > zoneMax ? zoneMax : zoneScale;
    const top = hitTestZones.all || hitTestZones.top ? new uiPaperScope.Rectangle({
      from: new uiPaperScope.Point(uiPaperScope.view.bounds.left, currentToBounds.top - scale),
      to: new uiPaperScope.Point(uiPaperScope.view.bounds.right, currentToBounds.top + scale)
    }) : null;
    const middle = hitTestZones.all || hitTestZones.middle ? new uiPaperScope.Rectangle({
      from: new uiPaperScope.Point(uiPaperScope.view.bounds.left, currentToBounds.center.y - scale),
      to: new uiPaperScope.Point(uiPaperScope.view.bounds.right, currentToBounds.center.y + scale)
    }) : null;
    const bottom = hitTestZones.all || hitTestZones.bottom ? new uiPaperScope.Rectangle({
      from: new uiPaperScope.Point(uiPaperScope.view.bounds.left, currentToBounds.bottom - scale),
      to: new uiPaperScope.Point(uiPaperScope.view.bounds.right, currentToBounds.bottom + scale)
    }) : null;
    const left = hitTestZones.all || hitTestZones.left ? new uiPaperScope.Rectangle({
      from: new uiPaperScope.Point(currentToBounds.left - scale, uiPaperScope.view.bounds.top),
      to: new uiPaperScope.Point(currentToBounds.left + scale, uiPaperScope.view.bounds.bottom)
    }) : null;
    const center = hitTestZones.all || hitTestZones.center ? new uiPaperScope.Rectangle({
      from: new uiPaperScope.Point(currentToBounds.center.x - scale, uiPaperScope.view.bounds.top),
      to: new uiPaperScope.Point(currentToBounds.center.x + scale, uiPaperScope.view.bounds.bottom)
    }) : null;
    const right = hitTestZones.all || hitTestZones.right ? new uiPaperScope.Rectangle({
      from: new uiPaperScope.Point(currentToBounds.right - scale, uiPaperScope.view.bounds.top),
      to: new uiPaperScope.Point(currentToBounds.right + scale, uiPaperScope.view.bounds.bottom)
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

  const getGuideLayersBySnapZone = (snapZones: Btwx.SnapZones, snapZone: Btwx.SnapZoneType): paper.Item[] => {
    const getProjectSnapLayers = (paperScope: paper.Project): paper.Item[] => {
      if (paperScope) {
        return paperScope.getItems({
          data: (data: any) => {
            const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
            const isTopScopeGroup = data.id && data.layerType === 'Group' && data.id === scope[scope.length - 1];
            if (whiteListLayers && whiteListLayers.length > 0) {
              const whiteListed = data.scope && (whiteListLayers.includes(data.id) || data.scope.some((id: string) => whiteListLayers.includes(id)));
              return whiteListed && isScopeLayer && !isTopScopeGroup;
            } else if (blackListLayers && blackListLayers.length > 0) {
              const notBlackListed = data.scope && !blackListLayers.includes(data.id) && data.scope.every((id: string) => !blackListLayers.includes(id));
              return notBlackListed && isScopeLayer && !isTopScopeGroup;
            } else {
              return isScopeLayer && !isTopScopeGroup;
            }
          },
          overlapping: uiPaperScope.view.bounds,
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
      } else {
        return [];
      }
    }
    return Object.keys(layerPaperScopes).reduce((result, current, index) => {
      const paperScope = uiPaperScope.projects[layerPaperScopes[current]];
      const projectSnapLayers = getProjectSnapLayers(paperScope);
      if (projectSnapLayers && projectSnapLayers.length > 0) {
        result = [...result, ...projectSnapLayers];
      }
      return result;
    }, []);
  }

  const getYSnapToLayer = (snapZones: Btwx.SnapZones): paper.Item => {
    const getProjectSnapLayer = (paperScope: paper.Project): paper.Item => {
      if (paperScope) {
        return paperScope.getItem({
          data: (data: any) => {
            const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
            const isTopScopeGroup = data.id && data.layerType === 'Group' && data.id === scope[scope.length - 1];
            if (whiteListLayers && whiteListLayers.length > 0) {
              const whiteListed = data.scope && (whiteListLayers.includes(data.id) || data.scope.some((id: string) => whiteListLayers.includes(id)));
              return whiteListed && isScopeLayer && !isTopScopeGroup;
            } else if (blackListLayers && blackListLayers.length > 0) {
              const notBlackListed = data.scope && !blackListLayers.includes(data.id) && data.scope.every((id: string) => !blackListLayers.includes(id));
              return notBlackListed && isScopeLayer && !isTopScopeGroup;
            } else {
              return isScopeLayer && !isTopScopeGroup;
            }
          },
          overlapping: uiPaperScope.view.bounds,
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
      } else {
        return null;
      }
    }
    return Object.keys(layerPaperScopes).reduce((result: paper.Item, current, index) => {
      const paperScope = uiPaperScope.projects[layerPaperScopes[current]];
      const projectSnapLayer = getProjectSnapLayer(paperScope);
      if (projectSnapLayer) {
        result = projectSnapLayer;
      }
      return result;
    }, null);
  }

  const getXSnapToLayer = (snapZones: Btwx.SnapZones): paper.Item => {
    const getProjectSnapLayer = (paperScope: paper.Project): paper.Item => {
      if (paperScope) {
        return paperScope.getItem({
          data: (data: any) => {
            const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
            const isTopScopeGroup = data.id && data.layerType === 'Group' && data.id === scope[scope.length - 1];
            if (whiteListLayers && whiteListLayers.length > 0) {
              const whiteListed = data.scope && (whiteListLayers.includes(data.id) || data.scope.some((id: string) => whiteListLayers.includes(id)));
              return whiteListed && isScopeLayer && !isTopScopeGroup;
            } else if (blackListLayers && blackListLayers.length > 0) {
              const notBlackListed = data.scope && !blackListLayers.includes(data.id) && data.scope.every((id: string) => !blackListLayers.includes(id));
              return notBlackListed && isScopeLayer && !isTopScopeGroup;
            } else {
              return isScopeLayer && !isTopScopeGroup;
            }
          },
          overlapping: uiPaperScope.view.bounds,
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
      } else {
        return null;
      }
    }
    return Object.keys(layerPaperScopes).reduce((result: paper.Item, current, index) => {
      const paperScope = uiPaperScope.projects[layerPaperScopes[current]];
      const projectSnapLayer = getProjectSnapLayer(paperScope);
      if (projectSnapLayer) {
        result = projectSnapLayer;
      }
      return result;
    }, null);
  }

  const getYSnapPoint = (snapZones: Btwx.SnapZones): Btwx.SnapPoint => {
    const ySnapToLayer = getYSnapToLayer(snapZones);
    if (ySnapToLayer) {
      if (ySnapToLayer.bounds.topCenter.isInside(snapZones.top)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.topCenter.y
        }
      } else if (ySnapToLayer.bounds.center.isInside(snapZones.top)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.center.y
        }
      } else if (ySnapToLayer.bounds.bottomCenter.isInside(snapZones.top)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      } else if (ySnapToLayer.bounds.topCenter.isInside(snapZones.middle)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.topCenter.y
        }
      } else if (ySnapToLayer.bounds.center.isInside(snapZones.middle)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.center.y
        }
      } else if (ySnapToLayer.bounds.bottomCenter.isInside(snapZones.middle)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      } else if (ySnapToLayer.bounds.topCenter.isInside(snapZones.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.topCenter.y
        }
      } else if (ySnapToLayer.bounds.center.isInside(snapZones.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.center.y
        }
      } else if (ySnapToLayer.bounds.bottomCenter.isInside(snapZones.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      }
    } else {
      return null;
    }
  }

  const getXSnapPoint = (snapZones: Btwx.SnapZones): Btwx.SnapPoint => {
    const xSnapToLayer = getXSnapToLayer(snapZones);
    if (xSnapToLayer) {
      if (xSnapToLayer.bounds.leftCenter.isInside(snapZones.left)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      } else if (xSnapToLayer.bounds.center.isInside(snapZones.left)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.center.x
        }
      } else if (xSnapToLayer.bounds.rightCenter.isInside(snapZones.left)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      } else if (xSnapToLayer.bounds.leftCenter.isInside(snapZones.center)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      } else if (xSnapToLayer.bounds.center.isInside(snapZones.center)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.center.x
        }
      } else if (xSnapToLayer.bounds.rightCenter.isInside(snapZones.center)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      } else if (xSnapToLayer.bounds.leftCenter.isInside(snapZones.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      } else if (xSnapToLayer.bounds.center.isInside(snapZones.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.center.x
        }
      } else if (xSnapToLayer.bounds.rightCenter.isInside(snapZones.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      }
    } else {
      return null;
    }
  }

  const getNextYSnapState = (snapZones: Btwx.SnapZones): Btwx.SnapState => {
    if (ySnapPoint) {
      const breaksMinThreshold = ySnapPointBreakThreshold + toolEvent.delta.y < snapBreakThreshholdMin;
      const breaksMaxThreshold = ySnapPointBreakThreshold + toolEvent.delta.y > snapBreakThreshholdMax;
      if (breaksMinThreshold || breaksMaxThreshold) {
        if (breaksMinThreshold) {
          return {
            snapPoint: getYSnapPoint(snapZones),
            breakThreshold: 0 // (ySnapPointBreakThreshold + toolEvent.delta.y) - snapBreakThreshholdMin
          };
        } else if (breaksMaxThreshold) {
          return {
            snapPoint: getYSnapPoint(snapZones),
            breakThreshold: 0 // (ySnapPointBreakThreshold + toolEvent.delta.y) - snapBreakThreshholdMax
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

  const getNextXSnapState = (snapZones: Btwx.SnapZones): Btwx.SnapState => {
    if (xSnapPoint) {
      const breaksMinThreshold = xSnapPointBreakThreshold + toolEvent.delta.x < snapBreakThreshholdMin;
      const breaksMaxThreshold = xSnapPointBreakThreshold + toolEvent.delta.x > snapBreakThreshholdMax;
      if (breaksMinThreshold || breaksMaxThreshold) {
        if (breaksMinThreshold) {
          return {
            snapPoint: getXSnapPoint(snapZones),
            breakThreshold: 0 // (xSnapPointBreakThreshold + toolEvent.delta.x) - snapBreakThreshholdMin
          };
        } else if (breaksMaxThreshold) {
          return {
            snapPoint: getXSnapPoint(snapZones),
            breakThreshold: 0 // (xSnapPointBreakThreshold + toolEvent.delta.x) - snapBreakThreshholdMax
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

  const getNextSnapBounds = (nextXSnapState: Btwx.SnapState, nextYSnapState: Btwx.SnapState): paper.Rectangle => {
    let currentSnapBounds = new uiPaperScope.Rectangle(bounds);
    if (nextYSnapState.snapPoint) {
      switch(snapRule) {
        case 'move':
          switch(nextYSnapState.snapPoint.snapZone) {
            case 'top':
              currentSnapBounds.center.y = nextYSnapState.snapPoint.y + (bounds.height / 2);
              break;
            case 'middle':
              currentSnapBounds.center.y = nextYSnapState.snapPoint.y;
              break;
            case 'bottom':
              currentSnapBounds.center.y = nextYSnapState.snapPoint.y - (bounds.height / 2);
              break;
          }
          break;
        case 'resize': {
          let top;
          let bottom;
          let left;
          let right
          switch(nextYSnapState.snapPoint.snapZone) {
            case 'top': {
              if (preserveAspectRatio) {
                const height = currentSnapBounds.bottom - nextYSnapState.snapPoint.y;
                const width = height * aspectRatio;
                top = nextYSnapState.snapPoint.y;
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
                top = nextYSnapState.snapPoint.y;
                left = currentSnapBounds.left;
                right = currentSnapBounds.right;
                bottom = currentSnapBounds.bottom;
              }
              break;
            }
            case 'bottom': {
              if (preserveAspectRatio) {
                const height = currentSnapBounds.top - nextYSnapState.snapPoint.y;
                const width = height * aspectRatio;
                top = currentSnapBounds.top;
                bottom = nextYSnapState.snapPoint.y;
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
                bottom = nextYSnapState.snapPoint.y;
              }
              break;
            }
          }
          currentSnapBounds = new uiPaperScope.Rectangle({
            top, left, right, bottom
          });
          break;
        }
      }
    }
    if (nextXSnapState.snapPoint) {
      switch(snapRule) {
        case 'move':
          switch(nextXSnapState.snapPoint.snapZone) {
            case 'left':
              currentSnapBounds.center.x = nextXSnapState.snapPoint.x + (bounds.width / 2);
              break;
            case 'center':
              currentSnapBounds.center.x = nextXSnapState.snapPoint.x;
              break;
            case 'right':
              currentSnapBounds.center.x = nextXSnapState.snapPoint.x - (bounds.width / 2);
              break;
          }
          break;
        case 'resize': {
          let top;
          let bottom;
          let left;
          let right
          switch(nextXSnapState.snapPoint.snapZone) {
            case 'left': {
              if (preserveAspectRatio) {
                const width = currentSnapBounds.right - nextXSnapState.snapPoint.x;
                const height = width / aspectRatio;
                left = nextXSnapState.snapPoint.x;
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
                left = nextXSnapState.snapPoint.x;
                right = currentSnapBounds.right;
                bottom = currentSnapBounds.bottom;
              }
              break;
            }
            case 'right': {
              if (preserveAspectRatio) {
                const width = currentSnapBounds.left - nextXSnapState.snapPoint.x;
                const height = width / aspectRatio;
                left = currentSnapBounds.left;
                right = nextXSnapState.snapPoint.x;
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
                right = nextXSnapState.snapPoint.x;
                bottom = currentSnapBounds.bottom;
              }
              break;
            }
          }
          currentSnapBounds = new uiPaperScope.Rectangle({
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
          onUpdate(nextSnapBounds, nextXSnapState.snapPoint, nextYSnapState.snapPoint);
        }
      }
    }
  }, [toolEvent, preserveAspectRatio]);

  useEffect(() => {
    setSnapBreakThreshholdMin(-4 / uiPaperScope.view.zoom);
    setSnapBreakThreshholdMax(4 / uiPaperScope.view.zoom);
    return () => {
      const measureGuides = uiPaperScope.projects[0].getItem({data: {id: 'measureGuides'}});
      const snapGuides =  uiPaperScope.projects[0].getItem({data: {id: 'snapGuides'}});
      measureGuides.removeChildren();
      snapGuides.removeChildren();
    }
  }, []);

  useEffect(() => {
    if (snapBounds) {
      const measureGuides = uiPaperScope.projects[0].getItem({data: {id: 'measureGuides'}});
      const snapGuides =  uiPaperScope.projects[0].getItem({data: {id: 'snapGuides'}});
      measureGuides.removeChildren();
      snapGuides.removeChildren();
      const guideSnapZones = getSnapZones(snapBounds, 0.5);
      const xGuideLayers: paper.Item[] = [];
      const yGuideLayers: paper.Item[] = [];
      Object.keys(guideSnapZones).forEach((key: Btwx.SnapZoneType) => {
        const guideLayers = getGuideLayersBySnapZone(guideSnapZones, key);
        if (guideLayers.length > 0) {
          const paperLayerBounds = getPaperLayersBounds([...guideLayers, new uiPaperScope.Path.Rectangle({rectangle: snapBounds, insert: false})]);
          let from: paper.Point;
          let to: paper.Point;
          switch(key) {
            case 'top':
              from = new uiPaperScope.Point(paperLayerBounds.left, snapBounds.top);
              to = new uiPaperScope.Point(paperLayerBounds.right, snapBounds.top);
              yGuideLayers.push(...guideLayers);
              break;
            case 'middle':
              from = new uiPaperScope.Point(paperLayerBounds.left, snapBounds.center.y);
              to = new uiPaperScope.Point(paperLayerBounds.right, snapBounds.center.y);
              yGuideLayers.push(...guideLayers);
              break;
            case 'bottom':
              from = new uiPaperScope.Point(paperLayerBounds.left, snapBounds.bottom);
              to = new uiPaperScope.Point(paperLayerBounds.right, snapBounds.bottom);
              yGuideLayers.push(...guideLayers);
              break;
            case 'left':
              from = new uiPaperScope.Point(snapBounds.left, paperLayerBounds.top);
              to = new uiPaperScope.Point(snapBounds.left, paperLayerBounds.bottom);
              xGuideLayers.push(...guideLayers);
              break;
            case 'center':
              from = new uiPaperScope.Point(snapBounds.center.x, paperLayerBounds.top);
              to = new uiPaperScope.Point(snapBounds.center.x, paperLayerBounds.bottom);
              xGuideLayers.push(...guideLayers);
              break;
            case 'right':
              from = new uiPaperScope.Point(snapBounds.right, paperLayerBounds.top);
              to = new uiPaperScope.Point(snapBounds.right, paperLayerBounds.bottom);
              xGuideLayers.push(...guideLayers);
              break;
          }
          new Guide({from, to, guideType: 'snap', removeOpts: {up: true}});
        }
      });
      if (measure) {
        let measureTo: { top?: paper.Rectangle; bottom?: paper.Rectangle; left?: paper.Rectangle; right?: paper.Rectangle; all?: paper.Rectangle } = null;
        if (xSnapPoint) {
          const closestLayer = getClosestPaperLayer(snapBounds.center, xGuideLayers);
          if (closestLayer && !snapBounds.intersects(closestLayer.bounds, 1)) {
            if (!measureTo) {
              measureTo = {};
            }
            measureTo['top'] = closestLayer.bounds;
            measureTo['bottom'] = closestLayer.bounds;
          }
        }
        if (ySnapPoint) {
          const closestLayer = getClosestPaperLayer(snapBounds.center, yGuideLayers);
          if (closestLayer && !snapBounds.intersects(closestLayer.bounds, 1)) {
            if (!measureTo) {
              measureTo = {};
            }
            measureTo['left'] = closestLayer.bounds;
            measureTo['right'] = closestLayer.bounds;
          }
        }
        if (measureTo) {
          updateMeasureGuides(snapBounds, measureTo);
        }
      }
    }
  }, [snapBounds]);

  // if (snapToolDebug) {
  //   useEffect(() => {
  //     const id = 'SnapZoneTop';
  //     const paperLayer = getPaperLayer(id);
  //     if (paperLayer) {
  //       paperLayer.remove();
  //     }
  //     if (snapZoneTop) {
  //       new uiPaperScope.Path.Rectangle({
  //         rectangle: snapZoneTop,
  //         fillColor: 'magenta',
  //         opacity: 0.25,
  //         data: {
  //           id: id,
  //           type: 'UIElement',
  //           interactive: false,
  //           interactiveType: null,
  //           elementId: id
  //         }
  //       });
  //     }
  //   }, [snapZoneTop]);

  //   useEffect(() => {
  //     const id = 'SnapZoneMiddle';
  //     const paperLayer = getPaperLayer(id);
  //     if (paperLayer) {
  //       paperLayer.remove();
  //     }
  //     if (snapZoneMiddle) {
  //       new uiPaperScope.Path.Rectangle({
  //         rectangle: snapZoneMiddle,
  //         fillColor: 'red',
  //         opacity: 0.25,
  //         data: {
  //           id: 'SnapZoneMiddle',
  //           type: 'UIElement',
  //           interactive: false,
  //           interactiveType: null,
  //           elementId: 'SnapZoneMiddle'
  //         }
  //       });
  //     }
  //   }, [snapZoneMiddle]);

  //   useEffect(() => {
  //     const id = 'SnapZoneBottom';
  //     const paperLayer = getPaperLayer(id);
  //     if (paperLayer) {
  //       paperLayer.remove();
  //     }
  //     if (snapZoneBottom) {
  //       new uiPaperScope.Path.Rectangle({
  //         rectangle: snapZoneBottom,
  //         fillColor: 'yellow',
  //         opacity: 0.25,
  //         data: {
  //           id: id,
  //           type: 'UIElement',
  //           interactive: false,
  //           interactiveType: null,
  //           elementId: id
  //         }
  //       });
  //     }
  //   }, [snapZoneBottom]);

  //   useEffect(() => {
  //     const id = 'SnapZoneLeft';
  //     const paperLayer = getPaperLayer(id);
  //     if (paperLayer) {
  //       paperLayer.remove();
  //     }
  //     if (snapZoneLeft) {
  //       new uiPaperScope.Path.Rectangle({
  //         rectangle: snapZoneLeft,
  //         fillColor: 'cyan',
  //         opacity: 0.25,
  //         data: {
  //           id: id,
  //           type: 'UIElement',
  //           interactive: false,
  //           interactiveType: null,
  //           elementId: id
  //         }
  //       });
  //     }
  //   }, [snapZoneLeft]);

  //   useEffect(() => {
  //     const id = 'SnapZoneCenter';
  //     const paperLayer = getPaperLayer(id);
  //     if (paperLayer) {
  //       paperLayer.remove();
  //     }
  //     if (snapZoneCenter) {
  //       new uiPaperScope.Path.Rectangle({
  //         rectangle: snapZoneCenter,
  //         fillColor: 'orange',
  //         opacity: 0.25,
  //         data: {
  //           id: id,
  //           type: 'UIElement',
  //           interactive: false,
  //           interactiveType: null,
  //           elementId: id
  //         }
  //       });
  //     }
  //   }, [snapZoneCenter]);

  //   useEffect(() => {
  //     const id = 'SnapZoneRight';
  //     const paperLayer = getPaperLayer(id);
  //     if (paperLayer) {
  //       paperLayer.remove();
  //     }
  //     if (snapZoneRight) {
  //       new uiPaperScope.Path.Rectangle({
  //         rectangle: snapZoneRight,
  //         fillColor: theme.text.lightest,
  //         data: {
  //           id: id,
  //           type: 'UIElement',
  //           interactive: false,
  //           interactiveType: null,
  //           elementId: id
  //         }
  //       });
  //     }
  //   }, [snapZoneRight]);
  // }

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  scope: string[];
  paperScope: number;
  layerPaperScopes: {
    [id: string]: number;
  };
} => {
  const { layer } = state;
  const scope = layer.present.scope;
  const paperScope = layer.present.paperScope;
  const layerPaperScopes = getLayerPaperScopes(state);
  return {
    scope,
    paperScope,
    layerPaperScopes
  };
};

export default connect(
  mapStateToProps
)(SnapTool);