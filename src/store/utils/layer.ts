/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import layer, { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { addItem, removeItem, insertItem, addItems, moveItem, moveItemAbove, moveItemBelow } from './general';

import {
  AddPage, AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer,
  AddLayerChild, InsertLayerChild, EnableLayerHover, DisableLayerHover,
  InsertLayerAbove, InsertLayerBelow, GroupLayers, UngroupLayers, UngroupLayer,
  DeselectAllLayers, RemoveLayers, SetGroupScope, HideLayerChildren, ShowLayerChildren,
  DecreaseLayerScope, NewLayerScope, SetLayerHover, ClearLayerScope, IncreaseLayerScope,
  CopyLayerToClipboard, CopyLayersToClipboard, PasteLayersFromClipboard, SelectLayers,
  DeselectLayers, MoveLayerTo, MoveLayerBy, EnableLayerDrag, DisableLayerDrag, MoveLayersTo,
  MoveLayersBy, DeepSelectLayer, EscapeLayerScope, MoveLayer, MoveLayers, AddArtboard,
  SetLayerName, SetActiveArtboard, AddLayerTween, RemoveLayerTween, AddLayerTweenEvent,
  RemoveLayerTweenEvent, SetLayerTweenDuration, SetLayerTweenDelay, IncrementLayerTweenDuration,
  DecrementLayerTweenDuration, IncrementLayerTweenDelay, DecrementLayerTweenDelay, SetLayerTweenEase,
  SetLayerTweenPower, FreezeLayerTween, UnFreezeLayerTween, SetLayerX, SetLayerY, SetLayerWidth,
  SetLayerHeight, SetLayerOpacity, SetLayerFillColor,
  SetLayerStrokeColor, SetLayerStrokeWidth, SetLayerShadowColor, SetLayerShadowBlur, SetLayerShadowXOffset,
  SetLayerShadowYOffset, SetLayerRotation, EnableLayerFill, DisableLayerFill, EnableLayerStroke,
  DisableLayerStroke, DisableLayerShadow, EnableLayerShadow, SetLayerStrokeCap, SetLayerStrokeJoin,
  SetLayerStrokeDashArray, SetLayerStrokeMiterLimit, ResizeLayer, ResizeLayers, EnableLayerHorizontalFlip,
  DisableLayerHorizontalFlip, EnableLayerVerticalFlip, DisableLayerVerticalFlip, AddText, SetLayerText,
  SetLayerFontSize, SetLayerFontWeight, SetLayerFontFamily, SetLayerLeading, SetLayerJustification,
  AddInViewLayer, AddInViewLayers, RemoveInViewLayer, RemoveInViewLayers, UpdateInViewLayers, SetLayerFillType,
  SetLayerFillGradientType, SetLayerFillGradientStopColor, SetLayerFillGradientStopPosition, AddLayerFillGradientStop,
  RemoveLayerFillGradientStop, SetLayerFillGradientOrigin, SetLayerFillGradient, SetLayerStrokeGradient,
  SetLayerStrokeGradientType, SetLayerStrokeFillType, SetLayerFillGradientDestination, AddLayersMask,
  MaskLayer, MaskLayers, UnmaskLayers, UnmaskLayer, RemoveLayersMask, SetLayerFill, AlignLayersToLeft,
  AlignLayersToRight, AlignLayersToTop, AlignLayersToBottom, AlignLayersToCenter, AlignLayersToMiddle,
  DistributeLayersHorizontally, DistributeLayersVertically, DuplicateLayer, DuplicateLayers, RemoveDuplicatedLayers,
  SendLayerForward, SendLayerBackward, SendLayersForward, SendLayersBackward, SendLayerToFront, SendLayersToFront,
  SendLayerToBack, SendLayersToBack, AddImage, InsertLayersAbove, InsertLayersBelow, AddLayerChildren
} from '../actionTypes/layer';

import {
  getLayerIndex, getLayer, getLayerDepth, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor,
  getNearestScopeGroupAncestor, getParentLayer, getLayerScope, getPaperLayer, getSelectionTopLeft,
  getPaperLayerByPaperId, getClipboardTopLeft, getSelectionBottomRight, getPagePaperLayer,
  getClipboardBottomRight, getClipboardCenter, getSelectionCenter, getLayerAndDescendants,
  getLayerDescendants, getDestinationEquivalent, getEquivalentTweenProps, isTweenDestinationLayer,
  getTweensByDestinationLayer, getAllArtboardTweenEventDestinations, getAllArtboardTweenLayerDestinations,
  getAllArtboardTweenEvents, getTweensEventsByDestinationArtboard, getTweensByLayer, getLayersBounds,
  getGradientOriginPoint, getGradientDestinationPoint, getGradientStops, getLayerSnapPoints, getInViewSnapPoints,
  orderLayersByDepth, orderLayersByLeft, orderLayersByTop, exportProjectJSON
} from '../selectors/layer';

import { paperMain } from '../../canvas';

import { applyShapeMethods } from '../../canvas/shapeUtils';
import { applyTextMethods } from '../../canvas/textUtils';
import { applyArtboardMethods } from '../../canvas/artboardUtils';
import { applyImageMethods } from '../../canvas/imageUtils';

import { THEME_PRIMARY_COLOR } from '../../constants';
import { bufferToBase64 } from '../../utils';

export const addPage = (state: LayerState, action: AddPage): LayerState => {
  return {
    ...state,
    allIds: addItem(state.allIds, action.payload.id),
    byId: {
      ...state.byId,
      [action.payload.id]: action.payload as em.Page
    },
    page: action.payload.id,
    paperProject: exportProjectJSON(state, paperMain.project.exportJSON())
  }
};

export const addArtboard = (state: LayerState, action: AddArtboard): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(currentState.page);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.id),
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: currentState.page
      } as em.Artboard,
      [currentState.page]: {
        ...currentState.byId[currentState.page],
        children: addItem(currentState.byId[currentState.page].children, action.payload.id)
      } as em.Page
    },
    allArtboardIds: addItem(currentState.allArtboardIds, action.payload.id),
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const updateActiveArtboardFrame = (activeArtboard: string, scope = 1) => {
  if (scope === 1) {
    const activeArtboardFrames = paperMain.project.getItems({ data: { id: 'ArtboardFrame' } });
    if (activeArtboardFrames && activeArtboardFrames.length > 0) {
      activeArtboardFrames.forEach((item) => item.visible = false);
      //activeArtboardFrame.remove();
    }
    if (activeArtboard) {
      const paperActiveArtboardLayer = getPaperLayer(activeArtboard);
      paperActiveArtboardLayer.getItem({ data: { id: 'ArtboardFrame' } }).visible = true;
    }
  }
}

export const addShape = (state: LayerState, action: AddShape): LayerState => {
  let currentState = state;
  const layerParent = action.payload.parent ? action.payload.parent : currentState.page;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(layerParent);
  // add shape
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.id),
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: layerParent
      } as em.Shape,
      [layerParent]: {
        ...currentState.byId[layerParent],
        children: addItem((currentState.byId[layerParent] as em.Group).children, action.payload.id),
        showChildren: true
      } as em.Group
    },
    allShapeIds: addItem(state.allShapeIds, action.payload.id),
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const addGroup = (state: LayerState, action: AddGroup): LayerState => {
  let currentState = state;
  const layerParent = action.payload.parent ? action.payload.parent : currentState.page;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(layerParent);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.id),
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: layerParent
      } as em.Group,
      [layerParent]: {
        ...currentState.byId[layerParent],
        children: addItem((currentState.byId[layerParent] as em.Group).children, action.payload.id),
        showChildren: true
      } as em.Group
    },
    allGroupIds: addItem(state.allGroupIds, action.payload.id),
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const addText = (state: LayerState, action: AddText): LayerState => {
  let currentState = state;
  const layerParent = action.payload.parent ? action.payload.parent : currentState.page;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(layerParent);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.id),
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: layerParent,
        children: null
      } as em.Text,
      [layerParent]: {
        ...currentState.byId[layerParent],
        children: addItem((currentState.byId[layerParent] as em.Group).children, action.payload.id),
        showChildren: true
      } as em.Group
    },
    allTextIds: addItem(state.allTextIds, action.payload.id),
    paperProject: exportProjectJSON(currentState, exportProjectJSON(currentState, paperMain.project.exportJSON()))
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const addImage = (state: LayerState, action: AddImage): LayerState => {
  let currentState = state;
  const layerParent = action.payload.parent ? action.payload.parent : currentState.page;
  const paperLayer = getPaperLayer(action.payload.id);
  const raster = paperLayer.getItem({data: {id: 'Raster'}}) as paper.Raster;
  paperLayer.parent = getPaperLayer(layerParent);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.id),
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: layerParent
      } as em.Image,
      [layerParent]: {
        ...currentState.byId[layerParent],
        children: addItem((currentState.byId[layerParent] as em.Group).children, action.payload.id),
        showChildren: true
      } as em.Group
    },
    allImageIds: addItem(state.allImageIds, action.payload.id),
    paperProject: paperMain.project.exportJSON().replace(raster.source as string, action.payload.imageId)
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  let currentState = state;
  const layer = state.byId[action.payload.id];
  const layersToRemove = getLayerAndDescendants(state, action.payload.id);
  currentState = layersToRemove.reduce((result, current) => {
    const tweensByDestinationLayer = getTweensByDestinationLayer(result, current);
    const tweensByLayer = getTweensByLayer(result, current);
    const layer = getLayer(result, current);
    // remove layer from type array
    switch(layer.type) {
      case 'Artboard':
        result = {
          ...result,
          allArtboardIds: removeItem(result.allArtboardIds, current)
        }
        break;
      case 'Shape':
        result = {
          ...result,
          allShapeIds: removeItem(result.allShapeIds, current)
        }
        break;
      case 'Group':
        result = {
          ...result,
          allGroupIds: removeItem(result.allGroupIds, current)
        }
        break;
      case 'Text':
        result = {
          ...result,
          allTextIds: removeItem(result.allTextIds, current)
        }
        break;
      case 'Image':
        result = {
          ...result,
          allImageIds: removeItem(result.allImageIds, current)
        }
        break;
    }
    if (layer.mask) {
      result = removeLayersMask(result, layerActions.removeLayersMask({id: layer.id}) as RemoveLayersMask);
    }
    // if layer is inView, remove from inView
    if (result.inView.allIds.includes(current)) {
      result = removeInViewLayer(result, layerActions.removeInViewLayer({id: current}) as RemoveInViewLayer);
    }
    // if layer is the active artboard, set active artboard to null
    if (layer.id === result.activeArtboard) {
      result = setActiveArtboard(result, layerActions.setActiveArtboard({id: null, scope: 1}) as SetActiveArtboard);
    }
    // if layer is a destination layer for any tween, remove that tween
    if (tweensByDestinationLayer.allIds.length > 0) {
      result = tweensByDestinationLayer.allIds.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTween(tweenResult, layerActions.removeLayerTween({id: tweenCurrent}) as RemoveLayerTween);
      }, result);
    }
    // if layer is a layer for any tween, remove that tween
    if (tweensByLayer.allIds.length > 0) {
      result = tweensByLayer.allIds.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTween(tweenResult, layerActions.removeLayerTween({id: tweenCurrent}) as RemoveLayerTween);
      }, result);
    }
    // if layer has any tween events, remove those events
    if (layer.tweenEvents.length > 0) {
      result = layer.tweenEvents.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
      }, result);
    }
    // if selection includes layer, remove layer from selection
    if (result.selected.includes(current)) {
      result = deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
    }
    return result;
  }, currentState);
  // if layer is the active hover layer, set hover to null
  if (currentState.hover === action.payload.id) {
    currentState = setLayerHover(currentState, layerActions.setLayerHover({id: null}) as SetLayerHover);
  }
  // remove paper layer
  getPaperLayer(action.payload.id).remove();
  // remove layer
  return {
    ...currentState,
    allIds: currentState.allIds.filter((id) => !layersToRemove.includes(id)),
    byId: Object.keys(currentState.byId).reduce((result: any, key) => {
      if (!layersToRemove.includes(key)) {
        if (layer.parent && layer.parent === key) {
          result[key] = {
            ...currentState.byId[key],
            children: removeItem(currentState.byId[key].children, action.payload.id)
          }
        } else {
          result[key] = currentState.byId[key];
        }
      }
      return result;
    }, {}),
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON()),
    scope: currentState.scope.filter((id) => !layersToRemove.includes(id))
  }
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return removeLayer(result, layerActions.removeLayer({id: current}) as RemoveLayer);
  }, state);
}

