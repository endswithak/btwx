import {
  ADD_PAGE,
  ADD_GROUP,
  ADD_SHAPE,
  REMOVE_LAYER,
  REMOVE_LAYERS,
  SELECT_LAYER,
  DESELECT_LAYER,
  DESELECT_ALL_LAYERS,
  ENABLE_LAYER_HOVER,
  DISABLE_LAYER_HOVER,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  EXPAND_LAYER,
  COLLAPSE_LAYER,
  GROUP_LAYERS,
  UNGROUP_LAYER,
  UNGROUP_LAYERS,
  SET_GROUP_SCOPE,
  LayerTypes
} from '../actionTypes/layer';

import {
  addPage,
  addLayer,
  removeLayer,
  removeLayers,
  selectLayer,
  deselectLayer,
  deselectAllLayers,
  enableLayerHover,
  disableLayerHover,
  addLayerChild,
  insertLayerChild,
  insertLayerAbove,
  insertLayerBelow,
  expandLayer,
  collapseLayer,
  groupLayers,
  ungroupLayer,
  ungroupLayers,
  setGroupScope
} from '../utils/layer';

export interface LayerState {
  byId: {
    [id: string]: em.Page | em.Group | em.Shape;
  };
  allIds: string[];
  activePage: string;
  selected: string[];
  groupScope: string;
}

const initialState: LayerState = {
  byId: {},
  allIds: [],
  activePage: null,
  selected: [],
  groupScope: null
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
    case DESELECT_LAYER:
      return deselectLayer(state, action);
    case DESELECT_ALL_LAYERS:
      return deselectAllLayers(state, action);
    case ENABLE_LAYER_HOVER:
      return enableLayerHover(state, action);
    case DISABLE_LAYER_HOVER:
      return disableLayerHover(state, action);
    case ADD_LAYER_CHILD:
      return addLayerChild(state, action);
    case INSERT_LAYER_CHILD:
      return insertLayerChild(state, action);
    case INSERT_LAYER_ABOVE:
      return insertLayerAbove(state, action);
    case INSERT_LAYER_BELOW:
      return insertLayerBelow(state, action);
    case EXPAND_LAYER:
      return expandLayer(state, action);
    case COLLAPSE_LAYER:
      return collapseLayer(state, action);
    case GROUP_LAYERS:
      return groupLayers(state, action);
    case UNGROUP_LAYER:
      return ungroupLayer(state, action);
    case UNGROUP_LAYERS:
      return ungroupLayers(state, action);
    case SET_GROUP_SCOPE:
      return setGroupScope(state, action);
    default:
      return state;
  }
}