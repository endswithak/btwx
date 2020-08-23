/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import tinyColor from 'tinycolor2';
import { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { addItem, removeItem, insertItem, moveItemAbove, moveItemBelow } from './general';

import {
  AddPage, AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer,
  AddLayerChild, InsertLayerChild, InsertLayerAbove, InsertLayerBelow, GroupLayers, UngroupLayers, UngroupLayer,
  DeselectAllLayers, RemoveLayers, HideLayerChildren, ShowLayerChildren,
  DecreaseLayerScope, NewLayerScope, SetLayerHover, ClearLayerScope, IncreaseLayerScope,
  CopyLayerToClipboard, CopyLayersToClipboard, PasteLayersFromClipboard, SelectLayers,
  DeselectLayers, MoveLayerTo, MoveLayerBy, MoveLayersTo, MoveLayersBy, DeepSelectLayer, EscapeLayerScope,
  MoveLayer, MoveLayers, AddArtboard, SetLayerName, SetActiveArtboard, AddLayerTween, RemoveLayerTween,
  AddLayerTweenEvent, RemoveLayerTweenEvent, SetLayerTweenDuration, SetLayerTweenDelay, SetLayerTweenEase,
  SetLayerTweenPower, SetLayerX, SetLayerY, SetLayerWidth, SetLayerHeight, SetLayerOpacity, SetLayerFillColor,
  SetLayerStrokeColor, SetLayerStrokeWidth, SetLayerShadowColor, SetLayerShadowBlur, SetLayerShadowXOffset,
  SetLayerShadowYOffset, SetLayerRotation, EnableLayerFill, DisableLayerFill, EnableLayerStroke,
  DisableLayerStroke, DisableLayerShadow, EnableLayerShadow, SetLayerStrokeCap, SetLayerStrokeJoin,
  SetLayerStrokeDashArray, SetLayerStrokeMiterLimit, ScaleLayer, ScaleLayers, EnableLayerHorizontalFlip,
  DisableLayerHorizontalFlip, EnableLayerVerticalFlip, DisableLayerVerticalFlip, AddText, SetLayerText,
  SetLayerFontSize, SetLayerFontWeight, SetLayerFontFamily, SetLayerLeading, SetLayerJustification,
  AddInViewLayer, AddInViewLayers, RemoveInViewLayer, RemoveInViewLayers, UpdateInViewLayers, SetLayerFillType,
  SetLayerStrokeFillType, AddLayersMask, MaskLayer, MaskLayers, UnmaskLayers, UnmaskLayer, RemoveLayersMask, SetLayerFill, AlignLayersToLeft,
  AlignLayersToRight, AlignLayersToTop, AlignLayersToBottom, AlignLayersToCenter, AlignLayersToMiddle,
  DistributeLayersHorizontally, DistributeLayersVertically, DuplicateLayer, DuplicateLayers, RemoveDuplicatedLayers,
  SendLayerForward, SendLayerBackward, SendLayersForward, SendLayersBackward, SendLayerToFront, SendLayersToFront,
  SendLayerToBack, SendLayersToBack, AddImage, InsertLayersAbove, InsertLayersBelow, AddLayerChildren, SetLayerBlendMode,
  AddCompoundShape, UniteLayers, SetRoundedRadius, SetPolygonSides, SetStarPoints, IntersectLayers,
  SubtractLayers, ExcludeLayers, DivideLayers, SetStarRadius, SetLayerStrokeDashOffset, SetLayersOpacity,
  SetLayersBlendMode, SetLayersX, SetLayersY, SetLayersWidth, SetLayersHeight, SetLayersRotation, SetLayersFillColor,
  SetLayersStrokeColor, SetLayersShadowColor, EnableLayersFill, DisableLayersFill, EnableLayersStroke, DisableLayersStroke,
  EnableLayersShadow, DisableLayersShadow, SetLayersFillType, SetLayersStrokeFillType, SetLayersStrokeWidth, SetLayersStrokeCap,
  SetLayersStrokeJoin, SetLayersStrokeDashOffset, SetLayersStrokeDashArray, SetLayerStrokeDashArrayWidth, SetLayersStrokeDashArrayWidth,
  SetLayerStrokeDashArrayGap, SetLayersStrokeDashArrayGap, SetLayerGradient, SetLayersGradient, SetLayerGradientType, SetLayersGradientType,
  SetLayerGradientOrigin, SetLayersGradientOrigin, SetLayerGradientDestination, SetLayersGradientDestination, SetLayerGradientStopColor,
  SetLayersGradientStopColor, SetLayerGradientStopPosition, SetLayersGradientStopPosition, AddLayerGradientStop, AddLayersGradientStop,
  RemoveLayerGradientStop, RemoveLayersGradientStop, SetLayerActiveGradientStop, SetLayersShadowBlur, SetLayersShadowXOffset, SetLayersShadowYOffset, SetLayersFontSize,
  SetLayersFontWeight, SetLayersFontFamily, SetLayersLeading, SetLayersJustification, SetLayerTweenTiming, SetCurvePointOriginX, SetCurvePointOriginY, SetCurvePointOrigin, SetRoundedRadii, SetPolygonsSides, SetStarsPoints, SetStarsRadius, SetLayerEdit
} from '../actionTypes/layer';

import {
  getLayerIndex, getLayer, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor,
  getLayerScope, getPaperLayer, getSelectionTopLeft, getSelectionBottomRight, getClipboardCenter,
  getSelectionCenter, getLayerAndDescendants, getLayerDescendants, getDestinationEquivalent, getEquivalentTweenProps,
  getTweensByDestinationLayer, getAllArtboardTweenEvents, getTweensEventsByDestinationArtboard, getTweensByLayer,
  getLayersBounds, getGradientOriginPoint, getGradientDestinationPoint, getGradientStops, getLayerSnapPoints,
  orderLayersByDepth, orderLayersByLeft, orderLayersByTop, savePaperProjectJSON, getTweensByProp,
  getEquivalentTweenProp, getTweensWithLayer, gradientsMatch, getPaperProp, getCurvePoints, getArtboardsTopTop, getSelectionBounds,
  getTweenEventsWithArtboard
} from '../selectors/layer';

import { paperMain } from '../../canvas';

import { applyShapeMethods } from '../../canvas/shapeUtils';
import { applyTextMethods } from '../../canvas/textUtils';
import { applyArtboardMethods } from '../../canvas/artboardUtils';
import { applyImageMethods } from '../../canvas/imageUtils';

import { THEME_PRIMARY_COLOR, DEFAULT_TRANSFORM } from '../../constants';
import { bufferToBase64 } from '../../utils';
import MeasureGuide from '../../canvas/measureGuide';
import getTheme from '../theme';
import store from '../index';
import { setTweenDrawerEventHover, setTweenDrawerEvent, openTweenDrawer } from '../actions/tweenDrawer';

export const addPage = (state: LayerState, action: AddPage): LayerState => {
  return {
    ...state,
    allIds: addItem(state.allIds, action.payload.id),
    byId: {
      ...state.byId,
      [action.payload.id]: action.payload as em.Page
    },
    page: action.payload.id,
    paperProject: savePaperProjectJSON(state)
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
    allArtboardIds: addItem(currentState.allArtboardIds, action.payload.id)
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const updateActiveArtboardFrame = (state: LayerState, useLayerItem = false): void => {
  const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'activeArtboardFrame' } });
  if (activeArtboardFrame) {
    activeArtboardFrame.remove();
  }
  if (state.activeArtboard) {
    let topLeft;
    let bottomRight;
    if (useLayerItem) {
      const layerItem = state.byId[state.activeArtboard];
      topLeft = new paperMain.Point(layerItem.frame.x - (layerItem.frame.width / 2), layerItem.frame.y - (layerItem.frame.height / 2));
      bottomRight = new paperMain.Point(layerItem.frame.x + (layerItem.frame.width / 2), layerItem.frame.y + (layerItem.frame.height / 2));
    } else {
      const paperActiveArtboardLayer = getPaperLayer(state.activeArtboard);
      topLeft = paperActiveArtboardLayer.bounds.topLeft;
      bottomRight = paperActiveArtboardLayer.bounds.bottomRight;
    }
    new paperMain.Path.Rectangle({
      from: new paperMain.Point(topLeft.x - (4 / paperMain.view.zoom), topLeft.y - (4 / paperMain.view.zoom)),
      to: new paperMain.Point(bottomRight.x + (4 / paperMain.view.zoom), bottomRight.y + (4 / paperMain.view.zoom)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 3 / paperMain.view.zoom,
      data: {
        id: 'activeArtboardFrame'
      }
    });
  }
}

export const addShape = (state: LayerState, action: AddShape): LayerState => {
  let currentState = state;
  const layerParent = action.payload.parent ? action.payload.parent : currentState.page;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(layerParent);
  applyShapeMethods(paperLayer);
  // add shape
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.id),
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...action.payload
      } as em.Shape,
      [layerParent]: {
        ...currentState.byId[layerParent],
        children: addItem((currentState.byId[layerParent] as em.Group).children, action.payload.id),
        showChildren: true
      } as em.Group
    },
    allShapeIds: addItem(state.allShapeIds, action.payload.id)
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, 'all');
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    allGroupIds: addItem(state.allGroupIds, action.payload.id)
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
      [action.payload.id]: action.payload as em.Text,
      [layerParent]: {
        ...currentState.byId[layerParent],
        children: addItem((currentState.byId[layerParent] as em.Group).children, action.payload.id),
        showChildren: true
      } as em.Group
    },
    allTextIds: addItem(state.allTextIds, action.payload.id)
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, 'all');
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    allImageIds: addItem(state.allImageIds, action.payload.id)
  }
  if (paperMain.view.bounds.intersects(paperLayer.bounds) && !currentState.inView.allIds.includes(action.payload.id)) {
    currentState = addInViewLayer(currentState, layerActions.addInViewLayer({id: action.payload.id}) as AddInViewLayer);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, 'all');
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    // check hover
    if (result.hover === current) {
      result = setLayerHover(result, layerActions.setLayerHover({id: null}) as SetLayerHover);
    }
    // if layer compound shape
    if (layer.type === 'CompoundShape') {
      result = removeLayers(result, layerActions.removeLayers({layers: layer.children}) as RemoveLayers);
    }
    // if layer mask
    if (layer.mask) {
      result = removeLayersMask(result, layerActions.removeLayersMask({id: layer.id}) as RemoveLayersMask);
    }
    // if layer is inView, remove from inView
    if (result.inView.allIds.includes(current)) {
      result = removeInViewLayer(result, layerActions.removeInViewLayer({id: current}) as RemoveInViewLayer);
    }
    // if layer is the active artboard, set active artboard to null
    if (layer.id === result.activeArtboard) {
      result = setActiveArtboard(result, layerActions.setActiveArtboard({id: result.allArtboardIds.length > 0 ? result.allArtboardIds[0] : null, scope: 1}) as SetActiveArtboard);
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
    // if artboard, remove any tween events with artboard as origin or destination
    if (layer.type === 'Artboard') {
      const tweenEventsWithArtboard = getTweenEventsWithArtboard(result, layer.id);
      result = tweenEventsWithArtboard.allIds.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
      }, result);
    }
    return result;
  }, currentState);
  // remove paper layer
  getPaperLayer(action.payload.id).remove();
  // remove layer
  currentState = {
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
    scope: currentState.scope.filter((id) => !layersToRemove.includes(id))
  }
  return currentState;
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return removeLayer(result, layerActions.removeLayer({id: current}) as RemoveLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
}

