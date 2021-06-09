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
  RESET_ALL_KEY_BINDINGS,
  HYDRATE_KEY_BINDINGS,
  SetBindingPayload,
  KeyBindingsTypes
} from '../actionTypes/keyBindings';
import { RootState } from '../reducers';
import { KeyBindingsState } from '../reducers/keyBindings';

export const setFileNew = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_NEW,
  payload
});

export const setFileNewThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setFileNew(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.file.new',
      value: payload.binding
    }));
  }
};

export const setFileSave = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_SAVE,
  payload
});

export const setFileSaveThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setFileSave(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.file.save',
      value: payload.binding
    }));
  }
};

export const setFileSaveAs = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_SAVE_AS,
  payload
});

export const setFileSaveAsThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setFileSaveAs(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.file.saveAs',
      value: payload.binding
    }));
  }
};

export const setFileOpen = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_FILE_OPEN,
  payload
});

export const setFileOpenThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setFileOpen(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.file.open',
      value: payload.binding
    }));
  }
};

export const setEditUndo = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_UNDO,
  payload
});

export const setEditUndoThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditUndo(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.undo',
      value: payload.binding
    }));
  }
};

export const setEditRedo = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_REDO,
  payload
});

export const setEditRedoThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditRedo(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.redo',
      value: payload.binding
    }));
  }
};

export const setEditCut = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_CUT,
  payload
});

export const setEditCutThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditCut(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.cut',
      value: payload.binding
    }));
  }
};

export const setEditCopyCopy = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_COPY_COPY,
  payload
});

export const setEditCopyCopyThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditCut(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.copy.copy',
      value: payload.binding
    }));
  }
};

export const setEditCopyStyle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_COPY_STYLE,
  payload
});

export const setEditCopyStyleThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditCopyStyle(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.copy.style',
      value: payload.binding
    }));
  }
};

export const setEditCopySvg = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_COPY_SVG,
  payload
});

export const setEditCopySvgThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditCopySvg(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.copy.svg',
      value: payload.binding
    }));
  }
};

export const setEditPastePaste = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_PASTE,
  payload
});

export const setEditPastePasteThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditPastePaste(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.paste.paste',
      value: payload.binding
    }));
  }
};

export const setEditPasteOverSelection = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_OVER_SELECTION,
  payload
});

export const setEditPasteOverSelectionThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditPasteOverSelection(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.paste.overSelection',
      value: payload.binding
    }));
  }
};

export const setEditPasteStyle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_STYLE,
  payload
});

export const setEditPasteStyleThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditPasteStyle(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.paste.style',
      value: payload.binding
    }));
  }
};

export const setEditPasteSvg = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_PASTE_SVG,
  payload
});

export const setEditPasteSvgThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditPasteSvg(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.paste.svg',
      value: payload.binding
    }));
  }
};

export const setEditDelete = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_DELETE,
  payload
});

export const setEditDeleteThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditDelete(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.delete',
      value: payload.binding
    }));
  }
};

export const setEditDuplicate = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_DUPLICATE,
  payload
});

export const setEditDuplicateThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditDuplicate(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.duplicate',
      value: payload.binding
    }));
  }
};

export const setEditSelectSelectAll = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_SELECT_SELECT_ALL,
  payload
});

export const setEditSelectSelectAllThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditSelectSelectAll(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.select.selectAll',
      value: payload.binding
    }));
  }
};

export const setEditSelectSelectAllArtboards = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_SELECT_SELECT_ALL_ARTBOARDS,
  payload
});

export const setEditSelectSelectAllArtboardsThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditSelectSelectAllArtboards(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.select.selectAllArtboards',
      value: payload.binding
    }));
  }
};

export const setEditFind = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_FIND,
  payload
});

export const setEditFindThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditFind(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.find',
      value: payload.binding
    }));
  }
};

export const setEditRename = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_EDIT_RENAME,
  payload
});

export const setEditRenameThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setEditRename(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.edit.rename',
      value: payload.binding
    }));
  }
};

export const setInsertArtboard = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_ARTBOARD,
  payload
});

export const setInsertArtboardThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertArtboard(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.artboard',
      value: payload.binding
    }));
  }
};

export const setInsertShapeRectangle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_RECTANGLE,
  payload
});

