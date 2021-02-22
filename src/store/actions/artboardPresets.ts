import {
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  AddArtboardPresetPayload,
  RemoveArtboardPresetPayload,
  UpdateArtboardPresetPayload,
  SetArtboardPresetDeviceOrientationPayload,
  SetArtboardPresetDevicePlatformPayload,
  ArtboardPresetsTypes
} from '../actionTypes/artboardPresets';

export const addArtboardPreset = (payload: AddArtboardPresetPayload): ArtboardPresetsTypes => ({
  type: ADD_ARTBOARD_PRESET,
  payload
});

export const updateArtboardPreset = (payload: UpdateArtboardPresetPayload): ArtboardPresetsTypes => ({
  type: UPDATE_ARTBOARD_PRESET,
  payload
});

export const removeArtboardPreset = (payload: RemoveArtboardPresetPayload): ArtboardPresetsTypes => ({
  type: REMOVE_ARTBOARD_PRESET,
  payload
});

export const setArtboardPresetDeviceOrientation = (payload: SetArtboardPresetDeviceOrientationPayload): ArtboardPresetsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  payload
});

export const setArtboardPresetDevicePlatform = (payload: SetArtboardPresetDevicePlatformPayload): ArtboardPresetsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  payload
});