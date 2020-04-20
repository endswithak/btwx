import paper from 'paper';
import { ADD_SHAPE, ADD_PAGE, LayerActions } from '../actionTypes/layers';
import LayerNode from '../../canvas/base/layerNode';
import FillNode from '../../canvas/base/fillNode';
import ShapeNode from '../../canvas/base/shapeNode';
import StyleGroupNode from '../../canvas/base/styleGroupNode';

interface InitialState {
  activePage: string;
  layers: {
    [id: string]: LayerNode;
  };
  paperLayers: {
    [id: string]: paper.Item;
  };
  paperShapes: {
    [id: string]: paper.Path | paper.CompoundPath;
  };
}

const initialState: InitialState = {
  activePage: null,
  layers: {},
  paperLayers: {},
  paperShapes: {}
};

export default (state = initialState, action: {type: LayerActions; payload: any}) => {
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
        layers: {
          ...state.layers,
          [page.id]: page
        },
        paperLayers: {
          ...state.paperLayers,
          [page.id]: paperPage
        },
        activePage: page.id
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
      const updatedParent = state.layers[shape.parent].children.push(shape.id);
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
      paperFill.fillColor = fill.color;
      paperFill.data = {
        id: fill.id,
        layerId: shape.id
      };
      paperFill.parent = paperFillGroup;
      return {
        ...state,
        layers: {
          ...state.layers,
          [action.payload.parent]: updatedParent,
          [shape.id]: shape,
          [fillGroup.id]: fillGroup,
          [fill.id]: fill
        },
        paperLayers: {
          ...state.paperLayers,
          [shape.id]: paperLayer,
          [fillGroup.id]: paperFillGroup,
          [fill.id]: paperFill
        },
        paperShapes: {
          ...state.paperShapes,
          [shape.id]: action.payload.paperShape
        }
      };
    }
    default:
      return state;
  }
}
