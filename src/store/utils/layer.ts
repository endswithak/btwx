/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import capitalize from 'lodash.capitalize';
import paper from 'paper';
import tinyColor from 'tinycolor2';
import layer, { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { addItem, removeItem, insertItem, moveItemAbove, moveItemBelow, replaceAllStr } from './general';
import { uiPaperScope } from '../../canvas';
import { TWEEN_PROPS_MAP } from '../../constants';

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
  ToggleLayersMask, ToggleLayersIgnoreUnderlyingMask, ToggleLayerIgnoreUnderlyingMask, AreaSelectLayers, SetLayersGradientOD
} from '../actionTypes/layer';

import {
  getLayerIndex, getLayer, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor, getPaperLayer,
  getClipboardCenter, getLayerAndDescendants, getLayerDescendants, getDestinationEquivalent, getEquivalentTweenProps,
  getDeepSelectItem, getLayersBounds, getGradientOriginPoint, getGradientDestinationPoint, getGradientStops,
  orderLayersByDepth, orderLayersByLeft, orderLayersByTop, savePaperProjectJSON, getEquivalentTweenProp, gradientsMatch,
  getPaperProp, getArtboardsTopTop, getLineFromPoint, getLineToPoint, getLineVector, getParentPaperLayer,
  getLayerYoungerSiblings, getMaskableSiblings, getSiblingLayersWithUnderlyingMask, getItemLayers,
  getAbsolutePosition, getGradientDestination, getGradientOrigin, getLayerOlderSibling, getLayerYoungestChild,
  getLayerYoungerSibling, getCanvasBounds, getLayerBounds
} from '../selectors/layer';
import { RootState } from '../reducers';

export const addArtboard = (state: LayerState, action: AddArtboard): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    allArtboardIds: addItem(currentState.allArtboardIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Artboard,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Root).children, action.payload.layer.id),
      } as Btwx.Root
    },
    childrenById: {
      ...currentState.childrenById,
      [action.payload.layer.id]: action.payload.layer.children,
      [action.payload.layer.parent]: addItem(currentState.childrenById[action.payload.layer.parent], action.payload.layer.id)
    },
    showChildrenById: {
      ...currentState.showChildrenById,
      [action.payload.layer.id]: action.payload.layer.showChildren,
    },
    scopeById: {
      ...currentState.scopeById,
      [action.payload.layer.id]: action.payload.layer.scope,
    }
  }
  currentState = updateParentBounds(currentState, action.payload.layer.id);
  if (!action.payload.batch) {
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Artboard',
        projects: [action.payload.layer.id]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addShape = (state: LayerState, action: AddShape): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  // add shape
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Shape,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
      } as Btwx.Group
    },
    allShapeIds: addItem(state.allShapeIds, action.payload.layer.id),
    childrenById: {
      ...currentState.childrenById,
      [action.payload.layer.id]: action.payload.layer.children,
      [action.payload.layer.parent]: addItem(currentState.childrenById[action.payload.layer.parent], action.payload.layer.id)
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Shape',
        projects: [action.payload.layer.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addGroup = (state: LayerState, action: AddGroup): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Group,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
      } as Btwx.Group
    },
    allGroupIds: addItem(state.allGroupIds, action.payload.layer.id),
    childrenById: {
      ...currentState.childrenById,
      [action.payload.layer.id]: action.payload.layer.children,
      [action.payload.layer.parent]: addItem(currentState.childrenById[action.payload.layer.parent], action.payload.layer.id)
    },
    showChildrenById: {
      ...currentState.showChildrenById,
      [action.payload.layer.id]: action.payload.layer.showChildren,
    },
    scopeById: {
      ...currentState.scopeById,
      [action.payload.layer.id]: action.payload.layer.scope,
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Group',
        projects: [action.payload.layer.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addText = (state: LayerState, action: AddText): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Text,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
        // showChildren: true
      } as Btwx.Group
    },
    allTextIds: addItem(state.allTextIds, action.payload.layer.id),
    childrenById: {
      ...currentState.childrenById,
      [action.payload.layer.id]: action.payload.layer.children,
      [action.payload.layer.parent]: addItem(currentState.childrenById[action.payload.layer.parent], action.payload.layer.id)
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Text',
        projects: [action.payload.layer.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addImage = (state: LayerState, action: AddImage): LayerState => {
  let currentState = state;
  const parentItem = state.byId[action.payload.layer.parent];
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.layer.id),
    byId: {
      ...currentState.byId,
      [action.payload.layer.id]: action.payload.layer as Btwx.Image,
      [action.payload.layer.parent]: {
        ...currentState.byId[action.payload.layer.parent],
        children: addItem((currentState.byId[action.payload.layer.parent] as Btwx.Group).children, action.payload.layer.id),
      } as Btwx.Group
    },
    allImageIds: addItem(state.allImageIds, action.payload.layer.id),
    childrenById: {
      ...currentState.childrenById,
      [action.payload.layer.id]: action.payload.layer.children,
      [action.payload.layer.parent]: addItem(currentState.childrenById[action.payload.layer.parent], action.payload.layer.id)
    }
  }
  currentState = updateLayerBounds(currentState, action.payload.layer.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.layer.id, 'all');
  if (!action.payload.batch) {
    if (!(parentItem as Btwx.Group | Btwx.Artboard).showChildren) {
      currentState = showLayerChildren(currentState, layerActions.showLayerChildren({id: action.payload.layer.parent}) as ShowLayerChildren);
    }
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.layer.id], newSelection: true}) as SelectLayers);
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Add Image',
        projects: [action.payload.layer.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const addLayers = (state: LayerState, action: AddLayers): LayerState => {
  let currentState = state;
  // const layers: string[] = [];
  // currentState = action.payload.layers.reduce((result: LayerState, current) => {
  //   layers.push(current.id);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layers',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = current.artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject]
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const layerAndDescendants = getLayerAndDescendants(currentState, action.payload.id);
  currentState = layerAndDescendants.reduce((result: LayerState, current) => {
    const currentLayerItem = result.byId[current];
    const isMask = currentLayerItem.type === 'Shape' && (currentLayerItem as Btwx.Shape).mask;
    switch(currentLayerItem.type) {
      case 'Artboard': {
        result = {
          ...result,
          allArtboardIds: removeItem(result.allArtboardIds, current)
        }
        break;
      }
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
    if (result.activeArtboard === current) {
      result = setActiveArtboard(result, layerActions.setActiveArtboard({id: result.allArtboardIds.length > 0 ? result.allArtboardIds[0] : null}) as SetActiveArtboard);
    }
    // if layer is a destination layer for any tween, remove that tween
    if (currentLayerItem.tweens.allIds) {
      result = currentLayerItem.tweens.allIds.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTween(tweenResult, layerActions.removeLayerTween({id: tweenCurrent}) as RemoveLayerTween);
      }, result);
    }
    // if layer has any tween events, remove those events
    if (currentLayerItem.events.length > 0) {
      result = currentLayerItem.events.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
      }, result);
    }
    // if artboard, remove any tween events with artboard as origin or destination
    if (currentLayerItem.type === 'Artboard' && ((currentLayerItem as Btwx.Artboard).originArtboardForEvents.length > 0 || (currentLayerItem as Btwx.Artboard).destinationArtboardForEvents.length > 0)) {
      const tweenEventsWithArtboard = [...(currentLayerItem as Btwx.Artboard).originArtboardForEvents, ...(currentLayerItem as Btwx.Artboard).destinationArtboardForEvents];
      result = tweenEventsWithArtboard.reduce((tweenResult, tweenCurrent) => {
        return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
      }, result);
    }
    // if ignoring underlying mask
    if (currentLayerItem.type !== 'Artboard' && (currentLayerItem as Btwx.MaskableLayer).ignoreUnderlyingMask) {
      result = toggleLayerIgnoreUnderlyingMask(result, layerActions.toggleLayerIgnoreUnderlyingMask({id: current}) as ToggleLayerIgnoreUnderlyingMask);
    }
    // if layer mask
    if (isMask) {
      result = toggleLayerMask(result, layerActions.toggleLayerMask({id: current}) as ToggleLayerMask);
    }
    // if selection includes layer, remove layer from selection
    if (result.selected.includes(current)) {
      result = deselectLayers(result, layerActions.deselectLayers({layers: [current]}) as DeselectLayers);
    }
    result = {
      ...result,
      allIds: removeItem(result.allIds, current),
      byId: Object.keys(result.byId).reduce((byIdResult: any, key) => {
        if (key !== current) {
          if (currentLayerItem.parent === key) {
            byIdResult[key] = {
              ...result.byId[key],
              children: removeItem(result.byId[key].children, action.payload.id)
            }
          } else {
            byIdResult[key] = result.byId[key];
          }
        }
        return byIdResult;
      }, {}),
      childrenById: Object.keys(result.childrenById).reduce((childrenResult: any, key) => {
        if (key !== current) {
          if (currentLayerItem.parent === key) {
            childrenResult[key] = removeItem(result.childrenById[key], action.payload.id)
          } else {
            childrenResult[key] = result.childrenById[key];
          }
        }
        return childrenResult;
      }, {})
    }
    return result;
  }, currentState);
  paperLayer.remove();
  // if (layerItem.type === 'Artboard') {
  //   const project = paperMain.projects[layerItem.projectIndex];
  //   project.remove();
  //   currentState = {
  //     ...currentState,
  //     paperProjects: Object.keys(currentState.paperProjects).reduce((result, current) => {
  //       if (current !== action.payload.id) {
  //         result[current] = currentState.paperProjects[current];
  //       }
  //       return result;
  //     }, currentState.paperProjects)
  //   }
  // }
  currentState = updateChildrenIndices(currentState, layerItem.parent);
  if (layerItem.scope.includes(action.payload.id)) {
    currentState = setGlobalScope(currentState, layerActions.setGlobalScope({
      scope: layerItem.scope
    }) as SetGlobalScope);
  }
  currentState = updateParentBounds(currentState, layerItem.parent, true);
  return currentState;
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return removeLayer(result, layerActions.removeLayer({id: current}) as RemoveLayer);
  }, currentState);
  if (!action.payload.batch) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Remove Layers',
        projects
      }
    }) as SetLayerEdit);
  }
  return currentState;
}

export const deselectLayer = (state: LayerState, action: DeselectLayer): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        selected: false
      }
    },
    selected: currentState.selected.filter((id) => id !== action.payload.id)
  }
  return currentState;
};

export const deselectLayers = (state: LayerState, action: DeselectLayers): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
  }, currentState);
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
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  // if layer is an artboard or group and current selection includes...
  // any of its descendants, deselect those descendants
  if (layerItem.type === 'Artboard' || layerItem.type === 'Group') {
    if (state.selected.some((selectedItem) => currentState.byId[selectedItem].scope.includes(action.payload.id))) {
      const layersToDeselect = state.selected.filter((selectedItem) => currentState.byId[selectedItem].scope.includes(action.payload.id));
      currentState = deselectLayers(currentState, layerActions.deselectLayers({layers:layersToDeselect }) as DeselectLayers);
    }
  }
  // if any parents selected, deselect them
  if (currentState.selected.some((id) => layerItem.scope.includes(id))) {
    const deselectParents = currentState.selected.filter((id) => layerItem.scope.includes(id));
    currentState = deselectLayers(currentState, layerActions.deselectLayers({layers: deselectParents }) as DeselectLayers);
  }
  // if layer is an artboard, make it the active artboard
  if (layerItem.type === 'Artboard' && currentState.activeArtboard !== action.payload.id) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: action.payload.id}) as SetActiveArtboard);
  }
  // if layer scope root is an artboard, make the layer scope root the active artboard
  if (layerItem.type !== 'Artboard' && currentState.activeArtboard !== layerItem.scope[1]) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: layerItem.scope[1]}) as SetActiveArtboard);
  }
  // handle hover
  // if (layerItem.id !== currentState.hover) {
  //   currentState = setLayerHover(currentState, layerActions.setLayerHover({id: action.payload.id}) as SetLayerHover);
  // }
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
    selected: orderedSelected
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
  currentState = setLayerHover(currentState, layerActions.setLayerHover({id: deepSelectItem.id}) as SetLayerHover);
  return currentState;
};

