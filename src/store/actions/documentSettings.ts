import { v4 as uuidv4 } from 'uuid';
// import { ipcRenderer, remote } from 'electron';
import { ActionCreators } from 'redux-undo';
// import fs from 'fs';
// import path from 'path';
import { RootState } from '../reducers';
import { APP_NAME } from '../../constants';
import { paperMain } from '../../canvas';
import { updateFramesThunk } from './layer';

import {
  OPEN_DOCUMENT,
  SAVE_DOCUMENT_AS,
  SAVE_DOCUMENT,
  ADD_DOCUMENT_IMAGE,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  HYDRATE_DOCUMENT,
  HydrateDocumentPayload,
  OpenDocumentPayload,
  SaveDocumentAsPayload,
  SaveDocumentPayload,
  AddDocumentImagePayload,
  SetCanvasMatrixPayload,
  SetCanvasColorFormatPayload,
  DocumentSettingsTypes
} from '../actionTypes/documentSettings';

export const openDocument = (payload: OpenDocumentPayload): DocumentSettingsTypes => ({
  type: OPEN_DOCUMENT,
  payload
});

export const hydrateDocument = (payload: HydrateDocumentPayload): DocumentSettingsTypes => ({
  type: HYDRATE_DOCUMENT,
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

export const openDocumentThunk = (filePath: string) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
      if(err) {
        return console.log(err);
      } else {
        if (!state.documentSettings.path && state.layer.present.edit.id === null) {
          // const documentJSON = JSON.parse(data);
          dispatch(hydrateDocument({document: JSON.parse(data)}));
          dispatch(ActionCreators.clearHistory());
          dispatch(updateFramesThunk());
        } else {
          ipcRenderer.send('createNewDocument', data);
        }
      }
    });
  }
};

export const writeFileThunk = () => {
  return (dispatch: any, getState: any): any => {
    const state = getState() as RootState;
    const { documentSettings, layer, viewSettings } = state;
    const saveState = JSON.stringify({
      viewSettings,
      documentSettings: {
        ...documentSettings,
        edit: null
      },
      layer: {
        past: [],
        present: {
          ...layer.present,
          hover: null,
          edit: {
            id: null,
            selectedEdit: null,
            detail: null,
            payload: null,
            actionType: null
          }
        },
        future: []
      }
    });
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
      dispatch(saveDocument({edit: state.layer.present.edit.id}));
      dispatch(writeFileThunk());
    } else {
      remote.dialog.showSaveDialog({}).then((result) => {
        if (!result.canceled) {
          const base = path.basename(result.filePath);
          const documentSettings = {base, fullPath: result.filePath};
          dispatch(saveDocumentAs({
            name: documentSettings.base,
            path: documentSettings.fullPath,
            edit: state.layer.present.edit.id
          }));
          dispatch(writeFileThunk());
        }
      });
    }
  }
};

export const saveDocumentAsThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      remote.dialog.showSaveDialog({}).then((result) => {
        if (!result.canceled) {
          const base = path.basename(result.filePath);
          const documentSettings = {base, fullPath: result.filePath};
          dispatch(saveDocumentAs({
            name: documentSettings.base,
            path: documentSettings.fullPath,
            edit: state.layer.present.edit.id
          }));
          dispatch(writeFileThunk());
          resolve(null);
        } else {
          reject('canceled');
        }
      });
    });
  }
};