export const updateSelectionFrame = (state: LayerState, visibleHandle = 'all') => {
  const selectionFrame = paperMain.project.getItem({ data: { id: 'selectionFrame' } });
  if (selectionFrame) {
    selectionFrame.remove();
  }
  if (state.selected.length > 0) {
    const selectionTopLeft = getSelectionTopLeft(state);
    const selectionBottomRight = getSelectionBottomRight(state);
    const baseProps = {
      point: selectionTopLeft,
      size: [8, 8],
      fillColor: '#fff',
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      //applyMatrix: false
    }
    const baseFrame = new paperMain.Path.Rectangle({
      from: selectionTopLeft,
      to: selectionBottomRight,
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      //applyMatrix: false,
      data: {
        id: 'selectionFrameBase'
      }
    });
    const moveHandle = new paperMain.Path.Ellipse({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'move',
      data: {
        id: 'selectionFrameHandle',
        handle: 'move'
      }
    });
    moveHandle.position = new paperMain.Point(baseFrame.bounds.topCenter.x, baseFrame.bounds.topCenter.y - ((1 / paperMain.view.zoom) * 24));
    moveHandle.scaling.x = 1 / paperMain.view.zoom;
    moveHandle.scaling.y = 1 / paperMain.view.zoom;
    const topLeftHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'topLeft',
      data: {
        id: 'selectionFrameHandle',
        handle: 'topLeft'
      }
    });
    topLeftHandle.position = baseFrame.bounds.topLeft;
    topLeftHandle.scaling.x = 1 / paperMain.view.zoom;
    topLeftHandle.scaling.y = 1 / paperMain.view.zoom;
    const topCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'topCenter',
      data: {
        id: 'selectionFrameHandle',
        handle: 'topCenter'
      }
    });
    topCenterHandle.position = baseFrame.bounds.topCenter;
    topCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    topCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    const topRightHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'topRight',
      data: {
        id: 'selectionFrameHandle',
        handle: 'topRight'
      }
    });
    topRightHandle.position = baseFrame.bounds.topRight;
    topRightHandle.scaling.x = 1 / paperMain.view.zoom;
    topRightHandle.scaling.y = 1 / paperMain.view.zoom;
    const bottomLeftHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'bottomLeft',
      data: {
        id: 'selectionFrameHandle',
        handle: 'bottomLeft'
      }
    });
    bottomLeftHandle.position = baseFrame.bounds.bottomLeft;
    bottomLeftHandle.scaling.x = 1 / paperMain.view.zoom;
    bottomLeftHandle.scaling.y = 1 / paperMain.view.zoom;
    const bottomCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'bottomCenter',
      data: {
        id: 'selectionFrameHandle',
        handle: 'bottomCenter'
      }
    });
    bottomCenterHandle.position = baseFrame.bounds.bottomCenter;
    bottomCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    bottomCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    const bottomRightHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'bottomRight',
      data: {
        id: 'selectionFrameHandle',
        handle: 'bottomRight'
      }
    });
    bottomRightHandle.position = baseFrame.bounds.bottomRight;
    bottomRightHandle.scaling.x = 1 / paperMain.view.zoom;
    bottomRightHandle.scaling.y = 1 / paperMain.view.zoom;
    const rightCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'rightCenter',
      data: {
        id: 'selectionFrameHandle',
        handle: 'rightCenter'
      }
    });
    rightCenterHandle.position = baseFrame.bounds.rightCenter;
    rightCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    rightCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    const leftCenterHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandle === 'all' || visibleHandle === 'leftCenter',
      data: {
        id: 'selectionFrameHandle',
        handle: 'leftCenter'
      }
    });
    leftCenterHandle.position = baseFrame.bounds.leftCenter;
    leftCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    leftCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    if (state.selected.length >= 1 && state.selected.every((id) => state.byId[id].type === 'Text')) {
      topLeftHandle.opacity = 0.5;
      topCenterHandle.opacity = 0.5;
      topRightHandle.opacity = 0.5;
      bottomLeftHandle.opacity = 0.5;
      bottomCenterHandle.opacity = 0.5;
      bottomRightHandle.opacity = 0.5;
      leftCenterHandle.opacity = 0.5;
      rightCenterHandle.opacity = 0.5;
    }
    new paperMain.Group({
      children: [baseFrame, moveHandle, topLeftHandle, topCenterHandle, topRightHandle, bottomLeftHandle, bottomCenterHandle, bottomRightHandle, leftCenterHandle, rightCenterHandle],
      data: {
        id: 'selectionFrame'
      }
    });
  }
}

export const deselectLayer = (state: LayerState, action: DeselectLayer): LayerState => {
  const layer = state.byId[action.payload.id] as em.Layer;
  const newState = {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        selected: false
      }
    },
    selected: state.selected.filter((id) => id !== layer.id)
  }
  updateSelectionFrame(newState);
  return newState;
};

export const deselectLayers = (state: LayerState, action: DeselectLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, state);
};

export const deselectAllLayers = (state: LayerState, action: DeselectAllLayers): LayerState => {
  const deselectedLayersState = state.selected.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, state);
  return clearLayerScope(deselectedLayersState, layerActions.clearLayerScope() as ClearLayerScope);
};

export const selectLayer = (state: LayerState, action: SelectLayer): LayerState => {
  let currentState = state;
  const layer = getLayer(currentState, action.payload.id);
  const layerScope = getLayerScope(currentState, action.payload.id);
  const layerScopeRoot = layerScope[0];
  // if layer has a scope, and any of those scope layers are selected,
  // deselect the scope layers
  if (layerScope.length > 0) {
    if (state.selected.some((selectedItem) => layerScope.includes(selectedItem))) {
      const layersToDeselect = state.selected.filter((selectedItem) => layerScope.includes(selectedItem));
      currentState = deselectLayers(currentState, layerActions.deselectLayers({layers:layersToDeselect }) as DeselectLayers);
    }
  }
  // if layer is an artboard or group and current selection includes...
  // any of its descendants, deselect those descendants
  if (layer.type === 'Artboard' || layer.type === 'Group') {
    const layerDescendants = getLayerDescendants(currentState, action.payload.id);
    if (state.selected.some((selectedItem) => layerDescendants.includes(selectedItem))) {
      const layersToDeselect = state.selected.filter((selectedItem) => layerDescendants.includes(selectedItem));
      currentState = deselectLayers(currentState, layerActions.deselectLayers({layers:layersToDeselect }) as DeselectLayers);
    }
  }
  // if layer is an artboard, make it the active artboard
  if (layer.type === 'Artboard') {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: action.payload.id, scope: 1}) as SetActiveArtboard);
  }
  // if layer scope root is an artboard, make the layer scope root the active artboard
  if (layerScopeRoot && currentState.byId[layerScopeRoot].type === 'Artboard' && layerScopeRoot !== currentState.activeArtboard) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: layerScopeRoot, scope: 1}) as SetActiveArtboard);
  }
  // if new selection, create selection with just that layer
  if (action.payload.newSelection) {
    const deselectAll = deselectAllLayers(currentState, layerActions.deselectAllLayers() as DeselectAllLayers)
    currentState = {
      ...deselectAll,
      byId: {
        ...deselectAll.byId,
        [action.payload.id]: {
          ...deselectAll.byId[action.payload.id],
          selected: true
        }
      },
      selected: [action.payload.id]
    }
    currentState = newLayerScope(currentState, layerActions.newLayerScope({id: action.payload.id}) as NewLayerScope);
  }
  // else, add layer to current selection
  else {
    if (!currentState.selected.includes(action.payload.id)) {
      currentState = {
        ...currentState,
        byId: {
          ...currentState.byId,
          [action.payload.id]: {
            ...currentState.byId[action.payload.id],
            selected: true
          }
        },
        selected: addItem(currentState.selected, action.payload.id)
      }
    }
  }
  // update selection frame
  updateSelectionFrame(currentState);
  // update hover frame
  updateHoverFrame(currentState);
  // return final state
  return currentState;
};

export const deepSelectLayer = (state: LayerState, action: DeepSelectLayer): LayerState => {
  let currentState = state;
  const nearestScopeAncestor = getNearestScopeAncestor(currentState, action.payload.id);
  if (isScopeGroupLayer(currentState, nearestScopeAncestor.id)) {
    currentState = increaseLayerScope(currentState, layerActions.increaseLayerScope({id: nearestScopeAncestor.id}) as IncreaseLayerScope);
    const nearestScopeAncestorDeep = getNearestScopeAncestor(currentState, action.payload.id);
    if (currentState.hover === nearestScopeAncestor.id) {
      currentState = setLayerHover(currentState, layerActions.setLayerHover({id: nearestScopeAncestorDeep.id}) as SetLayerHover);
    }
    return selectLayer(currentState, layerActions.selectLayer({id: nearestScopeAncestorDeep.id, newSelection: true}) as SelectLayer);
  } else {
    return state;
  }
};

