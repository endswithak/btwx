import { RootState } from '../reducers';
import { setCanvasZooming } from './canvasSettings';
import { setCanvasMatrix } from './documentSettings';
import { updateInViewLayers } from './layer';
import { paperMain } from '../../canvas';
import { getSelectionBounds, getCanvasBounds, getSelectionCenter, getCanvasCenter } from '../selectors/layer';
import { LayerState } from '../reducers/layer';

import {
  ENABLE_ZOOM_TOOL,
  SET_ZOOM_TOOL_TYPE,
  DISABLE_ZOOM_TOOL,
  EnableZoomToolPayload,
  SetZoomToolTypePayload,
  ZoomToolTypes
} from '../actionTypes/zoomTool';

export const enableZoomTool = (payload: EnableZoomToolPayload): ZoomToolTypes => ({
  type: ENABLE_ZOOM_TOOL,
  payload
});

export const enableZoomToolThunk = (payload: EnableZoomToolPayload) => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasZooming({zooming: true}));
    dispatch(enableZoomTool(payload));
  }
};

export const setZoomToolType = (payload: SetZoomToolTypePayload): ZoomToolTypes => ({
  type: SET_ZOOM_TOOL_TYPE,
  payload
});

export const disableZoomTool = (): ZoomToolTypes => ({
  type: DISABLE_ZOOM_TOOL
});

export const disableZoomToolThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(setCanvasZooming({zooming: false}));
    dispatch(disableZoomTool());
    dispatch(setCanvasMatrix({matrix: paperMain.view.matrix.values}));
    dispatch(updateInViewLayers());
  }
};

export const toggleZoomToolThunk = (payload?: EnableZoomToolPayload) => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.zoomTool.isEnabled) {
      dispatch(disableZoomToolThunk());
    } else {
      dispatch(enableZoomToolThunk(payload));
    }
  }
};

export const zoomInThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableZoomToolThunk({zoomType: 'in'}));
    paperMain.view.zoom *= 2;
    dispatch(disableZoomToolThunk());
  }
};

export const zoomOutThunk = () => {
  return (dispatch: any, getState: any): void => {
    dispatch(enableZoomToolThunk({zoomType: 'in'}));
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
    dispatch(enableZoomToolThunk({zoomType: 'in'}));
    paperMain.view.zoom = percent;
    dispatch(disableZoomToolThunk());
  }
};

export const zoomCanvasThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const canCanvasZoom = state.layer.present.allIds.length > 1;
    if (canCanvasZoom) {
      dispatch(enableZoomToolThunk({zoomType: 'in'}));
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
      dispatch(enableZoomToolThunk({zoomType: 'in'}));
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