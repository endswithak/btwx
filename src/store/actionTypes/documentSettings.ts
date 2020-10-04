import { LayerState } from '../reducers/layer';
import { DocumentSettingsState } from '../reducers/documentSettings';

export const OPEN_DOCUMENT = 'OPEN_DOCUMENT';

export const SAVE_DOCUMENT_AS = 'SAVE_DOCUMENT_AS';
export const SAVE_DOCUMENT = 'SAVE_DOCUMENT';

export const SET_CANVAS_MATRIX = 'SET_CANVAS_MATRIX';
export const SET_CANVAS_COLOR_FORMAT = 'SET_CANVAS_COLOR_FORMAT';

export const ADD_DOCUMENT_IMAGE = 'ADD_DOCUMENT_IMAGE';

export const ADD_ARTBOARD_PRESET = 'ADD_ARTBOARD_PRESET';
export const REMOVE_ARTBOARD_PRESET = 'REMOVE_ARTBOARD_PRESET';
export const UPDATE_ARTBOARD_PRESET = 'UPDATE_ARTBOARD_PRESET';
export const SET_ARTBOARD_PRESET_DEVICE_ORIENTATION = 'SET_ARTBOARD_PRESET_DEVICE_ORIENTATION';
export const SET_ARTBOARD_PRESET_DEVICE_PLATFORM = 'SET_ARTBOARD_PRESET_DEVICE_PLATFORM';

export interface OpenDocumentPayload {
  document: {
    layer: LayerState;
    documentSettings: DocumentSettingsState;
  };
}

export interface OpenDocument {
  type: typeof OPEN_DOCUMENT;
  payload: OpenDocumentPayload;
}

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

export interface SetArtboardPresetDeviceOrientationPayload {
  orientation: em.DeviceOrientationType;
}

export interface SetArtboardPresetDeviceOrientation {
  type: typeof SET_ARTBOARD_PRESET_DEVICE_ORIENTATION;
  payload: SetArtboardPresetDeviceOrientationPayload;
}

export interface SetArtboardPresetDevicePlatformPayload {
  platform: em.DevicePlatformType;
}

export interface SetArtboardPresetDevicePlatform {
  type: typeof SET_ARTBOARD_PRESET_DEVICE_PLATFORM;
  payload: SetArtboardPresetDevicePlatformPayload;
}

export type DocumentSettingsTypes = OpenDocument |
                                    SaveDocumentAs |
                                    SaveDocument |
                                    SetCanvasMatrix |
                                    SetCanvasColorFormat |
                                    AddDocumentImage |
                                    AddArtboardPreset |
                                    RemoveArtboardPreset |
                                    UpdateArtboardPreset |
                                    SetArtboardPresetDeviceOrientation |
                                    SetArtboardPresetDevicePlatform;