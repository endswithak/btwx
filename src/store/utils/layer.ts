/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import tinyColor from 'tinycolor2';
import { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { addItem, removeItem, insertItem, moveItemAbove, moveItemBelow } from './general';

import {
  AddGroup, AddShape, SelectLayer, DeselectLayer, RemoveLayer,
  AddLayerChild, InsertLayerChild, InsertLayerAbove, InsertLayerBelow, GroupLayers, UngroupLayers, UngroupLayer,
  DeselectAllLayers, RemoveLayers, HideLayerChildren, ShowLayerChildren,
  DecreaseLayerScope, NewLayerScope, SetLayerHover, ClearLayerScope, IncreaseLayerScope, SelectLayers,
  DeselectLayers, MoveLayerTo, MoveLayerBy, MoveLayersTo, MoveLayersBy, DeepSelectLayer, EscapeLayerScope,
  MoveLayer, MoveLayers, AddArtboard, SetLayerName, SetActiveArtboard, AddLayerTween, RemoveLayerTween,
  AddLayerTweenEvent, RemoveLayerTweenEvent, SetLayerTweenDuration, SetLayerTweenDelay, SetLayerTweenEase,
  SetLayerTweenPower, SetLayerX, SetLayerY, SetLayerWidth, SetLayerHeight, SetLayerOpacity, SetLayerFillColor,
  SetLayerStrokeColor, SetLayerStrokeWidth, SetLayerShadowColor, SetLayerShadowBlur, SetLayerShadowXOffset,
  SetLayerShadowYOffset, SetLayerRotation, EnableLayerFill, DisableLayerFill, EnableLayerStroke,
  DisableLayerStroke, DisableLayerShadow, EnableLayerShadow, SetLayerStrokeCap, SetLayerStrokeJoin, ScaleLayer,
  ScaleLayers, EnableLayerHorizontalFlip, DisableLayerHorizontalFlip, EnableLayerVerticalFlip, DisableLayerVerticalFlip,
  AddText, SetLayerText, SetLayerFontSize, SetLayerFontWeight, SetLayerFontFamily, SetLayerLeading, SetLayerJustification,
  SetLayerFillType, SetLayerStrokeFillType, AddLayersMask, RemoveLayersMask, SetLayerFill,
  AlignLayersToLeft, AlignLayersToRight, AlignLayersToTop, AlignLayersToBottom, AlignLayersToCenter, AlignLayersToMiddle,
  DistributeLayersHorizontally, DistributeLayersVertically, DuplicateLayer, DuplicateLayers, RemoveDuplicatedLayers,
  BringLayerForward, SendLayerBackward, BringLayersForward, SendLayersBackward, BringLayerToFront, BringLayersToFront,
  SendLayerToBack, SendLayersToBack, AddImage, InsertLayersAbove, InsertLayersBelow, AddLayerChildren, SetLayerBlendMode,
  UniteLayers, SetRoundedRadius, SetPolygonSides, SetStarPoints, IntersectLayers, SubtractLayers, ExcludeLayers, DivideLayers,
  SetStarRadius, SetLayerStrokeDashOffset, SetLayersOpacity, SetLayersBlendMode, SetLayersX, SetLayersY, SetLayersWidth,
  SetLayersHeight, SetLayersRotation, SetLayersFillColor, SetLayersStrokeColor, SetLayersShadowColor, EnableLayersFill,
  DisableLayersFill, EnableLayersStroke, DisableLayersStroke, EnableLayersShadow, DisableLayersShadow, SetLayersFillType,
  SetLayersStrokeFillType, SetLayersStrokeWidth, SetLayersStrokeCap, SetLayersStrokeJoin, SetLayersStrokeDashOffset,
  SetLayerStrokeDashArray, SetLayersStrokeDashArray, SetLayerStrokeDashArrayWidth, SetLayersStrokeDashArrayWidth, SetLayerStrokeDashArrayGap,
  SetLayersStrokeDashArrayGap, SetLayerGradient, SetLayersGradient, SetLayerGradientType, SetLayersGradientType,
  SetLayerGradientOrigin, SetLayersGradientOrigin, SetLayerGradientDestination, SetLayersGradientDestination, SetLayerGradientStopColor,
  SetLayersGradientStopColor, SetLayerGradientStopPosition, SetLayersGradientStopPosition, AddLayerGradientStop, AddLayersGradientStop,
  RemoveLayerGradientStop, RemoveLayersGradientStop, SetLayerActiveGradientStop, SetLayersShadowBlur, SetLayersShadowXOffset,
  SetLayersShadowYOffset, SetLayersFontSize, SetLayersFontWeight, SetLayersFontFamily, SetLayersLeading, SetLayersJustification,
  SetLayerTweenTiming, SetRoundedRadii, SetPolygonsSides, SetStarsPoints, SetStarsRadius, SetLayerEdit, AddLayers, SetLineFromX,
  SetLineFromY, SetLineFrom, SetLineToX, SetLineToY, SetLineTo, SetLinesFromX, SetLinesFromY, SetLinesToX, SetLinesToY, SelectAllLayers,
  SetLayerStyle, SetLayersStyle, EnableLayersHorizontalFlip, DisableLayersHorizontalFlip, DisableLayersVerticalFlip, EnableLayersVerticalFlip,
  SetLayerScope, SetLayersScope, SetGlobalScope, SetLayerUnderlyingMask, SetLayersUnderlyingMask, SetLayerMasked, SetLayersMasked, ToggleLayerMask,
  ToggleLayersMask, ToggleLayersIgnoreUnderlyingMask, ToggleLayerIgnoreUnderlyingMask
} from '../actionTypes/layer';

import {
  getLayerIndex, getLayer, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor, getPaperLayer, getSelectionTopLeft,
  getSelectionBottomRight, getClipboardCenter, getSelectionCenter, getLayerAndDescendants, getLayerDescendants,
  getDestinationEquivalent, getEquivalentTweenProps, getDeepSelectItem,
  getTweensByDestinationLayer, getTweensEventsByOriginArtboard, getTweensEventsByDestinationArtboard, getTweensByLayer,
  getLayersBounds, getGradientOriginPoint, getGradientDestinationPoint, getGradientStops, getLayerSnapPoints,
  orderLayersByDepth, orderLayersByLeft, orderLayersByTop, savePaperProjectJSON, getTweensByProp,
  getEquivalentTweenProp, getTweensWithLayer, gradientsMatch, getPaperProp, getArtboardsTopTop, getSelectionBounds,
  getTweenEventsWithArtboard, getLineFromPoint, getLineToPoint, getLineVector, getParentPaperLayer, getLayerUnderlyingSiblings,
  getMaskableUnderlyingSiblings, getSiblingLayersWithUnderlyingMask, getLayerUnderlyingMaskRoot, getOlderSiblingIgnoringUnderlyingMask
} from '../selectors/layer';

import { paperMain } from '../../canvas';

import { THEME_PRIMARY_COLOR, DEFAULT_TWEEN_EVENTS } from '../../constants';
import MeasureGuide from '../../canvas/measureGuide';
import getTheme from '../theme';

export const addArtboard = (state: LayerState, action: AddArtboard): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.layer.id);
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: {
        ...action.payload.layer as Btwx.Artboard,
        scope: ['page']
      },
      [currentState.page]: {
        ...currentState.byId[currentState.page],
        children: addItem(currentState.byId[currentState.page].children, action.payload.layer.id)
      } as Btwx.Page
    },
    allArtboardIds: addItem(currentState.allArtboardIds, action.payload.layer.id)
  }
  if (!action.payload.batch) {
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const addShape = (state: LayerState, action: AddShape): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.layer.id);
  const parentItem = state.byId[action.payload.layer.parent];
  // add shape
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: {
        ...action.payload.layer as Btwx.Shape,
        scope: [...parentItem.scope, action.payload.layer.parent]
      },
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
        // showChildren: true
      } as Btwx.Group
    },
    allShapeIds: addItem(state.allShapeIds, action.payload.layer.id)
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (!action.payload.batch) {
    if (parentItem.type !== 'Page' && !(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const addGroup = (state: LayerState, action: AddGroup): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.layer.id);
  const parentItem = state.byId[action.payload.layer.parent];
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: {
        ...action.payload.layer as Btwx.Group,
        scope: [...parentItem.scope, action.payload.layer.parent]
      },
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
        // showChildren: true
      } as Btwx.Group
    },
    allGroupIds: addItem(state.allGroupIds, action.payload.layer.id)
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  if (!action.payload.batch) {
    if (parentItem.type !== 'Page' && !(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const addText = (state: LayerState, action: AddText): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.layer.id);
  const parentItem = state.byId[action.payload.layer.parent];
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: {
        ...action.payload.layer as Btwx.Text,
        scope: [...parentItem.scope, action.payload.layer.parent]
      },
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
        // showChildren: true
      } as Btwx.Group
    },
    allTextIds: addItem(state.allTextIds, action.payload.layer.id)
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (!action.payload.batch) {
    if (parentItem.type !== 'Page' && !(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const addImage = (state: LayerState, action: AddImage): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.layer.id);
  const parentItem = state.byId[action.payload.layer.parent];
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: {
        ...action.payload.layer as Btwx.Image,
        scope: [...parentItem.scope, action.payload.layer.parent]
      },
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
      } as Btwx.Group
    },
    allImageIds: addItem(state.allImageIds, action.payload.layer.id)
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (!action.payload.batch) {
    if (parentItem.type !== 'Page' && !(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const addLayers = (state: LayerState, action: AddLayers): LayerState => {
  let currentState = state;
  // currentState = action.payload.layers.reduce((result: LayerState, current) => {
  //   switch(current.type) {
  //     case 'Artboard':
  //       result = addArtboard(result, layerActions.addArtboard({layer: current as Btwx.Artboard, batch: true}) as AddArtboard);
  //       break;
  //     case 'Shape':
  //       result = addShape(result, layerActions.addShape({layer: current as Btwx.Shape, batch: true}) as AddShape);
  //       break;
  //     case 'Image':
  //       result = addImage(result, layerActions.addImage({layer: current as Btwx.Image, batch: true}) as AddImage);
  //       break;
  //     case 'Group':
  //       result = addGroup(result, layerActions.addGroup({layer: current as Btwx.Group, batch: true}) as AddGroup);
  //       break;
  //     case 'Text':
  //       result = addText(result, layerActions.addText({layer: current as Btwx.Text, batch: true}) as AddText);
  //       break;
  //   }
  //   return result;
  // }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const layersToRemove = getLayerAndDescendants(state, action.payload.id);
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  currentState = layersToRemove.reduce((result, current) => {
    const tweensByDestinationLayer = getTweensByDestinationLayer(result, current);
    const tweensByLayer = getTweensByLayer(result, current);
    const layer = result.byId[current];
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
    // if layer is the active artboard, set active artboard to null
    if (layer.id === result.activeArtboard) {
      result = setActiveArtboard(result, layerActions.setActiveArtboard({id: result.allArtboardIds.length > 0 ? result.allArtboardIds[0] : null}) as SetActiveArtboard);
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
    // if artboard, remove any tween events with artboard as origin or destination
    if (layer.type === 'Artboard') {
      const tweenEventsWithArtboard = getTweenEventsWithArtboard(result, layer.id);
      result = tweenEventsWithArtboard.allIds.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
      }, result);
    }
    return result;
  }, currentState);
  // if ignoring underlying mask
  if (layerItem.ignoreUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  // if layer mask
  if (isMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  // if selection includes layer, remove layer from selection
  if (currentState.selected.includes(action.payload.id)) {
    currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: [action.payload.id]}) as DeselectLayers);
  }
  // remove paper layer
  getPaperLayer(action.payload.id).remove();
  // remove layer
  currentState = {
    ...currentState,
    allIds: currentState.allIds.filter((id) => !layersToRemove.includes(id)),
    byId: Object.keys(currentState.byId).reduce((result: any, key) => {
      if (!layersToRemove.includes(key)) {
        if (layerItem.parent && layerItem.parent === key) {
          result[key] = {
            ...currentState.byId[key],
            children: removeItem(currentState.byId[key].children, action.payload.id)
          }
        } else {
          result[key] = currentState.byId[key];
        }
      }
      return result;
    }, {})
  }
  if (layerItem.scope.includes(action.payload.id)) {
    currentState = setGlobalScope(currentState, layerActions.setGlobalScope({
      scope: layerItem.scope
    }) as SetGlobalScope);
  }
  if (layerItem.parent !== 'page') {
    currentState = updateLayerBounds(currentState, layerItem.parent);
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

export const updateGradientFrame = (layerItem: Btwx.Layer, gradient: Btwx.Gradient, themeName: Btwx.ThemeName) => {
  const theme = getTheme(themeName);
  const stopsWithIndex = gradient.stops.map((stop, index) => {
    return {
      ...stop,
      index
    }
  });
  const sortedStops = stopsWithIndex.sort((a,b) => { return a.position - b.position });
  const originStop = sortedStops[0];
  const destStop = sortedStops[sortedStops.length - 1];
  const oldGradientFrame = paperMain.project.getItem({ data: { id: 'GradientFrame' } });
  if (oldGradientFrame) {
    oldGradientFrame.remove();
  }
  const gradientFrameHandleBgProps = {
    radius: (theme.unit * 2) / paperMain.view.zoom,
    fillColor: '#fff',
    shadowColor: new paperMain.Color(0, 0, 0, 0.5),
    shadowBlur: theme.unit / 2,
    insert: false,
    strokeWidth: 1 / paperMain.view.zoom
  }
  const gradientFrameHandleSwatchProps = {
    radius: (theme.unit + 2) / paperMain.view.zoom,
    fillColor: '#fff',
    insert: false
  }
  const gradientFrameLineProps = {
    from: getGradientOriginPoint(layerItem, gradient.origin),
    to: getGradientDestinationPoint(layerItem, gradient.destination),
    insert: false
  }
  const gradientFrameOriginHandleBg  = new paperMain.Shape.Circle({
    ...gradientFrameHandleBgProps,
    center: getGradientOriginPoint(layerItem, gradient.origin),
    data: {
      type: 'UIElementChild',
      interactive: true,
      interactiveType: 'origin',
      elementId: 'GradientFrame'
    },
    strokeColor: originStop.index === gradient.activeStopIndex ? theme.palette.primary : null
  });
  const gradientFrameOriginHandleSwatch  = new paperMain.Shape.Circle({
    ...gradientFrameHandleSwatchProps,
    fillColor: { hue: originStop.color.h, saturation: originStop.color.s, lightness: originStop.color.l, alpha: originStop.color.a },
    center: getGradientOriginPoint(layerItem, gradient.origin),
    data: {
      type: 'UIElementChild',
      interactive: true,
      interactiveType: 'origin',
      elementId: 'GradientFrame'
    }
  });
  const gradientFrameDestinationHandleBg = new paperMain.Shape.Circle({
    ...gradientFrameHandleBgProps,
    center: getGradientDestinationPoint(layerItem, gradient.destination),
    data: {
      type: 'UIElementChild',
      interactive: true,
      interactiveType: 'destination',
      elementId: 'GradientFrame'
    },
    strokeColor: destStop.index === gradient.activeStopIndex ? theme.palette.primary : null
  });
  const gradientFrameDestinationHandleSwatch = new paperMain.Shape.Circle({
    ...gradientFrameHandleSwatchProps,
    fillColor: { hue: destStop.color.h, saturation: destStop.color.s, lightness: destStop.color.l, alpha: destStop.color.a },
    center: getGradientDestinationPoint(layerItem, gradient.destination),
    data: {
      type: 'UIElementChild',
      interactive: true,
      interactiveType: 'destination',
      elementId: 'GradientFrame'
    }
  });
  const gradientFrameLineDark = new paperMain.Path.Line({
    ...gradientFrameLineProps,
    strokeColor: new paperMain.Color(0, 0, 0, 0.25),
    strokeWidth: 3 / paperMain.view.zoom,
    data: {
      id: 'GradientFrameLine',
      type: 'UIElementChild',
      interactive: false,
      interactiveType: null,
      elementId: 'GradientFrame'
    }
  });
  const gradientFrameLineLight = new paperMain.Path.Line({
    ...gradientFrameLineProps,
    strokeColor: '#fff',
    strokeWidth: 1 / paperMain.view.zoom,
    data: {
      id: 'GradientFrameLine',
      type: 'UIElementChild',
      interactive: false,
      interactiveType: null,
      elementId: 'GradientFrame'
    }
  });
  const gradientFrameOriginHandle = new paperMain.Group({
    data: {
      id: 'GradientFrameOriginHandle',
      type: 'UIElementChild',
      interactive: true,
      interactiveType: 'origin',
      elementId: 'GradientFrame'
    },
    insert: false,
    children: [gradientFrameOriginHandleBg, gradientFrameOriginHandleSwatch],
    // onMouseDown: () => {
    //   if (originStop.index !== gradient.activeStopIndex) {
    //     onStopPress(originStop.index);
    //   }
    // }
  });
  const gradientFrameDestinationHandle = new paperMain.Group({
    data: {
      id: 'GradientFrameDestinationHandle',
      type: 'UIElementChild',
      interactive: true,
      interactiveType: 'destination',
      elementId: 'GradientFrame'
    },
    insert: false,
    children: [gradientFrameDestinationHandleBg, gradientFrameDestinationHandleSwatch],
    // onMouseDown: () => {
    //   if (destStop.index !== gradient.activeStopIndex) {
    //     onStopPress(destStop.index);
    //   }
    // }
  });
  const gradientFrameLines = new paperMain.Group({
    data: {
      id: 'GradientFrameLines',
      type: 'UIElementChild',
      interactive: false,
      interactiveType: null,
      elementId: 'GradientFrame'
    },
    insert: false,
    children: [gradientFrameLineDark, gradientFrameLineLight]
  });
  const newGradientFrame = new paperMain.Group({
    data: {
      id: 'GradientFrame',
      type: 'UIElement',
      interactive: false,
      interactiveType: null,
      elementId: 'GradientFrame'
    },
    children: [gradientFrameLines, gradientFrameOriginHandle, gradientFrameDestinationHandle]
  });
}

export const deselectLayer = (state: LayerState, action: DeselectLayer): LayerState => {
  const layer = state.byId[action.payload.id] as Btwx.Layer;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.data.selected = false;
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
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  return currentState;
};

export const selectAllLayers = (state: LayerState, action: SelectAllLayers): LayerState => {
  const pageItem = state.byId['page'];
  return selectLayers(state, layerActions.selectLayers({layers: pageItem.children, newSelection: true}) as SelectLayers);
};

export const deselectAllLayers = (state: LayerState, action: DeselectAllLayers): LayerState => {
  let currentState = state;
  currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: currentState.selected}) as DeselectLayers);
  currentState = clearLayerScope(currentState, layerActions.clearLayerScope() as ClearLayerScope);
  return currentState;
};