export const selectLayers = (state: LayerState, action: SelectLayers): LayerState => {
  let currentState = state;
  if (action.payload.newSelection) {
    currentState = deselectAllLayers(currentState, layerActions.deselectAllLayers() as DeselectAllLayers);
  }
  currentState = action.payload.layers.reduce((result, current) => {
    return selectLayer(result, layerActions.selectLayer({id: current}) as SelectLayer);
  }, currentState);
  return currentState;
};

export const areaSelectLayers = (state: LayerState, action: AreaSelectLayers): LayerState => {
  let currentState = state;
  const shiftModifier = action.payload.shiftModifier;
  if (shiftModifier) {
    currentState = action.payload.layers.reduce((result, current) => {
      const layerItem = result.byId[current];
      if (layerItem.selected) {
        result = deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
      } else {
        result = selectLayer(result, layerActions.selectLayer({id: current}) as SelectLayer);
      }
      return result;
    }, currentState);
  } else {
    currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  }
  return currentState;
};

export const setLayerHover = (state: LayerState, action: SetLayerHover): LayerState => {
  let currentState = state;
  const currentHover = state.hover;
  const nextHover = action.payload.id;
  if (currentHover !==  null) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [currentHover]: {
          ...currentState.byId[currentHover],
          hover: false
        }
      }
    };
  }
  if (nextHover !== null) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [nextHover]: {
          ...currentState.byId[nextHover],
          hover: true
        }
      }
    };
  }
  currentState = {
    ...currentState,
    hover: action.payload.id
  };
  return currentState;
};

export const setShapeIcon = (state: LayerState, id: string, pathData: string): LayerState => {
  let currentState = state;
  const layerIcon = new uiPaperScope.CompoundPath({
    pathData: pathData,
    insert: false
  });
  layerIcon.fitBounds(new uiPaperScope.Rectangle({
    point: new uiPaperScope.Point(0,0),
    size: new uiPaperScope.Size(24,24)
  }));
  currentState = {
    ...currentState,
    shapeIcons: {
      ...currentState.shapeIcons,
      [id]: layerIcon.pathData
    }
  };
  return currentState;
};

export const updateChildrenIndices = (state: LayerState, id: string): LayerState => {
  const layerItem = state.byId[id];
  return layerItem.children.reduce((result, current) => {
    return updateLayerIndex(result, current);
  }, state);
};

export const updateLayerIndex = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const layerItem = state.byId[id];
  const index = state.byId[layerItem.parent].children.indexOf(id);
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [id]: {
        ...currentState.byId[id],
        index: index
      }
    }
  }
  if (layerItem.type === 'Artboard') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [id]: {
          ...currentState.byId[id],
          paperScope: currentState.byId[id].index + 1
        } as Btwx.Artboard
      }
    }
  }
  return currentState;
};

export const updateLayerIndices = (state: LayerState, layers: string[]): LayerState => {
  return layers.reduce((result, current) => {
    return updateLayerIndex(result, current);
  }, state);
};

export const addLayerChild = (state: LayerState, action: AddLayerChild): LayerState => {
  let currentState = state;
  const { layerItem } = getItemLayers(currentState, action.payload.id);
  const childItemLayers = getItemLayers(currentState, action.payload.child);
  const childItem = childItemLayers.layerItem;
  const isChildMask = childItem.type === 'Shape' && (childItem as Btwx.Shape).mask;
  const paperLayer = getParentPaperLayer(state, action.payload.id);
  const childPaperLayer = isChildMask ? childItemLayers.paperLayer.parent : childItemLayers.paperLayer;
  const youngestChild = layerItem.children[layerItem.children.length - 1];
  const aboveId = youngestChild && youngestChild !== action.payload.child ? youngestChild : null;
  const aboveItemLayers = aboveId ? getItemLayers(currentState, aboveId) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item } : null;
  const aboveItem = aboveId ? aboveItemLayers.layerItem : null;
  const isAboveMask = aboveItem && aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
  const abovePaperLayer = aboveItem ? (isAboveMask ? aboveItemLayers.paperLayer.parent : aboveItemLayers.paperLayer) : null;
  // if mask, handle previous underlying siblings
  if (isChildMask) {
    const maskSiblings = getMaskableSiblings(currentState, action.payload.child);
    if (maskSiblings.length > 0) {
      currentState = maskSiblings.reduce((result: LayerState, current) => {
        const siblingLayerItems = getItemLayers(currentState, current) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item };
        const siblingItem = siblingLayerItems.layerItem;
        const isShape = siblingItem.type === 'Shape';
        const isMask = isShape && (siblingItem as Btwx.Shape).mask;
        const siblingPaperLayer = isMask ? siblingLayerItems.paperLayer.parent : siblingLayerItems.paperLayer;
        siblingPaperLayer.insertAbove(childPaperLayer);
        if (siblingItem.underlyingMask === action.payload.child) {
          result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: (childItem as Btwx.MaskableLayer).underlyingMask}) as SetLayerUnderlyingMask);
        }
        if (!(childItem as Btwx.MaskableLayer).masked) {
          result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: false}) as SetLayerMasked);
        }
        return result;
      }, currentState);
    }
  }
  // move child
  if (childItem.type !== 'Artboard') {
    isAboveMask ? abovePaperLayer.insertChild(0, childPaperLayer) : paperLayer.addChild(childPaperLayer);
  }
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
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          children: addItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child)
        } as Btwx.Group
      },
      childrenById: {
        ...currentState.childrenById,
        [childItem.parent]: removeItem(currentState.childrenById[childItem.parent], action.payload.child),
        [action.payload.id]: addItem(currentState.childrenById[action.payload.id], action.payload.child)
      }
    };
    currentState = updateParentBounds(currentState, childItem.parent, true);
    // currentState = updateParentBounds(currentState, action.payload.id, true);
    currentState = updateChildrenIndices(currentState, childItem.parent);
    currentState = updateChildrenIndices(currentState, action.payload.id);
    currentState = setLayerScope(currentState, layerActions.setLayerScope({id: action.payload.child, scope: [...layerItem.scope, action.payload.id]}) as SetLayerScope);
    if (childItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.child);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          children: addItem(removeItem((currentState.byId[action.payload.id] as Btwx.Group).children, action.payload.child), action.payload.child)
        } as Btwx.Group
      },
      childrenById: {
        ...currentState.childrenById,
        [action.payload.id]: addItem(removeItem(currentState.childrenById[action.payload.id], action.payload.child), action.payload.child)
      }
    };
    currentState = updateChildrenIndices(currentState, action.payload.id);
  }
  if (childItem.type !== 'Artboard') {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.child]: {
          ...currentState.byId[action.payload.child],
          underlyingMask: aboveItem ? isAboveMask ? aboveItem.id : aboveItem.underlyingMask : null,
          masked: aboveItem ? (aboveItem.masked || isAboveMask) && !(childItem as Btwx.MaskableLayer).ignoreUnderlyingMask : false
        } as Btwx.MaskableLayer
      }
    };
  }
  if (childItem.type !== 'Artboard') {
    currentState = updateLayerBounds(currentState, action.payload.child);
  }
  return currentState;
};

export const addLayerChildren = (state: LayerState, action: AddLayerChildren): LayerState => {
  let currentState = state;
  const projects: string[] = [currentState.byId[action.payload.id].artboard];
  currentState = action.payload.children.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return addLayerChild(result, layerActions.addLayerChild({id: action.payload.id, child: current}) as AddLayerChild);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.children, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Children',
      projects
    }
  }) as SetLayerEdit);
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
      } as Btwx.Group
    },
    showChildrenById: {
      ...state.showChildrenById,
      [action.payload.id]: true
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
    },
    showChildrenById: {
      ...state.showChildrenById,
      [action.payload.id]: false
    }
  }
};

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  let currentState = state;
  const layerItemLayers = getItemLayers(currentState, action.payload.id);
  const belowItemLayers = getItemLayers(currentState, action.payload.below);
  const layerItem = layerItemLayers.layerItem;
  const layerIndex = layerItem.index;
  const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const isLayerIgnoringUnderlyingMask = layerItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  const belowItem = belowItemLayers.layerItem;
  const belowParent = currentState.byId[belowItem.parent] as Btwx.Group | Btwx.Artboard;
  const belowIndex = belowItem.index;
  const isBelowMask = belowItem.type === 'Shape' && (belowItem as Btwx.Shape).mask;
  const isBelowIgnoringUnderlyingMask = belowItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  const paperLayer = layerItemLayers.paperLayer;
  const belowPaperLayer = belowItemLayers.paperLayer;
  // turn off masks
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
  // const newLayerItem = currentState.byId[action.payload.id];
  // const newBelowItem = currentState.byId[action.payload.below];
  if (layerItem.type !== 'Artboard') {
    paperLayer.insertBelow(belowPaperLayer);
  }
  if (layerItem.parent !== belowItem.parent) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: belowItem.parent
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
        } as Btwx.Group,
        [belowItem.parent]: {
          ...currentState.byId[belowItem.parent],
          children: insertItem((currentState.byId[belowItem.parent] as Btwx.Group).children, action.payload.id, belowIndex)
        } as Btwx.Group
      },
      childrenById: {
        ...currentState.childrenById,
        [layerItem.parent]: removeItem(currentState.childrenById[layerItem.parent], action.payload.id),
        [belowItem.parent]: insertItem(currentState.childrenById[belowItem.parent], action.payload.id, belowIndex)
      }
    };
    currentState = updateParentBounds(currentState, layerItem.parent, true);
    // currentState = updateParentBounds(currentState, belowItem.parent, true);
    currentState = updateChildrenIndices(currentState, belowItem.parent);
    currentState = updateChildrenIndices(currentState, layerItem.parent);
    currentState = setLayerScope(currentState, layerActions.setLayerScope({id: action.payload.id, scope: [...belowParent.scope, belowItem.parent]}) as SetLayerScope);
    if (layerItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.id);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: moveItemAbove(currentState.byId[layerItem.parent].children, layerIndex, belowIndex)
        } as Btwx.Group
      },
      childrenById: {
        ...currentState.childrenById,
        [layerItem.parent]: moveItemAbove(currentState.childrenById[layerItem.parent], layerIndex, belowIndex)
      }
    };
    currentState = updateChildrenIndices(currentState, layerItem.parent);
  }
  // if (layerItem.type !== 'Artboard') {
  //   currentState = {
  //     ...currentState,
  //     byId: {
  //       ...currentState.byId,
  //       [action.payload.id]: {
  //         ...currentState.byId[action.payload.id],
  //         underlyingMask: (newBelowItem as Btwx.MaskableLayer).underlyingMask,
  //         masked: (newBelowItem as Btwx.MaskableLayer).masked && !(newLayerItem as Btwx.MaskableLayer).ignoreUnderlyingMask
  //       } as Btwx.MaskableLayer
  //     }
  //   };
  // }
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
  if (layerItem.type !== 'Artboard') {
    currentState = updateLayerBounds(currentState, action.payload.id);
  }
  return currentState;
};

