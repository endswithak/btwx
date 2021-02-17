export const SET_FILE_NEW = 'SET_FILE_NEW';
export const SET_FILE_SAVE = 'SET_FILE_SAVE';
export const SET_FILE_SAVE_AS = 'SET_FILE_SAVE_AS';
export const SET_FILE_OPEN = 'SET_FILE_OPEN';

export const SET_EDIT_UNDO = 'SET_EDIT_UNDO';
export const SET_EDIT_REDO = 'SET_EDIT_REDO';
export const SET_EDIT_CUT = 'SET_EDIT_CUT';
export const SET_EDIT_COPY_COPY = 'SET_EDIT_COPY_COPY';
export const SET_EDIT_COPY_STYLE = 'SET_EDIT_COPY_STYLE';
export const SET_EDIT_COPY_SVG = 'SET_EDIT_COPY_SVG';
export const SET_EDIT_PASTE_PASTE = 'SET_EDIT_PASTE_PASTE';
export const SET_EDIT_PASTE_OVER_SELECTION = 'SET_EDIT_PASTE_OVER_SELECTION';
export const SET_EDIT_PASTE_STYLE = 'SET_EDIT_PASTE_STYLE';
export const SET_EDIT_PASTE_SVG = 'SET_EDIT_PASTE_SVG';
export const SET_EDIT_DELETE = 'SET_EDIT_DELETE';
export const SET_EDIT_DUPLICATE = 'SET_EDIT_DUPLICATE';
export const SET_EDIT_SELECT_SELECT_ALL = 'SET_EDIT_SELECT_SELECT_ALL';
export const SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS = 'SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS';
export const SET_EDIT_FIND = 'SET_EDIT_FIND';
export const SET_EDIT_RENAME = 'SET_EDIT_RENAME';

export const SET_INSERT_ARTBOARD = 'SET_INSERT_ARTBOARD';
export const SET_INSERT_SHAPE_RECTANGLE = 'SET_INSERT_SHAPE_RECTANGLE';
export const SET_INSERT_SHAPE_ROUNDED = 'SET_INSERT_SHAPE_ROUNDED';
export const SET_INSERT_SHAPE_ELLIPSE = 'SET_INSERT_SHAPE_ELLIPSE';
export const SET_INSERT_SHAPE_POLYGON = 'SET_INSERT_SHAPE_POLYGON';
export const SET_INSERT_SHAPE_STAR = 'SET_INSERT_SHAPE_STAR';
export const SET_INSERT_SHAPE_LINE = 'SET_INSERT_SHAPE_LINE';
export const SET_INSERT_TEXT = 'SET_INSERT_TEXT';
export const SET_INSERT_IMAGE = 'SET_INSERT_IMAGE';

export const SET_LAYER_STYLE_FILL = 'SET_LAYER_STYLE_FILL';
export const SET_LAYER_STYLE_STROKE = 'SET_LAYER_STYLE_STROKE';
export const SET_LAYER_STYLE_SHADOW = 'SET_LAYER_STYLE_SHADOW';
export const SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY = 'SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY';
export const SET_LAYER_TRANSFORM_FLIP_VERTICALLY = 'SET_LAYER_TRANSFORM_FLIP_VERTICALLY';
export const SET_LAYER_COMBINE_UNION = 'SET_LAYER_COMBINE_UNION';
export const SET_LAYER_COMBINE_SUBTRACT = 'SET_LAYER_COMBINE_SUBTRACT';
export const SET_LAYER_COMBINE_INTERSECT = 'SET_LAYER_COMBINE_INTERSECT';
export const SET_LAYER_COMBINE_DIFFERENCE = 'SET_LAYER_COMBINE_DIFFERENCE';
export const SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS = 'SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS';
export const SET_LAYER_IMAGE_REPLACE = 'SET_LAYER_IMAGE_REPLACE';
export const SET_LAYER_MASK_USE_AS_MASK = 'SET_LAYER_MASK_USE_AS_MASK';
export const SET_LAYER_MASK_IGNORE_UNDERLYING_MASK = 'SET_LAYER_MASK_IGNORE_UNDERLYING_MASK';