export const selectLayer = (state: LayerState, action: SelectLayer): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const hasArtboardParent = layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard';
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.data.selected = true;
  // if layer is an artboard or group and current selection includes...
  // any of its descendants, deselect those descendants
  if (layerItem.type === 'Artboard' || layerItem.type === 'Group') {
    if (state.selected.some((selectedItem) => currentState.byId[selectedItem].scope.includes(action.payload.id))) {
      const layersToDeselect = state.selected.filter((selectedItem) => currentState.byId[selectedItem].scope.includes(action.payload.id));
      currentState = deselectLayers(currentState, layerActions.deselectLayers({layers:layersToDeselect }) as DeselectLayers);
    }
  }
  // if layer is an artboard, make it the active artboard
  if (layerItem.type === 'Artboard' && currentState.activeArtboard !== action.payload.id && !action.payload.noActiveArtboardUpdate) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: action.payload.id}) as SetActiveArtboard);
  }
  // if layer scope root is an artboard, make the layer scope root the active artboard
  if (hasArtboardParent && currentState.activeArtboard !== layerItem.scope[1]) {
    if (!action.payload.noActiveArtboardUpdate) {
      currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: layerItem.scope[1]}) as SetActiveArtboard);
    }
  }
  // handle hover
  if (layerItem.id !== currentState.hover) {
    currentState = setLayerHover(currentState, layerActions.setLayerHover({id: action.payload.id}) as SetLayerHover);
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
  // update scope
  if (layerItem.scope[layerItem.scope.length - 1] !== currentState.scope[currentState.scope.length - 1]) {
    currentState = setGlobalScope(currentState, layerActions.setGlobalScope({scope: layerItem.scope}) as SetGlobalScope);
  }
  // order selected by depth
  const orderedSelected = orderLayersByDepth(currentState, currentState.selected);
  currentState = {
    ...currentState,
    selected: [...orderedSelected]
  }
  // return final state
  return currentState;
};

export const deepSelectLayer = (state: LayerState, action: DeepSelectLayer): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const nearestScopeAncestor = getNearestScopeAncestor(currentState, action.payload.id);
  const deepSelectItem = getDeepSelectItem(currentState, action.payload.id);
  if ((nearestScopeAncestor.type === 'Group' || nearestScopeAncestor.type === 'Artboard') && !(nearestScopeAncestor as Btwx.Group | Btwx.Artboard).showChildren) {
    currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: nearestScopeAncestor.id}) as ShowLayerChildren);
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [deepSelectItem.id], newSelection: true}) as SelectLayers);
  return currentState;
};

export const selectLayers = (state: LayerState, action: SelectLayers): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    currentState = deselectAllLayers(currentState, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  currentState = action.payload.layers.reduce((result, current) => {
    if (state.byId[current].selected && action.payload.toggleSelected) {
      return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
    } else {
      return selectLayer(result, layerActions.selectLayer({id: current, noActiveArtboardUpdate: action.payload.noActiveArtboardUpdate}) as SelectLayer);
    }
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  return currentState;
};

// export const updateSelectedBounds = (state: LayerState): LayerState => {
//   let currentState = state;
//   const selectionBounds = getSelectionBounds(state) as any;
//   if (selectionBounds) {
//     const boundsMatch = state.selectedBounds && Object.keys(state.selectedBounds).every((key) => (state.selectedBounds as any)[key] === selectionBounds[key]);
//     if (!boundsMatch) {
//       currentState = {
//         ...currentState,
//         selectedBounds: {
//           x: parseInt(selectionBounds.center.x.toFixed(2)),
//           y: parseInt(selectionBounds.center.y.toFixed(2)),
//           width: parseInt(selectionBounds.width.toFixed(2)),
//           height: parseInt(selectionBounds.height.toFixed(2))
//         }
//       }
//     }
//   } else {
//     if (currentState.selectedBounds) {
//       currentState = {
//         ...currentState,
//         selectedBounds: null
//       }
//     }
//   }
//   return currentState;
// };

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  let currentState = state;
  const currentHover = state.hover;
  const nextHover = action.payload.id;
  if (currentHover) {
    const currentHoverPaperLayer = getPaperLayer(currentHover);
    currentHoverPaperLayer.data.hover = false;
  }
  if (nextHover) {
    const nextHoverPaperLayer = getPaperLayer(nextHover);
    nextHoverPaperLayer.data.hover = true;
  }
  currentState = {
    ...currentState,
    hover: action.payload.id
  };
  return currentState;
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const childItem = currentState.byId[action.payload.child];
  const isChildMask = childItem.type === 'Shape' && (childItem as Btwx.Shape).mask;
  const paperLayer = getParentPaperLayer(state, action.payload.id);
  const childPaperLayer = isChildMask ? getPaperLayer(action.payload.child).parent : getPaperLayer(action.payload.child);
  const aboveId = layerItem.children.length > 0 && layerItem.children[layerItem.children.length - 1] !== action.payload.child ? layerItem.children[layerItem.children.length - 1] : null;
  const aboveItem = aboveId ? currentState.byId[aboveId] : null;
  const isAboveMask = aboveItem && aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
  const abovePaperLayer = aboveItem ? (isAboveMask ? getPaperLayer(aboveId).parent : getPaperLayer(aboveId)) : null;
  // if mask, handle previous underlying siblings
  if (isChildMask) {
    const maskSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.child);
    if (maskSiblings.length > 0) {
      currentState = maskSiblings.reduce((result: LayerState, current) => {
        const siblingItem = result.byId[current];
        const isShape = siblingItem.type === 'Shape';
        const isMask = isShape && (siblingItem as Btwx.Shape).mask;
        const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
        siblingPaperLayer.insertAbove(childPaperLayer);
        if (siblingItem.underlyingMask === action.payload.child) {
          result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: childItem.underlyingMask}) as SetLayerUnderlyingMask);
        }
        if (!childItem.masked) {
          result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
        }
        return result;
      }, currentState);
    }
  }
  // move child
  isAboveMask ? abovePaperLayer.insertChild(0, childPaperLayer) : paperLayer.addChild(childPaperLayer);
  // handle parents / children
  if (childItem.parent !== action.payload.id) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [childItem.parent]: {
          ...currentState.byId[childItem.parent],
          children: removeItem((currentState.byId[childItem.parent] as Btwx.Group).children, action.payload.child)
        } as Btwx.Group,
        [action.payload.child]: {
          ...currentState.byId[action.payload.child],
          parent: action.payload.id,
          scope: [...layerItem.scope, action.payload.id],
          underlyingMask: aboveItem ? isAboveMask ? aboveItem.id : aboveItem.underlyingMask : null,
          masked: aboveItem ? (aboveItem.masked || isAboveMask) && !childItem.ignoreUnderlyingMask : false
        },
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          showChildren: true,
          children: addItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child)
        } as Btwx.Group
      }
    };
    if (childItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.child);
    }
    if (childItem.parent !== 'page') {
      currentState = updateLayerBounds(currentState, childItem.parent);
    }
    if (action.payload.id !== 'page') {
      currentState = updateLayerBounds(currentState, action.payload.id);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.child]: {
          ...currentState.byId[action.payload.child],
          underlyingMask: aboveItem ? (isAboveMask ? aboveItem.id : aboveItem.underlyingMask) : null,
          masked: aboveItem ? (aboveItem.masked || isAboveMask) && !childItem.ignoreUnderlyingMask : false
        },
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          showChildren: true,
          children: addItem(removeItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child), action.payload.child)
        } as Btwx.Group
      }
    };
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.child], newSelection: true}) as SelectLayers);
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