export const selectLayers = (state: LayerState, action: SelectLayers): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    currentState = deselectAllLayers(currentState, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  return action.payload.layers.reduce((result, current) => {
    return selectLayer(result, layerActions.selectLayer({id: current}) as SelectLayer);
  }, currentState);
};

export const updateHoverFrame = (state: LayerState) => {
  const hoverFrame = paperMain.project.getItem({ data: { id: 'hoverFrame' } });
  const hoverFrameConstants = {
    strokeColor: THEME_PRIMARY_COLOR,
    strokeWidth: 1 / paperMain.view.zoom,
    //applyMatrix: false,
    data: {
      id: 'hoverFrame'
    }
  }
  if (hoverFrame) {
    hoverFrame.remove();
  }
  if (state.hover && !state.selected.includes(state.hover)) {
    const paperHoverLayer = getPaperLayer(state.hover);
    if (paperHoverLayer.className === ('Path' || 'CompoundPath')) {
      new paperMain.Path({
        ...hoverFrameConstants,
        closed: (paperHoverLayer as paper.Path).closed,
        segments: [...(paperHoverLayer as paper.Path).segments]
      });
    } else {
      new paperMain.Path.Rectangle({
        ...hoverFrameConstants,
        point: paperHoverLayer.bounds.topLeft,
        size: [paperHoverLayer.bounds.width, paperHoverLayer.bounds.height]
      });
    }
  }
}

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  const stateWithNewHover = {
    ...state,
    hover: action.payload.id
  };
  updateHoverFrame(stateWithNewHover);
  return stateWithNewHover;
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  let currentState = state;
  const layer = currentState.byId[action.payload.id];
  const child = currentState.byId[action.payload.child];
  const paperLayer = getPaperLayer(action.payload.id);
  const childPaperLayer = getPaperLayer(action.payload.child);
  paperLayer.addChild(childPaperLayer);
  if (child.parent === action.payload.id) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          showChildren: true,
          children: addItem(removeItem((currentState.byId[action.payload.id] as em.Group).children, action.payload.child), action.payload.child)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  } else {
    if (child.mask) {
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: action.payload.child}) as RemoveLayersMask);
    }
    if (child.masked) {
      if (layer.type !== 'Group' || (layer.type === 'Group' && !layer.clipped)) {
        currentState = unmaskLayer(currentState, layerActions.unmaskLayer({id: action.payload.child}) as UnmaskLayer);
      }
    }
    if (!child.masked && layer.type === 'Group' && layer.clipped) {
      currentState = maskLayer(currentState, layerActions.maskLayer({id: action.payload.child}) as MaskLayer);
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [child.parent]: {
          ...currentState.byId[child.parent],
          children: removeItem((currentState.byId[child.parent] as em.Group).children, action.payload.child)
        } as em.Group,
        [action.payload.child]: {
          ...currentState.byId[action.payload.child],
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          showChildren: true,
          children: addItem((currentState.byId[action.payload.id] as em.Group).children, action.payload.child)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
};

export const addLayerChildren = (state: LayerState, action: AddLayerChildren) => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(currentState, action.payload.children);
  currentState = orderedLayers.reduce((result, current) => {
    return addLayerChild(result, layerActions.addLayerChild({id: action.payload.id, child: current}) as AddLayerChild);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.children, newSelection: true}) as SelectLayers);
  return currentState;
};

export const insertLayerChild = (state: LayerState, action: InsertLayerChild): LayerState => {
  let currentState = state;
  const layer = currentState.byId[action.payload.id] as em.Artboard | em.Group;
  const child = currentState.byId[action.payload.child];
  const paperLayer = getPaperLayer(action.payload.id);
  const childPaperLayer = getPaperLayer(action.payload.child);
  // add two to index to account for background and mask if layer is an Artboard
  paperLayer.insertChild(layer.type === 'Artboard' ? action.payload.index + 2 : action.payload.index, childPaperLayer);
  const updatedChildren = currentState.byId[action.payload.id].children.slice();
  updatedChildren.splice(action.payload.index, 0, action.payload.id);
  if (child.parent === action.payload.id) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          children: insertItem(removeItem((currentState.byId[action.payload.id] as em.Group).children, action.payload.child), action.payload.child, action.payload.index)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  } else {
    if (child.mask) {
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: action.payload.child}) as RemoveLayersMask);
    }
    if (child.masked) {
      if (layer.type !== 'Group' || (layer.type === 'Group' && !layer.clipped)) {
        currentState = unmaskLayer(currentState, layerActions.unmaskLayer({id: action.payload.child}) as UnmaskLayer);
      }
    }
    if (!child.masked && layer.type === 'Group' && layer.clipped) {
      currentState = maskLayer(currentState, layerActions.maskLayer({id: action.payload.child}) as MaskLayer);
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [child.parent]: {
          ...currentState.byId[child.parent],
          children: removeItem((currentState.byId[child.parent] as em.Group).children, action.payload.child)
        } as em.Group,
        [action.payload.child]: {
          ...currentState.byId[action.payload.child],
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          children: insertItem((currentState.byId[action.payload.id] as em.Group).children, action.payload.child, action.payload.index)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
};

export const showLayerChildren = (state: LayerState, action: ShowLayerChildren): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        showChildren: true
      } as em.Group
    }
  }
};

export const hideLayerChildren = (state: LayerState, action: HideLayerChildren): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        showChildren: false
      } as em.Group
    }
  }
};

export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
  let currentState = state;
  const layer = currentState.byId[action.payload.id];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  const above = currentState.byId[action.payload.above];
  const aboveParent = currentState.byId[above.parent] as em.Group;
  const aboveIndex = getLayerIndex(currentState, action.payload.above);
  const paperLayer = getPaperLayer(action.payload.id);
  const abovePaperLayer = getPaperLayer(action.payload.above);
  paperLayer.insertBelow(abovePaperLayer);
  if (layer.parent !== above.parent) {
    if (layer.mask) {
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: action.payload.id}) as RemoveLayersMask);
    }
    if (layer.masked) {
      if (aboveParent.type !== 'Group' || (aboveParent.type === 'Group' && !aboveParent.clipped)) {
        currentState = unmaskLayer(currentState, layerActions.unmaskLayer({id: action.payload.id}) as UnmaskLayer);
      }
    }
    if (!layer.masked && aboveParent.type === 'Group' && aboveParent.clipped && !above.mask) {
      currentState = maskLayer(currentState, layerActions.maskLayer({id: action.payload.id}) as MaskLayer);
    }
    if (above.mask) {
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: action.payload.above}) as RemoveLayersMask);
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: above.parent
        },
        [layer.parent]: {
          ...currentState.byId[layer.parent],
          children: removeItem((currentState.byId[layer.parent] as em.Group).children, action.payload.id)
        } as em.Group,
        [above.parent]: {
          ...currentState.byId[above.parent],
          children: insertItem((currentState.byId[above.parent] as em.Group).children, action.payload.id, aboveIndex)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  } else {
    if (layer.masked && above.mask) {
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: action.payload.above}) as RemoveLayersMask);
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [layer.parent]: {
          ...currentState.byId[layer.parent],
          children: moveItemAbove(currentState.byId[layer.parent].children, layerIndex, aboveIndex)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const insertLayersAbove = (state: LayerState, action: InsertLayersAbove) => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result, current) => {
    return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: action.payload.above}) as InsertLayerAbove);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  return currentState;
};

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  let currentState = state;
  const layer = state.byId[action.payload.id];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  const below = state.byId[action.payload.below];
  const belowParent = state.byId[below.parent] as em.Group;
  const belowIndex = getLayerIndex(currentState, action.payload.below);
  const paperLayer = getPaperLayer(action.payload.id);
  const abovePaperLayer = getPaperLayer(action.payload.below);
  paperLayer.insertAbove(abovePaperLayer);
  if (layer.parent !== below.parent) {
    if (layer.mask) {
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: action.payload.id}) as RemoveLayersMask);
    }
    if (layer.masked) {
      if (belowParent.type !== 'Group' || (belowParent.type === 'Group' && !belowParent.clipped)) {
        currentState = unmaskLayer(currentState, layerActions.unmaskLayer({id: action.payload.id}) as UnmaskLayer);
      }
    }
    if (!layer.masked && belowParent.type === 'Group' && belowParent.clipped) {
      currentState = maskLayer(currentState, layerActions.maskLayer({id: action.payload.id}) as MaskLayer);
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: below.parent
        },
        [layer.parent]: {
          ...currentState.byId[layer.parent],
          children: removeItem((currentState.byId[layer.parent] as em.Group).children, action.payload.id)
        } as em.Group,
        [below.parent]: {
          ...currentState.byId[below.parent],
          children: insertItem((currentState.byId[below.parent] as em.Group).children, action.payload.id, belowIndex + 1)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  } else {
    if (layer.mask && below.masked) {
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: action.payload.id}) as RemoveLayersMask);
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [layer.parent]: {
          ...currentState.byId[layer.parent],
          children: moveItemBelow(currentState.byId[layer.parent].children, layerIndex, belowIndex)
        } as em.Group
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    };
  }
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const insertLayersBelow = (state: LayerState, action: InsertLayersBelow) => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(state, action.payload.layers);
  currentState = orderedLayers.reverse().reduce((result, current) => {
    return insertLayerBelow(result, layerActions.insertLayerBelow({id: current, below: action.payload.below}) as InsertLayerBelow);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  return currentState;
};

export const increaseLayerScope = (state: LayerState, action: IncreaseLayerScope): LayerState => {
  if (isScopeLayer(state, action.payload.id) && isScopeGroupLayer(state, action.payload.id)) {
    return {
      ...showLayerChildren(state, layerActions.showLayerChildren({id: action.payload.id}) as ShowLayerChildren),
      scope: addItem(state.scope, action.payload.id)
    }
  } else {
    return state;
  }
};

export const decreaseLayerScope = (state: LayerState, action: DecreaseLayerScope): LayerState => {
  return {
    ...state,
    scope: state.scope.filter((id, index) => index !== state.scope.length - 1)
  }
};

export const clearLayerScope = (state: LayerState, action: ClearLayerScope): LayerState => {
  return {
    ...state,
    scope: []
  }
};

export const newLayerScope = (state: LayerState, action: NewLayerScope): LayerState => {
  return {
    ...state,
    scope: getLayerScope(state, action.payload.id)
  }
};

export const escapeLayerScope = (state: LayerState, action: EscapeLayerScope): LayerState => {
  const nextScope = state.scope.filter((id, index) => index !== state.scope.length - 1);
  let currentState = state;
  if (state.scope.length > 0) {
    currentState = selectLayer(state, layerActions.selectLayer({id: state.scope[state.scope.length - 1], newSelection: true}) as SelectLayer);
  } else {
    currentState = deselectAllLayers(state, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  return {
    ...currentState,
    scope: nextScope
  }
};

export const groupLayers = (state: LayerState, action: GroupLayers): LayerState => {
  let currentState = state;
  // order children
  const orderedChildren = orderLayersByDepth(currentState, action.payload.layers);
  if (orderedChildren.find((id) => state.byId[id].mask)) {
    const mask = orderedChildren.find((id) => state.byId[id].mask);
    currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: mask}) as RemoveLayersMask);
  }
  // get bounds of layers to group
  const layersBounds = getLayersBounds(action.payload.layers);
  // add group
  currentState = addGroup(currentState, layerActions.addGroup({selected: true, frame: {x: layersBounds.center.x, y: layersBounds.center.y, width: layersBounds.width, height: layersBounds.height}}) as AddGroup);
  // get group id
  const groupId = currentState.allIds[currentState.allIds.length - 1];
  // move group above top layer
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: groupId, above: orderedChildren[0]}) as InsertLayerAbove);
  // add layers to group
  currentState = orderedChildren.reduce((result: LayerState, current: string) => {
    result = addLayerChild(result, layerActions.addLayerChild({id: groupId, child: current}) as AddLayerChild);
    return result;
  }, currentState);
  // select final group
  currentState = selectLayer(currentState, {payload: {id: groupId, newSelection: true}} as SelectLayer);
  // return final state
  return currentState;
};

