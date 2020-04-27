export const ADD_SHAPE = 'ADD_SHAPE';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_PAGE = 'ADD_PAGE';
export const REMOVE_LAYER = 'REMOVE_LAYER';

export const EXPAND_GROUP = 'EXPAND_GROUP';
export const COLLAPSE_GROUP = 'COLLAPSE_GROUP';

export const INSERT_CHILD = 'INSERT_CHILD';
export const INSERT_ABOVE = 'INSERT_ABOVE';
export const INSERT_BELOW = 'INSERT_BELOW';

export const SELECT_LAYER = 'SELECT_LAYER';
export const DESELECT_LAYER = 'DESELECT_LAYER';

// Add

export interface AddShapePayload {
  shapeType: em.ShapeType;
  paperShape: paper.Path | paper.CompoundPath;
  parent?: string;
  name?: string;
}

export interface AddShape {
  type: typeof ADD_SHAPE;
  payload: AddShapePayload;
}

export interface AddGroupPayload {
  parent?: string;
  name?: string;
  children?: string[] | number[];
}

export interface AddGroup {
  type: typeof ADD_GROUP;
  payload: AddGroupPayload;
}

export interface AddPagePayload {
  parent?: string;
  paperParent?: number;
  name?: string;
}

export interface AddPage {
  type: typeof ADD_PAGE;
  payload: AddPagePayload;
}

export interface RemoveLayerPayload {
  id: string;
}

export interface RemoveLayer {
  type: typeof REMOVE_LAYER;
  payload: RemoveLayerPayload;
}

// Insert

export interface InsertChildPayload {
  layer: string;
  parent: string;
}

export interface InsertChild {
  type: typeof INSERT_CHILD;
  payload: InsertChildPayload;
}

export interface InsertAbovePayload {
  layer: string;
  above: string;
}

export interface InsertAbove {
  type: typeof INSERT_ABOVE;
  payload: InsertAbovePayload;
}

export interface InsertBelowPayload {
  layer: string;
  below: string;
}

export interface InsertBelow {
  type: typeof INSERT_BELOW;
  payload: InsertBelowPayload;
}

// Other

export interface ShowChildrenPayload {
  id: string;
}

export interface ExpandGroup {
  type: typeof EXPAND_GROUP;
  payload: ShowChildrenPayload;
}

export interface CollapseGroup {
  type: typeof COLLAPSE_GROUP;
  payload: ShowChildrenPayload;
}

// Select

export interface SelectionPayload {
  id: string;
}

export interface SelectLayer {
  type: typeof SELECT_LAYER;
  payload: SelectionPayload;
}

export interface DeselectLayer {
  type: typeof DESELECT_LAYER;
  payload: SelectionPayload;
}

export type LayersTypes = AddShape | AddGroup | AddPage | RemoveLayer | InsertChild | InsertAbove | InsertBelow | ExpandGroup | CollapseGroup | SelectLayer | DeselectLayer;