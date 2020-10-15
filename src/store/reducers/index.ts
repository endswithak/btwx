import { combineReducers } from 'redux';
import { RootAction } from '../actionTypes';
import layer from './layer';
import contextMenu from './contextMenu';
import tweenDrawer from './tweenDrawer';
import easeEditor from './easeEditor';
import colorEditor from './colorEditor';
import gradientEditor from './gradientEditor';
import artboardPresetEditor from './artboardPresetEditor';
import textEditor from './textEditor';
import textSettings from './textSettings';
import canvasSettings from './canvasSettings';
import documentSettings from './documentSettings';
import viewSettings from './viewSettings';
import rightSidebar from './rightSidebar';
import leftSidebar from './leftSidebar';
import preview from './preview';
import insertKnob from './insertKnob';
import shapeTool from './shapeTool';
import artboardTool from './artboardTool';
import textTool from './textTool';
import { importPaperProject } from '../selectors/layer';
import { paperMain } from '../../canvas';
import { OPEN_DOCUMENT } from '../actionTypes/documentSettings';
import { HYDRATE_PREVIEW } from '../actionTypes/preview';

export const reducers = {
  layer,
  documentSettings,
  canvasSettings,
  viewSettings,
  contextMenu,
  tweenDrawer,
  easeEditor,
  textEditor,
  textSettings,
  colorEditor,
  gradientEditor,
  artboardPresetEditor,
  rightSidebar,
  leftSidebar,
  preview,
  insertKnob,
  shapeTool,
  artboardTool,
  textTool
};

const appReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState, action: RootAction): RootState => {
  let currentState = state;
  switch (action.type) {
    case OPEN_DOCUMENT: {
      currentState = {
        ...currentState,
        layer: {
          ...currentState.layer,
          present: action.payload.document.layer
        },
        documentSettings: action.payload.document.documentSettings
      };
      const canvas = document.getElementById('canvas-container') as HTMLCanvasElement;
      importPaperProject({
        paperProject: currentState.layer.present.paperProject,
        documentImages: currentState.documentSettings.images.byId
      });
      paperMain.view.viewSize = new paperMain.Size(canvas.clientWidth, canvas.clientHeight);
      paperMain.view.matrix.set(currentState.documentSettings.matrix);
      return currentState;
    }
    case HYDRATE_PREVIEW: {
      return action.payload.state;
    }
    default: {
      return appReducer(state, action);
    }
  }
}

export default rootReducer;