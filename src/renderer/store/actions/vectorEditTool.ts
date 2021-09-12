import { getPaperLayer } from '../selectors/layer';
import { paperMain } from '../../canvas';
import { RootState } from '../reducers';
import { setCanvasActiveTool } from './canvasSettings';
import { getPathItemSegments, paperSegmentToRawSegment } from '../../utils';

import {
  ENABLE_VECTOR_EDIT_TOOL,
  DISABLE_VECTOR_EDIT_TOOL,
  SET_VECTOR_EDIT_TOOL_LAYER_ID,
  SET_VECTOR_EDIT_TOOL_PATH_DATA,
  SET_VECTOR_EDIT_TOOL_SEGMENTS,
  SET_VECTOR_EDIT_TOOL_CURVE_HOVER,
  SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT,
  SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT_TYPE,
  SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER,
  SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER_TYPE,
  SET_VECTOR_EDIT_TOOL,
  EnableVectorEditToolPayload,
  SetVectorEditToolLayerIdPayload,
  SetVectorEditToolPathDataPayload,
  SetVectorEditToolSegmentsPayload,
  SetVectorEditToolCurveHoverPayload,
  SetVectorEditToolSelectedSegmentPayload,
  SetVectorEditToolSelectedSegmentTypePayload,
  SetVectorEditToolSegmentHoverPayload,
  SetVectorEditToolSegmentHoverTypePayload,
  SetVectorEditToolPayload,
  VectorEditToolTypes
} from '../actionTypes/vectorEditTool';

export const enableVectorEditTool = (payload: EnableVectorEditToolPayload): VectorEditToolTypes => ({
  type: ENABLE_VECTOR_EDIT_TOOL,
  payload
});

export const enableVectorEditToolThunk = (id: string, projectIndex: number) => {
  return (dispatch: any, getState: any) => {
    const paperLayer = getPaperLayer(id, projectIndex) as paper.PathItem;
    const segments = getPathItemSegments(paperLayer).map((segment) =>
      paperSegmentToRawSegment({segment})
    );
    dispatch(enableVectorEditTool({
      layerId: id,
      curveHover: null,
      segments: segments,
      selectedSegment: segments[0],
      selectedSegmentIndex: 0,
      selectedSegmentType: 'segmentPoint'
    }));
    dispatch(setCanvasActiveTool({
      activeTool: 'VectorEdit'
    }));
  }
};

export const disableVectorEditTool = (): VectorEditToolTypes => ({
  type: DISABLE_VECTOR_EDIT_TOOL
});

export const disableVectorEditToolThunk = () => {
  return (dispatch: any, getState: any) => {
    dispatch(disableVectorEditTool());
    dispatch(setCanvasActiveTool({
      activeTool: null,
      cursor: ['auto']
    }));
  }
};

export const setVectorEditToolLayerId = (payload: SetVectorEditToolLayerIdPayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_LAYER_ID,
  payload
});

export const setVectorEditToolPathData = (payload: SetVectorEditToolPathDataPayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_PATH_DATA,
  payload
});

export const setVectorEditToolSegments = (payload: SetVectorEditToolSegmentsPayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_SEGMENTS,
  payload
});

export const setVectorEditToolCurveHover = (payload: SetVectorEditToolCurveHoverPayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_CURVE_HOVER,
  payload
});

export const setVectorEditToolSelectedSegment = (payload: SetVectorEditToolSelectedSegmentPayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT,
  payload
});

export const setVectorEditToolSelectedSegmentType = (payload: SetVectorEditToolSelectedSegmentTypePayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT_TYPE,
  payload
});

export const setVectorEditToolSegmentHover = (payload: SetVectorEditToolSegmentHoverPayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER,
  payload
});

export const setVectorEditToolSegmentHoverType = (payload: SetVectorEditToolSegmentHoverTypePayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL_SEGMENT_HOVER_TYPE,
  payload
});

export const setVectorEditTool = (payload: SetVectorEditToolPayload): VectorEditToolTypes => ({
  type: SET_VECTOR_EDIT_TOOL,
  payload
});