export const ungroupLayer = (state: LayerState, action: UngroupLayer): LayerState => {
  const layer = getLayer(state, action.payload.id);
  if (layer.type === 'Group') {
    let currentState = state;
    // check if contains clip mask
    const paperLayer = getPaperLayer(action.payload.id) as paper.Group;
    if (paperLayer.clipped) {
      const maskLayer = layer.children.find((id) => state.byId[id].mask);
      currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: maskLayer}) as RemoveLayersMask);
    }
    // move children out of group
    currentState = layer.children.reduce((result: LayerState, current: string) => {
      return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: layer.id}) as InsertLayerAbove);
    }, currentState);
    // select ungrouped children
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: layer.children, newSelection: true}) as SelectLayers);
    // remove group
    currentState = removeLayer(currentState, layerActions.removeLayer({id: layer.id}) as RemoveLayer);
    // return final state
    return currentState;
  } else {
    return selectLayer(state, layerActions.selectLayer({id: layer.id, newSelection: true}) as SelectLayer);
  }
};

export const ungroupLayers = (state: LayerState, action: UngroupLayers): LayerState => {
  let currentState = state;
  const newSelection: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    // ungroup layer
    result = ungroupLayer(result, layerActions.ungroupLayer({id: current}) as UngroupLayer);
    // push ungrouped selection to newSelection
    newSelection.push(...result.selected);
    // return result
    return result;
  }, currentState);
  // select newSelection
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: newSelection, newSelection: true}) as SelectLayers);
  // return final state
  return currentState;
};

const getClipboardLayerDescendants = (state: LayerState, id: string) => {
  const layer = state.byId[id];
  const paperLayer = getPaperLayer(id);
  const getPaperLayerJSON = (paperItem: paper.Item, layerItem: em.Layer) => {
    switch(layerItem.type) {
      case 'Artboard':
      case 'Group': {
        const clone = paperItem.clone({insert: false});
        layerItem.children.forEach((id) => {
          clone.getItem({data: {id}}).remove();
        });
        return clone.exportJSON();
      }
      case 'Image': {
        const imageJSON = paperItem.exportJSON();
        const imageSource = (paperItem.getItem({data: {id: 'Raster'}}) as paper.Raster).source;
        return imageJSON.replace(imageSource as string, paperItem.data.imageId);
      }
      default:
        return paperItem.exportJSON();
    }
  }
  const groups: string[] = [id];
  const clipboardLayerDescendants: {allIds: string[]; byId: {[id: string]: em.ClipboardLayer}} = {
    allIds: [id],
    byId: {
      [id]: {
        ...layer,
        paperLayer: getPaperLayerJSON(paperLayer, layer)
      }
    }
  };
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
        const childPaperLayer = getPaperLayer(child);
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
        clipboardLayerDescendants.allIds.push(child);
        clipboardLayerDescendants.byId[child] = {
          ...childLayer,
          paperLayer: getPaperLayerJSON(childPaperLayer, childLayer)
        }
      });
    }
    i++;
  }
  return clipboardLayerDescendants;
}

export const copyLayerToClipboard = (state: LayerState, action: CopyLayerToClipboard): LayerState => {
  if (!state.clipboard.allIds.includes(action.payload.id)) {
    const clipboardLayerAncestors = getClipboardLayerDescendants(state, action.payload.id);
    return {
      ...state,
      clipboard: {
        main: addItem(state.clipboard.main, action.payload.id),
        allIds: [...state.clipboard.allIds, ...clipboardLayerAncestors.allIds],
        byId: { ...state.clipboard.byId, ...clipboardLayerAncestors.byId }
      }
    }
  } else {
    return state;
  }
};

export const copyLayersToClipboard = (state: LayerState, action: CopyLayersToClipboard): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return copyLayerToClipboard(result, layerActions.copyLayerToClipboard({id: current}) as CopyLayerToClipboard);
  }, {...state, clipboard: {main: [], allIds: [], byId: {}}});
};

const getLayerCloneMap = (state: LayerState, id: string, fromClipboard?: boolean) => {
  const groups: string[] = [id];
  const layerCloneMap: {[id: string]: string} = {
    [id]: uuidv4()
  };
  let i = 0;
  while(i < groups.length) {
    const layer = fromClipboard ? state.clipboard.byId[groups[i]] : state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = fromClipboard ? state.clipboard.byId[child] : state.byId[child];
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
        layerCloneMap[child] = uuidv4();
      });
    }
    i++;
  }
  return layerCloneMap;
}

const clonePaperLayers = (state: LayerState, id: string, layerCloneMap: any, fromClipboard?: boolean, canvasImages?: { [id: string]: em.CanvasImage }) => {
  const paperLayer = fromClipboard ? paperMain.project.importJSON((() => {
    const layer = state.clipboard.byId[id];
    switch(layer.type) {
      case 'Image': {
        const imageBuffer = Buffer.from(canvasImages[layer.imageId].buffer);
        const imageBase64 = `data:image/webp;base64,${bufferToBase64(imageBuffer)}`;
        return layer.paperLayer.replace(`"source":"${layer.imageId}"`, `"source":"${imageBase64}"`);
      }
      default:
        return layer.paperLayer;
    }
  })()) : getPaperLayer(id);
  const parentLayer = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  const paperParentLayer = getPaperLayer(parentLayer.id);
  const paperLayerClone = paperLayer.clone({deep: false, insert: true});
  if (paperLayer.data.type === 'Artboard') {
    const artboardMask = paperLayer.getItem({ data: { id: 'ArtboardMask' }});
    const artboardMaskClone = artboardMask.clone({deep: false, insert: true});
    artboardMaskClone.parent = paperLayerClone;
    const artboardBackground = paperLayer.getItem({ data: { id: 'ArtboardBackground' }});
    const artboardBackgroundClone = artboardBackground.clone({deep: false, insert: true});
    artboardBackgroundClone.parent = paperLayerClone;
    applyArtboardMethods(artboardBackgroundClone);
  }
  if (paperLayer.data.type === 'Shape') {
    applyShapeMethods(paperLayerClone);
  }
  if (paperLayer.data.type === 'Text') {
    applyTextMethods(paperLayerClone);
  }
  if (paperLayer.data.type === 'Image') {
    const raster = paperLayer.getItem({ data: { id: 'Raster' }});
    const rasterClone = raster.clone({deep: false, insert: true});
    rasterClone.parent = paperLayerClone;
    applyImageMethods(rasterClone);
  }
  paperLayerClone.data.id = layerCloneMap[id];
  paperLayerClone.parent = paperParentLayer;
  const groups: string[] = [id];
  let i = 0;
  while(i < groups.length) {
    const layer = fromClipboard ? state.clipboard.byId[groups[i]] : state.byId[groups[i]];
    const groupClonePaperLayer = getPaperLayer(layerCloneMap[layer.id]);
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = fromClipboard ? state.clipboard.byId[child] : state.byId[child];
        const childPaperLayer = fromClipboard ? paperMain.project.importJSON((() => {
          switch(childLayer.type) {
            case 'Image': {
              const imageBuffer = Buffer.from(canvasImages[childLayer.imageId].buffer);
              const imageBase64 = `data:image/webp;base64,${bufferToBase64(imageBuffer)}`;
              return childLayer.paperLayer.replace(`"source":"${childLayer.imageId}"`, `"source":"${imageBase64}"`);
            }
            default:
              return childLayer.paperLayer;
          }
        })()) : getPaperLayer(child);
        const childPaperLayerClone = childPaperLayer.clone({deep: false, insert: true});
        childPaperLayerClone.data.id = layerCloneMap[child];
        childPaperLayerClone.parent = groupClonePaperLayer;
        if (childPaperLayer.data.type === 'Shape') {
          applyShapeMethods(childPaperLayerClone);
        }
        if (childPaperLayer.data.type === 'Text') {
          applyTextMethods(childPaperLayerClone);
        }
        if (childPaperLayer.data.type === 'Image') {
          const raster = childPaperLayer.getItem({ data: { id: 'Raster' }});
          const rasterClone = raster.clone({deep: false, insert: true});
          rasterClone.parent = childPaperLayerClone;
          applyImageMethods(rasterClone);
        }
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
      });
    }
    i++;
  }
}

const cloneLayerAndChildren = (state: LayerState, id: string, fromClipboard?: boolean, canvasImages?: { [id: string]: em.CanvasImage }) => {
  const layerCloneMap = getLayerCloneMap(state, id, fromClipboard);
  clonePaperLayers(state, id, layerCloneMap, fromClipboard, canvasImages);
  const rootLayer = fromClipboard ? state.clipboard.byId[id] : state.byId[id];
  const rootParent = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  return Object.keys(layerCloneMap).reduce((result: any, key: string, index: number) => {
    const layer = fromClipboard ? state.clipboard.byId[key] : state.byId[key];
    const cloneId = layerCloneMap[key];
    return {
      ...result,
      allIds: [...result.allIds, cloneId],
      byId: {
        ...result.byId,
        [cloneId]: {
          ...layer,
          id: layerCloneMap[key],
          parent: key === rootLayer.id ? rootParent.id : layerCloneMap[layer.parent],
          children: layer.children ? layer.children.reduce((childResult, current) => {
            return [...childResult, layerCloneMap[current]];
          }, []) : null,
          tweenEvents: [],
          tweens: []
        }
      }
    };
  }, {allIds: [], byId: {}});
}

