import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { updateInViewLayers } from './layer';
import { paperMain } from '../../canvas';
import { getSelectionBounds, getCanvasBounds, getSelectionCenter, getCanvasCenter } from '../selectors/layer';
import { LayerState } from '../reducers/layer';

export const enableZoomToolThunk = (zoomType: em.ZoomType) => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: 'Zoom', zooming: true, zoomType: zoomType ? zoomType : 'in'}));
  }
};

export const disableZoomToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasActiveTool({activeTool: null, zooming: false, zoomType: null}));
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    dispatch(updateInViewLayers());
  }
};

export const zoomInThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableZoomToolThunk('in'));
    paperMain.view.zoom *= 2;
    dispatch(disableZoomToolThunk());
  }
};

export const zoomOutThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableZoomToolThunk('out'));
    if (paperMain.view.zoom / 2 >= 0.01) {
      paperMain.view.zoom /= 2;
    } else {
      paperMain.view.zoom = 0.01;
    }
    dispatch(disableZoomToolThunk());
  }
};

export const zoomPercentThunk = (percent: number) => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableZoomToolThunk('in'));
    paperMain.view.zoom = percent;
    dispatch(disableZoomToolThunk());
  }
};

export const zoomCanvasThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const canCanvasZoom = state.layer.present.allIds.length > 1;
    if (canCanvasZoom) {
      dispatch(enableZoomToolThunk('in'));
      const canvasBounds = getCanvasBounds({allIds: state.layer.present.allIds, byId: state.layer.present.byId} as LayerState, true);
      const canvasCenter = getCanvasCenter({allIds: state.layer.present.allIds, byId: state.layer.present.byId} as LayerState, true);
      const viewWidth: number = paperMain.view.bounds.width;
      const viewHeight: number = paperMain.view.bounds.height;
      const canvasWidth: number = canvasBounds.width;
      const canvasHeight: number = canvasBounds.height;
      const viewRatio: number = viewWidth / viewHeight;
      const canvasRatio: number = canvasWidth / canvasHeight;
      const constrainingDim = viewRatio > canvasRatio ? {dim: canvasHeight, type: 'height'} : {dim: canvasWidth, type: 'width'};
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
      dispatch(disableZoomToolThunk());
    }
  }
};

export const zoomSelectionThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const selected = state.layer.present.selected;
    const canSelectedZoom = selected.length > 0;
    if (canSelectedZoom) {
      dispatch(enableZoomToolThunk('in'));
      const selectionBounds = getSelectionBounds({selected: selected, byId: state.layer.present.byId} as LayerState, true);
      const selectionCenter = getSelectionCenter({selected: selected, byId: state.layer.present.byId} as LayerState, true);
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
      dispatch(disableZoomToolThunk());
    }
  }
};