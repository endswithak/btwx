import {
  EXPAND_SHAPE_STYLES,
  COLLAPSE_SHAPE_STYLES,
  EXPAND_OPACITY_STYLES,
  COLLAPSE_OPACITY_STYLES,
  EXPAND_TEXT_STYLES,
  COLLAPSE_TEXT_STYLES,
  EXPAND_ALIGNMENT_STYLES,
  COLLAPSE_ALIGNMENT_STYLES,
  EXPAND_FILL_STYLES,
  COLLAPSE_FILL_STYLES,
  EXPAND_STROKE_STYLES,
  COLLAPSE_STROKE_STYLES,
  EXPAND_STROKE_OPTIONS_STYLES,
  COLLAPSE_STROKE_OPTIONS_STYLES,
  EXPAND_SHADOW_STYLES,
  COLLAPSE_SHADOW_STYLES,
  EXPAND_BLUR_STYLES,
  COLLAPSE_BLUR_STYLES,
  ENABLE_DRAGGING_FILL,
  DISABLE_DRAGGING_FILL,
  ENABLE_DRAGGING_STROKE,
  DISABLE_DRAGGING_STROKE,
  ENABLE_DRAGGING_SHADOW,
  DISABLE_DRAGGING_SHADOW,
  ENABLE_FILL_DRAGOVER,
  DISABLE_FILL_DRAGOVER,
  ENABLE_STROKE_DRAGOVER,
  DISABLE_STROKE_DRAGOVER,
  // ENABLE_SHADOW_DRAGOVER,
  // DISABLE_SHADOW_DRAGOVER,
  EnableDraggingFillPayload,
  EnableDraggingStrokePayload,
  EnableDraggingShadowPayload,
  RightSidebarTypes
} from '../actionTypes/rightSidebar';

export const expandShapeStyles = (): RightSidebarTypes => ({
  type: EXPAND_SHAPE_STYLES
});

export const collapseShapeStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_SHAPE_STYLES
});

export const expandOpacityStyles = (): RightSidebarTypes => ({
  type: EXPAND_OPACITY_STYLES
});

export const collapseOpacityStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_OPACITY_STYLES
});

export const expandTextStyles = (): RightSidebarTypes => ({
  type: EXPAND_TEXT_STYLES
});

export const collapseTextStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_TEXT_STYLES
});

export const expandAlignmentStyles = (): RightSidebarTypes => ({
  type: EXPAND_ALIGNMENT_STYLES
});

export const collapseAlignmentStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_ALIGNMENT_STYLES
});

export const expandFillStyles = (): RightSidebarTypes => ({
  type: EXPAND_FILL_STYLES
});

export const collapseFillStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_FILL_STYLES
});

export const expandStrokeStyles = (): RightSidebarTypes => ({
  type: EXPAND_STROKE_STYLES
});

export const collapseStrokeStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_STROKE_STYLES
});

export const expandStrokeOptionsStyles = (): RightSidebarTypes => ({
  type: EXPAND_STROKE_OPTIONS_STYLES
});

export const collapseStrokeOptionsStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_STROKE_OPTIONS_STYLES
});

export const expandShadowStyles = (): RightSidebarTypes => ({
  type: EXPAND_SHADOW_STYLES
});

export const collapseShadowStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_SHADOW_STYLES
});

export const expandBlurStyles = (): RightSidebarTypes => ({
  type: EXPAND_BLUR_STYLES
});

export const collapseBlurStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_BLUR_STYLES
});

export const enableDraggingFill = (payload: EnableDraggingFillPayload): RightSidebarTypes => ({
  type: ENABLE_DRAGGING_FILL,
  payload
});

export const disableDraggingFill = (): RightSidebarTypes => ({
  type: DISABLE_DRAGGING_FILL
});

export const enableDraggingStroke = (payload: EnableDraggingStrokePayload): RightSidebarTypes => ({
  type: ENABLE_DRAGGING_STROKE,
  payload
});

export const disableDraggingStroke = (): RightSidebarTypes => ({
  type: DISABLE_DRAGGING_STROKE
});

export const enableDraggingShadow = (payload: EnableDraggingShadowPayload): RightSidebarTypes => ({
  type: ENABLE_DRAGGING_SHADOW,
  payload
});

export const disableDraggingShadow = (): RightSidebarTypes => ({
  type: DISABLE_DRAGGING_SHADOW
});

export const enableFillDragover = (): RightSidebarTypes => ({
  type: ENABLE_FILL_DRAGOVER
});

export const disableFillDragover = (): RightSidebarTypes => ({
  type: DISABLE_FILL_DRAGOVER
});

export const enableStrokeDragover = (): RightSidebarTypes => ({
  type: ENABLE_STROKE_DRAGOVER
});

export const disableStrokeDragover = (): RightSidebarTypes => ({
  type: DISABLE_STROKE_DRAGOVER
});

// export const enableShadowDragover = (): RightSidebarTypes => ({
//   type: ENABLE_SHADOW_DRAGOVER
// });

// export const disableShadowDragover = (): RightSidebarTypes => ({
//   type: DISABLE_SHADOW_DRAGOVER
// });