export const insertLayersBelow = (state: LayerState, action: InsertLayersBelow) => {
  let currentState = state;
  // const orderedLayers = orderLayersByDepth(currentState, action.payload.layers);
  const projects: string[] = [currentState.byId[action.payload.below].artboard];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return insertLayerBelow(result, layerActions.insertLayerBelow({id: current, below: action.payload.below}) as InsertLayerBelow);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Insert Layers Below',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const insertLayerAbove = (state: LayerState, action: InsertLayerAbove): LayerState => {
  let currentState = state;
  const layerItemLayers = getItemLayers(currentState, action.payload.id);
  const aboveItemLayers = getItemLayers(currentState, action.payload.above);
  const layerItem = layerItemLayers.layerItem;
  const layerIndex = layerItem.index;
  const isLayerMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const isLayerIgnoringUnderlyingMask = layerItem.type !== 'Artboard' && (layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  const aboveItem = aboveItemLayers.layerItem;
  const aboveIndex = aboveItem.index;
  const isAboveMask = aboveItem.type === 'Shape' && (aboveItem as Btwx.Shape).mask;
  const isAboveIgnoringUnderlyingMask = aboveItem.type !== 'Artboard' && (aboveItem as Btwx.MaskableLayer).ignoreUnderlyingMask;
  const paperLayer = layerItemLayers.paperLayer;
  const abovePaperLayer = aboveItemLayers.paperLayer;
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
  // const newLayerItem = currentState.byId[action.payload.id];
  // const newAboveItem = currentState.byId[action.payload.above];
  if (layerItem.type !== 'Artboard') {
    paperLayer.insertAbove(abovePaperLayer);
  }
  if (layerItem.parent !== aboveItem.parent) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          parent: aboveItem.parent
        },
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: removeItem((currentState.byId[layerItem.parent] as Btwx.Group).children, action.payload.id)
        } as Btwx.Group,
        [aboveItem.parent]: {
          ...currentState.byId[aboveItem.parent],
          children: insertItem((currentState.byId[aboveItem.parent] as Btwx.Group).children, action.payload.id, aboveIndex + 1)
        } as Btwx.Group
      },
      childrenById: {
        ...currentState.childrenById,
        [layerItem.parent]: removeItem(currentState.childrenById[layerItem.parent], action.payload.id),
        [aboveItem.parent]: insertItem(currentState.childrenById[aboveItem.parent], action.payload.id, aboveIndex + 1)
      }
    };
    currentState = updateParentBounds(currentState, layerItem.parent, true);
    // currentState = updateParentBounds(currentState, aboveItem.parent, true);
    currentState = updateChildrenIndices(currentState, aboveItem.parent);
    currentState = updateChildrenIndices(currentState, layerItem.parent);
    currentState = setLayerScope(currentState, layerActions.setLayerScope({id: action.payload.id, scope: [...aboveParentItem.scope, aboveItem.parent]}) as SetLayerScope);
    if (layerItem.type === 'Group') {
      currentState = updateNestedScopes(currentState, action.payload.id);
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [layerItem.parent]: {
          ...currentState.byId[layerItem.parent],
          children: moveItemBelow(currentState.byId[layerItem.parent].children, layerIndex, aboveIndex)
        } as Btwx.Group
      },
      childrenById: {
        ...currentState.childrenById,
        [layerItem.parent]: moveItemBelow(currentState.childrenById[layerItem.parent], layerIndex, aboveIndex)
      }
    }
    currentState = updateChildrenIndices(currentState, layerItem.parent);
  }
  // if (layerItem.type !== 'Artboard') {
  //   currentState = {
  //     ...currentState,
  //     byId: {
  //       ...currentState.byId,
  //       [action.payload.id]: {
  //         ...currentState.byId[action.payload.id],
  //         underlyingMask: (newAboveItem as Btwx.MaskableLayer).underlyingMask,
  //         masked: (newAboveItem as Btwx.MaskableLayer).masked && !(newLayerItem as Btwx.MaskableLayer).ignoreUnderlyingMask
  //       } as Btwx.MaskableLayer
  //     }
  //   };
  // }
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
  if (layerItem.type !== 'Artboard') {
    currentState = updateLayerBounds(currentState, action.payload.id);
  }
  return currentState;
};

export const insertLayersAbove = (state: LayerState, action: InsertLayersAbove): LayerState => {
  let currentState = state;
  // const orderedLayers = orderLayersByDepth(state, action.payload.layers);
  const projects: string[] = [currentState.byId[action.payload.above].artboard];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: action.payload.above}) as InsertLayerAbove);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Insert Layers Above',
      projects
    }
  }) as SetLayerEdit);
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
  scope: ['root'],
  paperScope: null
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

export const setLayerScope = (state: LayerState, action: SetLayerScope): LayerState => {
  let currentState = state;
  const currentLayerItem = currentState.byId[action.payload.id];
  if (currentLayerItem.type !== 'Artboard' && currentLayerItem.artboard !== action.payload.scope[1]) {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          artboard: action.payload.scope[1]
        }
      }
    }
  }
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  paperLayer.data.scope = action.payload.scope;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        scope: [...action.payload.scope]
      }
    },
    scopeById: {
      ...currentState.scopeById,
      [action.payload.id]: action.payload.scope
    }
  }
  return currentState;
};

export const setLayersScope = (state: LayerState, action: SetLayersScope): LayerState => {
  let currentState = state;
  currentState = action.payload.layers.reduce((result, current) => {
    return setLayerScope(result, layerActions.setLayerScope({id: current, scope: action.payload.scope}) as SetLayerScope);
  }, state);
  return currentState;
};

export const setGlobalScope = (state: LayerState, action: SetGlobalScope): LayerState => {
  let currentState = state;
  const hasArtboard = action.payload.scope.length > 1 && currentState.byId[action.payload.scope[1]].type === 'Artboard';
  currentState = {
    ...currentState,
    scope: [...action.payload.scope],
    paperScope: hasArtboard ? (currentState.byId[action.payload.scope[1]] as Btwx.Artboard).paperScope : null
  }
  return currentState;
};

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
        currentState = setLayerScope(currentState, layerActions.setLayerScope({id: child, scope: currentScope}) as SetLayerScope);
      });
    }
    i++;
  }
  return currentState;
}

export const groupLayers = (state: LayerState, action: GroupLayers): LayerState => {
  let currentState = state;
  // add group
  // currentState = addGroup(currentState, layerActions.addGroup({layer: action.payload.group, batch: true}) as AddGroup);
  // move group above top layer
  currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.group.id, below: action.payload.layers[0]}) as InsertLayerBelow);
  // add layers to group
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = addLayerChild(result, layerActions.addLayerChild({id: action.payload.group.id, child: current}) as AddLayerChild);
    return result;
  }, currentState);
  // select final group
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: [action.payload.group.id], newSelection: true}) as SelectLayers);
  //
  currentState = updateLayerBounds(currentState, action.payload.group.id);
  // set layer edit
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Group Layers',
      projects
    }
  }) as SetLayerEdit);
  // return final state
  return currentState;
};

export const ungroupLayer = (state: LayerState, action: UngroupLayer): LayerState => {
  const layer = getLayer(state, action.payload.id);
  let currentState = state;
  if (layer.type === 'Group') {
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Ungroup Layers',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const updateLayerBounds = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, id);
  if (layerItem.type === 'Shape') {
    currentState = setShapeIcon(currentState, id, (paperLayer as paper.PathItem).pathData);
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
  if (layerItem.type !== 'Artboard') {
    const artboardItems = getItemLayers(currentState, layerItem.artboard);
    const positionInArtboard = paperLayer.position.subtract(artboardItems.paperLayer.position);
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [id]: {
          ...currentState.byId[id],
          frame: {
            ...currentState.byId[id].frame,
            x: positionInArtboard.x,
            y: positionInArtboard.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          }
        }
      }
    }
  } else {
    const artboardBackground = paperLayer.getItem({data: {id: 'artboardBackground'}});
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
            width: artboardBackground.bounds.width,
            height: artboardBackground.bounds.height,
            innerWidth: artboardBackground.bounds.width,
            innerHeight: artboardBackground.bounds.height
          }
        }
      }
    }
  }
  if (layerItem.parent !== layerItem.artboard) {
    currentState = updateParentBounds(currentState, id);
  }
  if (layerItem.type === 'Group') {
    currentState = updateChildrenPositions(currentState, id);
  }
  if (layerItem.type === 'Artboard') {
    const prevBounds = layerItem.frame;
    const newBounds = currentState.byId[id].frame;
    if (prevBounds.width !== newBounds.width || prevBounds.height !== newBounds.height) {
      currentState = updateChildrenPositions(currentState, id);
    }
  }
  return currentState;
};

export const updateChildrenPositions = (state: LayerState, id: string): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[id];
  const layerDescendants = getLayerDescendants(currentState, id);
  const artboardItem = currentState.byId[layerItem.artboard];
  const artboardPosition = new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y);
  currentState = layerDescendants.reduce((result, current) => {
    const { layerItem, paperLayer } = getItemLayers(result, current);
    const position = paperLayer.position.subtract(artboardPosition);
    return {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            ...result.byId[current].frame,
            x: position.x,
            y: position.y
          }
        }
      }
    }
  }, currentState);
  return currentState;
};

export const updateParentBounds = (state: LayerState, id: string, idAsParent?: boolean): LayerState => {
  let currentState = state;
  const parent = idAsParent ? id : currentState.byId[id].parent;
  const parentItem = currentState.byId[parent] as Btwx.Root | Btwx.Artboard | Btwx.Group;
  if (parentItem.type !== 'Artboard') {
    let layerBounds;
    let position;
    if (parentItem.children.length > 0) {
      layerBounds = getLayersBounds(currentState, parentItem.children);
    } else {
      layerBounds = new uiPaperScope.Rectangle({
        from: new uiPaperScope.Point(0,0),
        to: new uiPaperScope.Point(0,0)
      });
    }
    if (parentItem.type === 'Group') {
      const artboardItem = currentState.byId[parentItem.artboard];
      const artboardPosition = new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y);
      position = layerBounds.center.subtract(artboardPosition);
    } else {
      position = layerBounds.center;
    }
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [parent]: {
          ...currentState.byId[parent],
          frame: {
            ...currentState.byId[parent].frame,
            x: position.x,
            y: position.y,
            width: layerBounds.width,
            height: layerBounds.height,
            innerWidth: layerBounds.width,
            innerHeight: layerBounds.height,
          }
        } as Btwx.Root
      }
    }
  }
  return currentState;
};

// export const updateChildrenPositions = (state: LayerState, id: string): LayerState => {
//   let currentState = state;
//   const { layerItem, paperLayer } = getItemLayers(currentState, id);
//   const artboardItems = getItemLayers(currentState, layerItem.artboard);
//   const positionInArtboard = paperLayer.position.subtract(artboardItems.paperLayer.position);
//   currentState = {
//     ...currentState,
//     byId: {
//       ...currentState.byId,
//       [id]: {
//         ...currentState.byId[id],
//         frame: {
//           ...currentState.byId[id].frame,
//           x: positionInArtboard.x,
//           y: positionInArtboard.y
//         }
//       }
//     }
//   }
//   return currentState;
// };

export const moveLayer = (state: LayerState, action: MoveLayer): LayerState => {
  let currentState = state;
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['x', 'y']);
  return currentState;
};

export const moveLayers = (state: LayerState, action: MoveLayers): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return moveLayer(result, layerActions.moveLayer({id: current}) as MoveLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers',
      projects: projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const moveLayerTo = (state: LayerState, action: MoveLayerTo): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  return currentState;
};