export const setInsertShapeRectangleThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertShapeRectangle(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.shape.rectangle',
      value: payload.binding
    }));
  }
};

export const setInsertShapeRounded = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_ROUNDED,
  payload
});

export const setInsertShapeRoundedThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertShapeRounded(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.shape.rounded',
      value: payload.binding
    }));
  }
};

export const setInsertShapeEllipse = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_ELLIPSE,
  payload
});

export const setInsertShapeEllipseThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertShapeEllipse(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.shape.ellipse',
      value: payload.binding
    }));
  }
};

export const setInsertShapePolygon = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_POLYGON,
  payload
});

export const setInsertShapePolygonThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertShapePolygon(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.shape.polygon',
      value: payload.binding
    }));
  }
};

export const setInsertShapeStar = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_STAR,
  payload
});

export const setInsertShapeStarThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertShapeStar(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.shape.star',
      value: payload.binding
    }));
  }
};

export const setInsertShapeLine = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_SHAPE_LINE,
  payload
});

export const setInsertShapeLineThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertShapeLine(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.shape.line',
      value: payload.binding
    }));
  }
};

export const setInsertText = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_TEXT,
  payload
});

export const setInsertTextThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertText(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.text',
      value: payload.binding
    }));
  }
};

export const setInsertImage = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_INSERT_IMAGE,
  payload
});

export const setInsertImageThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setInsertImage(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.insert.image',
      value: payload.binding
    }));
  }
};

export const setLayerStyleFill = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_STYLE_FILL,
  payload
});

export const setLayerStyleFillThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerStyleFill(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.style.fill',
      value: payload.binding
    }));
  }
};

export const setLayerStyleStroke = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_STYLE_STROKE,
  payload
});

export const setLayerStyleStrokeThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerStyleStroke(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.style.stroke',
      value: payload.binding
    }));
  }
};

export const setLayerStyleShadow = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_STYLE_SHADOW,
  payload
});

export const setLayerStyleShadowThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerStyleShadow(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.style.shadow',
      value: payload.binding
    }));
  }
};

export const setLayerTransformFlipHorizontally = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_TRANSFORM_FLIP_HORIZONTALLY,
  payload
});

export const setLayerTransformFlipHorizontallyThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerTransformFlipHorizontally(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.transform.flipHorizontally',
      value: payload.binding
    }));
  }
};

export const setLayerTransformFlipVertically = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_TRANSFORM_FLIP_VERTICALLY,
  payload
});

export const setLayerTransformFlipVerticallyThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerTransformFlipVertically(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.transform.flipVertically',
      value: payload.binding
    }));
  }
};

export const setLayerCombineUnion = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_UNION,
  payload
});

export const setLayerCombineUnionThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerCombineUnion(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.combine.union',
      value: payload.binding
    }));
  }
};

export const setLayerCombineSubtract = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_SUBTRACT,
  payload
});

export const setLayerCombineSubtractThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerCombineSubtract(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.combine.subtract',
      value: payload.binding
    }));
  }
};

export const setLayerCombineIntersect = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_INTERSECT,
  payload
});

export const setLayerCombineIntersectThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerCombineIntersect(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.combine.intersect',
      value: payload.binding
    }));
  }
};

export const setLayerCombineDifference = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_COMBINE_DIFFERENCE,
  payload
});

export const setLayerCombineDifferenceThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerCombineDifference(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.combine.difference',
      value: payload.binding
    }));
  }
};

export const setLayerImageOriginalDimensions = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_IMAGE_ORIGINAL_DIMENSIONS,
  payload
});

export const setLayerImageOriginalDimensionsThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerImageOriginalDimensions(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.image.originalDimensions',
      value: payload.binding
    }));
  }
};

export const setLayerImageReplace = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_IMAGE_REPLACE,
  payload
});

export const setLayerImageReplaceThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerImageReplace(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.image.replace',
      value: payload.binding
    }));
  }
};

export const setLayerMaskUseAsMask = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_MASK_USE_AS_MASK,
  payload
});

export const setLayerMaskUseAsMaskThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerMaskUseAsMask(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.mask.useAsMask',
      value: payload.binding
    }));
  }
};

export const setLayerMaskIgnoreUnderlyingMask = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_LAYER_MASK_IGNORE_UNDERLYING_MASK,
  payload
});

