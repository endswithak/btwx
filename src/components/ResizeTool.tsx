/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperLayer, getSelectedProjectIndices, getSelectedById, getSelectedBounds } from '../store/selectors/layer';
import { uiPaperScope } from '../canvas';
import { setCanvasResizing } from '../store/actions/canvasSettings';
import { scaleLayers, updateSelectionFrame } from '../store/actions/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

const ResizeTool = (props: PaperToolProps): ReactElement => {
  const { tool, keyDownEvent, keyUpEvent, downEvent, dragEvent, upEvent } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Resize');
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const initialHandle = useSelector((state: RootState) => state.canvasSettings.resizeHandle as Btwx.ResizeHandle);
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const selectedBounds = useSelector((state: RootState) => getSelectedBounds(state));
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const [originalSelection, setOriginalSelection] = useState<any>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(false);
  const [verticalFlip, setVerticalFlip] = useState<boolean>(false);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(false);
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [fromPivot, setFromPivot] = useState<paper.Point>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const dispatch = useDispatch();

  const resetState = () => {
    setOriginalSelection(null);
    setFromBounds(null);
    setToBounds(null);
    setHorizontalFlip(false);
    setVerticalFlip(false);
    setPreserveAspectRatio(false);
    setSnapBounds(null);
    setHandle(null);
    setShiftModifier(false);
  }

  const clearLayerScale = (paperLayer: paper.Item): void => {
    const originalLayer = originalSelection[paperLayer.data.id];
    paperLayer.replaceWith(originalLayer.clone());
  }

  const scaleLayer = (id: string, hor: number, ver: number): void => {
    const paperLayer = getPaperLayer(id, selectedProjectIndices[id]);
    const layerItem = selectedById[id];
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
        background.scale(hor, ver);
        mask.scale(hor, ver);
        break;
      }
      case 'Text': {
        const background = paperLayer.getItem({data: { id: 'textBackground' }});
        background.scale(hor, ver);
        break;
      }
      case 'Shape': {
        switch(paperLayer.data.shapeType) {
          case 'Ellipse':
          case 'Polygon':
          case 'Rectangle':
          case 'Star':
          case 'Line':
          case 'Custom':
            paperLayer.scale(hor, ver);
            break;
          case 'Rounded': {
            paperLayer.scale(hor, ver);
            if (!preserveAspectRatio) {
              const newShape = new uiPaperScope.Path.Rectangle({
                from: paperLayer.bounds.topLeft,
                to: paperLayer.bounds.bottomRight,
                radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (layerItem as Btwx.Rounded).radius,
                insert: false
              });
              (paperLayer as paper.Path).pathData = newShape.pathData;
            }
            break;
          }
        }
        break;
      }
      case 'Group':
      case 'Image': {
        paperLayer.scale(hor, ver);
        break;
      }
    }
  }

  const resizeLayers = (): void => {
    const totalWidthDiff = toBounds.width / fromBounds.width;
    const totalHeightDiff = toBounds.height / fromBounds.height;
    const scaleX = isFinite(totalWidthDiff) && totalWidthDiff > 0 ? totalWidthDiff : 0.01;
    const scaleY = isFinite(totalHeightDiff) && totalHeightDiff > 0 ? totalHeightDiff : 0.01;
    selected.forEach((layer: string) => {
      const paperLayer = getPaperLayer(layer, selectedProjectIndices[layer]);
      clearLayerScale(paperLayer);
      setLayerPivot(layer);
      scaleLayer(layer, horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
      scaleLayer(layer, scaleX, scaleY);
    });
  }

  const setLayerPivot = (id: string): void => {
    const paperLayer = getPaperLayer(id, selectedProjectIndices[id]);
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
        background.pivot = fromPivot;
        mask.pivot = fromPivot;
        break;
      }
      case 'Text': {
        const background = paperLayer.getItem({data: { id: 'textBackground' }});
        background.pivot = fromPivot;
        break;
      }
      case 'Group':
      case 'Shape':
      case 'Image': {
        paperLayer.pivot = fromPivot;
        break;
      }
    }
  }

  const getNextSnapBounds = (nextToEvent: paper.ToolEvent, nextHandle: Btwx.ResizeHandle, nextHorizontalFlip: boolean, nextVerticalFlip: boolean, shiftOverride?: boolean) => {
    let nextSnapBounds;
    if (nextToEvent.modifiers.shift || shiftOverride) {
      const aspect = fromBounds.width / fromBounds.height;
      const fb = fromBounds;
      switch(nextHandle) {
        case 'topLeft':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top) + ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.right : fromBounds.left)) / aspect) : nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.right : fromBounds.left) + ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top)) * aspect),
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right,
          });
          break;
        case 'topRight':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top) - ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.left : fromBounds.right)) / aspect) : nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.left : fromBounds.right) - ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top)) * aspect),
          });
          break;
        case 'bottomLeft':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom) - ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.right : fromBounds.left)) / aspect) : nextToEvent.point.y,
            left: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.right : fromBounds.left) - ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom)) * aspect),
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'bottomRight':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom) + ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.left : fromBounds.right)) / aspect) : nextToEvent.point.y,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.left : fromBounds.right) + ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom)) * aspect),
          });
          break;
        case 'topCenter': {
          const distance = nextToEvent.point.y - (nextVerticalFlip ? fromBounds.bottom : fromBounds.top);
          const xDelta = distance * aspect;
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextVerticalFlip ? fromBounds.right + (xDelta / 2) : fromBounds.left + (xDelta / 2),
            right: nextVerticalFlip ? fromBounds.left - (xDelta / 2) : fromBounds.right - (xDelta / 2)
          });
          break;
        }
        case 'bottomCenter': {
          const distance = nextToEvent.point.y - (nextVerticalFlip ? fromBounds.top : fromBounds.bottom);
          const xDelta = distance * aspect;
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: nextToEvent.point.y,
            left: nextVerticalFlip ? fromBounds.right - (xDelta / 2) : fromBounds.left - (xDelta / 2),
            right: nextVerticalFlip ? fromBounds.left + (xDelta / 2) : fromBounds.right + (xDelta / 2)
          });
          break;
        }
        case 'leftCenter': {
          const distance = nextToEvent.point.x - (nextHorizontalFlip ? fromBounds.right : fromBounds.left);
          const yDelta = distance / aspect;
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextHorizontalFlip ? fromBounds.bottom + (yDelta / 2) : fromBounds.top + (yDelta / 2),
            bottom: nextHorizontalFlip ? fromBounds.top - (yDelta / 2) : fromBounds.bottom - (yDelta / 2),
            left: nextToEvent.point.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        }
        case 'rightCenter': {
          const distance = nextToEvent.point.x - (nextHorizontalFlip ? fromBounds.left : fromBounds.right);
          const yDelta = distance / aspect;
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextHorizontalFlip ? fromBounds.bottom - (yDelta / 2) : fromBounds.top - (yDelta / 2),
            bottom: nextHorizontalFlip ? fromBounds.top + (yDelta / 2) : fromBounds.bottom + (yDelta / 2),
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: nextToEvent.point.x
          });
          break;
        }
      }
    } else {
      switch(nextHandle) {
        case 'topLeft':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextToEvent.point.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'topRight':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: nextToEvent.point.x
          });
          break;
        case 'bottomLeft':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: nextToEvent.point.y,
            left: nextToEvent.point.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'bottomRight':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: nextToEvent.point.y,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: nextToEvent.point.x
          });
          break;
        case 'topCenter':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: fromBounds.left,
            right: fromBounds.right
          });
          break;
        case 'bottomCenter':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: nextToEvent.point.y,
            left: fromBounds.left,
            right: fromBounds.right
          });
          break;
        case 'leftCenter':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: fromBounds.top,
            bottom: fromBounds.bottom,
            left: nextToEvent.point.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'rightCenter':
          nextSnapBounds = new uiPaperScope.Rectangle({
            top: fromBounds.top,
            bottom: fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: nextToEvent.point.x
          });
          break;
        default:
          break;
      }
    }
    return nextSnapBounds;
  }

  const getSnapToolHitTestZones = () => {
    const x = dragEvent ? dragEvent.point.x - dragEvent.downPoint.x : 0;
    const y = dragEvent ? dragEvent.point.y - dragEvent.downPoint.y : 0;
    switch(handle) {
      case 'topCenter':
        return { top: true };
      case 'bottomCenter':
        return { bottom: true };
      case 'leftCenter':
        return { left: true };
      case 'rightCenter':
        return { right: true };
      case 'topLeft':
        if (dragEvent && dragEvent.modifiers.shift) {
          if (snapBounds.width > snapBounds.height) {
            return { left: true };
          } else if (snapBounds.width < snapBounds.height) {
            return { top: true };
          } else {
            if (Math.abs(x) > Math.abs(y)) {
              return { left: true };
            } else if (Math.abs(x) < Math.abs(y)) {
              return { top: true };
            } else {
              return { top: true, left: true };
            }
          }
        } else {
          return { top: true, left: true };
        }
      case 'topRight':
        if (dragEvent && dragEvent.modifiers.shift) {
          if (snapBounds.width > snapBounds.height) {
            return { right: true };
          } else if (snapBounds.width < snapBounds.height) {
            return { top: true };
          } else {
            if (Math.abs(x) > Math.abs(y)) {
              return { right: true };
            } else if (Math.abs(x) < Math.abs(y)) {
              return { top: true };
            } else {
              return { top: true, right: true };
            }
          }
        } else {
          return { top: true, right: true };
        }
      case 'bottomLeft':
        if (dragEvent && dragEvent.modifiers.shift) {
          if (snapBounds.width > snapBounds.height) {
            return { left: true };
          } else if (snapBounds.width < snapBounds.height) {
            return { bottom: true };
          } else {
            if (Math.abs(x) > Math.abs(y)) {
              return { left: true };
            } else if (Math.abs(x) < Math.abs(y)) {
              return { bottom: true };
            } else {
              return { bottom: true, left: true };
            }
          }
        } else {
          return { bottom: true, left: true };
        }
      case 'bottomRight':
        if (dragEvent && dragEvent.modifiers.shift) {
          if (snapBounds.width > snapBounds.height) {
            return { right: true };
          } else if (snapBounds.width < snapBounds.height) {
            return { bottom: true };
          } else {
            if (Math.abs(x) > Math.abs(y)) {
              return { right: true };
            } else if (Math.abs(x) < Math.abs(y)) {
              return { bottom: true };
            } else {
              return { bottom: true, right: true };
            }
          }
        } else {
          return { bottom: true, right: true };
        }
    }
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    if (downEvent && isEnabled) {
      const nextFromBounds = selectedBounds;
      const nextOriginalSelection = selected.reduce((result, current) => ({
        ...result,
        [current]: getPaperLayer(current, selectedProjectIndices[current]).clone({insert: false})
      }), {} as { [id: string]: paper.Item });
      const nextFromPivot = ((): paper.Point => {
        switch(initialHandle) {
          case 'topLeft':
            return nextFromBounds.bottomRight;
          case 'topCenter':
            return nextFromBounds.bottomCenter;
          case 'topRight':
            return nextFromBounds.bottomLeft;
          case 'bottomLeft':
            return nextFromBounds.topRight;
          case 'bottomCenter':
            return nextFromBounds.topCenter;
          case 'bottomRight':
            return nextFromBounds.topLeft;
          case 'leftCenter':
            return nextFromBounds.rightCenter;
          case 'rightCenter':
            return nextFromBounds.leftCenter;
        }
      })();
      setFromPivot(nextFromPivot);
      setFromBounds(nextFromBounds);
      setOriginalSelection(nextOriginalSelection);
      setHandle(initialHandle);
      updateSelectionFrame(nextFromBounds, initialHandle);
      selected.forEach((layer) => {
        setLayerPivot(layer);
      });
      if (downEvent.modifiers.shift && !shiftModifier) {
        setShiftModifier(true);
      }
    }
  }, [downEvent]);

  useEffect(() => {
    if (dragEvent && isEnabled && handle && fromPivot && fromBounds) {
      let nextHandle = handle;
      let nextHorizontalFlip = horizontalFlip;
      let nextVerticalFlip = verticalFlip;
      switch(handle) {
        case 'topLeft': {
          if (dragEvent.point.x > fromPivot.x && dragEvent.point.y > fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomRight';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (dragEvent.point.x > fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'topRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (dragEvent.point.y > fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'bottomLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, 1, -1);
              });
            }
          }
          break;
        }
        case 'topRight': {
          if (dragEvent.point.x < fromPivot.x && dragEvent.point.y > fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomLeft';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (dragEvent.point.x < fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'topLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (dragEvent.point.y > fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'bottomRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, 1, -1);
              });
            }
          }
          break;
        }
        case 'bottomLeft': {
          if (dragEvent.point.x > fromPivot.x && dragEvent.point.y < fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topRight';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (dragEvent.point.x > fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'bottomRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (dragEvent.point.y < fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'topLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, 1, -1);
              });
            }
          }
          break;
        }
        case 'bottomRight': {
          if (dragEvent.point.x < fromPivot.x && dragEvent.point.y < fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topLeft';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (dragEvent.point.x < fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'bottomLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (dragEvent.point.y < fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'topRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, 1, -1);
              });
            }
          }
          break;
        }
        case 'topCenter': {
          if (dragEvent.point.y > fromPivot.y) {
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, 1, -1);
            });
          }
          break;
        }
        case 'bottomCenter': {
          if (dragEvent.point.y < fromPivot.y) {
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, 1, -1);
            });
          }
          break;
        }
        case 'leftCenter': {
          if (dragEvent.point.x > fromPivot.x) {
            nextHorizontalFlip = !horizontalFlip;
            nextHandle = 'rightCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, 1);
            });
          }
          break;
        }
        case 'rightCenter': {
          if (dragEvent.point.x < fromPivot.x) {
            nextHorizontalFlip = !horizontalFlip;
            nextHandle = 'leftCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, 1);
            });
          }
          break;
        }
      }
      const nextSnapBounds = getNextSnapBounds(dragEvent, nextHandle, nextHorizontalFlip, nextVerticalFlip);
      setSnapBounds(nextSnapBounds);
      setHandle(nextHandle);
      setHorizontalFlip(nextHorizontalFlip);
      setVerticalFlip(nextVerticalFlip);
      if (!resizing) {
        dispatch(setCanvasResizing({resizing: true}));
      }
      if (dragEvent.modifiers.shift && !shiftModifier) {
        setShiftModifier(true);
      }
      if (!dragEvent.modifiers.shift && shiftModifier) {
        setShiftModifier(false);
      }
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled) {
      if (selected.length > 0) {
        selected.forEach((id) => {
          const paperLayer = getPaperLayer(id, selectedProjectIndices[id]);
          paperLayer.pivot = null;
        });
        dispatch(
          scaleLayers({
            layers: selected,
            scale: { x: 1, y: 1 },
            horizontalFlip,
            verticalFlip
          })
        );
      }
      if (resizing) {
        dispatch(setCanvasResizing({resizing: false}));
      }
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    if (keyDownEvent && isEnabled && resizing) {
      if (keyDownEvent.key === 'shift' && originalSelection) {
        const nextSnapBounds = getNextSnapBounds(dragEvent, handle, horizontalFlip, verticalFlip, true);
        setSnapBounds(nextSnapBounds);
        setShiftModifier(true);
      }
    }
  }, [keyDownEvent]);

  useEffect(() => {
    if (keyUpEvent && isEnabled && resizing) {
      if (keyUpEvent.key === 'shift' && originalSelection) {
        const nextSnapBounds = getNextSnapBounds(dragEvent, handle, horizontalFlip, verticalFlip);
        setSnapBounds(nextSnapBounds);
        setShiftModifier(false);
      }
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (toBounds && isEnabled) {
      resizeLayers();
      updateSelectionFrame(toBounds, handle);
    }
  }, [toBounds]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && uiPaperScope.tool && (uiPaperScope.tool as any)._index === (tool as any)._index) {
        uiPaperScope.tool = null;
        resetState();
      }
    }
  }, [isEnabled]);

  return (
    isEnabled && resizing
    ? <SnapTool
        bounds={snapBounds}
        snapRule='resize'
        hitTestZones={getSnapToolHitTestZones()}
        onUpdate={handleSnapToolUpdate}
        toolEvent={dragEvent}
        preserveAspectRatio={shiftModifier}
        aspectRatio={fromBounds ? fromBounds.width / fromBounds.height : 1}
        resizeHandle={handle}
        blackListLayers={selected}
        measure />
    : null
  );
}

export default PaperTool(
  ResizeTool,
  { all: true }
);