export const pasteLayerFromClipboard = (payload: {state: LayerState; id: string; pasteOverSelection?: boolean; canvasImages?: { [id: string]: em.CanvasImage }}): LayerState => {
  let currentState = payload.state;
  currentState = duplicateLayer(currentState, layerActions.duplicateLayer({id: payload.id}) as DuplicateLayer, true, payload.canvasImages);
  const clonedLayerAndChildren = currentState.allIds.filter((id) => !payload.state.allIds.includes(id));
  // paste over selection is specified
  if (payload.pasteOverSelection && payload.state.selected.length > 0) {
    const selectionCenter = getSelectionCenter(payload.state);
    const clipboardCenter = getClipboardCenter(payload.state, payload.canvasImages);
    const paperLayer = getPaperLayer(clonedLayerAndChildren[0]);
    const paperLayerCenter = paperLayer.position;
    paperLayer.position.x = selectionCenter.x + (paperLayerCenter.x - clipboardCenter.x);
    paperLayer.position.y = selectionCenter.y + (paperLayerCenter.y - clipboardCenter.y);
    currentState = moveLayerTo(currentState, layerActions.moveLayerTo({id: clonedLayerAndChildren[0], x: paperLayer.position.x, y: paperLayer.position.y}) as MoveLayerTo);
  }
  return currentState;
};

export const pasteLayersFromClipboard = (state: LayerState, action: PasteLayersFromClipboard): LayerState => {
  let currentState = state;
  if (state.clipboard.allIds.length > 0) {
    currentState = currentState.clipboard.main.reduce((result: LayerState, current: string) => {
      return pasteLayerFromClipboard({
        state: result,
        id: current,
        pasteOverSelection: action.payload.overSelection,
        canvasImages: action.payload.canvasImageById
      });
    }, state);
    if (state.selected.length > 0) {
      currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: state.selected}) as DeselectLayers);
    }
  }
  return currentState;
};

export const updateParentBounds = (state: LayerState, id: string): LayerState => {
  const layerScope = getLayerScope(state, id);
  return layerScope.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    result = updateLayerInView(result, current);
    result = {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          }
        }
      },
      paperProject: exportProjectJSON(result, paperMain.project.exportJSON())
    }
    return result;
  }, state);
};

export const updateChildrenBounds = (state: LayerState, id: string): LayerState => {
  const layerDescendants = getLayerDescendants(state, id);
  return layerDescendants.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    result = updateLayerInView(result, current);
    result = {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          }
        }
      },
      paperProject: exportProjectJSON(result, paperMain.project.exportJSON())
    }
    return result;
  }, state);
};

export const updateLayerBounds = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(id);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [id]: {
        ...currentState.byId[id],
        frame: {
          x: paperLayer.position.x,
          y: paperLayer.position.y,
          width: paperLayer.bounds.width,
          height: paperLayer.bounds.height
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  currentState = updateLayerInView(currentState, id);
  currentState = updateParentBounds(currentState, id);
  if (state.byId[id].type === 'Group' || state.byId[id].type === 'Artboard') {
    currentState = updateChildrenBounds(currentState, id);
  }
  return currentState;
};

export const moveLayer = (state: LayerState, action: MoveLayer): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: paperLayer.position.x,
          y: paperLayer.position.y
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  //currentState = updateLayerTweens(currentState, action.payload.id);
  return updateParentBounds(currentState, action.payload.id);
};

export const moveLayers = (state: LayerState, action: MoveLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return moveLayer(result, layerActions.moveLayer({id: current}) as MoveLayer);
  }, state);
};

export const moveLayerTo = (state: LayerState, action: MoveLayerTo): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: paperLayer.position.x,
          y: paperLayer.position.y
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  //currentState = updateLayerTweens(currentState, action.payload.id);
  return updateParentBounds(currentState, action.payload.id);
};

export const moveLayersTo = (state: LayerState, action: MoveLayersTo): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return moveLayerTo(result, layerActions.moveLayerTo({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerTo);
  }, state);
};

export const moveLayerBy = (state: LayerState, action: MoveLayerBy): LayerState => {
  let currentState = state;
  //const paperLayer = getPaperLayer(action.payload.id);
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  currentState = updateLayerBounds(currentState, action.payload.id);
  // currentState = {
  //   ...currentState,
  //   byId: {
  //     ...currentState.byId,
  //     [action.payload.id]: {
  //       ...currentState.byId[action.payload.id],
  //       frame: {
  //         ...currentState.byId[action.payload.id].frame,
  //         x: paperLayer.position.x,
  //         y: paperLayer.position.y
  //       }
  //     }
  //   },
  //   paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  // }
  // //currentState = updateLayerTweens(currentState, action.payload.id);
  // currentState = updateParentBounds(currentState, action.payload.id);
  // if (currentState.byId[action.payload.id].type === 'Group') {
  //   currentState = updateChildrenBounds(currentState, action.payload.id);
  // }
  return currentState;
};

export const moveLayersBy = (state: LayerState, action: MoveLayersBy): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return moveLayerBy(result, layerActions.moveLayerBy({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerBy);
  }, state);
};

export const setLayerName = (state: LayerState, action: SetLayerName): LayerState => {
  let currentState = state;
  // update layer name
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        name: action.payload.name
      }
    }
  }
  return currentState;
  //return updateLayerTweens(currentState, action.payload.id);
};

export const setActiveArtboard = (state: LayerState, action: SetActiveArtboard): LayerState => {
  const activeArtboardState = {
    ...state,
    activeArtboard: action.payload.id
  }
  //updateActiveArtboardFrame(action.payload.id, action.payload.scope);
  return activeArtboardState;
};

export const addLayerTweenEvent = (state: LayerState, action: AddLayerTweenEvent): LayerState => {
  const artboardChildren = getLayerDescendants(state, action.payload.artboard);
  let currentState = state;
  // add animation event
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.layer]: {
        ...currentState.byId[action.payload.layer],
        tweenEvents: addItem(currentState.byId[action.payload.layer].tweenEvents, action.payload.id)
      }
    },
    allTweenEventIds: addItem(currentState.allTweenEventIds, action.payload.id),
    tweenEventById: {
      ...currentState.tweenEventById,
      [action.payload.id]: action.payload as em.TweenEvent
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  // add animation event tweens
  return artboardChildren.reduce((result, current) => {
    if (state.byId[current].type !== 'Group') {
      return addTweenEventLayerTweens(result, action.payload.id, current);
    } else {
      return result;
    }
  }, currentState);
};

