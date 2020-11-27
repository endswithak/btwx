import { RootState } from '../reducers';
import { setCanvasActiveTool, setCanvasTranslating } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { uiPaperScope } from '../../canvas';
import { getSelectedBounds, getAllPaperScopes } from '../selectors/layer';

export const enableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: 'Translate', translating: true}));
  }
};

export const disableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: null, translating: false}));
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const centerSelectedThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.present.selected.length > 0) {
      const selectedBounds = getSelectedBounds(state);
      const paperScopes = getAllPaperScopes(state);
      Object.keys(paperScopes).forEach((key, index) => {
        const paperScope = paperScopes[key];
        paperScope.view.center = selectedBounds.center;
      });
      dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
    }
  }
};