import { v4 as uuidv4 } from 'uuid';
import { paperMain } from '../../canvas';
import { DEFAULT_STYLE, DEFAULT_TEXT_STYLE, DEFAULT_TEXT_VALUE } from '../../constants';

import {
  ADD_PAGE,
  ADD_ARTBOARD,
  ADD_GROUP,
  ADD_SHAPE,
  ADD_TEXT,
  REMOVE_LAYER,
  REMOVE_LAYERS,
  SELECT_LAYER,
  DEEP_SELECT_LAYER,
  SELECT_LAYERS,
  DESELECT_LAYER,
  DESELECT_LAYERS,
  DESELECT_ALL_LAYERS,
  SET_LAYER_HOVER,
  ADD_LAYER_CHILD,
  INSERT_LAYER_CHILD,
  SHOW_LAYER_CHILDREN,
  HIDE_LAYER_CHILDREN,
  INSERT_LAYER_ABOVE,
  INSERT_LAYER_BELOW,
  INCREASE_LAYER_SCOPE,
  DECREASE_LAYER_SCOPE,
  NEW_LAYER_SCOPE,
  CLEAR_LAYER_SCOPE,
  ESCAPE_LAYER_SCOPE,
  GROUP_LAYERS,
  UNGROUP_LAYER,
  UNGROUP_LAYERS,
  COPY_LAYER_TO_CLIPBOARD,
  COPY_LAYERS_TO_CLIPBOARD,
  PASTE_LAYERS_FROM_CLIPBOARD,
  MOVE_LAYER,
  MOVE_LAYERS,
  MOVE_LAYER_TO,
  MOVE_LAYERS_TO,
  MOVE_LAYER_BY,
  MOVE_LAYERS_BY,
  ENABLE_LAYER_DRAG,
  DISABLE_LAYER_DRAG,
  SET_LAYER_NAME,
  SET_ACTIVE_ARTBOARD,
  ADD_LAYER_TWEEN_EVENT,
  REMOVE_LAYER_TWEEN_EVENT,
  ADD_LAYER_TWEEN,
  REMOVE_LAYER_TWEEN,
  SET_LAYER_TWEEN_DURATION,
  INCREMENT_LAYER_TWEEN_DURATION,
  DECREMENT_LAYER_TWEEN_DURATION,
  SET_LAYER_TWEEN_DELAY,
  INCREMENT_LAYER_TWEEN_DELAY,
  DECREMENT_LAYER_TWEEN_DELAY,
  SET_LAYER_TWEEN_EASE,
  SET_LAYER_TWEEN_POWER,
  FREEZE_LAYER_TWEEN,
  UNFREEZE_LAYER_TWEEN,
  SET_LAYER_X,
  SET_LAYER_Y,
  SET_LAYER_WIDTH,
  SET_LAYER_HEIGHT,
  SET_LAYER_ROTATION,
  SET_LAYER_OPACITY,
  ENABLE_LAYER_HORIZONTAL_FLIP,
  DISABLE_LAYER_HORIZONTAL_FLIP,
  ENABLE_LAYER_VERTICAL_FLIP,
  DISABLE_LAYER_VERTICAL_FLIP,
  ENABLE_LAYER_FILL,
  DISABLE_LAYER_FILL,
  SET_LAYER_FILL_COLOR,
  ENABLE_LAYER_STROKE,
  DISABLE_LAYER_STROKE,
  SET_LAYER_STROKE_COLOR,
  SET_LAYER_STROKE_WIDTH,
  SET_LAYER_STROKE_CAP,
  SET_LAYER_STROKE_JOIN,
  SET_LAYER_STROKE_DASH_ARRAY,
  SET_LAYER_STROKE_MITER_LIMIT,
  ENABLE_LAYER_SHADOW,
  DISABLE_LAYER_SHADOW,
  SET_LAYER_SHADOW_COLOR,
  SET_LAYER_SHADOW_BLUR,
  SET_LAYER_SHADOW_X_OFFSET,
  SET_LAYER_SHADOW_Y_OFFSET,
  RESIZE_LAYER,
  RESIZE_LAYERS,
  SET_LAYER_TEXT,
  SET_LAYER_FONT_SIZE,
  SET_LAYER_LEADING,
  SET_LAYER_FONT_WEIGHT,
  SET_LAYER_FONT_FAMILY,
  SET_LAYER_JUSTIFICATION,
  AddPagePayload,
  AddArtboardPayload,
  AddGroupPayload,
  AddShapePayload,
  AddTextPayload,
  RemoveLayerPayload,
  RemoveLayersPayload,
  SelectLayerPayload,
  DeepSelectLayerPayload,
  SelectLayersPayload,
  DeselectLayerPayload,
  DeselectLayersPayload,
  SetLayerHoverPayload,
  AddLayerChildPayload,
  InsertLayerChildPayload,
  ShowLayerChildrenPayload,
  HideLayerChildrenPayload,
  InsertLayerAbovePayload,
  InsertLayerBelowPayload,
  IncreaseLayerScopePayload,
  NewLayerScopePayload,
  GroupLayersPayload,
  UngroupLayerPayload,
  UngroupLayersPayload,
  CopyLayerToClipboardPayload,
  CopyLayersToClipboardPayload,
  PasteLayersFromClipboardPayload,
  MoveLayerPayload,
  MoveLayersPayload,
  MoveLayerToPayload,
  MoveLayersToPayload,
  MoveLayerByPayload,
  MoveLayersByPayload,
  SetLayerNamePayload,
  SetActiveArtboardPayload,
  AddLayerTweenEventPayload,
  RemoveLayerTweenEventPayload,
  AddLayerTweenPayload,
  RemoveLayerTweenPayload,
  SetLayerTweenDurationPayload,
  IncrementLayerTweenDurationPayload,
  DecrementLayerTweenDurationPayload,
  SetLayerTweenDelayPayload,
  IncrementLayerTweenDelayPayload,
  DecrementLayerTweenDelayPayload,
  SetLayerTweenEasePayload,
  SetLayerTweenPowerPayload,
  FreezeLayerTweenPayload,
  UnFreezeLayerTweenPayload,
  SetLayerXPayload,
  SetLayerYPayload,
  SetLayerWidthPayload,
  SetLayerHeightPayload,
  SetLayerRotationPayload,
  SetLayerOpacityPayload,
  EnableLayerHorizontalFlipPayload,
  DisableLayerHorizontalFlipPayload,
  EnableLayerVerticalFlipPayload,
  DisableLayerVerticalFlipPayload,
  EnableLayerFillPayload,
  DisableLayerFillPayload,
  SetLayerFillColorPayload,
  EnableLayerStrokePayload,
  DisableLayerStrokePayload,
  SetLayerStrokeColorPayload,
  SetLayerStrokeWidthPayload,
  SetLayerStrokeCapPayload,
  SetLayerStrokeJoinPayload,
  SetLayerStrokeDashArrayPayload,
  SetLayerStrokeMiterLimitPayload,
  EnableLayerShadowPayload,
  DisableLayerShadowPayload,
  SetLayerShadowColorPayload,
  SetLayerShadowBlurPayload,
  SetLayerShadowXOffsetPayload,
  SetLayerShadowYOffsetPayload,
  ResizeLayerPayload,
  ResizeLayersPayload,
  SetLayerTextPayload,
  SetLayerFontSizePayload,
  SetLayerLeadingPayload,
  SetLayerFontWeightPayload,
  SetLayerFontFamilyPayload,
  SetLayerJustificationPayload,
  LayerTypes
} from '../actionTypes/layer';