export const updateSelectionFrame = (state: LayerState, visibleHandle = 'all', useLayerItem = false) => {
  const selectionFrame = paperMain.project.getItem({ data: { id: 'selectionFrame' } });
  if (selectionFrame) {
    selectionFrame.remove();
  }
  if (state.selected.length > 0) {
    const selectionTopLeft = getSelectionTopLeft(state, useLayerItem);
    const selectionBottomRight = getSelectionBottomRight(state, useLayerItem);
    const baseProps = {
      point: selectionTopLeft,
      size: [8, 8],
      fillColor: '#fff',
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false
    }
    if (state.selected.length === 1 && state.byId[state.selected[0]].type === 'Shape' && (state.byId[state.selected[0]] as em.Shape).shapeType === 'Line') {
      const layerItem = state.byId[state.selected[0]] as em.Shape;
      const moveHandle = new paperMain.Path.Ellipse({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'move',
        data: {
          id: 'selectionFrameHandle',
          handle: 'move'
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'move';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
        }
      });
      moveHandle.position = useLayerItem ? new paperMain.Point(layerItem.frame.x, layerItem.frame.y) : (getPaperLayer(state.selected[0]) as paper.Path).bounds.center;
      moveHandle.scaling.x = 1 / paperMain.view.zoom;
      moveHandle.scaling.y = 1 / paperMain.view.zoom;
      const fromHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'from',
        data: {
          id: 'selectionFrameHandle',
          handle: 'from'
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'ew-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
        }
      });
      fromHandle.position = useLayerItem ? new paperMain.Point(layerItem.path.points[0].point.x, layerItem.path.points[0].point.y) : (getPaperLayer(state.selected[0]) as paper.Path).firstSegment.point;
      fromHandle.scaling.x = 1 / paperMain.view.zoom;
      fromHandle.scaling.y = 1 / paperMain.view.zoom;
      const toHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'to',
        data: {
          id: 'selectionFrameHandle',
          handle: 'to'
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'ew-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
        }
      });
      toHandle.position = useLayerItem ? new paperMain.Point(layerItem.path.points[1].point.x, layerItem.path.points[1].point.y) : (getPaperLayer(state.selected[0]) as paper.Path).lastSegment.point;
      toHandle.scaling.x = 1 / paperMain.view.zoom;
      toHandle.scaling.y = 1 / paperMain.view.zoom;
      new paperMain.Group({
        children: [fromHandle, moveHandle, toHandle],
        data: {
          id: 'selectionFrame'
        }
      });
    }
    else {
      const baseFrame = new paperMain.Path.Rectangle({
        from: selectionTopLeft,
        to: selectionBottomRight,
        strokeColor: THEME_PRIMARY_COLOR,
        strokeWidth: 1 / paperMain.view.zoom,
        insert: false,
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'move';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
        }
      });
      moveHandle.position = new paperMain.Point(baseFrame.bounds.topCenter.x, baseFrame.bounds.topCenter.y - ((1 / paperMain.view.zoom) * 24));
      // moveHandle.position = new paperMain.Point(baseFrame.bounds.center.x, baseFrame.bounds.center.y);
      moveHandle.scaling.x = 1 / paperMain.view.zoom;
      moveHandle.scaling.y = 1 / paperMain.view.zoom;
      const topLeftHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'topLeft',
        data: {
          id: 'selectionFrameHandle',
          handle: 'topLeft'
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'nwse-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'ns-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'nesw-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'nesw-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'ns-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'nwse-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'ew-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
        },
        onMouseEnter: function() {
          document.body.style.cursor = 'ew-resize';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
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
}

export const updateTweenEventsFrame = (state: LayerState, events: em.TweenEvent[], hover: string, themeName: em.ThemeName) => {
  const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'tweenEventsFrame' } });
  if (tweenEventsFrame) {
    tweenEventsFrame.remove();
  }
  if (events) {
    const tweenEventsFrame = new paperMain.Group({
      data: {
        id: 'tweenEventsFrame'
      }
    });
    events.forEach((event, index) => {
      const groupOpacity = hover ? hover === event.id ? 1 : 0.25 : 1;
      const elementColor = event.artboard === state.activeArtboard ? THEME_PRIMARY_COLOR : getTheme(themeName).text.lighter;
      const artboardTopTop = getArtboardsTopTop(state);
      const origin = state.byId[event.artboard];
      const destination = state.byId[event.destinationArtboard];
      const destinationIndicator = new paperMain.Path.Ellipse({
        center: new paperMain.Point(destination.frame.x, artboardTopTop - ((1 / paperMain.view.zoom) * 48)),
        radius: ((1 / paperMain.view.zoom) * 4),
        fillColor: elementColor,
        insert: false,
        data: {
          id: 'tweenEventFrameIndicator',
          indicator: 'destination'
        }
      });
      const originIndicator = new paperMain.Path.Line({
        from: new paperMain.Point(origin.frame.x, destinationIndicator.bounds.top),
        to: new paperMain.Point(origin.frame.x, destinationIndicator.bounds.bottom),
        strokeColor: elementColor,
        strokeWidth: 1 / paperMain.view.zoom,
        insert: false,
        data: {
          id: 'tweenEventFrameIndicator',
          indicator: 'origin'
        }
      });
      const connector = new paperMain.Path.Line({
        from: originIndicator.bounds.center,
        to: destinationIndicator.bounds.center,
        strokeColor: elementColor,
        strokeWidth: 1 / paperMain.view.zoom,
        insert: false,
        data: {
          id: 'tweenEventFrameIndicator',
          indicator: 'connector'
        }
      });
      const eventType = new paperMain.PointText({
        content: event.event,
        point: new paperMain.Point(connector.bounds.center.x, destinationIndicator.bounds.top - ((1 / paperMain.view.zoom) * 12)),
        justification: 'center',
        fontSize: ((1 / paperMain.view.zoom) * 12),
        fillColor: elementColor,
        insert: false,
        fontFamily: 'Space Mono'
      });
      const tweenEventFrame = new paperMain.Group({
        children: [originIndicator, connector, destinationIndicator, eventType],
        data: {
          id: 'tweenEventFrame',
          tweenEvent: event.id
        },
        parent: tweenEventsFrame,
        opacity: groupOpacity,
        onMouseEnter: function() {
          document.body.style.cursor = 'pointer';
          const eventFrames = this.parent.getItems({data: { id: 'tweenEventFrame' } });
          const others = eventFrames.filter((item: paper.Item) => item.data.tweenEvent !== this.data.tweenEvent);
          others.forEach((item: paper.Item) => {
            item.opacity = 0.25;
          });
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
          const eventFrames = this.parent.getItems({data: { id: 'tweenEventFrame' } });
          const others = eventFrames.filter((item: paper.Item) => item.data.tweenEvent !== this.data.tweenEvent);
          others.forEach((item: paper.Item) => {
            item.opacity = 1;
          });
        },
        onClick: function() {
          const state = store.getState();
          if (!state.tweenDrawer.isOpen) {
            paperMain.view.viewSize = new paperMain.Size(paperMain.view.viewSize.width, paperMain.view.viewSize.height - state.canvasSettings.tweenDrawerHeight);
            store.dispatch(openTweenDrawer());
          }
          store.dispatch(setTweenDrawerEvent({id: event.id}));
        }
      });
      const tweenEventFrameBackground = new paperMain.Path.Rectangle({
        from: tweenEventFrame.bounds.topLeft,
        to: tweenEventFrame.bounds.bottomRight,
        fillColor: 'red',
        opacity: 0.01,
        parent: tweenEventFrame,
        data: {
          id: 'tweenEventFrameIndicator',
          indicator: 'background'
        }
      });
      tweenEventFrame.position.y -= (tweenEventFrame.bounds.height + ((1 / paperMain.view.zoom) * 12)) * index;
    });
  }
}

