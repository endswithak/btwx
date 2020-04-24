import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';
import LayerNode from '../../canvas/base/layerNode';
import FillNode from '../../canvas/base/fillNode';
import ShapeNode from '../../canvas/base/shapeNode';
import StyleGroupNode from '../../canvas/base/styleGroupNode';
import StyleNode from '../../canvas/base/styleNode';
import { LayersState } from '../reducers/layers';
import { LayersTypes, AddLayerPayload } from '../actionTypes/layers';

export const insertItem = (array: any[], item: any, index: number) => {
  const newArray = array.slice();
  newArray.splice(index, 0, item);
  return newArray;
}

export const removeItem = (array: any[], item: any) => {
  return array.filter(id => id !== item);
}

interface BaseLayer {
  type: 'Page' | 'Group' | 'Shape' | 'Artboard';
  id: string;
  name: string;
  parent: string;
  paperLayer: number;
  paperParent: number;
  children: number[];
}

export const baseLayer = (state: LayersState, payload: AddLayerPayload): BaseLayer => {
  const layerId = uuidv4();
  const layerParentId = payload.parent ? payload.parent : state.activePage;
  const paperParentId = state.layerById[layerParentId].paper;
  const paperParentLayer = paper.project.getItem({id: paperParentId});
  const paperLayer = new paper.Layer({
    parent: paperParentLayer,
    data: {
      id: layerId,
      layerId: layerId
    }
  });
  return {
    type: payload.type,
    id: layerId,
    name: payload.name ? payload.name : payload.type,
    parent: layerParentId,
    paperParent: state.layerById[layerParentId].paper,
    paperLayer: paperLayer.id,
    children: []
  }
}

// interface Layer {
//   type: 'Page' | 'Group' | 'Shape' | 'Artboard';
//   id: string;
//   name: string;
//   parent: string;
//   paperLayer: number;
//   paperParent: number;
//   children: number[];
//   fillsPaperLayer: number;
//   fills: string[];
// }

// export const addLayer = (state: LayersState, payload: AddLayerPayload): Layer => {
//   const layerId = uuidv4();
//   const fillsId = uuidv4();
//   const layerParentId = payload.parent ? payload.parent : state.activePage;
//   const paperParentId = state.layerById[layerParentId].paper;
//   const paperParentLayer = paper.project.getItem({id: paperParentId});
//   const paperLayer = new paper.Layer({
//     parent: paperParentLayer,
//     data: {
//       id: layerId,
//       layerId: layerId
//     }
//   });
//   const fillsContainer = new paper.Layer({
//     parent: paperLayer,
//     data: {
//       id: fillsId,
//       layerId: layerId
//     }
//   });
//   return {
//     type: payload.type,
//     id: layerId,
//     name: payload.name ? payload.name : payload.type,
//     parent: layerParentId,
//     paperParent: state.layerById[layerParentId].paper,
//     paperLayer: paperLayer.id,
//     children: [],
//     fillsPaperLayer: fillsContainer.id,
//     fills: []
//   }
// }