// Page

export const addPage = (payload: AddPagePayload): LayerTypes => {
  const layerId = uuidv4();
  const paperLayer = new paperMain.Group({
    data: { id: layerId, type: 'Page' }
  });
  return {
    type: ADD_PAGE,
    payload: {
      type: 'Page',
      id: layerId,
      name: payload.name ? payload.name : 'Page',
      parent: null,
      children: [],
      selected: false,
      tweenEvents: [],
      tweens: []
    }
  }
};

// Artboard

export const addArtboard = (payload: AddArtboardPayload): LayerTypes => {
  const layerId = uuidv4();
  payload.paperLayer.data = { id: 'ArtboardBackground', type: 'ArtboardBackground' };
  //payload.paperLayer.applyMatrix = false;
  const paperLayer = new paperMain.Group({
    name: payload.name ? payload.name : 'Artboard',
    data: { id: layerId, type: 'Artboard' },
    children: [payload.paperLayer],
    //applyMatrix: false
  });
  return {
    type: ADD_ARTBOARD,
    payload: {
      type: 'Artboard',
      id: layerId,
      frame: payload.frame,
      name: payload.name ? payload.name : 'Artboard',
      parent: null,
      children: [],
      selected: false,
      showChildren: false,
      tweenEvents: [],
      tweens: [],
      points: {
        closed: true,
      },
      style: DEFAULT_STYLE,
    }
  }
};