export const updateMeasureFrame = (state: LayerState, guides: { top?: string; bottom?: string; left?: string; right?: string; all?: string }): void => {
  const measureFrame = paperMain.project.getItem({ data: { id: 'measureFrame' } });
  if (measureFrame) {
    measureFrame.remove();
  }
  if (state.selected.length > 0) {
    const selectionBounds = getSelectionBounds(state);
    const measureFrameGuides = [];
    let hasTopMeasure;
    let hasBottomMeasure;
    let hasLeftMeasure;
    let hasRightMeasure;
    let topMeasureTo;
    let bottomMeasureTo;
    let leftMeasureTo;
    let rightMeasureTo;
    Object.keys(guides).forEach((current: 'top' | 'bottom' | 'left' | 'right' | 'all') => {
      const guideMeasureToId = guides[current] as any;
      const measureToBounds = getPaperLayer(guideMeasureToId).bounds;
      if (measureToBounds.contains(selectionBounds)) {
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
            hasTopMeasure = selectionBounds.top > measureToBounds.top;
            topMeasureTo = selectionBounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
            break;
          case 'bottom':
            hasBottomMeasure = selectionBounds.bottom < measureToBounds.bottom;
            bottomMeasureTo = selectionBounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
            break;
          case 'left':
            hasLeftMeasure = selectionBounds.left > measureToBounds.left;
            leftMeasureTo = selectionBounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
            break;
          case 'right':
            hasRightMeasure = selectionBounds.right < measureToBounds.right;
            rightMeasureTo = selectionBounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
            break;
          case 'all':
            hasTopMeasure = selectionBounds.top > measureToBounds.top;
            hasBottomMeasure = selectionBounds.bottom < measureToBounds.bottom;
            hasLeftMeasure = selectionBounds.left > measureToBounds.left;
            hasRightMeasure = selectionBounds.right < measureToBounds.right;
            topMeasureTo = selectionBounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
            bottomMeasureTo = selectionBounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
            leftMeasureTo = selectionBounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
            rightMeasureTo = selectionBounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
            break;
        }
      }
    });
    if (hasTopMeasure && (guides['all'] || guides['top'])) {
      const topMeasureFromPoint = selectionBounds.topCenter;
      const topMeasureToPoint = new paperMain.Point(topMeasureFromPoint.x, topMeasureTo);
      const measureGuide = new MeasureGuide(topMeasureFromPoint, topMeasureToPoint, 'top', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    if (hasBottomMeasure && (guides['all'] || guides['bottom'])) {
      const bottomMeasureFromPoint = selectionBounds.bottomCenter;
      const bottomMeasureToPoint = new paperMain.Point(bottomMeasureFromPoint.x, bottomMeasureTo);
      const measureGuide = new MeasureGuide(bottomMeasureFromPoint, bottomMeasureToPoint, 'bottom', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    if (hasLeftMeasure && (guides['all'] || guides['left'])) {
      const leftMeasureFromPoint = selectionBounds.leftCenter;
      const leftMeasureToPoint = new paperMain.Point(leftMeasureTo, leftMeasureFromPoint.y);
      const measureGuide = new MeasureGuide(leftMeasureFromPoint, leftMeasureToPoint, 'left', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    if (hasRightMeasure && (guides['all'] || guides['right'])) {
      const rightMeasureFromPoint = selectionBounds.rightCenter;
      const rightMeasureToPoint = new paperMain.Point(rightMeasureTo, rightMeasureFromPoint.y);
      const measureGuide = new MeasureGuide(rightMeasureFromPoint, rightMeasureToPoint, 'right', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    new paperMain.Group({
      children: measureFrameGuides,
      data: {
        id: 'measureFrame'
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
    if (!action.payload.noActiveArtboardUpdate) {
      currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: layerScopeRoot, scope: 1}) as SetActiveArtboard);
    }
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
    const hoverItem = state.byId[state.hover];
    // new paperMain.Path.Rectangle({
    //   ...hoverFrameConstants,
    //   point: new paperMain.Point(hoverItem.frame.x - (hoverItem.frame.width / 2), hoverItem.frame.y - (hoverItem.frame.height / 2)),
    //   size: [hoverItem.frame.width, hoverItem.frame.height]
    // });
    if (hoverItem.type === 'Shape') {
      new paperMain.Path({
        ...hoverFrameConstants,
        closed: hoverItem.path.closed,
        pathData: hoverItem.path.data
      });
    } else {
      new paperMain.Path.Rectangle({
        ...hoverFrameConstants,
        point: new paperMain.Point(hoverItem.frame.x - (hoverItem.frame.width / 2), hoverItem.frame.y - (hoverItem.frame.height / 2)),
        size: [hoverItem.frame.width, hoverItem.frame.height]
      });
    }
  }
}

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    hover: action.payload.id
  };
  return currentState;
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
      }
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
      }
    };
  }
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
  return currentState;
};

export const addLayerChildren = (state: LayerState, action: AddLayerChildren) => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(currentState, action.payload.children);
  currentState = orderedLayers.reduce((result, current) => {
    return addLayerChild(result, layerActions.addLayerChild({id: action.payload.id, child: current}) as AddLayerChild);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.children, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
      }
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
      }
    };
  }
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
  return currentState;
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
      }
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
      }
    };
  }
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
  return currentState;
};

export const insertLayersAbove = (state: LayerState, action: InsertLayersAbove) => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result, current) => {
    return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: action.payload.above}) as InsertLayerAbove);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
      }
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
      }
    };
  }
  currentState = selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
  return currentState;
};

export const insertLayersBelow = (state: LayerState, action: InsertLayersBelow): LayerState => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(state, action.payload.layers);
  currentState = orderedLayers.reverse().reduce((result, current) => {
    return insertLayerBelow(result, layerActions.insertLayerBelow({id: current, below: action.payload.below}) as InsertLayerBelow);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  // add group
  currentState = addGroup(currentState, layerActions.addGroup({
    selected: true,
    frame: {
      x: layersBounds.center.x,
      y: layersBounds.center.y,
      width: layersBounds.width,
      height: layersBounds.height,
      innerWidth: layersBounds.width,
      innerHeight: layersBounds.height
    }
  }) as AddGroup);
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
  // set layer edit
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  // return final state
  return currentState;
};

export const ungroupLayer = (state: LayerState, action: UngroupLayer): LayerState => {
  const layer = getLayer(state, action.payload.id);
  let currentState = state;
  if (layer.type === 'Group') {
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
  } else {
    currentState = selectLayer(state, layerActions.selectLayer({id: layer.id, newSelection: true}) as SelectLayer);
  }
  return currentState;
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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

const clonePaperLayers = (state: LayerState, id: string, layerCloneMap: any, fromClipboard?: boolean, documentImages?: { [id: string]: em.DocumentImage }) => {
  const paperLayer = fromClipboard ? paperMain.project.importJSON((() => {
    const layer = state.clipboard.byId[id];
    switch(layer.type) {
      case 'Image': {
        const imageBuffer = Buffer.from(documentImages[layer.imageId].buffer);
        const imageBase64 = `data:image/webp;base64,${bufferToBase64(imageBuffer)}`;
        return layer.paperLayer.replace(`"source":"${layer.imageId}"`, `"source":"${imageBase64}"`);
      }
      default:
        return layer.paperLayer;
    }
  })()) : getPaperLayer(id);
  const parentLayer = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  const paperParentLayer = getPaperLayer(parentLayer.id);
  const paperLayerClone = paperLayer.clone({deep: paperLayer.className === 'CompoundPath', insert: true});
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
              const imageBuffer = Buffer.from(documentImages[childLayer.imageId].buffer);
              const imageBase64 = `data:image/webp;base64,${bufferToBase64(imageBuffer)}`;
              return (childLayer as em.ClipboardLayer).paperLayer.replace(`"source":"${childLayer.imageId}"`, `"source":"${imageBase64}"`);
            }
            default:
              return (childLayer as em.ClipboardLayer).paperLayer;
          }
        })()) : getPaperLayer(child);
        const childPaperLayerClone = childPaperLayer.clone({deep: childPaperLayer.className === 'CompoundPath', insert: true});
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

const cloneLayerAndChildren = (state: LayerState, id: string, fromClipboard?: boolean, documentImages?: { [id: string]: em.DocumentImage }) => {
  const layerCloneMap = getLayerCloneMap(state, id, fromClipboard);
  clonePaperLayers(state, id, layerCloneMap, fromClipboard, documentImages);
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

export const pasteLayerFromClipboard = (payload: {state: LayerState; id: string; pasteOverSelection?: boolean; documentImages?: { [id: string]: em.DocumentImage }}): LayerState => {
  let currentState = payload.state;
  currentState = duplicateLayer(currentState, layerActions.duplicateLayer({id: payload.id}) as DuplicateLayer, true, payload.documentImages);
  const clonedLayerAndChildren = currentState.allIds.filter((id) => !payload.state.allIds.includes(id));
  // paste over selection is specified
  if (payload.pasteOverSelection && payload.state.selected.length > 0) {
    const selectionCenter = getSelectionCenter(payload.state);
    const clipboardCenter = getClipboardCenter(payload.state, payload.documentImages);
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
        documentImages: action.payload.documentImageById
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
    const layerItem = result.byId[current];
    result = updateLayerInView(result, current);
    if (layerItem.transform.rotation !== 0) {
      paperLayer.rotation = -layerItem.transform.rotation;
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              innerWidth: paperLayer.bounds.width,
              innerHeight: paperLayer.bounds.height
            }
          }
        }
      }
      paperLayer.rotation = layerItem.transform.rotation;
    } else {
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              innerWidth: paperLayer.bounds.width,
              innerHeight: paperLayer.bounds.height
            }
          }
        }
      }
    }
    result = {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            ...result.byId[current].frame,
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          }
        }
      }
    }
    return result;
  }, state);
};

export const updateChildrenBounds = (state: LayerState, id: string): LayerState => {
  const layerDescendants = getLayerDescendants(state, id);
  return layerDescendants.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    const layerItem = result.byId[current];
    result = updateLayerInView(result, current);
    if (result.byId[current].type === 'Shape') {
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            path: {
              ...(result.byId[current] as em.Shape).path,
              data: (paperLayer as paper.Path | paper.CompoundPath).pathData,
              points: getCurvePoints(paperLayer as paper.Path | paper.CompoundPath)
            }
          } as em.Shape
        }
      }
    }
    if (layerItem.transform.rotation !== 0) {
      paperLayer.rotation = -layerItem.transform.rotation;
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              innerWidth: paperLayer.bounds.width,
              innerHeight: paperLayer.bounds.height
            }
          }
        }
      }
      paperLayer.rotation = layerItem.transform.rotation;
    } else {
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              innerWidth: paperLayer.bounds.width,
              innerHeight: paperLayer.bounds.height
            }
          }
        }
      }
    }
    result = {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            ...result.byId[current].frame,
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          }
        }
      }
    }
    return result;
  }, state);
};

export const updateLayerBounds = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(id);
  const layerItem = state.byId[id];
  if (layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [id]: {
          ...currentState.byId[id],
          path: {
            ...(currentState.byId[id] as em.Shape).path,
            data: (paperLayer as paper.PathItem).pathData,
            points: getCurvePoints(paperLayer as paper.Path | paper.CompoundPath)
          }
        } as em.Shape
      }
    }
  }
  if (layerItem.transform.rotation !== 0) {
    paperLayer.rotation = -layerItem.transform.rotation;
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [id]: {
          ...currentState.byId[id],
          frame: {
            ...currentState.byId[id].frame,
            innerWidth: paperLayer.bounds.width,
            innerHeight: paperLayer.bounds.height
          }
        }
      }
    }
    paperLayer.rotation = layerItem.transform.rotation;
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [id]: {
          ...currentState.byId[id],
          frame: {
            ...currentState.byId[id].frame,
            innerWidth: paperLayer.bounds.width,
            innerHeight: paperLayer.bounds.height
          }
        }
      }
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [id]: {
        ...currentState.byId[id],
        frame: {
          ...currentState.byId[id].frame,
          x: paperLayer.position.x,
          y: paperLayer.position.y,
          width: paperLayer.bounds.width,
          height: paperLayer.bounds.height
        }
      }
    }
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
    }
  }
  currentState = updateParentBounds(currentState, action.payload.id);
  return currentState;
};