// export const insertLayerChild = (state: LayerState, action: InsertLayerChild): LayerState => {
//   let currentState = state;
//   const layerItem = currentState.byId[action.payload.id] as Btwx.Artboard | Btwx.Group;
//   const childItem = currentState.byId[action.payload.child];
//   const isChildMask = childItem.type === 'Shape' && (childItem as Btwx.Shape).mask;
//   const paperLayer = getPaperLayer(action.payload.id);
//   const childPaperLayer = isChildMask ? getPaperLayer(action.payload.child).parent : getPaperLayer(action.payload.child);
//   const currentIndexId = layerItem.children[action.payload.index];
//   const currentIndexItem = currentState.byId[currentIndexId];
//   const isCurrentItemMasked = currentIndexItem && (currentIndexItem as Btwx.Shape).masked;
//   const isCurrentItemMask = currentIndexItem && currentIndexItem.type === 'Shape' && (currentIndexItem as Btwx.Shape).mask;
//   // const currentItemMask = currentIndexItem.underlyingMask === action.payload.child ? childItem.underlyingMask : currentIndexItem.underlyingMask;
//   // const currentParentPaperLayer = currentItemMask ? getPaperLayer(`${currentItemMask}-MaskGroup`) : null;
//   // const belowId = action.payload.index !== 0 ? layerItem.children[action.payload.index - 1] : null;
//   // const belowItem = belowId ? currentState.byId[belowId] : null;
//   // const abovePaperLayer = aboveItem ? (isAboveMask ? getPaperLayer(aboveId).parent : getPaperLayer(aboveId)) : null;
//   // if mask, handle previous underlying siblings
//   if (isChildMask) {
//     const maskSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.child);
//     if (maskSiblings.length > 0) {
//       currentState = maskSiblings.reduce((result: LayerState, current) => {
//         const siblingItem = result.byId[current];
//         const isShape = siblingItem.type === 'Shape';
//         const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//         const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//         siblingPaperLayer.insertBelow(childPaperLayer);
//         if (siblingItem.underlyingMask === action.payload.child) {
//           result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: childItem.underlyingMask}) as SetLayerUnderlyingMask);
//         }
//         if (!childItem.masked) {
//           result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
//         }
//         return result;
//       }, currentState);
//     }
//   }
//   // move child
//   currentItemMask && !childItem.ignoreUnderlyingMask ? currentParentPaperLayer.insertChild(0, childPaperLayer) : paperLayer.insertChild(action.payload.index, childPaperLayer);
//   // handle parents / children
//   if (childItem.parent !== action.payload.id) {
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [childItem.parent]: {
//           ...currentState.byId[childItem.parent],
//           children: removeItem((currentState.byId[childItem.parent] as Btwx.Group).children, action.payload.child)
//         } as Btwx.Group,
//         [action.payload.child]: {
//           ...currentState.byId[action.payload.child],
//           parent: action.payload.id,
//           scope: [...layerItem.scope, action.payload.id],
//           // underlyingMask: aboveItem ? isAboveMask ? aboveItem.id : aboveItem.underlyingMask : null,
//           // masked: aboveItem ? (aboveItem.masked || isAboveMask) && !childItem.ignoreUnderlyingMask : false
//         },
//         [action.payload.id]: {
//           ...currentState.byId[action.payload.id],
//           children: insertItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child, action.payload.index)
//         } as Btwx.Group
//       }
//     };
//     if (childItem.type === 'Group') {
//       currentState = updateNestedScopes(currentState, action.payload.child);
//     }
//     if (childItem.parent !== 'page') {
//       currentState = updateLayerBounds(currentState, childItem.parent);
//     }
//     if (action.payload.id !== 'page') {
//       currentState = updateLayerBounds(currentState, action.payload.id);
//     }
//   } else {
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [action.payload.child]: {
//           ...currentState.byId[action.payload.child],
//           underlyingMask: currentItemMask,
//           masked: currentItemMask && !childItem.ignoreUnderlyingMask
//         },
//         [action.payload.id]: {
//           ...currentState.byId[action.payload.id],
//           children: insertItem(removeItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child), action.payload.child, action.payload.index)
//         } as Btwx.Group
//       }
//     };
//   }
//   // if mask, handle new underlying siblings
//   if (isChildMask) {
//     const newMaskedSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.child);
//     if (newMaskedSiblings.length > 0) {
//       currentState = newMaskedSiblings.reduce((result, current) => {
//         const siblingItem = currentState.byId[current];
//         const isShape = siblingItem.type === 'Shape';
//         const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//         const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//         childPaperLayer.addChild(siblingPaperLayer);
//         result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.child}) as SetLayerUnderlyingMask);
//         if (!siblingItem.masked) {
//           result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: true}) as SetLayerMasked);
//         }
//         return result;
//       }, currentState);
//     }
//   }
//   currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.child], newSelection: true}) as SelectLayers);
//   return currentState;
// };

export const showLayerChildren = (state: LayerState, action: ShowLayerChildren): LayerState => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...state.byId[action.payload.id],
        showChildren: true
      } as Btwx.Group
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
      } as Btwx.Group
    }
  }
};

// export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
//   let currentState = state;
//   const layerItem = currentState.byId[action.payload.id];
//   const layerIndex = getLayerIndex(currentState, action.payload.id);
//   const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
//   const belowItem = currentState.byId[action.payload.below];
//   const belowParent = currentState.byId[belowItem.parent] as Btwx.Group;
//   const belowIndex = getLayerIndex(currentState, action.payload.below)
//   const isBelowMask = belowItem.type === 'Shape' && (belowItem as Btwx.Shape).mask;
//   const paperLayer = isLayerMask ? getPaperLayer(action.payload.id).parent : getPaperLayer(action.payload.id);
//   const belowPaperLayer = isBelowMask ? getPaperLayer(action.payload.below).parent : getPaperLayer(action.payload.below);
//   const osium = getOlderSiblingIgnoringUnderlyingMask(currentState, action.payload.below) === action.payload.id ? getOlderSiblingIgnoringUnderlyingMask(currentState, action.payload.id) : getOlderSiblingIgnoringUnderlyingMask(currentState, action.payload.below);
//   // if mask, handle previous underlying siblings
//   if (isLayerMask) {
//     const maskSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
//     if (maskSiblings.length > 0) {
//       currentState = maskSiblings.reduce((result: LayerState, current) => {
//         const siblingItem = result.byId[current];
//         const isShape = siblingItem.type === 'Shape';
//         const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//         const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//         siblingPaperLayer.insertAbove(paperLayer);
//         if (siblingItem.underlyingMask === action.payload.id) {
//           result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: layerItem.underlyingMask}) as SetLayerUnderlyingMask);
//         }
//         if (!layerItem.masked) {
//           result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
//         }
//         return result;
//       }, currentState);
//     }
//   }
//   // move paper layer
//   paperLayer.insertBelow(belowPaperLayer);
//   // handle parents / children
//   if (layerItem.parent !== belowItem.parent) {
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [action.payload.id]: {
//           ...currentState.byId[action.payload.id],
//           parent: belowItem.parent,
//           scope: [...belowParent.scope, belowItem.parent],
//           underlyingMask: belowItem.underlyingMask,
//           masked: belowItem.masked && !layerItem.ignoreUnderlyingMask
//         },
//         [layerItem.parent]: {
//           ...currentState.byId[layerItem.parent],
//           children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
//         } as Btwx.Group,
//         [belowItem.parent]: {
//           ...currentState.byId[belowItem.parent],
//           children: insertItem((currentState.byId[belowItem.parent] as Btwx.Group).children, action.payload.id, belowIndex)
//         } as Btwx.Group
//       }
//     };
//     if (layerItem.type === 'Group') {
//       currentState = updateNestedScopes(currentState, action.payload.id);
//     }
//     if (layerItem.parent !== 'page') {
//       currentState = updateLayerBounds(currentState, layerItem.parent);
//     }
//     if (belowItem.parent !== 'page') {
//       currentState = updateLayerBounds(currentState, belowItem.parent);
//     }
//   } else {
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [action.payload.id]: {
//           ...currentState.byId[action.payload.id],
//           underlyingMask: belowItem.underlyingMask === layerItem.id ? layerItem.underlyingMask : belowItem.underlyingMask,
//           masked: !osium && !layerItem.ignoreUnderlyingMask
//           // masked: belowItem.masked && !layerItem.ignoreUnderlyingMask
//         },
//         [layerItem.parent]: {
//           ...currentState.byId[layerItem.parent],
//           children: moveItemAbove(currentState.byId[layerItem.parent].children, layerIndex, belowIndex)
//         } as Btwx.Group
//       }
//     };
//   }
//   //
//   if (layerItem.ignoreUnderlyingMask) {
//     const newMaskedSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
//     if (newMaskedSiblings.length > 0) {
//       currentState = setLayersMasked(currentState, layerActions.setLayersMasked({layers: newMaskedSiblings, masked: false}) as SetLayersMasked);
//     }
//   }
//   // if mask, handle new underlying siblings
//   if (isLayerMask) {
//     const newMaskedSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
//     if (newMaskedSiblings.length > 0) {
//       currentState = newMaskedSiblings.reduce((result, current) => {
//         const siblingItem = currentState.byId[current];
//         const isShape = siblingItem.type === 'Shape';
//         const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//         const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//         paperLayer.addChild(siblingPaperLayer);
//         result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.id}) as SetLayerUnderlyingMask);
//         if (!siblingItem.masked) {
//           result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: true}) as SetLayerMasked);
//         }
//         return result;
//       }, currentState);
//     }
//   }
//   currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.id], newSelection: true}) as SelectLayers);
//   return currentState;
// };

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const isLayerIgnoringUnderlyingMask = layerItem.ignoreUnderlyingMask;
  const belowItem = currentState.byId[action.payload.below];
  const belowParent = currentState.byId[belowItem.parent] as Btwx.Group;
  const belowIndex = getLayerIndex(currentState, action.payload.below)
  const isBelowMask = belowItem.type === 'Shape' && (belowItem as Btwx.Shape).mask;
  const isBelowIgnoringUnderlyingMask = belowItem.ignoreUnderlyingMask;
  const paperLayer = getPaperLayer(action.payload.id);
  const belowPaperLayer = getPaperLayer(action.payload.below);
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  if (isBelowIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.below}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isBelowMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.below}) as ToggleLayerMask);
  }
  const newLayerItem = currentState.byId[action.payload.id];
  const newBelowItem = currentState.byId[action.payload.below];
  paperLayer.insertBelow(belowPaperLayer);
  if (layerItem.parent !== belowItem.parent) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: belowItem.parent,
          scope: [...belowParent.scope, belowItem.parent],
          underlyingMask: newBelowItem.underlyingMask,
          masked: newBelowItem.masked && !newLayerItem.ignoreUnderlyingMask
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
        } as Btwx.Group,
        [belowItem.parent]: {
          ...currentState.byId[belowItem.parent],
          children: insertItem((currentState.byId[belowItem.parent] as Btwx.Group).children, action.payload.id, belowIndex)
        } as Btwx.Group
      }
    };
    if (layerItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.id);
    }
    if (layerItem.parent !== 'page') {
      currentState = updateLayerBounds(currentState, layerItem.parent);
    }
    if (belowItem.parent !== 'page') {
      currentState = updateLayerBounds(currentState, belowItem.parent);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          underlyingMask: newBelowItem.underlyingMask,
          masked: newBelowItem.masked && !newLayerItem.ignoreUnderlyingMask
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: moveItemAbove(currentState.byId[layerItem.parent].children, layerIndex, belowIndex)
        } as Btwx.Group
      }
    };
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  if (isBelowIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.below}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isBelowMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.below}) as ToggleLayerMask);
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.id], newSelection: true}) as SelectLayers);
  return currentState;
};

