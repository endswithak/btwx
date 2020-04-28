import paper from 'paper';
import { v4 as uuidv4 } from 'uuid';

import {
  ADD_SHAPE,
  REMOVE_SHAPE,
  SELECT_SHAPE,
  DESELECT_SHAPE,
  ENABLE_SHAPE_HOVER,
  DISABLE_SHAPE_HOVER,
  ShapeTypes
} from '../actionTypes/shape';

import {
  selectLayer,
  deselectLayer,
  removeLayer,
  enableLayerHover,
  disableLayerHover
} from '../utils/layer';

export interface ShapeState {
  byId: {
    [id: string]: em.Shape;
  };
  allIds: string[];
}

const initialState: ShapeState = {
  byId: {},
  allIds: []
};

export default (state = initialState, action: ShapeTypes): ShapeState => {
  switch (action.type) {
    case ADD_SHAPE: {
      const shapeId = uuidv4();
      // const layerParentId = action.payload.parent ? action.payload.parent : state.activePage;
      // const paperParentId = state.layerById[layerParentId].paperLayer;
      // const paperParentLayer = paper.project.getItem({id: paperParentId});
      // action.payload.paperShape.parent = paperParentLayer;
      // action.payload.paperShape.onMouseEnter = (e: paper.MouseEvent) => {
      //   store.dispatch(setHoverLayer(shapeId));
      // }
      // action.payload.paperShape.onMouseLeave = () => {
      //   store.dispatch(clearHoverLayer());
      // }
      return {
        ...state,
        allIds: [...state.allIds, shapeId],
        byId: {
          ...state.byId,
          [shapeId]: {
            type: 'Shape',
            shapeType: action.payload.shapeType,
            id: shapeId,
            name: action.payload.name ? action.payload.name : action.payload.shapeType,
            parent: action.payload.parent,
            paperLayer: action.payload.paperShape.id,
            selected: false,
            children: null,
            hover: false
          }
        }
      };
    }
    case REMOVE_SHAPE:
      return removeLayer(state, action) as ShapeState;
    case SELECT_SHAPE:
      return selectLayer(state, action) as ShapeState;
    case DESELECT_SHAPE:
      return deselectLayer(state, action) as ShapeState;
    case ENABLE_SHAPE_HOVER:
      return enableLayerHover(state, action) as ShapeState;
    case DISABLE_SHAPE_HOVER:
      return disableLayerHover(state, action) as ShapeState;
    default:
      return state;
  }
}