// Group

export const addGroup = (payload: AddGroupPayload): LayerTypes => {
  const layerId = uuidv4();
  const paperLayer = new paperMain.Group({
    name: payload.name ? payload.name : 'Group',
    data: { id: layerId, type: 'Group' },
    //applyMatrix: false
  });
  return {
    type: ADD_GROUP,
    payload: {
      type: 'Group',
      id: layerId,
      frame: payload.frame,
      name: payload.name ? payload.name : 'Group',
      parent: payload.parent ? payload.parent : null,
      children: [],
      selected: false,
      showChildren: false,
      tweenEvents: [],
      tweens: [],
      points: {
        closed: true,
      },
      style: {
        ...DEFAULT_STYLE,
        fill: {
          ...DEFAULT_STYLE.fill,
          enabled: false
        },
        stroke: {
          ...DEFAULT_STYLE.stroke,
          enabled: false
        },
      },
    }
  }
};

// Shape

export const addShape = (payload: AddShapePayload): LayerTypes => {
  const id = uuidv4();
  payload.paperLayer.name = payload.name ? payload.name : payload.shapeType;
  payload.paperLayer.data = {
    id: id,
    type: 'Shape'
  }
  const clone = payload.paperLayer.clone({insert: false}) as paper.PathItem;
  //clone.applyMatrix = true;
  clone.fitBounds(new paperMain.Rectangle({
    point: new paperMain.Point(0,0),
    size: new paperMain.Size(24,24)
  }));
  return {
    type: ADD_SHAPE,
    payload: {
      type: 'Shape',
      id: id,
      frame: payload.frame,
      name: payload.name ? payload.name : payload.shapeType,
      parent: payload.parent ? payload.parent : null,
      shapeType: payload.shapeType,
      pathData: clone.pathData,
      selected: false,
      points: {
        closed: true,
      },
      tweenEvents: [],
      tweens: [],
      style: DEFAULT_STYLE
    }
  }
};

// Text

export const addText = (payload: AddTextPayload): LayerTypes => {
  const id = uuidv4();
  payload.paperLayer.name = payload.name ? payload.name : 'Text';
  payload.paperLayer.data = {
    id: id,
    type: 'Text'
  }
  return {
    type: ADD_TEXT,
    payload: {
      type: 'Text',
      id: id,
      frame: payload.frame,
      name: payload.name ? payload.name : DEFAULT_TEXT_VALUE,
      parent: payload.parent ? payload.parent : null,
      selected: false,
      points: {
        closed: true,
      },
      text: payload.text ? payload.text : DEFAULT_TEXT_VALUE,
      tweenEvents: [],
      tweens: [],
      style: {
        ...DEFAULT_STYLE,
        ...payload.style
      },
      textStyle: {
        ...DEFAULT_TEXT_STYLE,
        ...payload.textStyle
      }
    }
  }
};

// Remove

export const removeLayer = (payload: RemoveLayerPayload): LayerTypes => ({
  type: REMOVE_LAYER,
  payload
});

export const removeLayers = (payload: RemoveLayersPayload): LayerTypes => ({
  type: REMOVE_LAYERS,
  payload
});

// Select

export const selectLayer = (payload: SelectLayerPayload): LayerTypes => ({
  type: SELECT_LAYER,
  payload
});

export const deepSelectLayer = (payload: DeepSelectLayerPayload): LayerTypes => ({
  type: DEEP_SELECT_LAYER,
  payload
});

