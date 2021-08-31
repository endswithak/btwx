export const ENABLE_MEASURE_TOOL = 'ENABLE_MEASURE_TOOL';
export const DISABLE_MEASURE_TOOL = 'DISABLE_MEASURE_TOOL';

export interface EnableMeasureToolPayload {
  bounds: number[];
  measureTo: {
    top?: number[];
    bottom?: number[];
    left?: number[];
    right?: number[];
    all?: number[];
  }
}

interface EnableMeasureTool {
  type: typeof ENABLE_MEASURE_TOOL;
  payload: EnableMeasureToolPayload;
}

interface DisableMeasureTool {
  type: typeof DISABLE_MEASURE_TOOL;
}

export type MeasureToolTypes = EnableMeasureTool |
                               DisableMeasureTool;