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
  const [from, setFrom] = useState<paper.Point>(null);
  const [to, setTo] = useState<paper.Point>(null);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [toolEvent, setToolEvent] = useState(null);
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(false);
  const [verticalFlip, setVerticalFlip] = useState<boolean>(false);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(false);
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);


  const resetState = () => {
    setOriginalSelection(null);
    setFrom(null);
    setTo(null);
    setFromBounds(null);
    setToBounds(null);
    setToolEvent(null);
    setHorizontalFlip(false);
    setVerticalFlip(false);
    setPreserveAspectRatio(false);
    setShiftModifier(false);
    setSnapBounds(null);
  }

  const clearLayerScale = (paperLayer: paper.Item): void => {
    const originalLayer = originalSelection[paperLayer.data.id];
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
        background.pivot = paperLayer.bounds.center;
        background.bounds.width = originalLayer.bounds.width;
        background.bounds.height = originalLayer.bounds.height;
        background.position.x = originalLayer.position.x;
        background.position.y = originalLayer.position.y;
        background.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
        mask.pivot = paperLayer.bounds.center;
        mask.bounds.width = originalLayer.bounds.width;
        mask.bounds.height = originalLayer.bounds.height;
        mask.position.x = originalLayer.position.x;
        mask.position.y = originalLayer.positione.y;
        mask.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
        break;
      }
      case 'Text': {
        const background = paperLayer.getItem({data: { id: 'TextBackground' }});
        background.pivot = paperLayer.bounds.center;
        background.bounds.width = originalLayer.bounds.width;
        background.bounds.height = originalLayer.bounds.height;
        background.position.x = originalLayer.position.x;
        background.position.y = originalLayer.position.y;
        paperLayer.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
        break;
      }
      case 'Group':
      case 'Shape':
      case 'Image': {
        paperLayer.pivot = paperLayer.bounds.center;
        paperLayer.bounds.width = originalLayer.bounds.width;
        paperLayer.bounds.height = originalLayer.bounds.height;
        paperLayer.position.x = originalLayer.position.x;
        paperLayer.position.y = originalLayer.position.y;
        paperLayer.scale(horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
        break;
      }
    }
  }

  const scaleLayer = (id: string, hor: number, ver: number): void => {
    const paperLayer = getPaperLayer(id);
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
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

  // const resizeLayers = (): void => {
  //   switch(handle) {
  //     case 'topLeft':
  //     case 'topRight':
  //     case 'bottomLeft':
  //     case 'bottomRight': {
  //       const fb = fromBounds;
  //       const maxDim = fb.width > fb.height ? scaleX : scaleY;
  //       selected.forEach((layer: string) => {
  //         const paperLayer = getPaperLayer(layer);
  //         clearLayerScale(paperLayer);
  //         setLayerPivot(layer);
  //         scaleLayer(layer, horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
  //         if (shiftModifier || preserveAspectRatio) {
  //           scaleLayer(layer, maxDim, maxDim);
  //         } else {
  //           scaleLayer(layer, scaleX, scaleY);
  //         }
  //       });
  //       break;
  //     }
  //     case 'topCenter':
  //     case 'bottomCenter': {
  //       selected.forEach((layer: string) => {
  //         const paperLayer = getPaperLayer(layer);
  //         clearLayerScale(paperLayer);
  //         setLayerPivot(layer);
  //         scaleLayer(layer, horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
  //         scaleLayer(layer, shiftModifier || preserveAspectRatio ? scaleY : 1, scaleY);
  //       });
  //       break;
  //     }
  //     case 'leftCenter':
  //     case 'rightCenter': {
  //       selected.forEach((layer: string) => {
  //         const paperLayer = getPaperLayer(layer);
  //         clearLayerScale(paperLayer);
  //         setLayerPivot(layer);
  //         scaleLayer(layer, horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
  //         scaleLayer(layer, scaleX, shiftModifier || preserveAspectRatio ? scaleX : 1);
  //       });
  //       break;
  //     }
  //   }
  // }

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
        const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
        background.pivot = from;
        mask.pivot = from;
        break;
      }
      case 'Text': {
        const background = paperLayer.getItem({data: { id: 'TextBackground' }});
        background.pivot = from;
        break;
      }
      case 'Group':
      case 'Shape':
      case 'Image': {
        paperLayer.pivot = from;
        break;
      }
    }
  }

  const getNextSnapBounds = (nextHandle: Btwx.ResizeHandle, nextHorizontalFlip: boolean, nextVerticalFlip: boolean) => {
    let nextSnapBounds;
    if (shiftModifier) {
      const aspect = fromBounds.width / fromBounds.height;
      const fb = fromBounds;
      switch(nextHandle) {
        case 'topLeft':
          nextSnapBounds = new paperMain.Rectangle({
            top: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top) + ((to.x - (nextVerticalFlip ? fromBounds.right : fromBounds.left)) / aspect) : to.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: fb.width > fb.height ? to.x : (nextVerticalFlip ? fromBounds.right : fromBounds.left) + ((to.y - (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top)) * aspect),
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right,
          });
          break;
        case 'topRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top) - ((to.x - (nextVerticalFlip ? fromBounds.left : fromBounds.right)) / aspect) : to.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: fb.width > fb.height ? to.x : (nextVerticalFlip ? fromBounds.left : fromBounds.right) - ((to.y - (nextHorizontalFlip ? fromBounds.bottom : fromBounds.top)) * aspect),
          });
          break;
        case 'bottomLeft':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom) - ((to.x - (nextVerticalFlip ? fromBounds.right : fromBounds.left)) / aspect) : to.y,
            left: fb.width > fb.height ? to.x : (nextVerticalFlip ? fromBounds.right : fromBounds.left) - ((to.y - (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom)) * aspect),
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'bottomRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: fb.width > fb.height ? (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom) + ((to.x - (nextVerticalFlip ? fromBounds.left : fromBounds.right)) / aspect) : to.y,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: fb.width > fb.height ? to.x : (nextVerticalFlip ? fromBounds.left : fromBounds.right) + ((to.y - (nextHorizontalFlip ? fromBounds.top : fromBounds.bottom)) * aspect),
          });
          break;
        case 'topCenter': {
          const distance = to.y - (nextVerticalFlip ? fromBounds.bottom : fromBounds.top);
          const xDelta = distance * aspect;
          nextSnapBounds = new paperMain.Rectangle({
            top: to.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextVerticalFlip ? fromBounds.right + (xDelta / 2) : fromBounds.left + (xDelta / 2),
            right: nextVerticalFlip ? fromBounds.left - (xDelta / 2) : fromBounds.right - (xDelta / 2)
          });
          break;
        }
        case 'bottomCenter': {
          const distance = to.y - (nextVerticalFlip ? fromBounds.top : fromBounds.bottom);
          const xDelta = distance * aspect;
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: to.y,
            left: nextVerticalFlip ? fromBounds.right - (xDelta / 2) : fromBounds.left - (xDelta / 2),
            right: nextVerticalFlip ? fromBounds.left + (xDelta / 2) : fromBounds.right + (xDelta / 2)
          });
          break;
        }
        case 'leftCenter': {
          const distance = to.x - (nextHorizontalFlip ? fromBounds.right : fromBounds.left);
          const yDelta = distance / aspect;
          nextSnapBounds = new paperMain.Rectangle({
            top: nextHorizontalFlip ? fromBounds.bottom + (yDelta / 2) : fromBounds.top + (yDelta / 2),
            bottom: nextHorizontalFlip ? fromBounds.top - (yDelta / 2) : fromBounds.bottom - (yDelta / 2),
            left: to.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        }
        case 'rightCenter': {
          const distance = to.x - (nextHorizontalFlip ? fromBounds.left : fromBounds.right);
          const yDelta = distance / aspect;
          nextSnapBounds = new paperMain.Rectangle({
            top: nextHorizontalFlip ? fromBounds.bottom - (yDelta / 2) : fromBounds.top - (yDelta / 2),
            bottom: nextHorizontalFlip ? fromBounds.top + (yDelta / 2) : fromBounds.bottom + (yDelta / 2),
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: to.x
          });
          break;
        }
      }
    } else {
      switch(nextHandle) {
        case 'topLeft':
          nextSnapBounds = new paperMain.Rectangle({
            top: to.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: to.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'topRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: to.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: to.x
          });
          break;
        case 'bottomLeft':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: to.y,
            left: to.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'bottomRight':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: to.y,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: to.x
          });
          break;
        case 'topCenter':
          nextSnapBounds = new paperMain.Rectangle({
            top: to.y,
            bottom: nextVerticalFlip ? fromBounds.top : fromBounds.bottom,
            left: fromBounds.left,
            right: fromBounds.right
          });
          break;
        case 'bottomCenter':
          nextSnapBounds = new paperMain.Rectangle({
            top: nextVerticalFlip ? fromBounds.bottom : fromBounds.top,
            bottom: to.y,
            left: fromBounds.left,
            right: fromBounds.right
          });
          break;
        case 'leftCenter':
          nextSnapBounds = new paperMain.Rectangle({
            top: fromBounds.top,
            bottom: fromBounds.bottom,
            left: to.x,
            right: nextHorizontalFlip ? fromBounds.left : fromBounds.right
          });
          break;
        case 'rightCenter':
          nextSnapBounds = new paperMain.Rectangle({
            top: fromBounds.top,
            bottom: fromBounds.bottom,
            left: nextHorizontalFlip ? fromBounds.right : fromBounds.left,
            right: to.x
          });
          break;
        default:
          break;
      }
    }
    return nextSnapBounds;
  }

  const handleKeyDown = (e: paper.KeyEvent) => {
    switch(e.key) {
      case 'shift':
        setShiftModifier(true);
        break;
    }
  }

  const handleKeyUp = (e: paper.KeyEvent) => {
    switch(e.key) {
      case 'shift':
        setShiftModifier(false);
        break;
    }
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    const selectedItems = paperMain.project.getItems({ data: { selected: true } });
    const nextFromBounds = getSelectionBounds();
    const nextOriginalSelection = selectedItems.reduce((result, current) => ({
      ...result,
      [current.data.id]: current.clone({insert: false})
    }), {} as { [id: string]: paper.Item });
    const nextFrom = (() => {
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
    setFrom(nextFrom);
    setFromBounds(nextFromBounds);
    setOriginalSelection(nextOriginalSelection);
    setCanvasResizing({resizing: true});
    setHandle(initialHandle);
    updateSelectionFrame(initialHandle);
    selected.forEach((layer) => {
      setLayerPivot(layer);
    });
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    if (from && originalSelection && selected.length > 0) {
      setToolEvent(e);
      setTo(e.point);
    }
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
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

  useEffect(() => {
    if (tool) {
      tool.onKeyDown = handleKeyDown;
      tool.onKeyUp = handleKeyUp;
      tool.onMouseDown = handleMouseDown;
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
    }
  }, [snapBounds, selected, fromBounds, originalSelection, resizing, isEnabled, initialHandle]);

  useEffect(() => {
    if (to && tool && isEnabled && resizing) {
      let nextHandle = handle;
      let nextHorizontalFlip = horizontalFlip;
      let nextVerticalFlip = verticalFlip;
      switch(handle) {
        case 'topLeft': {
          if (to.x > from.x && to.y > from.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomRight';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (to.x > from.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'topRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (to.y > from.y) {
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
          if (to.x < from.x && to.y > from.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomLeft';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (to.x < from.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'topLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (to.y > from.y) {
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
          if (to.x > from.x && to.y < from.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topRight';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (to.x > from.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'bottomRight';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (to.y < from.y) {
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
          if (to.x < from.x && to.y < from.y) {
            nextHorizontalFlip = !horizontalFlip;
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topLeft';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, -1);
            });
          } else {
            if (to.x < from.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'bottomLeft';
              selected.forEach((layer: string) => {
                scaleLayer(layer, -1, 1);
              });
            }
            if (to.y < from.y) {
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
          if (to.y > from.y) {
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'bottomCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, 1, -1);
            });
          }
          break;
        }
        case 'bottomCenter': {
          if (to.y < from.y) {
            nextVerticalFlip = !verticalFlip;
            nextHandle = 'topCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, 1, -1);
            });
          }
          break;
        }
        case 'leftCenter': {
          if (to.x > from.x) {
            nextHorizontalFlip = !horizontalFlip;
            nextHandle = 'rightCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, 1);
            });
          }
          break;
        }
        case 'rightCenter': {
          if (to.x < from.x) {
            nextHorizontalFlip = !horizontalFlip;
            nextHandle = 'leftCenter';
            selected.forEach((layer: string) => {
              scaleLayer(layer, -1, 1);
            });
          }
          break;
        }
      }
      const nextSnapBounds = getNextSnapBounds(nextHandle, nextHorizontalFlip, nextVerticalFlip);
      setSnapBounds(nextSnapBounds);
      setHandle(nextHandle);
      setHorizontalFlip(nextHorizontalFlip);
      setVerticalFlip(nextVerticalFlip);
    }
  }, [to]);

  useEffect(() => {
    if (tool && isEnabled && resizing) {
      resizeLayers();
      updateSelectionFrame(handle);
    }
  }, [toBounds]);

  useEffect(() => {
    if (tool && isEnabled && resizing) {
      const nextSnapBounds = getNextSnapBounds(handle, horizontalFlip, verticalFlip);
      setToBounds(nextSnapBounds);
      setSnapBounds(nextSnapBounds);
    }
  }, [shiftModifier]);

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
          const x = to && from ? to.x - from.x : 0;
          const y = to && from ? to.y - from.y : 0;
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
              // return { top: true, left: true };
              if (shiftModifier) {
                if (fromBounds.width > fromBounds.height) {
                  return { left: true };
                } else if (fromBounds.width < fromBounds.height) {
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
              // return { top: true, right: true };
              if (shiftModifier) {
                if (fromBounds.width > fromBounds.height) {
                  return { right: true };
                } else if (fromBounds.width < fromBounds.height) {
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
              // return { bottom: true, left: true };
              if (shiftModifier) {
                if (fromBounds.width > fromBounds.height) {
                  return { left: true };
                } else if (fromBounds.width < fromBounds.height) {
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
              // return { bottom: true, right: true };
              if (shiftModifier) {
                if (fromBounds.width > fromBounds.height) {
                  return { right: true };
                } else if (fromBounds.width < fromBounds.height) {
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
        toolEvent={toolEvent}
        preserveAspectRatio={shiftModifier}
        aspectRatio={fromBounds ? fromBounds.width / fromBounds.height : 1}
        resizeHandle={handle}
        resizePivot={(() => {
          switch(handle) {
            case 'topCenter':
              return 'bottomCenter';
            case 'bottomCenter':
              return 'topCenter';
            case 'leftCenter':
              return 'rightCenter';
            case 'rightCenter':
              return 'leftCenter';
            case 'topLeft':
              return 'bottomRight';
            case 'bottomRight':
              return 'topLeft';
            case 'topRight':
              return 'bottomLeft';
            case 'bottomLeft':
              return 'topRight';
          }
        })()}
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