/* eslint-disable @typescript-eslint/no-use-before-define */
import { v4 as uuidv4 } from 'uuid';
import { LayerState } from '../reducers/layer';
import * as layerActions from '../actions/layer';
import { addItem, removeItem, insertItem, addItems } from './general';

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
  DisableLayerHorizontalFlip, EnableLayerVerticalFlip, DisableLayerVerticalFlip, AddText, SetLayerText
} from '../actionTypes/layer';

import {
  getLayerIndex, getLayer, getLayerDepth, isScopeLayer, isScopeGroupLayer, getNearestScopeAncestor,
  getNearestScopeGroupAncestor, getParentLayer, getLayerScope, getPaperLayer, getSelectionTopLeft,
  getPaperLayerByPaperId, getClipboardTopLeft, getSelectionBottomRight, getPagePaperLayer,
  getClipboardBottomRight, getClipboardCenter, getSelectionCenter, getLayerAndAllChildren,
  getAllLayerChildren, getDestinationEquivalent, getEquivalentTweenProps, isTweenDestinationLayer,
  getTweensByDestinationLayer, getAllArtboardTweenEventDestinations, getAllArtboardTweenLayerDestinations,
  getAllArtboardTweenEvents, getTweensEventsByDestinationArtboard, getTweensByLayer
} from '../selectors/layer';

import { paperMain } from '../../canvas';

import { applyShapeMethods } from '../../canvas/shapeUtils';
import { applyTextMethods } from '../../canvas/textUtils';
import { applyArtboardMethods } from '../../canvas/artboardUtils';

export const addPage = (state: LayerState, action: AddPage): LayerState => {
  return {
    ...state,
    allIds: addItem(state.allIds, action.payload.id),
    byId: {
      ...state.byId,
      [action.payload.id]: action.payload
    },
    page: action.payload.id,
    paperProject: paperMain.project.exportJSON()
  }
};

