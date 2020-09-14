import {
  OPEN_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
  ENABLE_TOUCH_CURSOR,
  DISABLE_TOUCH_CURSOR,
  PreviewTypes
} from '../actionTypes/preview';

export interface PreviewState {
  isOpen: boolean;
  recording: boolean;
  touchCursor: boolean;
}

export const initialState: PreviewState = {
  isOpen: false,
  recording: false,
  touchCursor: false
};

export default (state = initialState, action: PreviewTypes): PreviewState => {
  switch (action.type) {
    case OPEN_PREVIEW: {
      return {
        ...state,
        isOpen: true
      };
    }
    case CLOSE_PREVIEW: {
      return {
        ...state,
        isOpen: false
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
    case ENABLE_TOUCH_CURSOR: {
      return {
        ...state,
        touchCursor: true
      };
    }
    case DISABLE_TOUCH_CURSOR: {
      return {
        ...state,
        touchCursor: false
      };
    }
    default:
      return state;
  }
}
