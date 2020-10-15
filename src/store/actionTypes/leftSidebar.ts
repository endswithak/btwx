export const SET_EDITING = 'SET_EDITING';
export const SET_DRAGGING = 'SET_DRAGGING';
export const SET_DRAG_LAYERS = 'SET_DRAG_LAYERS';
export const SET_SEARCHING = 'SET_SEARCHING';
export const SET_SEARCH = 'SET_SEARCH';

export interface SetEditingPayload {
  editing: string;
}

export interface SetEditing {
  type: typeof SET_EDITING;
  payload: SetEditingPayload;
}

export interface SetDraggingPayload {
  dragging: boolean;
}

export interface SetDragging {
  type: typeof SET_DRAGGING;
  payload: SetDraggingPayload;
}

export interface SetDragLayersPayload {
  dragLayers: string[];
}

export interface SetDragLayers {
  type: typeof SET_DRAG_LAYERS;
  payload: SetDragLayersPayload;
}

export interface SetSearchingPayload {
  searching: boolean;
}

export interface SetSearching {
  type: typeof SET_SEARCHING;
  payload: SetSearchingPayload;
}

export interface SetSearchPayload {
  search: string;
}

export interface SetSearch {
  type: typeof SET_SEARCH;
  payload: SetSearchPayload;
}

export type LeftSidebarTypes = SetDragging |
                               SetEditing |
                               SetDragLayers |
                               SetSearching |
                               SetSearch;