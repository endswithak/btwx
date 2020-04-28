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
  HOVER_ENTER,
  HOVER_LEAVE,
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
  deselectLayer,
  hoverEnter,
  hoverLeave
} from '../utils/layers';

export interface LayersState {
  layerById: {
    [id: string]: em.Shape | em.Group | em.Page;
  };
  allIds: string[];
}

const initialState: LayersState = {
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
    case HOVER_ENTER:
      return hoverEnter(state, action);
    case HOVER_LEAVE:
      return hoverLeave(state, action);
    default:
      return state;
  }
}