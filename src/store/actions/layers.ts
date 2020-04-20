import paper from 'paper';
import { ADD_SHAPE, ADD_PAGE } from '../actionTypes/layers';

export const addShape = (content: {parent: string; shapeType: em.ShapeType; name: string, paperShape: paper.Path | paper.CompoundPath}) => ({
  type: ADD_SHAPE,
  payload: content
});

export const addPage = (content: {name?: string}) => ({
  type: ADD_PAGE,
  payload: content
});