export const insertLayersBelow = (state: LayerState, action: InsertLayersBelow) => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result, current) => {
    return insertLayerBelow(result, layerActions.insertLayerBelow({id: current, below: action.payload.below}) as InsertLayerBelow);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

// export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
//   let currentState = state;
//   const layerItem = state.byId[action.payload.id];
//   const layerIndex = getLayerIndex(currentState, action.payload.id);
//   const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
//   const aboveItem = state.byId[action.payload.above];
//   const aboveParentItem = state.byId[aboveItem.parent] as Btwx.Group;
//   const aboveIndex = getLayerIndex(currentState, action.payload.above);
//   const isAboveMask = aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
//   const paperLayer = isLayerMask ? getPaperLayer(action.payload.id).parent : getPaperLayer(action.payload.id);
//   const abovePaperLayer = isAboveMask ? getPaperLayer(action.payload.above).parent : getPaperLayer(action.payload.above);
//   // if mask, handle previous underlying siblings
//   if (isLayerMask) {
//     const maskSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
//     if (maskSiblings.length > 0) {
//       currentState = maskSiblings.reduce((result: LayerState, current) => {
//         const siblingItem = result.byId[current];
//         const isShape = siblingItem.type === 'Shape';
//         const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//         const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//         siblingPaperLayer.insertAbove(paperLayer);
//         if (siblingItem.underlyingMask === action.payload.id) {
//           result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: layerItem.underlyingMask}) as SetLayerUnderlyingMask);
//         }
//         if (!layerItem.masked) {
//           result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
//         }
//         return result;
//       }, currentState);
//     }
//   }
//   // move paper layer
//   isAboveMask && !layerItem.ignoreUnderlyingMask ? abovePaperLayer.insertChild(0, paperLayer) : paperLayer.insertAbove(abovePaperLayer);
//   // handle parents / children
//   if (layerItem.parent !== aboveItem.parent) {
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [action.payload.id]: {
//           ...currentState.byId[action.payload.id],
//           parent: aboveItem.parent,
//           scope: [...aboveParentItem.scope, aboveItem.parent],
//           underlyingMask: isAboveMask ? aboveItem.id : aboveItem.underlyingMask,
//           masked: aboveItem.masked || isAboveMask && !layerItem.ignoreUnderlyingMask
//         },
//         [layerItem.parent]: {
//           ...currentState.byId[layerItem.parent],
//           children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
//         } as Btwx.Group,
//         [aboveItem.parent]: {
//           ...currentState.byId[aboveItem.parent],
//           children: insertItem((currentState.byId[aboveItem.parent] as Btwx.Group).children, action.payload.id, aboveIndex + 1)
//         } as Btwx.Group
//       }
//     };
//     if (layerItem.type === 'Group') {
//       currentState = updateNestedScopes(currentState, action.payload.id);
//     }
//     if (layerItem.parent !== 'page') {
//       currentState = updateLayerBounds(currentState, layerItem.parent);
//     }
//     if (aboveItem.parent !== 'page') {
//       currentState = updateLayerBounds(currentState, aboveItem.parent);
//     }
//   } else {
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [action.payload.id]: {
//           ...currentState.byId[action.payload.id],
//           underlyingMask: isAboveMask ? aboveItem.id : aboveItem.underlyingMask === action.payload.id ? layerItem.underlyingMask : aboveItem.underlyingMask,
//           masked: aboveItem.masked ? aboveItem.underlyingMask === action.payload.id ? (isAboveMask && !layerItem.ignoreUnderlyingMask) : aboveItem.masked : (isAboveMask && !layerItem.ignoreUnderlyingMask)
//           // masked: ((aboveItem.masked && aboveItem.underlyingMask !== action.payload.id) || isAboveMask) && !layerItem.ignoreUnderlyingMask
//         },
//         [layerItem.parent]: {
//           ...currentState.byId[layerItem.parent],
//           children: moveItemBelow(currentState.byId[layerItem.parent].children, layerIndex, aboveIndex)
//         } as Btwx.Group
//       }
//     };
//   }
//   // if mask, handle new underlying siblings
//   if (isLayerMask) {
//     const newMaskedSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
//     if (newMaskedSiblings.length > 0) {
//       currentState = newMaskedSiblings.reduce((result, current) => {
//         const siblingItem = currentState.byId[current];
//         const isShape = siblingItem.type === 'Shape';
//         const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//         const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//         paperLayer.addChild(siblingPaperLayer);
//         result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.id}) as SetLayerUnderlyingMask);
//         if (!siblingItem.masked) {
//           result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: true}) as SetLayerMasked);
//         }
//         return result;
//       }, currentState);
//     }
//   }
//   currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.id], newSelection: true}) as SelectLayers);
//   return currentState;
// };

// export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
//   let currentState = state;
//   const layerItem = state.byId[action.payload.id];
//   const layerParentItem = state.byId[layerItem.parent];
//   const layerIndex = getLayerIndex(currentState, action.payload.id);
//   const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
//   const prevUnderlyingMask = layerItem.underlyingMask;
//   const prevMasked = layerItem.masked;
//   const prevBelowItem = layerIndex !== 0 ? currentState.byId[layerParentItem.children[layerIndex - 1]] : null;
//   const isPrevBelowMask = prevBelowItem && prevBelowItem.type === 'Shape' && (prevBelowItem as Btwx.Shape).mask;
//   const prevBelowPaperLayer = prevBelowItem ? isPrevBelowMask ? getPaperLayer(action.payload.id).parent : getPaperLayer(action.payload.id) : null;
//   const aboveItem = state.byId[action.payload.above];
//   const aboveParentItem = state.byId[aboveItem.parent] as Btwx.Group;
//   const aboveIndex = getLayerIndex(currentState, action.payload.above);
//   const isAboveMask = aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
//   const paperLayer = isLayerMask ? getPaperLayer(action.payload.id).parent : getPaperLayer(action.payload.id);
//   const abovePaperLayer = isAboveMask ? getPaperLayer(action.payload.above).parent : getPaperLayer(action.payload.above);
//   const isAboveLayerUnderlyingMask = aboveItem.underlyingMask === action.payload.id;
//   // isAboveMask && !isAboveLayerUnderlyingMask ? abovePaperLayer.insertChild(0, paperLayer) : paperLayer.insertAbove(abovePaperLayer);
//   if (isAboveMask) {
//     if (isAboveLayerUnderlyingMask) {
//       if (layerItem.ignoreUnderlyingMask) {
//         paperLayer.parent
//       } else {

//       }
//     } else {
//       if (layerItem.ignoreUnderlyingMask) {
//         abovePaperLayer.insertBelow(paperLayer);
//       } else {
//         abovePaperLayer.insertChild(0, paperLayer);
//       }
//     }
//   }
//   if (layerItem.parent !== aboveItem.parent) {
//     // currentState = {
//     //   ...currentState,
//     //   byId: {
//     //     ...currentState.byId,
//     //     [action.payload.id]: {
//     //       ...currentState.byId[action.payload.id],
//     //       parent: aboveItem.parent,
//     //       scope: [...aboveParentItem.scope, aboveItem.parent],
//     //       underlyingMask: isAboveMask ? aboveItem.id : aboveItem.underlyingMask,
//     //       masked: aboveItem.masked || isAboveMask && !layerItem.ignoreUnderlyingMask
//     //     },
//     //     [layerItem.parent]: {
//     //       ...currentState.byId[layerItem.parent],
//     //       children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
//     //     } as Btwx.Group,
//     //     [aboveItem.parent]: {
//     //       ...currentState.byId[aboveItem.parent],
//     //       children: insertItem((currentState.byId[aboveItem.parent] as Btwx.Group).children, action.payload.id, aboveIndex + 1)
//     //     } as Btwx.Group
//     //   }
//     // };
//     // if (layerItem.type === 'Group') {
//     //   currentState = updateNestedScopes(currentState, action.payload.id);
//     // }
//     // if (layerItem.parent !== 'page') {
//     //   currentState = updateLayerBounds(currentState, layerItem.parent);
//     // }
//     // if (aboveItem.parent !== 'page') {
//     //   currentState = updateLayerBounds(currentState, aboveItem.parent);
//     // }
//   } else {
//     const prevIndex = aboveParentItem.children.indexOf(action.payload.id);
//     const movingBackward = prevIndex > aboveIndex;
//     const nextUnderlyingMask = movingBackward ? isAboveMask ? aboveItem.id : aboveItem.underlyingMask : isAboveLayerUnderlyingMask ? layerItem.underlyingMask : isAboveMask ? action.payload.above : aboveItem.underlyingMask;
//     const nextMasked = movingBackward ? ((isAboveMask || aboveItem.masked) && !layerItem.underlyingMask) : isAboveLayerUnderlyingMask ? layerItem.masked : aboveItem.masked && !layerItem.ignoreUnderlyingMask;
//     currentState = {
//       ...currentState,
//       byId: {
//         ...currentState.byId,
//         [action.payload.id]: {
//           ...currentState.byId[action.payload.id],
//           underlyingMask: nextUnderlyingMask,
//           masked: nextMasked
//         },
//         [layerItem.parent]: {
//           ...currentState.byId[layerItem.parent],
//           children: moveItemBelow(currentState.byId[layerItem.parent].children, layerIndex, aboveIndex)
//         } as Btwx.Group
//       }
//     };
//     if (isLayerMask) {
//       const newMaskedSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
//       if (newMaskedSiblings.length > 0) {
//         currentState = newMaskedSiblings.reduce((result, current) => {
//           const siblingItem = currentState.byId[current];
//           const isShape = siblingItem.type === 'Shape';
//           const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//           const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//           paperLayer.addChild(siblingPaperLayer);
//           if (siblingItem.underlyingMask !== action.payload.id) {
//             result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.id}) as SetLayerUnderlyingMask);
//           }
//           if (!siblingItem.masked) {
//             result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: true}) as SetLayerMasked);
//           }
//           return result;
//         }, currentState);
//       }
//       if (!movingBackward) {
//         const prevMaskedSiblings = currentState.byId[aboveItem.parent].children.slice(prevIndex, aboveIndex);
//         if (prevMaskedSiblings.length > 0) {
//           currentState = prevMaskedSiblings.reduce((result, current) => {
//             const siblingItem = currentState.byId[current];
//             const isShape = siblingItem.type === 'Shape';
//             const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//             const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//             siblingPaperLayer.insertBelow(paperLayer);
//             if (siblingItem.underlyingMask === action.payload.id) {
//               result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: prevUnderlyingMask}) as SetLayerUnderlyingMask);
//             }
//             if (siblingItem.masked && (!prevBelowItem || (prevBelowItem && !prevBelowItem.masked))) {
//               result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
//             }
//             return result;
//           }, currentState);
//         }
//       }
//     } else {
//       if (layerItem.ignoreUnderlyingMask) {
//         const newMaskedSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
//         if (newMaskedSiblings.length > 0) {
//           currentState = newMaskedSiblings.reduce((result, current) => {
//             const siblingItem = currentState.byId[current];
//             const isShape = siblingItem.type === 'Shape';
//             const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//             const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//             if (siblingItem.masked) {
//               paperLayer.parent.addChild(siblingPaperLayer);
//               result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
//             }
//             return result;
//           }, currentState);
//         }
//         if (!movingBackward) {
//           const prevMaskedSiblings = currentState.byId[aboveItem.parent].children.slice(prevIndex, aboveIndex);
//           if (prevMaskedSiblings.length > 0) {
//             currentState = prevMaskedSiblings.reduce((result, current) => {
//               const siblingItem = currentState.byId[current];
//               const isShape = siblingItem.type === 'Shape';
//               const isMask = isShape && (siblingItem as Btwx.Shape).mask;
//               const siblingPaperLayer = isMask ? getPaperLayer(current).parent : getPaperLayer(current);
//               siblingPaperLayer.insertBelow(paperLayer);
//               if (siblingItem.masked && (!prevBelowItem || (prevBelowItem && !prevBelowItem.masked))) {
//                 result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
//               }
//               return result;
//             }, currentState);
//           }
//         }
//       }
//     }
//   }
//   currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.id], newSelection: true}) as SelectLayers);
//   return currentState;
// };

export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  // const layerParentItem = state.byId[layerItem.parent];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const isLayerIgnoringUnderlyingMask = layerItem.ignoreUnderlyingMask;
  const aboveItem = state.byId[action.payload.above];
  const aboveIndex = getLayerIndex(currentState, action.payload.above);
  const isAboveMask = aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
  const isAboveIgnoringUnderlyingMask = aboveItem.ignoreUnderlyingMask;
  const paperLayer = getPaperLayer(action.payload.id);
  const abovePaperLayer = getPaperLayer(action.payload.above);
  const aboveParentItem = currentState.byId[aboveItem.parent];
  if (isAboveIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.above}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isAboveMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.above}) as ToggleLayerMask);
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  const newLayerItem = currentState.byId[action.payload.id];
  const newAboveItem = currentState.byId[action.payload.above];
  paperLayer.insertAbove(abovePaperLayer);
  if (layerItem.parent !== aboveItem.parent) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: aboveItem.parent,
          scope: [...aboveParentItem.scope, aboveItem.parent],
          underlyingMask: newAboveItem.underlyingMask,
          masked: newAboveItem.masked && !newLayerItem.ignoreUnderlyingMask
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
        } as Btwx.Group,
        [aboveItem.parent]: {
          ...currentState.byId[aboveItem.parent],
          children: insertItem((currentState.byId[aboveItem.parent] as Btwx.Group).children, action.payload.id, aboveIndex + 1)
        } as Btwx.Group
      }
    };
    if (layerItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.id);
    }
    if (layerItem.parent !== 'page') {
      currentState = updateLayerBounds(currentState, layerItem.parent);
    }
    if (aboveItem.parent !== 'page') {
      currentState = updateLayerBounds(currentState, aboveItem.parent);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          underlyingMask: newAboveItem.underlyingMask,
          masked: newAboveItem.masked && !newLayerItem.ignoreUnderlyingMask
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: moveItemBelow(currentState.byId[layerItem.parent].children, layerIndex, aboveIndex)
        } as Btwx.Group
      }
    };
  }
  if (isAboveIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.above}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isAboveMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.above}) as ToggleLayerMask);
  }
  if (isLayerIgnoringUnderlyingMask) {
    currentState = toggleLayerIgnoreUnderlyingMask(currentState, layerActions.toggleLayerIgnoreUnderlyingMask({id: action.payload.id}) as ToggleLayerIgnoreUnderlyingMask);
  }
  if (isLayerMask) {
    currentState = toggleLayerMask(currentState, layerActions.toggleLayerMask({id: action.payload.id}) as ToggleLayerMask);
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.id], newSelection: true}) as SelectLayers);
  return currentState;
};

