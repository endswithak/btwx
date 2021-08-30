export const ENABLE_VECTOR_EDIT_TOOL = 'ENABLE_VECTOR_EDIT_TOOL';
export const DISABLE_VECTOR_EDIT_TOOL = 'DISABLE_VECTOR_EDIT_TOOL';
export const SET_VECTOR_EDIT_TOOL_LAYER_ID = 'SET_VECTOR_EDIT_TOOL_LAYER_ID';
export const SET_VECTOR_EDIT_TOOL_PATH_DATA = 'SET_VECTOR_EDIT_TOOL_PATH_DATA';
export const SET_VECTOR_EDIT_TOOL_SEGMENTS = 'SET_VECTOR_EDIT_TOOL_SEGMENTS';
export const SET_VECTOR_EDIT_TOOL_CURVE_HOVER = 'SET_VECTOR_EDIT_TOOL_CURVE_HOVER';
export const SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT = 'SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT';

export interface EnableVectorEditToolPayload {
  layerId: string;
  pathData: string;
  segments: number[][][];
  curveHover: (number[][][]|number[]|number)[];
  selectedSegment: number[][];
  selectedSegmentType: Btwx.SelectedSegmentType;
}

interface EnableVectorEditTool {
  type: typeof ENABLE_VECTOR_EDIT_TOOL;
  payload: EnableVectorEditToolPayload;
}

interface DisableVectorEditTool {
  type: typeof DISABLE_VECTOR_EDIT_TOOL;
}

export interface SetVectorEditToolLayerIdPayload {
  layerId: string;
}

interface SetVectorEditToolLayerId {
  type: typeof SET_VECTOR_EDIT_TOOL_LAYER_ID;
  payload: SetVectorEditToolLayerIdPayload;
}

export interface SetVectorEditToolPathDataPayload {
  pathData: string;
}

interface SetVectorEditToolPathData {
  type: typeof SET_VECTOR_EDIT_TOOL_PATH_DATA;
  payload: SetVectorEditToolPathDataPayload;
}

export interface SetVectorEditToolSegmentsPayload {
  segments: number[][][];
}

interface SetVectorEditToolSegments {
  type: typeof SET_VECTOR_EDIT_TOOL_SEGMENTS;
  payload: SetVectorEditToolSegmentsPayload;
}

export interface SetVectorEditToolCurveHoverPayload {
  curveHover: (number[][][]|number[]|number)[];
}

interface SetVectorEditToolCurveHover {
  type: typeof SET_VECTOR_EDIT_TOOL_CURVE_HOVER;
  payload: SetVectorEditToolCurveHoverPayload;
}

export interface SetVectorEditToolSelectedSegmentPayload {
  selectedSegment: number[][];
  selectedSegmentType: Btwx.SelectedSegmentType;
}

interface SetVectorEditToolSelectedSegment {
  type: typeof SET_VECTOR_EDIT_TOOL_SELECTED_SEGMENT;
  payload: SetVectorEditToolSelectedSegmentPayload;
}

export type VectorEditToolTypes = EnableVectorEditTool |
                                  DisableVectorEditTool |
                                  SetVectorEditToolLayerId |
                                  SetVectorEditToolPathData |
                                  SetVectorEditToolSegments |
                                  SetVectorEditToolCurveHover |
                                  SetVectorEditToolSelectedSegment;