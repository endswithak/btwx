import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { uiPaperScope } from '../../canvas';
import { getActiveArtboardBounds, getAllPaperScopes, getCanvasBounds, getSelectedBounds } from '../selectors/layer';

export const zoomInThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allPaperScopes = getAllPaperScopes(state);
    allPaperScopes.forEach((current, index) => {
      const paperScope = uiPaperScope.projects[current];
      paperScope.view.zoom *= 2;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomOutThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allPaperScopes = getAllPaperScopes(state);
    allPaperScopes.forEach((current, index) => {
      const paperScope = uiPaperScope.projects[current];
      if (paperScope.view.zoom / 2 >= 0.01) {
        paperScope.view.zoom /= 2;
      } else {
        paperScope.view.zoom = 0.01;
      }
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomPercentThunk = (percent: number) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allPaperScopes = getAllPaperScopes(state);
    allPaperScopes.forEach((current, index) => {
      const paperScope = uiPaperScope.projects[current];
      paperScope.view.zoom = percent;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomFitCanvasThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allPaperScopes = getAllPaperScopes(state);
    const canvasBounds = getCanvasBounds(state);
    const canvasCenter = canvasBounds.center;
    const viewWidth: number = uiPaperScope.view.bounds.width;
    const viewHeight: number = uiPaperScope.view.bounds.height;
    const canvasWidth: number = canvasBounds.width;
    const canvasHeight: number = canvasBounds.height;
    const viewRatio: number = viewWidth / viewHeight;
    const canvasRatio: number = canvasWidth / canvasHeight;
    const constrainingDim = viewRatio > canvasRatio ? { dim: canvasHeight, type: 'height' } : { dim: canvasWidth, type: 'width' };
    const viewDim = (() => {
      switch(constrainingDim.type) {
        case 'height':
          return viewHeight;
        case 'width':
          return viewWidth;
      }
    })();
    const newZoom = (viewDim / constrainingDim.dim) * uiPaperScope.view.zoom;
    allPaperScopes.forEach((current, index) => {
      const paperScope = uiPaperScope.projects[current];
      paperScope.view.center = canvasCenter;
      paperScope.view.zoom = newZoom;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomFitSelectedThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allPaperScopes = getAllPaperScopes(state);
    const selectionBounds = getSelectedBounds(state);
    const selectionCenter = selectionBounds.center;
    const viewWidth: number = uiPaperScope.view.bounds.width;
    const viewHeight: number = uiPaperScope.view.bounds.height;
    const selectionWidth: number = selectionBounds.width;
    const selectionHeight: number = selectionBounds.height;
    const viewRatio: number = viewWidth / viewHeight;
    const selectionRatio: number = selectionWidth / selectionHeight;
    const constrainingDim = viewRatio > selectionRatio ? {dim: selectionHeight, type: 'height'} : {dim: selectionWidth, type: 'width'};
    const viewDim = (() => {
      switch(constrainingDim.type) {
        case 'height':
          return viewHeight;
        case 'width':
          return viewWidth;
      }
    })();
    const newZoom = (viewDim / constrainingDim.dim) * uiPaperScope.view.zoom;
    allPaperScopes.forEach((current, index) => {
      const paperScope = uiPaperScope.projects[current];
      paperScope.view.center = selectionCenter;
      paperScope.view.zoom = newZoom;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomFitActiveArtboardThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allPaperScopes = getAllPaperScopes(state);
    const activeArtboardBounds = getActiveArtboardBounds(state);
    const activeArtboardCenter = activeArtboardBounds.center;
    const viewWidth: number = uiPaperScope.view.bounds.width;
    const viewHeight: number = uiPaperScope.view.bounds.height;
    const activeArtboardWidth: number = activeArtboardBounds.width;
    const activeArtboardHeight: number = activeArtboardBounds.height;
    const viewRatio: number = viewWidth / viewHeight;
    const activeArtboardRatio: number = activeArtboardWidth / activeArtboardHeight;
    const constrainingDim = viewRatio > activeArtboardRatio ? {dim: activeArtboardHeight, type: 'height'} : {dim: activeArtboardWidth, type: 'width'};
    const viewDim = (() => {
      switch(constrainingDim.type) {
        case 'height':
          return viewHeight;
        case 'width':
          return viewWidth;
      }
    })();
    const newZoom = (viewDim / constrainingDim.dim) * uiPaperScope.view.zoom;
    allPaperScopes.forEach((current, index) => {
      const paperScope = uiPaperScope.projects[current];
      paperScope.view.center = activeArtboardCenter;
      paperScope.view.zoom = newZoom;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};