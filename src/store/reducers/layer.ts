import {
  ADD_PAGE,
  ADD_ARTBOARD,
  ADD_GROUP,
  ADD_SHAPE,
  REMOVE_LAYER,
  REMOVE_LAYERS,
  SELECT_LAYER,
  DEEP_SELECT_LAYER,
  SELECT_LAYERS,
  DESELECT_LAYER,
  DESELECT_LAYERS,
  DESELECT_ALL_LAYERS,
  SET_LAYER_HOVER,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  SHOW_LAYER_CHILDREN,
  HIDE_LAYER_CHILDREN,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  INCREASE_LAYER_SCOPE,
  DECREASE_LAYER_SCOPE,
  CLEAR_LAYER_SCOPE,
  NEW_LAYER_SCOPE,
  ESCAPE_LAYER_SCOPE,
  GROUP_LAYERS,
  UNGROUP_LAYER,
  UNGROUP_LAYERS,
  COPY_LAYER_TO_CLIPBOARD,
  COPY_LAYERS_TO_CLIPBOARD,
  PASTE_LAYERS_FROM_CLIPBOARD,
  MOVE_LAYER,
  MOVE_LAYERS,
  MOVE_LAYER_TO,
  MOVE_LAYER_BY,
  MOVE_LAYERS_TO,
  MOVE_LAYERS_BY,
  SET_LAYER_NAME,
  SET_ACTIVE_ARTBOARD,
  ADD_LAYER_TWEEN_EVENT,
  REMOVE_LAYER_TWEEN_EVENT,
  ADD_LAYER_TWEEN,
  REMOVE_LAYER_TWEEN,
  SET_LAYER_TWEEN_DURATION,
  INCREMENT_LAYER_TWEEN_DURATION,
  DECREMENT_LAYER_TWEEN_DURATION,
  SET_LAYER_TWEEN_DELAY,
  INCREMENT_LAYER_TWEEN_DELAY,
  DECREMENT_LAYER_TWEEN_DELAY,
  SET_LAYER_TWEEN_EASE,
  SET_LAYER_TWEEN_POWER,
  LayerTypes
} from '../actionTypes/layer';

import {
  addPage,
  addArtboard,
  addLayer,
  removeLayer,
  removeLayers,
  selectLayer,
  deepSelectLayer,
  selectLayers,
  deselectLayer,
  deselectLayers,
  deselectAllLayers,
  setLayerHover,
  addLayerChild,
  insertLayerChild,
  showLayerChildren,
  hideLayerChildren,
  insertLayerAbove,
  insertLayerBelow,
  increaseLayerScope,
  decreaseLayerScope,
  newLayerScope,
  clearLayerScope,
  escapeLayerScope,
  groupLayers,
  ungroupLayer,
  copyLayerToClipboard,
  copyLayersToClipboard,
  pasteLayersFromClipboard,
  moveLayer,
  moveLayers,
  moveLayerTo,
  moveLayerBy,
  moveLayersTo,
  moveLayersBy,
  ungroupLayers,
  setActiveArtboard,
  addLayerTweenEvent,
  removeLayerTweenEvent,
  addLayerTween,
  removeLayerTween,
  setLayerName,
  setLayerTweenDuration,
  incrementLayerTweenDuration,
  decrementLayerTweenDuration,
  setLayerTweenDelay,
  incrementLayerTweenDelay,
  decrementLayerTweenDelay,
  setLayerTweenEase,
  setLayerTweenPower
} from '../utils/layer';

export interface LayerState {
  byId: {
    [id: string]: em.Page | em.Group | em.Shape | em.Artboard | em.ArtboardBackground;
  };
  allIds: string[];
  page: string;
  activeArtboard: string;
  selected: string[];
  artboards: string[];
  scope: string[];
  hover: string;
  clipboard: {
    main: string[];
    allIds: string[];
    byId: {
      [id: string]: em.ClipboardLayer;
    };
  };
  paperProject: string;
  allTweenEventIds: string[];
  tweenEventById: {
    [id: string]: em.TweenEvent;
  };
  allTweenIds: string[];
  tweenById: {
    [id: string]: em.Tween;
  };
}

const initialState: LayerState = {
  byId: {},
  allIds: [],
  page: null,
  activeArtboard: null,
  selected: [],
  artboards: [],
  scope: [],
  hover: null,
  clipboard: {
    main: [],
    allIds: [],
    byId: {}
  },
  paperProject: null,
  allTweenEventIds: [],
  tweenEventById: {},
  allTweenIds: [],
  tweenById: {}
};