export const moveLayers = (state: LayerState, action: MoveLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return moveLayer(result, layerActions.moveLayer({id: current}) as MoveLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const moveLayerTo = (state: LayerState, action: MoveLayerTo): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
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
    }
  }
  currentState = updateParentBounds(currentState, action.payload.id);
  return currentState;
};

export const moveLayersTo = (state: LayerState, action: MoveLayersTo): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return moveLayerTo(result, layerActions.moveLayerTo({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerTo);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const moveLayerBy = (state: LayerState, action: MoveLayerBy): LayerState => {
  let currentState = state;
  currentState = updateLayerBounds(currentState, action.payload.id);
  if (action.payload.x) {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  }
  if (action.payload.y) {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  }
  return currentState;
};

export const moveLayersBy = (state: LayerState, action: MoveLayersBy): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return moveLayerBy(result, layerActions.moveLayerBy({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerBy);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerName = (state: LayerState, action: SetLayerName): LayerState => {
  let currentState = state;
  // remove existing tweens
  const layerScope = getLayerScope(currentState, action.payload.id);
  if (layerScope.some((id: string) => currentState.allArtboardIds.includes(id))) {
    const tweensWithLayer = getTweensWithLayer(currentState, action.payload.id);
    currentState = tweensWithLayer.allIds.reduce((result: LayerState, current) => {
      result = removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
      return result;
    }, currentState);
  }
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
  // add new tweens
  currentState = updateLayerTweensByProps(currentState, action.payload.id, 'all');
  // set layer edit
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  // return final state
  return currentState;
};

export const setActiveArtboard = (state: LayerState, action: SetActiveArtboard): LayerState => {
  const activeArtboardState = {
    ...state,
    activeArtboard: action.payload.id
  }
  return activeArtboardState;
};

export const addLayerTweenEvent = (state: LayerState, action: AddLayerTweenEvent): LayerState => {
  const artboardChildren = getLayerDescendants(state, action.payload.artboard);
  let currentState = state;
  // if an event doesnt already exist with the same layer, event, and destination
  // add tween event
  if (!currentState.allTweenEventIds.some((id: string) => {
    return (
      currentState.tweenEventById[id].layer === action.payload.layer &&
      currentState.tweenEventById[id].event === action.payload.event &&
      currentState.tweenEventById[id].destinationArtboard === action.payload.destinationArtboard
    )
  })) {
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
      }
    }
    // add animation event tweens
    currentState = artboardChildren.reduce((result, current) => {
      if (state.byId[current].type !== 'Group') {
        return addTweenEventLayerTweens(result, action.payload.id, current);
      } else {
        return result;
      }
    }, currentState);
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const addTweenEventLayerTweens = (state: LayerState, eventId: string, layerId: string): LayerState => {
  let currentState = state;
  const tweenEvent = currentState.tweenEventById[eventId];
  const destinationArtboardChildren = getLayerDescendants(currentState, tweenEvent.destinationArtboard);
  const destinationEquivalent = getDestinationEquivalent(currentState, layerId, destinationArtboardChildren);
  if (destinationEquivalent) {
    const currentLayerItem = state.byId[layerId];
    const equivalentLayerItem = state.byId[destinationEquivalent.id];
    const artboardLayerItem = state.byId[tweenEvent.artboard] as em.Artboard;
    const destinationArtboardLayerItem = state.byId[tweenEvent.destinationArtboard] as em.Artboard;
    const equivalentTweenProps = getEquivalentTweenProps(currentLayerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem);
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
    }, {})
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const addLayerTween = (state: LayerState, action: AddLayerTween): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweenEventById: {
      ...currentState.tweenEventById,
      [action.payload.event]: {
        ...currentState.tweenEventById[action.payload.event],
        tweens: addItem(currentState.tweenEventById[action.payload.event].tweens, action.payload.id)
      }
    },
    byId: {
      ...currentState.byId,
      [action.payload.layer]: {
        ...currentState.byId[action.payload.layer],
        tweens: addItem(currentState.byId[action.payload.layer].tweens, action.payload.id)
      }
    },
    allTweenIds: addItem(currentState.allTweenIds, action.payload.id),
    tweenById: {
      ...currentState.tweenById,
      [action.payload.id]: action.payload as em.Tween
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const removeLayerTween = (state: LayerState, action: RemoveLayerTween): LayerState => {
  const tween = state.tweenById[action.payload.id];
  let currentState = state;
  currentState = {
    ...state,
    tweenEventById: {
      ...currentState.tweenEventById,
      [tween.event]: {
        ...currentState.tweenEventById[tween.event],
        tweens: removeItem(currentState.tweenEventById[tween.event].tweens, action.payload.id)
      }
    },
    byId: {
      ...currentState.byId,
      [tween.layer]: {
        ...currentState.byId[tween.layer],
        tweens: removeItem(currentState.byId[tween.layer].tweens, action.payload.id)
      }
    },
    allTweenIds: removeItem(currentState.allTweenIds, action.payload.id),
    tweenById: Object.keys(currentState.tweenById).reduce((result: any, key) => {
      if (key !== action.payload.id) {
        result[key] = currentState.tweenById[key];
      }
      return result;
    }, {})
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const updateLayerTweensByProp = (state: LayerState, layerId: string, prop: em.TweenProp): LayerState => {
  let currentState = state;
  const layerScope = getLayerScope(currentState, layerId);
  if (layerScope.some((id: string) => currentState.allArtboardIds.includes(id))) {
    const artboard = layerScope.find((id: string) => currentState.allArtboardIds.includes(id));
    const tweensByProp = getTweensByProp(currentState, layerId, prop);
    const eventsWithArtboardAsOrigin = getAllArtboardTweenEvents(currentState, artboard);
    const eventsWithArtboardAsDestination = getTweensEventsByDestinationArtboard(currentState, artboard);
    // filter tweens by prop
    // if new layer prop matches destination prop, remove tween
    // if new destination prop matches layer prop, remove tween
    if (tweensByProp.allIds.length > 0) {
      currentState = tweensByProp.allIds.reduce((result: LayerState, current: string) => {
        const tween = result.tweenById[current];
        const tweenEvent = result.tweenEventById[tween.event];
        const layerItem = result.byId[tween.layer] as em.Layer;
        const destinationLayerItem = result.byId[tween.destinationLayer] as em.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as em.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as em.Artboard;
        const hasTween = getEquivalentTweenProp(layerItem, destinationLayerItem, artboardItem, destinationArtboardItem, prop);
        if (!hasTween) {
          result = removeLayerTween(result, layerActions.removeLayerTween({id: current}) as RemoveLayerTween);
        }
        return result;
      }, currentState);
    }
    // add tween to events with artboard as origin
    // if it doesnt already exist
    currentState = eventsWithArtboardAsOrigin.allIds.reduce((result: LayerState, current: string) => {
      const tweenEvent = result.tweenEventById[current];
      const destinationArtboardChildren = getLayerDescendants(result, tweenEvent.destinationArtboard);
      const destinationEquivalent = getDestinationEquivalent(result, layerId, destinationArtboardChildren);
      if (destinationEquivalent) {
        const layerItem = result.byId[layerId] as em.Layer;
        const equivalentLayerItem = result.byId[destinationEquivalent.id] as em.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as em.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as em.Artboard;
        const hasTween = getEquivalentTweenProp(layerItem, equivalentLayerItem, artboardItem, destinationArtboardItem, prop);
        const tweenExists = tweenEvent.tweens.some((id: string) => {
          const tween = result.tweenById[id];
          return tween.layer === layerId && tween.prop === prop;
        });
        if (hasTween && !tweenExists) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: layerId,
            destinationLayer: destinationEquivalent.id,
            prop: prop,
            event: current,
            ease: 'power1',
            power: 'out',
            duration: 0.5,
            delay: 0,
            frozen: false
          }) as AddLayerTween);
        }
      }
      return result;
    }, currentState);
    // add tween to events with artboard as destination
    // if it doesnt already exist
    currentState = eventsWithArtboardAsDestination.allIds.reduce((result: LayerState, current: string) => {
      const tweenEvent = result.tweenEventById[current];
      const originArtboardChildren = getLayerDescendants(result, tweenEvent.artboard);
      const originEquivalent = getDestinationEquivalent(result, layerId, originArtboardChildren);
      if (originEquivalent) {
        const layerItem = result.byId[layerId] as em.Layer;
        const equivalentLayerItem = result.byId[originEquivalent.id] as em.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as em.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as em.Artboard;
        const hasTween = getEquivalentTweenProp(layerItem, equivalentLayerItem, artboardItem, destinationArtboardItem, prop);
        const tweenExists = tweenEvent.tweens.some((id: string) => {
          const tween = result.tweenById[id];
          return tween.layer === originEquivalent.id && tween.prop === prop;
        });
        if (hasTween && !tweenExists) {
          result = addLayerTween(result, layerActions.addLayerTween({
            layer: originEquivalent.id,
            destinationLayer: layerId,
            prop: prop,
            event: current,
            ease: 'power1',
            power: 'out',
            duration: 0.5,
            delay: 0,
            frozen: false
          }) as AddLayerTween);
        }
      }
      return result;
    }, currentState);
  }
  return currentState;
};

export const updateLayerTweensByProps = (state: LayerState, layerId: string, props: em.TweenProp[] | 'all'): LayerState => {
  let currentState = state;
  if (props === 'all') {
    const tweenProps = ['image', 'shape', 'fill', 'x', 'y', 'radius', 'rotation', 'width', 'height', 'stroke', 'strokeDashWidth', 'strokeDashGap', 'strokeWidth', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'opacity', 'fontSize', 'lineHeight'] as em.TweenProp[];
    currentState = tweenProps.reduce((result: LayerState, current: em.TweenProp) => {
      result = updateLayerTweensByProp(result, layerId, current);
      return result;
    }, currentState);
  } else {
    currentState = (props as em.TweenProp[]).reduce((result: LayerState, current: em.TweenProp) => {
      result = updateLayerTweensByProp(result, layerId, current);
      return result;
    }, currentState);
  }
  return currentState;
}

export const setLayerTweenDuration = (state: LayerState, action: SetLayerTweenDuration): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweenById: {
      ...currentState.tweenById,
      [action.payload.id]: {
        ...currentState.tweenById[action.payload.id],
        duration: Math.round((action.payload.duration + Number.EPSILON) * 100) / 100
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenDelay = (state: LayerState, action: SetLayerTweenDelay): LayerState => {
  let currentState = state;
  currentState = {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        delay: Math.round((action.payload.delay + Number.EPSILON) * 100) / 100
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenTiming = (state: LayerState, action: SetLayerTweenTiming): LayerState => {
  let currentState = state;
  currentState = setLayerTweenDuration(currentState, layerActions.setLayerTweenDuration({id: action.payload.id, duration: action.payload.duration}) as SetLayerTweenDuration);
  currentState = setLayerTweenDelay(currentState, layerActions.setLayerTweenDelay({id: action.payload.id, delay: action.payload.delay}) as SetLayerTweenDelay);
  return currentState;
};

export const setLayerTweenEase = (state: LayerState, action: SetLayerTweenEase): LayerState => {
  let currentState = state;
  currentState = {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        ease: action.payload.ease
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenPower = (state: LayerState, action: SetLayerTweenPower): LayerState => {
  let currentState = state;
  currentState = {
    ...state,
    tweenById: {
      ...state.tweenById,
      [action.payload.id]: {
        ...state.tweenById[action.payload.id],
        power: action.payload.power
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerX = (state: LayerState, action: SetLayerX): LayerState => {
  let currentState = state;
  let x = action.payload.x;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerScope = getLayerScope(currentState, action.payload.id);
  if (layerScope.some((id: string) => currentState.allArtboardIds.includes(id))) {
    const artboard = layerScope.find((id: string) => currentState.allArtboardIds.includes(id));
    const artboardItem = state.byId[artboard];
    x = Math.round(x + (artboardItem.frame.x - (artboardItem.frame.width / 2)));
  }
  paperLayer.position.x = x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          x: x
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  return currentState;
};

export const setLayersX = (state: LayerState, action: SetLayersX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerX(result, layerActions.setLayerX({id: current, x: action.payload.x}) as SetLayerX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerY = (state: LayerState, action: SetLayerY): LayerState => {
  let currentState = state;
  let y = action.payload.y;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerScope = getLayerScope(currentState, action.payload.id);
  if (layerScope.some((id: string) => currentState.allArtboardIds.includes(id))) {
    const artboard = layerScope.find((id: string) => currentState.allArtboardIds.includes(id));
    const artboardItem = state.byId[artboard];
    y = Math.round(y + (artboardItem.frame.y - (artboardItem.frame.height / 2)));
  }
  paperLayer.position.y = y;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          y: y
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  return currentState;
};

export const setLayersY = (state: LayerState, action: SetLayersY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerY(result, layerActions.setLayerY({id: current, y: action.payload.y}) as SetLayerY);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerWidth = (state: LayerState, action: SetLayerWidth): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  if (layerItem.type === 'Artboard') {
    const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
    const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
    mask.bounds.width = action.payload.width;
    background.bounds.width = action.payload.width;
  } else {
    if (layerItem.transform.rotation !== 0) {
      paperLayer.rotation = -layerItem.transform.rotation;
    }
    paperLayer.bounds.width = action.payload.width;
    if (layerItem.transform.rotation !== 0) {
      paperLayer.rotation = layerItem.transform.rotation;
    }
  }
  paperLayer.position.x = layerItem.frame.x;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          innerWidth: action.payload.width
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width']);
  return currentState;
};

export const setLayersWidth = (state: LayerState, action: SetLayersWidth): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerWidth(result, layerActions.setLayerWidth({id: current, width: action.payload.width}) as SetLayerWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerHeight = (state: LayerState, action: SetLayerHeight): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  if (layerItem.type === 'Artboard') {
    const mask = paperLayer.getItem({data: { id: 'ArtboardMask' }});
    const background = paperLayer.getItem({data: { id: 'ArtboardBackground' }});
    mask.bounds.height = action.payload.height;
    background.bounds.height = action.payload.height;
  } else {
    if (layerItem.transform.rotation !== 0) {
      paperLayer.rotation = -layerItem.transform.rotation;
    }
    paperLayer.bounds.height = action.payload.height;
    if (layerItem.transform.rotation !== 0) {
      paperLayer.rotation = layerItem.transform.rotation;
    }
  }
  paperLayer.position.y = layerItem.frame.y;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        frame: {
          ...currentState.byId[action.payload.id].frame,
          innerHeight: action.payload.height
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['height']);
  return currentState;
};

export const setLayersHeight = (state: LayerState, action: SetLayersHeight): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerHeight(result, layerActions.setLayerHeight({id: current, height: action.payload.height}) as SetLayerHeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerOpacity = (state: LayerState, action: SetLayerOpacity): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.opacity = action.payload.opacity;
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['opacity']);
  return currentState;
};

export const setLayersOpacity = (state: LayerState, action: SetLayersOpacity): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerOpacity(result, layerActions.setLayerOpacity({id: current, opacity: action.payload.opacity}) as SetLayerOpacity);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerRotation = (state: LayerState, action: SetLayerRotation): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  paperLayer.rotation = -layerItem.transform.rotation;
  paperLayer.rotation = action.payload.rotation;
  paperLayer.position.x = layerItem.frame.x;
  paperLayer.position.y = layerItem.frame.y;
  if (layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          path: {
            ...(currentState.byId[action.payload.id] as em.Shape).path,
            data: (paperLayer as paper.PathItem).pathData,
            points: getCurvePoints(paperLayer as paper.Path | paper.CompoundPath)
          }
        } as em.Shape
      }
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          rotation: action.payload.rotation
        }
      }
    }
  }
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['rotation']);
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setLayersRotation = (state: LayerState, action: SetLayersRotation): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerRotation(result, layerActions.setLayerRotation({id: current, rotation: action.payload.rotation}) as SetLayerRotation);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const enableLayerHorizontalFlip = (state: LayerState, action: EnableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: true
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const disableLayerHorizontalFlip = (state: LayerState, action: DisableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: false
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const enableLayerVerticalFlip = (state: LayerState, action: EnableLayerVerticalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          verticalFlip: true
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const disableLayerVerticalFlip = (state: LayerState, action: DisableLayerVerticalFlip): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          verticalFlip: false
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const enableLayerFill = (state: LayerState, action: EnableLayerFill): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const fill = currentState.byId[action.payload.id].style.fill;
  switch(fill.fillType) {
    case 'color':
      paperLayer.fillColor = { hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a } as paper.Color;
      break;
    case 'gradient':
      paperLayer.fillColor = {
        gradient: {
          stops: getGradientStops(fill.gradient.stops),
          radial: fill.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(currentState, action.payload.id, fill.gradient.origin),
        destination: getGradientDestinationPoint(currentState, action.payload.id, fill.gradient.destination)
      } as any
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill']);
  return currentState;
};

export const enableLayersFill = (state: LayerState, action: EnableLayersFill): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerFill(result, layerActions.enableLayerFill({id: current}) as EnableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill']);
  return currentState;
};

export const disableLayersFill = (state: LayerState, action: DisableLayersFill): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerFill(result, layerActions.disableLayerFill({id: current}) as DisableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerFillColor = (state: LayerState, action: SetLayerFillColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  const fillColor = action.payload.fillColor;
  const newFill = { ...layerItem.style.fill.color, ...fillColor } as em.Color;
  paperLayer.fillColor = { hue: newFill.h, saturation: newFill.s, lightness: newFill.l, alpha: newFill.a } as paper.Color;
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
            color: newFill
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill']);
  return currentState;
};

export const setLayersFillColor = (state: LayerState, action: SetLayersFillColor): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFillColor(result, layerActions.setLayerFillColor({id: current, fillColor: action.payload.fillColor}) as SetLayerFillColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerFill = (state: LayerState, action: SetLayerFill): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const fill = action.payload.fill;
  switch(fill.fillType) {
    case 'color':
      paperLayer.fillColor = {hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a} as paper.Color;
      break;
    case 'gradient':
      paperLayer.fillColor = {
        gradient: {
          stops: getGradientStops(fill.gradient.stops),
          radial: layerItem.style.fill.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(currentState, action.payload.id, fill.gradient.origin),
        destination: getGradientDestinationPoint(currentState, action.payload.id, fill.gradient.destination)
      } as any
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill']);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerFillType = (state: LayerState, action: SetLayerFillType): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const fill = layerItem.style.fill;
  switch(action.payload.fillType) {
    case 'color':
      paperLayer.fillColor = {hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a} as paper.Color;
      break;
    case 'gradient':
      paperLayer.fillColor = {
        gradient: {
          stops: getGradientStops(fill.gradient.stops),
          radial: layerItem.style.fill.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(currentState, action.payload.id, fill.gradient.origin),
        destination: getGradientDestinationPoint(currentState, action.payload.id, fill.gradient.destination)
      } as any
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill']);
  return currentState;
};

export const setLayersFillType = (state: LayerState, action: SetLayersFillType): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFillType(result, layerActions.setLayerFillType({id: current, fillType: action.payload.fillType}) as SetLayerFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerGradient = (state: LayerState, action: SetLayerGradient): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer[action.payload.prop === 'fill' ? 'fillColor' : 'strokeColor'] = {
    gradient: {
      stops: getGradientStops(action.payload.gradient.stops),
      radial: action.payload.gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.gradient.origin),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.gradient.destination)
  } as any
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: action.payload.gradient
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradient = (state: LayerState, action: SetLayersGradient): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradient(result, layerActions.setLayerGradient({id: current, prop: action.payload.prop, gradient: action.payload.gradient}) as SetLayerGradient);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientType = (state: LayerState, action: SetLayerGradientType): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const paperProp = getPaperProp(action.payload.prop);
  switch(action.payload.gradientType) {
    case 'linear':
      paperLayer[paperProp].gradient.radial = false;
      break;
    case 'radial':
      paperLayer[paperProp].gradient.radial = true;
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
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              gradientType: action.payload.gradientType
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientType = (state: LayerState, action: SetLayersGradientType): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradientType(result, layerActions.setLayerGradientType({id: current, prop: action.payload.prop, gradientType: action.payload.gradientType}) as SetLayerGradientType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientOrigin = (state: LayerState, action: SetLayerGradientOrigin): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style.fill.gradient;
  const paperProp = getPaperProp(action.payload.prop);
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(gradient.stops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.origin),
    destination: getGradientDestinationPoint(currentState, action.payload.id, gradient.destination)
  } as any
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              origin: action.payload.origin
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientOrigin = (state: LayerState, action: SetLayersGradientOrigin): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradientOrigin(result, layerActions.setLayerGradientOrigin({id: current, prop: action.payload.prop, origin: action.payload.origin}) as SetLayerGradientOrigin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientDestination = (state: LayerState, action: SetLayerGradientDestination): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style.fill.gradient;
  const paperProp = getPaperProp(action.payload.prop);
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(gradient.stops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, gradient.origin),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.destination)
  } as any
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              destination: action.payload.destination
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientDestination = (state: LayerState, action: SetLayersGradientDestination): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerGradientDestination(result, layerActions.setLayerGradientDestination({id: current, prop: action.payload.prop, destination: action.payload.destination}) as SetLayerGradientDestination);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopColor = (state: LayerState, action: SetLayerGradientStopColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
  const newStops = gradient.stops.reduce((result, current, index) => {
    if (index === action.payload.stopIndex) {
      result = [...result, {
        ...current,
        color: {
          ...current.color,
          ...action.payload.color
        }
      }]
    } else {
      result = [...result, current];
    }
    return result;
  }, []);
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, gradient.origin),
    destination: getGradientDestinationPoint(currentState, action.payload.id, gradient.destination)
  } as any
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const updateGradients = (state: LayerState, layers: string[], prop: 'fill' | 'stroke') => {
  let currentState = state;
  if (layers.length > 1) {
    const originLayer = currentState.byId[layers[0]];
    const originGradient = {...originLayer.style[prop].gradient};
    const nonOriginLayers = layers.filter((id) => id !== layers[0]);
    currentState = setLayersGradient(currentState, layerActions.setLayersGradient({layers: nonOriginLayers, prop: prop, gradient: originGradient}) as SetLayersGradient);
    switch(prop) {
      case 'fill':
        return enableLayersFill(currentState, layerActions.enableLayersFill({layers: nonOriginLayers}) as EnableLayersFill);
      case 'stroke':
        return enableLayersStroke(currentState, layerActions.enableLayersStroke({layers: nonOriginLayers}) as EnableLayersStroke);
    }
  }
  return currentState;
}

export const setLayersGradientStopColor = (state: LayerState, action: SetLayersGradientStopColor): LayerState => {
  let currentState = state;
  currentState = setLayerGradientStopColor(currentState, layerActions.setLayerGradientStopColor({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex, color: action.payload.color}) as SetLayerGradientStopColor);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopPosition = (state: LayerState, action: SetLayerGradientStopPosition): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
  const newStops = gradient.stops.reduce((result: em.GradientStop[], current, index) => {
    if (index === action.payload.stopIndex) {
      result = [...result, {
        ...current,
        position: action.payload.position
      }]
    } else {
      result = [...result, current];
    }
    return result;
  }, []);
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, gradient.origin),
    destination: getGradientDestinationPoint(currentState, action.payload.id, gradient.destination)
  } as any
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientStopPosition = (state: LayerState, action: SetLayersGradientStopPosition): LayerState => {
  let currentState = state;
  currentState = setLayerGradientStopPosition(currentState, layerActions.setLayerGradientStopPosition({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex, position: action.payload.position}) as SetLayerGradientStopPosition);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const addLayerGradientStop = (state: LayerState, action: AddLayerGradientStop): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
  const newStops = [...gradient.stops, action.payload.gradientStop];
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, gradient.origin),
    destination: getGradientDestinationPoint(currentState, action.payload.id, gradient.destination)
  } as any
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  currentState = setLayerActiveGradientStop(currentState, layerActions.setLayerActiveGradientStop({
    id: action.payload.id,
    stopIndex: newStops.length - 1,
    prop: action.payload.prop
  }) as SetLayerActiveGradientStop);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const addLayersGradientStop = (state: LayerState, action: AddLayersGradientStop): LayerState => {
  let currentState = state;
  currentState = addLayerGradientStop(currentState, layerActions.addLayerGradientStop({id: action.payload.layers[0], prop: action.payload.prop, gradientStop: action.payload.gradientStop}) as AddLayerGradientStop);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const removeLayerGradientStop = (state: LayerState, action: RemoveLayerGradientStop): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const paperProp = getPaperProp(action.payload.prop);
  const gradient = layerItem.style[action.payload.prop].gradient;
  const newStops = gradient.stops.filter((id, index) => index !== action.payload.stopIndex);
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, gradient.origin),
    destination: getGradientDestinationPoint(currentState, action.payload.id, gradient.destination)
  } as any
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              stops: newStops
            }
          }
        }
      }
    }
  }
  currentState = setLayerActiveGradientStop(currentState, layerActions.setLayerActiveGradientStop({id: action.payload.id, prop: action.payload.prop, stopIndex: 0}) as SetLayerActiveGradientStop);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const removeLayersGradientStop = (state: LayerState, action: RemoveLayersGradientStop): LayerState => {
  let currentState = state;
  currentState = removeLayerGradientStop(currentState, layerActions.removeLayerGradientStop({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex}) as RemoveLayerGradientStop);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerActiveGradientStop = (state: LayerState, action: SetLayerActiveGradientStop): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          [action.payload.prop]: {
            ...currentState.byId[action.payload.id].style[action.payload.prop],
            gradient: {
              ...currentState.byId[action.payload.id].style[action.payload.prop].gradient,
              activeStopIndex: action.payload.stopIndex
            }
          }
        }
      }
    }
  }
  return currentState;
};

export const enableLayerStroke = (state: LayerState, action: EnableLayerStroke): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const stroke = currentState.byId[action.payload.id].style.stroke;
  switch(stroke.fillType) {
    case 'color':
      paperLayer.strokeColor = { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a } as paper.Color;
      break;
    case 'gradient':
      paperLayer.strokeColor = {
        gradient: {
          stops: getGradientStops(stroke.gradient.stops),
          radial: stroke.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(currentState, action.payload.id, stroke.gradient.origin),
        destination: getGradientDestinationPoint(currentState, action.payload.id, stroke.gradient.destination)
      } as any
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeWidth', 'dashOffset', 'dashArrayWidth', 'dashArrayGap']);
  return currentState;
};

export const enableLayersStroke = (state: LayerState, action: EnableLayersStroke): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerStroke(result, layerActions.enableLayerStroke({id: current}) as EnableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeWidth', 'dashOffset', 'dashArrayWidth', 'dashArrayGap']);
  return currentState;
};

export const disableLayersStroke = (state: LayerState, action: DisableLayersStroke): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerStroke(result, layerActions.disableLayerStroke({id: current}) as DisableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeColor = (state: LayerState, action: SetLayerStrokeColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  const strokeColor = action.payload.strokeColor;
  const newStroke = { ...layerItem.style.stroke.color, ...strokeColor } as em.Color;
  paperLayer.strokeColor = { hue: newStroke.h, saturation: newStroke.s, lightness: newStroke.l, alpha: newStroke.a } as paper.Color;
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
            color: newStroke
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke']);
  return currentState;
};

export const setLayersStrokeColor = (state: LayerState, action: SetLayersStrokeColor): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeColor(result, layerActions.setLayerStrokeColor({id: current, strokeColor: action.payload.strokeColor}) as SetLayerStrokeColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeFillType = (state: LayerState, action: SetLayerStrokeFillType): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
  const stroke = layerItem.style.stroke;
  switch(action.payload.fillType) {
    case 'color':
      paperLayer.strokeColor = { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a } as paper.Color;
      break;
    case 'gradient':
      paperLayer.strokeColor = {
        gradient: {
          stops: getGradientStops(stroke.gradient.stops),
          radial: stroke.gradient.gradientType === 'radial'
        },
        origin: getGradientOriginPoint(currentState, action.payload.id, stroke.gradient.origin),
        destination: getGradientDestinationPoint(currentState, action.payload.id, stroke.gradient.destination)
      } as any
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke']);
  return currentState;
};

export const setLayersStrokeFillType = (state: LayerState, action: SetLayersStrokeFillType): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeFillType(result, layerActions.setLayerStrokeFillType({id: current, fillType: action.payload.fillType}) as SetLayerStrokeFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['strokeWidth']);
  return currentState;
};

export const setLayersStrokeWidth = (state: LayerState, action: SetLayersStrokeWidth): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeWidth(result, layerActions.setLayerStrokeWidth({id: current, strokeWidth: action.payload.strokeWidth}) as SetLayerStrokeWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  return currentState;
};

export const setLayersStrokeCap = (state: LayerState, action: SetLayersStrokeCap): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeCap(result, layerActions.setLayerStrokeCap({id: current, strokeCap: action.payload.strokeCap}) as SetLayerStrokeCap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  return currentState;
};

export const setLayersStrokeJoin = (state: LayerState, action: SetLayersStrokeJoin): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeJoin(result, layerActions.setLayerStrokeJoin({id: current, strokeJoin: action.payload.strokeJoin}) as SetLayerStrokeJoin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashOffset = (state: LayerState, action: SetLayerStrokeDashOffset): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.dashOffset = action.payload.strokeDashOffset;
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
            dashOffset: action.payload.strokeDashOffset
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashOffset']);
  return currentState;
};

export const setLayersStrokeDashOffset = (state: LayerState, action: SetLayersStrokeDashOffset): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashOffset(result, layerActions.setLayerStrokeDashOffset({id: current, strokeDashOffset: action.payload.strokeDashOffset}) as SetLayerStrokeDashOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashArrayWidth', 'dashArrayGap']);
  return currentState;
};

export const setLayersStrokeDashArray = (state: LayerState, action: SetLayersStrokeDashArray): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashArray(result, layerActions.setLayerStrokeDashArray({id: current, strokeDashArray: action.payload.strokeDashArray}) as SetLayerStrokeDashArray);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayWidth = (state: LayerState, action: SetLayerStrokeDashArrayWidth): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  const dashArray = layerItem.style.strokeOptions.dashArray;
  const newDashArray = [action.payload.strokeDashArrayWidth, dashArray[1]];
  paperLayer.dashArray = newDashArray;
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
            dashArray: newDashArray
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashArrayWidth']);
  return currentState;
};

export const setLayersStrokeDashArrayWidth = (state: LayerState, action: SetLayersStrokeDashArrayWidth): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashArrayWidth(result, layerActions.setLayerStrokeDashArrayWidth({id: current, strokeDashArrayWidth: action.payload.strokeDashArrayWidth}) as SetLayerStrokeDashArrayWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayGap = (state: LayerState, action: SetLayerStrokeDashArrayGap): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  const dashArray = layerItem.style.strokeOptions.dashArray;
  const newDashArray = [dashArray[0], action.payload.strokeDashArrayGap];
  paperLayer.dashArray = newDashArray;
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
            dashArray: newDashArray
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['dashArrayGap']);
  return currentState;
};

export const setLayersStrokeDashArrayGap = (state: LayerState, action: SetLayersStrokeDashArrayGap): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStrokeDashArrayGap(result, layerActions.setLayerStrokeDashArrayGap({id: current, strokeDashArrayGap: action.payload.strokeDashArrayGap}) as SetLayerStrokeDashArrayGap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  return currentState;
};

export const enableLayerShadow = (state: LayerState, action: EnableLayerShadow): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  const shadow = layerItem.style.shadow;
  paperLayer.shadowColor = { hue: shadow.color.h, saturation: shadow.color.s, lightness: shadow.color.l, alpha: shadow.color.a } as paper.Color;
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur']);
  return currentState;
};

export const enableLayersShadow = (state: LayerState, action: EnableLayersShadow): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerShadow(result, layerActions.enableLayerShadow({id: current}) as EnableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur']);
  return currentState;
};

export const disableLayersShadow = (state: LayerState, action: DisableLayersShadow): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerShadow(result, layerActions.disableLayerShadow({id: current}) as DisableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowColor = (state: LayerState, action: SetLayerShadowColor): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = state.byId[action.payload.id];
  const shadowColor = action.payload.shadowColor;
  const newShadow = { ...layerItem.style.shadow.color, ...shadowColor };
  paperLayer.shadowColor = { hue: newShadow.h, saturation: newShadow.s, lightness: newShadow.l, alpha: newShadow.a } as paper.Color;
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
            color: newShadow
          }
        }
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowColor']);
  return currentState;
};