export const addArtboard = (state: LayerState, action: AddArtboard): LayerState => {
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(state.page);
  const stateWithLayer = {
    ...state,
    allIds: addItem(state.allIds, action.payload.id),
    byId: {
      ...state.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: state.page
      } as em.Artboard,
      [state.page]: {
        ...state.byId[state.page],
        children: addItem(state.byId[state.page].children, action.payload.id)
      } as em.Page
    },
    artboards: addItem(state.artboards, action.payload.id),
    paperProject: paperMain.project.exportJSON()
  }
  return selectLayer(stateWithLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
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

export const addLayer = (state: LayerState, action: AddGroup | AddShape): LayerState => {
  let currentState = state;
  const layerParent = action.payload.parent ? action.payload.parent : currentState.page;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(layerParent);
  // add layer
  currentState = {
    ...currentState,
    allIds: addItem(currentState.allIds, action.payload.id),
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...action.payload,
        parent: layerParent
      } as em.Page | em.Group | em.Shape,
      [layerParent]: {
        ...currentState.byId[layerParent],
        children: addItem((currentState.byId[layerParent] as em.Group).children, action.payload.id),
        showChildren: true
      } as em.Group
    },
    paperProject: paperMain.project.exportJSON()
  }
  // update tweens
  //currentState = updateLayerTweens(currentState, action.payload.id);
  // select layer
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const addText = (state: LayerState, action: AddText): LayerState => {
  let currentState = state;
  const layerParent = action.payload.parent ? action.payload.parent : currentState.page;
  const paperLayer = getPaperLayer(action.payload.id);
  paperLayer.parent = getPaperLayer(layerParent);
  // add layer
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
    paperProject: paperMain.project.exportJSON()
  }
  // update tweens
  //currentState = updateLayerTweens(currentState, action.payload.id);
  // select layer
  return selectLayer(currentState, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const removeLayer = (state: LayerState, action: RemoveLayer): LayerState => {
  let currentState = state;
  const layer = state.byId[action.payload.id];
  const layersToRemove = getLayerAndAllChildren(state, action.payload.id);
  // check selected
  if (state.selected.includes(action.payload.id)) {
    currentState = layersToRemove.reduce((result, current) => {
      const tweensByDestinationLayer = getTweensByDestinationLayer(result, current);
      const tweensByLayer = getTweensByLayer(result, current);
      const layer = getLayer(result, current);
      if (layer.type === 'Artboard') {
        result = {
          ...result,
          artboards: removeItem(result.artboards, current)
        }
      }
      if (layer.id === result.activeArtboard) {
        result = setActiveArtboard(result, layerActions.setActiveArtboard({id: null, scope: 1}) as SetActiveArtboard);
      }
      if (tweensByDestinationLayer.allIds.length > 0) {
        result = tweensByDestinationLayer.allIds.reduce((tweenResult, tweenCurrent) => {
          return removeLayerTween(tweenResult, layerActions.removeLayerTween({id: tweenCurrent}) as RemoveLayerTween);
        }, result);
      }
      if (tweensByLayer.allIds.length > 0) {
        result = tweensByLayer.allIds.reduce((tweenResult, tweenCurrent) => {
          return removeLayerTween(tweenResult, layerActions.removeLayerTween({id: tweenCurrent}) as RemoveLayerTween);
        }, result);
      }
      if (layer.tweenEvents.length > 0) {
        result = layer.tweenEvents.reduce((tweenResult, tweenCurrent) => {
          return removeLayerTweenEvent(tweenResult, layerActions.removeLayerTweenEvent({id: tweenCurrent}) as RemoveLayerTweenEvent);
        }, result);
      }
      if (result.selected.includes(current)) {
        result = deselectLayer(result, layerActions.deselectLayer({id: current}) as DeselectLayer);
      }
      return result;
    }, currentState);
  }
  // check hover
  if (state.hover === action.payload.id) {
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
    paperProject: paperMain.project.exportJSON(),
    scope: currentState.scope.filter((id) => !layersToRemove.includes(id))
  }
};

export const removeLayers = (state: LayerState, action: RemoveLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return removeLayer(result, layerActions.removeLayer({id: current}) as RemoveLayer);
  }, state);
}