export const SET_ARRANGE_BRING_FORWARD = 'SET_ARRANGE_BRING_FORWARD';
export const SET_ARRANGE_BRING_TO_FRONT = 'SET_ARRANGE_BRING_TO_FRONT';
export const SET_ARRANGE_SEND_BACKWARD = 'SET_ARRANGE_SEND_BACKWARD';
export const SET_ARRANGE_SEND_TO_BACK = 'SET_ARRANGE_SEND_TO_BACK';
export const SET_ARRANGE_ALIGN_LEFT = 'SET_ARRANGE_ALIGN_LEFT';
export const SET_ARRANGE_ALIGN_CENTER = 'SET_ARRANGE_ALIGN_CENTER';
export const SET_ARRANGE_ALIGN_RIGHT = 'SET_ARRANGE_ALIGN_RIGHT';
export const SET_ARRANGE_ALIGN_TOP = 'SET_ARRANGE_ALIGN_TOP';
export const SET_ARRANGE_ALIGN_MIDDLE = 'SET_ARRANGE_ALIGN_MIDDLE';
export const SET_ARRANGE_ALIGN_BOTTOM = 'SET_ARRANGE_ALIGN_BOTTOM';
export const SET_ARRANGE_DISTRIBUTE_HORIZONTALLY = 'SET_ARRANGE_DISTRIBUTE_HORIZONTALLY';
export const SET_ARRANGE_DISTRIBUTE_VERTICALLY = 'SET_ARRANGE_DISTRIBUTE_VERTICALLY';
export const SET_ARRANGE_GROUP = 'SET_ARRANGE_GROUP';
export const SET_ARRANGE_UNGROUP = 'SET_ARRANGE_UNGROUP';

export const SET_VIEW_ZOOM_IN = 'SET_VIEW_ZOOM_IN';
export const SET_VIEW_ZOOM_OUT = 'SET_VIEW_ZOOM_OUT';
export const SET_VIEW_ZOOM_FIT_CANVAS = 'SET_VIEW_ZOOM_FIT_CANVAS';
export const SET_VIEW_ZOOM_FIT_SELECTED = 'SET_VIEW_ZOOM_FIT_SELECTED';
export const SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD = 'SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD';
export const SET_VIEW_CENTER_SELECTED = 'SET_VIEW_CENTER_SELECTED';
export const SET_VIEW_SHOW_LAYERS = 'SET_VIEW_SHOW_LAYERS';
export const SET_VIEW_SHOW_STYLES = 'SET_VIEW_SHOW_STYLES';
export const SET_VIEW_SHOW_EVENTS = 'SET_VIEW_SHOW_EVENTS';

export interface SetBindingPayload {
  binding: string;
}

export interface SetFileNew {
  type: typeof SET_FILE_NEW;
  payload: SetBindingPayload;
}

export interface SetFileSave {
  type: typeof SET_FILE_SAVE;
  payload: SetBindingPayload;
}

export interface SetFileSaveAs {
  type: typeof SET_FILE_SAVE_AS;
  payload: SetBindingPayload;
}

export interface SetFileOpen {
  type: typeof SET_FILE_OPEN;
  payload: SetBindingPayload;
}

export interface SetEditUndo {
  type: typeof SET_EDIT_UNDO;
  payload: SetBindingPayload;
}

export interface SetEditRedo {
  type: typeof SET_EDIT_REDO;
  payload: SetBindingPayload;
}

export interface SetEditCut {
  type: typeof SET_EDIT_CUT;
  payload: SetBindingPayload;
}

export interface SetEditCopyCopy {
  type: typeof SET_EDIT_COPY_COPY;
  payload: SetBindingPayload;
}

export interface SetEditCopyStyle {
  type: typeof SET_EDIT_COPY_STYLE;
  payload: SetBindingPayload;
}

export interface SetEditCopySvg {
  type: typeof SET_EDIT_COPY_SVG;
  payload: SetBindingPayload;
}

export interface SetEditPastePaste {
  type: typeof SET_EDIT_PASTE_PASTE;
  payload: SetBindingPayload;
}

export interface SetEditPasteOverSelection {
  type: typeof SET_EDIT_PASTE_OVER_SELECTION;
  payload: SetBindingPayload;
}

export interface SetEditPasteStyle {
  type: typeof SET_EDIT_PASTE_STYLE;
  payload: SetBindingPayload;
}

export interface SetEditPasteSvg {
  type: typeof SET_EDIT_PASTE_SVG;
  payload: SetBindingPayload;
}

export interface SetEditDelete {
  type: typeof SET_EDIT_DELETE;
  payload: SetBindingPayload;
}

export interface SetEditDuplicate {
  type: typeof SET_EDIT_DUPLICATE;
  payload: SetBindingPayload;
}

export interface SetEditSelectSelectAll {
  type: typeof SET_EDIT_SELECT_SELECT_ALL;
  payload: SetBindingPayload;
}

export interface SetEditSelectSelectAllArtboards {
  type: typeof SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS;
  payload: SetBindingPayload;
}

export interface SetEditFind {
  type: typeof SET_EDIT_FIND;
  payload: SetBindingPayload;
}

