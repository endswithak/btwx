import {
  SET_FILE_NEW,
  SET_FILE_SAVE,
  SET_FILE_SAVE_AS,
  SET_FILE_OPEN,
  SET_EDIT_UNDO,
  SET_EDIT_REDO,
  SET_EDIT_CUT,
  SET_EDIT_COPY_COPY,
  SET_EDIT_COPY_STYLE,
  SET_EDIT_COPY_SVG,
  SET_EDIT_PASTE_PASTE,
  SET_EDIT_PASTE_OVER_SELECTION,
  SET_EDIT_PASTE_STYLE,
  SET_EDIT_PASTE_SVG,
  SET_EDIT_DELETE,
  SET_EDIT_DUPLICATE,
  SET_EDIT_SELECT_SELECT_ALL,
  SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS,
  SET_EDIT_FIND,
  SET_EDIT_RENAME,
  SET_INSERT_ARTBOARD,
  SET_INSERT_SHAPE_RECTANGLE,
  SET_INSERT_SHAPE_ROUNDED,
  SET_INSERT_SHAPE_ELLIPSE,
  SET_INSERT_SHAPE_POLYGON,
  SET_INSERT_SHAPE_STAR,
  SET_INSERT_SHAPE_LINE,
  SET_INSERT_TEXT,
  SET_INSERT_IMAGE,
  SET_LAYER_STYLE_FILL,
  SET_LAYER_STYLE_STROKE,
  SET_LAYER_STYLE_SHADOW,
  SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY,
  SET_LAYER_TRANSFORM_FLIP_VERTICALLY,
  SET_LAYER_COMBINE_UNION,
  SET_LAYER_COMBINE_SUBTRACT,
  SET_LAYER_COMBINE_INTERSECT,
  SET_LAYER_COMBINE_DIFFERENCE,
  SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
  SET_LAYER_IMAGE_REPLACE,
  SET_LAYER_MASK_USE_AS_MASK,
  SET_LAYER_MASK_IGNORE_UNDERLYING_MASK,
  SET_ARRANGE_BRING_FORWARD,
  SET_ARRANGE_BRING_TO_FRONT,
  SET_ARRANGE_SEND_BACKWARD,
  SET_ARRANGE_SEND_TO_BACK,
  SET_ARRANGE_ALIGN_LEFT,
  SET_ARRANGE_ALIGN_CENTER,
  SET_ARRANGE_ALIGN_RIGHT,
  SET_ARRANGE_ALIGN_TOP,
  SET_ARRANGE_ALIGN_MIDDLE,
  SET_ARRANGE_ALIGN_BOTTOM,
  SET_ARRANGE_DISTRIBUTE_HORIZONTALLY,
  SET_ARRANGE_DISTRIBUTE_VERTICALLY,
  SET_ARRANGE_GROUP,
  SET_ARRANGE_UNGROUP,
  SET_VIEW_ZOOM_IN,
  SET_VIEW_ZOOM_OUT,
  SET_VIEW_ZOOM_FIT_CANVAS,
  SET_VIEW_ZOOM_FIT_SELECTED,
  SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
  SET_VIEW_CENTER_SELECTED,
  SET_VIEW_SHOW_LAYERS,
  SET_VIEW_SHOW_STYLES,
  SET_VIEW_SHOW_EVENTS,
  SetBindingPayload,
  KeyBindingsTypes
} from '../actionTypes/keyBindings';

export const setFileNew = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_NEW,
  payload
});

export const setFileSave = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_SAVE,
  payload
});

export const setFileSaveAs = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_SAVE_AS,
  payload
});

export const setFileSaveOpen = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_OPEN,
  payload
});

export const setEditUndo = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_UNDO,
  payload
});

export const setEditRedo = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_REDO,
  payload
});

export const setEditCut = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_CUT,
  payload
});

export const setEditCopyCopy = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_COPY_COPY,
  payload
});

export const setEditCopyStyle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_COPY_STYLE,
  payload
});

export const setEditCopySvg = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_COPY_SVG,
  payload
});

export const setEditPastePaste = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_PASTE,
  payload
});

