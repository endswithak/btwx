import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
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

export const centerSelectionThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.present.selected.length > 0) {
      const selectionCenter = getSelectionCenter(state, true);
      paperMain.view.center = selectionCenter;
      dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
      // dispatch(updateInViewLayers());
    }
  }
};