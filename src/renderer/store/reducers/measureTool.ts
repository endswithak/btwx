import {
  ENABLE_MEASURE_TOOL,
  DISABLE_MEASURE_TOOL,
  MeasureToolTypes,
} from '../actionTypes/measureTool';

export interface MeasureToolState {
  isEnabled: boolean;
  bounds: number[];
  measureTo: {
    top?: number[];
    bottom?: number[];
    left?: number[];
    right?: number[];
    all?: number[];
  }
}

const initialState: MeasureToolState = {
  isEnabled: false,
  bounds: null,
  measureTo: {
    top: null,
    bottom: null,
    left: null,
    right: null,
    all: null
  }
};

export default (state = initialState, action: MeasureToolTypes): MeasureToolState => {
  switch (action.type) {
    case ENABLE_MEASURE_TOOL: {
      return {
        ...state,
        isEnabled: true,
        bounds: action.payload.bounds,
        measureTo: action.payload.measureTo
      };
    }
    case DISABLE_MEASURE_TOOL: {
      return {
        ...state,
        isEnabled: false,
        bounds: null,
        measureTo: {
          top: null,
          bottom: null,
          left: null,
          right: null,
          all: null
        }
      };
    }
    default:
      return state;
  }
}