export const insertLayersAbove = (state: LayerState, action: InsertLayersAbove): LayerState => {
  let currentState = state;
  const orderedLayers = orderLayersByDepth(state, action.payload.layers);
  currentState = orderedLayers.reverse().reduce((result, current) => {
    return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: action.payload.above}) as InsertLayerAbove);
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

export const decreaseLayerScope = (state: LayerState, action: DecreaseLayerScope): LayerState => ({
  ...state,
  scope: state.scope.filter((id, index) => index !== state.scope.length - 1)
});

export const clearLayerScope = (state: LayerState, action: ClearLayerScope): LayerState => ({
  ...state,
  scope: ['page']
});

export const newLayerScope = (state: LayerState, action: NewLayerScope): LayerState => ({
  ...state,
  scope: state.byId[action.payload.id].scope
});

export const escapeLayerScope = (state: LayerState, action: EscapeLayerScope): LayerState => {
  const nextScope = state.scope.filter((id, index) => index !== state.scope.length - 1);
  let currentState = state;
  if (state.scope.length > 1) {
    currentState = selectLayers(state, layerActions.selectLayers({layers: [state.scope[state.scope.length - 1]], newSelection: true}) as SelectLayers);
  } else {
    currentState = deselectAllLayers(state, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  return {
    ...currentState,
    scope: nextScope
  }
};

export const setLayerScope = (state: LayerState, action: SetLayerScope): LayerState => ({
  ...state,
  byId: {
    ...state.byId,
    [action.payload.id]: {
      ...state.byId[action.payload.id],
      scope: [...action.payload.scope]
    }
  }
});

export const setLayersScope = (state: LayerState, action: SetLayersScope): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerScope(result, layerActions.setLayerScope({id: current, scope: action.payload.scope}) as SetLayerScope);
  }, state);
  return currentState;
};

export const setGlobalScope = (state: LayerState, action: SetGlobalScope): LayerState => ({
  ...state,
  scope: [...action.payload.scope]
});

export const updateNestedScopes = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const layerItem = state.byId[id];
  const groups: string[] = [id];
  let i = 0;
  const currentScope = [...layerItem.scope, id];
  while(i < groups.length) {
    const groupLayer = state.byId[groups[i]];
    if (groupLayer.children) {
      groupLayer.children.forEach((child) => {
        const childLayerItem = state.byId[child];
        if (childLayerItem.children && childLayerItem.children.length > 0) {
          groups.push(child);
          currentScope.push(child);
        }
        currentState = {
          ...currentState,
          byId: {
            ...currentState.byId,
            [child]: {
              ...currentState.byId[child],
              scope: currentScope
            }
          }
        }
      });
    }
    i++;
  }
  return currentState;
}

export const groupLayers = (state: LayerState, action: GroupLayers): LayerState => {
  let currentState = state;
  // add group
  // currentState = addGroup(currentState, layerActions.addGroup({layer: action.payload.group}) as AddGroup);
  // order children
  const orderedChildren = orderLayersByDepth(currentState, action.payload.layers);
  // if (orderedChildren.find((id) => state.byId[id].mask)) {
  //   const mask = orderedChildren.find((id) => state.byId[id].mask);
  //   currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: mask}) as RemoveLayersMask);
  // }
  // move group above top layer
  currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.group.id, below: action.payload.layers[0]}) as InsertLayerBelow);
  // add layers to group
  currentState = action.payload.layers.reduce((result: LayerState, current: string) => {
    result = addLayerChild(result, layerActions.addLayerChild({id: action.payload.group.id, child: current}) as AddLayerChild);
    return result;
  }, currentState);
  // select final group
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.group.id], newSelection: true}) as SelectLayers);
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
    // if (paperLayer.clipped) {
    //   const maskLayer = layer.children.find((id) => state.byId[id].mask);
    //   currentState = removeLayersMask(currentState, layerActions.removeLayersMask({id: maskLayer}) as RemoveLayersMask);
    // }
    // move children out of group
    currentState = layer.children.reduce((result: LayerState, current: string) => {
      return insertLayerBelow(result, layerActions.insertLayerBelow({id: current, below: layer.id}) as InsertLayerBelow);
    }, currentState);
    // select ungrouped children
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: layer.children, newSelection: true}) as SelectLayers);
    // remove group
    currentState = removeLayer(currentState, layerActions.removeLayer({id: layer.id}) as RemoveLayer);
  } else {
    currentState = selectLayers(state, layerActions.selectLayers({layers: [layer.id], newSelection: true}) as SelectLayers);
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

const getLayerCloneMap = (state: LayerState, id: string) => {
  const groups: string[] = [id];
  const layerCloneMap: {[id: string]: string} = {
    [id]: uuidv4()
  };
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
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

const clonePaperLayers = (state: LayerState, id: string, layerCloneMap: any) => {
  const paperLayer = getPaperLayer(id);
  const parentLayer = state.byId[state.scope[state.scope.length - 1]];
  const paperParentLayer = getParentPaperLayer(state, parentLayer.id);
  const paperLayerClone = paperLayer.clone({deep: paperLayer.data.layerType === 'Shape', insert: true});
  if (paperLayer.data.layerType === 'Artboard') {
    const artboardMask = paperLayer.getItem({ data: { id: 'ArtboardMask' }});
    const artboardMaskClone = artboardMask.clone({deep: false, insert: true});
    artboardMaskClone.parent = paperLayerClone;
    const artboardBackground = paperLayer.getItem({ data: { id: 'ArtboardBackground' }});
    const artboardBackgroundClone = artboardBackground.clone({deep: false, insert: true});
    artboardBackgroundClone.parent = paperLayerClone;
    const artboardLayers = paperLayer.getItem({ data: { id: 'ArtboardLayers' }});
    const artboardLayersClone = artboardLayers.clone({deep: false, insert: true});
    artboardLayersClone.parent = paperLayerClone;
  }
  if (paperLayer.data.layerType === 'Image') {
    const raster = paperLayer.getItem({ data: { id: 'Raster' }});
    const rasterClone = raster.clone({deep: false, insert: true});
    rasterClone.parent = paperLayerClone;
  }
  paperLayerClone.data.id = layerCloneMap[id];
  paperLayerClone.parent = paperParentLayer;
  const groups: string[] = [id];
  let i = 0;
  while(i < groups.length) {
    const layer = state.byId[groups[i]];
    const groupClonePaperLayer = getParentPaperLayer(state, layerCloneMap[layer.id]);
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.byId[child];
        const childPaperLayer = getPaperLayer(child);
        const childPaperLayerClone = childPaperLayer.clone({deep: childPaperLayer.className === 'CompoundPath', insert: true});
        childPaperLayerClone.data.id = layerCloneMap[child];
        childPaperLayerClone.parent = groupClonePaperLayer;
        if (childPaperLayer.data.type === 'Image') {
          const raster = childPaperLayer.getItem({ data: { id: 'Raster' }});
          const rasterClone = raster.clone({deep: false, insert: true});
          rasterClone.parent = childPaperLayerClone;
        }
        if (childLayer.children && childLayer.children.length > 0) {
          groups.push(child);
        }
      });
    }
    i++;
  }
}

