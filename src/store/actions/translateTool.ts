import { RootState } from '../reducers';
import { setCanvasTranslating } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { updateInViewLayers } from './layer';
import { getSelectionCenter } from '../selectors/layer';
import { paperMain } from '../../canvas';

import {
  ENABLE_TRANSLATE_TOOL,
  DISABLE_TRANSLATE_TOOL,
  TranslateToolTypes
} from '../actionTypes/translateTool';

export const enableTranslateTool = (): TranslateToolTypes => ({
  type: ENABLE_TRANSLATE_TOOL
});

export const enableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasTranslating({translating: true}));
    dispatch(enableTranslateTool());
  }
};

export const disableTranslateTool = (): TranslateToolTypes => ({
  type: DISABLE_TRANSLATE_TOOL
});

export const disableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasTranslating({translating: false}));
    dispatch(disableTranslateTool());
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    dispatch(updateInViewLayers());
  }
};

export const toggleTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.translateTool.isEnabled) {
      dispatch(disableTranslateToolThunk());
    } else {
      dispatch(enableTranslateToolThunk());
    }
  }
};

export const centerSelectionThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.present.selected.length > 0) {
      const selectionCenter = getSelectionCenter(state.layer.present, true);
      paperMain.view.center = selectionCenter;
      dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
      dispatch(updateInViewLayers());
    }
  }
};