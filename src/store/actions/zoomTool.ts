import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { paperMain } from '../../canvas';
import { getCanvasBounds, getSelectedBounds } from '../selectors/layer';

export const enableZoomToolThunk = (zoomType: Btwx.ZoomType) => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: 'Zoom', zooming: true, zoomType: zoomType ? zoomType : 'in'}));
  }
};

export const disableZoomToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: null, zooming: false, zoomType: null}));
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
  }
};

export const zoomInThunk = () => {
  return (dispatch: any, getState: any): void => {
    paperMain.view.zoom *= 2;
  }
};

export const zoomOutThunk = () => {
  return (dispatch: any, getState: any): void => {
    if (paperMain.view.zoom / 2 >= 0.01) {
      paperMain.view.zoom /= 2;
    } else {
      paperMain.view.zoom = 0.01;
    }
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
  }
};

export const zoomPercentThunk = (percent: number) => {
  return (dispatch: any, getState: any): void => {
    paperMain.view.zoom = percent;
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
  }
};

export const zoomFitCanvasThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const canvasBounds = getCanvasBounds(state.layer.present);
    const canvasCenter = canvasBounds.center;
    const viewWidth: number = paperMain.view.bounds.width;
    const viewHeight: number = paperMain.view.bounds.height;
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
    const newZoom = (viewDim / constrainingDim.dim) * paperMain.view.zoom;
    paperMain.view.center = canvasCenter;
    paperMain.view.zoom = newZoom;
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
  }
};

export const zoomFitSelectedThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const selectionBounds = getSelectedBounds(state);
    const selectionCenter = selectionBounds.center;
    const viewWidth: number = paperMain.view.bounds.width;
    const viewHeight: number = paperMain.view.bounds.height;
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
    const newZoom = (viewDim / constrainingDim.dim) * paperMain.view.zoom;
    paperMain.view.center = selectionCenter;
    paperMain.view.zoom = newZoom;
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
  }
};