export interface SetEditRename {
  type: typeof SET_EDIT_RENAME;
  payload: SetBindingPayload;
}

export interface SetInsertArtboard {
  type: typeof SET_INSERT_ARTBOARD;
  payload: SetBindingPayload;
}

export interface SetInsertShapeRectangle {
  type: typeof SET_INSERT_SHAPE_RECTANGLE;
  payload: SetBindingPayload;
}

export interface SetInsertShapeRounded {
  type: typeof SET_INSERT_SHAPE_ROUNDED;
  payload: SetBindingPayload;
}

export interface SetInsertShapeEllipse {
  type: typeof SET_INSERT_SHAPE_ELLIPSE;
  payload: SetBindingPayload;
}

export interface SetInsertShapePolygon {
  type: typeof SET_INSERT_SHAPE_POLYGON;
  payload: SetBindingPayload;
}

export interface SetInsertShapeStar {
  type: typeof SET_INSERT_SHAPE_STAR;
  payload: SetBindingPayload;
}

export interface SetInsertShapeLine {
  type: typeof SET_INSERT_SHAPE_LINE;
  payload: SetBindingPayload;
}

export interface SetInsertText {
  type: typeof SET_INSERT_TEXT;
  payload: SetBindingPayload;
}

export interface SetInsertImage {
  type: typeof SET_INSERT_IMAGE;
  payload: SetBindingPayload;
}

export interface SetLayerStyleFill {
  type: typeof SET_LAYER_STYLE_FILL;
  payload: SetBindingPayload;
}

export interface SetLayerStyleStroke {
  type: typeof SET_LAYER_STYLE_STROKE;
  payload: SetBindingPayload;
}

export interface SetLayerStyleShadow {
  type: typeof SET_LAYER_STYLE_SHADOW;
  payload: SetBindingPayload;
}

export interface SetLayerTransformFlipHorizontally {
  type: typeof SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY;
  payload: SetBindingPayload;
}

export interface SetLayerTransformFlipVertically {
  type: typeof SET_LAYER_TRANSFORM_FLIP_VERTICALLY;
  payload: SetBindingPayload;
}

export interface SetLayerCombineUnion {
  type: typeof SET_LAYER_COMBINE_UNION;
  payload: SetBindingPayload;
}

export interface SetLayerCombineSubtract {
  type: typeof SET_LAYER_COMBINE_SUBTRACT;
  payload: SetBindingPayload;
}

export interface SetLayerCombineIntersect {
  type: typeof SET_LAYER_COMBINE_INTERSECT;
  payload: SetBindingPayload;
}

export interface SetLayerCombineDifference {
  type: typeof SET_LAYER_COMBINE_DIFFERENCE;
  payload: SetBindingPayload;
}

export interface SetLayerImageOriginalDimensions {
  type: typeof SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS;
  payload: SetBindingPayload;
}

export interface SetLayerImageReplace {
  type: typeof SET_LAYER_IMAGE_REPLACE;
  payload: SetBindingPayload;
}

export interface SetLayerMaskUseAsMask {
  type: typeof SET_LAYER_MASK_USE_AS_MASK;
  payload: SetBindingPayload;
}

export interface SetLayerMaskIgnoreUnderlyingMask {
  type: typeof SET_LAYER_MASK_IGNORE_UNDERLYING_MASK;
  payload: SetBindingPayload;
}

export interface SetArrangeBringForward {
  type: typeof SET_ARRANGE_BRING_FORWARD;
  payload: SetBindingPayload;
}

export interface SetArrangeBringToFront {
  type: typeof SET_ARRANGE_BRING_TO_FRONT;
  payload: SetBindingPayload;
}

export interface SetArrangeSendBackward {
  type: typeof SET_ARRANGE_SEND_BACKWARD;
  payload: SetBindingPayload;
}

export interface SetArrangeSendToBack {
  type: typeof SET_ARRANGE_SEND_TO_BACK;
  payload: SetBindingPayload;
}

export interface SetArrangeAlignLeft {
  type: typeof SET_ARRANGE_ALIGN_LEFT;
  payload: SetBindingPayload;
}

export interface SetArrangeAlignCenter {
  type: typeof SET_ARRANGE_ALIGN_CENTER;
  payload: SetBindingPayload;
}

export interface SetArrangeAlignRight {
  type: typeof SET_ARRANGE_ALIGN_RIGHT;
  payload: SetBindingPayload;
}

export interface SetArrangeAlignTop {
  type: typeof SET_ARRANGE_ALIGN_TOP;
  payload: SetBindingPayload;
}