export const setLayersShadowColor = (state: LayerState, action: SetLayersShadowColor): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowColor(result, layerActions.setLayerShadowColor({id: current, shadowColor: action.payload.shadowColor}) as SetLayerShadowColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowBlur']);
  return currentState;
};

export const setLayersShadowBlur = (state: LayerState, action: SetLayersShadowBlur): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowBlur(result, layerActions.setLayerShadowBlur({id: current, shadowBlur: action.payload.shadowBlur}) as SetLayerShadowBlur);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowOffsetX']);
  return currentState;
};

export const setLayersShadowXOffset = (state: LayerState, action: SetLayersShadowXOffset): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowXOffset(result, layerActions.setLayerShadowXOffset({id: current, shadowXOffset: action.payload.shadowXOffset}) as SetLayerShadowXOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['shadowOffsetY']);
  return currentState;
};

export const setLayersShadowYOffset = (state: LayerState, action: SetLayersShadowYOffset): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerShadowYOffset(result, layerActions.setLayerShadowYOffset({id: current, shadowYOffset: action.payload.shadowYOffset}) as SetLayerShadowYOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const scaleLayer = (state: LayerState, action: ScaleLayer): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        transform: {
          ...currentState.byId[action.payload.id].transform,
          horizontalFlip: action.payload.horizontalFlip ? !currentState.byId[action.payload.id].transform.horizontalFlip : currentState.byId[action.payload.id].transform.horizontalFlip,
          verticalFlip: action.payload.verticalFlip ? !currentState.byId[action.payload.id].transform.verticalFlip : currentState.byId[action.payload.id].transform.verticalFlip
        }
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  if (action.payload.scale.x) {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'x', 'y']);
  }
  if (action.payload.scale.y) {
    currentState = updateLayerTweensByProps(currentState, action.payload.id, ['height', 'x', 'y']);
  }
  return currentState;
};

