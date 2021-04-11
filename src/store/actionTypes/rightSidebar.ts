export const EXPAND_SHAPE_STYLES = 'EXPAND_SHAPE_STYLES';
export const COLLAPSE_SHAPE_STYLES = 'COLLAPSE_SHAPE_STYLES';

export const EXPAND_OPACITY_STYLES = 'EXPAND_OPACITY_STYLES';
export const COLLAPSE_OPACITY_STYLES = 'COLLAPSE_OPACITY_STYLES';

export const EXPAND_TEXT_STYLES = 'EXPAND_TEXT_STYLES';
export const COLLAPSE_TEXT_STYLES = 'COLLAPSE_TEXT_STYLES';

export const EXPAND_ALIGNMENT_STYLES = 'EXPAND_ALIGNMENT_STYLES';
export const COLLAPSE_ALIGNMENT_STYLES = 'COLLAPSE_ALIGNMENT_STYLES';

export const EXPAND_FILL_STYLES = 'EXPAND_FILL_STYLES';
export const COLLAPSE_FILL_STYLES = 'COLLAPSE_FILL_STYLES';

export const EXPAND_STROKE_STYLES = 'EXPAND_STROKE_STYLES';
export const COLLAPSE_STROKE_STYLES = 'COLLAPSE_STROKE_STYLES';

export const EXPAND_STROKE_OPTIONS_STYLES = 'EXPAND_STROKE_OPTIONS_STYLES';
export const COLLAPSE_STROKE_OPTIONS_STYLES = 'COLLAPSE_STROKE_OPTIONS_STYLES';

export const EXPAND_SHADOW_STYLES = 'EXPAND_SHADOW_STYLES';
export const COLLAPSE_SHADOW_STYLES = 'COLLAPSE_SHADOW_STYLES';

export const EXPAND_BLUR_STYLES = 'EXPAND_BLUR_STYLES';
export const COLLAPSE_BLUR_STYLES = 'COLLAPSE_BLUR_STYLES';

export interface ExpandShapeStyles {
  type: typeof EXPAND_SHAPE_STYLES;
}

export interface CollapseShapeStyles {
  type: typeof COLLAPSE_SHAPE_STYLES;
}

export interface ExpandOpacityStyles {
  type: typeof EXPAND_OPACITY_STYLES;
}

export interface CollapseOpacityStyles {
  type: typeof COLLAPSE_OPACITY_STYLES;
}

export interface ExpandTextStyles {
  type: typeof EXPAND_TEXT_STYLES;
}

export interface CollapseTextStyles {
  type: typeof COLLAPSE_TEXT_STYLES;
}

export interface ExpandAlignmentStyles {
  type: typeof EXPAND_ALIGNMENT_STYLES;
}

export interface CollapseAlignmentStyles {
  type: typeof COLLAPSE_ALIGNMENT_STYLES;
}

export interface ExpandFillStyles {
  type: typeof EXPAND_FILL_STYLES;
}

export interface CollapseFillStyles {
  type: typeof COLLAPSE_FILL_STYLES;
}

export interface ExpandStrokeStyles {
  type: typeof EXPAND_STROKE_STYLES;
}

export interface CollapseStrokeStyles {
  type: typeof COLLAPSE_STROKE_STYLES;
}

export interface ExpandStrokeOptionsStyles {
  type: typeof EXPAND_STROKE_OPTIONS_STYLES;
}

export interface CollapseStrokeOptionsStyles {
  type: typeof COLLAPSE_STROKE_OPTIONS_STYLES;
}

export interface ExpandShadowStyles {
  type: typeof EXPAND_SHADOW_STYLES;
}

export interface CollapseShadowStyles {
  type: typeof COLLAPSE_SHADOW_STYLES;
}

export interface ExpandBlurStyles {
  type: typeof EXPAND_BLUR_STYLES;
}

export interface CollapseBlurStyles {
  type: typeof COLLAPSE_BLUR_STYLES;
}

export type RightSidebarTypes = ExpandShapeStyles |
                                CollapseShapeStyles |
                                ExpandOpacityStyles |
                                CollapseOpacityStyles |
                                ExpandTextStyles |
                                CollapseTextStyles |
                                ExpandAlignmentStyles |
                                CollapseAlignmentStyles |
                                ExpandFillStyles |
                                CollapseFillStyles |
                                ExpandStrokeStyles |
                                CollapseStrokeStyles |
                                ExpandStrokeOptionsStyles |
                                CollapseStrokeOptionsStyles |
                                ExpandShadowStyles |
                                CollapseShadowStyles |
                                ExpandBlurStyles |
                                CollapseBlurStyles;