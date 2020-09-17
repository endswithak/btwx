export const SAVE_DOCUMENT_AS = 'SAVE_DOCUMENT_AS';
export const SAVE_DOCUMENT = 'SAVE_DOCUMENT';

export const SET_CANVAS_MATRIX = 'SET_CANVAS_MATRIX';
export const SET_CANVAS_COLOR_FORMAT = 'SET_CANVAS_COLOR_FORMAT';

export const ADD_DOCUMENT_IMAGE = 'ADD_DOCUMENT_IMAGE';

export const SET_LEFT_SIDEBAR_WIDTH = 'SET_LEFT_SIDEBAR_WIDTH';
export const SET_RIGHT_SIDEBAR_WIDTH = 'SET_RIGHT_SIDEBAR_WIDTH';
export const SET_TWEEN_DRAWER_HEIGHT = 'SET_TWEEN_DRAWER_HEIGHT';
export const SET_TWEEN_DRAWER_LAYERS_WIDTH = 'SET_TWEEN_DRAWER_LAYERS_WIDTH';

export const ADD_ARTBOARD_PRESET = 'ADD_ARTBOARD_PRESET';
export const REMOVE_ARTBOARD_PRESET = 'REMOVE_ARTBOARD_PRESET';
export const UPDATE_ARTBOARD_PRESET = 'UPDATE_ARTBOARD_PRESET';

export interface SaveDocumentAsPayload {
  id?: string;
  name: string;
  path: string;
  edit: string;
}

export interface SaveDocumentAs {
  type: typeof SAVE_DOCUMENT_AS;
  payload: SaveDocumentAsPayload;
}

export interface SaveDocumentPayload {
  edit: string;
}

export interface SaveDocument {
  type: typeof SAVE_DOCUMENT;
  payload: SaveDocumentPayload;
}

export interface SetCanvasMatrixPayload {
  matrix: number[];
}

export interface SetCanvasMatrix {
  type: typeof SET_CANVAS_MATRIX;
  payload: SetCanvasMatrixPayload;
}

export interface SetCanvasColorFormatPayload {
  colorFormat: em.ColorFormat;
}

export interface SetCanvasColorFormat {
  type: typeof SET_CANVAS_COLOR_FORMAT;
  payload: SetCanvasColorFormatPayload;
}

export interface AddDocumentImagePayload {
  id: string;
  buffer: Buffer;
}

export interface AddDocumentImage {
  type: typeof ADD_DOCUMENT_IMAGE;
  payload: AddDocumentImagePayload;
}

export interface SetLeftSidebarWidthPayload {
  width: number;
}

export interface SetLeftSidebarWidth {
  type: typeof SET_LEFT_SIDEBAR_WIDTH;
  payload: SetLeftSidebarWidthPayload;
}

export interface SetRightSidebarWidthPayload {
  width: number;
}

export interface SetRightSidebarWidth {
  type: typeof SET_RIGHT_SIDEBAR_WIDTH;
  payload: SetRightSidebarWidthPayload;
}

export interface SetTweenDrawerHeightPayload {
  height: number;
}

export interface SetTweenDrawerHeight {
  type: typeof SET_TWEEN_DRAWER_HEIGHT;
  payload: SetTweenDrawerHeightPayload;
}

export interface SetTweenDrawerLayersWidthPayload {
  width: number;
}

export interface SetTweenDrawerLayersWidth {
  type: typeof SET_TWEEN_DRAWER_LAYERS_WIDTH;
  payload: SetTweenDrawerLayersWidthPayload;
}

export interface AddArtboardPresetPayload {
  id: string;
  type: string;
  width: number;
  height: number;
}

export interface AddArtboardPreset {
  type: typeof ADD_ARTBOARD_PRESET;
  payload: AddArtboardPresetPayload;
}

export interface RemoveArtboardPresetPayload {
  id: string;
}

export interface RemoveArtboardPreset {
  type: typeof REMOVE_ARTBOARD_PRESET;
  payload: RemoveArtboardPresetPayload;
}

export interface UpdateArtboardPresetPayload {
  id: string;
  type: string;
  width: number;
  height: number;
}

export interface UpdateArtboardPreset {
  type: typeof UPDATE_ARTBOARD_PRESET;
  payload: UpdateArtboardPresetPayload;
}

export type DocumentSettingsTypes = SaveDocumentAs |
                                    SaveDocument |
                                    SetCanvasMatrix |
                                    SetCanvasColorFormat |
                                    AddDocumentImage |
                                    SetLeftSidebarWidth |
                                    SetRightSidebarWidth |
                                    SetTweenDrawerHeight |
                                    SetTweenDrawerLayersWidth |
                                    AddArtboardPreset |
                                    RemoveArtboardPreset |
                                    UpdateArtboardPreset;