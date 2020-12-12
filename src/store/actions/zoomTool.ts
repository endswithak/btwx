import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { uiPaperScope } from '../../canvas';
import { getActiveArtboardBounds, getAllProjectIndices, getCanvasBounds, getSelectedBounds } from '../selectors/layer';

export const zoomInThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
    allProjectIndices.forEach((current, index) => {
      const project = uiPaperScope.projects[current];
      project.view.zoom *= 2;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomOutThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
    allProjectIndices.forEach((current, index) => {
      const project = uiPaperScope.projects[current];
      if (project.view.zoom / 2 >= 0.01) {
        project.view.zoom /= 2;
      } else {
        project.view.zoom = 0.01;
      }
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomPercentThunk = (percent: number) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
    allProjectIndices.forEach((current, index) => {
      const project = uiPaperScope.projects[current];
      project.view.zoom = percent;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomFitCanvasThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
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
    allProjectIndices.forEach((current, index) => {
      const project = uiPaperScope.projects[current];
      project.view.center = canvasCenter;
      project.view.zoom = newZoom;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomFitSelectedThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
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
    allProjectIndices.forEach((current, index) => {
      const project = uiPaperScope.projects[current];
      project.view.center = selectionCenter;
      project.view.zoom = newZoom;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};

export const zoomFitActiveArtboardThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const allProjectIndices = getAllProjectIndices(state);
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
    allProjectIndices.forEach((current, index) => {
      const project = uiPaperScope.projects[current];
      project.view.center = activeArtboardCenter;
      project.view.zoom = newZoom;
    });
    dispatch(setCanvasMatrix({matrix: uiPaperScope.view.matrix.values}));
  }
};