export const moveLayersTo = (state: LayerState, action: MoveLayersTo): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return moveLayerTo(result, layerActions.moveLayerTo({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerTo);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers To',
      projects: projects
    }
  }) as SetLayerEdit);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return moveLayerBy(result, layerActions.moveLayerBy({id: current, x: action.payload.x, y: action.payload.y}) as MoveLayerBy);
  }, currentState);
  // currentState = updateSelectedBounds(currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Move Layers By',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerName = (state: LayerState, action: SetLayerName): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  paperLayer.name = action.payload.name;
  // remove existing tweens
  if (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard' && action.payload.name !== layerItem.name) {
    // const tweensWithLayer = getTweensWithLayer(currentState, action.payload.id);
    currentState = layerItem.tweens.allIds.reduce((result: LayerState, current) => {
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Rename Layer',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  // return final state
  return currentState;
};

export const setActiveArtboard = (state: LayerState, action: SetActiveArtboard): LayerState => {
  let currentState = state;
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
  if (!currentState.events.allIds.some((id: string) => {
    return (
      currentState.events.byId[id].layer === action.payload.layer &&
      currentState.events.byId[id].event === action.payload.event &&
      currentState.events.byId[id].destinationArtboard === action.payload.destinationArtboard
    )
  })) {
    // add animation event
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.layer]: {
          ...currentState.byId[action.payload.layer],
          events: addItem(currentState.byId[action.payload.layer].events, action.payload.id)
        },
        [action.payload.artboard]: {
          ...currentState.byId[action.payload.artboard],
          originArtboardForEvents: addItem((currentState.byId[action.payload.artboard] as Btwx.Artboard).originArtboardForEvents, action.payload.id)
        } as Btwx.Artboard,
        [action.payload.destinationArtboard]: {
          ...currentState.byId[action.payload.destinationArtboard],
          destinationArtboardForEvents: addItem((currentState.byId[action.payload.destinationArtboard] as Btwx.Artboard).destinationArtboardForEvents, action.payload.id)
        } as Btwx.Artboard
      },
      events: {
        ...currentState.events,
        allIds: addItem(currentState.events.allIds, action.payload.id),
        byId: {
          ...currentState.events.byId,
          [action.payload.id]: action.payload as Btwx.TweenEvent
        }
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Event',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addTweenEventLayerTweens = (state: LayerState, eventId: string, layerId: string): LayerState => {
  let currentState = state;
  const tweenEvent = currentState.events.byId[eventId];
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
  const animEvent = state.events.byId[action.payload.id];
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
        events: removeItem(currentState.byId[animEvent.layer].events, action.payload.id)
      },
      [animEvent.artboard]: {
        ...currentState.byId[animEvent.artboard],
        originArtboardForEvents: removeItem((currentState.byId[animEvent.artboard] as Btwx.Artboard).originArtboardForEvents, action.payload.id)
      } as Btwx.Artboard,
      [animEvent.destinationArtboard]: {
        ...currentState.byId[animEvent.destinationArtboard],
        destinationArtboardForEvents: removeItem((currentState.byId[animEvent.destinationArtboard] as Btwx.Artboard).destinationArtboardForEvents, action.payload.id)
      } as Btwx.Artboard
    },
    events: {
      ...currentState.events,
      allIds: removeItem(currentState.events.allIds, action.payload.id),
      byId: Object.keys(currentState.events.byId).reduce((result: any, key) => {
        if (key !== action.payload.id) {
          result[key] = currentState.events.byId[key];
        }
        return result;
      }, {})
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layer Event',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayerTween = (state: LayerState, action: AddLayerTween): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [action.payload.event]: {
          ...currentState.events.byId[action.payload.event],
          tweens: addItem(currentState.events.byId[action.payload.event].tweens, action.payload.id)
        }
      }
    },
    byId: {
      ...currentState.byId,
      [action.payload.layer]: {
        ...currentState.byId[action.payload.layer],
        tweens: {
          ...currentState.byId[action.payload.layer].tweens,
          allIds: addItem(currentState.byId[action.payload.layer].tweens.allIds, action.payload.id),
          asOrigin: addItem(currentState.byId[action.payload.layer].tweens.asOrigin, action.payload.id),
          byProp: {
            ...currentState.byId[action.payload.layer].tweens.byProp,
            [action.payload.prop]: addItem(currentState.byId[action.payload.layer].tweens.byProp[action.payload.prop], action.payload.id)
          }
        }
      },
      [action.payload.destinationLayer]: {
        ...currentState.byId[action.payload.destinationLayer],
        tweens: {
          ...currentState.byId[action.payload.destinationLayer].tweens,
          allIds: addItem(currentState.byId[action.payload.destinationLayer].tweens.allIds, action.payload.id),
          asDestination: addItem(currentState.byId[action.payload.destinationLayer].tweens.asDestination, action.payload.id),
          byProp: {
            ...currentState.byId[action.payload.destinationLayer].tweens.byProp,
            [action.payload.prop]: addItem(currentState.byId[action.payload.destinationLayer].tweens.byProp[action.payload.prop], action.payload.id)
          }
        }
      }
    },
    tweens: {
      ...currentState.tweens,
      allIds: addItem(currentState.tweens.allIds, action.payload.id),
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: action.payload as Btwx.Tween
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layer Tween',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayerTween = (state: LayerState, action: RemoveLayerTween): LayerState => {
  const tween = state.tweens.byId[action.payload.id];
  let currentState = state;
  currentState = {
    ...currentState,
    events: {
      ...currentState.events,
      byId: {
        ...currentState.events.byId,
        [tween.event]: {
          ...currentState.events.byId[tween.event],
          tweens: removeItem(currentState.events.byId[tween.event].tweens, action.payload.id)
        }
      }
    },
    byId: {
      ...currentState.byId,
      [tween.layer]: {
        ...currentState.byId[tween.layer],
        tweens: {
          ...currentState.byId[tween.layer].tweens,
          allIds: removeItem(currentState.byId[tween.layer].tweens.allIds, action.payload.id),
          asOrigin: removeItem(currentState.byId[tween.layer].tweens.asOrigin, action.payload.id),
          byProp: {
            ...currentState.byId[tween.layer].tweens.byProp,
            [tween.prop]: removeItem(currentState.byId[tween.layer].tweens.byProp[tween.prop], action.payload.id)
          }
        }
      },
      [tween.destinationLayer]: {
        ...currentState.byId[tween.destinationLayer],
        tweens: {
          ...currentState.byId[tween.destinationLayer].tweens,
          allIds: removeItem(currentState.byId[tween.destinationLayer].tweens.allIds, action.payload.id),
          asDestination: removeItem(currentState.byId[tween.destinationLayer].tweens.asDestination, action.payload.id),
          byProp: {
            ...currentState.byId[tween.destinationLayer].tweens.byProp,
            [tween.prop]: removeItem(currentState.byId[tween.destinationLayer].tweens.byProp[tween.prop], action.payload.id)
          }
        }
      }
    },
    tweens: {
      ...currentState.tweens,
      allIds: removeItem(currentState.tweens.allIds, action.payload.id),
      byId: Object.keys(currentState.tweens.byId).reduce((result: any, key) => {
        if (key !== action.payload.id) {
          result[key] = currentState.tweens.byId[key];
        }
        return result;
      }, {})
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layer Tween',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const updateLayerTweensByProp = (state: LayerState, layerId: string, prop: Btwx.TweenProp): LayerState => {
  let currentState = state;
  const layerItem = state.byId[layerId];
  if (layerItem.scope.length > 1 && state.byId[layerItem.scope[1]].type === 'Artboard') {
    const artboard = layerItem.scope[1];
    const artboardItem = state.byId[artboard] as Btwx.Artboard;
    const eventsWithArtboardAsOrigin = artboardItem.originArtboardForEvents;
    const eventsWithArtboardAsDestination = artboardItem.destinationArtboardForEvents;
    const tweensByProp = layerItem.tweens.byProp[prop];
    // filter tweens by prop
    // if new layer prop matches destination prop, remove tween
    // if new destination prop matches layer prop, remove tween
    if (tweensByProp.length > 0) {
      currentState = tweensByProp.reduce((result: LayerState, current: string) => {
        const tween = result.tweens.byId[current];
        const tweenEvent = result.events.byId[tween.event];
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
    currentState = eventsWithArtboardAsOrigin.reduce((result: LayerState, current: string) => {
      const tweenEvent = result.events.byId[current];
      const destinationArtboardChildren = getLayerDescendants(result, tweenEvent.destinationArtboard);
      const destinationEquivalent = getDestinationEquivalent(result, layerId, destinationArtboardChildren);
      if (destinationEquivalent) {
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[destinationEquivalent.id] as Btwx.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as Btwx.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as Btwx.Artboard;
        const hasTween = getEquivalentTweenProp(layerItem, equivalentLayerItem, artboardItem, destinationArtboardItem, prop);
        const tweenExists = tweenEvent.tweens.some((id: string) => {
          const tween = result.tweens.byId[id];
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
    currentState = eventsWithArtboardAsDestination.reduce((result: LayerState, current: string) => {
      const tweenEvent = result.events.byId[current];
      const originArtboardChildren = getLayerDescendants(result, tweenEvent.artboard);
      const originEquivalent = getDestinationEquivalent(result, layerId, originArtboardChildren);
      if (originEquivalent) {
        const layerItem = result.byId[layerId] as Btwx.Layer;
        const equivalentLayerItem = result.byId[originEquivalent.id] as Btwx.Layer;
        const artboardItem = result.byId[tweenEvent.artboard] as Btwx.Artboard;
        const destinationArtboardItem = result.byId[tweenEvent.destinationArtboard] as Btwx.Artboard;
        const hasTween = getEquivalentTweenProp(layerItem, equivalentLayerItem, destinationArtboardItem, artboardItem, prop);
        const tweenExists = tweenEvent.tweens.some((id: string) => {
          const tween = result.tweens.byId[id];
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
    currentState = Object.keys(TWEEN_PROPS_MAP).reduce((result: LayerState, current: Btwx.TweenProp) => {
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
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          duration: Math.round((action.payload.duration + Number.EPSILON) * 100) / 100
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Duration',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenDelay = (state: LayerState, action: SetLayerTweenDelay): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          delay: Math.round((action.payload.delay + Number.EPSILON) * 100) / 100
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Delay',
      projects: null
    }
  }) as SetLayerEdit);
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
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          ease: action.payload.ease
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Ease',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerTweenPower = (state: LayerState, action: SetLayerTweenPower): LayerState => {
  let currentState = state;
  currentState = {
    ...currentState,
    tweens: {
      ...currentState.tweens,
      byId: {
        ...currentState.tweens.byId,
        [action.payload.id]: {
          ...currentState.tweens.byId[action.payload.id],
          power: action.payload.power
        }
      }
    }
  }
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Tween Power',
      projects: null
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerX = (state: LayerState, action: SetLayerX): LayerState => {
  let currentState = state;
  let x = action.payload.x;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  if (layerItem.type !== 'Artboard') {
    const artboardItem = state.byId[layerItem.artboard];
    x += artboardItem.frame.x;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerX(result, layerActions.setLayerX({id: current, x: action.payload.x}) as SetLayerX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers X',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerY = (state: LayerState, action: SetLayerY): LayerState => {
  let currentState = state;
  let y = action.payload.y;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  if (layerItem.type !== 'Artboard') {
    const artboardItem = state.byId[layerItem.artboard];
    y += artboardItem.frame.y;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerY(result, layerActions.setLayerY({id: current, y: action.payload.y}) as SetLayerY);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Y',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerWidth = (state: LayerState, action: SetLayerWidth): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const absPosition = getAbsolutePosition(currentState, action.payload.id);
  if (layerItem.type === 'Artboard') {
    const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
    const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
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
  paperLayer.position.x = absPosition.x;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerWidth(result, layerActions.setLayerWidth({id: current, width: action.payload.width}) as SetLayerWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Width',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerHeight = (state: LayerState, action: SetLayerHeight): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const absPosition = getAbsolutePosition(currentState, action.payload.id);
  if (layerItem.type === 'Artboard') {
    const mask = paperLayer.getItem({data: { id: 'artboardLayersMask' }});
    const background = paperLayer.getItem({data: { id: 'artboardBackground' }});
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
  paperLayer.position.y = absPosition.y;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerHeight(result, layerActions.setLayerHeight({id: current, height: action.payload.height}) as SetLayerHeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Height',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerOpacity = (state: LayerState, action: SetLayerOpacity): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerOpacity(result, layerActions.setLayerOpacity({id: current, opacity: action.payload.opacity}) as SetLayerOpacity);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Opacity',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerRotation = (state: LayerState, action: SetLayerRotation): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerRotation(result, layerActions.setLayerRotation({id: current, rotation: action.payload.rotation}) as SetLayerRotation);
  }, state);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Rotation',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerHorizontalFlip = (state: LayerState, action: EnableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerHorizontalFlip(result, layerActions.enableLayerHorizontalFlip({id: current}) as EnableLayerHorizontalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Horizontal Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerHorizontalFlip = (state: LayerState, action: DisableLayerHorizontalFlip): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerHorizontalFlip(result, layerActions.disableLayerHorizontalFlip({id: current}) as DisableLayerHorizontalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Horizontal Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerVerticalFlip = (state: LayerState, action: EnableLayerVerticalFlip): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerVerticalFlip(result, layerActions.enableLayerVerticalFlip({id: current}) as EnableLayerVerticalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Vertical Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerVerticalFlip = (state: LayerState, action: DisableLayerVerticalFlip): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerVerticalFlip(result, layerActions.disableLayerVerticalFlip({id: current}) as DisableLayerVerticalFlip);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Vertical Flip',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerFill = (state: LayerState, action: EnableLayerFill): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
        origin: getGradientOriginPoint(currentState, action.payload.id, 'fill'),
        destination: getGradientDestinationPoint(currentState, action.payload.id, 'fill')
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerFill(result, layerActions.enableLayerFill({id: current}) as EnableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Fill',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerFill = (state: LayerState, action: DisableLayerFill): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerFill(result, layerActions.disableLayerFill({id: current}) as DisableLayerFill);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Fill',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFillColor = (state: LayerState, action: SetLayerFillColor): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFillColor(result, layerActions.setLayerFillColor({id: current, fillColor: action.payload.fillColor}) as SetLayerFillColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill Color',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFill = (state: LayerState, action: SetLayerFill): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
        origin: getGradientOriginPoint(currentState, action.payload.id, 'fill'),
        destination: getGradientDestinationPoint(currentState, action.payload.id, 'fill')
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFillType = (state: LayerState, action: SetLayerFillType): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const fill = layerItem.style.fill;
  const gradientType = action.payload.gradientType ? action.payload.gradientType : layerItem.style.fill.gradient.gradientType;
  switch(action.payload.fillType) {
    case 'color':
      paperLayer.fillColor = {hue: fill.color.h, saturation: fill.color.s, lightness: fill.color.l, alpha: fill.color.a} as paper.Color;
      break;
    case 'gradient':
      paperLayer.fillColor = {
        gradient: {
          stops: getGradientStops(fill.gradient.stops),
          radial: gradientType === 'radial'
        },
        origin: getGradientOriginPoint(currentState, action.payload.id, 'fill'),
        destination: getGradientDestinationPoint(currentState, action.payload.id, 'fill')
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
  if (action.payload.gradientType) {
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
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fill', 'fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY']);
  return currentState;
};

export const setLayersFillType = (state: LayerState, action: SetLayersFillType): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFillType(result, layerActions.setLayerFillType({id: current, fillType: action.payload.fillType, gradientType: action.payload.gradientType}) as SetLayerFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Fill Type',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradient = (state: LayerState, action: SetLayerGradient): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  paperLayer[action.payload.prop === 'fill' ? 'fillColor' : 'strokeColor'] = {
    gradient: {
      stops: getGradientStops(action.payload.gradient.stops),
      radial: action.payload.gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientOriginX`, `${action.payload.prop}GradientOriginY`, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
  return currentState;
};

export const setLayersGradient = (state: LayerState, action: SetLayersGradient): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradient(result, layerActions.setLayerGradient({id: current, prop: action.payload.prop, gradient: action.payload.gradient}) as SetLayerGradient);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientType = (state: LayerState, action: SetLayerGradientType): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const paperProp = getPaperProp(action.payload.prop);
  if (paperLayer[paperProp].gradient) {
    switch(action.payload.gradientType) {
      case 'linear':
        paperLayer[paperProp].gradient.radial = false;
        break;
      case 'radial':
        paperLayer[paperProp].gradient.radial = true;
        break;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradientType(result, layerActions.setLayerGradientType({id: current, prop: action.payload.prop, gradientType: action.payload.gradientType}) as SetLayerGradientType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Type',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientOrigin = (state: LayerState, action: SetLayerGradientOrigin): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const origin = getGradientOrigin(currentState, action.payload.id, action.payload.origin);
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
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
              origin: {
                x: origin.x,
                y: origin.y
              }
            }
          }
        }
      }
    }
  }
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(gradient.stops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientOriginX`, `${action.payload.prop}GradientOriginY`] as any);
  return currentState;
};

export const setLayersGradientOrigin = (state: LayerState, action: SetLayersGradientOrigin): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradientOrigin(result, layerActions.setLayerGradientOrigin({id: current, prop: action.payload.prop, origin: action.payload.origin}) as SetLayerGradientOrigin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Origin',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientDestination = (state: LayerState, action: SetLayerGradientDestination): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const destination = getGradientDestination(currentState, action.payload.id, action.payload.destination);
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
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
              destination: {
                x: destination.x,
                y: destination.y
              }
            }
          }
        }
      }
    }
  }
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(gradient.stops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop, `${action.payload.prop}GradientDestinationX`, `${action.payload.prop}GradientDestinationY`] as any);
  return currentState;
};

export const setLayersGradientDestination = (state: LayerState, action: SetLayersGradientDestination): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerGradientDestination(result, layerActions.setLayerGradientDestination({id: current, prop: action.payload.prop, destination: action.payload.destination}) as SetLayerGradientDestination);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Destination',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayersGradientOD = (state: LayerState, action: SetLayersGradientOD): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    result = setLayerGradientOrigin(result, layerActions.setLayerGradientOrigin({id: current, prop: action.payload.prop, origin: action.payload.origin}) as SetLayerGradientOrigin);
    result = setLayerGradientDestination(result, layerActions.setLayerGradientDestination({id: current, prop: action.payload.prop, destination: action.payload.destination}) as SetLayerGradientDestination);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: `Set Layers Gradient ${capitalize(action.payload.handle)}`,
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopColor = (state: LayerState, action: SetLayerGradientStopColor): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  } as any
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Stop Color',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerGradientStopPosition = (state: LayerState, action: SetLayerGradientStopPosition): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  } as any
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const setLayersGradientStopPosition = (state: LayerState, action: SetLayersGradientStopPosition): LayerState => {
  let currentState = state;
  currentState = setLayerGradientStopPosition(currentState, layerActions.setLayerGradientStopPosition({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex, position: action.payload.position}) as SetLayerGradientStopPosition);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Gradient Stop Position',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayerGradientStop = (state: LayerState, action: AddLayerGradientStop): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const gradient = layerItem.style[action.payload.prop].gradient;
  const paperProp = getPaperProp(action.payload.prop);
  const newStops = [...gradient.stops, action.payload.gradientStop];
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
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  } as any
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Add Layers Gradient Stop',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
  return currentState;
};

export const removeLayerGradientStop = (state: LayerState, action: RemoveLayerGradientStop): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const paperProp = getPaperProp(action.payload.prop);
  const gradient = layerItem.style[action.payload.prop].gradient;
  const newStops = gradient.stops.filter((id, index) => index !== action.payload.stopIndex);
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
  paperLayer[paperProp] = {
    gradient: {
      stops: getGradientStops(newStops),
      radial: gradient.gradientType === 'radial'
    },
    origin: getGradientOriginPoint(currentState, action.payload.id, action.payload.prop),
    destination: getGradientDestinationPoint(currentState, action.payload.id, action.payload.prop)
  } as any
  currentState = setLayerActiveGradientStop(currentState, layerActions.setLayerActiveGradientStop({id: action.payload.id, prop: action.payload.prop, stopIndex: 0}) as SetLayerActiveGradientStop);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, [action.payload.prop]);
  return currentState;
};

export const removeLayersGradientStop = (state: LayerState, action: RemoveLayersGradientStop): LayerState => {
  let currentState = state;
  currentState = removeLayerGradientStop(currentState, layerActions.removeLayerGradientStop({id: action.payload.layers[0], prop: action.payload.prop, stopIndex: action.payload.stopIndex}) as RemoveLayerGradientStop);
  currentState = updateGradients(currentState, action.payload.layers, action.payload.prop);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Remove Layers Gradient Stop',
      projects: action.payload.layers.reduce((result, current) => {
        const layerProject = currentState.byId[current].artboard;
        if (!result.includes(layerProject)) {
          result = [...result, layerProject];
        }
        return result;
      }, [])
    }
  }) as SetLayerEdit);
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
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
        origin: getGradientOriginPoint(currentState, action.payload.id, 'stroke'),
        destination: getGradientDestinationPoint(currentState, action.payload.id, 'stroke')
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerStroke(result, layerActions.enableLayerStroke({id: current}) as EnableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Stroke',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerStroke = (state: LayerState, action: DisableLayerStroke): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerStroke(result, layerActions.disableLayerStroke({id: current}) as DisableLayerStroke);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Stroke',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeColor = (state: LayerState, action: SetLayerStrokeColor): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeColor(result, layerActions.setLayerStrokeColor({id: current, strokeColor: action.payload.strokeColor}) as SetLayerStrokeColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Color',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeFillType = (state: LayerState, action: SetLayerStrokeFillType): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const stroke = layerItem.style.stroke;
  const gradientType = action.payload.gradientType ? action.payload.gradientType : layerItem.style.stroke.gradient.gradientType;
  switch(action.payload.fillType) {
    case 'color':
      paperLayer.strokeColor = { hue: stroke.color.h, saturation: stroke.color.s, lightness: stroke.color.l, alpha: stroke.color.a } as paper.Color;
      break;
    case 'gradient':
      paperLayer.strokeColor = {
        gradient: {
          stops: getGradientStops(stroke.gradient.stops),
          radial: gradientType === 'radial'
        },
        origin: getGradientOriginPoint(currentState, action.payload.id, 'stroke'),
        destination: getGradientDestinationPoint(currentState, action.payload.id, 'stroke')
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
  if (action.payload.gradientType) {
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
      }
    }
  }
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['stroke', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY', 'strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY']);
  return currentState;
};

export const setLayersStrokeFillType = (state: LayerState, action: SetLayersStrokeFillType): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeFillType(result, layerActions.setLayerStrokeFillType({id: current, fillType: action.payload.fillType, gradientType: action.payload.gradientType}) as SetLayerStrokeFillType);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Fill Type',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeWidth = (state: LayerState, action: SetLayerStrokeWidth): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeWidth(result, layerActions.setLayerStrokeWidth({id: current, strokeWidth: action.payload.strokeWidth}) as SetLayerStrokeWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Width',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeCap = (state: LayerState, action: SetLayerStrokeCap): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeCap(result, layerActions.setLayerStrokeCap({id: current, strokeCap: action.payload.strokeCap}) as SetLayerStrokeCap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Cap',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeJoin = (state: LayerState, action: SetLayerStrokeJoin): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeJoin(result, layerActions.setLayerStrokeJoin({id: current, strokeJoin: action.payload.strokeJoin}) as SetLayerStrokeJoin);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Join',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashOffset = (state: LayerState, action: SetLayerStrokeDashOffset): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashOffset(result, layerActions.setLayerStrokeDashOffset({id: current, strokeDashOffset: action.payload.strokeDashOffset}) as SetLayerStrokeDashOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Offset',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArray = (state: LayerState, action: SetLayerStrokeDashArray): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashArray(result, layerActions.setLayerStrokeDashArray({id: current, strokeDashArray: action.payload.strokeDashArray}) as SetLayerStrokeDashArray);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayWidth = (state: LayerState, action: SetLayerStrokeDashArrayWidth): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashArrayWidth(result, layerActions.setLayerStrokeDashArrayWidth({id: current, strokeDashArrayWidth: action.payload.strokeDashArrayWidth}) as SetLayerStrokeDashArrayWidth);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array Width',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerStrokeDashArrayGap = (state: LayerState, action: SetLayerStrokeDashArrayGap): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStrokeDashArrayGap(result, layerActions.setLayerStrokeDashArrayGap({id: current, strokeDashArrayGap: action.payload.strokeDashArrayGap}) as SetLayerStrokeDashArrayGap);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Stroke Dash Array Gap',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const enableLayerShadow = (state: LayerState, action: EnableLayerShadow): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const shadow = layerItem.style.shadow;
  paperLayer.shadowColor = { hue: shadow.color.h, saturation: shadow.color.s, lightness: shadow.color.l, alpha: shadow.color.a } as paper.Color;
  paperLayer.shadowBlur = shadow.blur;
  paperLayer.shadowOffset = new uiPaperScope.Point(shadow.offset.x, shadow.offset.y);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return enableLayerShadow(result, layerActions.enableLayerShadow({id: current}) as EnableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Enable Layers Shadow',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const disableLayerShadow = (state: LayerState, action: DisableLayerShadow): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return disableLayerShadow(result, layerActions.disableLayerShadow({id: current}) as DisableLayerShadow);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Disable Layers Shadow',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowColor = (state: LayerState, action: SetLayerShadowColor): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowColor(result, layerActions.setLayerShadowColor({id: current, shadowColor: action.payload.shadowColor}) as SetLayerShadowColor);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Color',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowBlur = (state: LayerState, action: SetLayerShadowBlur): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowBlur(result, layerActions.setLayerShadowBlur({id: current, shadowBlur: action.payload.shadowBlur}) as SetLayerShadowBlur);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Blur',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowXOffset = (state: LayerState, action: SetLayerShadowXOffset): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowXOffset(result, layerActions.setLayerShadowXOffset({id: current, shadowXOffset: action.payload.shadowXOffset}) as SetLayerShadowXOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow X Offset',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerShadowYOffset = (state: LayerState, action: SetLayerShadowYOffset): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerShadowYOffset(result, layerActions.setLayerShadowYOffset({id: current, shadowYOffset: action.payload.shadowYOffset}) as SetLayerShadowYOffset);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Shadow Y Offset',
      projects
    }
  }) as SetLayerEdit);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return scaleLayer(result, layerActions.scaleLayer({id: current, scale: action.payload.scale, verticalFlip: action.payload.verticalFlip, horizontalFlip: action.payload.horizontalFlip}) as ScaleLayer);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Resize Layers',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerText = (state: LayerState, action: SetLayerText): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  textContent.content = action.payload.text;
  const textBackground = paperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  textBackground.bounds = textContent.bounds;
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layer Text',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontSize = (state: LayerState, action: SetLayerFontSize): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  textContent.fontSize = action.payload.fontSize;
  const textBackground = paperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  textBackground.bounds = textContent.bounds;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFontSize(result, layerActions.setLayerFontSize({id: current, fontSize: action.payload.fontSize}) as SetLayerFontSize);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Size',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontWeight = (state: LayerState, action: SetLayerFontWeight): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  textContent.fontWeight = action.payload.fontWeight;
  const textBackground = paperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  textBackground.bounds = textContent.bounds;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFontWeight(result, layerActions.setLayerFontWeight({id: current, fontWeight: action.payload.fontWeight}) as SetLayerFontWeight);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Weight',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerFontFamily = (state: LayerState, action: SetLayerFontFamily): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  textContent.fontFamily = action.payload.fontFamily;
  const textBackground = paperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  textBackground.bounds = textContent.bounds;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerFontFamily(result, layerActions.setLayerFontFamily({id: current, fontFamily: action.payload.fontFamily}) as SetLayerFontFamily);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Font Family',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerLeading = (state: LayerState, action: SetLayerLeading): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  textContent.leading = action.payload.leading;
  const textBackground = paperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  textBackground.bounds = textContent.bounds;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerLeading(result, layerActions.setLayerLeading({id: current, leading: action.payload.leading}) as SetLayerLeading);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Leading',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerJustification = (state: LayerState, action: SetLayerJustification): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id) as { layerItem: Btwx.Text; paperLayer: paper.PointText };
  const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
  const textBackground = paperLayer.getItem({data: {id: 'textBackground'}}) as paper.PointText;
  const prevJustification = textContent.justification;
  textContent.justification = action.payload.justification;
  switch(prevJustification) {
    case 'left':
      switch(action.payload.justification) {
        case 'left':
          break;
        case 'center':
          textContent.position.x += textContent.bounds.width / 2
          break;
        case 'right':
          textContent.position.x += textContent.bounds.width
          break;
      }
      break;
    case 'center':
      switch(action.payload.justification) {
        case 'left':
          textContent.position.x -= textContent.bounds.width / 2
          break;
        case 'center':
          break;
        case 'right':
          textContent.position.x += textContent.bounds.width / 2
          break;
      }
      break;
    case 'right':
      switch(action.payload.justification) {
        case 'left':
          textContent.position.x -= textContent.bounds.width;
          break;
        case 'center':
          textContent.position.x -= textContent.bounds.width / 2;
          break;
        case 'right':
          break;
      }
      break;
  }
  textBackground.bounds = textContent.bounds;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerJustification(result, layerActions.setLayerJustification({id: current, justification: action.payload.justification}) as SetLayerJustification);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Justification',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const addLayersMask = (state: LayerState, action: AddLayersMask): LayerState => {
  // let currentState = state;
  // const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.layers[0]);
  // const parentLayerItem = state.byId[layerItem.parent];
  // const layerIndex = parentLayerItem.children.indexOf(action.payload.layers[0]);
  // const underlyingSiblings = getLayerYoungerSiblings(currentState, action.payload.layers[0]);
  // const mask = paperLayer.clone();
  // mask.clipMask = true;
  // const maskGroup = new uiPaperScope.Group({
  //   name: 'MaskGroup',
  //   data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
  //   children: [mask]
  // });
  // // let continueMaskChain = true;
  // // let i = layerIndex;
  // // while(i < underlyingSiblings.length && continueMaskChain) {
  // //   const child = underlyingSiblings[i];
  // //   const childItem = state.byId[child];
  // //   const childPaperLayer = getPaperLayer(child);
  // //   if (childItem.ignoreUnderlyingMask) {
  // //     continueMaskChain = false;
  // //   } else {
  // //     maskGroup.addChild(childPaperLayer);
  // //   }
  // //   i++;
  // // }
  // paperLayer.replaceWith(maskGroup);
  // currentState = {
  //   ...currentState,
  //   byId: {
  //     ...currentState.byId,
  //     [action.payload.layers[0]]: {
  //       ...currentState.byId[action.payload.layers[0]],
  //       mask: true
  //     } as Btwx.Shape
  //   }
  // };
  // if (underlyingSiblings.length > 0) {
  //   let continueMaskChain = true;
  //   currentState = underlyingSiblings.reduce((result, current) => {
  //     const siblingLayerItems = getItemLayers(currentState, current);
  //     const siblingItem = siblingLayerItems.layerItem;
  //     const siblingPaperLayer = siblingLayerItems.paperLayer;
  //     const underlyingMask = siblingItem.underlyingMask;
  //     const underlyingMaskIndex = underlyingMask ? parentLayerItem.children.indexOf(underlyingMask) : null;
  //     if (siblingItem.ignoreUnderlyingMask && continueMaskChain) {
  //       continueMaskChain = false;
  //     }
  //     if (!underlyingMask || (underlyingMask && underlyingMaskIndex < layerIndex)) {
  //       result = setLayerUnderlyingMask(result, layerActions.setLayerUnderlyingMask({id: current, underlyingMask: action.payload.layers[0]}) as SetLayerUnderlyingMask);
  //     }
  //     if (continueMaskChain) {
  //       maskGroup.addChild(siblingPaperLayer);
  //       if (!siblingItem.masked) {
  //         result = setLayerMasked(result, layerActions.setLayerMasked({id: current, masked: true}) as SetLayerMasked);
  //       }
  //     }
  //     return result;
  //   }, currentState);
  // }
  // // if (action.payload.group) {
  //   // currentState = groupLayers(currentState, layerActions.groupLayers(action.payload) as GroupLayers);
  //   // const mask = currentState.byId[action.payload.group.id].children[0];
  //   // const maskPaperLayer = getPaperLayer(mask);
  //   // const maskGroupPaperLayer = getPaperLayer(action.payload.group.id);
  //   // maskPaperLayer.clipMask = true;
  //   // maskGroupPaperLayer.position.x += 1;
  //   // maskGroupPaperLayer.position.x -= 1;
  //   // currentState = {
  //   //   ...currentState,
  //   //   byId: {
  //   //     ...currentState.byId,
  //   //     [mask]: {
  //   //       ...currentState.byId[mask],
  //   //       mask: true
  //   //     } as Btwx.Shape
  //   //   }
  //   // };
  // // }
  // // currentState = setLayerName(currentState, layerActions.setLayerName({id: mask, name: 'Mask'}) as SetLayerName);
  // // currentState = maskLayers(currentState, layerActions.maskLayers({layers: currentState.byId[action.payload.group.id].children.filter((id) => id !== mask)}) as MaskLayers);
  // // currentState = updateLayerBounds(currentState, action.payload.group.id);
  // currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
  //   edit: {
  //     actionType: action.type,
  //     payload: action.payload,
  //     detail: 'Add Layers Mask'
  //   }
  // }) as SetLayerEdit);
  return state;
};

export const toggleLayerMask = (state: LayerState, action: ToggleLayerMask): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item };
  const parentLayerItem = state.byId[layerItem.parent];
  const paperScopeItem = paper.PaperScope.get(state.paperScope);
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const underlyingSiblings = getLayerYoungerSiblings(currentState, action.payload.id);
  const maskableUnderlyingSiblings = getMaskableSiblings(currentState, action.payload.id, underlyingSiblings);
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
      const siblingItemLayers = getItemLayers(currentState, sibling) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item };
      const siblingItem = siblingItemLayers.layerItem;
      const isShape = siblingItem.type === 'Shape';
      const isMask = isShape && (siblingItem as Btwx.Shape).mask;
      const siblingPaperLayer = isMask ? siblingItemLayers.paperLayer.parent : siblingItemLayers.paperLayer;
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
    const maskGroup = new paperScopeItem.Group({
      name: 'MaskGroup',
      data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
      children: [mask]
    });
    paperLayer.replaceWith(maskGroup);
    if (maskableUnderlyingSiblings.length > 0) {
      maskableUnderlyingSiblings.forEach((sibling) => {
        const siblingItemLayers = getItemLayers(currentState, sibling) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item };
        const siblingItem = siblingItemLayers.layerItem;
        const isShape = siblingItem.type === 'Shape';
        const isMask = isShape && (siblingItem as Btwx.Shape).mask;
        const siblingPaperLayer = isMask ? siblingItemLayers.paperLayer.parent : siblingItemLayers.paperLayer;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return toggleLayerMask(result, layerActions.toggleLayerMask({id: current}) as ToggleLayerMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Toggle Layers Mask',
      projects
    }
  }) as SetLayerEdit);
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
      } as Btwx.MaskableLayer
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
  const layerItemLayers = getItemLayers(currentState, action.payload.id);
  const layerItem = layerItemLayers.layerItem as Btwx.MaskableLayer;
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const parentItem = state.byId[layerItem.parent];
  const layerIndex = parentItem.children.indexOf(action.payload.id);
  const aboveSiblingId = layerIndex !== 0 ? parentItem.children[layerIndex - 1] : null;
  const aboveSiblingItemLayers = aboveSiblingId ? getItemLayers(currentState, aboveSiblingId) as { layerItem: Btwx.MaskableLayer; paperLayer: paper.Item } : null;
  const aboveSiblingItem = aboveSiblingId ? aboveSiblingItemLayers.layerItem : null;
  const isAboveSiblingMask = aboveSiblingItem && aboveSiblingItem.type === 'Shape' && (aboveSiblingItem as Btwx.Shape).mask;
  const isAboveSiblingMasked = aboveSiblingItem && aboveSiblingItem.masked;
  const paperLayer = isMask ? layerItemLayers.paperLayer.parent : layerItemLayers.paperLayer;
  const maskableUnderlyingSiblings = getMaskableSiblings(currentState, action.payload.id);
  if (layerItem.ignoreUnderlyingMask) {
    if (layerItem.underlyingMask && (isAboveSiblingMasked || isAboveSiblingMask)) {
      const aboveSiblingPaperLayer = isAboveSiblingMask ? aboveSiblingItemLayers.paperLayer.parent : aboveSiblingItemLayers.paperLayer;
      if (isAboveSiblingMask) {
        aboveSiblingPaperLayer.addChild(paperLayer);
      } else {
        paperLayer.insertAbove(aboveSiblingPaperLayer);
      }
      if (maskableUnderlyingSiblings.length > 0 && !isMask) {
        maskableUnderlyingSiblings.forEach((sibling) => {
          const siblingItemLayers = getItemLayers(currentState, sibling);
          const siblingItem = siblingItemLayers.layerItem;
          const isSiblingMask = siblingItem.type === 'Shape' && (siblingItem as Btwx.Shape).mask;
          const siblingPaperLayer = isSiblingMask ? siblingItemLayers.paperLayer.parent : siblingItemLayers.paperLayer;
          siblingPaperLayer.insertAbove(paperLayer);
        });
      }
      currentState = setLayersMasked(currentState, layerActions.setLayersMasked({layers: [...maskableUnderlyingSiblings, action.payload.id], masked: true}) as SetLayersMasked);
    }
  } else {
    if (layerItem.underlyingMask && layerItem.masked) {
      const underlyingMaskItem = getItemLayers(currentState, layerItem.underlyingMask);
      const maskGroupPaperLayer = underlyingMaskItem.paperLayer.parent;
      if (maskableUnderlyingSiblings.length > 0 && !isMask) {
        maskableUnderlyingSiblings.reverse().forEach((sibling) => {
          const siblingItemLayers = getItemLayers(currentState, sibling);
          const siblingItem = siblingItemLayers.layerItem;
          const isSiblingMask = siblingItem.type === 'Shape' && (siblingItem as Btwx.Shape).mask;
          const siblingPaperLayer = isSiblingMask ? siblingItemLayers.paperLayer.parent : siblingItemLayers.paperLayer;
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
        ignoreUnderlyingMask: !(currentState.byId[action.payload.id] as Btwx.MaskableLayer).ignoreUnderlyingMask
      } as Btwx.MaskableLayer
    }
  }
  return currentState;
};

export const toggleLayersIgnoreUnderlyingMask = (state: LayerState, action: ToggleLayersIgnoreUnderlyingMask): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return toggleLayerIgnoreUnderlyingMask(result, layerActions.toggleLayerIgnoreUnderlyingMask({id: current}) as ToggleLayerIgnoreUnderlyingMask);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Toggle Layers Ignore Underlying Mask',
      projects
    }
  }) as SetLayerEdit);
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
      } as Btwx.MaskableLayer
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    paperLayer.bounds.left = layersBounds.left;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Left',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToRight = (state: LayerState, action: AlignLayersToRight): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    paperLayer.bounds.right = layersBounds.right;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Right',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToTop = (state: LayerState, action: AlignLayersToTop): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    paperLayer.bounds.top = layersBounds.top;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Top',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToBottom = (state: LayerState, action: AlignLayersToBottom): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    paperLayer.bounds.bottom = layersBounds.bottom;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Bottom',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToCenter = (state: LayerState, action: AlignLayersToCenter): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    paperLayer.bounds.center.x = layersBounds.center.x;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Bottom',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const alignLayersToMiddle = (state: LayerState, action: AlignLayersToMiddle): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    paperLayer.bounds.center.y = layersBounds.center.y;
    result = updateLayerBounds(result, current);
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Align Layers To Middle',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const distributeLayersHorizontally = (state: LayerState, action: DistributeLayersHorizontally): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  const layersWidth = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    result = result + paperLayer.bounds.width;
    return result;
  }, 0);
  const diff = (layersBounds.width - layersWidth) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByLeft(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const { layerItem, paperLayer } = getItemLayers(currentState, current);
      const prevLayer = orderedLayers[index - 1];
      const prevItemLayers = getItemLayers(currentState, prevLayer);
      const prevPaperLayer = prevItemLayers.paperLayer;
      paperLayer.bounds.left = prevPaperLayer.bounds.right + diff;
      result = updateLayerBounds(result, current);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Distribute Layers To Horizontally',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const distributeLayersVertically = (state: LayerState, action: DistributeLayersVertically): LayerState => {
  let currentState = state;
  const layersBounds = getLayersBounds(currentState, action.payload.layers);
  const projects: string[] = [];
  const layersHeight = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    const { layerItem, paperLayer } = getItemLayers(currentState, current);
    result = result + paperLayer.bounds.height;
    return result;
  }, 0);
  const diff = (layersBounds.height - layersHeight) / (action.payload.layers.length - 1);
  const orderedLayers = orderLayersByTop(currentState, action.payload.layers);
  currentState = orderedLayers.reduce((result: LayerState, current: string, index: number) => {
    if (index !== 0 && index !== orderedLayers.length - 1) {
      const { layerItem, paperLayer } = getItemLayers(currentState, current);
      const prevLayer = orderedLayers[index - 1];
      const prevItemLayers = getItemLayers(currentState, prevLayer);
      const prevPaperLayer = prevItemLayers.paperLayer;
      paperLayer.bounds.top = prevPaperLayer.bounds.bottom + diff;
      result = updateLayerBounds(result, current);
    }
    return result;
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Distribute Layers To Vertically',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const duplicateLayer = (state: LayerState, action: DuplicateLayer): {
  state: LayerState;
  cloneMap: {
    [id: string]: string;
  };
} => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  const parentItem = currentState.byId[layerItem.parent];
  const isArtboard = layerItem.type === 'Artboard';
  const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
  const duplicatePaperLayer = isArtboard ? paperLayer.clone({insert: false}) : isMask ? paperLayer.parent.clone() : paperLayer.clone();
  const layerCloneMap = getLayerAndDescendants(currentState, action.payload.id).reduce((result: { [id: string]: string }, current) => ({
    ...result,
    [current]: uuidv4()
  }), {} as { [id: string]: string });
  if (action.payload.offset) {
    duplicatePaperLayer.position.x += action.payload.offset.x;
    duplicatePaperLayer.position.y += action.payload.offset.y;
  }
  currentState = Object.keys(layerCloneMap).reduce((result: LayerState, key: string, index: number) => {
    const itemToCopy = currentState.byId[key];
    const copyId = layerCloneMap[key];
    const copyParent = index === 0 ? itemToCopy.parent : layerCloneMap[itemToCopy.parent];
    const copyShowChildren = itemToCopy.showChildren;
    const parentLayerItem = result.byId[copyParent];
    const copyScope = itemToCopy.type === 'Artboard' ? ['root'] : [...parentLayerItem.scope, copyParent];
    const copyArtboard = itemToCopy.type === 'Artboard' ? copyId : copyScope[1];
    const copyUnderlyingMask = index === 0
                                ? !isArtboard
                                  ? (itemToCopy as Btwx.MaskableLayer).underlyingMask
                                  : null
                                : Object.prototype.hasOwnProperty.call(layerCloneMap, (itemToCopy as Btwx.MaskableLayer).underlyingMask)
                                  ? layerCloneMap[(itemToCopy as Btwx.MaskableLayer).underlyingMask]
                                  : (itemToCopy as Btwx.MaskableLayer).underlyingMask;
    const copyChildren = itemToCopy.children ? itemToCopy.children.reduce((result, current) => {
        if (Object.prototype.hasOwnProperty.call(layerCloneMap, current)) {
          return [...result, layerCloneMap[current]];
        } else {
          return [...result, current];
        }
      }, [])
    : null;
    const copyPaperLayer = index === 0 ? duplicatePaperLayer : duplicatePaperLayer.getItem({ data: { id: key } });
    copyPaperLayer.data.id = copyId;
    copyPaperLayer.data.scope = copyScope;
    switch(itemToCopy.type) {
      case 'Artboard':
        result = {
          ...result,
          allArtboardIds: addItem(result.allArtboardIds, copyId)
        }
        break;
      case 'Shape':
        result = {
          ...result,
          allShapeIds: addItem(result.allShapeIds, copyId),
          shapeIcons: {
            ...result.shapeIcons,
            [copyId]: result.shapeIcons[key]
          }
        }
        break;
      case 'Group':
        result = {
          ...result,
          allGroupIds: addItem(result.allGroupIds, copyId)
        }
        break;
      case 'Text':
        result = {
          ...result,
          allTextIds: addItem(result.allTextIds, copyId)
        }
        break;
      case 'Image':
        result = {
          ...result,
          allImageIds: addItem(result.allImageIds, copyId)
        }
        break;
    }
    result = {
      ...result,
      allIds: [...result.allIds, copyId],
      byId: {
        ...result.byId,
        [copyId]: {
          ...itemToCopy,
          id: copyId,
          parent: copyParent,
          artboard: copyArtboard,
          children: copyChildren,
          scope: copyScope,
          underlyingMask: copyUnderlyingMask,
          events: [],
          tweens: {
            allIds: [],
            asOrigin: [],
            asDestination: [],
            byProp: TWEEN_PROPS_MAP
          }
        }
      } as any,
      childrenById: {
        ...result.childrenById,
        [copyId]: copyChildren
      },
      showChildrenById: {
        ...result.showChildrenById,
        [copyId]: copyShowChildren
      },
      scopeById: {
        ...result.scopeById,
        [copyId]: copyScope
      },
    };
    if (index === 0 && action.payload.offset) {
      if (itemToCopy.type !== 'Artboard') {
        const artboardItems = getItemLayers(result, itemToCopy.artboard);
        const positionInArtboard = copyPaperLayer.position.subtract(artboardItems.paperLayer.position);
        result = {
          ...result,
          byId: {
            ...result.byId,
            [copyId]: {
              ...result.byId[copyId],
              frame: {
                ...result.byId[copyId].frame,
                x: positionInArtboard.x,
                y: positionInArtboard.y
              }
            }
          }
        }
      } else {
        result = {
          ...result,
          byId: {
            ...result.byId,
            [copyId]: {
              ...result.byId[copyId],
              frame: {
                ...result.byId[copyId].frame,
                x: copyPaperLayer.position.x,
                y: copyPaperLayer.position.y
              }
            }
          }
        }
      }
    }
    return result;
  }, currentState);
  // if artboard, update artboard json and paperscope after all children are duplicated
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [layerItem.parent]: {
        ...currentState.byId[layerItem.parent],
        children: addItem(currentState.byId[layerItem.parent].children, layerCloneMap[action.payload.id])
      } as Btwx.Group | Btwx.Artboard
    },
    childrenById: {
      ...currentState.childrenById,
      [layerItem.parent]: addItem(currentState.childrenById[layerItem.parent], layerCloneMap[action.payload.id])
    }
  }
  if (isArtboard) {
    const artboard = currentState.allArtboardIds[currentState.allArtboardIds.length - 1];
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [artboard]: {
          ...currentState.byId[artboard],
          paperScope: currentState.childrenById.root.length + 1,
          json: duplicatePaperLayer.exportJSON()
        } as Btwx.Artboard
      }
    }
  }
  currentState = updateChildrenIndices(currentState, parentItem.id);
  currentState = updateParentBounds(currentState, layerItem.id);
  // if (layerItem.id === currentState.hover) {
  //   currentState = setLayerHover(currentState, layerActions.setLayerHover({id: layerCloneMap[action.payload.id]}) as SetLayerHover);
  // }
  return {
    state: currentState,
    cloneMap: layerCloneMap
  };
};

