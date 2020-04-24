import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';
import {
  ADD_LAYER,
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
  layerById: {
    [id: string]: LayerNode | StyleNode | ShapeNode | FillNode | StyleGroupNode;
  };
  allIds: string[];
  selection: string[];
}

const initialState: LayersState = {
  activePage: null,
  layerById: {},
  allIds: [],
  selection: []
};

interface Layer {
  type: 'Page' | 'Group' | 'Shape' | 'Artboard';
  id: string;
  name: string;
  parent: string;
  paperLayer: number;
  paperParent: number;
  children: number[];
  fillsContainer: string;
  fills: string[];
}

export default (state = initialState, action: LayersTypes): LayersState => {
  switch (action.type) {
    case ADD_LAYER: {
      const layerId = uuidv4();
      const fillsId = uuidv4();
      const layerParentId = action.payload.parent ? action.payload.parent : state.activePage;
      const paperParentId = state.layerById[layerParentId].paper;
      const paperParentLayer = paper.project.getItem({id: paperParentId});
      const paperLayer = new paper.Layer({
        parent: paperParentLayer,
        data: {
          id: layerId,
          layerId: layerId
        }
      });
      const fillsContainer = new paper.Group({
        parent: paperLayer,
        data: {
          id: fillsId,
          layerId: layerId
        }
      });
      const layer: Layer = {
        type: action.payload.type,
        id: layerId,
        name: action.payload.name ? action.payload.name : action.payload.type,
        parent: layerParentId,
        paperParent: state.layerById[layerParentId].paper,
        paperLayer: paperLayer.id,
        children: [],
        fills: [],
        borders: [],
        shadows: []
      }
      return {
        ...state
      };
    }
    case ADD_PAGE: {
      const page = new LayerNode({
        parent: null,
        paperParent: null,
        layerType: 'Page'
      });
      return {
        ...state,
        activePage: page.id,
        layerById: {
          ...state.layerById,
          [page.id]: page
        },
        allIds: [...state.allIds, page.id]
      };
    }
    case ADD_SHAPE: {
      const parent = action.payload.parent ? action.payload.parent : state.activePage;
      const shape = new ShapeNode({
        parent: parent,
        paperParent: state.layerById[parent].paper,
        shapeType: action.payload.shapeType,
        name: action.payload.name,
        paperShape: action.payload.paperShape
      });
      state.layerById[shape.parent].children.push(shape.id);
      const baseFill = new FillNode({
        fillType: 'Color',
        layer: shape.id,
        paperShape: shape.paperShape,
        parent: shape.style.fills.id,
        paperParent: shape.style.fills.paper
      });
      shape.style.fills.children.push(baseFill.id);
      return {
        ...state,
        layerById: {
          ...state.layerById,
          [shape.parent]: state.layerById[shape.parent],
          [shape.id]: shape,
          [baseFill.id]: baseFill
        },
        allIds: [...state.allIds, shape.id, baseFill.id]
      };
    }
    // case ADD_TO_SELECTION: {
    //   const layer = state.layerById[action.payload.id] as LayerNode;
    //   layer.selected = true;
    //   layer.paperItem().selected = true;
    //   return {
    //     ...state,
    //     selection: [...state.selection, action.payload.id]
    //   };
    // }
    // case REMOVE_FROM_SELECTION: {
    //   const layer = state.layerById[action.payload.id] as LayerNode;
    //   layer.selected = false;
    //   layer.paperItem().selected = false;
    //   return {
    //     ...state,
    //     selection: state.selection.filter(id => id !== action.payload.id)
    //   };
    // }
    // case CLEAR_SELECTION: {
    //   state.selection.forEach((id) => {
    //     const layer = state.layerById[id] as LayerNode;
    //     layer.selected = false;
    //     layer.paperItem().selected = false;
    //   });
    //   return {
    //     ...state,
    //     selection: []
    //   };
    // }
    // case NEW_SELECTION: {
    //   state.selection.forEach((id) => {
    //     const layer = state.layerById[id] as LayerNode;
    //     layer.selected = false;
    //     layer.paperItem().selected = false;
    //   });
    //   const layer = state.layerById[action.payload.id] as LayerNode;
    //   layer.selected = true;
    //   layer.paperItem().selected = true;
    //   return {
    //     ...state,
    //     selection: [action.payload.id]
    //   };
    // }
    default:
      return state;
  }
}