export default (state = initialState, action: LayerTypes): LayerState => {
  switch (action.type) {
    case ADD_PAGE:
      return addPage(state, action);
    case ADD_ARTBOARD:
      return addArtboard(state, action);
    case ADD_GROUP:
    case ADD_SHAPE:
      return addLayer(state, action);
    case REMOVE_LAYER:
      return removeLayer(state, action);
    case REMOVE_LAYERS:
      return removeLayers(state, action);
    case SELECT_LAYER:
      return selectLayer(state, action);
    case DEEP_SELECT_LAYER:
      return deepSelectLayer(state, action);
    case SELECT_LAYERS:
      return selectLayers(state, action);
    case DESELECT_LAYER:
      return deselectLayer(state, action);
    case DESELECT_LAYERS:
      return deselectLayers(state, action);
    case DESELECT_ALL_LAYERS:
      return deselectAllLayers(state, action);
    case SET_LAYER_HOVER:
      return setLayerHover(state, action);
    case ADD_LAYER_CHILD:
      return addLayerChild(state, action);
    case INSERT_LAYER_CHILD:
      return insertLayerChild(state, action);
    case SHOW_LAYER_CHILDREN:
      return showLayerChildren(state, action);
    case HIDE_LAYER_CHILDREN:
      return hideLayerChildren(state, action);
    case INSERT_LAYER_ABOVE:
      return insertLayerAbove(state, action);
    case INSERT_LAYER_BELOW:
      return insertLayerBelow(state, action);
    case INCREASE_LAYER_SCOPE:
      return increaseLayerScope(state, action);
    case DECREASE_LAYER_SCOPE:
      return decreaseLayerScope(state, action);
    case NEW_LAYER_SCOPE:
      return newLayerScope(state, action);
    case CLEAR_LAYER_SCOPE:
      return clearLayerScope(state, action);
    case ESCAPE_LAYER_SCOPE:
      return escapeLayerScope(state, action);
    case GROUP_LAYERS:
      return groupLayers(state, action);
    case UNGROUP_LAYER:
      return ungroupLayer(state, action);
    case UNGROUP_LAYERS:
      return ungroupLayers(state, action);
    case COPY_LAYER_TO_CLIPBOARD:
      return copyLayerToClipboard(state, action);
    case COPY_LAYERS_TO_CLIPBOARD:
      return copyLayersToClipboard(state, action);
    case PASTE_LAYERS_FROM_CLIPBOARD:
      return pasteLayersFromClipboard(state, action);
    case MOVE_LAYER:
      return moveLayer(state, action);
    case MOVE_LAYERS:
      return moveLayers(state, action);
    case MOVE_LAYER_TO:
      return moveLayerTo(state, action);
    case MOVE_LAYERS_TO:
      return moveLayersTo(state, action);
    case MOVE_LAYER_BY:
      return moveLayerBy(state, action);
    case MOVE_LAYERS_BY:
      return moveLayersBy(state, action);
    case SET_LAYER_NAME:
      return setLayerName(state, action);
    case SET_ACTIVE_ARTBOARD:
      return setActiveArtboard(state, action);
    case ADD_LAYER_TWEEN_EVENT:
      return addLayerTweenEvent(state, action);
    case REMOVE_LAYER_TWEEN_EVENT:
      return removeLayerTweenEvent(state, action);
    case ADD_LAYER_TWEEN:
      return addLayerTween(state, action);
    case REMOVE_LAYER_TWEEN:
      return removeLayerTween(state, action);
    case SET_LAYER_TWEEN_DURATION:
      return setLayerTweenDuration(state, action);
    case INCREMENT_LAYER_TWEEN_DURATION:
      return incrementLayerTweenDuration(state, action);
    case DECREMENT_LAYER_TWEEN_DURATION:
      return decrementLayerTweenDuration(state, action);
    case SET_LAYER_TWEEN_DELAY:
      return setLayerTweenDelay(state, action);
    case INCREMENT_LAYER_TWEEN_DELAY:
      return incrementLayerTweenDelay(state, action);
    case DECREMENT_LAYER_TWEEN_DELAY:
      return decrementLayerTweenDelay(state, action);
    case SET_LAYER_TWEEN_EASE:
      return setLayerTweenEase(state, action);
    case SET_LAYER_TWEEN_POWER:
      return setLayerTweenPower(state, action);
    default:
      return state;
  }
}