export const SetEditPasteOverSelection = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_OVER_SELECTION,
  payload
});

export const SetEditPasteStyle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_STYLE,
  payload
});

export const SetEditPasteSvg = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_SVG,
  payload
});

export const SetEditDelete = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_DELETE,
  payload
});

export const SetEditDuplicate = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_DUPLICATE,
  payload
});

export const SetEditSelectSelectAll = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_SELECT_SELECT_ALL,
  payload
});

export const SetEditSelectSelectAllArtboards = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS,
  payload
});

export const SetEditFind = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_FIND,
  payload
});

export const SetEditRename = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_RENAME,
  payload
});

export const setInsertArtboard = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_ARTBOARD,
  payload
});

export const setInsertShapeRectangle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_RECTANGLE,
  payload
});

export const setInsertShapeRounded = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_ROUNDED,
  payload
});

export const setInsertShapeEllipse = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_ELLIPSE,
  payload
});

export const setInsertShapePolygon = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_POLYGON,
  payload
});

export const setInsertShapeStar = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_STAR,
  payload
});

export const setInsertShapeLine = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_LINE,
  payload
});

export const setInsertText = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_TEXT,
  payload
});

export const setInsertImage = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_IMAGE,
  payload
});

export const setLayerStyleFill = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_STYLE_FILL,
  payload
});

export const setLayerStyleStroke = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_STYLE_STROKE,
  payload
});

export const setLayerStyleShadow = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_STYLE_SHADOW,
  payload
});

export const setLayerTransformFlipHorizontally = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY,
  payload
});

export const setLayerTransformFlipVertically = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_TRANSFORM_FLIP_VERTICALLY,
  payload
});

export const setLayerCombineUnion = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_UNION,
  payload
});

export const setLayerCombineSubtract = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_SUBTRACT,
  payload
});

export const setLayerCombineIntersect = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_INTERSECT,
  payload
});

export const setLayerCombineDifference = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_DIFFERENCE,
  payload
});

export const setLayerImageOriginalDimensions = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
  payload
});

export const setLayerImageReplace = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_IMAGE_REPLACE,
  payload
});

export const setLayerMaskUseAsMask = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_MASK_USE_AS_MASK,
  payload
});

export const setLayerMaskIgnoreUnderlyingMask = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_MASK_IGNORE_UNDERLYING_MASK,
  payload
});

export const setArrangeBringForward = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_BRING_FORWARD,
  payload
});

export const setArrangeBringToFront = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_BRING_TO_FRONT,
  payload
});

export const setArrangeSendBackward = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_SEND_BACKWARD,
  payload
});

export const setArrangeSendToBack = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_SEND_TO_BACK,
  payload
});

export const setArrangeAlignLeft = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_LEFT,
  payload
});

export const setArrangeAlignCenter = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_CENTER,
  payload
});

export const setArrangeAlignRight = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_RIGHT,
  payload
});

export const setArrangeAlignTop = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_TOP,
  payload
});

export const setArrangeAlignMiddle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_MIDDLE,
  payload
});

export const setArrangeAlignBottom = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_BOTTOM,
  payload
});

export const setArrangeDistributeHorizontally = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_DISTRIBUTE_HORIZONTALLY,
  payload
});

export const setArrangeDistributeVertically = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_DISTRIBUTE_VERTICALLY,
  payload
});

export const setArrangeGroup = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_GROUP,
  payload
});

export const setArrangeUngroup = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_UNGROUP,
  payload
});

export const setViewZoomIn = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_IN,
  payload
});

export const setViewZoomOut = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_OUT,
  payload
});

export const setViewZoomFitCanvas = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_FIT_CANVAS,
  payload
});

export const setViewZoomFitSelected = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_FIT_SELECTED,
  payload
});

export const setViewZoomFitActiveArtboard = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
  payload
});

export const setViewCenterSelected = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_CENTER_SELECTED,
  payload
});

export const setViewShowLayers = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_SHOW_LAYERS,
  payload
});

export const setViewShowStyles = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_SHOW_STYLES,
  payload
});

export const setViewShowEvents = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_SHOW_EVENTS,
  payload
});