export const addTweenEventLayerTweens = (state: LayerState, eventId: string, layerId: string): LayerState => {
  let currentState = state;
  const tweenEvent = currentState.tweenEventById[eventId];
  const artboardPaperLayer = getPaperLayer(tweenEvent.artboard);
  const destinationArtboardChildren = getLayerDescendants(currentState, tweenEvent.destinationArtboard);
  const destinationArtboardPaperLayer = getPaperLayer(tweenEvent.destinationArtboard);
  const destinationEquivalent = getDestinationEquivalent(currentState, layerId, destinationArtboardChildren);
  if (destinationEquivalent) {
    const currentPaperLayer = getPaperLayer(layerId);
    const equivalentPaperLayer = getPaperLayer(destinationEquivalent.id);
    const equivalentTweenProps = getEquivalentTweenProps(currentPaperLayer, equivalentPaperLayer, artboardPaperLayer, destinationArtboardPaperLayer);
    currentState = Object.keys(equivalentTweenProps).reduce((result, key: em.TweenProp) => {
      if (equivalentTweenProps[key]) {
        result = addLayerTween(result, layerActions.addLayerTween({
          layer: layerId,
          destinationLayer: destinationEquivalent.id,
          prop: key,
          event: eventId,
          ease: 'power1',
          power: 'out',
          duration: 0.5,
          delay: 0,
          frozen: false
        }) as AddLayerTween);
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const removeLayerTweenEvent = (state: LayerState, action: RemoveLayerTweenEvent): LayerState => {
  let currentState = state;
  const animEvent = state.tweenEventById[action.payload.id];
  // remove animation event tweens
  currentState = animEvent.tweens.reduce((result, current) => {
    return removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
  }, currentState);
  // remove animation event
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [animEvent.layer]: {
        ...currentState.byId[animEvent.layer],
        tweenEvents: removeItem(currentState.byId[animEvent.layer].tweenEvents, action.payload.id)
      }
    },
    allTweenEventIds: removeItem(currentState.allTweenEventIds, action.payload.id),
    tweenEventById: Object.keys(currentState.tweenEventById).reduce((result: any, key) => {
      if (key !== action.payload.id) {
        result[key] = currentState.tweenEventById[key];
      }
      return result;
    }, {}),
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  // return final state
  return currentState;
};

export const addLayerTween = (state: LayerState, action: AddLayerTween): LayerState => {
  return {
    ...state,
    tweenEventById: {
      ...state.tweenEventById,
      [action.payload.event]: {
        ...state.tweenEventById[action.payload.event],
        tweens: addItem(state.tweenEventById[action.payload.event].tweens, action.payload.id)
      }
    },
    byId: {
      ...state.byId,
      [action.payload.layer]: {
        ...state.byId[action.payload.layer],
        tweens: addItem(state.byId[action.payload.layer].tweens, action.payload.id)
      }
    },
    allTweenIds: addItem(state.allTweenIds, action.payload.id),
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: action.payload as em.Tween
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const removeLayerTween = (state: LayerState, action: RemoveLayerTween): LayerState => {
  const tween = state.tweenById[action.payload.id];
  return {
    ...state,
    tweenEventById: {
      ...state.tweenEventById,
      [tween.event]: {
        ...state.tweenEventById[tween.event],
        tweens: removeItem(state.tweenEventById[tween.event].tweens, action.payload.id)
      }
    },
    byId: {
      ...state.byId,
      [tween.layer]: {
        ...state.byId[tween.layer],
        tweens: removeItem(state.byId[tween.layer].tweens, action.payload.id)
      }
    },
    allTweenIds: removeItem(state.allTweenIds, action.payload.id),
    tweenById: Object.keys(state.tweenById).reduce((result: any, key) => {
      if (key !== action.payload.id) {
        result[key] = state.tweenById[key];
      }
      return result;
    }, {}),
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const updateLayerTweens = (state: LayerState, layerId: string): LayerState => {
  let currentState = state;
  const layer = currentState.byId[layerId];
  if (layer.type !== 'Artboard') {
    const tweensByLayerDestination = getTweensByDestinationLayer(currentState, layerId);
    const layerScope = getLayerScope(currentState, layerId);
    // remove layer tweens
    if (layer.tweens.length > 0) {
      currentState = layer.tweens.reduce((result, current) => {
        result = removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
        return result;
      }, currentState);
    }
    // remove layer tweens that have layer as destination
    if (tweensByLayerDestination.allIds.length > 0) {
      currentState = tweensByLayerDestination.allIds.reduce((result, current) => {
        result = removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
        return result;
      }, currentState);
    }
    // check if layer has artboard parent
    if (currentState.byId[layerScope[0]].type === 'Artboard') {
      const allArtboardTweenEvents = getAllArtboardTweenEvents(currentState, layerScope[0]);
      const tweensEventsByDestinationArtboard = getTweensEventsByDestinationArtboard(currentState, layerScope[0]);
      // add new layer tweens to all parent artboard tween events
      if (allArtboardTweenEvents.allIds.length > 0) {
        currentState = allArtboardTweenEvents.allIds.reduce((result, current) => {
          return addTweenEventLayerTweens(result, current, layerId);
        }, currentState);
      }
      // add new layer tweens to tween events with parent artboard as destination
      if (tweensEventsByDestinationArtboard.allIds.length > 0) {
        currentState = tweensEventsByDestinationArtboard.allIds.reduce((result, current) => {
          const tweenEvent = currentState.tweenEventById[current];
          const artboardChildren = getLayerDescendants(currentState, tweenEvent.artboard);
          const destinationEquivalent = getDestinationEquivalent(currentState, layerId, artboardChildren);
          if (destinationEquivalent) {
            result = addTweenEventLayerTweens(result, current, destinationEquivalent.id);
          }
          return result;
        }, currentState);
      }
    }
  }
  return currentState;
};

export const setLayerTweenDuration = (state: LayerState, action: SetLayerTweenDuration): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        duration: Math.round((action.payload.duration + Number.EPSILON) * 100) / 100
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const incrementLayerTweenDuration = (state: LayerState, action: IncrementLayerTweenDuration): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        duration: Math.round(((state.tweenById[action.payload.id].duration + (0.01 * (action.payload.factor ? action.payload.factor : 1))) + Number.EPSILON) * 100) / 100
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const decrementLayerTweenDuration = (state: LayerState, action: DecrementLayerTweenDuration): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        duration: Math.round(((state.tweenById[action.payload.id].duration - (0.01 * (action.payload.factor ? action.payload.factor : 1))) + Number.EPSILON) * 100) / 100
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const setLayerTweenDelay = (state: LayerState, action: SetLayerTweenDelay): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        delay: Math.round((action.payload.delay + Number.EPSILON) * 100) / 100
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const incrementLayerTweenDelay = (state: LayerState, action: IncrementLayerTweenDelay): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        delay: Math.round(((state.tweenById[action.payload.id].delay + (0.01 * (action.payload.factor ? action.payload.factor : 1))) + Number.EPSILON) * 100) / 100
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const decrementLayerTweenDelay = (state: LayerState, action: DecrementLayerTweenDelay): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        delay: Math.round(((state.tweenById[action.payload.id].delay - (0.01 * (action.payload.factor ? action.payload.factor : 1))) + Number.EPSILON) * 100) / 100
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const setLayerTweenEase = (state: LayerState, action: SetLayerTweenEase): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        ease: action.payload.ease
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const setLayerTweenPower = (state: LayerState, action: SetLayerTweenPower): LayerState => {
  return {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        power: action.payload.power
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
};

export const setLayerX = (state: LayerState, action: SetLayerX): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: action.payload.x
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  return updateParentBounds(currentState, action.payload.id);
};

export const setLayerY = (state: LayerState, action: SetLayerY): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          y: action.payload.y
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  return updateParentBounds(currentState, action.payload.id);
};

export const setLayerWidth = (state: LayerState, action: SetLayerWidth): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          width: action.payload.width
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  return updateParentBounds(currentState, action.payload.id);
};

export const setLayerHeight = (state: LayerState, action: SetLayerHeight): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          height: action.payload.height
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  return updateParentBounds(currentState, action.payload.id);
};

export const setLayerOpacity = (state: LayerState, action: SetLayerOpacity): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          opacity: action.payload.opacity
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerRotation = (state: LayerState, action: SetLayerRotation): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          rotation: action.payload.rotation
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  //updateActiveArtboardFrame(currentState.activeArtboard);
  updateSelectionFrame(currentState);
  return updateParentBounds(currentState, action.payload.id);
};

export const enableLayerHorizontalFlip = (state: LayerState, action: EnableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          horizontalFlip: true
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const disableLayerHorizontalFlip = (state: LayerState, action: DisableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          horizontalFlip: false
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const enableLayerVerticalFlip = (state: LayerState, action: EnableLayerVerticalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          verticalFlip: true
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const disableLayerVerticalFlip = (state: LayerState, action: DisableLayerVerticalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          verticalFlip: false
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const enableLayerFill = (state: LayerState, action: EnableLayerFill): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const fill = currentState.byId[action.payload.id].style.fill;
  switch(fill.fillType) {
    case 'color':
      paperLayer.fillColor = new paperMain.Color(fill.color);
      break;
    case 'gradient':
      paperLayer.fillColor = {
        gradient: {
          stops: getGradientStops(fill.gradient.stops),
          radial: fill.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(action.payload.id, fill.gradient.origin),
        destination: getGradientDestinationPoint(action.payload.id, fill.gradient.destination)
      }
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            enabled: true
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const disableLayerFill = (state: LayerState, action: DisableLayerFill): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.fillColor = null;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            enabled: false
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillColor = (state: LayerState, action: SetLayerFillColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.fillColor = new paperMain.Color(action.payload.fillColor);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            color: action.payload.fillColor
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const enableLayerStroke = (state: LayerState, action: EnableLayerStroke): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const stroke = currentState.byId[action.payload.id].style.stroke;
  switch(stroke.fillType) {
    case 'color':
      paperLayer.strokeColor = new paperMain.Color(stroke.color);
      break;
    case 'gradient':
      paperLayer.strokeColor = {
        gradient: {
          stops: getGradientStops(stroke.gradient.stops),
          radial: stroke.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(action.payload.id, stroke.gradient.origin),
        destination: getGradientDestinationPoint(action.payload.id, stroke.gradient.destination)
      }
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            enabled: true
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const disableLayerStroke = (state: LayerState, action: DisableLayerStroke): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.strokeColor = null;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            enabled: false
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeColor = (state: LayerState, action: SetLayerStrokeColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.strokeColor = new paperMain.Color(action.payload.strokeColor);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            color: action.payload.strokeColor
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeFillType = (state: LayerState, action: SetLayerStrokeFillType): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const stroke = layerItem.style.stroke;
  switch(action.payload.fillType) {
    case 'color':
      paperLayer.strokeColor = new paperMain.Color(stroke.color);
      break;
    case 'gradient':
      paperLayer.strokeColor = {
        gradient: {
          stops: getGradientStops(stroke.gradient.stops),
          radial: stroke.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(action.payload.id, stroke.gradient.origin),
        destination: getGradientDestinationPoint(action.payload.id, stroke.gradient.destination)
      }
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            fillType: action.payload.fillType
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeGradient = (state: LayerState, action: SetLayerStrokeGradient): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.strokeColor = {
    gradient: {
      stops: getGradientStops(action.payload.gradient.stops),
      radial: action.payload.gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(action.payload.id, action.payload.gradient.origin),
    destination: getGradientDestinationPoint(action.payload.id, action.payload.gradient.destination)
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            gradient: action.payload.gradient
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeGradientType = (state: LayerState, action: SetLayerStrokeGradientType): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  switch(action.payload.gradientType) {
    case 'linear':
      paperLayer.strokeColor.gradient.radial = false;
      break;
    case 'radial':
      paperLayer.strokeColor.gradient.radial = true;
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            gradient: {
              ...currentState.byId[action.payload.id].style.stroke.gradient,
              gradientType: action.payload.gradientType
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeWidth = (state: LayerState, action: SetLayerStrokeWidth): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.strokeWidth = action.payload.strokeWidth;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          stroke: {
            ...currentState.byId[action.payload.id].style.stroke,
            width: action.payload.strokeWidth
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeCap = (state: LayerState, action: SetLayerStrokeCap): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.strokeCap = action.payload.strokeCap;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            cap: action.payload.strokeCap
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeJoin = (state: LayerState, action: SetLayerStrokeJoin): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.strokeJoin = action.payload.strokeJoin;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            join: action.payload.strokeJoin
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeDashArray = (state: LayerState, action: SetLayerStrokeDashArray): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.dashArray = action.payload.strokeDashArray;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            dashArray: action.payload.strokeDashArray
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerStrokeMiterLimit = (state: LayerState, action: SetLayerStrokeMiterLimit): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          strokeOptions: {
            ...currentState.byId[action.payload.id].style.strokeOptions,
            miterLimit: action.payload.miterLimit
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const enableLayerShadow = (state: LayerState, action: EnableLayerShadow): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  const shadow = layerItem.style.shadow;
  paperLayer.shadowColor = new paperMain.Color(shadow.color);
  paperLayer.shadowBlur = shadow.blur;
  paperLayer.shadowOffset = new paperMain.Point(shadow.offset.x, shadow.offset.y);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            enabled: true
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const disableLayerShadow = (state: LayerState, action: DisableLayerShadow): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.shadowColor = null;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            enabled: false
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerShadowColor = (state: LayerState, action: SetLayerShadowColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.shadowColor = new paperMain.Color(action.payload.shadowColor);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            color: action.payload.shadowColor
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerShadowBlur = (state: LayerState, action: SetLayerShadowBlur): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.shadowBlur = action.payload.shadowBlur;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            blur: action.payload.shadowBlur
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerShadowXOffset = (state: LayerState, action: SetLayerShadowXOffset): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.shadowOffset.x = action.payload.shadowXOffset;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              x: action.payload.shadowXOffset
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerShadowYOffset = (state: LayerState, action: SetLayerShadowYOffset): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.shadowOffset.y = action.payload.shadowYOffset;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          shadow: {
            ...currentState.byId[action.payload.id].style.shadow,
            offset: {
              ...currentState.byId[action.payload.id].style.shadow.offset,
              y: action.payload.shadowYOffset
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const resizeLayer = (state: LayerState, action: ResizeLayer): LayerState => {
  let currentState = state;
  const layer = currentState.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id);
  if (layer.type === 'Shape') {
    const clone = paperLayer.clone({insert: false}) as paper.PathItem;
    clone.fitBounds(new paperMain.Rectangle({
      point: new paperMain.Point(0,0),
      size: new paperMain.Size(24,24)
    }));
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: clone.pathData,
          style: {
            ...currentState.byId[action.payload.id].style,
            horizontalFlip: action.payload.horizontalFlip ? !currentState.byId[action.payload.id].style.horizontalFlip : currentState.byId[action.payload.id].style.horizontalFlip,
            verticalFlip: action.payload.verticalFlip ? !currentState.byId[action.payload.id].style.verticalFlip : currentState.byId[action.payload.id].style.verticalFlip
          }
        } as em.Shape
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          style: {
            ...currentState.byId[action.payload.id].style,
            horizontalFlip: action.payload.horizontalFlip ? !currentState.byId[action.payload.id].style.horizontalFlip : currentState.byId[action.payload.id].style.horizontalFlip,
            verticalFlip: action.payload.verticalFlip ? !currentState.byId[action.payload.id].style.verticalFlip : currentState.byId[action.payload.id].style.verticalFlip
          }
        }
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const resizeLayers = (state: LayerState, action: ResizeLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return resizeLayer(result, layerActions.resizeLayer({id: current, verticalFlip: action.payload.verticalFlip, horizontalFlip: action.payload.horizontalFlip}) as ResizeLayer);
  }, state);
};

export const setLayerText = (state: LayerState, action: SetLayerText): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  paperLayer.content = action.payload.text;
  if (!paperLayer.visible) {
    paperLayer.visible = true;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        text: action.payload.text
      } as em.Text
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  updateSelectionFrame(currentState);
  return updateLayerBounds(currentState, action.payload.id);
};

export const setLayerFontSize = (state: LayerState, action: SetLayerFontSize): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  paperLayer.fontSize = action.payload.fontSize;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as em.Text).textStyle,
          fontSize: action.payload.fontSize
        }
      } as em.Text
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  updateSelectionFrame(currentState);
  return updateLayerBounds(currentState, action.payload.id);
};

export const setLayerFontWeight = (state: LayerState, action: SetLayerFontWeight): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  paperLayer.fontWeight = action.payload.fontWeight;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as em.Text).textStyle,
          fontWeight: action.payload.fontWeight
        }
      } as em.Text
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  updateSelectionFrame(currentState);
  return updateLayerBounds(currentState, action.payload.id);
};

export const setLayerFontFamily = (state: LayerState, action: SetLayerFontFamily): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  paperLayer.fontFamily = action.payload.fontFamily;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as em.Text).textStyle,
          fontFamily: action.payload.fontFamily
        }
      } as em.Text
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  updateSelectionFrame(currentState);
  return updateLayerBounds(currentState, action.payload.id);
};

export const setLayerLeading = (state: LayerState, action: SetLayerLeading): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  paperLayer.leading = action.payload.leading;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as em.Text).textStyle,
          leading: action.payload.leading
        }
      } as em.Text
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  updateSelectionFrame(currentState);
  return updateLayerBounds(currentState, action.payload.id);
};

export const setLayerJustification = (state: LayerState, action: SetLayerJustification): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  const prevJustification = paperLayer.justification;
  paperLayer.justification = action.payload.justification;
  switch(prevJustification) {
    case 'left':
      switch(action.payload.justification) {
        case 'left':
          break;
        case 'center':
          paperLayer.position.x += paperLayer.bounds.width / 2
          break;
        case 'right':
          paperLayer.position.x += paperLayer.bounds.width
          break;
      }
      break;
    case 'center':
      switch(action.payload.justification) {
        case 'left':
          paperLayer.position.x -= paperLayer.bounds.width / 2
          break;
        case 'center':
          break;
        case 'right':
          paperLayer.position.x += paperLayer.bounds.width / 2
          break;
      }
      break;
    case 'right':
      switch(action.payload.justification) {
        case 'left':
          paperLayer.position.x -= paperLayer.bounds.width;
          break;
        case 'center':
          paperLayer.position.x -= paperLayer.bounds.width / 2;
          break;
        case 'right':
          break;
      }
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as em.Text).textStyle,
          justification: action.payload.justification
        }
      } as em.Text
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  updateSelectionFrame(currentState);
  return updateLayerBounds(currentState, action.payload.id);
};

export const addInViewLayer = (state: LayerState, action: AddInViewLayer): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    inView: {
      ...currentState.inView,
      allIds: addItem(currentState.inView.allIds, action.payload.id),
      snapPoints: [...currentState.inView.snapPoints, ...getLayerSnapPoints(action.payload.id)]
    }
  }
  return currentState;
};