export const setLayerMaskIgnoreUnderlyingMaskThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setLayerMaskIgnoreUnderlyingMask(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.layer.mask.ignoreUnderlyingMask',
      value: payload.binding
    }));
  }
};

export const setArrangeBringForward = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_BRING_FORWARD,
  payload
});

export const setArrangeBringForwardThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeBringForward(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.bringForward',
      value: payload.binding
    }));
  }
};

export const setArrangeBringToFront = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_BRING_TO_FRONT,
  payload
});

export const setArrangeBringToFrontThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeBringToFront(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.bringToFront',
      value: payload.binding
    }));
  }
};

export const setArrangeSendBackward = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_SEND_BACKWARD,
  payload
});

export const setArrangeSendBackwardThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeSendBackward(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.sendBackward',
      value: payload.binding
    }));
  }
};

export const setArrangeSendToBack = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_SEND_TO_BACK,
  payload
});

export const setArrangeSendToBackThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeSendToBack(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.sendToBack',
      value: payload.binding
    }));
  }
};

export const setArrangeAlignLeft = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_LEFT,
  payload
});

export const setArrangeAlignLeftThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeAlignLeft(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.align.left',
      value: payload.binding
    }));
  }
};

export const setArrangeAlignCenter = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_CENTER,
  payload
});

export const setArrangeAlignCenterThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeAlignCenter(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.align.center',
      value: payload.binding
    }));
  }
};

export const setArrangeAlignRight = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_RIGHT,
  payload
});

export const setArrangeAlignRightThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeAlignRight(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.align.right',
      value: payload.binding
    }));
  }
};

export const setArrangeAlignTop = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_TOP,
  payload
});

export const setArrangeAlignTopThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeAlignTop(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.align.top',
      value: payload.binding
    }));
  }
};

export const setArrangeAlignMiddle = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_MIDDLE,
  payload
});

export const setArrangeAlignMiddleThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeAlignMiddle(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.align.middle',
      value: payload.binding
    }));
  }
};

export const setArrangeAlignBottom = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_ALIGN_BOTTOM,
  payload
});

export const setArrangeAlignBottomThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeAlignBottom(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.align.bottom',
      value: payload.binding
    }));
  }
};

export const setArrangeDistributeHorizontally = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_DISTRIBUTE_HORIZONTALLY,
  payload
});

export const setArrangeDistributeHorizontallyThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeDistributeHorizontally(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.distribute.horizontally',
      value: payload.binding
    }));
  }
};

export const setArrangeDistributeVertically = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_DISTRIBUTE_VERTICALLY,
  payload
});

export const setArrangeDistributeVerticallyThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeDistributeVertically(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.distribute.vertically',
      value: payload.binding
    }));
  }
};

export const setArrangeGroup = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_GROUP,
  payload
});

export const setArrangeGroupThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeGroup(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.group',
      value: payload.binding
    }));
  }
};

export const setArrangeUngroup = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_ARRANGE_UNGROUP,
  payload
});

export const setArrangeUngroupThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setArrangeUngroup(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.arrange.ungroup',
      value: payload.binding
    }));
  }
};

export const setViewZoomIn = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_IN,
  payload
});

export const setViewZoomInThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewZoomIn(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.zoomIn',
      value: payload.binding
    }));
  }
};

export const setViewZoomOut = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_OUT,
  payload
});

export const setViewZoomOutThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewZoomOut(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.zoomOut',
      value: payload.binding
    }));
  }
};

export const setViewZoomFitCanvas = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_FIT_CANVAS,
  payload
});

export const setViewZoomFitCanvasThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewZoomFitCanvas(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.zoomFit.canvas',
      value: payload.binding
    }));
  }
};

export const setViewZoomFitSelected = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_FIT_SELECTED,
  payload
});

export const setViewZoomFitSelectedThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewZoomFitSelected(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.zoomFit.selected',
      value: payload.binding
    }));
  }
};

export const setViewZoomFitActiveArtboard = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_ZOOM_FIT_ACTIVE_ARTBOARD,
  payload
});

export const setViewZoomFitActiveArtboardThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewZoomFitActiveArtboard(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.zoomFit.activeArtboard',
      value: payload.binding
    }));
  }
};

export const setViewCenterSelected = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_CENTER_SELECTED,
  payload
});