const cloneLayerAndChildren = (state: LayerState, id: string) => {
  const layerCloneMap = getLayerCloneMap(state, id);
  clonePaperLayers(state, id, layerCloneMap);
  const rootLayer = state.byId[id];
  const rootParent = state.byId[state.scope[state.scope.length - 1]];
  return Object.keys(layerCloneMap).reduce((result: any, key: string, index: number) => {
    const layer = state.byId[key];
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
          scope: layer.scope.reduce((scopeResult, currentScopeItem) => {
            if (currentScopeItem !== 'page') {
              scopeResult = [...scopeResult, layerCloneMap[currentScopeItem]];
            } else {
              scopeResult = [...scopeResult, currentScopeItem];
            }
            return scopeResult;
          }, []),
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

// export const pasteLayerFromClipboard = (payload: {state: LayerState; id: string; pasteOverSelection?: boolean; documentImages?: { [id: string]: Btwx.DocumentImage }}): LayerState => {
//   let currentState = payload.state;
//   currentState = duplicateLayer(currentState, layerActions.duplicateLayer({id: payload.id}) as DuplicateLayer, true, payload.documentImages);
//   const clonedLayerAndChildren = currentState.allIds.filter((id) => !payload.state.allIds.includes(id));
//   // paste over selection is specified
//   if (payload.pasteOverSelection && payload.state.selected.length > 0) {
//     const selectionCenter = getSelectionCenter(payload.state);
//     const clipboardCenter = getClipboardCenter(payload.state, payload.documentImages);
//     const paperLayer = getPaperLayer(clonedLayerAndChildren[0]);
//     const paperLayerCenter = paperLayer.position;
//     paperLayer.position.x = selectionCenter.x + (paperLayerCenter.x - clipboardCenter.x);
//     paperLayer.position.y = selectionCenter.y + (paperLayerCenter.y - clipboardCenter.y);
//     currentState = moveLayerTo(currentState, layerActions.moveLayerTo({id: clonedLayerAndChildren[0], x: paperLayer.position.x, y: paperLayer.position.y}) as MoveLayerTo);
//   }
//   return currentState;
// };

export const updateParentBounds = (state: LayerState, id: string): LayerState => {
  const layerItem = state.byId[id];
  return layerItem.scope.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    const layerItem = result.byId[current];
    if (layerItem.transform.rotation !== 0) {
      const clone = paperLayer.clone({insert: false});
      clone.rotation = -layerItem.transform.rotation;
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              innerWidth: clone.bounds.width,
              innerHeight: clone.bounds.height
            }
          }
        }
      }
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
    if (result.byId[current].type === 'Shape') {
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            pathData: (paperLayer as paper.Path | paper.CompoundPath).pathData
          } as Btwx.Shape
        }
      }
    }
    if (layerItem.transform.rotation !== 0) {
      const clone = paperLayer.clone({insert: false});
      clone.rotation = -layerItem.transform.rotation;
      result = {
        ...result,
        byId: {
          ...result.byId,
          [current]: {
            ...result.byId[current],
            frame: {
              ...result.byId[current].frame,
              innerWidth: clone.bounds.width,
              innerHeight: clone.bounds.height
            }
          }
        }
      }
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
          pathData: (paperLayer as paper.PathItem).pathData
        } as Btwx.Shape
      }
    }
    if ((layerItem as Btwx.Shape).shapeType === 'Line') {
      const fromPoint = (paperLayer as paper.Path).firstSegment.point;
      const toPoint = (paperLayer as paper.Path).lastSegment.point;
      const vector = toPoint.subtract(fromPoint);
      currentState = {
        ...currentState,
        byId: {
          ...currentState.byId,
          [id]: {
            ...currentState.byId[id],
            from: {
              x: (fromPoint.x - paperLayer.position.x) / vector.length,
              y: (fromPoint.y - paperLayer.position.y) / vector.length
            },
            to: {
              x: (toPoint.x - paperLayer.position.x) / vector.length,
              y: (toPoint.y - paperLayer.position.y) / vector.length
            },
            transform: {
              ...currentState.byId[id].transform,
              rotation: vector.angle
            }
          } as Btwx.Line
        }
      }
    }
  }
  if (layerItem.type === 'Text') {
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
  if (layerItem.transform.rotation !== 0) {
    const clone = paperLayer.clone({insert: false});
    clone.rotation = -layerItem.transform.rotation;
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [id]: {
          ...currentState.byId[id],
          frame: {
            ...currentState.byId[id].frame,
            innerWidth: clone.bounds.width,
            innerHeight: clone.bounds.height
          }
        }
      }
    }
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerName = (state: LayerState, action: SetLayerName): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.name = action.payload.name;
  // remove existing tweens
  if (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard') {
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
  let currentState = state;
  const currentActiveArtboard = state.activeArtboard;
  const nextActiveArtboard = action.payload.id;
  if (currentActiveArtboard) {
    const currentActiveArtboardPaperLayer = getPaperLayer(currentActiveArtboard);
    currentActiveArtboardPaperLayer.data.activeArtboard = false;
  }
  if (nextActiveArtboard) {
    const nextActiveArtboardPaperLayer = getPaperLayer(nextActiveArtboard);
    nextActiveArtboardPaperLayer.data.activeArtboard = true;
  }
  currentState = {
    ...currentState,
    activeArtboard: action.payload.id
  }
  return currentState;
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
        [action.payload.id]: action.payload as Btwx.TweenEvent
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
    const artboardLayerItem = state.byId[tweenEvent.artboard] as Btwx.Artboard;
    const destinationArtboardLayerItem = state.byId[tweenEvent.destinationArtboard] as Btwx.Artboard;
    const equivalentTweenProps = getEquivalentTweenProps(currentLayerItem, equivalentLayerItem, artboardLayerItem, destinationArtboardLayerItem);
    currentState = Object.keys(equivalentTweenProps).reduce((result, key: Btwx.TweenProp) => {
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
      [action.payload.id]: action.payload as Btwx.Tween
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

export const updateLayerTweensByProp = (state: LayerState, layerId: string, prop: Btwx.TweenProp): LayerState => {
  let currentState = state;
  const layerItem = state.byId[layerId];
  if (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard') {
    const artboard = layerItem.scope[1];
    const tweensByProp = getTweensByProp(currentState, layerId, prop);
    const eventsWithArtboardAsOrigin = getTweensEventsByOriginArtboard(currentState, artboard);
    const eventsWithArtboardAsDestination = getTweensEventsByDestinationArtboard(currentState, artboard);
    // filter tweens by prop
    // if new layer prop matches destination prop, remove tween
    // if new destination prop matches layer prop, remove tween
    if (tweensByProp.allIds.length > 0) {
      currentState = tweensByProp.allIds.reduce((result: LayerState, current: string) => {
        const tween = result.tweenById[current];
        const tweenEvent = result.tweenEventById[tween.event];
        const layerItem = result.byId[tween.layer] as Btwx.Layer;
        const destinationLayerItem = result.byId[tween.destinationLayer] as Btwx.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as Btwx.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as Btwx.Artboard;
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
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[destinationEquivalent.id] as Btwx.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as Btwx.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as Btwx.Artboard;
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
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[originEquivalent.id] as Btwx.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as Btwx.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as Btwx.Artboard;
        const hasTween = getEquivalentTweenProp(layerItem, equivalentLayerItem, destinationArtboardItem, artboardItem, prop);
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

export const updateLayerTweensByProps = (state: LayerState, layerId: string, props: Btwx.TweenProp[] | 'all'): LayerState => {
  let currentState = state;
  if (props === 'all') {
    const tweenProps = ['image', 'shape', 'fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY', 'x', 'y', 'radius', 'rotation', 'width', 'height', 'stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeDashWidth', 'strokeDashGap', 'strokeWidth', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'opacity', 'fontSize', 'lineHeight', 'fromX', 'fromY', 'toX', 'toY'] as Btwx.TweenProp[];
    currentState = tweenProps.reduce((result: LayerState, current: Btwx.TweenProp) => {
      result = updateLayerTweensByProp(result, layerId, current);
      return result;
    }, currentState);
  } else {
    currentState = (props as Btwx.TweenProp[]).reduce((result: LayerState, current: Btwx.TweenProp) => {
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
  const layerItem = state.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id);
  if (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard') {
    const artboard = layerItem.scope[1];
    const artboardItem = state.byId[artboard];
    x = x + (artboardItem.frame.x - (artboardItem.frame.width / 2));
  }
  paperLayer.position.x = x;
  // currentState = {
  //   ...currentState,
  //   byId: {
  //     ...currentState.byId,
  //     [action.payload.id]: {
  //       ...currentState.byId[action.payload.id],
  //       frame: {
  //         ...currentState.byId[action.payload.id].frame,
  //         x: x
  //       }
  //     }
  //   }
  // }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  return currentState;
};

export const setLayersX = (state: LayerState, action: SetLayersX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerX(result, layerActions.setLayerX({id: current, x: action.payload.x}) as SetLayerX);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerY = (state: LayerState, action: SetLayerY): LayerState => {
  let currentState = state;
  let y = action.payload.y;
  const layerItem = state.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id);
  if (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard') {
    const artboard = layerItem.scope[1];
    const artboardItem = state.byId[artboard];
    y = y + (artboardItem.frame.y - (artboardItem.frame.height / 2));
  }
  paperLayer.position.y = y;
  // currentState = {
  //   ...currentState,
  //   byId: {
  //     ...currentState.byId,
  //     [action.payload.id]: {
  //       ...currentState.byId[action.payload.id],
  //       frame: {
  //         ...currentState.byId[action.payload.id].frame,
  //         y: y
  //       }
  //     }
  //   }
  // }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  return currentState;
};

export const setLayersY = (state: LayerState, action: SetLayersY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerY(result, layerActions.setLayerY({id: current, y: action.payload.y}) as SetLayerY);
  }, state);
  // currentState = updateSelectedBounds(currentState);
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
    mask.position.x = layerItem.frame.x;
    mask.position.y = layerItem.frame.y;
    background.position.x = layerItem.frame.x;
    background.position.y = layerItem.frame.y;
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
  // currentState = updateSelectedBounds(currentState);
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
    mask.position.x = layerItem.frame.x;
    mask.position.y = layerItem.frame.y;
    background.position.x = layerItem.frame.x;
    background.position.y = layerItem.frame.y;
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
  // currentState = updateSelectedBounds(currentState);
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
  const layerItem = currentState.byId[action.payload.id];
  const startPosition = paperLayer.position;
  paperLayer.rotation = -layerItem.transform.rotation;
  paperLayer.rotation = action.payload.rotation;
  paperLayer.position = startPosition;
  if (layerItem.type === 'Shape') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          pathData: (paperLayer as paper.PathItem).pathData
        } as Btwx.Shape
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['rotation']);
  currentState = updateLayerBounds(currentState, action.payload.id);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setLayersRotation = (state: LayerState, action: SetLayersRotation): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerRotation(result, layerActions.setLayerRotation({id: current, rotation: action.payload.rotation}) as SetLayerRotation);
  }, state);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const enableLayerHorizontalFlip = (state: LayerState, action: EnableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.scale(-1, 1);
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
  return currentState;
};

export const enableLayersHorizontalFlip = (state: LayerState, action: EnableLayersHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerHorizontalFlip(result, layerActions.enableLayerHorizontalFlip({id: current}) as EnableLayerHorizontalFlip);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const disableLayerHorizontalFlip = (state: LayerState, action: DisableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.scale(-1, 1);
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
  return currentState;
};

export const disableLayersHorizontalFlip = (state: LayerState, action: DisableLayersHorizontalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerHorizontalFlip(result, layerActions.disableLayerHorizontalFlip({id: current}) as DisableLayerHorizontalFlip);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const enableLayerVerticalFlip = (state: LayerState, action: EnableLayerVerticalFlip): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.scale(1, -1);
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
  return currentState;
};

export const enableLayersVerticalFlip = (state: LayerState, action: EnableLayersVerticalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return enableLayerVerticalFlip(result, layerActions.enableLayerVerticalFlip({id: current}) as EnableLayerVerticalFlip);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const disableLayerVerticalFlip = (state: LayerState, action: DisableLayerVerticalFlip): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.scale(1, -1);
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
  return currentState;
};

export const disableLayersVerticalFlip = (state: LayerState, action: DisableLayersVerticalFlip): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return disableLayerVerticalFlip(result, layerActions.disableLayerVerticalFlip({id: current}) as DisableLayerVerticalFlip);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const enableLayerFill = (state: LayerState, action: EnableLayerFill): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id);
  const layerItem = currentState.byId[action.payload.id];
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
        origin: getGradientOriginPoint(layerItem, fill.gradient.origin),
        destination: getGradientDestinationPoint(layerItem, fill.gradient.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
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
  const newFill = { ...layerItem.style.fill.color, ...fillColor } as Btwx.Color;
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
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
        origin: getGradientOriginPoint(layerItem, fill.gradient.origin),
        destination: getGradientDestinationPoint(layerItem, fill.gradient.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
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
        origin: getGradientOriginPoint(layerItem, fill.gradient.origin),
        destination: getGradientDestinationPoint(layerItem, fill.gradient.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
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
  const layerItem = currentState.byId[action.payload.id];
  paperLayer[action.payload.prop === 'fill' ? 'fillColor' : 'strokeColor'] = {
    gradient: {
      stops: getGradientStops(action.payload.gradient.stops),
      radial: action.payload.gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(layerItem, action.payload.gradient.origin),
    destination: getGradientDestinationPoint(layerItem, action.payload.gradient.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientOriginX`, `${action.payload.prop}GradientOriginY`, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
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
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(gradient.stops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(layerItem, action.payload.origin),
    destination: getGradientDestinationPoint(layerItem, gradient.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientOriginX`, `${action.payload.prop}GradientOriginY`] as any);
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
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(gradient.stops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(layerItem, gradient.origin),
    destination: getGradientDestinationPoint(layerItem, action.payload.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
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
    origin: getGradientOriginPoint(layerItem, gradient.origin),
    destination: getGradientDestinationPoint(layerItem, gradient.destination)
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
  const newStops = gradient.stops.reduce((result: Btwx.GradientStop[], current, index) => {
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
    origin: getGradientOriginPoint(layerItem, gradient.origin),
    destination: getGradientDestinationPoint(layerItem, gradient.destination)
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
    origin: getGradientOriginPoint(layerItem, gradient.origin),
    destination: getGradientDestinationPoint(layerItem, gradient.destination)
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
    origin: getGradientOriginPoint(layerItem, gradient.origin),
    destination: getGradientDestinationPoint(layerItem, gradient.destination)
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
  const layerItem = state.byId[action.payload.id];
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
        origin: getGradientOriginPoint(layerItem, stroke.gradient.origin),
        destination: getGradientDestinationPoint(layerItem, stroke.gradient.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeWidth', 'dashOffset', 'dashArrayWidth', 'dashArrayGap']);
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeWidth', 'dashOffset', 'dashArrayWidth', 'dashArrayGap']);
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
  const newStroke = { ...layerItem.style.stroke.color, ...strokeColor } as Btwx.Color;
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY']);
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
        origin: getGradientOriginPoint(layerItem, stroke.gradient.origin),
        destination: getGradientDestinationPoint(layerItem, stroke.gradient.destination)
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
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY']);
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
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerText = (state: LayerState, action: SetLayerText): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  const layerItem = state.byId[action.payload.id];
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
      } as Btwx.Text
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerFontSize = (state: LayerState, action: SetLayerFontSize): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  const layerItem = state.byId[action.payload.id];
  paperLayer.fontSize = action.payload.fontSize;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          fontSize: action.payload.fontSize
        }
      } as Btwx.Text
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fontSize']);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setLayersFontSize = (state: LayerState, action: SetLayersFontSize): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFontSize(result, layerActions.setLayerFontSize({id: current, fontSize: action.payload.fontSize}) as SetLayerFontSize);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerFontWeight = (state: LayerState, action: SetLayerFontWeight): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  const layerItem = state.byId[action.payload.id];
  paperLayer.fontWeight = action.payload.fontWeight;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          fontWeight: action.payload.fontWeight
        }
      } as Btwx.Text
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setLayersFontWeight = (state: LayerState, action: SetLayersFontWeight): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFontWeight(result, layerActions.setLayerFontWeight({id: current, fontWeight: action.payload.fontWeight}) as SetLayerFontWeight);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerFontFamily = (state: LayerState, action: SetLayerFontFamily): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  const layerItem = state.byId[action.payload.id];
  paperLayer.fontFamily = action.payload.fontFamily;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          fontFamily: action.payload.fontFamily
        }
      } as Btwx.Text
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setLayersFontFamily = (state: LayerState, action: SetLayersFontFamily): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerFontFamily(result, layerActions.setLayerFontFamily({id: current, fontFamily: action.payload.fontFamily}) as SetLayerFontFamily);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerLeading = (state: LayerState, action: SetLayerLeading): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  const layerItem = state.byId[action.payload.id];
  paperLayer.leading = action.payload.leading;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        textStyle: {
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          leading: action.payload.leading
        }
      } as Btwx.Text
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['lineHeight']);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setLayersLeading = (state: LayerState, action: SetLayersLeading): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerLeading(result, layerActions.setLayerLeading({id: current, leading: action.payload.leading}) as SetLayerLeading);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerJustification = (state: LayerState, action: SetLayerJustification): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  const layerItem = state.byId[action.payload.id];
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
          ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
          justification: action.payload.justification
        }
      } as Btwx.Text
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x']);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['y']);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setLayersJustification = (state: LayerState, action: SetLayersJustification): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerJustification(result, layerActions.setLayerJustification({id: current, justification: action.payload.justification}) as SetLayerJustification);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const addLayersMask = (state: LayerState, action: AddLayersMask): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.layers[0]];
  const parentLayerItem = state.byId[layerItem.parent];
  const layerIndex = parentLayerItem.children.indexOf(action.payload.layers[0]);
  const paperLayer = getPaperLayer(action.payload.layers[0]);
  const underlyingSiblings = getLayerUnderlyingSiblings(currentState, action.payload.layers[0]);
  const mask = paperLayer.clone();
  mask.clipMask = true;
  const maskGroup = new paperMain.Group({
    name: 'MaskGroup',
    data: { id: `${action.payload.layers[0]}-MaskGroup`, type: 'LayerContainer', layerType: 'Shape' },
    children: [mask]
  });
  // let continueMaskChain = true;
  // let i = layerIndex;
  // while(i < underlyingSiblings.length && continueMaskChain) {
  //   const child = underlyingSiblings[i];
  //   const childItem = state.byId[child];
  //   const childPaperLayer = getPaperLayer(child);
  //   if (childItem.ignoreUnderlyingMask) {
  //     continueMaskChain = false;
  //   } else {
  //     maskGroup.addChild(childPaperLayer);
  //   }
  //   i++;
  // }
  paperLayer.replaceWith(maskGroup);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.layers[0]]: {
        ...currentState.byId[action.payload.layers[0]],
        mask: true
      } as Btwx.Shape
    }
  };
  if (underlyingSiblings.length > 0) {
    let continueMaskChain = true;
    currentState = underlyingSiblings.reduce((result, current) => {
      const siblingItem = currentState.byId[current];
      const siblingPaperLayer = getPaperLayer(current);
      const underlyingMask = siblingItem.underlyingMask;
      const underlyingMaskIndex = underlyingMask ? parentLayerItem.children.indexOf(underlyingMask) : null;
      if (siblingItem.ignoreUnderlyingMask && continueMaskChain) {
        continueMaskChain = false;
      }
      if (!underlyingMask || (underlyingMask && underlyingMaskIndex < layerIndex)) {
        result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.layers[0]}) as SetLayerUnderlyingMask);
      }
      if (continueMaskChain) {
        maskGroup.addChild(siblingPaperLayer);
        if (!siblingItem.masked) {
          result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: true}) as SetLayerMasked);
        }
      }
      return result;
    }, currentState);
  }
  // if (action.payload.group) {
    // currentState = groupLayers(currentState, layerActions.groupLayers(action.payload) as GroupLayers);
    // const mask = currentState.byId[action.payload.group.id].children[0];
    // const maskPaperLayer = getPaperLayer(mask);
    // const maskGroupPaperLayer = getPaperLayer(action.payload.group.id);
    // maskPaperLayer.clipMask = true;
    // maskGroupPaperLayer.position.x += 1;
    // maskGroupPaperLayer.position.x -= 1;
    // currentState = {
    //   ...currentState,
    //   byId: {
    //     ...currentState.byId,
    //     [mask]: {
    //       ...currentState.byId[mask],
    //       mask: true
    //     } as Btwx.Shape
    //   }
    // };
  // }
  // currentState = setLayerName(currentState, layerActions.setLayerName({id: mask, name: 'Mask'}) as SetLayerName);
  // currentState = maskLayers(currentState, layerActions.maskLayers({layers: currentState.byId[action.payload.group.id].children.filter((id) => id !== mask)}) as MaskLayers);
  // currentState = updateLayerBounds(currentState, action.payload.group.id);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const toggleLayerMask = (state: LayerState, action: ToggleLayerMask): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id] as Btwx.Shape;
  const parentLayerItem = state.byId[layerItem.parent];
  const paperLayer = getPaperLayer(action.payload.id);
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const underlyingSiblings = getLayerUnderlyingSiblings(currentState, action.payload.id);
  const maskableUnderlyingSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id, underlyingSiblings);
  const siblingsWithUnderlyingMask = getSiblingLayersWithUnderlyingMask(currentState, action.payload.id, underlyingSiblings);
  if (isMask) {
    const maskGroupPaperLayer = paperLayer.parent;
    paperLayer.clipMask = false;
    paperLayer.insertBelow(maskGroupPaperLayer);
    if (layerItem.style.fill.enabled) {
      currentState = enableLayerFill(currentState, layerActions.enableLayerFill({id: action.payload.id}) as EnableLayerFill);
    }
    if (layerItem.style.stroke.enabled) {
      currentState = enableLayerStroke(currentState, layerActions.enableLayerStroke({id: action.payload.id}) as EnableLayerStroke);
    }
    if (layerItem.style.shadow.enabled) {
      currentState = enableLayerShadow(currentState, layerActions.enableLayerShadow({id: action.payload.id}) as EnableLayerShadow);
    }
    underlyingSiblings.forEach((sibling) => {
      const siblingItem = currentState.byId[sibling];
      const isShape = siblingItem.type === 'Shape';
      const isMask = isShape && (siblingItem as Btwx.Shape).mask;
      const siblingPaperLayer = isMask ? getPaperLayer(sibling).parent : getPaperLayer(sibling);
      if (maskableUnderlyingSiblings.includes(sibling)) {
        siblingPaperLayer.insertBelow(maskGroupPaperLayer);
        if (!layerItem.masked) {
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: sibling, masked: false}) as SetLayerMasked);
        }
      }
      if (siblingsWithUnderlyingMask.includes(sibling)) {
        currentState = setLayerUnderlyingMask(currentState, layerActions.setLayerUnderlyingMask({id: sibling, underlyingMask: layerItem.underlyingMask}) as SetLayerUnderlyingMask);
      }
    });
    maskGroupPaperLayer.remove();
  } else {
    const mask = paperLayer.clone();
    mask.clipMask = true;
    const maskGroup = new paperMain.Group({
      name: 'MaskGroup',
      data: { id: `${action.payload.id}-MaskGroup`, type: 'LayerContainer', layerType: 'Shape' },
      children: [mask]
    });
    paperLayer.replaceWith(maskGroup);
    if (maskableUnderlyingSiblings.length > 0) {
      maskableUnderlyingSiblings.forEach((sibling) => {
        const siblingItem = currentState.byId[sibling];
        const isShape = siblingItem.type === 'Shape';
        const isMask = isShape && (siblingItem as Btwx.Shape).mask;
        const siblingPaperLayer = isMask ? getPaperLayer(sibling).parent : getPaperLayer(sibling);
        maskGroup.addChild(siblingPaperLayer);
        currentState = setLayerUnderlyingMask(currentState, layerActions.setLayerUnderlyingMask({id: sibling, underlyingMask: action.payload.id}) as SetLayerUnderlyingMask);
        if (!siblingItem.masked) {
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: sibling, masked: true}) as SetLayerMasked);
        }
      });
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        mask: !(currentState.byId[action.payload.id] as Btwx.Shape).mask
      } as Btwx.Shape
    }
  };
  return currentState;
};