export const addInViewLayers = (state: LayerState, action: AddInViewLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return addInViewLayer(result, layerActions.addInViewLayer({id: current}) as AddInViewLayer);
  }, state);
};

export const removeInViewLayer = (state: LayerState, action: RemoveInViewLayer): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    inView: {
      ...currentState.inView,
      allIds: removeItem(currentState.inView.allIds, action.payload.id),
      snapPoints: currentState.inView.snapPoints.filter((snapPoint) => snapPoint.id !== action.payload.id)
    }
  }
  return currentState;
};

export const removeInViewLayers = (state: LayerState, action: RemoveInViewLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return removeInViewLayer(result, layerActions.removeInViewLayer({id: current}) as RemoveInViewLayer);
  }, state);
};

// utility to update inView layer after bounds change
export const updateLayerInView = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(id);
  if (paperMain.view.bounds.intersects(paperLayer.bounds)) {
    if (currentState.inView.allIds.includes(id)) {
      currentState = removeInViewLayer(currentState, layerActions.removeInViewLayer({id}) as RemoveInViewLayer);
    }
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id}) as AddInViewLayer);
  }
  if (!paperMain.view.bounds.intersects(paperLayer.bounds) && currentState.inView.allIds.includes(id)) {
    currentState = removeInViewLayer(currentState, layerActions.removeInViewLayer({id}) as RemoveInViewLayer);
  }
  return currentState;
};

export const updateInViewLayers = (state: LayerState, action: UpdateInViewLayers): LayerState => {
  let currentState = state;
  // get in view layers
  const visibleLayers = paperMain.project.getItem({data: { id: 'page' }}).getItems({
    overlapping: paperMain.view.bounds
  });
  const visibleLayerIds = visibleLayers.reduce((result, current) => {
    if (current.data.id !== 'ArtboardBackground' && current.data.id !== 'ArtboardMask') {
      result = [...result, current.data.id];
    }
    return result;
  }, []);
  // remove out of view layers
  currentState = currentState.inView.allIds.reduce((result, current) => {
    if (!visibleLayerIds.includes(current)) {
      result = removeInViewLayer(result, layerActions.removeInViewLayer({id: current}) as RemoveInViewLayer);
    }
    return result;
  }, currentState);
  // add new in view layers
  currentState = visibleLayerIds.reduce((result, current) => {
    if (!currentState.inView.allIds.includes(current)) {
      result = addInViewLayer(result, layerActions.addInViewLayer({id: current}) as AddInViewLayer);
    }
    return result;
  }, currentState);
  return currentState;
};

export const setLayerFill = (state: LayerState, action: SetLayerFill): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const fill = action.payload.fill;
  switch(fill.fillType) {
    case 'color':
      paperLayer.fillColor = new paperMain.Color(fill.color);
      break;
    case 'gradient':
      paperLayer.fillColor = {
        gradient: {
          stops: getGradientStops(fill.gradient.stops),
          radial: layerItem.style.fill.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(action.payload.id, fill.gradient.origin),
        destination: getGradientDestinationPoint(action.payload.id, fill.gradient.destination)
      }
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: fill
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillType = (state: LayerState, action: SetLayerFillType): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const fill = layerItem.style.fill;
  switch(action.payload.fillType) {
    case 'color':
      paperLayer.fillColor = new paperMain.Color(fill.color);
      break;
    case 'gradient':
      paperLayer.fillColor = {
        gradient: {
          stops: getGradientStops(fill.gradient.stops),
          radial: layerItem.style.fill.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(action.payload.id, fill.gradient.origin),
        destination: getGradientDestinationPoint(action.payload.id, fill.gradient.destination)
      }
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            fillType: action.payload.fillType
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillGradient = (state: LayerState, action: SetLayerFillGradient): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.fillColor = {
    gradient: {
      stops: getGradientStops(action.payload.gradient.stops),
      radial: action.payload.gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(action.payload.id, action.payload.gradient.origin),
    destination: getGradientDestinationPoint(action.payload.id, action.payload.gradient.destination)
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: action.payload.gradient
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillGradientType = (state: LayerState, action: SetLayerFillGradientType): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  switch(action.payload.gradientType) {
    case 'linear':
      paperLayer.fillColor.gradient.radial = false;
      break;
    case 'radial':
      paperLayer.fillColor.gradient.radial = true;
      break;
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              gradientType: action.payload.gradientType
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillGradientOrigin = (state: LayerState, action: SetLayerFillGradientOrigin): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.fillColor.origin = getGradientOriginPoint(action.payload.id, action.payload.origin);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              origin: action.payload.origin
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillGradientDestination = (state: LayerState, action: SetLayerFillGradientDestination): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.fillColor.destination = getGradientDestinationPoint(action.payload.id, action.payload.destination);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              destination: action.payload.destination
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillGradientStopColor = (state: LayerState, action: SetLayerFillGradientStopColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.fillColor.gradient.stops[action.payload.stopIndex].color = new paper.Color(action.payload.color);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              stops: currentState.byId[action.payload.id].style.fill.gradient.stops.map((gradient, index) => {
                if (index === action.payload.stopIndex) {
                  gradient.color = action.payload.color;
                }
                return gradient;
              })
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const setLayerFillGradientStopPosition = (state: LayerState, action: SetLayerFillGradientStopPosition): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.fillColor.gradient.stops[action.payload.stopIndex].offset = action.payload.position;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              stops: currentState.byId[action.payload.id].style.fill.gradient.stops.map((gradient, index) => {
                if (index === action.payload.stopIndex) {
                  gradient.position = action.payload.position;
                }
                return gradient;
              })
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const addLayerFillGradientStop = (state: LayerState, action: AddLayerFillGradientStop): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              stops: [...currentState.byId[action.payload.id].style.fill.gradient.stops, action.payload.gradientStop]
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const fill = layerItem.style.fill;
  paperLayer.fillColor = {
    gradient: {
      stops: getGradientStops(fill.gradient.stops),
      radial: layerItem.style.fill.gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(action.payload.id, fill.gradient.origin),
    destination: getGradientDestinationPoint(action.payload.id, fill.gradient.destination)
  }
  return currentState;
};

export const removeLayerFillGradientStop = (state: LayerState, action: RemoveLayerFillGradientStop): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          fill: {
            ...currentState.byId[action.payload.id].style.fill,
            gradient: {
              ...currentState.byId[action.payload.id].style.fill.gradient,
              stops: currentState.byId[action.payload.id].style.fill.gradient.stops.filter((gradient, index) => {
                if (index !== action.payload.stopIndex) {
                  return gradient;
                }
              })
            }
          }
        }
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const fill = layerItem.style.fill;
  paperLayer.fillColor = {
    gradient: {
      stops: getGradientStops(fill.gradient.stops),
      radial: layerItem.style.fill.gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(action.payload.id, fill.gradient.origin),
    destination: getGradientDestinationPoint(action.payload.id, fill.gradient.destination)
  }
  return currentState;
};

export const addLayersMask = (state: LayerState, action: AddLayersMask): LayerState => {
  let currentState = state;
  // group layers
  currentState = groupLayers(currentState, layerActions.groupLayers(action.payload) as GroupLayers);
  // get mask and group
  const maskGroup = currentState.allGroupIds[currentState.allGroupIds.length - 1];
  const mask = currentState.byId[maskGroup].children[0];
  // set paper layer clipMask
  const maskPaperLayer = getPaperLayer(mask);
  const maskGroupPaperLayer = getPaperLayer(maskGroup);
  maskPaperLayer.clipMask = true;
  // hack to get paper to update to clipped group bounds
  maskGroupPaperLayer.position.x += 1;
  maskGroupPaperLayer.position.x -= 1;
  // set mask
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [mask]: {
        ...currentState.byId[mask],
        mask: true
      },
      [maskGroup] : {
        ...currentState.byId[maskGroup],
        clipped: true
      } as em.Group
    }
  };
  // rename group
  currentState = setLayerName(currentState, layerActions.setLayerName({id: maskGroup, name: 'Masked Group'}) as SetLayerName);
  // rename mask
  currentState = setLayerName(currentState, layerActions.setLayerName({id: mask, name: 'Mask'}) as SetLayerName);
  // mask layers
  currentState = maskLayers(currentState, layerActions.maskLayers({layers: currentState.byId[maskGroup].children.filter((id) => id !== mask)}) as MaskLayers);
  // update masked group bounds
  currentState = updateLayerBounds(currentState, maskGroup);
  // update selection frame
  updateSelectionFrame(currentState);
  // return final state
  return currentState;
};

export const removeLayersMask = (state: LayerState, action: RemoveLayersMask): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const parentLayerItem = state.byId[layerItem.parent];
  const paperLayer = getPaperLayer(action.payload.id);
  if (layerItem.style.fill.enabled) {
    currentState = enableLayerFill(currentState, layerActions.enableLayerFill({id: action.payload.id}) as EnableLayerFill);
  } else if (layerItem.style.stroke.enabled) {
    currentState = enableLayerStroke(currentState, layerActions.enableLayerStroke({id: action.payload.id}) as EnableLayerStroke);
  } else if (layerItem.style.shadow.enabled) {
    currentState = enableLayerShadow(currentState, layerActions.enableLayerShadow({id: action.payload.id}) as EnableLayerShadow);
  }
  paperLayer.clipMask = false;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        mask: false
      },
      [layerItem.parent] : {
        ...currentState.byId[layerItem.parent],
        clipped: false
      } as em.Group
    }
  };
  currentState = unmaskLayers(currentState, layerActions.unmaskLayers({layers: parentLayerItem.children}) as UnmaskLayers);
  return currentState;
};

export const maskLayer = (state: LayerState, action: MaskLayer): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        masked: true
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const maskLayers = (state: LayerState, action: MaskLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return maskLayer(result, layerActions.maskLayer({id: current}) as MaskLayer);
  }, state);
};

