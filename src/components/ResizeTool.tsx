/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState, useCallback } from 'react';
import throttle from 'lodash.throttle';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getPaperLayer, getSelectedBounds, getSelectedInnerBounds, getLayerDescendants, getSelectedRotation } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { setCanvasResizing, setCanvasCursor, setCanvasActiveTool } from '../store/actions/canvasSettings';
import { scaleLayersThunk, updateSelectionFrame } from '../store/actions/layer';
import { positionTextContent } from '../store/utils/paper';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';
import { getContent, getParagraphs } from './CanvasTextLayer';
import { getSelectionFrameCursor } from './CanvasUIEvents';

const ResizeTool = (props: PaperToolProps): ReactElement => {
  const { tool, keyDownEvent, keyUpEvent, downEvent, dragEvent, upEvent } = props;
  // const selectedRotation = useSelector((state: RootState) => getSelectedRotation(state));
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const isEnabled = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Resize');
  const resizing = useSelector((state: RootState) => state.canvasSettings.resizing);
  const initialHandle = useSelector((state: RootState) => state.canvasSettings.resizeHandle as Btwx.ResizeHandle);
  const layersById = useSelector((state: RootState) => state.layer.present.byId);
  const selectedBounds = useSelector((state: RootState) => getSelectedBounds(state));
  // const selectedInnerBounds = useSelector((state: RootState) => getSelectedInnerBounds(state));
  const [originalSelection, setOriginalSelection] = useState<any>(null);
  const [selectedAndChildren, setSelectedAndChildren] = useState<any>(null);
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(false);
  const [verticalFlip, setVerticalFlip] = useState<boolean>(false);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(false);
  const [handle, setHandle] = useState<Btwx.ResizeHandle>(null);
  // const [pivotHandle, setPivotHandle] = useState<Btwx.ResizeHandle>(null);
  const [shiftModifier, setShiftModifier] = useState<boolean>(false);
  const [fromBounds, setFromBounds] = useState<paper.Rectangle>(null);
  const [fromPivot, setFromPivot] = useState<paper.Point>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);
  const dispatch = useDispatch();

  const resizeTextContent = useCallback(throttle((bounds: paper.Rectangle, layerItem: Btwx.Text, paperLayer: paper.Group, handle: Btwx.ResizeHandle) => {
    const textContent = paperLayer.getItem({data: { id: 'textContent' }}) as paper.PointText;
    const textMask = paperLayer.getItem({data: { id: 'textMask' }});
    let textResize: Btwx.TextResize = 'fixed';
    if ((handle === 'leftCenter' || handle === 'rightCenter') && layerItem.textStyle.textResize !== 'fixed') {
      textResize = 'autoHeight';
      textMask.clipMask = false;
      textMask.visible = false;
    } else {
      textMask.clipMask = true;
      textMask.visible = true;
    }
    const paragraphs = getParagraphs({
      text: layerItem.text,
      fontSize: layerItem.textStyle.fontSize,
      fontWeight: layerItem.textStyle.fontWeight,
      fontFamily: layerItem.textStyle.fontFamily,
      textResize: textResize,
      innerWidth: bounds.width,
      letterSpacing: layerItem.textStyle.letterSpacing,
      textTransform: layerItem.textStyle.textTransform,
      fontStyle: layerItem.textStyle.fontStyle
    });
    const content = getContent({paragraphs});
    textContent.content = content;
    positionTextContent({
      paperLayer: paperLayer,
      justification: layerItem.textStyle.justification,
      verticalAlignment: layerItem.textStyle.verticalAlignment,
      textResize: textResize,
    });
  }, 0.25), []);

  const resetState = (): void => {
    setSelectedAndChildren(null);
    setOriginalSelection(null);
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
    if (originalSelection[`${paperLayer.data.id}-mask`]) {
      const maskClone = originalSelection[`${paperLayer.data.id}-mask`];
      paperLayer.previousSibling.replaceWith(maskClone.clone());
    }
    const originalLayer = originalSelection[paperLayer.data.id];
    paperLayer.replaceWith(originalLayer.clone());
  }

  const clearLayerPivots = (): void => {
    if (selectedAndChildren.length > 0) {
      selectedAndChildren.forEach((current) => {
        clearLayerPivot(current);
      });
    }
  }

  const clearLayerPivot = (id: string): void => {
    const layerItem = layersById[id];
    const artboardItem = layersById[layerItem.artboard] as Btwx.Artboard;
    const projectIndex = artboardItem.projectIndex;
    const paperLayer = getPaperLayer(id, projectIndex);
    if (paperLayer) {
      switch(paperLayer.data.layerType) {
        case 'Artboard': {
          const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
          const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
          background.pivot = null;
          mask.pivot = null;
          break;
        }
        case 'Text': {
          const background = paperLayer.getItem({data: { id: 'textBackground' }});
          const mask = paperLayer.getItem({data: { id: 'textMask' }});
          background.pivot = null;
          mask.pivot = null;
          paperLayer.pivot = null;
          break;
        }
        case 'Shape': {
          const isMask = (layerItem as Btwx.Shape).mask;
          paperLayer.pivot = null;
          if (isMask) {
            paperLayer.previousSibling.pivot = null;
          }
          break;
        }
        case 'Image': {
          paperLayer.pivot = null;
          break;
        }
      }
    }
  }

  const scaleLayer = (id: string, hor: number, ver: number): void => {
    const artboardItem = layersById[layersById[id].artboard] as Btwx.Artboard;
    const projectIndex = artboardItem.projectIndex;
    const paperLayer = getPaperLayer(id, projectIndex);
    const layerItem = layersById[id];
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
        background.scale(hor, ver);
        mask.scale(hor, ver);
        break;
      }
      case 'Text': {
        const textBackground = paperLayer.getItem({data: { id: 'textBackground' }});
        const textMask = paperLayer.getItem({data: { id: 'textMask' }});
        const hFlip = (horizontalFlip && !layerItem.transform.horizontalFlip) || (!horizontalFlip && layerItem.transform.horizontalFlip);
        const vFlip = (verticalFlip && !layerItem.transform.verticalFlip) || (!verticalFlip && layerItem.transform.verticalFlip);
        if (layerItem.transform.rotation !== 0) {
          const scaleClone = textBackground.clone({insert: false});
          scaleClone.scale(hor, ver);
          textBackground.fitBounds(scaleClone.bounds);
          textMask.fitBounds(scaleClone.bounds);
        }
        if (hFlip || vFlip) {
          paperLayer.scale(hFlip ? -1 : 1, vFlip ? -1 : 1);
        }
        if (layerItem.transform.rotation !== 0) {
          paperLayer.pivot = null;
          paperLayer.rotation = -layerItem.transform.rotation;
          paperLayer.pivot = fromPivot;
        }
        if (layerItem.transform.rotation === 0) {
          textBackground.scale(hor, ver);
          textMask.scale(hor, ver);
        }
        resizeTextContent(textBackground.bounds, layerItem, paperLayer, handle);
        if (layerItem.transform.rotation !== 0) {
          paperLayer.pivot = null;
          paperLayer.rotation = layerItem.transform.rotation;
          paperLayer.pivot = fromPivot;
        }
        if (hFlip || vFlip) {
          paperLayer.scale(hFlip ? -1 : 1, vFlip ? -1 : 1);
        }
        break;
      }
      case 'Shape': {
        switch((layerItem as Btwx.Shape).shapeType) {
          case 'Line':
          case 'Custom': {
            paperLayer.scale(hor, ver);
            break;
          }
          case 'Ellipse':
          case 'Polygon':
          case 'Rectangle':
          case 'Star': {
            const isMask = (layerItem as Btwx.Shape).mask;
            if (layerItem.transform.rotation !== 0) {
              const scaleClone = paperLayer.clone({insert: false});
              scaleClone.scale(hor, ver);
              paperLayer.fitBounds(scaleClone.bounds);
              if (isMask) {
                paperLayer.previousSibling.fitBounds(scaleClone.bounds);
              }
            } else {
              paperLayer.scale(hor, ver);
              if (isMask) {
                paperLayer.previousSibling.scale(hor, ver);
              }
            }
            break;
          }
          case 'Rounded': {
            const isMask = (layerItem as Btwx.Shape).mask;
            if (layerItem.transform.rotation !== 0) {
              const scaleClone = paperLayer.clone({insert: false});
              scaleClone.scale(hor, ver);
              paperLayer.fitBounds(scaleClone.bounds);
              if (isMask) {
                paperLayer.previousSibling.fitBounds(scaleClone.bounds);
              }
            } else {
              paperLayer.scale(hor, ver);
              const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
              const newShape = new paperMain.Path.Rectangle({
                from: paperLayer.bounds.topLeft,
                to: paperLayer.bounds.bottomRight,
                radius: (maxDim / 2) * (layerItem as Btwx.Rounded).radius,
                insert: false
              });
              (paperLayer as paper.CompoundPath).pathData = newShape.pathData;
              if (isMask) {
                (paperLayer.previousSibling as paper.CompoundPath).pathData = newShape.pathData;
              }
            }
            break;
          }
        }
        break;
      }
      case 'Image': {
        if (layerItem.transform.rotation !== 0) {
          const scaleClone = paperLayer.clone({insert: false});
          scaleClone.scale(hor, ver);
          paperLayer.fitBounds(scaleClone.bounds);
        } else {
          paperLayer.scale(hor, ver);
        }
        break;
      }
    }
  }

  const flipLayer = (id: string, hor: number, ver: number): void => {
    const layerItem = layersById[id];
    const artboardItem = layersById[layerItem.artboard] as Btwx.Artboard;
    const projectIndex = artboardItem.projectIndex;
    const paperLayer = getPaperLayer(id, projectIndex);
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
        background.scale(hor, ver);
        mask.scale(hor, ver);
        break;
      }
      case 'Shape': {
        const isMask = (layerItem as Btwx.Shape).mask;
        paperLayer.scale(hor, ver);
        if (isMask) {
          paperLayer.previousSibling.scale(hor, ver);
        }
        // switch(paperLayer.data.shapeType) {
        //   case 'Ellipse':
        //   case 'Polygon':
        //   case 'Rectangle':
        //   case 'Star':
        //   case 'Line':
        //   case 'Custom':
        //     paperLayer.scale(hor, ver);
        //     if (isMask) {
        //       paperLayer.previousSibling.scale(hor, ver);
        //     }
        //     break;
        //   case 'Rounded': {
        //     paperLayer.scale(hor, ver);
        //     if (isMask) {
        //       paperLayer.previousSibling.scale(hor, ver);
        //     }
        //     if (!preserveAspectRatio) {
        //       const newShape = new paperMain.Path.Rectangle({
        //         from: paperLayer.bounds.topLeft,
        //         to: paperLayer.bounds.bottomRight,
        //         radius: (Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2) * (layerItem as Btwx.Rounded).radius,
        //         insert: false
        //       });
        //       (paperLayer as paper.Path).pathData = newShape.pathData;
        //       if (isMask) {
        //         (paperLayer.previousSibling as paper.Path).pathData = newShape.pathData;
        //       }
        //     }
        //     break;
        //   }
        // }
        break;
      }
      case 'Text':
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
    selectedAndChildren.forEach((id: string) => {
      const artboardItem = layersById[layersById[id].artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = getPaperLayer(id, projectIndex);
      clearLayerScale(paperLayer);
      setLayerPivot(id);
      flipLayer(id, horizontalFlip ? -1 : 1, verticalFlip ? -1 : 1);
      scaleLayer(id, scaleX, scaleY);
    });
  }

  const setLayerPivot = (id: string, pivot = fromPivot): void => {
    const layerItem = layersById[id];
    const artboardItem = layersById[layerItem.artboard] as Btwx.Artboard;
    const projectIndex = artboardItem.projectIndex;
    const paperLayer = getPaperLayer(id, projectIndex);
    switch(paperLayer.data.layerType) {
      case 'Artboard': {
        const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
        const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
        background.pivot = pivot;
        mask.pivot = pivot;
        break;
      }
      case 'Text': {
        const background = paperLayer.getItem({data: { id: 'textBackground' }});
        const mask = paperLayer.getItem({data: { id: 'textMask' }});
        background.pivot = pivot;
        mask.pivot = pivot;
        paperLayer.pivot = pivot;
        break;
      }
      case 'Shape': {
        const isMask = (layerItem as Btwx.Shape).mask;
        paperLayer.pivot = pivot;
        if (isMask) {
          paperLayer.previousSibling.pivot = pivot;
        }
        break;
      }
      case 'Image': {
        paperLayer.pivot = pivot;
        break;
      }
    }
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
      if (downEvent && isEnabled && selectedBounds && initialHandle) {
        // const nextFromBounds = selectedRotation !== 'multi' && selectedRotation !== 0 ? selectedInnerBounds : selectedBounds;
        const nextFromBounds = selectedBounds;
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
        let nextOriginalSelection = {};
        const compiledSelected = [];
        const handleLayers = (layers) => {
          layers.forEach((id) => {
            const artboardItem = layersById[layersById[id].artboard] as Btwx.Artboard;
            const projectIndex = artboardItem.projectIndex;
            const layerItem = layersById[id];
            if (layerItem.type !== 'Group') {
              const paperLayer = getPaperLayer(id, projectIndex);
              const clone = paperLayer.clone({insert: false});
              nextOriginalSelection = {
                ...nextOriginalSelection,
                [id]: clone
              }
              if (layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask) {
                nextOriginalSelection = {
                  ...nextOriginalSelection,
                  [`${id}-mask`]: paperLayer.previousSibling.clone({insert: false})
                }
              }
              compiledSelected.push(id);
              setLayerPivot(id, nextFromPivot);
            } else {
              const descendents = getLayerDescendants({byId: layersById} as any, id, false);
              handleLayers(descendents);
            }
          });
        }
        handleLayers(selected);
        setFromPivot(nextFromPivot);
        setFromBounds(nextFromBounds);
        setSelectedAndChildren(compiledSelected);
        setOriginalSelection(nextOriginalSelection);
        setHandle(initialHandle);
        // setPivotHandle(getPivotHandle(initialHandle));
        updateSelectionFrame({
          bounds: nextFromBounds,
          // rotation: selectedRotation !== 'multi' && selectedRotation !== 0 ? selectedRotation : null,
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
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, -1, -1);
              });
            } else {
              if (dragEvent.point.x > fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'topRight';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, -1, 1);
                });
              }
              if (dragEvent.point.y > fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'bottomLeft';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, 1, -1);
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
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, -1, -1);
              });
            } else {
              if (dragEvent.point.x < fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'topLeft';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, -1, 1);
                });
              }
              if (dragEvent.point.y > fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'bottomRight';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, 1, -1);
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
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, -1, -1);
              });
            } else {
              if (dragEvent.point.x > fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'bottomRight';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, -1, 1);
                });
              }
              if (dragEvent.point.y < fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'topLeft';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, 1, -1);
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
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, -1, -1);
              });
            } else {
              if (dragEvent.point.x < fromPivot.x) {
                nextHorizontalFlip = !horizontalFlip;
                nextHandle = 'bottomLeft';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, -1, 1);
                });
              }
              if (dragEvent.point.y < fromPivot.y) {
                nextVerticalFlip = !verticalFlip;
                nextHandle = 'topRight';
                selectedAndChildren.forEach((layer: string) => {
                  flipLayer(layer, 1, -1);
                });
              }
            }
            break;
          }
          case 'topCenter': {
            if (dragEvent.point.y > fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'bottomCenter';
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, 1, -1);
              });
            }
            break;
          }
          case 'bottomCenter': {
            if (dragEvent.point.y < fromPivot.y) {
              nextVerticalFlip = !verticalFlip;
              nextHandle = 'topCenter';
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, 1, -1);
              });
            }
            break;
          }
          case 'leftCenter': {
            if (dragEvent.point.x > fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'rightCenter';
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, -1, 1);
              });
            }
            break;
          }
          case 'rightCenter': {
            if (dragEvent.point.x < fromPivot.x) {
              nextHorizontalFlip = !horizontalFlip;
              nextHandle = 'leftCenter';
              selectedAndChildren.forEach((layer: string) => {
                flipLayer(layer, -1, 1);
              });
            }
            break;
          }
        }
        // const nextSnapBounds = getNextSnapBounds(dragEvent, nextHandle, nextHorizontalFlip, nextVerticalFlip);
        setSnapBounds(getNextSnapBounds(dragEvent, nextHandle, nextHorizontalFlip, nextVerticalFlip));
        setHandle(nextHandle);
        // setPivotHandle(getPivotHandle(nextHandle));
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
      if (upEvent && isEnabled && handle && fromPivot && fromBounds && toBounds) {
        if (selectedAndChildren.length > 0) {
          const totalWidthDiff = toBounds.width / fromBounds.width;
          const totalHeightDiff = toBounds.height / fromBounds.height;
          const scaleX = isFinite(totalWidthDiff) && totalWidthDiff > 0 ? totalWidthDiff : 0.01;
          const scaleY = isFinite(totalHeightDiff) && totalHeightDiff > 0 ? totalHeightDiff : 0.01;
          clearLayerPivots();
          dispatch(
            scaleLayersThunk({
              layers: selectedAndChildren,
              scale: { x: scaleX, y: scaleY },
              horizontalFlip,
              verticalFlip
            })
          );
        }
        resetState();
        if (initialHandle !== handle) {
          dispatch(setCanvasActiveTool({
            activeTool: 'Resize',
            resizeHandle: handle,
            dragHandle: false,
            lineHandle: null,
            cursor: [getSelectionFrameCursor(handle)]
          }));
        }
      } else {
        if (fromPivot) {
          clearLayerPivots();
          if (selected.length > 0) {
            updateSelectionFrame({
              bounds: fromBounds,
              // rotation: selectedRotation !== 'multi' && selectedRotation !== 0 ? selectedRotation : null
            });
          }
          resetState();
        }
      }
    } catch(err) {
      console.error(`Resize Tool Error -- On Mouse Up -- ${err}`);
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    try {
      if (keyDownEvent && isEnabled && resizing) {
        if (keyDownEvent.key === 'shift' && originalSelection) {
          const nextSnapBounds = getNextSnapBounds(dragEvent, handle, horizontalFlip, verticalFlip, true);
          setSnapBounds(nextSnapBounds);
          setShiftModifier(true);
        }
      }
    } catch(err) {
      console.error(`Resize Tool Error -- On Key Down -- ${err}`);
      resetState();
    }
  }, [keyDownEvent]);

  useEffect(() => {
    try {
      if (keyUpEvent && isEnabled && resizing) {
        if (keyUpEvent.key === 'shift' && originalSelection) {
          const nextSnapBounds = getNextSnapBounds(dragEvent, handle, horizontalFlip, verticalFlip);
          setSnapBounds(nextSnapBounds);
          setShiftModifier(false);
        }
      }
    } catch(err) {
      console.error(`Resize Tool Error -- On Key Up -- ${err}`);
      resetState();
    }
  }, [keyUpEvent]);

  useEffect(() => {
    if (toBounds && isEnabled && dragEvent) {
      resizeLayers();
      updateSelectionFrame({
        bounds: toBounds,
        // rotation: selectedRotation !== 'multi' && selectedRotation !== 0 ? selectedRotation : null,
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
        blackListLayers={selected}
        measure />
    : null
  );
}

export default PaperTool(
  ResizeTool,
  { all: true }
);