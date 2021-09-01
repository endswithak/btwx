import { getPaperLayer } from '../selectors/layer';
import { paperMain } from '../../canvas';
import { RootState } from '../reducers';
import { getPathItemSegments, paperSegToRawSeg } from '../../utils';

import {
  ENABLE_VECTOR_EDIT_TOOL,
  DISABLE_VECTOR_EDIT_TOOL,
  SET_VECTOR_EDIT_TOOL_LAYER_ID,
  SET_VECTOR_EDIT_TOOL_PATH_DATA,
  SET_VECTOR_EDIT_TOOL_SEGMENTS,
  SET_VECTOR_EDIT_TOOL_CURVE_HOVER,
  SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT,
  EnableVectorEditToolPayload,
  SetVectorEditToolLayerIdPayload,
  SetVectorEditToolPathDataPayload,
  SetVectorEditToolSegmentsPayload,
  SetVectorEditToolCurveHoverPayload,
  SetVectorEditToolSelectedSegmentPayload,
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
      paperSegToRawSeg(segment)
    );
    dispatch(enableVectorEditTool({
      layerId: id,
      pathData: paperLayer.pathData,
      curveHover: null,
      segments: segments,
      selectedSegment: segments[0],
      selectedSegmentType: 'point'
    }));
  }
};

export const disableVectorEditTool = (): VectorEditToolTypes => ({
  type: DISABLE_VECTOR_EDIT_TOOL
});

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