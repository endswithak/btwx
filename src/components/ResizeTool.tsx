/* eslint-disable @typescript-eslint/no-use-before-define */
// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { getHoverBounds, getPaperLayer, getSelectionBounds, getSelectedById } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasActiveTool, setCanvasResizing } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasResizingPayload, SetCanvasActiveToolPayload } from '../store/actionTypes/canvasSettings';
import { scaleLayers, updateSelectionFrame } from '../store/actions/layer';
import { LayerTypes, ScaleLayersPayload } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import SnapTool from './SnapTool';

interface ResizeToolProps {
  initialHandle?: Btwx.ResizeHandle;
  hover?: string;
  selected?: string[];
  isEnabled?: boolean;
  resizing?: boolean;
  setCanvasResizing?(payload: SetCanvasResizingPayload): CanvasSettingsTypes;
  scaleLayers?(payload: ScaleLayersPayload): LayerTypes;
  setCanvasActiveTool?(payload: SetCanvasActiveToolPayload): CanvasSettingsTypes;
}

const ResizeTool = (props: ResizeToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { initialHandle, isEnabled, setCanvasResizing, resizing, selected, scaleLayers, setCanvasActiveTool } = props;

  const [tool, setTool] = useState<paper.Tool>(null);
  const [originalSelection, setOriginalSelection] = useState<any>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(false);
  const [verticalFlip, setVerticalFlip] = useState<boolean>(false);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(false);
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);

  const [fromEvent, setFromEvent] = useState<paper.ToolEvent>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [fromPivot, setFromPivot] = useState<paper.Point>(null);

  const [toEvent, setToEvent] = useState<paper.ToolEvent>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);

  const [endEvent, setEndEvent] = useState<paper.ToolEvent>(null);

  const [keyDownEvent, setKeyDownEvent] = useState<paper.KeyEvent>(null);
  const [keyUpEvent, setKeyUpEvent] = useState<paper.KeyEvent>(null);

  const resetState = () => {
    setOriginalSelection(null);
    setFromEvent(null);
    setFromBounds(null);
    setToEvent(null);
    setToBounds(null);
    setEndEvent(null);
    setKeyDownEvent(null);
    setKeyUpEvent(null);
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
    // switch(paperLayer.data.layerType) {
    //   case 'Artboard': {
    //     const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
    //     const mask = paperLayer.getItem({data: { id: 'ArtboardLayersMask' }});
    //     const maskedLayers = paperLayer.getItem({data: { id: 'ArtboardMaskedLayers' }});
    //     const layers = paperLayer.getItem({data: { id: 'ArtboardLayers' }});
    //     background.pivot = paperLayer.bounds.center;
    //     background.bounds.width = originalLayer.bounds.width;
    //     background.bounds.height = originalLayer.bounds.height;
    //     background.position.x = originalLayer.position.x;
    //     background.position.y = originalLayer.position.y;
    //     background.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
    //     mask.pivot = paperLayer.bounds.center;
    //     mask.bounds.width = originalLayer.bounds.width;
    //     mask.bounds.height = originalLayer.bounds.height;
    //     mask.position.x = originalLayer.position.x;
    //     mask.position.y = originalLayer.position.y;
    //     mask.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
    //     break;
    //   }
    //   case 'Text': {
    //     const background = paperLayer.getItem({data: { id: 'TextBackground' }});
    //     background.pivot = paperLayer.bounds.center;
    //     background.bounds.width = originalLayer.bounds.width;
    //     background.bounds.height = originalLayer.bounds.height;
    //     background.position.x = originalLayer.position.x;
    //     background.position.y = originalLayer.position.y;
    //     paperLayer.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
    //     break;
    //   }
    //   case 'Group':
    //   case 'Shape':
    //   case 'Image': {
    //     paperLayer.pivot = paperLayer.bounds.center;
    //     paperLayer.bounds.width = originalLayer.bounds.width;
    //     paperLayer.bounds.height = originalLayer.bounds.height;
    //     paperLayer.position.x = originalLayer.position.x;
    //     paperLayer.position.y = originalLayer.position.y;
    //     paperLayer.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
    //     break;
    //   }
    // }
  }

  const scaleLayer = (id: string, hor: number, ver: number): void => {
    const paperLayer = getPaperLayer(id);
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardLayersMask' }});
        background.scale(hor, ver);
        mask.scale(hor, ver);
        break;
      }
      case 'Text': {
        const background = paperLayer.getItem({data: { id: 'TextBackground' }});
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
            // if (!preserveAspectRatio) {
            //   const newShape = new paperMain.Path.Rectangle({
            //     from: paperLayer.bounds.topLeft,
            //     to: paperLayer.bounds.bottomRight,
            //     radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (layerItem as Btwx.Rounded).radius,
            //     insert: false
            //   });
            //   (paperLayer as paper.Path).pathData = newShape.pathData;
            // }
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
      const paperLayer = getPaperLayer(layer);
      clearLayerScale(paperLayer);
      setLayerPivot(layer);
      scaleLayer(layer, horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
      scaleLayer(layer, scaleX, scaleY);
    });
  }

  const setLayerPivot = (id: string): void => {
    const paperLayer = getPaperLayer(id);
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardLayersMask' }});
        background.pivot = fromPivot;
        mask.pivot = fromPivot;
        break;
      }
      case 'Text': {
        const background = paperLayer.getItem({data: { id: 'TextBackground' }});
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

  const handleKeyDown = (e: paper.KeyEvent): void => {
    setKeyDownEvent(e);
  }

  const handleKeyUp = (e: paper.KeyEvent): void => {
    setKeyUpEvent(e);
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    setFromEvent(e);
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    setToEvent(e);
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    setEndEvent(e);
  }

  useEffect(() => {
    if (fromEvent && isEnabled) {
      const selectedItems = paperMain.project.getItems({ data: { selected: true } });
      const nextFromBounds = getSelectionBounds();
      const nextOriginalSelection = selectedItems.reduce((result, current) => ({
        ...result,
        [current.data.id]: current.clone({insert: false})
      }), {} as { [id: string]: paper.Item });
      const nextFromPivot = (() => {
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
      updateSelectionFrame(initialHandle);
      selected.forEach((layer) => {
        setLayerPivot(layer);
      });
      if (fromEvent.modifiers.shift && !shiftModifier) {
        setShiftModifier(true);
      }
    }
  }, [fromEvent]);

  useEffect(() => {
    if (toEvent && isEnabled) {
      let nextHandle = handle;
      let nextHorizontalFlip = horizontalFlip;
      let nextVerticalFlip = verticalFlip;
      switch(handle) {
        case 'topLeft': {
          if (toEvent.point.x > fromPivot.x && toEvent.point.y > fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomRight';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (toEvent.point.x > fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'topRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (toEvent.point.y > fromPivot.y) {
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
          if (toEvent.point.x < fromPivot.x && toEvent.point.y > fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomLeft';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (toEvent.point.x < fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'topLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (toEvent.point.y > fromPivot.y) {
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
          if (toEvent.point.x > fromPivot.x && toEvent.point.y < fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topRight';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (toEvent.point.x > fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'bottomRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (toEvent.point.y < fromPivot.y) {
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
          if (toEvent.point.x < fromPivot.x && toEvent.point.y < fromPivot.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topLeft';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (toEvent.point.x < fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'bottomLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (toEvent.point.y < fromPivot.y) {
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
          if (toEvent.point.y > fromPivot.y) {
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, 1, -1);
            });
          }
          break;
        }
        case 'bottomCenter': {
          if (toEvent.point.y < fromPivot.y) {
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, 1, -1);
            });
          }
          break;
        }
        case 'leftCenter': {
          if (toEvent.point.x > fromPivot.x) {
            nextHorizontalFlip = !horizontalFlip;
            nextHandle = 'rightCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, 1);
            });
          }
          break;
        }
        case 'rightCenter': {
          if (toEvent.point.x < fromPivot.x) {
            nextHorizontalFlip = !horizontalFlip;
            nextHandle = 'leftCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, 1);
            });
          }
          break;
        }
      }
      const nextSnapBounds = getNextSnapBounds(toEvent, nextHandle, nextHorizontalFlip, nextVerticalFlip);
      setSnapBounds(nextSnapBounds);
      setHandle(nextHandle);
      setHorizontalFlip(nextHorizontalFlip);
      setVerticalFlip(nextVerticalFlip);
      if (!resizing) {
        setCanvasResizing({resizing: true});
      }
      if (toEvent.modifiers.shift && !shiftModifier) {
        setShiftModifier(true);
      }
      if (!toEvent.modifiers.shift && shiftModifier) {
        setShiftModifier(false);
      }
    }
  }, [toEvent]);

  useEffect(() => {
    if (endEvent && isEnabled) {
      if (selected.length > 0) {
        selected.forEach((id) => {
          const paperLayer = getPaperLayer(id);
          paperLayer.pivot = null;
        });
        scaleLayers({layers: selected, scale: { x: 1, y: 1 }, horizontalFlip, verticalFlip});
      }
      if (resizing) {
        setCanvasResizing({resizing: false});
      }
      resetState();
    }
  }, [endEvent]);

  useEffect(() => {
    if (keyDownEvent && isEnabled && resizing) {
      if (keyDownEvent.key === 'shift' && originalSelection) {
        const nextSnapBounds = getNextSnapBounds(toEvent, handle, horizontalFlip, verticalFlip, true);
        setSnapBounds(nextSnapBounds);
        setShiftModifier(true);
        return;
      }
    }
  }, [keyDownEvent]);

  useEffect(() => {
    if (keyUpEvent && isEnabled && resizing) {
      if (keyUpEvent.key === 'shift' && originalSelection) {
        const nextSnapBounds = getNextSnapBounds(toEvent, handle, horizontalFlip, verticalFlip);
        setSnapBounds(nextSnapBounds);
        setShiftModifier(false);
        return;
      }
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (toBounds && isEnabled) {
      resizeLayers();
      updateSelectionFrame(handle);
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

  useEffect(() => {
    const resizeTool = new paperMain.Tool();
    resizeTool.minDistance = 1;
    resizeTool.onKeyDown = handleKeyDown;
    resizeTool.onKeyUp = handleKeyUp;
    resizeTool.onMouseDown = handleMouseDown;
    resizeTool.onMouseDrag = handleMouseDrag;
    resizeTool.onMouseUp = handleMouseUp;
    setTool(resizeTool);
    paperMain.tool = null;
  }, []);

  return (
    isEnabled && resizing
    ? <SnapTool
        bounds={snapBounds}
        snapRule='resize'
        hitTestZones={(() => {
          const x = toEvent ? toEvent.point.x - toEvent.downPoint.x : 0;
          const y = toEvent ? toEvent.point.y - toEvent.downPoint.y : 0;
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
              if (toEvent && toEvent.modifiers.shift) {
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
              if (toEvent && toEvent.modifiers.shift) {
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
              if (toEvent && toEvent.modifiers.shift) {
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
              if (toEvent && toEvent.modifiers.shift) {
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
        })()}
        onUpdate={setToBounds}
        toolEvent={toEvent}
        preserveAspectRatio={shiftModifier}
        aspectRatio={fromBounds ? fromBounds.width / fromBounds.height : 1}
        resizeHandle={handle}
        blackListLayers={selected} />
    : null
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  isEnabled: boolean;
  resizing: boolean;
  initialHandle: Btwx.ResizeHandle;
} => {
  const { layer, canvasSettings } = state;
  const selected = layer.present.selected;
  const isEnabled = canvasSettings.activeTool === 'Resize';
  const resizing = canvasSettings.resizing;
  const initialHandle = canvasSettings.resizeHandle;
  return {
    selected,
    isEnabled,
    resizing,
    initialHandle
  };
};

export default connect(
  mapStateToProps,
  { scaleLayers, setCanvasActiveTool, setCanvasResizing }
)(ResizeTool);