export const scaleLayers = (state: LayerState, action: ScaleLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return scaleLayer(result, layerActions.scaleLayer({id: current, scale: action.payload.scale, verticalFlip: action.payload.verticalFlip, horizontalFlip: action.payload.horizontalFlip}) as ScaleLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fontSize']);
  return currentState;
};

export const setLayersFontSize = (state: LayerState, action: SetLayersFontSize): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFontSize(result, layerActions.setLayerFontSize({id: current, fontSize: action.payload.fontSize}) as SetLayerFontSize);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setLayersFontWeight = (state: LayerState, action: SetLayersFontWeight): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFontWeight(result, layerActions.setLayerFontWeight({id: current, fontWeight: action.payload.fontWeight}) as SetLayerFontWeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setLayersFontFamily = (state: LayerState, action: SetLayersFontFamily): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFontFamily(result, layerActions.setLayerFontFamily({id: current, fontFamily: action.payload.fontFamily}) as SetLayerFontFamily);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['lineHeight']);
  return currentState;
};

export const setLayersLeading = (state: LayerState, action: SetLayersLeading): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerLeading(result, layerActions.setLayerLeading({id: current, leading: action.payload.leading}) as SetLayerLeading);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setLayersJustification = (state: LayerState, action: SetLayersJustification): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerJustification(result, layerActions.setLayerJustification({id: current, justification: action.payload.justification}) as SetLayerJustification);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    if (current.data.id !== 'ArtboardBackground' && current.data.id !== 'ArtboardMask' && current.data.id !== 'Raster') {
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
    }
  }
  return currentState;
};

