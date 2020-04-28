export const ADD_SHAPE = 'ADD_SHAPE';
export const REMOVE_SHAPE = 'REMOVE_SHAPE';

export const SELECT_SHAPE = 'SELECT_SHAPE';
export const DESELECT_SHAPE = 'DESELECT_SHAPE';

export const ENABLE_SHAPE_HOVER = 'ENABLE_SHAPE_HOVER';
export const DISABLE_SHAPE_HOVER = 'DISABLE_SHAPE_HOVER';

// Add / remove

export interface AddShapePayload {
  id: string;
  parent: string;
  shapeType: em.ShapeType;
  paperShape: paper.Path | paper.CompoundPath;
  name?: string;
}

export interface AddShape {
  type: typeof ADD_SHAPE;
  payload: AddShapePayload;
}

export interface RemoveShapePayload {
  id: string;
}

export interface RemoveShape {
  type: typeof REMOVE_SHAPE;
  payload: RemoveShapePayload;
}

// Select

export interface SelectShapePayload {
  id: string;
}

export interface SelectShape {
  type: typeof SELECT_SHAPE;
  payload: SelectShapePayload;
}

export interface DeselectShapePayload {
  id: string;
}

export interface DeselectShape {
  type: typeof DESELECT_SHAPE;
  payload: DeselectShapePayload;
}

// Hover

export interface EnableShapeHoverPayload {
  id: string;
}

export interface EnableShapeHover {
  type: typeof ENABLE_SHAPE_HOVER;
  payload: EnableShapeHoverPayload;
}

export interface DisableShapeHoverPayload {
  id: string;
}

export interface DisableShapeHover {
  type: typeof DISABLE_SHAPE_HOVER;
  payload: DisableShapeHoverPayload;
}

export type ShapeTypes = AddShape | RemoveShape | SelectShape | DeselectShape | EnableShapeHover | DisableShapeHover;