export const toggleLayersMask = (state: LayerState, action: ToggleLayersMask): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return toggleLayerMask(result, layerActions.toggleLayerMask({id: current}) as ToggleLayerMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerUnderlyingMask = (state: LayerState, action: SetLayerUnderlyingMask): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        underlyingMask: action.payload.underlyingMask
      }
    }
  }
  return currentState;
};

export const setLayersUnderlyingMask = (state: LayerState, action: SetLayersUnderlyingMask): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.underlyingMask}) as SetLayerUnderlyingMask);
  }, currentState);
  return currentState;
};

export const toggleLayerIgnoreUnderlyingMask = (state: LayerState, action: ToggleLayerIgnoreUnderlyingMask): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const parentItem = state.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  const aboveSiblingId = layerIndex !== 0 ? parentItem.children[layerIndex - 1] : null;
  const aboveSiblingItem: Btwx.Layer = aboveSiblingId ? currentState.byId[aboveSiblingId] : null;
  const isAboveSiblingMask = aboveSiblingItem && aboveSiblingItem.type === 'Shape' && (aboveSiblingItem as Btwx.Shape).mask;
  const isAboveSiblingMasked = aboveSiblingItem && aboveSiblingItem.masked;
  const paperLayer = isMask ? getPaperLayer(action.payload.id).parent : getPaperLayer(action.payload.id);
  const maskableUnderlyingSiblings = getMaskableUnderlyingSiblings(currentState, action.payload.id);
  if (layerItem.ignoreUnderlyingMask) {
    if (layerItem.underlyingMask && (isAboveSiblingMasked || isAboveSiblingMask)) {
      const aboveSiblingPaperLayer = isAboveSiblingMask ? getPaperLayer(aboveSiblingId).parent : getPaperLayer(aboveSiblingId);
      if (isAboveSiblingMask) {
        aboveSiblingPaperLayer.addChild(paperLayer);
      } else {
        paperLayer.insertAbove(aboveSiblingPaperLayer);
      }
      if (maskableUnderlyingSiblings.length > 0 && !isMask) {
        maskableUnderlyingSiblings.forEach((sibling) => {
          const siblingItem = currentState.byId[sibling];
          const isSiblingMask = siblingItem.type === 'Shape' && (siblingItem as Btwx.Shape).mask;
          const siblingPaperLayer = isSiblingMask ? getPaperLayer(sibling).parent : getPaperLayer(sibling);
          siblingPaperLayer.insertAbove(paperLayer);
        });
      }
      currentState = setLayersMasked(currentState, layerActions.setLayersMasked({layers: [...maskableUnderlyingSiblings, action.payload.id], masked: true}) as SetLayersMasked);
    }
  } else {
    if (layerItem.underlyingMask && layerItem.masked) {
      const maskGroupPaperLayer = getPaperLayer(`${layerItem.underlyingMask}-MaskGroup`);
      if (maskableUnderlyingSiblings.length > 0 && !isMask) {
        maskableUnderlyingSiblings.reverse().forEach((sibling) => {
          const siblingItem = currentState.byId[sibling];
          const isSiblingMask = siblingItem.type === 'Shape' && (siblingItem as Btwx.Shape).mask;
          const siblingPaperLayer = isSiblingMask ? getPaperLayer(sibling).parent : getPaperLayer(sibling);
          siblingPaperLayer.insertAbove(maskGroupPaperLayer);
          currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: sibling, masked: false}) as SetLayerMasked);
        });
      }
      paperLayer.insertAbove(maskGroupPaperLayer);
      currentState = setLayerMasked(currentState, layerActions.setLayerMasked({id: action.payload.id, masked: false}) as SetLayerMasked);
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        ignoreUnderlyingMask: !currentState.byId[action.payload.id].ignoreUnderlyingMask
      }
    }
  }
  return currentState;
};

export const toggleLayersIgnoreUnderlyingMask = (state: LayerState, action: ToggleLayersIgnoreUnderlyingMask): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return toggleLayerIgnoreUnderlyingMask(result, layerActions.toggleLayerIgnoreUnderlyingMask({id: current}) as ToggleLayerIgnoreUnderlyingMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLayerMasked = (state: LayerState, action: SetLayerMasked): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        masked: action.payload.masked
      }
    }
  }
  return currentState;
};

export const setLayersMasked = (state: LayerState, action: SetLayersMasked): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: action.payload.masked}) as SetLayerMasked);
  }, currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
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
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const duplicateLayer = (state: LayerState, action: DuplicateLayer): LayerState => {
  let currentState = state;
  const clonedLayerAndChildren = cloneLayerAndChildren(currentState, action.payload.id);
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
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [rootLayer.id]}) as SelectLayers);
  return currentState;
};

export const duplicateLayers = (state: LayerState, action: DuplicateLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return duplicateLayer(result, layerActions.duplicateLayer({id: current}) as DuplicateLayer);
  }, currentState);
  if (state.selected.length > 0) {
    currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: state.selected}) as DeselectLayers);
  }
  console.log(paperMain.project);
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

