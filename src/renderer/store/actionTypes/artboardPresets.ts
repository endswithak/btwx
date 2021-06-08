import { ArtboardPresetsState } from "../reducers/artboardPresets";

export const ADD_ARTBOARD_PRESET = 'ADD_ARTBOARD_PRESET';
export const REMOVE_ARTBOARD_PRESET = 'REMOVE_ARTBOARD_PRESET';
export const UPDATE_ARTBOARD_PRESET = 'UPDATE_ARTBOARD_PRESET';
export const SET_ARTBOARD_PRESET_DEVICE_ORIENTATION = 'SET_ARTBOARD_PRESET_DEVICE_ORIENTATION';
export const SET_ARTBOARD_PRESET_DEVICE_PLATFORM = 'SET_ARTBOARD_PRESET_DEVICE_PLATFORM';
export const HYDRATE_ARTBOARD_PRESETS = 'HYDRATE_ARTBOARD_PRESETS';

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
  orientation: Btwx.DeviceOrientationType;
}

export interface SetArtboardPresetDeviceOrientation {
  type: typeof SET_ARTBOARD_PRESET_DEVICE_ORIENTATION;
  payload: SetArtboardPresetDeviceOrientationPayload;
}

export interface SetArtboardPresetDevicePlatformPayload {
  platform: Btwx.DevicePlatformType;
}

export interface SetArtboardPresetDevicePlatform {
  type: typeof SET_ARTBOARD_PRESET_DEVICE_PLATFORM;
  payload: SetArtboardPresetDevicePlatformPayload;
}

export interface HydrateArtboardPresets {
  type: typeof HYDRATE_ARTBOARD_PRESETS;
  payload: ArtboardPresetsState;
}

export type ArtboardPresetsTypes =  AddArtboardPreset |
                                    RemoveArtboardPreset |
                                    UpdateArtboardPreset |
                                    SetArtboardPresetDeviceOrientation |
                                    SetArtboardPresetDevicePlatform |
                                    HydrateArtboardPresets;