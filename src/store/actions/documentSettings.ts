import { v4 as uuidv4 } from 'uuid';
import { ipcRenderer, remote } from 'electron';
import { ActionCreators } from 'redux-undo';
import fs from 'fs';
import path from 'path';
import { RootState } from '../reducers';
import { APP_NAME } from '../../constants';

import {
  OPEN_DOCUMENT,
  SAVE_DOCUMENT_AS,
  SAVE_DOCUMENT,
  ADD_DOCUMENT_IMAGE,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  OpenDocumentPayload,
  SaveDocumentAsPayload,
  SaveDocumentPayload,
  AddDocumentImagePayload,
  SetCanvasMatrixPayload,
  SetCanvasColorFormatPayload,
  AddArtboardPresetPayload,
  RemoveArtboardPresetPayload,
  UpdateArtboardPresetPayload,
  SetArtboardPresetDeviceOrientationPayload,
  SetArtboardPresetDevicePlatformPayload,
  DocumentSettingsTypes
} from '../actionTypes/documentSettings';

export const openDocument = (payload: OpenDocumentPayload): DocumentSettingsTypes => ({
  type: OPEN_DOCUMENT,
  payload
});

export const saveDocumentAs = (payload: SaveDocumentAsPayload): DocumentSettingsTypes => ({
  type: SAVE_DOCUMENT_AS,
  payload: {
    ...payload,
    id: uuidv4()
  }
});

export const saveDocument = (payload: SaveDocumentPayload): DocumentSettingsTypes => ({
  type: SAVE_DOCUMENT,
  payload
});

export const addDocumentImage = (payload: AddDocumentImagePayload): DocumentSettingsTypes => ({
  type: ADD_DOCUMENT_IMAGE,
  payload
});

export const setCanvasMatrix = (payload: SetCanvasMatrixPayload): DocumentSettingsTypes => ({
  type: SET_CANVAS_MATRIX,
  payload
});

export const setCanvasColorFormat = (payload: SetCanvasColorFormatPayload): DocumentSettingsTypes => ({
  type: SET_CANVAS_COLOR_FORMAT,
  payload
});

export const addArtboardPreset = (payload: AddArtboardPresetPayload): DocumentSettingsTypes => ({
  type: ADD_ARTBOARD_PRESET,
  payload
});

export const updateArtboardPreset = (payload: UpdateArtboardPresetPayload): DocumentSettingsTypes => ({
  type: UPDATE_ARTBOARD_PRESET,
  payload
});

export const removeArtboardPreset = (payload: RemoveArtboardPresetPayload): DocumentSettingsTypes => ({
  type: REMOVE_ARTBOARD_PRESET,
  payload
});

export const setArtboardPresetDeviceOrientation = (payload: SetArtboardPresetDeviceOrientationPayload): DocumentSettingsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  payload
});

export const setArtboardPresetDevicePlatform = (payload: SetArtboardPresetDevicePlatformPayload): DocumentSettingsTypes => ({
  type: SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  payload
});

export const openDocumentThunk = (filePath: string) => {
  return (dispatch: any, getState: any): void => {
    // const state = getState() as RootState;
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
      if(err) {
        return console.log(err);
      } else {
        ipcRenderer.send('createNewDocument', data);
      }
    });
    // const editState = {
    //   edit: state.layer.present.edit,
    //   dirty: state.documentSettings.edit !== state.layer.present.edit,
    //   path: state.documentSettings.path,
    //   name: state.documentSettings.name
    // }
    // if (editState.dirty || editState.path) {
    //   fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
    //     if(err) {
    //       return console.log(err);
    //     } else {
    //       ipcRenderer.send('createNewDocument', JSON.stringify(data));
    //       // createNewDocument().then((documentWindow) => {
    //       //   documentWindow.webContents.executeJavaScript(`openFile(${data})`);
    //       // });
    //     }
    //   });
    // } else {
    //   fs.readFile(filePath, {encoding: 'utf-8'}, function(err, document) {
    //     if(err) {
    //       return console.log(err);
    //     } else {
    //       dispatch(openDocument({document} as any));
    //       // dispatch(ActionCreators.clearHistory());
    //       // focusedDocument.webContents.executeJavaScript(`openFile(${data})`);
    //     }
    //   });
    // }
  }
};

export const writeFileThunk = () => {
  return (dispatch: any, getState: any): any => {
    const state = getState() as RootState;
    const { documentSettings, layer } = state;
    const saveState = JSON.stringify({ documentSettings, layer: layer.present });
    fs.writeFile(`${documentSettings.path}.${APP_NAME}`, saveState, function(err) {
      if (err) {
        console.log(`could not save to ${documentSettings.path}.${APP_NAME}`);
      }
    });
  }
};

export const saveDocumentThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.documentSettings.path) {
      dispatch(writeFileThunk());
    } else {
      remote.dialog.showSaveDialog({}).then((result) => {
        if (!result.canceled) {
          const base = path.basename(result.filePath);
          const documentSettings = {base, fullPath: result.filePath};
          dispatch(saveDocumentAs({name: documentSettings.base, path: documentSettings.fullPath, edit: state.layer.present.edit}));
          dispatch(writeFileThunk());
        }
      });
    }
  }
};

export const saveDocumentAsThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    remote.dialog.showSaveDialog({}).then((result) => {
      if (!result.canceled) {
        const base = path.basename(result.filePath);
        const documentSettings = {base, fullPath: result.filePath};
        dispatch(saveDocumentAs({name: documentSettings.base, path: documentSettings.fullPath, edit: state.layer.present.edit}));
        dispatch(writeFileThunk());
      }
    });
  }
};