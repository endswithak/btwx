import { FixedSizeTree } from '../../../react-vtree';

export const SET_EDITING = 'SET_EDITING';
export const SET_EDIT = 'SET_EDIT';
export const SET_DRAGGING = 'SET_DRAGGING';
export const SET_DRAG_OVER = 'SET_DRAG_OVER';
export const SET_DROPZONE = 'SET_DROPZONE';
export const SET_DRAG_LAYERS = 'SET_DRAG_LAYERS';
export const SET_SEARCHING = 'SET_SEARCHING';
export const SET_SEARCH = 'SET_SEARCH';
export const SET_REF = 'SET_REF';

export interface SetRefPayload {
  ref: FixedSizeTree;
}

export interface SetRef{
  type: typeof SET_REF;
  payload: SetRefPayload;
}

export interface SetEditingPayload {
  editing: string;
  edit?: string;
}

export interface SetEditing {
  type: typeof SET_EDITING;
  payload: SetEditingPayload;
}

export interface SetEditPayload {
  edit: string;
}

export interface SetEdit {
  type: typeof SET_EDIT;
  payload: SetEditPayload;
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
                               SetRef |
                               SetDragOver |
                               SetDropzone |
                               SetEditing |
                               SetDragLayers |
                               SetSearching |
                               SetSearch |
                               SetEdit;