export const duplicateLayers = (state: LayerState, action: DuplicateLayers): LayerState => {
  let currentState = state;
  let masterCloneMap: { [id: string]: string } = {};
  const projects: string[] = [];
  const newSelection: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const duplicate = duplicateLayer(result, layerActions.duplicateLayer({id: current, offset: action.payload.offset}) as DuplicateLayer);
    const duplicateId = duplicate.cloneMap[current];
    const layerProject = duplicate.state.byId[duplicateId].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    masterCloneMap = {...masterCloneMap, ...duplicate.cloneMap};
    newSelection.push(duplicateId);
    result = duplicate.state;
    return result;
  }, currentState);
  if (state.hover && masterCloneMap[state.hover]) {
    currentState = setLayerHover(currentState, layerActions.setLayerHover({id: masterCloneMap[state.hover]}) as SetLayerHover);
  }
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: newSelection, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Duplicate Layers',
      projects: projects
    }
  }) as SetLayerEdit);
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
  const layerIndex = layerItem.index;
  if (layerIndex !== parentItem.children.length - 1) {
    currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.id, above: parentItem.children[layerIndex + 1]}) as InsertLayerAbove);
  }
  return currentState;
};

export const bringLayersForward = (state: LayerState, action: BringLayersForward): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return bringLayerForward(result, layerActions.bringLayerForward({id: current}) as BringLayerForward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Bring Layers Forward',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const bringLayerToFront = (state: LayerState, action: BringLayerToFront): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = layerItem.index;
  if (layerIndex !== parentItem.children.length - 1) {
    currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.id, above: parentItem.children[parentItem.children.length - 1]}) as InsertLayerAbove);
  }
  return currentState;
};