export const selectLayers = (payload: SelectLayersPayload): LayerTypes => ({
  type: SELECT_LAYERS,
  payload
});

export const deselectLayer = (payload: DeselectLayerPayload): LayerTypes => ({
  type: DESELECT_LAYER,
  payload
});

export const deselectLayers = (payload: DeselectLayersPayload): LayerTypes => ({
  type: DESELECT_LAYERS,
  payload
});

export const deselectAllLayers = (): LayerTypes => ({
  type: DESELECT_ALL_LAYERS
});

// Hover

export const setLayerHover = (payload: SetLayerHoverPayload): LayerTypes => ({
  type: SET_LAYER_HOVER,
  payload
});

// Children

export const addLayerChild = (payload: AddLayerChildPayload): LayerTypes => ({
  type: ADD_LAYER_CHILD,
  payload
});

export const insertLayerChild = (payload: InsertLayerChildPayload): LayerTypes => ({
  type: INSERT_LAYER_CHILD,
  payload
});

export const showLayerChildren = (payload: ShowLayerChildrenPayload): LayerTypes => ({
  type: SHOW_LAYER_CHILDREN,
  payload
});

export const hideLayerChildren = (payload: HideLayerChildrenPayload): LayerTypes => ({
  type: HIDE_LAYER_CHILDREN,
  payload
});

// Insert

export const insertLayerAbove = (payload: InsertLayerAbovePayload): LayerTypes => ({
  type: INSERT_LAYER_ABOVE,
  payload
});

export const insertLayerBelow = (payload: InsertLayerBelowPayload): LayerTypes => ({
  type: INSERT_LAYER_BELOW,
  payload
});

// Scope

export const increaseLayerScope = (payload: IncreaseLayerScopePayload): LayerTypes => ({
  type: INCREASE_LAYER_SCOPE,
  payload
});

export const decreaseLayerScope = (): LayerTypes => ({
  type: DECREASE_LAYER_SCOPE
});

export const clearLayerScope = (): LayerTypes => ({
  type: CLEAR_LAYER_SCOPE
});

export const newLayerScope = (payload: NewLayerScopePayload): LayerTypes => ({
  type: NEW_LAYER_SCOPE,
  payload
});

export const escapeLayerScope = (): LayerTypes => ({
  type: ESCAPE_LAYER_SCOPE
});

// Group

export const groupLayers = (payload: GroupLayersPayload): LayerTypes => ({
  type: GROUP_LAYERS,
  payload
});

export const ungroupLayer = (payload: UngroupLayerPayload): LayerTypes => ({
  type: UNGROUP_LAYER,
  payload
});

export const ungroupLayers = (payload: UngroupLayersPayload): LayerTypes => ({
  type: UNGROUP_LAYERS,
  payload
});

// Clipboard

export const copyLayerToClipboard = (payload: CopyLayerToClipboardPayload): LayerTypes => ({
  type: COPY_LAYER_TO_CLIPBOARD,
  payload
});

export const copyLayersToClipboard = (payload: CopyLayersToClipboardPayload): LayerTypes => ({
  type: COPY_LAYERS_TO_CLIPBOARD,
  payload
});

export const pasteLayersFromClipboard = (payload: PasteLayersFromClipboardPayload): LayerTypes => ({
  type: PASTE_LAYERS_FROM_CLIPBOARD,
  payload
});

// Move

export const moveLayer = (payload: MoveLayerPayload): LayerTypes => ({
  type: MOVE_LAYER,
  payload
});

export const moveLayers = (payload: MoveLayersPayload): LayerTypes => ({
  type: MOVE_LAYERS,
  payload
});

export const moveLayerTo = (payload: MoveLayerToPayload): LayerTypes => ({
  type: MOVE_LAYER_TO,
  payload
});

export const moveLayersTo = (payload: MoveLayersToPayload): LayerTypes => ({
  type: MOVE_LAYERS_TO,
  payload
});

export const moveLayerBy = (payload: MoveLayerByPayload): LayerTypes => ({
  type: MOVE_LAYER_BY,
  payload
});

