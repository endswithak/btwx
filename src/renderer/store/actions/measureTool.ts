import {
  ENABLE_MEASURE_TOOL,
  DISABLE_MEASURE_TOOL,
  EnableMeasureToolPayload,
  MeasureToolTypes
} from '../actionTypes/measureTool';

export const enableMeasureTool = (payload: EnableMeasureToolPayload): MeasureToolTypes => ({
  type: ENABLE_MEASURE_TOOL,
  payload
});

export const disableMeasureTool = (): MeasureToolTypes => ({
  type: DISABLE_MEASURE_TOOL
});