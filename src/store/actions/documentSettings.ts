import { v4 as uuidv4 } from 'uuid';
import { ActionCreators } from 'redux-undo';
import { updateFramesThunk } from './layer';
import { addSessionImages }  from './session';
import { paperMain } from '../../canvas';
import { RootState } from '../reducers';

import {
  OPEN_DOCUMENT,
  SAVE_DOCUMENT_AS,
  SAVE_DOCUMENT,
  ADD_DOCUMENT_IMAGE,
  REMOVE_DOCUMENT_IMAGE,
  REMOVE_DOCUMENT_IMAGES,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  HYDRATE_DOCUMENT,
  HydrateDocumentPayload,
  OpenDocumentPayload,
  SaveDocumentAsPayload,
  SaveDocumentPayload,
  AddDocumentImagePayload,
  RemoveDocumentImagePayload,
  RemoveDocumentImagesPayload,
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

export const hydrateDocumentThunk = (payload: HydrateDocumentPayload) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const currentViewSettings = state.viewSettings;
    const nextViewSettings = payload.viewSettings;
    const canvasContainer = document.getElementById('canvas-container');
    const currentCanvasViewSize = new paperMain.Size(canvasContainer.clientWidth, canvasContainer.clientHeight);
    const newMatrix = payload.documentSettings.matrix;
    let leftSidebarDiff = 0;
    let rightSidebarDiff = 0;
    let eventDrawerDiff = 0;
    const leftSidebarChange = (
      (currentViewSettings.leftSidebar.isOpen !== nextViewSettings.leftSidebar.isOpen) ||
      (
        (currentViewSettings.leftSidebar.isOpen === nextViewSettings.leftSidebar.isOpen) &&
        (currentViewSettings.leftSidebar.width !== nextViewSettings.leftSidebar.width)
      )
    );
    const rightSidebarChange = currentViewSettings.rightSidebar.isOpen !== nextViewSettings.rightSidebar.isOpen;
    const eventDrawerChange = (
      (currentViewSettings.eventDrawer.isOpen !== nextViewSettings.eventDrawer.isOpen) ||
      (
        (currentViewSettings.eventDrawer.isOpen === nextViewSettings.eventDrawer.isOpen) &&
        (currentViewSettings.eventDrawer.height !== nextViewSettings.eventDrawer.height)
      )
    );
    if (leftSidebarChange) {
      if (currentViewSettings.leftSidebar.isOpen !== nextViewSettings.leftSidebar.isOpen) {
        leftSidebarDiff = currentViewSettings.leftSidebar.isOpen ? -currentViewSettings.leftSidebar.width : -nextViewSettings.leftSidebar.width;
      } else {
        leftSidebarDiff = nextViewSettings.leftSidebar.width - currentViewSettings.leftSidebar.width;
      }
    }
    if (rightSidebarChange) {
      rightSidebarDiff = currentViewSettings.rightSidebar.isOpen ? -currentViewSettings.rightSidebar.width : -nextViewSettings.rightSidebar.width;
    }
    if (eventDrawerChange) {
      if (currentViewSettings.eventDrawer.isOpen !== nextViewSettings.eventDrawer.isOpen) {
        eventDrawerDiff = currentViewSettings.eventDrawer.isOpen ? -currentViewSettings.eventDrawer.height : -nextViewSettings.eventDrawer.height;
      } else {
        eventDrawerDiff = nextViewSettings.eventDrawer.height - currentViewSettings.eventDrawer.height;
      }
    }
    const nextViewWidth = currentCanvasViewSize.width - (leftSidebarDiff + rightSidebarDiff);
    const nextViewHeight = currentCanvasViewSize.height - eventDrawerDiff;
    paperMain.projects[0].view.viewSize = new paperMain.Size(
      nextViewWidth > 0 ? nextViewWidth : 0,
      nextViewHeight > 0 ? nextViewHeight : 0
    );
    paperMain.projects[0].view.matrix.set(newMatrix);
    dispatch(addSessionImages({images: payload.documentSettings.images}));
    dispatch(hydrateDocument(payload));
    dispatch(ActionCreators.clearHistory());
    dispatch(updateFramesThunk());
  }
};

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

export const removeDocumentImage = (payload: RemoveDocumentImagePayload): DocumentSettingsTypes => ({
  type: REMOVE_DOCUMENT_IMAGE,
  payload
});

export const removeDocumentImages = (payload: RemoveDocumentImagesPayload): DocumentSettingsTypes => ({
  type: REMOVE_DOCUMENT_IMAGES,
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