export const updateSelectionFrame = (state: LayerState, visibleHandles = 'all') => {
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
      strokeColor: '#009DEC',
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      //applyMatrix: false
    }
    const baseFrame = new paperMain.Path.Rectangle({
      from: selectionTopLeft,
      to: selectionBottomRight,
      strokeColor: '#009DEC',
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      //applyMatrix: false,
      data: {
        id: 'selectionFrameBase'
      }
    });
    const topLeftHandle = new paperMain.Path.Rectangle({
      ...baseProps,
      visible: visibleHandles === 'all' || visibleHandles === 'topLeft',
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
      visible: visibleHandles === 'all' || visibleHandles === 'topCenter',
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
      visible: visibleHandles === 'all' || visibleHandles === 'topRight',
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
      visible: visibleHandles === 'all' || visibleHandles === 'bottomLeft',
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
      visible: visibleHandles === 'all' || visibleHandles === 'bottomCenter',
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
      visible: visibleHandles === 'all' || visibleHandles === 'bottomRight',
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
      visible: visibleHandles === 'all' || visibleHandles === 'rightCenter',
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
      visible: visibleHandles === 'all' || visibleHandles === 'leftCenter',
      data: {
        id: 'selectionFrameHandle',
        handle: 'leftCenter'
      }
    });
    leftCenterHandle.position = baseFrame.bounds.leftCenter;
    leftCenterHandle.scaling.x = 1 / paperMain.view.zoom;
    leftCenterHandle.scaling.y = 1 / paperMain.view.zoom;
    const selectionFrame = new paperMain.Group({
      children: [baseFrame, topLeftHandle, topCenterHandle, topRightHandle, bottomLeftHandle, bottomCenterHandle, bottomRightHandle, leftCenterHandle, rightCenterHandle],
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
  if (layer.type === 'Artboard') {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: action.payload.id, scope: 1}) as SetActiveArtboard);
  }
  if (layerScopeRoot && currentState.byId[layerScopeRoot].type === 'Artboard' && layerScopeRoot !== currentState.activeArtboard) {
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: layerScopeRoot, scope: 1}) as SetActiveArtboard);
  }
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
  } else {
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
  updateSelectionFrame(currentState);
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
    strokeColor: '#009DEC',
    strokeWidth: 1,
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
  let stateWithChild;
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = getPaperLayer(action.payload.id);
  const childPaperLayer = getPaperLayer(action.payload.child);
  paperLayer.addChild(childPaperLayer);
  if (child.parent === action.payload.id) {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          showChildren: true,
          children: addItem(removeItem((state.byId[action.payload.id] as em.Group).children, action.payload.child), action.payload.child)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  } else {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [child.parent]: {
          ...state.byId[child.parent],
          children: removeItem((state.byId[child.parent] as em.Group).children, action.payload.child)
        } as em.Group,
        [action.payload.child]: {
          ...state.byId[action.payload.child],
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          showChildren: true,
          children: addItem((state.byId[action.payload.id] as em.Group).children, action.payload.child)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  }
  return selectLayer(stateWithChild, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
};

export const insertLayerChild = (state: LayerState, action: InsertLayerChild): LayerState => {
  let stateWithChild;
  const layer = state.byId[action.payload.id];
  const child = state.byId[action.payload.child];
  const paperLayer = getPaperLayer(action.payload.id);
  const childPaperLayer = getPaperLayer(action.payload.child);
  paperLayer.insertChild(action.payload.index, childPaperLayer);
  const updatedChildren = state.byId[action.payload.id].children.slice();
  updatedChildren.splice(action.payload.index, 0, action.payload.id);
  if (child.parent === action.payload.id) {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          children: insertItem(removeItem((state.byId[action.payload.id] as em.Group).children, action.payload.child), action.payload.child, action.payload.index)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  } else {
    stateWithChild = {
      ...state,
      byId: {
        ...state.byId,
        [child.parent]: {
          ...state.byId[child.parent],
          children: removeItem((state.byId[child.parent] as em.Group).children, action.payload.child)
        } as em.Group,
        [action.payload.child]: {
          ...state.byId[action.payload.child],
          parent: action.payload.id
        },
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          children: insertItem((state.byId[action.payload.id] as em.Group).children, action.payload.child, action.payload.index)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  }
  return selectLayer(stateWithChild, layerActions.selectLayer({id: action.payload.child, newSelection: true}) as SelectLayer);
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
  let stateWithMovedLayer;
  const layer = state.byId[action.payload.id];
  const above = state.byId[action.payload.above];
  const aboveParent = state.byId[above.parent] as em.Group;
  const aboveIndex = aboveParent.children.indexOf(action.payload.above);
  const paperLayer = getPaperLayer(action.payload.id);
  const abovePaperLayer = getPaperLayer(action.payload.above);
  paperLayer.insertAbove(abovePaperLayer);
  if (layer.parent !== above.parent) {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          parent: above.parent
        },
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id)
        } as em.Group,
        [above.parent]: {
          ...state.byId[above.parent],
          children: insertItem((state.byId[above.parent] as em.Group).children, action.payload.id, aboveIndex)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  } else {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: insertItem(removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id), action.payload.id, aboveIndex)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  }
  return selectLayer(stateWithMovedLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
};

export const insertLayerBelow = (state: LayerState, action: InsertLayerBelow): LayerState => {
  let stateWithMovedLayer;
  const layer = state.byId[action.payload.id];
  const below = state.byId[action.payload.below];
  const belowParent = state.byId[below.parent] as em.Group;
  const belowIndex = belowParent.children.indexOf(action.payload.below);
  const paperLayer = getPaperLayer(action.payload.id);
  const abovePaperLayer = getPaperLayer(action.payload.below);
  paperLayer.insertBelow(abovePaperLayer);
  if (layer.parent !== below.parent) {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [action.payload.id]: {
          ...state.byId[action.payload.id],
          parent: below.parent
        },
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id)
        } as em.Group,
        [below.parent]: {
          ...state.byId[below.parent],
          children: insertItem((state.byId[below.parent] as em.Group).children, action.payload.id, belowIndex + 1)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  } else {
    stateWithMovedLayer = {
      ...state,
      byId: {
        ...state.byId,
        [layer.parent]: {
          ...state.byId[layer.parent],
          children: insertItem(removeItem((state.byId[layer.parent] as em.Group).children, action.payload.id), action.payload.id, belowIndex + 1)
        } as em.Group
      },
      paperProject: paperMain.project.exportJSON()
    };
  }
  return selectLayer(stateWithMovedLayer, layerActions.selectLayer({id: action.payload.id, newSelection: true}) as SelectLayer);
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
  const topLayer = action.payload.layers.reduce((result, current) => {
    const layerDepth = getLayerDepth(state, current);
    const layerIndex = getLayerIndex(state, current);
    if (layerDepth < result.depth) {
      return {
        id: current,
        index: layerIndex,
        depth: layerDepth
      }
    } else if (layerDepth === result.depth) {
      if (layerIndex < result.index) {
        return {
          id: current,
          index: layerIndex,
          depth: layerDepth
        }
      } else {
        return result;
      }
    } else {
      return result;
    }
  }, {
    id: action.payload.layers[0],
    index: getLayerIndex(state, action.payload.layers[0]),
    depth: getLayerDepth(state, action.payload.layers[0])
  });
  const addGroup = addLayer(state, layerActions.addGroup({selected: true}) as AddGroup);
  const groupId = addGroup.allIds[addGroup.allIds.length - 1];
  const insertGroup = insertLayerAbove(addGroup, layerActions.insertLayerAbove({id: groupId, above: topLayer.id}) as InsertLayerAbove);
  const groupedLayers = action.payload.layers.reduce((result: LayerState, current: string) => {
    result = addLayerChild(result, layerActions.addLayerChild({id: groupId, child: current}) as AddLayerChild);
    return result;
  }, insertGroup);
  return selectLayer(groupedLayers, {payload: {id: groupId, newSelection: true}} as SelectLayer);
};

export const ungroupLayer = (state: LayerState, action: UngroupLayer): LayerState => {
  const layer = getLayer(state, action.payload.id);
  if (layer.type === 'Group') {
    const ungroupedChildren = layer.children.reduce((result: LayerState, current: string) => {
      return insertLayerAbove(result, layerActions.insertLayerAbove({id: current, above: layer.id}) as InsertLayerAbove);
    }, state);
    const selectedChildren = selectLayers(ungroupedChildren, layerActions.selectLayers({layers: layer.children, newSelection: true}) as SelectLayers);
    return removeLayer(selectedChildren, layerActions.removeLayer({id: layer.id}) as RemoveLayer);
  } else {
    return selectLayer(state, layerActions.selectLayer({id: layer.id, newSelection: true}) as SelectLayer);
  }
};

export const ungroupLayers = (state: LayerState, action: UngroupLayers): LayerState => {
  const newSelection: string[] = [];
  const ungroupedLayersState = action.payload.layers.reduce((result, current) => {
    const ungroupLayerState = ungroupLayer(result, layerActions.ungroupLayer({id: current}) as UngroupLayer);
    newSelection.push(...ungroupLayerState.selected);
    return ungroupLayerState;
  }, state);
  return selectLayers(ungroupedLayersState, layerActions.selectLayers({layers: newSelection, newSelection: true}) as SelectLayers);
};

const getClipboardLayerDescendants = (state: LayerState, id: string) => {
  const layer = state.byId[id];
  const paperLayer = getPaperLayer(id);
  const groups: string[] = [id];
  const clipboardLayerDescendants: {allIds: string[]; byId: {[id: string]: em.ClipboardLayer}} = {
    allIds: [id],
    byId: {
      [id]: {
        ...layer,
        paperLayer: paperLayer.exportJSON()
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
          paperLayer: childPaperLayer.exportJSON()
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

const getLayerCloneMap = (state: LayerState, id: string) => {
  const groups: string[] = [id];
  const layerCloneMap: {[id: string]: string} = {
    [id]: uuidv4()
  };
  let i = 0;
  while(i < groups.length) {
    const layer = state.clipboard.byId[groups[i]];
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.clipboard.byId[child];
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
  const paperLayer = paperMain.project.importJSON(state.clipboard.byId[id].paperLayer);
  const parentLayer = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  const paperParentLayer = getPaperLayer(parentLayer.id);
  const paperLayerClone = paperLayer.clone({deep: false, insert: true});
  if (paperLayer.data.type === 'Artboard') {
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
  paperLayerClone.data.id = layerCloneMap[id];
  paperLayerClone.parent = paperParentLayer;
  const groups: string[] = [id];
  let i = 0;
  while(i < groups.length) {
    const layer = state.clipboard.byId[groups[i]];
    const groupClonePaperLayer = getPaperLayer(layerCloneMap[layer.id]);
    if (layer.children) {
      layer.children.forEach((child) => {
        const childLayer = state.clipboard.byId[child];
        const childPaperLayer = paperMain.project.importJSON(childLayer.paperLayer);
        const childPaperLayerClone = childPaperLayer.clone({deep: false, insert: true});
        childPaperLayerClone.data.id = layerCloneMap[child];
        childPaperLayerClone.parent = groupClonePaperLayer;
        if (childPaperLayer.data.type === 'Shape') {
          applyShapeMethods(childPaperLayerClone);
        }
        if (childPaperLayer.data.type === 'Text') {
          applyTextMethods(childPaperLayerClone);
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
  const rootLayer = state.clipboard.byId[id];
  const rootParent = getLayer(state, state.scope.length > 0 ? state.scope[state.scope.length - 1] : state.page);
  return Object.keys(layerCloneMap).reduce((result: any, key: string, index: number) => {
    const layer = state.clipboard.byId[key];
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

export const pasteLayerFromClipboard = (state: LayerState, id: string, pasteOverSelection?: boolean): LayerState => {
  let currentState = state;
  const clonedLayerAndChildren = cloneLayerAndChildren(currentState, id);
  const rootLayer = clonedLayerAndChildren.byId[clonedLayerAndChildren.allIds[0]];
  currentState = clonedLayerAndChildren.allIds.reduce((result: LayerState, current: string, index: number) => {
    const layer = clonedLayerAndChildren.byId[current];
    const layerParent = getLayer(result, layer.parent);
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
      paperProject: paperMain.project.exportJSON()
    }
  }, currentState);
  currentState = selectLayer(currentState, layerActions.selectLayer({id: rootLayer.id}) as SelectLayer);
  if (rootLayer.type === 'Artboard') {
    const paperLayer = getPaperLayer(rootLayer.id);
    currentState = {
      ...currentState,
      artboards: addItem(currentState.artboards, rootLayer.id)
    }
    currentState = setActiveArtboard(currentState, layerActions.setActiveArtboard({id: rootLayer.id, scope: 1}) as SetActiveArtboard);
    paperLayer.position.x += paperLayer.bounds.width + 48;
    currentState = moveLayerBy(currentState, layerActions.moveLayerBy({id: rootLayer.id, x: paperLayer.bounds.width + 48, y: 0}) as MoveLayerBy);
  }
  if (pasteOverSelection && state.selected.length > 0) {
    const selectionCenter = getSelectionCenter(state);
    const clipboardCenter = getClipboardCenter(state);
    currentState = clonedLayerAndChildren.allIds.reduce((result: LayerState, current: string) => {
      const paperLayer = getPaperLayer(current);
      const paperLayerCenter = paperLayer.position;
      paperLayer.position.x = selectionCenter.x + (paperLayerCenter.x - clipboardCenter.x);
      paperLayer.position.y = selectionCenter.y + (paperLayerCenter.y - clipboardCenter.y);
      return moveLayerTo(result, layerActions.moveLayerTo({id: current, x: paperLayer.position.x, y: paperLayer.position.y}) as MoveLayerTo);
    }, currentState);
  }
  return currentState;
};

export const pasteLayersFromClipboard = (state: LayerState, action: PasteLayersFromClipboard): LayerState => {
  if (state.clipboard.allIds.length > 0) {
    const selectionBeforePaste = state.selected;
    const stateWithPastedLayers = state.clipboard.main.reduce((result: LayerState, current: string) => {
      return pasteLayerFromClipboard(result, current, action.payload.overSelection);
    }, state);
    if (selectionBeforePaste.length > 0) {
      return deselectLayers(stateWithPastedLayers, layerActions.deselectLayers({layers: selectionBeforePaste}) as DeselectLayers);
    } else {
      return stateWithPastedLayers;
    }
  } else {
    return state;
  }
};

export const updateParentBounds = (state: LayerState, id: string): LayerState => {
  const layerScope = getLayerScope(state, id);
  return layerScope.reduce((result, current) => {
    const paperLayer = getPaperLayer(current);
    return {
      ...result,
      byId: {
        ...result.byId,
        [current]: {
          ...result.byId[current],
          frame: {
            ...result.byId[current].frame,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          }
        }
      },
      paperProject: paperMain.project.exportJSON()
    }
  }, state);
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
  }
  //currentState = updateLayerTweens(currentState, action.payload.id);
  return updateParentBounds(currentState, action.payload.id);
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
  return updateLayerTweens(currentState, action.payload.id);
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
  const artboardChildren = getAllLayerChildren(state, action.payload.artboard);
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
      [action.payload.id]: action.payload
    },
    paperProject: paperMain.project.exportJSON()
  }
  // add animation event tweens
  return artboardChildren.reduce((result, current) => {
    return addTweenEventLayerTweens(result, action.payload.id, current);
  }, currentState);
};

export const addTweenEventLayerTweens = (state: LayerState, eventId: string, layerId: string): LayerState => {
  let currentState = state;
  const tweenEvent = currentState.tweenEventById[eventId];
  const artboardPaperLayer = getPaperLayer(tweenEvent.artboard);
  const destinationArtboardChildren = getAllLayerChildren(currentState, tweenEvent.destinationArtboard);
  const destinationArtboardPaperLayer = getPaperLayer(tweenEvent.destinationArtboard);
  const destinationEquivalent = getDestinationEquivalent(currentState, layerId, destinationArtboardChildren);
  if (destinationEquivalent) {
    const currentPaperLayer = getPaperLayer(layerId);
    const equivalentPaperLayer = getPaperLayer(destinationEquivalent.id);
    const equivalentTweenProps = getEquivalentTweenProps(currentPaperLayer, equivalentPaperLayer, artboardPaperLayer, destinationArtboardPaperLayer);
    currentState = Object.keys(equivalentTweenProps).reduce((result, key: em.TweenPropTypes) => {
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
    paperProject: paperMain.project.exportJSON()
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
      [action.payload.id]: action.payload
    },
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
          const artboardChildren = getAllLayerChildren(currentState, tweenEvent.artboard);
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
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
          verticalFlip: true
        }
      }
    },
    paperProject: paperMain.project.exportJSON()
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const enableLayerFill = (state: LayerState, action: EnableLayerFill): LayerState => {
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
            enabled: true
          }
        }
      }
    },
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const disableLayerFill = (state: LayerState, action: DisableLayerFill): LayerState => {
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
            enabled: false
          }
        }
      }
    },
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerFillColor = (state: LayerState, action: SetLayerFillColor): LayerState => {
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
            color: action.payload.fillColor
          }
        }
      }
    },
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const enableLayerStroke = (state: LayerState, action: EnableLayerStroke): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const disableLayerStroke = (state: LayerState, action: DisableLayerStroke): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerStrokeColor = (state: LayerState, action: SetLayerStrokeColor): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerStrokeWidth = (state: LayerState, action: SetLayerStrokeWidth): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerStrokeCap = (state: LayerState, action: SetLayerStrokeCap): LayerState => {
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
            cap: action.payload.strokeCap
          }
        }
      }
    },
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerStrokeJoin = (state: LayerState, action: SetLayerStrokeJoin): LayerState => {
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
            join: action.payload.strokeJoin
          }
        }
      }
    },
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerStrokeDashArray = (state: LayerState, action: SetLayerStrokeDashArray): LayerState => {
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
            dashArray: action.payload.strokeDashArray
          }
        }
      }
    },
    paperProject: paperMain.project.exportJSON()
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const enableLayerShadow = (state: LayerState, action: EnableLayerShadow): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const disableLayerShadow = (state: LayerState, action: DisableLayerShadow): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerShadowColor = (state: LayerState, action: SetLayerShadowColor): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerShadowBlur = (state: LayerState, action: SetLayerShadowBlur): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerShadowXOffset = (state: LayerState, action: SetLayerShadowXOffset): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};

