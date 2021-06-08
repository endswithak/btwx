// import { ipcRenderer } from 'electron';
import { addItem, removeItem } from '../utils/general';

import {
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  HYDRATE_ARTBOARD_PRESETS,
  AddArtboardPresetPayload,
  RemoveArtboardPresetPayload,
  UpdateArtboardPresetPayload,
  SetArtboardPresetDeviceOrientationPayload,
  SetArtboardPresetDevicePlatformPayload,
  ArtboardPresetsTypes
} from '../actionTypes/artboardPresets';
import { ArtboardPresetsState } from '../reducers/artboardPresets';

export const addArtboardPreset = (payload: AddArtboardPresetPayload): ArtboardPresetsTypes => ({
  type: ADD_ARTBOARD_PRESET,
  payload
});

export const addArtboardPresetThunk = (payload: AddArtboardPresetPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(addArtboardPreset(payload));
    (window as any).api.getElectronStore('artboardPresets').then((artboardPresets) => {
      (window as any).api.setElectronStore(JSON.stringify({
        key: 'artboardPresets',
        value: {
          ...artboardPresets,
          allIds: addItem(artboardPresets.allIds, payload.id),
          byId: {
            ...artboardPresets.byId,
            [payload.id]: {
              ...payload,
              category: 'Custom'
            }
          }
        }
      }));
    });
    // ipcRenderer.invoke('getElectronStore', 'artboardPresets').then((artboardPresets) => {
    //   ipcRenderer.invoke('setElectronStore', JSON.stringify({
    //     key: 'artboardPresets',
    //     value: {
    //       ...artboardPresets,
    //       allIds: addItem(artboardPresets.allIds, payload.id),
    //       byId: {
    //         ...artboardPresets.byId,
    //         [payload.id]: {
    //           ...payload,
    //           category: 'Custom'
    //         }
    //       }
    //     }
    //   }));
    // });
  }
};

export const updateArtboardPreset = (payload: UpdateArtboardPresetPayload): ArtboardPresetsTypes => ({
  type: UPDATE_ARTBOARD_PRESET,
  payload
});

export const updateArtboardPresetThunk = (payload: UpdateArtboardPresetPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(updateArtboardPreset(payload));
    (window as any).api.getElectronStore('artboardPresets').then((artboardPresets) => {
      (window as any).api.setElectronStore(JSON.stringify({
        key: 'artboardPresets',
        value: {
          ...artboardPresets,
          byId: Object.keys(artboardPresets.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
            if (id !== payload.id) {
              result[id] = artboardPresets.byId[id];
            } else {
              result[id] = {
                ...artboardPresets.byId[id],
                ...payload,
                category: 'Custom'
              };
            }
            return result;
          }, {})
        }
      }));
    });
    // ipcRenderer.invoke('getElectronStore', 'artboardPresets').then((artboardPresets) => {
    //   ipcRenderer.invoke('setElectronStore', JSON.stringify({
    //     key: 'artboardPresets',
    //     value: {
    //       ...artboardPresets,
    //       byId: Object.keys(artboardPresets.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
    //         if (id !== payload.id) {
    //           result[id] = artboardPresets.byId[id];
    //         } else {
    //           result[id] = {
    //             ...artboardPresets.byId[id],
    //             ...payload,
    //             category: 'Custom'
    //           };
    //         }
    //         return result;
    //       }, {})
    //     }
    //   }));
    // });
  }
};

export const removeArtboardPreset = (payload: RemoveArtboardPresetPayload): ArtboardPresetsTypes => ({
  type: REMOVE_ARTBOARD_PRESET,
  payload
});

export const removeArtboardPresetThunk = (payload: RemoveArtboardPresetPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(removeArtboardPreset(payload));
    (window as any).api.getElectronStore('artboardPresets').then((artboardPresets) => {
      (window as any).api.setElectronStore(JSON.stringify({
        key: 'artboardPresets',
        value: {
          ...artboardPresets,
          allIds: removeItem(artboardPresets.allIds, payload.id),
          byId: Object.keys(artboardPresets.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
            if (id !== payload.id) {
              result[id] = artboardPresets.byId[id];
            }
            return result;
          }, {})
        }
      }));
    });
    // ipcRenderer.invoke('getElectronStore', 'artboardPresets').then((artboardPresets) => {
    //   ipcRenderer.invoke('setElectronStore', JSON.stringify({
    //     key: 'artboardPresets',
    //     value: {
    //       ...artboardPresets,
    //       allIds: removeItem(artboardPresets.allIds, payload.id),
    //       byId: Object.keys(artboardPresets.byId).reduce((result: { [id: string]: Btwx.ArtboardPreset }, id) => {
    //         if (id !== payload.id) {
    //           result[id] = artboardPresets.byId[id];
    //         }
    //         return result;
    //       }, {})
    //     }
    //   }));
    // });
  }
};

export const setArtboardPresetDeviceOrientation = (payload: SetArtboardPresetDeviceOrientationPayload): ArtboardPresetsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  payload
});

export const setArtboardPresetDeviceOrientationThunk = (payload: SetArtboardPresetDeviceOrientationPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArtboardPresetDeviceOrientation(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'artboardPresets.orientation',
      value: payload.orientation
    }));
    // ipcRenderer.invoke('setElectronStore', JSON.stringify({
    //   key: 'artboardPresets.orientation',
    //   value: payload.orientation
    // }));
  }
};

export const setArtboardPresetDevicePlatform = (payload: SetArtboardPresetDevicePlatformPayload): ArtboardPresetsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  payload
});

export const setArtboardPresetDevicePlatformThunk = (payload: SetArtboardPresetDevicePlatformPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArtboardPresetDevicePlatform(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'artboardPresets.orientation',
      value: payload.platform
    }));
    // ipcRenderer.invoke('setElectronStore', JSON.stringify({
    //   key: 'artboardPresets.platform',
    //   value: payload.platform
    // }));
  }
};

export const hydrateArtboardPresets = (payload: ArtboardPresetsState): ArtboardPresetsTypes => ({
  type: HYDRATE_ARTBOARD_PRESETS,
  payload
});