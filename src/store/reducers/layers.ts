import paper from 'paper';
import {
  ADD_SHAPE,
  ADD_PAGE,
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  CLEAR_SELECTION,
  NEW_SELECTION,
  LayersTypes
} from '../actionTypes/layers';
import LayerNode from '../../canvas/base/layerNode';
import FillNode from '../../canvas/base/fillNode';
import ShapeNode from '../../canvas/base/shapeNode';
import StyleGroupNode from '../../canvas/base/styleGroupNode';
import StyleNode from '../../canvas/base/styleNode';

export interface LayersState {
  activePage: string;
  selection: string[];
  layerById: {
    [id: string]: LayerNode | StyleNode | ShapeNode | FillNode | StyleGroupNode;
  };
  paperLayers: {
    [id: string]: paper.Item;
  };
  allIds: string[];
}

const initialState: LayersState = {
  activePage: null,
  selection: [],
  layerById: {},
  paperLayers: {},
  allIds: []
};

export default (state = initialState, action: LayersTypes): LayersState => {
  switch (action.type) {
    case ADD_PAGE: {
      // create shape node
      const page = new LayerNode({
        parent: null,
        layerType: 'Page'
      });
      // create paper layer
      const paperPage = new paper.Group({
        data: {
          id: page.id,
          layerId: page.id
        }
      });
      return {
        ...state,
        activePage: page.id,
        layerById: {
          ...state.layerById,
          [page.id]: page
        },
        allIds: [...state.allIds, page.id],
        paperLayers: {
          ...state.paperLayers,
          [page.id]: paperPage
        }
      };
    }
    case ADD_SHAPE: {
      // create shape node
      const shape = new ShapeNode({
        parent: action.payload.parent ? action.payload.parent : state.activePage,
        shapeType: action.payload.shapeType,
        name: action.payload.name
      });
      // update parnet with new shape
      state.layerById[shape.parent].children.push(shape.id);
      // create fill group
      const fillGroup = new StyleGroupNode({
        styleGroupType: 'Fills',
        parent: shape.id
      });
      shape.fills = fillGroup.id;
      // create new fill
      const fill = new FillNode({
        fillType: 'Color',
        parent: fillGroup.id
      });
      fillGroup.children.push(fill.id);
      // create paper layer
      const paperLayer = new paper.Group({
        parent: state.paperLayers[shape.parent],
        data: {
          id: shape.id,
          layerId: shape.id
        }
      });
      // create paper fill group layer
      const paperFillGroup = new paper.Group({
        parent: paperLayer,
        data: {
          id: fillGroup.id,
          layerId: shape.id
        }
      });
      // create fill paper item
      const paperFill = action.payload.paperShape.clone() as paper.Path | paper.CompoundPath;
      paperFill.fillColor = new paper.Color(fill.color);
      paperFill.data = {
        id: fill.id,
        layerId: shape.id
      };
      paperFill.parent = paperFillGroup;
      return {
        ...state,
        layerById: {
          ...state.layerById,
          [shape.id]: shape,
          [fillGroup.id]: fillGroup,
          [fill.id]: fill
        },
        paperLayers: {
          ...state.paperLayers,
          [shape.id]: paperLayer,
          [fillGroup.id]: paperFillGroup,
          [fill.id]: paperFill,
          [`[shape]${[shape.id]}`]: action.payload.paperShape
        },
        allIds: [...state.allIds, shape.id, fillGroup.id, fill.id]
      };
    }
    case ADD_TO_SELECTION: {
      (state.layerById[action.payload.id] as LayerNode).selected = true;
      (state.paperLayers[action.payload.id] as paper.Item).selected = true;
      return {
        ...state,
        selection: [...state.selection, action.payload.id]
      };
    }
    case REMOVE_FROM_SELECTION: {
      (state.layerById[action.payload.id] as LayerNode).selected = false;
      (state.paperLayers[action.payload.id] as paper.Item).selected = false;
      return {
        ...state,
        selection: state.selection.filter((id) => id !== action.payload.id)
      };
    }
    case CLEAR_SELECTION: {
      state.selection.forEach((id) => {
        (state.layerById[id] as LayerNode).selected = false;
        (state.paperLayers[id] as paper.Item).selected = false;
      });
      return {
        ...state,
        selection: []
      };
    }
    case NEW_SELECTION: {
      state.selection.forEach((id) => {
        (state.layerById[id] as LayerNode).selected = false;
        (state.paperLayers[id] as paper.Item).selected = false;
      });
      (state.layerById[action.payload.id] as LayerNode).selected = true;
      (state.paperLayers[action.payload.id] as paper.Item).selected = true;
      return {
        ...state,
        selection: [action.payload.id]
      };
    }
    default:
      return state;
  }
}
