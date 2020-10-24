import {
  SET_EDITING,
  SET_DRAGGING,
  SET_DRAG_OVER,
  SET_DROPZONE,
  SET_DRAG_LAYERS,
  SET_SEARCHING,
  SET_SEARCH,
  SetEditingPayload,
  SetDraggingPayload,
  SetDragOverPayload,
  SetDropzonePayload,
  SetDragLayersPayload,
  SetSearchingPayload,
  SetSearchPayload,
  LeftSidebarTypes
} from '../actionTypes/leftSidebar';

export const setEditing = (payload: SetEditingPayload): LeftSidebarTypes => ({
  type: SET_EDITING,
  payload
});

export const setDragging = (payload: SetDraggingPayload): LeftSidebarTypes => ({
  type: SET_DRAGGING,
  payload
});

export const setDragOver = (payload: SetDragOverPayload): LeftSidebarTypes => ({
  type: SET_DRAG_OVER,
  payload
});

export const setDropzone = (payload: SetDropzonePayload): LeftSidebarTypes => ({
  type: SET_DROPZONE,
  payload
});

export const setDragLayers = (payload: SetDragLayersPayload): LeftSidebarTypes => ({
  type: SET_DRAG_LAYERS,
  payload
});

export const setSearching = (payload: SetSearchingPayload): LeftSidebarTypes => ({
  type: SET_SEARCHING,
  payload
});

export const setSearch = (payload: SetSearchPayload): LeftSidebarTypes => ({
  type: SET_SEARCH,
  payload
});
