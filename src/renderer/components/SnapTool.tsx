/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { getPaperLayersBounds, getClosestPaperLayer, getLayerProjectIndices } from '../store/selectors/layer';
import Guide from '../canvas/guide';
import { isBetween } from '../utils';
import { enableMeasureTool, disableMeasureTool } from '../store/actions/measureTool';

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
  whiteListLayers?: string[];
  blackListLayers?: string[];
  measure?: boolean;
  noSnapZoneScale?: boolean;
  onUpdate?(snapBounds: paper.Rectangle, xSnapPoint: any, ySnapPoint: any): any;
}

const snapToolDebug = false;

// Takes a bounds and returns a snapped bounds
// also displays guides when snapped
//
// @param {bounds} the bounds to snap
// @param {hitTestZones} the zones of the {bounds} you want to snap
// @param {snapRule} defines how the {bounds} is transformed
// @param {resizeHandle} defines how the {bounds} is transformed when {snapRule === 'resize'}
// @param {preserveAspectRatio} preserves {bounds} aspect ratio when {snapRule === 'resize'}
// @param {aspectRatio} aspectRatio to preserve for {preserveAspectRatio}
// @param {whiteListLayers} whitelist snap to layers
// @param {blackListLayers} blacklist snap to layers
// @param {measure} add measurments to guides
// @param {onUpdate} callback with snapBounds and snap points
// @param {noSnapZoneScale} stops snap zone from scaling with canvas zoom (see KeyBindings)

