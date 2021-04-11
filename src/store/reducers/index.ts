import { combineReducers } from 'redux';
import { RootAction } from '../actionTypes';
import { HYDRATE_DOCUMENT } from '../actionTypes/documentSettings';
import layer from './layer';
import contextMenu from './contextMenu';
import eventDrawer from './eventDrawer';
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
import fontFamilySelector from './fontFamilySelector';
import keyBindings from './keyBindings';
import preferences from './preferences';
import artboardPresets from './artboardPresets';
import session from './session';

export const reducers = {
  layer,
  documentSettings,
  canvasSettings,
  viewSettings,
  contextMenu,
  eventDrawer,
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
  textTool,
  fontFamilySelector,
  keyBindings,
  preferences,
  artboardPresets,
  session
};

const appReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState, action: RootAction): RootState => {
  switch (action.type) {
    case HYDRATE_DOCUMENT: {
      return {
        ...state,
        ...action.payload
      };
    }
    default: {
      return appReducer(state, action);
    }
  }
}

export default rootReducer;