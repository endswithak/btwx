import {
  ENABLE_RECTANGLE_SHAPE_TOOL,
  ENABLE_ELLIPSE_SHAPE_TOOL,
  ENABLE_STAR_SHAPE_TOOL,
  ENABLE_POLYGON_SHAPE_TOOL,
  ENABLE_ROUNDED_SHAPE_TOOL,
  ENABLE_SELECTION_TOOL,
  DISABLE_SELECTION_TOOL,
  ENABLE_DRAG_TOOL,
  ENABLE_ARTBOARD_TOOL,
  ENABLE_TEXT_TOOL,
  SET_ARTBOARD_TOOL_DEVICE_ORIENTATION,
  SET_ARTBOARD_TOOL_DEVICE_PLATFORM,
  SetArtboardToolDeviceOrientationPayload,
  SetArtboardToolDevicePlatformPayload,
  ToolTypes
} from '../actionTypes/tool';

export const enableRectangleShapeTool = (): ToolTypes => ({
  type: ENABLE_RECTANGLE_SHAPE_TOOL
});

export const enableEllipseShapeTool = (): ToolTypes => ({
  type: ENABLE_ELLIPSE_SHAPE_TOOL
});

export const enableStarShapeTool = (): ToolTypes => ({
  type: ENABLE_STAR_SHAPE_TOOL
});

export const enablePolygonShapeTool = (): ToolTypes => ({
  type: ENABLE_POLYGON_SHAPE_TOOL
});

export const enableRoundedShapeTool = (): ToolTypes => ({
  type: ENABLE_ROUNDED_SHAPE_TOOL
});

export const enableSelectionTool = (): ToolTypes => ({
  type: ENABLE_SELECTION_TOOL
});

export const disableSelectionTool = (): ToolTypes => ({
  type: DISABLE_SELECTION_TOOL
});

export const enableDragTool = (): ToolTypes => ({
  type: ENABLE_DRAG_TOOL
});

export const enableTextTool = (): ToolTypes => ({
  type: ENABLE_TEXT_TOOL
});

export const enableArtboardTool = (): ToolTypes => ({
  type: ENABLE_ARTBOARD_TOOL
});

export const setArtboardToolDeviceOrientation = (payload: SetArtboardToolDeviceOrientationPayload): ToolTypes => ({
  type: SET_ARTBOARD_TOOL_DEVICE_ORIENTATION,
  payload
});

export const setArtboardToolDevicePlatform = (payload: SetArtboardToolDevicePlatformPayload): ToolTypes => ({
  type: SET_ARTBOARD_TOOL_DEVICE_PLATFORM,
  payload
});