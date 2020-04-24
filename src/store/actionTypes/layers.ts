export const ADD_SHAPE = 'ADD_SHAPE';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_PAGE = 'ADD_PAGE';
export const REMOVE_LAYER = 'REMOVE_LAYER';

export const EXPAND_GROUP = 'EXPAND_GROUP';
export const COLLAPSE_GROUP = 'COLLAPSE_GROUP';

export const INSERT_CHILD = 'INSERT_CHILD';
export const INSERT_ABOVE = 'INSERT_ABOVE';
export const INSERT_BELOW = 'INSERT_BELOW';

export const ADD_TO_SELECTION = 'ADD_TO_SELECTION';
export const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
export const CLEAR_SELECTION = 'CLEAR_SELECTION';
export const NEW_SELECTION = 'NEW_SELECTION';
export const GROUP_SELECTION = 'GROUP_SELECTION';
export const UNGROUP_SELECTION = 'UNGROUP_SELECTION';

// Add

export interface AddShapePayload {
  shapeType: em.ShapeType;
  paperShape: paper.Path | paper.CompoundPath;
  parent?: string;
  name?: string;
}

interface AddShape {
  type: typeof ADD_SHAPE;
  payload: AddShapePayload;
}

export interface AddGroupPayload {
  parent?: string;
  name?: string;
  children?: string[] | number[];
}

interface AddGroup {
  type: typeof ADD_GROUP;
  payload: AddGroupPayload;
}

export interface AddPagePayload {
  parent?: string;
  paperParent?: number;
  name?: string;
}

interface AddPage {
  type: typeof ADD_PAGE;
  payload: AddPagePayload;
}

export interface RemoveLayerPayload {
  id: string;
}

interface RemoveLayer {
  type: typeof REMOVE_LAYER;
  payload: RemoveLayerPayload;
}

// Insert

export interface InsertChildPayload {
  layer: string;
  parent: string;
}

interface InsertChild {
  type: typeof INSERT_CHILD;
  payload: InsertChildPayload;
}

export interface InsertAbovePayload {
  layer: string;
  above: string;
}

interface InsertAbove {
  type: typeof INSERT_ABOVE;
  payload: InsertAbovePayload;
}

export interface InsertBelowPayload {
  layer: string;
  below: string;
}

interface InsertBelow {
  type: typeof INSERT_BELOW;
  payload: InsertBelowPayload;
}

// Other

export interface ShowChildrenPayload {
  id: string;
}

interface ExpandGroup {
  type: typeof EXPAND_GROUP;
  payload: ShowChildrenPayload;
}

interface CollapseGroup {
  type: typeof COLLAPSE_GROUP;
  payload: ShowChildrenPayload;
}

// Select

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

interface GroupSelection {
  type: typeof GROUP_SELECTION;
}

interface UngroupSelection {
  type: typeof UNGROUP_SELECTION;
}

export type LayersTypes = AddShape | AddGroup | AddPage | RemoveLayer | InsertChild | InsertAbove | InsertBelow | ExpandGroup | CollapseGroup | AddToSelection | RemoveFromSelection | ClearSelection | NewSelection | GroupSelection | UngroupSelection;