export const bringLayersToFront = (state: LayerState, action: BringLayersToFront): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reverse().reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return bringLayerToFront(result, layerActions.bringLayerToFront({id: current}) as BringLayerToFront);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Bring Layers To Front',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const sendLayerBackward = (state: LayerState, action: SendLayerBackward): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = layerItem.index;
  if (layerIndex !== 0) {
    currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.id, below: parentItem.children[layerIndex - 1]}) as InsertLayerBelow);
  }
  return currentState;
};

export const sendLayersBackward = (state: LayerState, action: SendLayersBackward): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return sendLayerBackward(result, layerActions.sendLayerBackward({id: current}) as SendLayerBackward);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Send Layers Backward',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const sendLayerToBack = (state: LayerState, action: SendLayerToBack): LayerState => {
  let currentState = state;
  const layerItem = currentState.byId[action.payload.id];
  const parentItem = currentState.byId[layerItem.parent];
  const layerIndex = layerItem.index;
  if (layerIndex !== 0) {
    currentState = insertLayerBelow(currentState, layerActions.insertLayerBelow({id: action.payload.id, below: parentItem.children[0]}) as InsertLayerBelow);
  }
  return currentState;
};

export const sendLayersToBack = (state: LayerState, action: SendLayersToBack): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return sendLayerToBack(result, layerActions.sendLayerToBack({id: current}) as SendLayerToBack);
  }, currentState);
  currentState = selectLayers(currentState, layerActions.selectLayers({layers: action.payload.layers, newSelection: true}) as SelectLayers);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Send Layers To Back',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerBlendMode = (state: LayerState, action: SetLayerBlendMode): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerBlendMode(result, layerActions.setLayerBlendMode({id: current, blendMode: action.payload.blendMode}) as SetLayerBlendMode);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Blend Mode',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const uniteLayers = (state: LayerState, action: UniteLayers): LayerState => {
  let currentState = state;
  // currentState = addShape(currentState, layerActions.addShape({layer: action.payload.booleanLayer, batch: true}) as AddShape);
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const intersectLayers = (state: LayerState, action: IntersectLayers): LayerState => {
  let currentState = state;
  // currentState = addShape(currentState, layerActions.addShape({layer: action.payload.booleanLayer, batch: true}) as AddShape);
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const subtractLayers = (state: LayerState, action: SubtractLayers): LayerState => {
  let currentState = state;
  // currentState = addShape(currentState, layerActions.addShape({layer: action.payload.booleanLayer, batch: true}) as AddShape);
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const excludeLayers = (state: LayerState, action: ExcludeLayers): LayerState => {
  let currentState = state;
  // currentState = addShape(currentState, layerActions.addShape({layer: action.payload.booleanLayer, batch: true}) as AddShape);
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const divideLayers = (state: LayerState, action: DivideLayers): LayerState => {
  let currentState = state;
  // currentState = addShape(currentState, layerActions.addShape({layer: action.payload.booleanLayer, batch: true}) as AddShape);
  currentState = insertLayerAbove(currentState, layerActions.insertLayerAbove({id: action.payload.booleanLayer.id, above: action.payload.layers[0]}) as InsertLayerAbove);
  currentState = removeLayers(currentState, layerActions.removeLayers({layers: action.payload.layers}) as RemoveLayers);
  return currentState;
};

export const setRoundedRadius = (state: LayerState, action: SetRoundedRadius): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id) as { layerItem: Btwx.Layer; paperLayer: paper.CompoundPath };
  const paperLayerPath = paperLayer.children[0] as paper.Path;
  paperLayerPath.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height);
  const newShape = new uiPaperScope.Path.Rectangle({
    from: paperLayerPath.bounds.topLeft,
    to: paperLayerPath.bounds.bottomRight,
    radius: (maxDim / 2) * action.payload.radius,
    insert: false
  });
  paperLayerPath.pathData = newShape.pathData;
  paperLayerPath.rotation = layerItem.transform.rotation;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setRoundedRadius(result, layerActions.setRoundedRadius({id: current, radius: action.payload.radius}) as SetRoundedRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Rounded Radii',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setPolygonSides = (state: LayerState, action: SetPolygonSides): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id) as { layerItem: Btwx.Layer; paperLayer: paper.CompoundPath };
  const paperLayerPath = paperLayer.children[0] as paper.Path;
  const startPosition = paperLayerPath.position;
  paperLayerPath.rotation = -layerItem.transform.rotation;
  const newShape = new uiPaperScope.Path.RegularPolygon({
    center: paperLayerPath.bounds.center,
    radius: Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height) / 2,
    sides: action.payload.sides,
    insert: false
  });
  newShape.bounds.width = paperLayerPath.bounds.width;
  newShape.bounds.height = paperLayerPath.bounds.height;
  newShape.rotation = layerItem.transform.rotation;
  newShape.position = startPosition;
  paperLayerPath.pathData = newShape.pathData;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setPolygonSides(result, layerActions.setPolygonSides({id: current, sides: action.payload.sides}) as SetPolygonSides);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Polygons Sides',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setStarPoints = (state: LayerState, action: SetStarPoints): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id) as { layerItem: Btwx.Layer; paperLayer: paper.CompoundPath };
  const paperLayerPath = paperLayer.children[0] as paper.Path;
  const startPosition = paperLayerPath.position;
  paperLayerPath.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height);
  const newShape = new uiPaperScope.Path.Star({
    center: paperLayerPath.bounds.center,
    radius1: maxDim / 2,
    radius2: (maxDim / 2) * (layerItem as Btwx.Star).radius,
    points: action.payload.points,
    insert: false
  });
  newShape.bounds.width = paperLayerPath.bounds.width;
  newShape.bounds.height = paperLayerPath.bounds.height;
  newShape.rotation = layerItem.transform.rotation;
  newShape.position = startPosition;
  paperLayerPath.pathData = newShape.pathData;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setStarPoints(result, layerActions.setStarPoints({id: current, points: action.payload.points}) as SetStarPoints);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Stars Points',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setStarRadius = (state: LayerState, action: SetStarRadius): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id) as { layerItem: Btwx.Layer; paperLayer: paper.CompoundPath };
  const paperLayerPath = paperLayer.children[0] as paper.Path;
  const startPosition = paperLayerPath.position;
  paperLayerPath.rotation = -layerItem.transform.rotation;
  const maxDim = Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height);
  const newShape = new uiPaperScope.Path.Star({
    center: paperLayerPath.bounds.center,
    radius1: maxDim / 2,
    radius2: (maxDim / 2) * action.payload.radius,
    points: (layerItem as Btwx.Star).points,
    insert: false
  });
  newShape.bounds.width = paperLayerPath.bounds.width;
  newShape.bounds.height = paperLayerPath.bounds.height;
  newShape.rotation = layerItem.transform.rotation;
  newShape.position = startPosition;
  paperLayerPath.pathData = newShape.pathData;
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
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setStarRadius(result, layerActions.setStarRadius({id: current, radius: action.payload.radius}) as SetStarRadius);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Stars Radius',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFromX = (state: LayerState, action: SetLineFromX): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line From X',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromX = (state: LayerState, action: SetLinesFromX): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineFromX(result, layerActions.setLineFromX({id: current, x: action.payload.x, setEdit: false}) as SetLineFromX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines From X',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineFromY = (state: LayerState, action: SetLineFromY): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line From Y',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesFromY = (state: LayerState, action: SetLinesFromY): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineFromY(result, layerActions.setLineFromY({id: current, y: action.payload.y, setEdit: false}) as SetLineFromY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines From Y',
      projects
    }
  }) as SetLayerEdit);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Line From',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineToX = (state: LayerState, action: SetLineToX): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line To X',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToX = (state: LayerState, action: SetLinesToX): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineToX(result, layerActions.setLineToX({id: current, x: action.payload.x, setEdit: false}) as SetLineToX);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines To X',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLineToY = (state: LayerState, action: SetLineToY): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
  currentState = updateLayerBounds(currentState, action.payload.id);
  currentState = updateLayerTweensByProps(currentState, action.payload.id, ['fromX', 'fromY', 'toX', 'toY']);
  if (action.payload.setEdit) {
    currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
      edit: {
        actionType: action.type,
        payload: action.payload,
        detail: 'Set Line To Y',
        projects: [layerItem.artboard]
      }
    }) as SetLayerEdit);
  }
  return currentState;
};

