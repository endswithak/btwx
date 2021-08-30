import {
  ENABLE_VECTOR_EDIT_TOOL,
  DISABLE_VECTOR_EDIT_TOOL,
  SET_VECTOR_EDIT_TOOL_LAYER_ID,
  SET_VECTOR_EDIT_TOOL_PATH_DATA,
  SET_VECTOR_EDIT_TOOL_SEGMENTS,
  SET_VECTOR_EDIT_TOOL_CURVE_HOVER,
  SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT,
  VectorEditToolTypes,
} from '../actionTypes/vectorEditTool';

export interface VectorEditState {
  isEnabled: boolean;
  layerId: string;
  pathData: string;
  segments: number[][][];
  curveHover: (number[][][]|number[]|number)[];
  selectedSegment: number[][];
  selectedSegmentType: Btwx.SelectedSegmentType;
}

const initialState: VectorEditState = {
  isEnabled: false,
  layerId: null,
  pathData: null,
  segments: null,
  curveHover: null,
  selectedSegment: null,
  selectedSegmentType: null
};

export default (state = initialState, action: VectorEditToolTypes): VectorEditState => {
  switch (action.type) {
    case ENABLE_VECTOR_EDIT_TOOL: {
      return {
        ...state,
        isEnabled: true,
        layerId: action.payload.layerId,
        pathData: action.payload.pathData,
        segments: action.payload.segments,
        curveHover: action.payload.curveHover,
        selectedSegment: action.payload.selectedSegment,
        selectedSegmentType: action.payload.selectedSegmentType
      };
    }
    case DISABLE_VECTOR_EDIT_TOOL: {
      return {
        ...state,
        isEnabled: false,
        layerId: null,
        pathData: null,
        segments: null,
        curveHover: null,
        selectedSegment: null,
        selectedSegmentType: null
      };
    }
    case SET_VECTOR_EDIT_TOOL_LAYER_ID: {
      return {
        ...state,
        layerId: action.payload.layerId
      };
    }
    case SET_VECTOR_EDIT_TOOL_PATH_DATA: {
      return {
        ...state,
        pathData: action.payload.pathData
      };
    }
    case SET_VECTOR_EDIT_TOOL_SEGMENTS: {
      return {
        ...state,
        segments: action.payload.segments
      };
    }
    case SET_VECTOR_EDIT_TOOL_CURVE_HOVER: {
      return {
        ...state,
        curveHover: action.payload.curveHover
      };
    }
    case SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT: {
      return {
        ...state,
        selectedSegment: action.payload.selectedSegment,
        selectedSegmentType: action.payload.selectedSegmentType
      };
    }
    default:
      return state;
  }
}
