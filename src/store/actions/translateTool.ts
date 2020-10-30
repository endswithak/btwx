import { RootState } from '../reducers';
import { setCanvasActiveTool, setCanvasTranslating } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { updateInViewLayers } from './layer';
import { getSelectionCenter } from '../selectors/layer';
import { paperMain } from '../../canvas';

export const enableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: 'Translate', translating: true}));
  }
};

export const disableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: null, translating: false}));
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    // dispatch(updateInViewLayers());
  }
};

export const centerSelectedThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.present.selected.length > 0) {
      dispatch(setCanvasTranslating({translating: true}));
      const selectionCenter = getSelectionCenter();
      paperMain.view.center = selectionCenter;
      dispatch(setCanvasTranslating({translating: false}));
      // dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
      // dispatch(updateInViewLayers());
    }
  }
};