export const setLinesToY = (state: LayerState, action: SetLinesToY): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLineToY(result, layerActions.setLineToY({id: current, y: action.payload.y, setEdit: false}) as SetLineToY);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Lines To Y',
      projects
    }
  }) as SetLayerEdit);
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
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Line To',
      projects: [layerItem.artboard]
    }
  }) as SetLayerEdit);
  return currentState;
};

export const setLayerEdit = (state: LayerState, action: SetLayerEdit): LayerState => {
  let currentState = state;
  if (action.payload.edit.projects) {
    currentState = {
      ...currentState,
      byId: action.payload.edit.projects.reduce((result, current) => {
        if (currentState.byId[current]) {
          const projectJSON = savePaperProjectJSON(currentState, current);
          result[current] = {
            ...result[current],
            json: projectJSON ? projectJSON : (currentState.byId[current] as Btwx.Artboard).json
          } as Btwx.Artboard
        }
        return result;
      }, currentState.byId),
      artboardJSON: action.payload.edit.projects.reduce((result, current) => {
        if (currentState.byId[current]) {
          result[current] = action.payload.edit.id;
        }
        return result;
      }, currentState.artboardJSON)
    }
  }
  currentState = {
    ...currentState,
    edit: action.payload.edit
  }
  return currentState;
};