export const maskLayers = (state: LayerState, action: MaskLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return maskLayer(result, layerActions.maskLayer({id: current}) as MaskLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
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
    }
  }
  return currentState;
};

export const unmaskLayers = (state: LayerState, action: UnmaskLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return unmaskLayer(result, layerActions.unmaskLayer({id: current}) as UnmaskLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const alignLayersToLeft = (state: LayerState, action: AlignLayersToLeft): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.left = layersBounds.left;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const alignLayersToRight = (state: LayerState, action: AlignLayersToRight): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.right = layersBounds.right;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const alignLayersToTop = (state: LayerState, action: AlignLayersToTop): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.top = layersBounds.top;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const alignLayersToBottom = (state: LayerState, action: AlignLayersToBottom): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.bottom = layersBounds.bottom;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const alignLayersToCenter = (state: LayerState, action: AlignLayersToCenter): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.center.x = layersBounds.center.x;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const alignLayersToMiddle = (state: LayerState, action: AlignLayersToMiddle): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    const paperLayer = getPaperLayer(current);
    paperLayer.bounds.center.y = layersBounds.center.y;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const distributeLayersHorizontally = (state: LayerState, action: DistributeLayersHorizontally): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
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
      result = updateLayerBounds(result, current);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const distributeLayersVertically = (state: LayerState, action: DistributeLayersVertically): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
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
      result = updateLayerBounds(result, current);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const duplicateLayer = (state: LayerState, action: DuplicateLayer, fromClipboard?: boolean, documentImages?: { [id: string]: em.DocumentImage }): LayerState => {
  let currentState = state;
  const clonedLayerAndChildren = cloneLayerAndChildren(currentState, action.payload.id, fromClipboard, documentImages);
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
      }
    }
  }, currentState);
  // select layer
  currentState = selectLayer(currentState, layerActions.selectLayer({id: rootLayer.id}) as SelectLayer);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerBlendMode = (state: LayerState, action: SetLayerBlendMode): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.blendMode = action.payload.blendMode;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          blendMode: action.payload.blendMode
        }
      }
    }
  }
  return currentState;
};

export const setLayersBlendMode = (state: LayerState, action: SetLayersBlendMode): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerBlendMode(result, layerActions.setLayerBlendMode({id: current, blendMode: action.payload.blendMode}) as SetLayerBlendMode);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const uniteLayers = (state: LayerState, action: UniteLayers): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path | paper.CompoundPath;
  const booleanPaperLayer = getPaperLayer(action.payload.unite) as paper.Path | paper.CompoundPath;
  const newShapeId = uuidv4();
  const booleanLayers = paperLayer.unite(booleanPaperLayer) as paper.Path | paper.CompoundPath;
  booleanLayers.data = {
    type: 'Shape',
    id: newShapeId
  }
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: [action.payload.id, action.payload.unite]}) as RemoveLayers);
  currentState = addShape(currentState, layerActions.addShape({
    id: newShapeId,
    type: 'Shape',
    parent: layerItem.parent,
    name: 'Custom Shape',
    shapeType: 'Custom',
    frame: {
      x: booleanLayers.position.x,
      y: booleanLayers.position.y,
      width: booleanLayers.bounds.width,
      height: booleanLayers.bounds.height,
      innerWidth: booleanLayers.bounds.width,
      innerHeight: booleanLayers.bounds.height
    },
    selected: false,
    mask: false,
    masked: false,
    tweenEvents: [],
    tweens: [],
    transform: DEFAULT_TRANSFORM,
    style: layerItem.style,
    children: null,
    booleanOperation: 'none',
    path: {
      data: booleanLayers.pathData,
      closed: booleanLayers.closed,
      points: getCurvePoints(booleanLayers)
    }
  }) as AddShape);
  return currentState;
};

export const intersectLayers = (state: LayerState, action: IntersectLayers): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path | paper.CompoundPath;
  const booleanPaperLayer = getPaperLayer(action.payload.intersect) as paper.Path | paper.CompoundPath;
  const newShapeId = uuidv4();
  const booleanLayers = paperLayer.intersect(booleanPaperLayer) as paper.Path | paper.CompoundPath;
  booleanLayers.data = {
    type: 'Shape',
    id: newShapeId
  }
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: [action.payload.id, action.payload.intersect]}) as RemoveLayers);
  currentState = addShape(currentState, layerActions.addShape({
    id: newShapeId,
    type: 'Shape',
    parent: layerItem.parent,
    name: 'Custom Shape',
    shapeType: 'Custom',
    frame: {
      x: booleanLayers.position.x,
      y: booleanLayers.position.y,
      width: booleanLayers.bounds.width,
      height: booleanLayers.bounds.height,
      innerWidth: booleanLayers.bounds.width,
      innerHeight: booleanLayers.bounds.height
    },
    selected: false,
    mask: false,
    masked: false,
    tweenEvents: [],
    tweens: [],
    transform: DEFAULT_TRANSFORM,
    style: layerItem.style,
    children: null,
    booleanOperation: 'none',
    path: {
      data: booleanLayers.pathData,
      closed: booleanLayers.closed,
      points: getCurvePoints(booleanLayers)
    }
  }) as AddShape);
  return currentState;
};

