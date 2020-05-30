import { paperMain } from '../../canvas';

import {
  SET_CANVAS_ZOOM,
  CanvasSettingsTypes,
} from '../actionTypes/canvasSettings';

export interface CanvasSettingsState {
  zoom: number;
}

const initialState: CanvasSettingsState = {
  zoom: 1
};

export default (state = initialState, action: CanvasSettingsTypes): CanvasSettingsState => {
  switch (action.type) {
    case SET_CANVAS_ZOOM: {
      paperMain.project.view.zoom = action.payload.zoom;
      return {
        ...state,
        zoom: action.payload.zoom
      };
    }
    default:
      return state;
  }
}