const SnapTool = (props: SnapToolProps): ReactElement => {
  const { toolEvent, bounds, onUpdate, hitTestZones, snapRule, whiteListLayers, blackListLayers, preserveAspectRatio, aspectRatio, resizeHandle, measure, noSnapZoneScale } = props;
  const scope = useSelector((state: RootState) => state.layer.present.scope);
  const measuring = useSelector((state: RootState) => state.measureTool.isEnabled);
  const layerProjectIndices = useSelector((state: RootState) => getLayerProjectIndices(state));
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
  const dispatch = useDispatch();

  const getSnapZones = (currentToBounds: paper.Rectangle, scaleOverride?: number): Btwx.SnapZones => {
    const zoneMin = 0.5;
    const zoneMax = 20;
    const zoneScale = scaleOverride ? scaleOverride : noSnapZoneScale ? zoneMin : zoneMin * (8 / paperMain.view.zoom);
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

  const getGuideLayersBySnapZone = (snapZones: Btwx.SnapZones, snapZone: Btwx.SnapZoneType): paper.Item[] => {
    const getProjectSnapLayers = (project: paper.Project): paper.Item[] => {
      if (project) {
        return project.getItems({
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
          overlapping: paperMain.view.bounds,
          bounds: (bounds: paper.Rectangle) => {
            switch(snapZone) {
              case 'top':
              case 'middle':
              case 'bottom':
                return (
                  snapZones[snapZone] &&
                  (
                    isBetween(bounds.topCenter.y, snapZones[snapZone].top, snapZones[snapZone].bottom) ||
                    isBetween(bounds.center.y, snapZones[snapZone].top, snapZones[snapZone].bottom) ||
                    isBetween(bounds.bottomCenter.y, snapZones[snapZone].top, snapZones[snapZone].bottom)
                  )
                );
              case 'left':
              case 'center':
              case 'right':
                return (
                  snapZones[snapZone] &&
                  (
                    isBetween(bounds.leftCenter.x, snapZones[snapZone].left, snapZones[snapZone].right) ||
                    isBetween(bounds.center.x, snapZones[snapZone].left, snapZones[snapZone].right) ||
                    isBetween(bounds.rightCenter.x, snapZones[snapZone].left, snapZones[snapZone].right)
                  )
                );
            }
          }
        });
      } else {
        return [];
      }
    }
    return layerProjectIndices.reduce((result, current, index) => {
      const project = paperMain.projects[current];
      const projectSnapLayers = getProjectSnapLayers(project);
      if (projectSnapLayers && projectSnapLayers.length > 0) {
        result = [...result, ...projectSnapLayers];
      }
      return result;
    }, []);
  }

  const getYSnapToLayer = (snapZones: Btwx.SnapZones): paper.Item => {
    const getProjectSnapLayer = (project: paper.Project): paper.Item => {
      if (project) {
        return project.getItem({
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
          overlapping: paperMain.view.bounds,
          bounds: (bounds: paper.Rectangle) => {
            return (
              (
                snapZones.top &&
                (
                  isBetween(bounds.topCenter.y, snapZones.top.top, snapZones.top.bottom) ||
                  isBetween(bounds.center.y, snapZones.top.top, snapZones.top.bottom) ||
                  isBetween(bounds.bottomCenter.y, snapZones.top.top, snapZones.top.bottom)
                )
              )
              ||
              (
                snapZones.middle &&
                (
                  isBetween(bounds.topCenter.y, snapZones.middle.top, snapZones.middle.bottom) ||
                  isBetween(bounds.center.y, snapZones.middle.top, snapZones.middle.bottom) ||
                  isBetween(bounds.bottomCenter.y, snapZones.middle.top, snapZones.middle.bottom)
                )
              )
              ||
              (
                snapZones.bottom &&
                (
                  isBetween(bounds.topCenter.y, snapZones.bottom.top, snapZones.bottom.bottom) ||
                  isBetween(bounds.center.y, snapZones.bottom.top, snapZones.bottom.bottom) ||
                  isBetween(bounds.bottomCenter.y, snapZones.bottom.top, snapZones.bottom.bottom)
                )
              )
            )
          }
        });
      } else {
        return null;
      }
    }
    return layerProjectIndices.reduce((result: paper.Item, current, index) => {
      const project = paperMain.projects[current];
      const projectSnapLayer = getProjectSnapLayer(project);
      if (projectSnapLayer) {
        result = projectSnapLayer;
      }
      return result;
    }, null);
  }

  const getXSnapToLayer = (snapZones: Btwx.SnapZones): paper.Item => {
    const getProjectSnapLayer = (project: paper.Project): paper.Item => {
      if (project) {
        return project.getItem({
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
          overlapping: paperMain.view.bounds,
          bounds: (bounds: paper.Rectangle) => {
            return (
              (
                snapZones.left &&
                (
                  isBetween(bounds.leftCenter.x, snapZones.left.left, snapZones.left.right) ||
                  isBetween(bounds.center.x, snapZones.left.left, snapZones.left.right) ||
                  isBetween(bounds.rightCenter.x, snapZones.left.left, snapZones.left.right)
                )
              )
              ||
              (
                snapZones.center &&
                (
                  isBetween(bounds.leftCenter.x, snapZones.center.left, snapZones.center.right) ||
                  isBetween(bounds.center.x, snapZones.center.left, snapZones.center.right) ||
                  isBetween(bounds.rightCenter.x, snapZones.center.left, snapZones.center.right)
                )
              )
              ||
              (
                snapZones.right &&
                (
                  isBetween(bounds.leftCenter.x, snapZones.right.left, snapZones.right.right) ||
                  isBetween(bounds.center.x, snapZones.right.left, snapZones.right.right) ||
                  isBetween(bounds.rightCenter.x, snapZones.right.left, snapZones.right.right)
                )
              )
            )
          }
        });
      } else {
        return null;
      }
    }
    return layerProjectIndices.reduce((result: paper.Item, current, index) => {
      const project = paperMain.projects[current];
      const projectSnapLayer = getProjectSnapLayer(project);
      if (projectSnapLayer) {
        result = projectSnapLayer;
      }
      return result;
    }, null);
  }

  const getYSnapPoint = (snapZones: Btwx.SnapZones): Btwx.SnapPoint => {
    const ySnapToLayer = getYSnapToLayer(snapZones);
    if (ySnapToLayer) {
      if (snapZones.top && isBetween(ySnapToLayer.bounds.topCenter.y, snapZones.top.top, snapZones.top.bottom)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.topCenter.y
        }
      }
      else if (snapZones.top && isBetween(ySnapToLayer.bounds.center.y, snapZones.top.top, snapZones.top.bottom)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.center.y
        }
      }
      else if (snapZones.top && isBetween(ySnapToLayer.bounds.bottomCenter.y, snapZones.top.top, snapZones.top.bottom)) {
        return {
          snapZone: 'top',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      }
      else if (snapZones.middle && isBetween(ySnapToLayer.bounds.topCenter.y, snapZones.middle.top, snapZones.middle.bottom)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.topCenter.y
        }
      }
      else if (snapZones.middle && isBetween(ySnapToLayer.bounds.center.y, snapZones.middle.top, snapZones.middle.bottom)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.center.y
        }
      }
      else if (snapZones.middle && isBetween(ySnapToLayer.bounds.bottomCenter.y, snapZones.middle.top, snapZones.middle.bottom)) {
        return {
          snapZone: 'middle',
          layerSnapZone: 'bottom',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.bottomCenter.y
        }
      }
      else if (snapZones.bottom && isBetween(ySnapToLayer.bounds.topCenter.y, snapZones.bottom.top, snapZones.bottom.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'top',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.topCenter.y
        }
      }
      else if (snapZones.bottom && isBetween(ySnapToLayer.bounds.center.y, snapZones.bottom.top, snapZones.bottom.bottom)) {
        return {
          snapZone: 'bottom',
          layerSnapZone: 'middle',
          layerBounds: ySnapToLayer.bounds,
          layerId: ySnapToLayer.data.id,
          y: ySnapToLayer.bounds.center.y
        }
      }
      else if (snapZones.bottom && isBetween(ySnapToLayer.bounds.bottomCenter.y, snapZones.bottom.top, snapZones.bottom.bottom)) {
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
      if (snapZones.left && isBetween(xSnapToLayer.bounds.leftCenter.x, snapZones.left.left, snapZones.left.right)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      }
      else if (snapZones.left && isBetween(xSnapToLayer.bounds.center.x, snapZones.left.left, snapZones.left.right)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.center.x
        }
      }
      else if (snapZones.left && isBetween(xSnapToLayer.bounds.rightCenter.x, snapZones.left.left, snapZones.left.right)) {
        return {
          snapZone: 'left',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      }
      else if (snapZones.center && isBetween(xSnapToLayer.bounds.leftCenter.x, snapZones.center.left, snapZones.center.right)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      }
      else if (snapZones.center && isBetween(xSnapToLayer.bounds.center.x, snapZones.center.left, snapZones.center.right)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.center.x
        }
      }
      else if (snapZones.center && isBetween(xSnapToLayer.bounds.rightCenter.x, snapZones.center.left, snapZones.center.right)) {
        return {
          snapZone: 'center',
          layerSnapZone: 'right',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.rightCenter.x
        }
      }
      else if (snapZones.right && isBetween(xSnapToLayer.bounds.leftCenter.x, snapZones.right.left, snapZones.right.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'left',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.leftCenter.x
        }
      }
      else if (snapZones.right && isBetween(xSnapToLayer.bounds.center.x, snapZones.right.left, snapZones.right.right)) {
        return {
          snapZone: 'right',
          layerSnapZone: 'center',
          layerBounds: xSnapToLayer.bounds,
          layerId: xSnapToLayer.data.id,
          x: xSnapToLayer.bounds.center.x
        }
      }
      else if (snapZones.right && isBetween(xSnapToLayer.bounds.rightCenter.x, snapZones.right.left, snapZones.right.right)) {
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
    let currentSnapBounds = new paperMain.Rectangle(bounds);
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
          currentSnapBounds = new paperMain.Rectangle({
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
      let nextSnapBounds = getNextSnapBounds(nextXSnapState, nextYSnapState);
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
        if (nextSnapBounds.width < 1 || nextSnapBounds.height < 1) {
          nextSnapBounds = bounds;
        }
        setSnapBounds(nextSnapBounds);
        if (onUpdate) {
          onUpdate(nextSnapBounds, nextXSnapState.snapPoint, nextYSnapState.snapPoint);
        }
      }
    }
  }, [toolEvent, preserveAspectRatio]);

  useEffect(() => {
    setSnapBreakThreshholdMin(-4 / paperMain.view.zoom);
    setSnapBreakThreshholdMax(4 / paperMain.view.zoom);
    return () => {
      const debugGuides = ['SnapZoneTop', 'SnapZoneMiddle', 'SnapZoneBottom', 'SnapZoneLeft', 'SnapZoneCenter', 'SnapZoneRight'];
      const snapGuides =  paperMain.projects[0].getItem({ data: { id: 'snapGuides' } });
      snapGuides.removeChildren();
      if (snapToolDebug) {
        debugGuides.forEach((id) => {
          const guide = paperMain.projects[0].getItem({ data: { id } });
          if (guide) {
            guide.remove();
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (snapBounds) {
      const snapGuides =  paperMain.projects[0].getItem({ data: { id: 'snapGuides' } });
      snapGuides.removeChildren();
      const guideSnapZones = getSnapZones(snapBounds, 0.5);
      const xGuideLayers: paper.Item[] = [];
      const yGuideLayers: paper.Item[] = [];
      Object.keys(guideSnapZones).forEach((key: Btwx.SnapZoneType) => {
        const guideLayers = getGuideLayersBySnapZone(guideSnapZones, key);
        if (guideLayers.length > 0) {
          const paperLayerBounds = getPaperLayersBounds([
            ...guideLayers,
            new paperMain.Path.Rectangle({
              rectangle: snapBounds,
              insert: false
            })
          ]);
          let from: paper.Point;
          let to: paper.Point;
          switch(key) {
            case 'top':
              from = new paperMain.Point(paperLayerBounds.left, snapBounds.top);
              to = new paperMain.Point(paperLayerBounds.right, snapBounds.top);
              yGuideLayers.push(...guideLayers);
              break;
            case 'middle':
              from = new paperMain.Point(paperLayerBounds.left, snapBounds.center.y);
              to = new paperMain.Point(paperLayerBounds.right, snapBounds.center.y);
              yGuideLayers.push(...guideLayers);
              break;
            case 'bottom':
              from = new paperMain.Point(paperLayerBounds.left, snapBounds.bottom);
              to = new paperMain.Point(paperLayerBounds.right, snapBounds.bottom);
              yGuideLayers.push(...guideLayers);
              break;
            case 'left':
              from = new paperMain.Point(snapBounds.left, paperLayerBounds.top);
              to = new paperMain.Point(snapBounds.left, paperLayerBounds.bottom);
              xGuideLayers.push(...guideLayers);
              break;
            case 'center':
              from = new paperMain.Point(snapBounds.center.x, paperLayerBounds.top);
              to = new paperMain.Point(snapBounds.center.x, paperLayerBounds.bottom);
              xGuideLayers.push(...guideLayers);
              break;
            case 'right':
              from = new paperMain.Point(snapBounds.right, paperLayerBounds.top);
              to = new paperMain.Point(snapBounds.right, paperLayerBounds.bottom);
              xGuideLayers.push(...guideLayers);
              break;
          }
          new Guide({
            from,
            to,
            guideType: 'snap',
            removeOpts: {
              up: true
            }
          });
        }
      });
      if (measure) {
        let canMeasure = false;
        let measureTo: { top?: number[]; bottom?: number[]; left?: number[]; right?: number[]; all?: number[] } = {};
        if (xSnapPoint) {
          const closestLayer = getClosestPaperLayer(snapBounds.center, xGuideLayers);
          if (closestLayer && !snapBounds.intersects(closestLayer.bounds, 1)) {
            const closestLayerBounds = [closestLayer.bounds.x, closestLayer.bounds.y, closestLayer.bounds.width, closestLayer.bounds.height];
            canMeasure = true;
            measureTo = {
              ...measureTo,
              top: closestLayerBounds,
              bottom: closestLayerBounds
            };
          }
        }
        if (ySnapPoint) {
          const closestLayer = getClosestPaperLayer(snapBounds.center, yGuideLayers);
          if (closestLayer && !snapBounds.intersects(closestLayer.bounds, 1)) {
            const closestLayerBounds = [closestLayer.bounds.x, closestLayer.bounds.y, closestLayer.bounds.width, closestLayer.bounds.height];
            canMeasure = true;
            measureTo = {
              ...measureTo,
              left: closestLayerBounds,
              right: closestLayerBounds
            };
          }
        }
        if (canMeasure) {
          dispatch(enableMeasureTool({
            bounds: [snapBounds.x, snapBounds.y, snapBounds.width, snapBounds.height],
            measureTo
          }));
        }
      }
    }
    return () => {
      if (measure) {
        dispatch(disableMeasureTool());
      }
    }
  }, [snapBounds]);

  if (snapToolDebug) {
    useEffect(() => {
      const id = 'SnapZoneTop';
      const paperLayer = paperMain.projects[0].getItem({ data: { id } });
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
      const paperLayer = paperMain.projects[0].getItem({ data: { id } });
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneMiddle) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneMiddle,
          fillColor: 'pink',
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
      const paperLayer = paperMain.projects[0].getItem({ data: { id } });
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
      const paperLayer = paperMain.projects[0].getItem({ data: { id } });
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
      const paperLayer = paperMain.projects[0].getItem({ data: { id } });
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
      const paperLayer = paperMain.projects[0].getItem({ data: { id } });
      if (paperLayer) {
        paperLayer.remove();
      }
      if (snapZoneRight) {
        new paperMain.Path.Rectangle({
          rectangle: snapZoneRight,
          fillColor: 'green',
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

  return null;
}

export default SnapTool;