export interface SetArrangeAlignMiddle {
  type: typeof SET_ARRANGE_ALIGN_MIDDLE;
  payload: SetBindingPayload;
}

export interface SetArrangeAlignBottom {
  type: typeof SET_ARRANGE_ALIGN_BOTTOM;
  payload: SetBindingPayload;
}

export interface SetArrangeDistributeHorizontally {
  type: typeof SET_ARRANGE_DISTRIBUTE_HORIZONTALLY;
  payload: SetBindingPayload;
}

export interface SetArrangeDistributeVertically {
  type: typeof SET_ARRANGE_DISTRIBUTE_VERTICALLY;
  payload: SetBindingPayload;
}

export interface SetArrangeGroup {
  type: typeof SET_ARRANGE_GROUP;
  payload: SetBindingPayload;
}

export interface SetArrangeUngroup {
  type: typeof SET_ARRANGE_UNGROUP;
  payload: SetBindingPayload;
}

export interface SetViewZoomIn {
  type: typeof SET_VIEW_ZOOM_IN;
  payload: SetBindingPayload;
}

export interface SetViewZoomOut {
  type: typeof SET_VIEW_ZOOM_OUT;
  payload: SetBindingPayload;
}

export interface SetViewZoomFitCanvas {
  type: typeof SET_VIEW_ZOOM_FIT_CANVAS;
  payload: SetBindingPayload;
}

export interface SetViewZoomFitSelected {
  type: typeof SET_VIEW_ZOOM_FIT_SELECTED;
  payload: SetBindingPayload;
}

export interface SetViewZoomFitActiveArtboard {
  type: typeof SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD;
  payload: SetBindingPayload;
}

export interface SetViewCenterSelected {
  type: typeof SET_VIEW_CENTER_SELECTED;
  payload: SetBindingPayload;
}

export interface SetViewShowLayers {
  type: typeof SET_VIEW_SHOW_LAYERS;
  payload: SetBindingPayload;
}

export interface SetViewShowStyles {
  type: typeof SET_VIEW_SHOW_STYLES;
  payload: SetBindingPayload;
}

export interface SetViewShowEvents {
  type: typeof SET_VIEW_SHOW_EVENTS;
  payload: SetBindingPayload;
}

export type KeyBindingsTypes = SetFileNew |
                               SetFileSave |
                               SetFileSaveAs |
                               SetFileOpen |
                               SetEditUndo |
                               SetEditRedo |
                               SetEditCut |
                               SetEditCopyCopy |
                               SetEditCopyStyle |
                               SetEditCopySvg |
                               SetEditPastePaste |
                               SetEditPasteOverSelection |
                               SetEditPasteStyle |
                               SetEditPasteSvg |
                               SetEditRename |
                               SetEditFind |
                               SetEditDelete |
                               SetEditDuplicate |
                               SetEditSelectSelectAll |
                               SetEditSelectSelectAllArtboards |
                               SetInsertArtboard |
                               SetInsertShapeRectangle |
                               SetInsertShapeRounded |
                               SetInsertShapeEllipse |
                               SetInsertShapePolygon |
                               SetInsertShapeStar |
                               SetInsertShapeLine |
                               SetInsertText |
                               SetInsertImage |
                               SetLayerStyleFill |
                               SetLayerStyleStroke |
                               SetLayerStyleShadow |
                               SetLayerTransformFlipHorizontally |
                               SetLayerTransformFlipVertically |
                               SetLayerCombineUnion |
                               SetLayerCombineSubtract |
                               SetLayerCombineIntersect |
                               SetLayerCombineDifference |
                               SetLayerMaskUseAsMask |
                               SetLayerMaskIgnoreUnderlyingMask |
                               SetLayerImageOriginalDimensions |
                               SetLayerImageReplace |
                               SetArrangeBringForward |
                               SetArrangeBringToFront |
                               SetArrangeSendBackward |
                               SetArrangeSendToBack |
                               SetArrangeAlignLeft |
                               SetArrangeAlignCenter |
                               SetArrangeAlignRight |
                               SetArrangeAlignTop |
                               SetArrangeAlignMiddle |
                               SetArrangeAlignBottom |
                               SetArrangeDistributeHorizontally |
                               SetArrangeDistributeVertically |
                               SetArrangeGroup |
                               SetArrangeUngroup |
                               SetViewCenterSelected |
                               SetViewShowEvents |
                               SetViewShowLayers |
                               SetViewShowStyles |
                               SetViewZoomIn |
                               SetViewZoomOut |
                               SetViewZoomFitCanvas |
                               SetViewZoomFitSelected |
                               SetViewZoomFitActiveArtboard;