export const setLayerShadowYOffset = (state: LayerState, action: SetLayerShadowYOffset): LayerState => {
  let currentState = state;
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
    paperProject: paperMain.project.exportJSON()
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
      size: new paperMain.Size(16,16)
    }));
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          frame: {
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          },
          pathData: clone.pathData,
          style: {
            ...currentState.byId[action.payload.id].style,
            horizontalFlip: action.payload.horizontalFlip ? !currentState.byId[action.payload.id].style.horizontalFlip : currentState.byId[action.payload.id].style.horizontalFlip,
            verticalFlip: action.payload.verticalFlip ? !currentState.byId[action.payload.id].style.verticalFlip : currentState.byId[action.payload.id].style.verticalFlip
          }
        } as em.Shape
      },
      paperProject: paperMain.project.exportJSON()
    }
  } else {
    currentState = {
      ...currentState,
      byId: {
        ...currentState.byId,
        [action.payload.id]: {
          ...currentState.byId[action.payload.id],
          frame: {
            x: paperLayer.position.x,
            y: paperLayer.position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height
          },
          style: {
            ...currentState.byId[action.payload.id].style,
            horizontalFlip: action.payload.horizontalFlip ? !currentState.byId[action.payload.id].style.horizontalFlip : currentState.byId[action.payload.id].style.horizontalFlip,
            verticalFlip: action.payload.verticalFlip ? !currentState.byId[action.payload.id].style.verticalFlip : currentState.byId[action.payload.id].style.verticalFlip
          }
        }
      },
      paperProject: paperMain.project.exportJSON()
    }
  }
  return updateParentBounds(currentState, action.payload.id);
};

export const resizeLayers = (state: LayerState, action: ResizeLayers): LayerState => {
  return action.payload.layers.reduce((result, current) => {
    return resizeLayer(result, layerActions.resizeLayer({id: current, verticalFlip: action.payload.verticalFlip, horizontalFlip: action.payload.horizontalFlip}) as ResizeLayerBy);
  }, state);
};

export const setLayerText = (state: LayerState, action: SetLayerText): LayerState => {
  let currentState = state;
  const paperLayer = getPaperLayer(action.payload.id) as paper.PointText;
  paperLayer.content = action.payload.text;
  currentState = {
    ...currentState,
    byId: {
      ...currentState.byId,
      [action.payload.id]: {
        ...currentState.byId[action.payload.id],
        text: action.payload.text
      }
    },
    paperProject: paperMain.project.exportJSON()
  }
  return currentState;
};