export const moveLayersBy = (payload: MoveLayersByPayload): LayerTypes => ({
  type: MOVE_LAYERS_BY,
  payload
});

// Drag

export const enableLayerDrag = (): LayerTypes => ({
  type: ENABLE_LAYER_DRAG
});

export const disableLayerDrag = (): LayerTypes => ({
  type: DISABLE_LAYER_DRAG
});

// Name

export const setLayerName = (payload: SetLayerNamePayload): LayerTypes => ({
  type: SET_LAYER_NAME,
  payload
});

// Artboard

export const setActiveArtboard = (payload: SetActiveArtboardPayload): LayerTypes => ({
  type: SET_ACTIVE_ARTBOARD,
  payload
});

// Animation Event

export const addLayerTweenEvent = (payload: AddLayerTweenEventPayload): LayerTypes => ({
  type: ADD_LAYER_TWEEN_EVENT,
  payload: {
    ...payload,
    id: uuidv4()
  }
});

export const removeLayerTweenEvent = (payload: RemoveLayerTweenEventPayload): LayerTypes => ({
  type: REMOVE_LAYER_TWEEN_EVENT,
  payload
});

// Tween

export const addLayerTween = (payload: AddLayerTweenPayload): LayerTypes => ({
  type: ADD_LAYER_TWEEN,
  payload: {
    ...payload,
    id: uuidv4()
  }
});

export const removeLayerTween = (payload: RemoveLayerTweenPayload): LayerTypes => ({
  type: REMOVE_LAYER_TWEEN,
  payload
});

export const setLayerTweenDuration = (payload: SetLayerTweenDurationPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_DURATION,
  payload
});

export const incrementLayerTweenDuration = (payload: IncrementLayerTweenDurationPayload): LayerTypes => ({
  type: INCREMENT_LAYER_TWEEN_DURATION,
  payload
});

export const decrementLayerTweenDuration = (payload: DecrementLayerTweenDurationPayload): LayerTypes => ({
  type: DECREMENT_LAYER_TWEEN_DURATION,
  payload
});

export const setLayerTweenDelay = (payload: SetLayerTweenDelayPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_DELAY,
  payload
});

export const incrementLayerTweenDelay = (payload: IncrementLayerTweenDelayPayload): LayerTypes => ({
  type: INCREMENT_LAYER_TWEEN_DELAY,
  payload
});

export const decrementLayerTweenDelay = (payload: DecrementLayerTweenDelayPayload): LayerTypes => ({
  type: DECREMENT_LAYER_TWEEN_DELAY,
  payload
});

export const setLayerTweenEase = (payload: SetLayerTweenEasePayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_EASE,
  payload
});

export const setLayerTweenPower = (payload: SetLayerTweenPowerPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_POWER,
  payload
});

export const freezeLayerTween = (payload: FreezeLayerTweenPayload): LayerTypes => ({
  type: FREEZE_LAYER_TWEEN,
  payload
});

export const unFreezeLayerTween = (payload: UnFreezeLayerTweenPayload): LayerTypes => ({
  type: UNFREEZE_LAYER_TWEEN,
  payload
});

export const setLayerX = (payload: SetLayerXPayload): LayerTypes => ({
  type: SET_LAYER_X,
  payload
});

export const setLayerY = (payload: SetLayerYPayload): LayerTypes => ({
  type: SET_LAYER_Y,
  payload
});

export const setLayerWidth = (payload: SetLayerWidthPayload): LayerTypes => ({
  type: SET_LAYER_WIDTH,
  payload
});

export const setLayerHeight = (payload: SetLayerHeightPayload): LayerTypes => ({
  type: SET_LAYER_HEIGHT,
  payload
});

export const setLayerRotation = (payload: SetLayerRotationPayload): LayerTypes => ({
  type: SET_LAYER_ROTATION,
  payload
});

export const setLayerOpacity = (payload: SetLayerOpacityPayload): LayerTypes => ({
  type: SET_LAYER_OPACITY,
  payload
});

export const enableLayerHorizontalFlip = (payload: EnableLayerHorizontalFlipPayload): LayerTypes => ({
  type: ENABLE_LAYER_HORIZONTAL_FLIP,
  payload
});

