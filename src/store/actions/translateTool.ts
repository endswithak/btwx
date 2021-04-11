import { RootState } from '../reducers';
import { setCanvasActiveTool, setCanvasTranslating } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { paperMain } from '../../canvas';
import { getSelectedBounds, getAllProjectIndices } from '../selectors/layer';

export const enableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: 'Translate', translating: true}));
  }
};

export const disableTranslateToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: null, translating: false}));
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
  }
};

export const centerSelectedThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.present.selected.length > 0) {
      const selectedBounds = getSelectedBounds(state);
      const allProjectIndices = getAllProjectIndices(state);
      allProjectIndices.forEach((current, index) => {
        const project = paperMain.projects[current];
        project.view.center = selectedBounds.center;
      });
      dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    }
  }
};