export const setLayerStyle = (state: LayerState, action: SetLayerStyle): LayerState => {
  let currentState = state;
  const { layerItem, paperLayer } = getItemLayers(currentState, action.payload.id);
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
            origin: getGradientOriginPoint(currentState, action.payload.id, 'fill'),
            destination: getGradientDestinationPoint(currentState, action.payload.id, 'fill')
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
            origin: getGradientOriginPoint(currentState, action.payload.id, 'stroke'),
            destination: getGradientDestinationPoint(currentState, action.payload.id, 'stroke')
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
      paperLayer.shadowOffset = new uiPaperScope.Point(offset.x ? offset.x : layerItem.style.shadow.offset.x, offset.y ? offset.y : layerItem.style.shadow.offset.y);
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
  return currentState;
};

export const setLayersStyle = (state: LayerState, action: SetLayersStyle): LayerState => {
  let currentState = state;
  const projects: string[] = [];
  currentState = action.payload.layers.reduce((result, current) => {
    const layerProject = currentState.byId[current].artboard;
    if (!projects.includes(layerProject)) {
      projects.push(layerProject);
    }
    return setLayerStyle(result, layerActions.setLayerStyle({id: current, style: action.payload.style, textStyle: action.payload.textStyle}) as SetLayerStyle);
  }, currentState);
  currentState = setLayerEdit(currentState, layerActions.setLayerEdit({
    edit: {
      actionType: action.type,
      payload: action.payload,
      detail: 'Set Layers Style',
      projects
    }
  }) as SetLayerEdit);
  return currentState;
};