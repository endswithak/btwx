export const ADD_PAGE = 'ADD_PAGE';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_SHAPE = 'ADD_SHAPE';

export const REMOVE_LAYER = 'REMOVE_LAYER';
export const REMOVE_LAYERS = 'REMOVE_LAYERS';

export const SELECT_LAYER = 'SELECT_LAYER';
export const DESELECT_LAYER = 'DESELECT_LAYER';
export const DESELECT_ALL_LAYERS = 'DESELECT_ALL_LAYERS';

export const ENABLE_LAYER_HOVER = 'ENABLE_LAYER_HOVER';
export const DISABLE_LAYER_HOVER = 'DISABLE_LAYER_HOVER';

export const ADD_LAYER_CHILD = 'ADD_LAYER_CHILD';
export const INSERT_LAYER_CHILD = 'INSERT_LAYER_CHILD';

export const INSERT_LAYER_ABOVE = 'INSERT_LAYER_ABOVE';
export const INSERT_LAYER_BELOW = 'INSERT_LAYER_BELOW';

export const EXPAND_LAYER = 'EXPAND_LAYER';
export const COLLAPSE_LAYER = 'COLLAPSE_LAYER';

export const GROUP_LAYERS = 'GROUP_LAYERS';
export const UNGROUP_LAYER = 'UNGROUP_LAYER';
export const UNGROUP_LAYERS = 'UNGROUP_LAYERS';
export const SET_GROUP_SCOPE = 'SET_GROUP_SCOPE';

// Page

export interface AddPagePayload {
  type?: 'Page';
  id?: string;
  name?: string;
  parent?: string;
  paperLayer?: paper.Group;
  selected?: boolean;
  hover?: boolean;
  children?: string[];
}

export interface AddPage {
  type: typeof ADD_PAGE;
  payload: AddPagePayload;
}

// Group

export interface AddGroupPayload {
  type?: 'Group';
  id?: string;
  name?: string;
  parent?: string;
  paperLayer?: paper.Group;
  selected?: boolean;
  hover?: boolean;
  children?: string[];
  expanded?: boolean;
}

export interface AddGroup {
  type: typeof ADD_GROUP;
  payload: AddGroupPayload;
}

// Shape

export interface AddShapePayload {
  type?: 'Shape';
  id?: string;
  name?: string;
  parent?: string;
  shapeType?: em.ShapeType;
  paperLayer?: paper.Path | paper.CompoundPath;
  selected?: boolean;
  hover?: boolean;
}

export interface AddShape {
  type: typeof ADD_SHAPE;
  payload: AddShapePayload;
}

// Remove

export interface RemoveLayerPayload {
  id: string;
}

export interface RemoveLayer {
  type: typeof REMOVE_LAYER;
  payload: RemoveLayerPayload;
}

export interface RemoveLayersPayload {
  layers: string[];
}

export interface RemoveLayers {
  type: typeof REMOVE_LAYERS;
  payload: RemoveLayersPayload;
}

// Select

export interface SelectLayerPayload {
  id: string;
  newSelection?: boolean;
}

export interface SelectLayer {
  type: typeof SELECT_LAYER;
  payload: SelectLayerPayload;
}

export interface DeselectLayerPayload {
  id: string;
}

export interface DeselectLayer {
  type: typeof DESELECT_LAYER;
  payload: DeselectLayerPayload;
}

export interface DeselectAllLayers {
  type: typeof DESELECT_ALL_LAYERS;
}

// Hover

export interface EnableLayerHoverPayload {
  id: string;
}

export interface EnableLayerHover {
  type: typeof ENABLE_LAYER_HOVER;
  payload: EnableLayerHoverPayload;
}

export interface DisableLayerHoverPayload {
  id: string;
}

export interface DisableLayerHover {
  type: typeof DISABLE_LAYER_HOVER;
  payload: DisableLayerHoverPayload;
}

// Children

export interface AddLayerChildPayload {
  id: string;
  child: string;
}

export interface AddLayerChild {
  type: typeof ADD_LAYER_CHILD;
  payload: AddLayerChildPayload;
}

export interface InsertLayerChildPayload {
  id: string;
  child: string;
  index: number;
}

export interface InsertLayerChild {
  type: typeof INSERT_LAYER_CHILD;
  payload: InsertLayerChildPayload;
}

// Insert

export interface InsertLayerAbovePayload {
  id: string;
  above: string;
}

export interface InsertLayerAbove {
  type: typeof INSERT_LAYER_ABOVE;
  payload: InsertLayerAbovePayload;
}

export interface InsertLayerBelowPayload {
  id: string;
  below: string;
}

export interface InsertLayerBelow {
  type: typeof INSERT_LAYER_BELOW;
  payload: InsertLayerBelowPayload;
}

// Expand

export interface ExpandLayerPayload {
  id: string;
}

export interface ExpandLayer {
  type: typeof EXPAND_LAYER;
  payload: ExpandLayerPayload;
}

export interface CollapseLayerPayload {
  id: string;
}

export interface CollapseLayer {
  type: typeof COLLAPSE_LAYER;
  payload: CollapseLayerPayload;
}

// Group

export interface GroupLayersPayload {
  layers: string[];
}

export interface GroupLayers {
  type: typeof GROUP_LAYERS;
  payload: GroupLayersPayload;
}

export interface UngroupLayerPayload {
  id: string;
}

export interface UngroupLayer {
  type: typeof UNGROUP_LAYER;
  payload: UngroupLayerPayload;
}

export interface UngroupLayersPayload {
  layers: string[];
}

export interface UngroupLayers {
  type: typeof UNGROUP_LAYERS;
  payload: UngroupLayersPayload;
}

export interface SetGroupScopePayload {
  id: string;
}

export interface SetGroupScope {
  type: typeof SET_GROUP_SCOPE;
  payload: SetGroupScopePayload;
}


export type LayerTypes = AddPage | AddGroup | AddShape | RemoveLayer | RemoveLayers | SelectLayer | DeselectLayer | DeselectAllLayers | EnableLayerHover | DisableLayerHover | AddLayerChild | InsertLayerChild | InsertLayerAbove | InsertLayerBelow | ExpandLayer | CollapseLayer | GroupLayers | UngroupLayer | UngroupLayers | SetGroupScope;