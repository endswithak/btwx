export const SET_EDITING = 'SET_EDITING';
export const SET_DRAGGING = 'SET_DRAGGING';
export const SET_DRAG_OVER = 'SET_DRAG_OVER';
export const SET_DROPZONE = 'SET_DROPZONE';
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
  dragging: string;
}

export interface SetDragging {
  type: typeof SET_DRAGGING;
  payload: SetDraggingPayload;
}

export interface SetDragOverPayload {
  dragOver: string;
}

export interface SetDragOver {
  type: typeof SET_DRAG_OVER;
  payload: SetDragOverPayload;
}

export interface SetDropzonePayload {
  dropzone: Btwx.Dropzone;
}

export interface SetDropzone {
  type: typeof SET_DROPZONE;
  payload: SetDropzonePayload;
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
                               SetDragOver |
                               SetDropzone |
                               SetEditing |
                               SetDragLayers |
                               SetSearching |
                               SetSearch;