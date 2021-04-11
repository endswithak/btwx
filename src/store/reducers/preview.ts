import {
  OPEN_PREVIEW,
  CLOSE_PREVIEW,
  START_PREVIEW_RECORDING,
  STOP_PREVIEW_RECORDING,
  SET_PREVIEW_FOCUSING,
  SET_PREVIEW_TWEENING,
  SET_PREVIEW_DEVICE,
  TOGGLE_PREVIEW_DEVICE_ORIENTATION,
  PreviewTypes
} from '../actionTypes/preview';

export interface PreviewState {
  isOpen: boolean;
  recording: boolean;
  focusing: boolean;
  tweening: string;
  device: {
    id: string;
    color: string;
    orientation: Btwx.Orientation;
  }
}

export const initialState: PreviewState = {
  isOpen: false,
  recording: false,
  focusing: false,
  tweening: null,
  device: {
    id: null,
    color: null,
    orientation: 'Portrait'
  }
};

export default (state = initialState, action: PreviewTypes): PreviewState => {
  switch (action.type) {
    case OPEN_PREVIEW: {
      return {
        ...state,
        isOpen: true,
        focusing: true
      };
    }
    case CLOSE_PREVIEW: {
      return {
        ...state,
        isOpen: false,
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
    case SET_PREVIEW_TWEENING: {
      return {
        ...state,
        tweening: action.payload.tweening
      };
    }
    case SET_PREVIEW_DEVICE: {
      return {
        ...state,
        device: {
          ...state.device,
          id: action.payload.device,
          color: action.payload.deviceColor
        }
      };
    }
    case TOGGLE_PREVIEW_DEVICE_ORIENTATION: {
      return {
        ...state,
        device: {
          ...state.device,
          orientation: state.device.orientation === 'Portrait' ? 'Landscape' : 'Portrait'
        }
      };
    }
    default:
      return state;
  }
}