export const setViewCenterSelectedThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewCenterSelected(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.centerSelected',
      value: payload.binding
    }));
  }
};

export const setViewShowLayers = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_SHOW_LAYERS,
  payload
});

export const setViewShowLayersThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewShowLayers(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.showLayers',
      value: payload.binding
    }));
  }
};

export const setViewShowStyles = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_SHOW_STYLES,
  payload
});

export const setViewShowStylesThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewShowStyles(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.showStyles',
      value: payload.binding
    }));
  }
};

export const setViewShowEvents = (payload: SetBindingPayload): KeyBindingsTypes => ({
  type: SET_VIEW_SHOW_EVENTS,
  payload
});

export const setViewShowEventsThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(setViewShowEvents(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings.view.showEvents',
      value: payload.binding
    }));
  }
};

export const resetAllKeyBindings = (payload: KeyBindingsState): KeyBindingsTypes => ({
  type: RESET_ALL_KEY_BINDINGS,
  payload
});

export const resetAllKeyBindingsThunk = (payload: KeyBindingsState) => {
  return (dispatch: any, getState: any) => {
    dispatch(resetAllKeyBindings(payload));
    (window as any).api.setElectronStore(JSON.stringify({
      key: 'keyBindings',
      value: {
        ...payload,
        defaults: payload
      }
    }));
  }
};

export const hydrateKeyBindings = (payload: KeyBindingsState): KeyBindingsTypes => ({
  type: HYDRATE_KEY_BINDINGS,
  payload
});

