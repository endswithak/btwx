import {
  ADD_PAGE,
  ADD_GROUP,
  ADD_SHAPE,
  REMOVE_LAYER,
  SELECT_LAYER,
  DESELECT_LAYER,
  ENABLE_LAYER_HOVER,
  DISABLE_LAYER_HOVER,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  EXPAND_LAYER,
  COLLAPSE_LAYER,
  LayerTypes
} from '../actionTypes/layer';

import {
  addPage,
  addLayer,
  removeLayer,
  selectLayer,
  deselectLayer,
  enableLayerHover,
  disableLayerHover,
  addLayerChild,
  insertLayerChild,
  insertLayerAbove,
  insertLayerBelow,
  expandLayer,
  collapseLayer
} from '../utils/layer';

export interface LayerState {
  byId: {
    [id: string]: em.Page | em.Group | em.Shape;
  };
  allIds: string[];
  activePage: string;
}

const initialState: LayerState = {
  byId: {},
  allIds: [],
  activePage: null
};

export default (state = initialState, action: LayerTypes): LayerState => {
  switch (action.type) {
    case ADD_PAGE:
      return addPage(state, action) as LayerState;
    case ADD_GROUP:
    case ADD_SHAPE:
      return addLayer(state, action) as LayerState;
    case REMOVE_LAYER:
      return removeLayer(state, action) as LayerState;
    case SELECT_LAYER:
      return selectLayer(state, action) as LayerState;
    case DESELECT_LAYER:
      return deselectLayer(state, action) as LayerState;
    case ENABLE_LAYER_HOVER:
      return enableLayerHover(state, action) as LayerState;
    case DISABLE_LAYER_HOVER:
      return disableLayerHover(state, action) as LayerState;
    case ADD_LAYER_CHILD:
      return addLayerChild(state, action) as LayerState;
    case INSERT_LAYER_CHILD:
      return insertLayerChild(state, action) as LayerState;
    case INSERT_LAYER_ABOVE:
      return insertLayerAbove(state, action) as LayerState;
    case INSERT_LAYER_BELOW:
      return insertLayerBelow(state, action) as LayerState;
    case EXPAND_LAYER:
      return expandLayer(state, action) as LayerState;
    case COLLAPSE_LAYER:
      return collapseLayer(state, action) as LayerState;
    default:
      return state;
  }
}