import {
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  EXPAND_SHAPE_STYLES,
  COLLAPSE_SHAPE_STYLES,
  EXPAND_OPACITY_STYLES,
  COLLAPSE_OPACITY_STYLES,
  EXPAND_TEXT_STYLES,
  COLLAPSE_TEXT_STYLES,
  EXPAND_FILL_STYLES,
  COLLAPSE_FILL_STYLES,
  EXPAND_STROKE_STYLES,
  COLLAPSE_STROKE_STYLES,
  EXPAND_SHADOW_STYLES,
  COLLAPSE_SHADOW_STYLES,
  RightSidebarTypes
} from '../actionTypes/rightSidebar';

export const openRightSidebar = (): RightSidebarTypes => ({
  type: OPEN_RIGHT_SIDEBAR
});

export const closeRightSidebar = (): RightSidebarTypes => ({
  type: CLOSE_RIGHT_SIDEBAR
});

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

export const expandShadowStyles = (): RightSidebarTypes => ({
  type: EXPAND_SHADOW_STYLES
});

export const collapseShadowStyles = (): RightSidebarTypes => ({
  type: COLLAPSE_SHADOW_STYLES
});