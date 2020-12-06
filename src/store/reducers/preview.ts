import {
  OPEN_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
  SET_PREVIEW_FOCUSING,
  SET_PREVIEW_WINDOW_ID,
  SET_PREVIEW_DOCUMENT_WINDOW_ID,
  PreviewTypes
} from '../actionTypes/preview';

export interface PreviewState {
  isOpen: boolean;
  recording: boolean;
  focusing: boolean;
  windowId: number;
  documentWindowId: number;
}

export const initialState: PreviewState = {
  isOpen: false,
  recording: false,
  focusing: false,
  windowId: null,
  documentWindowId: null
};

export default (state = initialState, action: PreviewTypes): PreviewState => {
  switch (action.type) {
    case OPEN_PREVIEW: {
      return {
        ...state,
        isOpen: true,
        focusing: true,
        windowId: Object.prototype.hasOwnProperty.call(action.payload, 'windowId') ? action.payload.windowId : state.windowId,
        documentWindowId: Object.prototype.hasOwnProperty.call(action.payload, 'documentWindowId') ? action.payload.documentWindowId : state.documentWindowId
      };
    }
    case CLOSE_PREVIEW: {
      return {
        ...state,
        isOpen: false,
        windowId: null,
        focusing: false
      };
    }
    case START_PREVIEW_RECORDING: {
      return {
        ...state,
        recording: true
      };
    }
    case STOP_PREVIEW_RECORDING: {
      return {
        ...state,
        recording: false
      };
    }
    case SET_PREVIEW_FOCUSING: {
      return {
        ...state,
        focusing: action.payload.focusing
      };
    }
    case SET_PREVIEW_WINDOW_ID: {
      return {
        ...state,
        windowId: action.payload.windowId
      };
    }
    case SET_PREVIEW_DOCUMENT_WINDOW_ID: {
      return {
        ...state,
        documentWindowId: action.payload.documentWindowId
      };
    }
    default:
      return state;
  }
}
