export const SET_CANVAS_ACTIVE_TOOL = 'SET_CANVAS_ACTIVE_TOOL';
export const SET_CANVAS_DRAWING = 'SET_CANVAS_DRAWING';
export const SET_CANVAS_TYPING = 'SET_CANVAS_TYPING';
export const SET_CANVAS_RESIZING = 'SET_CANVAS_RESIZING';
export const SET_CANVAS_SELECTING = 'SET_CANVAS_SELECTING';
export const SET_CANVAS_DRAGGING = 'SET_CANVAS_DRAGGING';
export const SET_CANVAS_ZOOMING = 'SET_CANVAS_ZOOMING';
export const SET_CANVAS_MEASURING = 'SET_CANVAS_MEASURING';
export const SET_CANVAS_FOCUSING = 'SET_CANVAS_FOCUSING';
export const RESET_CANVAS_SETTINGS = 'RESET_CANVAS_SETTINGS';
export const SET_CANVAS_MOUSE_POSITION = 'SET_CANVAS_MOUSE_POSITION';

export interface SetCanvasActiveToolPayload {
  activeTool: em.ToolType;
}

export interface SetCanvasActiveTool {
  type: typeof SET_CANVAS_ACTIVE_TOOL;
  payload: SetCanvasActiveToolPayload;
}

export interface SetCanvasDrawingPayload {
  drawing: boolean;
}

export interface SetCanvasDrawing {
  type: typeof SET_CANVAS_DRAWING;
  payload: SetCanvasDrawingPayload;
}

export interface SetCanvasTypingPayload {
  typing: boolean;
}

export interface SetCanvasTyping {
  type: typeof SET_CANVAS_TYPING;
  payload: SetCanvasTypingPayload;
}

export interface SetCanvasResizingPayload {
  resizing: boolean;
}

export interface SetCanvasResizing {
  type: typeof SET_CANVAS_RESIZING;
  payload: SetCanvasResizingPayload;
}

export interface SetCanvasSelectingPayload {
  selecting: boolean;
}

export interface SetCanvasSelecting {
  type: typeof SET_CANVAS_SELECTING;
  payload: SetCanvasSelectingPayload;
}

export interface SetCanvasDraggingPayload {
  dragging: boolean;
}

export interface SetCanvasDragging {
  type: typeof SET_CANVAS_DRAGGING;
  payload: SetCanvasDraggingPayload;
}

export interface SetCanvasZoomingPayload {
  zooming: boolean;
}

export interface SetCanvasZooming {
  type: typeof SET_CANVAS_ZOOMING;
  payload: SetCanvasZoomingPayload;
}

export interface SetCanvasMeasuringPayload {
  measuring: boolean;
}

export interface SetCanvasMeasuring {
  type: typeof SET_CANVAS_MEASURING;
  payload: SetCanvasMeasuringPayload;
}

export interface SetCanvasFocusingPayload {
  focusing: boolean;
}

export interface SetCanvasFocusing {
  type: typeof SET_CANVAS_FOCUSING;
  payload: SetCanvasFocusingPayload;
}

export interface ResetCanvasSettings {
  type: typeof RESET_CANVAS_SETTINGS;
}

export interface SetCanvasMousePositionPayload {
  mouse: {
    x: number;
    y: number;
    paperX: number;
    paperY: number;
  };
}

export interface SetCanvasMousePosition {
  type: typeof SET_CANVAS_MOUSE_POSITION;
  payload: SetCanvasMousePositionPayload;
}

export type CanvasSettingsTypes = SetCanvasActiveTool |
                                  SetCanvasDrawing |
                                  SetCanvasTyping |
                                  SetCanvasResizing |
                                  SetCanvasSelecting |
                                  SetCanvasDragging |
                                  SetCanvasZooming |
                                  SetCanvasMeasuring |
                                  SetCanvasFocusing |
                                  ResetCanvasSettings |
                                  SetCanvasMousePosition;