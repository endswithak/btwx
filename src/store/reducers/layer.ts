import {
  ADD_PAGE,
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
  MOVE_LAYER_TO,
  MOVE_LAYER_BY,
  MOVE_LAYERS_TO,
  MOVE_LAYERS_BY,
  ENABLE_LAYER_DRAG,
  DISABLE_LAYER_DRAG,
  LayerTypes
} from '../actionTypes/layer';

import {
  addPage,
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
  moveLayerTo,
  moveLayerBy,
  moveLayersTo,
  moveLayersBy,
  ungroupLayers,
  enableLayerDrag,
  disableLayerDrag
} from '../utils/layer';

export interface LayerState {
  byId: {
    [id: string]: em.Page | em.Group | em.Shape;
  };
  allIds: string[];
  page: string;
  selected: string[];
  scope: string[];
  hover: string;
  clipboard: {
    main: string[];
    allIds: string[];
    byId: {
      [id: string]: em.ClipboardLayer;
    };
  };
  dragging: boolean;
}

const initialState: LayerState = {
  byId: {},
  allIds: [],
  page: null,
  selected: [],
  scope: [],
  hover: null,
  clipboard: {
    main: [],
    allIds: [],
    byId: {}
  },
  dragging: false
};

export default (state = initialState, action: LayerTypes): LayerState => {
  switch (action.type) {
    case ADD_PAGE:
      return addPage(state, action);
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
    case MOVE_LAYER_TO:
      return moveLayerTo(state, action);
    case MOVE_LAYERS_TO:
      return moveLayersTo(state, action);
    case MOVE_LAYER_BY:
      return moveLayerBy(state, action);
    case MOVE_LAYERS_BY:
      return moveLayersBy(state, action);
    case ENABLE_LAYER_DRAG:
      return enableLayerDrag(state, action);
    case DISABLE_LAYER_DRAG:
      return disableLayerDrag(state, action);
    default:
      return state;
  }
}