export const unmaskLayer = (state: LayerState, action: UnmaskLayer): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        masked: false
      }
    },
    paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
  }
  return currentState;
};

export const unmaskLayers = (state: LayerState, action: UnmaskLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return unmaskLayer(result, layerActions.unmaskLayer({id: current}) as UnmaskLayer);
  }, state);
};

export const alignLayersToLeft = (state: LayerState, action: AlignLayersToLeft): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.left = layersBounds.left;
    updateSelectionFrame(currentState);
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  return currentState;
};

export const alignLayersToRight = (state: LayerState, action: AlignLayersToRight): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.right = layersBounds.right;
    updateSelectionFrame(currentState);
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  return currentState;
};

export const alignLayersToTop = (state: LayerState, action: AlignLayersToTop): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.top = layersBounds.top;
    updateSelectionFrame(currentState);
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  return currentState;
};

export const alignLayersToBottom = (state: LayerState, action: AlignLayersToBottom): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.bottom = layersBounds.bottom;
    updateSelectionFrame(currentState);
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  return currentState;
};

export const alignLayersToCenter = (state: LayerState, action: AlignLayersToCenter): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.center.x = layersBounds.center.x;
    updateSelectionFrame(currentState);
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  return currentState;
};

export const alignLayersToMiddle = (state: LayerState, action: AlignLayersToMiddle): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.center.y = layersBounds.center.y;
    updateSelectionFrame(currentState);
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  return currentState;
};

export const distributeLayersHorizontally = (state: LayerState, action: DistributeLayersHorizontally): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  const layersWidth = action.payload.layers.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    result = result + paperLayer.bounds.width;
    return result;
  }, 0);
  const diff = (layersBounds.width - layersWidth) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByLeft(action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const paperLayer = getPaperLayer(current);
      const prevLayer = orderedLayers[index - 1];
      const prevPaperLayer = getPaperLayer(prevLayer);
      paperLayer.bounds.left = prevPaperLayer.bounds.right + diff;
      updateSelectionFrame(currentState);
      result = updateLayerBounds(result, current);
    }
    return result;
  }, currentState);
  return currentState;
};

export const distributeLayersVertically = (state: LayerState, action: DistributeLayersVertically): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(action.payload.layers);
  const layersHeight = action.payload.layers.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    result = result + paperLayer.bounds.height;
    return result;
  }, 0);
  const diff = (layersBounds.height - layersHeight) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByTop(action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const paperLayer = getPaperLayer(current);
      const prevLayer = orderedLayers[index - 1];
      const prevPaperLayer = getPaperLayer(prevLayer);
      paperLayer.bounds.top = prevPaperLayer.bounds.bottom + diff;
      updateSelectionFrame(currentState);
      result = updateLayerBounds(result, current);
    }
    return result;
  }, currentState);
  return currentState;
};

export const duplicateLayer = (state: LayerState, action: DuplicateLayer, fromClipboard?: boolean, canvasImages?: { [id: string]: em.CanvasImage }): LayerState => {
  let currentState = state;
  const clonedLayerAndChildren = cloneLayerAndChildren(currentState, action.payload.id, fromClipboard, canvasImages);
  const rootLayer = clonedLayerAndChildren.byId[clonedLayerAndChildren.allIds[0]];
  currentState = clonedLayerAndChildren.allIds.reduce((result: LayerState, current: string, index: number) => {
    const layer = clonedLayerAndChildren.byId[current];
    const layerParent = getLayer(result, layer.parent);
    // add layer to type array
    switch(layer.type) {
      case 'Artboard':
        result = {
          ...result,
          allArtboardIds: addItem(result.allArtboardIds, current)
        }
        break;
      case 'Shape':
        result = {
          ...result,
          allShapeIds: addItem(result.allShapeIds, current)
        }
        break;
      case 'Group':
        result = {
          ...result,
          allGroupIds: addItem(result.allGroupIds, current)
        }
        break;
      case 'Text':
        result = {
          ...result,
          allTextIds: addItem(result.allTextIds, current)
        }
        break;
      case 'Image':
        result = {
          ...result,
          allImageIds: addItem(result.allImageIds, current)
        }
        break;
    }
    // update inView layers
    result = updateLayerInView(result, current);
    // add layer
    return {
      ...result,
      allIds: addItem(result.allIds, current),
      byId: {
        ...result.byId,
        [current]: layer,
        [layerParent.id]: {
          ...result.byId[layerParent.id],
          children: index === 0 ? addItem(result.byId[layerParent.id].children, current) : result.byId[layerParent.id].children
        }
      },
      paperProject: exportProjectJSON(currentState, paperMain.project.exportJSON())
    }
  }, currentState);
  // select layer
  currentState = selectLayer(currentState, layerActions.selectLayer({id: rootLayer.id}) as SelectLayer);
  // return final state
  return currentState;
};

export const duplicateLayers = (state: LayerState, action: DuplicateLayers, fromClipboard?: boolean): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return duplicateLayer(result, layerActions.duplicateLayer({id: current}) as DuplicateLayer, fromClipboard);
  }, currentState);
  if (state.selected.length > 0) {
    currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: state.selected}) as DeselectLayers);
  }
  return currentState;
};

export const removeDuplicatedLayers = (state: LayerState, action: RemoveDuplicatedLayers): LayerState => {
  let currentState = state;
  // remove duplicates
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  // select layer
  if (action.payload.newSelection) {
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.newSelection}) as SelectLayers);
  }
  // return final state
  return currentState;
};

export const sendLayerForward = (state: LayerState, action: SendLayerForward): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== parentItem.children.length - 1) {
    currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: layerIndex + 1}) as InsertLayerChild);
  }
  return currentState;
};

export const sendLayersForward = (state: LayerState, action: SendLayersForward): LayerState => {
  let currentState = state;
  currentState = orderLayersByDepth(currentState, action.payload.layers).reverse().reduce((result, current) => {
    return sendLayerForward(result, layerActions.sendLayerForward({id: current}) as SendLayerForward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  return currentState;
};

export const sendLayerToFront = (state: LayerState, action: SendLayerToFront): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== parentItem.children.length - 1) {
    currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: parentItem.children.length - 1}) as InsertLayerChild);
  }
  return currentState;
};

export const sendLayersToFront = (state: LayerState, action: SendLayersToFront): LayerState => {
  let currentState = state;
  currentState = orderLayersByDepth(currentState, action.payload.layers).reverse().reduce((result, current) => {
    return sendLayerToFront(result, layerActions.sendLayerToFront({id: current}) as SendLayerToFront);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  return currentState;
};

export const sendLayerBackward = (state: LayerState, action: SendLayerBackward): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== 0) {
    currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: layerIndex - 1}) as InsertLayerChild);
  }
  return currentState;
};

export const sendLayersBackward = (state: LayerState, action: SendLayersBackward): LayerState => {
  let currentState = state;
  currentState = orderLayersByDepth(currentState, action.payload.layers).reduce((result, current) => {
    return sendLayerBackward(result, layerActions.sendLayerBackward({id: current}) as SendLayerBackward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  return currentState;
};

export const sendLayerToBack = (state: LayerState, action: SendLayerToBack): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== 0) {
    currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: 0}) as InsertLayerChild);
  }
  return currentState;
};

export const sendLayersToBack = (state: LayerState, action: SendLayersToBack): LayerState => {
  let currentState = state;
  currentState = orderLayersByDepth(currentState, action.payload.layers).reduce((result, current) => {
    return sendLayerToBack(result, layerActions.sendLayerToBack({id: current}) as SendLayerToBack);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  return currentState;
};