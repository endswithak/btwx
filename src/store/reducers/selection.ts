import {
  SET_CAN_ALIGN,
  SET_CAN_DISTRIBUTE,
  SET_CAN_BOOLEAN,
  SET_CAN_GROUP,
  SET_CAN_MASK,
  SET_CAN_MOVE_BACKWARD,
  SET_CAN_MOVE_FORWARD,
  SET_CAN_RESIZE,
  SET_CAN_TOGGLE_FILL,
  SET_CAN_TOGGLE_FLIP,
  SET_CAN_TOGGLE_SHADOW,
  SET_CAN_TOGGLE_STROKE,
  SET_CAN_UNGROUP,
  SET_FILL_ENABLED,
  SET_STROKE_ENABLED,
  SET_SHADOW_ENABLED,
  SET_HORIZONTAL_FLIP_ENABLED,
  SET_VERTICAL_FLIP_ENABLED,
  UPDATE_SELECTION_PROPS,
  SelectionTypes,
} from '../actionTypes/selection';

export interface SelectionState {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  canAlign: boolean;
  canDistribute: boolean;
  canBoolean: boolean;
  canMask: boolean;
  canGroup: boolean;
  canUngroup: boolean;
  canMoveForward: boolean;
  canMoveBackward: boolean;
  canResize: boolean;
  canToggleFill: boolean;
  canToggleStroke: boolean;
  canToggleShadow: boolean;
  canToggleFlip: boolean;
  fillEnabled: boolean;
  strokeEnabled: boolean;
  shadowEnabled: boolean;
  horizontalFlipEnabled: boolean;
  verticalFlipEnabled: boolean;
}

const initialState: SelectionState = {
  bounds: null,
  canAlign: false,
  canDistribute: false,
  canBoolean: false,
  canMask: false,
  canGroup: false,
  canUngroup: false,
  canMoveForward: false,
  canMoveBackward: false,
  canResize: false,
  canToggleFill: false,
  canToggleStroke: false,
  canToggleShadow: false,
  canToggleFlip: false,
  fillEnabled: false,
  strokeEnabled: false,
  shadowEnabled: false,
  horizontalFlipEnabled: false,
  verticalFlipEnabled: false
};

export default (state = initialState, action: SelectionTypes): SelectionState => {
  switch (action.type) {
    case SET_CAN_ALIGN: {
      return {
        ...state,
        canAlign: action.payload.canAlign
      };
    }
    case SET_CAN_DISTRIBUTE: {
      return {
        ...state,
        canDistribute: action.payload.canDistribute
      };
    }
    case SET_CAN_BOOLEAN: {
      return {
        ...state,
        canBoolean: action.payload.canBoolean
      };
    }
    case SET_CAN_MASK: {
      return {
        ...state,
        canMask: action.payload.canMask
      };
    }
    case SET_CAN_GROUP: {
      return {
        ...state,
        canGroup: action.payload.canGroup
      };
    }
    case SET_CAN_UNGROUP: {
      return {
        ...state,
        canUngroup: action.payload.canUngroup
      };
    }
    case SET_CAN_MOVE_FORWARD: {
      return {
        ...state,
        canMoveForward: action.payload.canMoveForward
      };
    }
    case SET_CAN_MOVE_BACKWARD: {
      return {
        ...state,
        canMoveBackward: action.payload.canMoveBackward
      };
    }
    case SET_CAN_RESIZE: {
      return {
        ...state,
        canResize: action.payload.canResize
      };
    }
    case SET_CAN_TOGGLE_FILL: {
      return {
        ...state,
        canToggleFill: action.payload.canToggleFill
      };
    }
    case SET_CAN_TOGGLE_STROKE: {
      return {
        ...state,
        canToggleStroke: action.payload.canToggleStroke
      };
    }
    case SET_CAN_TOGGLE_SHADOW: {
      return {
        ...state,
        canToggleShadow: action.payload.canToggleShadow
      };
    }
    case SET_CAN_TOGGLE_FLIP: {
      return {
        ...state,
        canToggleFlip: action.payload.canToggleFlip
      };
    }
    case SET_FILL_ENABLED: {
      return {
        ...state,
        fillEnabled: action.payload.fillEnabled
      };
    }
    case SET_STROKE_ENABLED: {
      return {
        ...state,
        strokeEnabled: action.payload.strokeEnabled
      };
    }
    case SET_SHADOW_ENABLED: {
      return {
        ...state,
        shadowEnabled: action.payload.shadowEnabled
      };
    }
    case SET_HORIZONTAL_FLIP_ENABLED: {
      return {
        ...state,
        horizontalFlipEnabled: action.payload.horizontalFlipEnabled
      };
    }
    case SET_VERTICAL_FLIP_ENABLED: {
      return {
        ...state,
        verticalFlipEnabled: action.payload.verticalFlipEnabled
      };
    }
    case UPDATE_SELECTION_PROPS: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}