export const disableLayerHorizontalFlip = (payload: DisableLayerHorizontalFlipPayload): LayerTypes => ({
  type: DISABLE_LAYER_HORIZONTAL_FLIP,
  payload
});

export const enableLayerVerticalFlip = (payload: EnableLayerVerticalFlipPayload): LayerTypes => ({
  type: ENABLE_LAYER_VERTICAL_FLIP,
  payload
});

export const disableLayerVerticalFlip = (payload: DisableLayerVerticalFlipPayload): LayerTypes => ({
  type: DISABLE_LAYER_VERTICAL_FLIP,
  payload
});

export const enableLayerFill = (payload: EnableLayerFillPayload): LayerTypes => ({
  type: ENABLE_LAYER_FILL,
  payload
});

export const disableLayerFill = (payload: DisableLayerFillPayload): LayerTypes => ({
  type: DISABLE_LAYER_FILL,
  payload
});

export const setLayerFillColor = (payload: SetLayerFillColorPayload): LayerTypes => ({
  type: SET_LAYER_FILL_COLOR,
  payload
});

export const enableLayerStroke = (payload: EnableLayerStrokePayload): LayerTypes => ({
  type: ENABLE_LAYER_STROKE,
  payload
});

export const disableLayerStroke = (payload: DisableLayerStrokePayload): LayerTypes => ({
  type: DISABLE_LAYER_STROKE,
  payload
});

export const setLayerStrokeColor = (payload: SetLayerStrokeColorPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_COLOR,
  payload
});

export const setLayerStrokeWidth = (payload: SetLayerStrokeWidthPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_WIDTH,
  payload
});

export const setLayerStrokeCap = (payload: SetLayerStrokeCapPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_CAP,
  payload
});

export const setLayerStrokeJoin = (payload: SetLayerStrokeJoinPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_JOIN,
  payload
});

export const setLayerStrokeDashArray = (payload: SetLayerStrokeDashArrayPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_DASH_ARRAY,
  payload
});

export const setLayerStrokeMiterLimit = (payload: SetLayerStrokeMiterLimitPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_MITER_LIMIT,
  payload
});

export const enableLayerShadow = (payload: EnableLayerShadowPayload): LayerTypes => ({
  type: ENABLE_LAYER_SHADOW,
  payload
});

export const disableLayerShadow = (payload: DisableLayerShadowPayload): LayerTypes => ({
  type: DISABLE_LAYER_SHADOW,
  payload
});

export const setLayerShadowColor = (payload: SetLayerShadowColorPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_COLOR,
  payload
});

export const setLayerShadowBlur = (payload: SetLayerShadowBlurPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_BLUR,
  payload
});

export const setLayerShadowXOffset = (payload: SetLayerShadowXOffsetPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_X_OFFSET,
  payload
});

export const setLayerShadowYOffset = (payload: SetLayerShadowYOffsetPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_Y_OFFSET,
  payload
});

export const resizeLayer = (payload: ResizeLayerPayload): LayerTypes => ({
  type: RESIZE_LAYER,
  payload
});

export const resizeLayers = (payload: ResizeLayersPayload): LayerTypes => ({
  type: RESIZE_LAYERS,
  payload
});

export const setLayerText = (payload: SetLayerTextPayload): LayerTypes => ({
  type: SET_LAYER_TEXT,
  payload
});

export const setLayerFontSize = (payload: SetLayerFontSizePayload): LayerTypes => ({
  type: SET_LAYER_FONT_SIZE,
  payload
});

export const setLayerLeading = (payload: SetLayerLeadingPayload): LayerTypes => ({
  type: SET_LAYER_LEADING,
  payload
});

export const setLayerFontWeight = (payload: SetLayerFontWeightPayload): LayerTypes => ({
  type: SET_LAYER_FONT_WEIGHT,
  payload
});

export const setLayerFontFamily = (payload: SetLayerFontFamilyPayload): LayerTypes => ({
  type: SET_LAYER_FONT_FAMILY,
  payload
});

export const setLayerJustification = (payload: SetLayerJustificationPayload): LayerTypes => ({
  type: SET_LAYER_JUSTIFICATION,
  payload
});