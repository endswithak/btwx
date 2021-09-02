import {
  ENABLE_VECTOR_EDIT_TOOL,
  DISABLE_VECTOR_EDIT_TOOL,
  SET_VECTOR_EDIT_TOOL_LAYER_ID,
  SET_VECTOR_EDIT_TOOL_SEGMENTS,
  SET_VECTOR_EDIT_TOOL_CURVE_HOVER,
  SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT,
  SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT_TYPE,
  SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER,
  SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER_TYPE,
  SET_VECTOR_EDIT_TOOL,
  VectorEditToolTypes,
} from '../actionTypes/vectorEditTool';

export interface VectorEditState {
  isEnabled: boolean;
  layerId: string;
  segments: number[][][];
  curveHover: (number[][][]|number[]|number)[];
  selectedSegment: number[][];
  selectedSegmentIndex: number;
  selectedSegmentType: Btwx.SelectedSegmentType;
  segmentHover: number[][];
  segmentHoverIndex: number;
  segmentHoverType: Btwx.SelectedSegmentType;
}

const initialState: VectorEditState = {
  isEnabled: false,
  layerId: null,
  segments: null,
  curveHover: null,
  selectedSegment: null,
  selectedSegmentIndex: null,
  selectedSegmentType: null,
  segmentHover: null,
  segmentHoverIndex: null,
  segmentHoverType: null
};

export default (state = initialState, action: VectorEditToolTypes): VectorEditState => {
  switch (action.type) {
    case ENABLE_VECTOR_EDIT_TOOL: {
      return {
        ...state,
        isEnabled: true,
        layerId: action.payload.layerId,
        segments: action.payload.segments,
        curveHover: action.payload.curveHover,
        selectedSegment: action.payload.selectedSegment,
        selectedSegmentIndex: action.payload.selectedSegmentIndex,
        selectedSegmentType: action.payload.selectedSegmentType
      };
    }
    case DISABLE_VECTOR_EDIT_TOOL: {
      return {
        ...state,
        isEnabled: false,
        layerId: null,
        segments: null,
        curveHover: null,
        selectedSegment: null,
        selectedSegmentIndex: null,
        selectedSegmentType: null,
        segmentHover: null,
        segmentHoverIndex: null,
        segmentHoverType: null
      };
    }
    case SET_VECTOR_EDIT_TOOL_LAYER_ID: {
      return {
        ...state,
        layerId: action.payload.layerId
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
        selectedSegmentIndex: action.payload.selectedSegmentIndex,
        selectedSegmentType: action.payload.selectedSegmentType
      };
    }
    case SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT_TYPE: {
      return {
        ...state,
        selectedSegmentType: action.payload.selectedSegmentType
      };
    }
    case SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER: {
      return {
        ...state,
        segmentHover: action.payload.segmentHover,
        segmentHoverIndex: action.payload.segmentHoverIndex,
        segmentHoverType: action.payload.segmentHoverType
      };
    }
    case SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER_TYPE: {
      return {
        ...state,
        segmentHoverType: action.payload.segmentHoverType
      };
    }
    case SET_VECTOR_EDIT_TOOL: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}