export const clearKeyBindingThunk = (payload: SetBindingPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const keyBindings = state.keyBindings;
    let index = -1;
    let cont = true;
    const keys = Object.keys(keyBindings);
    for(let i = 0; i < keys.length; i++) {
      if (!cont) {
        break;
      } else {
        const currentKey = keys[i];
        const currentValue = keyBindings[currentKey];
        if (typeof currentValue === 'object') {
          const currentNestedKeys = Object.keys(currentValue);
          for(let j = 0; j < currentNestedKeys.length; j++) {
            index++;
            const currentNestedKey = currentNestedKeys[j];
            const currentNestedValue = currentValue[currentNestedKey];
            if (currentNestedValue === payload.binding) {
              cont = false;
              break;
            }
          }
        } else {
          index++;
          if (currentValue === payload.binding) {
            cont = false;
            break;
          }
        }
      }
    }
    switch(index) {
      case 0:
        dispatch(setFileNewThunk({binding: ''}));
        break;
      case 1:
        dispatch(setFileSaveThunk({binding: ''}));
        break;
      case 2:
        dispatch(setFileSaveAsThunk({binding: ''}));
        break;
      case 3:
        dispatch(setFileOpenThunk({binding: ''}));
        break;
      case 4:
        dispatch(setEditUndoThunk({binding: ''}));
        break;
      case 5:
        dispatch(setEditRedoThunk({binding: ''}));
        break;
      case 6:
        dispatch(setEditCutThunk({binding: ''}));
        break;
      case 7:
        dispatch(setEditCopyCopyThunk({binding: ''}));
        break;
      case 8:
        dispatch(setEditCopyStyleThunk({binding: ''}));
        break;
      case 9:
        dispatch(setEditCopySvgThunk({binding: ''}));
        break;
      case 10:
        dispatch(setEditPastePasteThunk({binding: ''}));
        break;
      case 11:
        dispatch(setEditPasteOverSelectionThunk({binding: ''}));
        break;
      case 12:
        dispatch(setEditPasteStyleThunk({binding: ''}));
        break;
      case 13:
        dispatch(setEditPasteSvgThunk({binding: ''}));
        break;
      case 14:
        dispatch(setEditDeleteThunk({binding: ''}));
        break;
      case 15:
        dispatch(setEditDuplicateThunk({binding: ''}));
        break;
      case 16:
        dispatch(setEditSelectSelectAllThunk({binding: ''}));
        break;
      case 17:
        dispatch(setEditSelectSelectAllArtboardsThunk({binding: ''}));
        break;
      case 18:
        dispatch(setEditFindThunk({binding: ''}));
        break;
      case 19:
        dispatch(setEditRenameThunk({binding: ''}));
        break;
      case 20:
        dispatch(setInsertArtboardThunk({binding: ''}));
        break;
      case 21:
        dispatch(setInsertShapeRectangleThunk({binding: ''}));
        break;
      case 22:
        dispatch(setInsertShapeRoundedThunk({binding: ''}));
        break;
      case 23:
        dispatch(setInsertShapeEllipseThunk({binding: ''}));
        break;
      case 24:
        dispatch(setInsertShapePolygonThunk({binding: ''}));
        break;
      case 25:
        dispatch(setInsertShapeStarThunk({binding: ''}));
        break;
      case 26:
        dispatch(setInsertShapeLineThunk({binding: ''}));
        break;
      case 27:
        dispatch(setInsertTextThunk({binding: ''}));
        break;
      case 28:
        dispatch(setInsertImageThunk({binding: ''}));
        break;
      case 29:
        dispatch(setLayerStyleFillThunk({binding: ''}));
        break;
      case 30:
        dispatch(setLayerStyleStrokeThunk({binding: ''}));
        break;
      case 31:
        dispatch(setLayerStyleShadowThunk({binding: ''}));
        break;
      case 32:
        dispatch(setLayerTransformFlipHorizontallyThunk({binding: ''}));
        break;
      case 33:
        dispatch(setLayerTransformFlipVerticallyThunk({binding: ''}));
        break;
      case 34:
        dispatch(setLayerCombineUnionThunk({binding: ''}));
        break;
      case 35:
        dispatch(setLayerCombineSubtractThunk({binding: ''}));
        break;
      case 36:
        dispatch(setLayerCombineIntersectThunk({binding: ''}));
        break;
      case 37:
        dispatch(setLayerCombineDifferenceThunk({binding: ''}));
        break;
      case 38:
        dispatch(setLayerImageOriginalDimensionsThunk({binding: ''}));
        break;
      case 39:
        dispatch(setLayerImageReplaceThunk({binding: ''}));
        break;
      case 40:
        dispatch(setLayerMaskUseAsMaskThunk({binding: ''}));
        break;
      case 41:
        dispatch(setLayerMaskIgnoreUnderlyingMaskThunk({binding: ''}));
        break;
      case 42:
        dispatch(setArrangeBringForwardThunk({binding: ''}));
        break;
      case 43:
        dispatch(setArrangeBringToFrontThunk({binding: ''}));
        break;
      case 44:
        dispatch(setArrangeSendBackwardThunk({binding: ''}));
        break;
      case 45:
        dispatch(setArrangeSendToBackThunk({binding: ''}));
        break;
      case 46:
        dispatch(setArrangeAlignLeftThunk({binding: ''}));
        break;
      case 47:
        dispatch(setArrangeAlignCenterThunk({binding: ''}));
        break;
      case 48:
        dispatch(setArrangeAlignRightThunk({binding: ''}));
        break;
      case 49:
        dispatch(setArrangeAlignTopThunk({binding: ''}));
        break;
      case 50:
        dispatch(setArrangeAlignMiddleThunk({binding: ''}));
        break;
      case 51:
        dispatch(setArrangeAlignBottomThunk({binding: ''}));
        break;
      case 52:
        dispatch(setArrangeDistributeHorizontallyThunk({binding: ''}));
        break;
      case 53:
        dispatch(setArrangeDistributeVerticallyThunk({binding: ''}));
        break;
      case 54:
        dispatch(setArrangeGroupThunk({binding: ''}));
        break;
      case 55:
        dispatch(setArrangeUngroupThunk({binding: ''}));
        break;
      case 56:
        dispatch(setViewZoomInThunk({binding: ''}));
        break;
      case 57:
        dispatch(setViewZoomOutThunk({binding: ''}));
        break;
      case 58:
        dispatch(setViewZoomFitCanvasThunk({binding: ''}));
        break;
      case 59:
        dispatch(setViewZoomFitSelectedThunk({binding: ''}));
        break;
      case 60:
        dispatch(setViewZoomFitActiveArtboardThunk({binding: ''}));
        break;
      case 61:
        dispatch(setViewCenterSelectedThunk({binding: ''}));
        break;
      case 62:
        dispatch(setViewShowLayersThunk({binding: ''}));
        break;
      case 63:
        dispatch(setViewShowStylesThunk({binding: ''}));
        break;
      case 64:
        dispatch(setViewShowEventsThunk({binding: ''}));
        break;
      default:
        return;
    }
  }
};