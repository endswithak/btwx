/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperLayer, getSelectedBounds, getLayerDescendants, getScrollFrameBounds, getLayerBounds } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasResizing, setCanvasCursor, setCanvasActiveTool } from '../store/actions/canvasSettings';
import { setGroupScrollFrame, updateScrollFrame } from '../store/actions/layer';
import { getLayerAbsPosition } from '../store/utils/paper';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';
import { getSelectionFrameCursor } from './CanvasUIEvents';

const ScrollFrameTool = (props: PaperToolProps): ReactElement => {
  const { tool, keyDownEvent, keyUpEvent, downEvent, dragEvent, upEvent } = props;
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'ScrollFrame');
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const initialHandle = useSelector((state: RootState) => state.canvasSettings.resizeHandle as Btwx.ResizeHandle);
  const scrollFrameItem: Btwx.Group = useSelector((state: RootState) => state.layer.present.byId[state.scrollFrameTool.id] as Btwx.Group);
  const scrollFrameItemBounds: paper.Rectangle = useSelector((state: RootState) => scrollFrameItem ? getLayerBounds(state.layer.present, state.scrollFrameTool.id) : null);
  const scrollFrameArtboardItem: Btwx.Artboard = useSelector((state: RootState) => scrollFrameItem && state.layer.present.byId[scrollFrameItem.artboard] as Btwx.Artboard);
  const scrollFrameBounds: paper.Rectangle = useSelector((state: RootState) => getScrollFrameBounds(state));
  const [originalScrollFrame, setOriginalScrollFrame] = useState<any>(null);
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

  const resetState = (): void => {
    setOriginalScrollFrame(null);
    setFromBounds(null);
    setToBounds(null);
    setHorizontalFlip(false);
    setVerticalFlip(false);
    setPreserveAspectRatio(false);
    setSnapBounds(null);
    setHandle(null);
    setShiftModifier(false);
    setFromPivot(null);
    dispatch(setCanvasResizing({resizing: false}));
  }

  const clearLayerScale = (paperLayer: paper.Item): void => {
    const scrollBackground = paperLayer.getItem({ data: { id: 'scrollBackground' } }) as paper.Path.Rectangle;
    const scrollMask = paperLayer.getItem({ data: { id: 'scrollMask' } }) as paper.Path.Rectangle;
    scrollBackground.replaceWith(originalScrollFrame.background.clone());
    scrollMask.replaceWith(originalScrollFrame.mask.clone());
  }

  const clearLayerPivot = (): void => {
    const projectIndex = scrollFrameArtboardItem.projectIndex;
    const paperLayer = getPaperLayer(scrollFrameItem.id, projectIndex);
    const scrollBackground = paperLayer.getItem({ data: { id: 'scrollBackground' } }) as paper.Path.Rectangle;
    const scrollMask = paperLayer.getItem({ data: { id: 'scrollMask' } }) as paper.Path.Rectangle;
    scrollBackground.pivot = null;
    scrollMask.pivot = null;
  }

  const scaleLayer = (hor: number, ver: number): void => {
    const projectIndex = scrollFrameArtboardItem.projectIndex;
    const paperLayer = getPaperLayer(scrollFrameItem.id, projectIndex);
    const scrollBackground = paperLayer.getItem({ data: { id: 'scrollBackground' } }) as paper.Path.Rectangle;
    const scrollMask = paperLayer.getItem({ data: { id: 'scrollMask' } }) as paper.Path.Rectangle;
    scrollBackground.scale(hor, ver);
    scrollMask.scale(hor, ver);
  }

  const flipLayer = (hor: number, ver: number): void => {
    const projectIndex = scrollFrameArtboardItem.projectIndex;
    const paperLayer = getPaperLayer(scrollFrameItem.id, projectIndex);
    const scrollBackground = paperLayer.getItem({ data: { id: 'scrollBackground' } }) as paper.Path.Rectangle;
    const scrollMask = paperLayer.getItem({ data: { id: 'scrollMask' } }) as paper.Path.Rectangle;
    scrollBackground.scale(hor, ver);
    scrollMask.scale(hor, ver);
  }

  const resizeLayers = (): void => {
    const totalWidthDiff = toBounds.width / fromBounds.width;
    const totalHeightDiff = toBounds.height / fromBounds.height;
    const scaleX = isFinite(totalWidthDiff) && totalWidthDiff > 0 ? totalWidthDiff : 0.01;
    const scaleY = isFinite(totalHeightDiff) && totalHeightDiff > 0 ? totalHeightDiff : 0.01;
    const projectIndex = scrollFrameArtboardItem.projectIndex;
    const paperLayer = getPaperLayer(scrollFrameItem.id, projectIndex);
    clearLayerScale(paperLayer);
    setLayerPivot();
    flipLayer(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
    scaleLayer(scaleX, scaleY);
  }

  const setLayerPivot = (pivot = fromPivot): void => {
    const projectIndex = scrollFrameArtboardItem.projectIndex;
    const paperLayer = getPaperLayer(scrollFrameItem.id, projectIndex);
    const scrollBackground = paperLayer.getItem({ data: { id: 'scrollBackground' } }) as paper.Path.Rectangle;
    const scrollMask = paperLayer.getItem({ data: { id: 'scrollMask' } }) as paper.Path.Rectangle;
    scrollBackground.pivot = pivot;
    scrollMask.pivot = pivot;
  }

  const getNextSnapBounds = (nextToEvent: paper.ToolEvent, nextHandle: Btwx.ResizeHandle, nextHorizontalFlip: boolean, nextVerticalFlip: boolean, shiftOverride?: boolean) => {
    let nextSnapBounds;
    if (nextToEvent.modifiers.shift || shiftOverride || preserveAspectRatio) {
      const aspect = fromBounds.width / fromBounds.height;
      const fb = fromBounds;
      switch(nextHandle) {
        case 'topLeft':
          nextSnapBounds = new paperMain.Rectangle({
            top: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top) + ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.right : fromBounds.left)) / aspect) : nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.right : fromBounds.left) + ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top)) * aspect),
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right,
          });
          break;
        case 'topRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top) - ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.left : fromBounds.right)) / aspect) : nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.left : fromBounds.right) - ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top)) * aspect),
          });
          break;
        case 'bottomLeft':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom) - ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.right : fromBounds.left)) / aspect) : nextToEvent.point.y,
            left: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.right : fromBounds.left) - ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom)) * aspect),
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'bottomRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom) + ((nextToEvent.point.x - (nextVerticalFlip ? fromBounds.left : fromBounds.right)) / aspect) : nextToEvent.point.y,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: fb.width > fb.height ? nextToEvent.point.x : (nextVerticalFlip ? fromBounds.left : fromBounds.right) + ((nextToEvent.point.y - (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom)) * aspect),
          });
          break;
        case 'topCenter': {
          const distance = nextToEvent.point.y - (nextVerticalFlip ? fromBounds.bottom : fromBounds.top);
          const xDelta = distance * aspect;
          nextSnapBounds = new paperMain.Rectangle({
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
          nextSnapBounds = new paperMain.Rectangle({
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
          nextSnapBounds = new paperMain.Rectangle({
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
          nextSnapBounds = new paperMain.Rectangle({
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
          nextSnapBounds = new paperMain.Rectangle({
            top: nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextToEvent.point.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'topRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: nextToEvent.point.x
          });
          break;
        case 'bottomLeft':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: nextToEvent.point.y,
            left: nextToEvent.point.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'bottomRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: nextToEvent.point.y,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: nextToEvent.point.x
          });
          break;
        case 'topCenter':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextToEvent.point.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: fromBounds.left,
            right: fromBounds.right
          });
          break;
        case 'bottomCenter':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: nextToEvent.point.y,
            left: fromBounds.left,
            right: fromBounds.right
          });
          break;
        case 'leftCenter':
          nextSnapBounds = new paperMain.Rectangle({
            top: fromBounds.top,
            bottom: fromBounds.bottom,
            left: nextToEvent.point.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'rightCenter':
          nextSnapBounds = new paperMain.Rectangle({
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
        if (dragEvent && (dragEvent.modifiers.shift || preserveAspectRatio)) {
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
        if (dragEvent && (dragEvent.modifiers.shift || preserveAspectRatio)) {
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
        if (dragEvent && (dragEvent.modifiers.shift || preserveAspectRatio)) {
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
        if (dragEvent && (dragEvent.modifiers.shift || preserveAspectRatio)) {
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

  const getPivotHandle = (handle: Btwx.ResizeHandle) => {
    switch(handle) {
      case 'topLeft':
        return 'bottomRight';
      case 'topCenter':
        return 'bottomCenter';
      case 'topRight':
        return 'bottomLeft';
      case 'bottomLeft':
        return 'topRight';
      case 'bottomCenter':
        return 'topCenter';
      case 'bottomRight':
        return 'topLeft';
      case 'leftCenter':
        return 'rightCenter';
      case 'rightCenter':
        return 'leftCenter';
    }
  }

  useEffect(() => {
    try {
      if (downEvent && isEnabled && scrollFrameBounds && initialHandle) {
        const nextFromBounds = scrollFrameBounds;
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
        const projectIndex = scrollFrameArtboardItem.projectIndex;
        const paperLayer = getPaperLayer(scrollFrameItem.id, projectIndex);
        const scrollBackground = paperLayer.getItem({ data: { id: 'scrollBackground' } }) as paper.Path.Rectangle;
        const scrollMask = paperLayer.getItem({ data: { id: 'scrollMask' } }) as paper.Path.Rectangle;
        const scrollBackgroundClone = scrollBackground.clone({insert: false});
        const scrollMaskClone = scrollMask.clone({insert: false});
        setOriginalScrollFrame({
          background: scrollBackgroundClone,
          mask: scrollMaskClone
        });
        setFromPivot(nextFromPivot);
        setFromBounds(nextFromBounds);
        setHandle(initialHandle);
        updateScrollFrame({
          bounds: nextFromBounds,
          handle: initialHandle
        });
        if (downEvent.modifiers.shift && !shiftModifier) {
          setShiftModifier(true);
        }
      }
    } catch(err) {
      console.error(`Resize Tool Error -- On Mouse Down -- ${err}`);
      resetState();
    }
  }, [downEvent]);

  useEffect(() => {
    try {
      if (dragEvent && isEnabled && handle && fromPivot && fromBounds && selected.length > 0) {
        let nextHandle = handle;
        let nextHorizontalFlip = horizontalFlip;
        let nextVerticalFlip = verticalFlip;
        switch(handle) {
          case 'topLeft': {
            if (dragEvent.point.x > fromPivot.x && dragEvent.point.y > fromPivot.y) {
              nextHorizontalFlip = !horizontalFlip;
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'bottomRight';
              flipLayer(-1, -1);
            } else {
              if (dragEvent.point.x > fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'topRight';
                flipLayer(-1, 1);
              }
              if (dragEvent.point.y > fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'bottomLeft';
                flipLayer(1, -1);
              }
            }
            break;
          }
          case 'topRight': {
            if (dragEvent.point.x < fromPivot.x && dragEvent.point.y > fromPivot.y) {
              nextHorizontalFlip = !horizontalFlip;
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'bottomLeft';
              flipLayer(-1, -1);
            } else {
              if (dragEvent.point.x < fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'topLeft';
                flipLayer(-1, 1);
              }
              if (dragEvent.point.y > fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'bottomRight';
                flipLayer(1, -1);
              }
            }
            break;
          }
          case 'bottomLeft': {
            if (dragEvent.point.x > fromPivot.x && dragEvent.point.y < fromPivot.y) {
              nextHorizontalFlip = !horizontalFlip;
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'topRight';
              flipLayer(-1, -1);
            } else {
              if (dragEvent.point.x > fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'bottomRight';
                flipLayer(-1, 1);
              }
              if (dragEvent.point.y < fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'topLeft';
                flipLayer(1, -1);
              }
            }
            break;
          }
          case 'bottomRight': {
            if (dragEvent.point.x < fromPivot.x && dragEvent.point.y < fromPivot.y) {
              nextHorizontalFlip = !horizontalFlip;
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'topLeft';
              flipLayer(-1, -1);
            } else {
              if (dragEvent.point.x < fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'bottomLeft';
                flipLayer(-1, 1);
              }
              if (dragEvent.point.y < fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'topRight';
                flipLayer(1, -1);
              }
            }
            break;
          }
          case 'topCenter': {
            if (dragEvent.point.y > fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'bottomCenter';
              flipLayer(1, -1);
            }
            break;
          }
          case 'bottomCenter': {
            if (dragEvent.point.y < fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'topCenter';
              flipLayer(1, -1);
            }
            break;
          }
          case 'leftCenter': {
            if (dragEvent.point.x > fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'rightCenter';
              flipLayer(-1, 1);
            }
            break;
          }
          case 'rightCenter': {
            if (dragEvent.point.x < fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'leftCenter';
              flipLayer(-1, 1);
            }
            break;
          }
        }
        setSnapBounds(getNextSnapBounds(dragEvent, nextHandle, nextHorizontalFlip, nextVerticalFlip));
        setHandle(nextHandle);
        setHorizontalFlip(nextHorizontalFlip);
        setVerticalFlip(nextVerticalFlip);
        if (nextHandle !== handle) {
          dispatch(setCanvasCursor({cursor: [getSelectionFrameCursor(nextHandle)]}));
        }
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
    } catch(err) {
      console.error(`Resize Tool Error -- On Mouse Drag -- ${err}`);
      resetState();
    }
  }, [dragEvent]);

  useEffect(() => {
    try {
      if (upEvent && isEnabled && handle && fromPivot && fromBounds && toBounds && scrollFrameBounds && scrollFrameItemBounds) {
        if (scrollFrameItem) {
          const newScrollFramePosition = toBounds.topLeft.subtract(scrollFrameItemBounds.topLeft);
          clearLayerPivot();
          dispatch(
            setGroupScrollFrame({
              id: scrollFrameItem.id,
              frame: {
                x: newScrollFramePosition.x,
                y: newScrollFramePosition.y,
                width: toBounds.width,
                height: toBounds.height
              }
            })
          );
        }
        resetState();
        if (initialHandle !== handle) {
          dispatch(setCanvasActiveTool({
            activeTool: 'ScrollFrame',
            resizeHandle: handle,
            dragHandle: false,
            lineHandle: null,
            cursor: [getSelectionFrameCursor(handle)]
          }));
        }
      } else {
        if (fromPivot) {
          clearLayerPivot();
          if (selected.length > 0) {
            updateScrollFrame({
              bounds: fromBounds
            });
          }
          resetState();
        }
      }
    } catch(err) {
      console.error(`Scroll Frame Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    try {
      if (keyDownEvent && isEnabled && resizing) {
        if (keyDownEvent.key === 'shift' && originalScrollFrame) {
          const nextSnapBounds = getNextSnapBounds(dragEvent, handle, horizontalFlip, verticalFlip, true);
          setSnapBounds(nextSnapBounds);
          setShiftModifier(true);
        }
      }
    } catch(err) {
      console.error(`Scroll Frame Tool Error -- On Key Down -- ${err}`);
      resetState();
    }
  }, [keyDownEvent]);

  useEffect(() => {
    try {
      if (keyUpEvent && isEnabled && resizing) {
        if (keyUpEvent.key === 'shift' && originalScrollFrame) {
          const nextSnapBounds = getNextSnapBounds(dragEvent, handle, horizontalFlip, verticalFlip);
          setSnapBounds(nextSnapBounds);
          setShiftModifier(false);
        }
      }
    } catch(err) {
      console.error(`Scroll Frame Tool Error -- On Key Up -- ${err}`);
      resetState();
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (toBounds && isEnabled && dragEvent) {
      resizeLayers();
      updateScrollFrame({
        bounds: toBounds,
        handle
      });
    }
  }, [toBounds]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && paperMain.tool && (paperMain.tool as any)._index === (tool as any)._index) {
        paperMain.tool = null;
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
        preserveAspectRatio={shiftModifier || preserveAspectRatio}
        aspectRatio={fromBounds ? fromBounds.width / fromBounds.height : 1}
        resizeHandle={handle}
        // measure
        />
    : null
  );
}

export default PaperTool(
  ScrollFrameTool,
  { all: true }
);