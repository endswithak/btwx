export const ADD_LAYER = 'ADD_LAYER';
export const ADD_SHAPE = 'ADD_SHAPE';
export const ADD_PAGE = 'ADD_PAGE';

export const ADD_TO_SELECTION = 'ADD_TO_SELECTION';
export const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
export const CLEAR_SELECTION = 'CLEAR_SELECTION';
export const NEW_SELECTION = 'NEW_SELECTION';

export interface AddLayerPayload {
  type: 'Page' | 'Group' | 'Shape' | 'Artboard';
  parent?: string;
  shapeType?: em.ShapeType;
  paperShape?: paper.Path | paper.CompoundPath;
  name?: string;
}

interface AddLayer {
  type: typeof ADD_LAYER;
  payload: AddLayerPayload;
}

export interface AddShapePayload {
  parent: string;
  paperParent: number;
  shapeType: em.ShapeType;
  paperShape: paper.Path | paper.CompoundPath;
  name?: string;
}

interface AddShape {
  type: typeof ADD_SHAPE;
  payload: AddShapePayload;
}

export interface AddPagePayload {
  parent: string;
  paperParent: number;
  name?: string;
}

interface AddPage {
  type: typeof ADD_PAGE;
  payload: AddPagePayload;
}

export interface SelectionPayload {
  id: string;
}

interface AddToSelection {
  type: typeof ADD_TO_SELECTION;
  payload: SelectionPayload;
}

interface RemoveFromSelection {
  type: typeof REMOVE_FROM_SELECTION;
  payload: SelectionPayload;
}

interface ClearSelection {
  type: typeof CLEAR_SELECTION;
}

interface NewSelection {
  type: typeof NEW_SELECTION;
  payload: SelectionPayload;
}

export type LayersTypes = AddLayer | AddShape | AddPage | AddToSelection | RemoveFromSelection | ClearSelection | NewSelection;