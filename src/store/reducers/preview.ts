import {
  OPEN_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
  PreviewTypes
} from '../actionTypes/preview';

export interface PreviewState {
  isOpen: boolean;
  recording: boolean;
}

export const initialState: PreviewState = {
  isOpen: false,
  recording: false
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
    default:
      return state;
  }
}
