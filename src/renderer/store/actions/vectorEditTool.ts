import { getPaperLayer } from '../selectors/layer';
import { paperMain } from '../../canvas';
import { RootState } from '../reducers';

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
    const state = getState() as RootState;
    const paperLayer = getPaperLayer(id, projectIndex) as paper.PathItem;
    const segments: number[][][] = [];
    const compoundPaths: paper.PathItem[] = [paperLayer];
    let i = 0;
    while(i < compoundPaths.length) {
      const layer = compoundPaths[i];
      if (layer.hasChildren()) {
        layer.children.forEach((child) => {
          if (child.hasChildren()) {
            compoundPaths.push(child as paper.PathItem);
          } else {
            if ((child as paper.Path).segments && (child as paper.Path).segments.length > 0) {
              (child as paper.Path).segments.forEach((seg) => {
                const point = [seg.point.x, seg.point.y];
                const handleIn = seg.handleIn ? [seg.handleIn.x, seg.handleIn.y] : null;
                const handleOut = seg.handleOut ? [seg.handleOut.x, seg.handleOut.y] : null;
                segments.push([point, handleIn, handleOut]);
              });
            }
          }
        });
      } else {
        if ((layer as paper.Path).segments && (layer as paper.Path).segments.length > 0) {
          (layer as paper.Path).segments.forEach((seg) => {
            const point = [seg.point.x, seg.point.y];
            const handleIn = seg.handleIn ? [seg.handleIn.x, seg.handleIn.y] : null;
            const handleOut = seg.handleOut ? [seg.handleOut.x, seg.handleOut.y] : null;
            segments.push([point, handleIn, handleOut]);
          });
        }
      }
      i++;
    }
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