export const subtractLayers = (state: LayerState, action: SubtractLayers): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path | paper.CompoundPath;
  const booleanPaperLayer = getPaperLayer(action.payload.subtract) as paper.Path | paper.CompoundPath;
  const newShapeId = uuidv4();
  const booleanLayers = paperLayer.subtract(booleanPaperLayer) as paper.Path | paper.CompoundPath;
  booleanLayers.data = {
    type: 'Shape',
    id: newShapeId
  }
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: [action.payload.id, action.payload.subtract]}) as RemoveLayers);
  currentState = addShape(currentState, layerActions.addShape({
    id: newShapeId,
    type: 'Shape',
    parent: layerItem.parent,
    name: 'Custom Shape',
    shapeType: 'Custom',
    frame: {
      x: booleanLayers.position.x,
      y: booleanLayers.position.y,
      width: booleanLayers.bounds.width,
      height: booleanLayers.bounds.height,
      innerWidth: booleanLayers.bounds.width,
      innerHeight: booleanLayers.bounds.height
    },
    selected: false,
    mask: false,
    masked: false,
    tweenEvents: [],
    tweens: [],
    transform: DEFAULT_TRANSFORM,
    style: layerItem.style,
    children: null,
    booleanOperation: 'none',
    path: {
      data: booleanLayers.pathData,
      closed: booleanLayers.closed,
      points: getCurvePoints(booleanLayers)
    }
  }) as AddShape);
  return currentState;
};

export const excludeLayers = (state: LayerState, action: ExcludeLayers): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path | paper.CompoundPath;
  const booleanPaperLayer = getPaperLayer(action.payload.exclude) as paper.Path | paper.CompoundPath;
  const newShapeId = uuidv4();
  const booleanLayers = paperLayer.exclude(booleanPaperLayer) as paper.Path | paper.CompoundPath;
  booleanLayers.data = {
    type: 'Shape',
    id: newShapeId
  }
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: [action.payload.id, action.payload.exclude]}) as RemoveLayers);
  currentState = addShape(currentState, layerActions.addShape({
    id: newShapeId,
    type: 'Shape',
    parent: layerItem.parent,
    name: 'Custom Shape',
    shapeType: 'Custom',
    frame: {
      x: booleanLayers.position.x,
      y: booleanLayers.position.y,
      width: booleanLayers.bounds.width,
      height: booleanLayers.bounds.height,
      innerWidth: booleanLayers.bounds.width,
      innerHeight: booleanLayers.bounds.height
    },
    selected: false,
    mask: false,
    masked: false,
    tweenEvents: [],
    tweens: [],
    transform: DEFAULT_TRANSFORM,
    style: layerItem.style,
    children: null,
    booleanOperation: 'none',
    path: {
      data: booleanLayers.pathData,
      closed: booleanLayers.closed,
      points: getCurvePoints(booleanLayers)
    }
  }) as AddShape);
  return currentState;
};

export const divideLayers = (state: LayerState, action: DivideLayers): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path | paper.CompoundPath;
  const booleanPaperLayer = getPaperLayer(action.payload.divide) as paper.Path | paper.CompoundPath;
  const newShapeId = uuidv4();
  const booleanLayers = paperLayer.divide(booleanPaperLayer) as paper.Path | paper.CompoundPath;
  booleanLayers.data = {
    type: 'Shape',
    id: newShapeId
  }
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: [action.payload.id, action.payload.divide]}) as RemoveLayers);
  currentState = addShape(currentState, layerActions.addShape({
    id: newShapeId,
    type: 'Shape',
    parent: layerItem.parent,
    name: 'Custom Shape',
    shapeType: 'Custom',
    frame: {
      x: booleanLayers.position.x,
      y: booleanLayers.position.y,
      width: booleanLayers.bounds.width,
      height: booleanLayers.bounds.height,
      innerWidth: booleanLayers.bounds.width,
      innerHeight: booleanLayers.bounds.height
    },
    selected: false,
    mask: false,
    masked: false,
    tweenEvents: [],
    tweens: [],
    transform: DEFAULT_TRANSFORM,
    style: layerItem.style,
    children: null,
    booleanOperation: 'none',
    path: {
      data: booleanLayers.pathData,
      closed: booleanLayers.closed,
      points: getCurvePoints(booleanLayers)
    }
  }) as AddShape);
  return currentState;
};

export const setRoundedRadius = (state: LayerState, action: SetRoundedRadius): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path;
  const layerItem = currentState.byId[action.payload.id] as em.Rounded;
  paperLayer.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
  const newShape = new paperMain.Path.Rectangle({
    from: paperLayer.bounds.topLeft,
    to: paperLayer.bounds.bottomRight,
    radius: (maxDim / 2) * action.payload.radius,
    insert: false
  });
  paperLayer.pathData = newShape.pathData;
  paperLayer.rotation = layerItem.transform.rotation;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        radius: action.payload.radius,
        path: {
          data: newShape.pathData,
          closed: true,
          points: getCurvePoints(newShape)
        }
      } as em.Rounded
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setRoundedRadii = (state: LayerState, action: SetRoundedRadii): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setRoundedRadius(result, layerActions.setRoundedRadius({id: current, radius: action.payload.radius}) as SetRoundedRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setPolygonSides = (state: LayerState, action: SetPolygonSides): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path;
  const startPosition = paperLayer.position;
  const layerItem = state.byId[action.payload.id] as em.Polygon;
  paperLayer.rotation = -layerItem.transform.rotation;
  const newShape = new paperMain.Path.RegularPolygon({
    center: paperLayer.bounds.center,
    radius: Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2,
    sides: action.payload.sides,
    insert: false
  });
  newShape.bounds.width = paperLayer.bounds.width;
  newShape.bounds.height = paperLayer.bounds.height;
  newShape.rotation = layerItem.transform.rotation;
  newShape.position = startPosition;
  paperLayer.pathData = newShape.pathData;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        sides: action.payload.sides,
        path: {
          data: newShape.pathData,
          closed: true,
          points: getCurvePoints(newShape)
        }
      } as em.Polygon
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setPolygonsSides = (state: LayerState, action: SetPolygonsSides): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setPolygonSides(result, layerActions.setPolygonSides({id: current, sides: action.payload.sides}) as SetPolygonSides);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setStarPoints = (state: LayerState, action: SetStarPoints): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path;
  const startPosition = paperLayer.position;
  const layerItem = state.byId[action.payload.id] as em.Star;
  paperLayer.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
  const newShape = new paperMain.Path.Star({
    center: paperLayer.bounds.center,
    radius1: maxDim / 2,
    radius2: (maxDim / 2) * (layerItem as em.Star).radius,
    points: action.payload.points,
    insert: false
  });
  newShape.bounds.width = paperLayer.bounds.width;
  newShape.bounds.height = paperLayer.bounds.height;
  newShape.rotation = layerItem.transform.rotation;
  newShape.position = startPosition;
  paperLayer.pathData = newShape.pathData;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        points: action.payload.points,
        path: {
          data: newShape.pathData,
          closed: true,
          points: getCurvePoints(newShape)
        }
      } as em.Star
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setStarsPoints = (state: LayerState, action: SetStarsPoints): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setStarPoints(result, layerActions.setStarPoints({id: current, points: action.payload.points}) as SetStarPoints);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setStarRadius = (state: LayerState, action: SetStarRadius): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.Path;
  const layerItem = state.byId[action.payload.id] as em.Star;
  const startPosition = paperLayer.position;
  paperLayer.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
  const newShape = new paperMain.Path.Star({
    center: paperLayer.bounds.center,
    radius1: maxDim / 2,
    radius2: (maxDim / 2) * action.payload.radius,
    points: (layerItem as em.Star).points,
    insert: false
  });
  newShape.bounds.width = paperLayer.bounds.width;
  newShape.bounds.height = paperLayer.bounds.height;
  newShape.rotation = layerItem.transform.rotation;
  newShape.position = startPosition;
  paperLayer.pathData = newShape.pathData;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        radius: action.payload.radius,
        path: {
          data: newShape.pathData,
          closed: true,
          points: getCurvePoints(newShape)
        }
      } as em.Star
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  currentState = updateLayerBounds(currentState, action.payload.id);
  return currentState;
};

export const setStarsRadius = (state: LayerState, action: SetStarsRadius): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setStarRadius(result, layerActions.setStarRadius({id: current, radius: action.payload.radius}) as SetStarRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setCurvePointOriginX = (state: LayerState, action: SetCurvePointOriginX): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id] as em.Shape;
  if (layerItem.path.points.length > 2) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          shapeType: 'Custom'
        } as em.Shape
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setCurvePointOriginY = (state: LayerState, action: SetCurvePointOriginY): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id] as em.Shape;
  if (layerItem.path.points.length > 2) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          shapeType: 'Custom'
        } as em.Shape
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setCurvePointOrigin = (state: LayerState, action: SetCurvePointOrigin): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id] as em.Shape;
  const paperLayer = getPaperLayer(action.payload.id);
  if (layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType === 'Line') {
    const fromPoint = (paperLayer as paper.Path).segments[0].point;
    const toPoint = (paperLayer as paper.Path).segments[1].point;
    const vector = toPoint.subtract(fromPoint);
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          frame: {
            ...currentState.byId[action.payload.id].frame,
            innerWidth: vector.length
          },
          transform: {
            ...currentState.byId[action.payload.id].transform,
            rotation: vector.angle
          }
        } as em.Shape
      }
    }
  }
  if (layerItem.path.points.length > 2) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          shapeType: 'Custom'
        } as em.Shape
      }
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerEdit = (state: LayerState, action: SetLayerEdit): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    edit: action.payload.edit,
    paperProject: savePaperProjectJSON(currentState)
  }
  return currentState;
};