export const bringLayerForward = (state: LayerState, action: BringLayerForward): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== parentItem.children.length - 1) {
    // currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: layerIndex + 1}) as InsertLayerChild);
    // const aboveLayer = parentItem.children[layerIndex + 1]
    currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.id, above: parentItem.children[layerIndex + 1]}) as InsertLayerAbove);
  }
  return currentState;
};

export const bringLayersForward = (state: LayerState, action: BringLayersForward): LayerState => {
  let currentState = state;
  currentState = orderLayersByDepth(currentState, action.payload.layers).reverse().reduce((result, current) => {
    return bringLayerForward(result, layerActions.bringLayerForward({id: current}) as BringLayerForward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const bringLayerToFront = (state: LayerState, action: BringLayerToFront): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== parentItem.children.length - 1) {
    // currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: parentItem.children.length - 1}) as InsertLayerChild);
    currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.id, above: parentItem.children[parentItem.children.length - 1]}) as InsertLayerAbove);
  }
  return currentState;
};

export const bringLayersToFront = (state: LayerState, action: BringLayersToFront): LayerState => {
  let currentState = state;
  currentState = orderLayersByDepth(currentState, action.payload.layers).reverse().reduce((result, current) => {
    return bringLayerToFront(result, layerActions.bringLayerToFront({id: current}) as BringLayerToFront);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const sendLayerBackward = (state: LayerState, action: SendLayerBackward): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== 0) {
    // currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: layerIndex - 1}) as InsertLayerChild);
    currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.id, below: parentItem.children[layerIndex - 1]}) as InsertLayerBelow);
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
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = getLayerIndex(currentState, action.payload.id);
  if (layerIndex !== 0) {
    // currentState = insertLayerChild(currentState, layerActions.insertLayerChild({id: layerItem.parent, child: action.payload.id, index: 0}) as InsertLayerChild);
    currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.id, below: parentItem.children[0]}) as InsertLayerBelow);
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
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const intersectLayers = (state: LayerState, action: IntersectLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const subtractLayers = (state: LayerState, action: SubtractLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const excludeLayers = (state: LayerState, action: ExcludeLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const divideLayers = (state: LayerState, action: DivideLayers): LayerState => {
  let currentState = state;
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const setRoundedRadius = (state: LayerState, action: SetRoundedRadius): LayerState => {
  let currentState = state;
  const paperLayerCompound = getPaperLayer(action.payload.id) as paper.CompoundPath;
  const paperLayer = paperLayerCompound.children[0] as paper.Path;
  const layerItem = currentState.byId[action.payload.id] as Btwx.Rounded;
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
        pathData: newShape.pathData
      } as Btwx.Rounded
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
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setPolygonSides = (state: LayerState, action: SetPolygonSides): LayerState => {
  let currentState = state;
  const paperLayerCompound = getPaperLayer(action.payload.id) as paper.CompoundPath;
  const paperLayer = paperLayerCompound.children[0] as paper.Path;
  const startPosition = paperLayer.position;
  const layerItem = state.byId[action.payload.id] as Btwx.Polygon;
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
        pathData: newShape.pathData
      } as Btwx.Polygon
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['width', 'height', 'rotation', 'shape']);
  currentState = updateLayerBounds(currentState, action.payload.id);
  if (layerItem.style.fill.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'fill', gradient: layerItem.style.fill.gradient}) as SetLayerGradient);
  }
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  return currentState;
};

export const setPolygonsSides = (state: LayerState, action: SetPolygonsSides): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setPolygonSides(result, layerActions.setPolygonSides({id: current, sides: action.payload.sides}) as SetPolygonSides);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setStarPoints = (state: LayerState, action: SetStarPoints): LayerState => {
  let currentState = state;
  const paperLayerCompound = getPaperLayer(action.payload.id) as paper.CompoundPath;
  const paperLayer = paperLayerCompound.children[0] as paper.Path;
  const startPosition = paperLayer.position;
  const layerItem = state.byId[action.payload.id] as Btwx.Star;
  paperLayer.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
  const newShape = new paperMain.Path.Star({
    center: paperLayer.bounds.center,
    radius1: maxDim / 2,
    radius2: (maxDim / 2) * (layerItem as Btwx.Star).radius,
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
        pathData: newShape.pathData
      } as Btwx.Star
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
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setStarRadius = (state: LayerState, action: SetStarRadius): LayerState => {
  let currentState = state;
  const paperLayerCompound = getPaperLayer(action.payload.id) as paper.CompoundPath;
  const paperLayer = paperLayerCompound.children[0] as paper.Path;
  const layerItem = state.byId[action.payload.id] as Btwx.Star;
  const startPosition = paperLayer.position;
  paperLayer.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
  const newShape = new paperMain.Path.Star({
    center: paperLayer.bounds.center,
    radius1: maxDim / 2,
    radius2: (maxDim / 2) * action.payload.radius,
    points: (layerItem as Btwx.Star).points,
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
        pathData: newShape.pathData
      } as Btwx.Star
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
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLineFromX = (state: LayerState, action: SetLineFromX): LayerState => {
  let currentState = state;
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromX = (state: LayerState, action: SetLinesFromX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLineFromX(result, layerActions.setLineFromX({id: current, x: action.payload.x, setEdit: false}) as SetLineFromX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLineFromY = (state: LayerState, action: SetLineFromY): LayerState => {
  let currentState = state;
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromY = (state: LayerState, action: SetLinesFromY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLineFromY(result, layerActions.setLineFromY({id: current, y: action.payload.y, setEdit: false}) as SetLineFromY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLineFrom = (state: LayerState, action: SetLineFrom): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  currentState = setLineFromX(currentState, layerActions.setLineFromX({id: action.payload.id, x: action.payload.x, setEdit: false}) as SetLineFromX);
  currentState = setLineFromY(currentState, layerActions.setLineFromY({id: action.payload.id, y: action.payload.y, setEdit: false}) as SetLineFromY);
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLineToX = (state: LayerState, action: SetLineToX): LayerState => {
  let currentState = state;
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToX = (state: LayerState, action: SetLinesToX): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLineToX(result, layerActions.setLineToX({id: current, x: action.payload.x, setEdit: false}) as SetLineToX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLineToY = (state: LayerState, action: SetLineToY): LayerState => {
  let currentState = state;
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToY = (state: LayerState, action: SetLinesToY): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLineToY(result, layerActions.setLineToY({id: current, y: action.payload.y, setEdit: false}) as SetLineToY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};

export const setLineTo = (state: LayerState, action: SetLineTo): LayerState => {
  let currentState = state;
  const layerItem = state.byId[action.payload.id];
  currentState = setLineToX(currentState, layerActions.setLineToX({id: action.payload.id, x: action.payload.x, setEdit: false}) as SetLineToX);
  currentState = setLineToY(currentState, layerActions.setLineToY({id: action.payload.id, y: action.payload.y, setEdit: false}) as SetLineToY);
  if (layerItem.style.stroke.fillType === 'gradient') {
    currentState = setLayerGradient(currentState, layerActions.setLayerGradient({id: action.payload.id, prop: 'stroke', gradient: layerItem.style.stroke.gradient}) as SetLayerGradient);
  }
  // currentState = updateSelectedBounds(currentState);
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

export const setLayerStyle = (state: LayerState, action: SetLayerStyle): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const paperLayer = getPaperLayer(action.payload.id);
  if (action.payload.style && action.payload.style.fill) {
    if (action.payload.style.fill.enabled) {
      switch(action.payload.style.fill.fillType) {
        case 'color': {
          const fillColor = action.payload.style.fill.color;
          paperLayer.fillColor = { hue: fillColor.h, saturation: fillColor.s, lightness: fillColor.l, alpha: fillColor.a } as paper.Color;
          break;
        }
        case 'gradient': {
          const fillGradient = action.payload.style.fill.gradient;
          paperLayer.fillColor = {
            gradient: {
              stops: getGradientStops(fillGradient.stops),
              radial: fillGradient.gradientType === 'radial'
            },
            origin: getGradientOriginPoint(layerItem, fillGradient.origin),
            destination: getGradientDestinationPoint(layerItem, fillGradient.destination)
          } as any
          break;
        }
      }
    } else {
      paperLayer.fillColor = null;
    }
  }
  if (action.payload.style && action.payload.style.stroke) {
    // stroke color
    if (action.payload.style.stroke.enabled) {
      switch(action.payload.style.stroke.fillType) {
        case 'color': {
          const strokeColor = action.payload.style.stroke.color;
          paperLayer.strokeColor = { hue: strokeColor.h, saturation: strokeColor.s, lightness: strokeColor.l, alpha: strokeColor.a } as paper.Color;
          break;
        }
        case 'gradient': {
          const strokeGradient = action.payload.style.stroke.gradient;
          paperLayer.strokeColor = {
            gradient: {
              stops: getGradientStops(strokeGradient.stops),
              radial: strokeGradient.gradientType === 'radial'
            },
            origin: getGradientOriginPoint(layerItem, strokeGradient.origin),
            destination: getGradientDestinationPoint(layerItem, strokeGradient.destination)
          } as any
          break;
        }
      }
    } else {
      paperLayer.strokeColor = null;
    }
    // stroke width
    if (action.payload.style.stroke.width) {
      paperLayer.strokeWidth = action.payload.style.stroke.width;
    }
  }
  if (action.payload.style && action.payload.style.strokeOptions) {
    if (action.payload.style.strokeOptions.cap) {
      paperLayer.strokeCap = action.payload.style.strokeOptions.cap;
    }
    if (action.payload.style.strokeOptions.join) {
      paperLayer.strokeJoin = action.payload.style.strokeOptions.join;
    }
    if (action.payload.style.strokeOptions.dashOffset) {
      paperLayer.dashOffset = action.payload.style.strokeOptions.dashOffset;
    }
    if (action.payload.style.strokeOptions.dashArray) {
      paperLayer.dashArray = action.payload.style.strokeOptions.dashArray;
    }
  }
  if (action.payload.style && action.payload.style.shadow) {
    // shadow color
    if (action.payload.style.shadow.enabled) {
      const shadowColor = action.payload.style.shadow.color;
      paperLayer.shadowColor = { hue: shadowColor.h, saturation: shadowColor.s, lightness: shadowColor.l, alpha: shadowColor.a } as paper.Color;
    } else {
      paperLayer.shadowColor = null;
    }
    if (action.payload.style.shadow.offset) {
      const offset = action.payload.style.shadow.offset;
      paperLayer.shadowOffset = new paperMain.Point(offset.x ? offset.x : layerItem.style.shadow.offset.x, offset.y ? offset.y : layerItem.style.shadow.offset.y);
    }
    if (action.payload.style.shadow.blur) {
      paperLayer.shadowBlur = action.payload.style.shadow.blur;
    }
  }
  if (action.payload.style && action.payload.style.opacity) {
    paperLayer.opacity = action.payload.style.opacity;
  }
  if (action.payload.style && action.payload.style.blendMode) {
    paperLayer.blendMode = action.payload.style.blendMode;
  }
  if (layerItem.type === 'Text') {
    if (action.payload.textStyle && action.payload.textStyle.fontSize) {
      (paperLayer as paper.PointText).fontSize = action.payload.textStyle.fontSize;
    }
    if (action.payload.textStyle && action.payload.textStyle.leading) {
      (paperLayer as paper.PointText).leading = action.payload.textStyle.leading;
    }
    if (action.payload.textStyle && action.payload.textStyle.fontWeight) {
      (paperLayer as paper.PointText).fontWeight = action.payload.textStyle.fontWeight;
    }
    if (action.payload.textStyle && action.payload.textStyle.fontFamily) {
      (paperLayer as paper.PointText).fontFamily = action.payload.textStyle.fontFamily;
    }
    if (action.payload.textStyle && action.payload.textStyle.justification) {
      const prevJustification = (layerItem as Btwx.Text).textStyle.justification;
      const newJustification = action.payload.textStyle.justification;
      (paperLayer as paper.PointText).justification = newJustification;
      switch(prevJustification) {
        case 'left':
          switch(newJustification) {
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
          switch(newJustification) {
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
          switch(newJustification) {
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
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          textStyle: {
            ...(currentState.byId[action.payload.id] as Btwx.Text).textStyle,
            ...action.payload.textStyle
          }
        } as Btwx.Text
      }
    }
  }
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        style: {
          ...currentState.byId[action.payload.id].style,
          ...action.payload.style
        }
      }
    }
  }
  return currentState;
};

export const setLayersStyle = (state: LayerState, action: SetLayersStyle): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerStyle(result, layerActions.setLayerStyle({id: current, style: action.payload.style, textStyle: action.payload.textStyle}) as SetLayerStyle);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({}) as SetLayerEdit);
  return currentState;
};