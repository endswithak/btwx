import {
  ADD_SHAPE,
  ADD_GROUP,
  ADD_PAGE,
  REMOVE_LAYER,
  INSERT_CHILD,
  INSERT_ABOVE,
  INSERT_BELOW,
  EXPAND_GROUP,
  COLLAPSE_GROUP,
  SELECT_LAYER,
  DESELECT_LAYER,
  LayersTypes
} from '../actionTypes/layers';

import {
  addShape,
  addGroup,
  addPage,
  removeLayer,
  insertChild,
  insertAbove,
  insertBelow,
  expandGroup,
  collapseGroup,
  selectLayer,
  deselectLayer
} from '../utils/layers';

export interface LayersState {
  activePage: string;
  activeGroup: string;
  layerById: {
    [id: string]: em.Shape | em.Group | em.Page;
  };
  allIds: string[];
}

const initialState: LayersState = {
  activePage: null,
  activeGroup: null,
  layerById: {},
  allIds: []
};

export default (state = initialState, action: LayersTypes): LayersState => {
  switch (action.type) {
    case ADD_SHAPE:
      return addShape(state, action);
    case ADD_GROUP:
      return addGroup(state, action);
    case ADD_PAGE:
      return addPage(state, action);
    case REMOVE_LAYER:
      return removeLayer(state, action);
    case INSERT_CHILD:
      return insertChild(state, action);
    case INSERT_ABOVE:
      return insertAbove(state, action);
    case INSERT_BELOW:
      return insertBelow(state, action);
    case EXPAND_GROUP:
      return expandGroup(state, action);
    case COLLAPSE_GROUP:
      return collapseGroup(state, action);
    case SELECT_LAYER:
      return selectLayer(state, action);
    case DESELECT_LAYER:
      return deselectLayer(state, action);
    default:
      return state;
  }
}