import undoable from 'redux-undo';

import {
  ADD_ARTBOARD,
  ADD_GROUP,
  ADD_SHAPE,
  ADD_TEXT,
  ADD_IMAGE,
  ADD_LAYERS,
  REMOVE_LAYER,
  REMOVE_LAYERS,
  SELECT_LAYER,
  DEEP_SELECT_LAYER,
  SELECT_LAYERS,
  DESELECT_LAYER,
  DESELECT_LAYERS,
  SELECT_ALL_LAYERS,
  DESELECT_ALL_LAYERS,
  AREA_SELECT_LAYERS,
  SET_LAYER_HOVER,
  ADD_LAYER_CHILD,
  ADD_LAYER_CHILDREN,
  INSERT_LAYER_CHILD,
  SHOW_LAYER_CHILDREN,
  SHOW_LAYERS_CHILDREN,
  HIDE_LAYER_CHILDREN,
  HIDE_LAYERS_CHILDREN,
  INSERT_LAYER_ABOVE,
  INSERT_LAYERS_ABOVE,
  INSERT_LAYER_BELOW,
  INSERT_LAYERS_BELOW,
  INCREASE_LAYER_SCOPE,
  DECREASE_LAYER_SCOPE,
  CLEAR_LAYER_SCOPE,
  NEW_LAYER_SCOPE,
  ESCAPE_LAYER_SCOPE,
  SET_LAYER_SCOPE,
  SET_LAYERS_SCOPE,
  SET_GLOBAL_SCOPE,
  GROUP_LAYERS,
  UNGROUP_LAYER,
  UNGROUP_LAYERS,
  MOVE_LAYER,
  MOVE_LAYERS,
  MOVE_LAYER_TO,
  MOVE_LAYER_BY,
  MOVE_LAYERS_TO,
  MOVE_LAYERS_BY,
  SET_LAYER_NAME,
  SET_ACTIVE_ARTBOARD,
  ADD_LAYER_EVENT,
  ADD_LAYERS_EVENT,
  SELECT_LAYER_EVENT,
  DESELECT_LAYER_EVENT,
  SELECT_LAYER_EVENTS,
  DESELECT_LAYER_EVENTS,
  DESELECT_ALL_LAYER_EVENTS,
  REMOVE_LAYER_EVENT,
  REMOVE_LAYERS_EVENT,
  SET_LAYER_EVENT_EVENT_LISTENER,
  SET_LAYERS_EVENT_EVENT_LISTENER,
  ADD_LAYER_TWEEN,
  REMOVE_LAYER_TWEEN,
  REMOVE_LAYER_TWEENS,
  SELECT_LAYER_EVENT_TWEEN,
  DESELECT_LAYER_EVENT_TWEEN,
  SELECT_LAYER_EVENT_TWEENS,
  DESELECT_LAYER_EVENT_TWEENS,
  DESELECT_ALL_LAYER_EVENT_TWEENS,
  SET_LAYER_TWEEN_DURATION,
  SET_LAYER_TWEEN_REPEAT,
  SET_LAYER_TWEEN_REPEAT_DELAY,
  SET_LAYER_TWEEN_YOYO,
  SET_LAYER_TWEEN_YOYO_EASE,
  SET_LAYER_TWEEN_TIMING,
  SET_LAYER_TWEEN_DELAY,
  SET_LAYER_TWEEN_EASE,
  SET_LAYER_TWEEN_POWER,
  SET_LAYERS_TWEEN_DURATION,
  SET_LAYERS_TWEEN_REPEAT,
  SET_LAYERS_TWEEN_REPEAT_DELAY,
  SET_LAYERS_TWEEN_YOYO,
  SET_LAYERS_TWEEN_YOYO_EASE,
  SET_LAYERS_TWEEN_TIMING,
  SET_LAYERS_TWEEN_DELAY,
  SET_LAYERS_TWEEN_EASE,
  SET_LAYERS_TWEEN_POWER,
  SET_LAYER_STEPS_TWEEN_STEPS,
  SET_LAYER_ROUGH_TWEEN_CLAMP,
  SET_LAYER_ROUGH_TWEEN_POINTS,
  SET_LAYER_ROUGH_TWEEN_RANDOMIZE,
  SET_LAYER_ROUGH_TWEEN_STRENGTH,
  SET_LAYER_ROUGH_TWEEN_TAPER,
  SET_LAYER_ROUGH_TWEEN_TEMPLATE,
  SET_LAYER_SLOW_TWEEN_LINEAR_RATIO,
  SET_LAYER_SLOW_TWEEN_POWER,
  SET_LAYER_SLOW_TWEEN_YOYO_MODE,
  SET_LAYER_TEXT_TWEEN_DELIMITER,
  SET_LAYER_TEXT_TWEEN_SPEED,
  SET_LAYER_TEXT_TWEEN_DIFF,
  SET_LAYER_TEXT_TWEEN_SCRAMBLE,
  SET_LAYER_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
  SET_LAYER_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
  SET_LAYER_SCRAMBLE_TEXT_TWEEN_SPEED,
  SET_LAYER_SCRAMBLE_TEXT_TWEEN_DELIMITER,
  SET_LAYER_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
  SET_LAYER_CUSTOM_BOUNCE_TWEEN_STRENGTH,
  SET_LAYER_CUSTOM_BOUNCE_TWEEN_END_AT_START,
  SET_LAYER_CUSTOM_BOUNCE_TWEEN_SQUASH,
  SET_LAYER_CUSTOM_WIGGLE_TWEEN_STRENGTH,
  SET_LAYER_CUSTOM_WIGGLE_TWEEN_WIGGLES,
  SET_LAYER_CUSTOM_WIGGLE_TWEEN_TYPE,
  SET_LAYERS_STEPS_TWEEN_STEPS,
  SET_LAYERS_ROUGH_TWEEN_CLAMP,
  SET_LAYERS_ROUGH_TWEEN_POINTS,
  SET_LAYERS_ROUGH_TWEEN_RANDOMIZE,
  SET_LAYERS_ROUGH_TWEEN_STRENGTH,
  SET_LAYERS_ROUGH_TWEEN_TAPER,
  SET_LAYERS_ROUGH_TWEEN_TEMPLATE,
  SET_LAYERS_SLOW_TWEEN_LINEAR_RATIO,
  SET_LAYERS_SLOW_TWEEN_POWER,
  SET_LAYERS_SLOW_TWEEN_YOYO_MODE,
  SET_LAYERS_TEXT_TWEEN_DELIMITER,
  SET_LAYERS_TEXT_TWEEN_SPEED,
  SET_LAYERS_TEXT_TWEEN_DIFF,
  SET_LAYERS_TEXT_TWEEN_SCRAMBLE,
  SET_LAYERS_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
  SET_LAYERS_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
  SET_LAYERS_SCRAMBLE_TEXT_TWEEN_SPEED,
  SET_LAYERS_SCRAMBLE_TEXT_TWEEN_DELIMITER,
  SET_LAYERS_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
  SET_LAYERS_CUSTOM_BOUNCE_TWEEN_STRENGTH,
  SET_LAYERS_CUSTOM_BOUNCE_TWEEN_END_AT_START,
  SET_LAYERS_CUSTOM_BOUNCE_TWEEN_SQUASH,
  SET_LAYERS_CUSTOM_WIGGLE_TWEEN_STRENGTH,
  SET_LAYERS_CUSTOM_WIGGLE_TWEEN_WIGGLES,
  SET_LAYERS_CUSTOM_WIGGLE_TWEEN_TYPE,
  SET_LAYER_X,
  SET_LAYERS_X,
  SET_LAYER_Y,
  SET_LAYERS_Y,
  SET_LAYER_LEFT,
  SET_LAYERS_LEFT,
  SET_LAYER_CENTER,
  SET_LAYERS_CENTER,
  SET_LAYER_RIGHT,
  SET_LAYERS_RIGHT,
  SET_LAYER_TOP,
  SET_LAYERS_TOP,
  SET_LAYER_MIDDLE,
  SET_LAYERS_MIDDLE,
  SET_LAYER_BOTTOM,
  SET_LAYERS_BOTTOM,
  SET_LAYER_WIDTH,
  SET_LAYERS_WIDTH,
  SET_LAYER_HEIGHT,
  SET_LAYERS_HEIGHT,
  SET_LAYER_ROTATION,
  SET_LAYERS_ROTATION,
  SET_LAYER_OPACITY,
  SET_LAYERS_OPACITY,
  SET_LAYER_BLUR_RADIUS,
  SET_LAYERS_BLUR_RADIUS,
  ENABLE_LAYER_HORIZONTAL_FLIP,
  ENABLE_LAYERS_HORIZONTAL_FLIP,
  DISABLE_LAYER_HORIZONTAL_FLIP,
  DISABLE_LAYERS_HORIZONTAL_FLIP,
  ENABLE_LAYER_VERTICAL_FLIP,
  ENABLE_LAYERS_VERTICAL_FLIP,
  DISABLE_LAYER_VERTICAL_FLIP,
  DISABLE_LAYERS_VERTICAL_FLIP,
  ENABLE_LAYER_FILL,
  ENABLE_LAYERS_FILL,
  DISABLE_LAYER_FILL,
  DISABLE_LAYERS_FILL,
  SET_LAYER_FILL,
  SET_LAYER_FILL_COLOR,
  SET_LAYERS_FILL_COLOR,
  SET_LAYERS_FILL_COLORS,
  ENABLE_LAYER_STROKE,
  ENABLE_LAYERS_STROKE,
  DISABLE_LAYER_STROKE,
  DISABLE_LAYERS_STROKE,
  SET_LAYER_STROKE_COLOR,
  SET_LAYERS_STROKE_COLOR,
  SET_LAYERS_STROKE_COLORS,
  SET_LAYER_STROKE_FILL_TYPE,
  SET_LAYERS_STROKE_FILL_TYPE,
  SET_LAYER_GRADIENT,
  SET_LAYERS_GRADIENT,
  SET_LAYER_GRADIENT_TYPE,
  SET_LAYERS_GRADIENT_TYPE,
  SET_LAYER_GRADIENT_ORIGIN,
  SET_LAYERS_GRADIENT_ORIGIN,
  SET_LAYER_GRADIENT_DESTINATION,
  SET_LAYERS_GRADIENT_DESTINATION,
  SET_LAYERS_GRADIENT_OD,
  SET_LAYER_GRADIENT_STOP_COLOR,
  SET_LAYERS_GRADIENT_STOP_COLOR,
  SET_LAYER_GRADIENT_STOP_POSITION,
  SET_LAYERS_GRADIENT_STOP_POSITION,
  ADD_LAYER_GRADIENT_STOP,
  ADD_LAYERS_GRADIENT_STOP,
  REMOVE_LAYER_GRADIENT_STOP,
  REMOVE_LAYERS_GRADIENT_STOP,
  SET_LAYER_ACTIVE_GRADIENT_STOP,
  FLIP_LAYER_GRADIENT,
  FLIP_LAYERS_GRADIENT,
  SET_LAYER_STROKE_WIDTH,
  SET_LAYERS_STROKE_WIDTH,
  SET_LAYER_STROKE_CAP,
  SET_LAYERS_STROKE_CAP,
  SET_LAYER_STROKE_JOIN,
  SET_LAYERS_STROKE_JOIN,
  SET_LAYER_STROKE_DASH_OFFSET,
  SET_LAYERS_STROKE_DASH_OFFSET,
  SET_LAYER_STROKE_DASH_ARRAY,
  SET_LAYERS_STROKE_DASH_ARRAY,
  SET_LAYER_STROKE_DASH_ARRAY_WIDTH,
  SET_LAYERS_STROKE_DASH_ARRAY_WIDTH,
  SET_LAYER_STROKE_DASH_ARRAY_GAP,
  SET_LAYERS_STROKE_DASH_ARRAY_GAP,
  ENABLE_LAYER_SHADOW,
  ENABLE_LAYERS_SHADOW,
  DISABLE_LAYER_SHADOW,
  DISABLE_LAYERS_SHADOW,
  SET_LAYER_SHADOW_COLOR,
  SET_LAYERS_SHADOW_COLOR,
  SET_LAYERS_SHADOW_COLORS,
  ENABLE_LAYER_BLUR,
  DISABLE_LAYER_BLUR,
  ENABLE_LAYERS_BLUR,
  DISABLE_LAYERS_BLUR,
  SET_LAYER_SHADOW_BLUR,
  SET_LAYERS_SHADOW_BLUR,
  SET_LAYER_SHADOW_X_OFFSET,
  SET_LAYERS_SHADOW_X_OFFSET,
  SET_LAYER_SHADOW_Y_OFFSET,
  SET_LAYERS_SHADOW_Y_OFFSET,
  SCALE_LAYER,
  SCALE_LAYERS,
  SET_LAYER_TEXT,
  SET_LAYER_TEXT_RESIZE,
  SET_LAYERS_TEXT_RESIZE,
  SET_LAYER_FONT_SIZE,
  SET_LAYERS_FONT_SIZE,
  SET_LAYER_LETTER_SPACING,
  SET_LAYERS_LETTER_SPACING,
  SET_LAYER_TEXT_TRANSFORM,
  SET_LAYERS_TEXT_TRANSFORM,
  SET_LAYER_LEADING,
  SET_LAYERS_LEADING,
  SET_LAYER_FONT_WEIGHT,
  SET_LAYERS_FONT_WEIGHT,
  SET_LAYER_FONT_FAMILY,
  SET_LAYERS_FONT_FAMILY,
  SET_LAYER_JUSTIFICATION,
  SET_LAYERS_JUSTIFICATION,
  SET_LAYER_VERTICAL_ALIGNMENT,
  SET_LAYERS_VERTICAL_ALIGNMENT,
  SET_LAYER_FONT_STYLE,
  SET_LAYERS_FONT_STYLE,
  SET_LAYER_POINT_X,
  SET_LAYERS_POINT_X,
  SET_LAYER_POINT_Y,
  SET_LAYERS_POINT_Y,
  SET_LAYER_FILL_TYPE,
  SET_LAYERS_FILL_TYPE,
  ADD_LAYERS_MASK,
  SET_LAYER_UNDERLYING_MASK,
  SET_LAYERS_UNDERLYING_MASK,
  TOGGLE_LAYER_IGNORE_UNDERLYING_MASK,
  TOGGLE_LAYERS_IGNORE_UNDERLYING_MASK,
  SET_LAYER_MASKED,
  SET_LAYERS_MASKED,
  TOGGLE_LAYER_MASK,
  TOGGLE_LAYERS_MASK,
  ALIGN_LAYERS_TO_LEFT,
  ALIGN_LAYERS_TO_RIGHT,
  ALIGN_LAYERS_TO_TOP,
  ALIGN_LAYERS_TO_BOTTOM,
  ALIGN_LAYERS_TO_CENTER,
  ALIGN_LAYERS_TO_MIDDLE,
  DISTRIBUTE_LAYERS_HORIZONTALLY,
  DISTRIBUTE_LAYERS_VERTICALLY,
  DUPLICATE_LAYER,
  DUPLICATE_LAYERS,
  REMOVE_DUPLICATED_LAYERS,
  BRING_LAYER_FORWARD,
  BRING_LAYERS_FORWARD,
  BRING_LAYER_TO_FRONT,
  BRING_LAYERS_TO_FRONT,
  SEND_LAYER_BACKWARD,
  SEND_LAYERS_BACKWARD,
  SEND_LAYER_TO_BACK,
  SEND_LAYERS_TO_BACK,
  SET_LAYER_BLEND_MODE,
  SET_LAYERS_BLEND_MODE,
  UNITE_LAYERS,
  INTERSECT_LAYERS,
  SUBTRACT_LAYERS,
  EXCLUDE_LAYERS,
  DIVIDE_LAYERS,
  SET_ROUNDED_RADIUS,
  SET_ROUNDED_RADII,
  SET_POLYGON_SIDES,
  SET_POLYGONS_SIDES,
  SET_STAR_POINTS,
  SET_STARS_POINTS,
  SET_STAR_RADIUS,
  SET_STARS_RADIUS,
  SET_LINE_FROM_X,
  SET_LINES_FROM_X,
  SET_LINE_FROM_Y,
  SET_LINES_FROM_Y,
  SET_LINE_FROM,
  SET_LINE_TO_X,
  SET_LINES_TO_X,
  SET_LINE_TO_Y,
  SET_LINES_TO_Y,
  SET_LINE_TO,
  SET_LAYER_EDIT,
  SET_LAYER_STYLE,
  SET_LAYERS_STYLE,
  RESET_IMAGE_DIMENSIONS,
  RESET_IMAGES_DIMENSIONS,
  REPLACE_IMAGE,
  REPLACE_IMAGES,
  PASTE_LAYERS_FROM_CLIPBOARD,
  SET_LAYER_TREE,
  SET_LAYER_TREE_SCROLL,
  SET_LAYER_TREE_STICKY_ARTBOARD,
  HYDRATE_LAYERS,
  LayerTypes
} from '../actionTypes/layer';

import {
  addArtboard,
  addShape,
  addGroup,
  addText,
  addImage,
  addLayers,
  removeLayer,
  removeLayers,
  selectLayer,
  deepSelectLayer,
  selectLayers,
  deselectLayer,
  deselectLayers,
  selectAllLayers,
  deselectAllLayers,
  areaSelectLayers,
  setLayerHover,
  addLayerChild,
  addLayerChildren,
  // insertLayerChild,
  showLayerChildren,
  showLayersChildren,
  hideLayerChildren,
  hideLayersChildren,
  insertLayerAbove,
  insertLayersAbove,
  insertLayerBelow,
  insertLayersBelow,
  increaseLayerScope,
  decreaseLayerScope,
  newLayerScope,
  clearLayerScope,
  escapeLayerScope,
  setLayerScope,
  setLayersScope,
  setGlobalScope,
  groupLayers,
  ungroupLayer,
  moveLayer,
  moveLayers,
  moveLayerTo,
  moveLayerBy,
  moveLayersTo,
  moveLayersBy,
  ungroupLayers,
  setActiveArtboard,
  addLayerEvent,
  addLayersEvent,
  selectLayerEvent,
  deselectLayerEvent,
  selectLayerEvents,
  deselectLayerEvents,
  deselectAllLayerEvents,
  removeLayerEvent,
  removeLayersEvent,
  setLayerEventEventListener,
  setLayersEventEventListener,
  addLayerTween,
  removeLayerTween,
  removeLayerTweens,
  selectLayerEventTween,
  deselectLayerEventTween,
  selectLayerEventTweens,
  deselectLayerEventTweens,
  deselectAllLayerEventTweens,
  setLayerName,
  setLayerTweenDuration,
  setLayerTweenRepeat,
  setLayerTweenRepeatDelay,
  setLayerTweenYoyo,
  setLayerTweenYoyoEase,
  setLayerTweenTiming,
  setLayerTweenDelay,
  setLayerTweenEase,
  setLayerTweenPower,
  setLayersTweenDuration,
  setLayersTweenRepeat,
  setLayersTweenRepeatDelay,
  setLayersTweenYoyo,
  setLayersTweenYoyoEase,
  setLayersTweenTiming,
  setLayersTweenDelay,
  setLayersTweenEase,
  setLayersTweenPower,
  setLayerStepsTweenSteps,
  setLayerRoughTweenClamp,
  setLayerRoughTweenPoints,
  setLayerRoughTweenRandomize,
  setLayerRoughTweenStrength,
  setLayerRoughTweenTaper,
  setLayerRoughTweenTemplate,
  setLayerSlowTweenLinearRatio,
  setLayerSlowTweenPower,
  setLayerSlowTweenYoYoMode,
  setLayerTextTweenDelimiter,
  setLayerTextTweenSpeed,
  setLayerTextTweenDiff,
  setLayerTextTweenScramble,
  setLayerScrambleTextTweenCharacters,
  setLayerScrambleTextTweenRevealDelay,
  setLayerScrambleTextTweenSpeed,
  setLayerScrambleTextTweenDelimiter,
  setLayerScrambleTextTweenRightToLeft,
  setLayerCustomBounceTweenStrength,
  setLayerCustomBounceTweenEndAtStart,
  setLayerCustomBounceTweenSquash,
  setLayerCustomWiggleTweenStrength,
  setLayerCustomWiggleTweenWiggles,
  setLayerCustomWiggleTweenType,
  setLayersStepsTweenSteps,
  setLayersRoughTweenClamp,
  setLayersRoughTweenPoints,
  setLayersRoughTweenRandomize,
  setLayersRoughTweenStrength,
  setLayersRoughTweenTaper,
  setLayersRoughTweenTemplate,
  setLayersSlowTweenLinearRatio,
  setLayersSlowTweenPower,
  setLayersSlowTweenYoYoMode,
  setLayersTextTweenDelimiter,
  setLayersTextTweenSpeed,
  setLayersTextTweenDiff,
  setLayersTextTweenScramble,
  setLayersScrambleTextTweenCharacters,
  setLayersScrambleTextTweenRevealDelay,
  setLayersScrambleTextTweenSpeed,
  setLayersScrambleTextTweenDelimiter,
  setLayersScrambleTextTweenRightToLeft,
  setLayersCustomBounceTweenStrength,
  setLayersCustomBounceTweenEndAtStart,
  setLayersCustomBounceTweenSquash,
  setLayersCustomWiggleTweenStrength,
  setLayersCustomWiggleTweenWiggles,
  setLayersCustomWiggleTweenType,
  setLayerX,
  setLayersX,
  setLayerY,
  setLayersY,
  setLayerLeft,
  setLayersLeft,
  setLayerCenter,
  setLayersCenter,
  setLayerRight,
  setLayersRight,
  setLayerTop,
  setLayersTop,
  setLayerMiddle,
  setLayersMiddle,
  setLayerBottom,
  setLayersBottom,
  setLayerWidth,
  setLayersWidth,
  setLayerHeight,
  setLayersHeight,
  setLayerRotation,
  setLayersRotation,
  setLayerOpacity,
  setLayersOpacity,
  enableLayerBlur,
  disableLayerBlur,
  enableLayersBlur,
  disableLayersBlur,
  setLayerBlurRadius,
  setLayersBlurRadius,
  enableLayerHorizontalFlip,
  enableLayersHorizontalFlip,
  disableLayerHorizontalFlip,
  disableLayersHorizontalFlip,
  enableLayerVerticalFlip,
  enableLayersVerticalFlip,
  disableLayerVerticalFlip,
  disableLayersVerticalFlip,
  enableLayerFill,
  enableLayersFill,
  disableLayerFill,
  disableLayersFill,
  setLayerFillColor,
  setLayersFillColor,
  setLayersFillColors,
  enableLayerStroke,
  enableLayersStroke,
  disableLayerStroke,
  disableLayersStroke,
  setLayerStrokeColor,
  setLayersStrokeColor,
  setLayersStrokeColors,
  setLayerStrokeFillType,
  setLayersStrokeFillType,
  setLayerGradient,
  setLayersGradient,
  setLayerGradientType,
  setLayersGradientType,
  setLayerStrokeWidth,
  setLayersStrokeWidth,
  setLayerStrokeCap,
  setLayersStrokeCap,
  setLayerStrokeJoin,
  setLayersStrokeJoin,
  setLayerStrokeDashOffset,
  setLayersStrokeDashOffset,
  setLayerStrokeDashArray,
  setLayersStrokeDashArray,
  setLayerStrokeDashArrayWidth,
  setLayersStrokeDashArrayWidth,
  setLayerStrokeDashArrayGap,
  setLayersStrokeDashArrayGap,
  enableLayerShadow,
  enableLayersShadow,
  disableLayerShadow,
  disableLayersShadow,
  setLayerShadowColor,
  setLayersShadowColor,
  setLayersShadowColors,
  setLayerShadowBlur,
  setLayersShadowBlur,
  setLayerShadowXOffset,
  setLayersShadowXOffset,
  setLayerShadowYOffset,
  setLayersShadowYOffset,
  scaleLayer,
  scaleLayers,
  setLayerFontSize,
  setLayersFontSize,
  setLayerLetterSpacing,
  setLayersLetterSpacing,
  setLayerTextTransform,
  setLayersTextTransform,
  setLayerLeading,
  setLayersLeading,
  setLayerFontWeight,
  setLayersFontWeight,
  setLayerFontFamily,
  setLayersFontFamily,
  setLayerJustification,
  setLayersJustification,
  setLayerVerticalAlignment,
  setLayersVerticalAlignment,
  setLayerFontStyle,
  setLayersFontStyle,
  setLayerPointX,
  setLayersPointX,
  setLayerPointY,
  setLayersPointY,
  setLayerText,
  setLayerTextResize,
  setLayersTextResize,
  setLayerFill,
  setLayerFillType,
  setLayersFillType,
  setLayerGradientOrigin,
  setLayersGradientOrigin,
  setLayerGradientDestination,
  setLayersGradientDestination,
  setLayersGradientOD,
  setLayerGradientStopColor,
  setLayersGradientStopColor,
  setLayerGradientStopPosition,
  setLayersGradientStopPosition,
  addLayerGradientStop,
  addLayersGradientStop,
  removeLayerGradientStop,
  removeLayersGradientStop,
  setLayerActiveGradientStop,
  flipLayerGradient,
  flipLayersGradient,
  addLayersMask,
  setLayerUnderlyingMask,
  setLayersUnderlyingMask,
  toggleLayerIgnoreUnderlyingMask,
  toggleLayersIgnoreUnderlyingMask,
  setLayerMasked,
  setLayersMasked,
  toggleLayerMask,
  toggleLayersMask,
  // removeLayersMask,
  alignLayersToLeft,
  alignLayersToRight,
  alignLayersToTop,
  alignLayersToBottom,
  alignLayersToCenter,
  alignLayersToMiddle,
  distributeLayersHorizontally,
  distributeLayersVertically,
  duplicateLayer,
  duplicateLayers,
  removeDuplicatedLayers,
  bringLayerForward,
  bringLayersForward,
  bringLayerToFront,
  bringLayersToFront,
  sendLayerBackward,
  sendLayersBackward,
  sendLayerToBack,
  sendLayersToBack,
  setLayerBlendMode,
  setLayersBlendMode,
  uniteLayers,
  intersectLayers,
  subtractLayers,
  excludeLayers,
  divideLayers,
  setRoundedRadius,
  setRoundedRadii,
  setPolygonSides,
  setPolygonsSides,
  setStarPoints,
  setStarsPoints,
  setStarRadius,
  setStarsRadius,
  setLineFromX,
  setLinesFromX,
  setLineFromY,
  setLinesFromY,
  setLineFrom,
  setLineToX,
  setLinesToX,
  setLineToY,
  setLinesToY,
  setLineTo,
  setLayerEdit,
  setLayerStyle,
  setLayersStyle,
  resetImageDimensions,
  resetImagesDimensions,
  replaceImage,
  replaceImages,
  pasteLayersFromClipboard,
  setLayerTree,
  setLayerTreeScroll,
  setLayerTreeStickyArtboard
} from '../utils/layer';

export interface LayerState {
  byId: {
    [id: string]: Btwx.Layer;
  };
  allIds: string[];
  allArtboardIds: string[];
  allShapeIds: string[];
  allGroupIds: string[];
  allTextIds: string[];
  allImageIds: string[];
  scope: string[];
  activeProjectIndex: number;
  activeArtboard: string;
  selected: string[];
  hover: string;
  events: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.Event;
    };
    selected: string[];
  };
  tweens: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.Tween;
    };
    selected: {
      allIds: string[];
      handle: {
        [id: string]: 'delay' | 'duration' | 'both';
      };
    };
  };
  shapeIcons: {
    [id: string]: string;
  };
  tree: Btwx.Tree;
  selectedEdit: string;
  edit: Btwx.Edit;
}

export const initialState: LayerState = {
  byId: {
    root: {
      type: 'Root',
      id: 'root',
      name: 'root',
      parent: null,
      children: [],
      showChildren: true,
      scope: [],
      frame: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0
      }
    } as Btwx.Root
  },
  allIds: ['root'],
  allArtboardIds: [],
  allShapeIds: [],
  allGroupIds: [],
  allTextIds: [],
  allImageIds: [],
  scope: ['root'],
  activeProjectIndex: null,
  activeArtboard: null,
  selected: [],
  hover: null,
  events: {
    allIds: [],
    byId: {},
    selected: []
  },
  tweens: {
    allIds: [],
    byId: {},
    selected: {
      allIds: [],
      handle: {}
    }
  },
  shapeIcons: {},
  selectedEdit: null,
  tree: {
    stickyArtboard: null,
    byId: {},
    scroll: null
  },
  edit: {
    id: null,
    selectedEdit: null,
    detail: null,
    payload: null,
    actionType: null,
    treeEdit: false,
    undoable: false
  }
};

export const baseReducer = (state = initialState, action: LayerTypes): LayerState => {
  switch (action.type) {
    case ADD_ARTBOARD:
      return addArtboard(state, action);
    case ADD_GROUP:
      return addGroup(state, action);
    case ADD_SHAPE:
      return addShape(state, action);
    case ADD_TEXT:
      return addText(state, action);
    case ADD_IMAGE:
      return addImage(state, action);
    case ADD_LAYERS:
      return addLayers(state, action);
    case REMOVE_LAYER:
      return removeLayer(state, action);
    case REMOVE_LAYERS:
      return removeLayers(state, action);
    case SELECT_LAYER:
      return selectLayer(state, action);
    case DEEP_SELECT_LAYER:
      return deepSelectLayer(state, action);
    case SELECT_LAYERS:
      return selectLayers(state, action);
    case DESELECT_LAYER:
      return deselectLayer(state, action);
    case DESELECT_LAYERS:
      return deselectLayers(state, action);
    case SELECT_ALL_LAYERS:
      return selectAllLayers(state, action);
    case DESELECT_ALL_LAYERS:
      return deselectAllLayers(state, action);
    case AREA_SELECT_LAYERS:
      return areaSelectLayers(state, action);
    case SET_LAYER_HOVER:
      return setLayerHover(state, action);
    case ADD_LAYER_CHILD:
      return addLayerChild(state, action);
    case ADD_LAYER_CHILDREN:
      return addLayerChildren(state, action);
    case SHOW_LAYER_CHILDREN:
      return showLayerChildren(state, action);
    case SHOW_LAYERS_CHILDREN:
      return showLayersChildren(state, action);
    case HIDE_LAYER_CHILDREN:
      return hideLayerChildren(state, action);
    case HIDE_LAYERS_CHILDREN:
      return hideLayersChildren(state, action);
    case INSERT_LAYER_ABOVE:
      return insertLayerAbove(state, action);
    case INSERT_LAYERS_ABOVE:
      return insertLayersAbove(state, action);
    case INSERT_LAYER_BELOW:
      return insertLayerBelow(state, action);
    case INSERT_LAYERS_BELOW:
      return insertLayersBelow(state, action);
    case INCREASE_LAYER_SCOPE:
      return increaseLayerScope(state, action);
    case DECREASE_LAYER_SCOPE:
      return decreaseLayerScope(state, action);
    case NEW_LAYER_SCOPE:
      return newLayerScope(state, action);
    case CLEAR_LAYER_SCOPE:
      return clearLayerScope(state, action);
    case ESCAPE_LAYER_SCOPE:
      return escapeLayerScope(state, action);
    case SET_LAYER_SCOPE:
      return setLayerScope(state, action);
    case SET_LAYERS_SCOPE:
      return setLayersScope(state, action);
    case SET_GLOBAL_SCOPE:
      return setGlobalScope(state, action);
    case GROUP_LAYERS:
      return groupLayers(state, action);
    case UNGROUP_LAYER:
      return ungroupLayer(state, action);
    case UNGROUP_LAYERS:
      return ungroupLayers(state, action);
    case MOVE_LAYER:
      return moveLayer(state, action);
    case MOVE_LAYERS:
      return moveLayers(state, action);
    case MOVE_LAYER_TO:
      return moveLayerTo(state, action);
    case MOVE_LAYERS_TO:
      return moveLayersTo(state, action);
    case MOVE_LAYER_BY:
      return moveLayerBy(state, action);
    case MOVE_LAYERS_BY:
      return moveLayersBy(state, action);
    case SET_LAYER_NAME:
      return setLayerName(state, action);
    case SET_ACTIVE_ARTBOARD:
      return setActiveArtboard(state, action);
    case ADD_LAYER_EVENT:
      return addLayerEvent(state, action);
    case ADD_LAYERS_EVENT:
      return addLayersEvent(state, action);
    case REMOVE_LAYER_EVENT:
      return removeLayerEvent(state, action);
    case REMOVE_LAYERS_EVENT:
      return removeLayersEvent(state, action);
    case SET_LAYER_EVENT_EVENT_LISTENER:
      return setLayerEventEventListener(state, action);
    case SET_LAYERS_EVENT_EVENT_LISTENER:
      return setLayersEventEventListener(state, action);
    case SELECT_LAYER_EVENT:
      return selectLayerEvent(state, action);
    case DESELECT_LAYER_EVENT:
      return deselectLayerEvent(state, action);
    case SELECT_LAYER_EVENTS:
      return selectLayerEvents(state, action);
    case DESELECT_LAYER_EVENTS:
      return deselectLayerEvents(state, action);
    case DESELECT_ALL_LAYER_EVENTS:
      return deselectAllLayerEvents(state, action);
    case ADD_LAYER_TWEEN:
      return addLayerTween(state, action);
    case REMOVE_LAYER_TWEEN:
      return removeLayerTween(state, action);
    case REMOVE_LAYER_TWEENS:
      return removeLayerTweens(state, action);
    case SELECT_LAYER_EVENT_TWEEN:
      return selectLayerEventTween(state, action);
    case DESELECT_LAYER_EVENT_TWEEN:
      return deselectLayerEventTween(state, action);
    case SELECT_LAYER_EVENT_TWEENS:
      return selectLayerEventTweens(state, action);
    case DESELECT_LAYER_EVENT_TWEENS:
      return deselectLayerEventTweens(state, action);
    case DESELECT_ALL_LAYER_EVENT_TWEENS:
      return deselectAllLayerEventTweens(state, action);
    case SET_LAYER_TWEEN_DURATION:
      return setLayerTweenDuration(state, action);
    case SET_LAYER_TWEEN_REPEAT:
      return setLayerTweenRepeat(state, action);
    case SET_LAYER_TWEEN_REPEAT_DELAY:
      return setLayerTweenRepeatDelay(state, action);
    case SET_LAYER_TWEEN_YOYO:
      return setLayerTweenYoyo(state, action);
    case SET_LAYER_TWEEN_YOYO_EASE:
      return setLayerTweenYoyoEase(state, action);
    case SET_LAYER_TWEEN_TIMING:
      return setLayerTweenTiming(state, action);
    case SET_LAYER_TWEEN_DELAY:
      return setLayerTweenDelay(state, action);
    case SET_LAYER_TWEEN_EASE:
      return setLayerTweenEase(state, action);
    case SET_LAYER_TWEEN_POWER:
      return setLayerTweenPower(state, action);
    case SET_LAYERS_TWEEN_DURATION:
      return setLayersTweenDuration(state, action);
    case SET_LAYERS_TWEEN_REPEAT:
      return setLayersTweenRepeat(state, action);
    case SET_LAYERS_TWEEN_REPEAT_DELAY:
      return setLayersTweenRepeatDelay(state, action);
    case SET_LAYERS_TWEEN_YOYO:
      return setLayersTweenYoyo(state, action);
    case SET_LAYERS_TWEEN_YOYO_EASE:
      return setLayersTweenYoyoEase(state, action);
    case SET_LAYERS_TWEEN_TIMING:
      return setLayersTweenTiming(state, action);
    case SET_LAYERS_TWEEN_DELAY:
      return setLayersTweenDelay(state, action);
    case SET_LAYERS_TWEEN_EASE:
      return setLayersTweenEase(state, action);
    case SET_LAYERS_TWEEN_POWER:
      return setLayersTweenPower(state, action);
    case SET_LAYER_STEPS_TWEEN_STEPS:
      return setLayerStepsTweenSteps(state, action);
    case SET_LAYER_ROUGH_TWEEN_CLAMP:
      return setLayerRoughTweenClamp(state, action);
    case SET_LAYER_ROUGH_TWEEN_POINTS:
      return setLayerRoughTweenPoints(state, action);
    case SET_LAYER_ROUGH_TWEEN_RANDOMIZE:
      return setLayerRoughTweenRandomize(state, action);
    case SET_LAYER_ROUGH_TWEEN_STRENGTH:
      return setLayerRoughTweenStrength(state, action);
    case SET_LAYER_ROUGH_TWEEN_TAPER:
      return setLayerRoughTweenTaper(state, action);
    case SET_LAYER_ROUGH_TWEEN_TEMPLATE:
      return setLayerRoughTweenTemplate(state, action);
    case SET_LAYER_SLOW_TWEEN_LINEAR_RATIO:
      return setLayerSlowTweenLinearRatio(state, action);
    case SET_LAYER_SLOW_TWEEN_POWER:
      return setLayerSlowTweenPower(state, action);
    case SET_LAYER_SLOW_TWEEN_YOYO_MODE:
      return setLayerSlowTweenYoYoMode(state, action);
    case SET_LAYER_TEXT_TWEEN_DELIMITER:
      return setLayerTextTweenDelimiter(state, action);
    case SET_LAYER_TEXT_TWEEN_SPEED:
      return setLayerTextTweenSpeed(state, action);
    case SET_LAYER_TEXT_TWEEN_DIFF:
      return setLayerTextTweenDiff(state, action);
    case SET_LAYER_TEXT_TWEEN_SCRAMBLE:
      return setLayerTextTweenScramble(state, action);
    case SET_LAYER_SCRAMBLE_TEXT_TWEEN_CHARACTERS:
      return setLayerScrambleTextTweenCharacters(state, action);
    case SET_LAYER_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY:
      return setLayerScrambleTextTweenRevealDelay(state, action);
    case SET_LAYER_SCRAMBLE_TEXT_TWEEN_SPEED:
      return setLayerScrambleTextTweenSpeed(state, action);
    case SET_LAYER_SCRAMBLE_TEXT_TWEEN_DELIMITER:
      return setLayerScrambleTextTweenDelimiter(state, action);
    case SET_LAYER_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT:
      return setLayerScrambleTextTweenRightToLeft(state, action);
    case SET_LAYER_CUSTOM_BOUNCE_TWEEN_STRENGTH:
      return setLayerCustomBounceTweenStrength(state, action);
    case SET_LAYER_CUSTOM_BOUNCE_TWEEN_END_AT_START:
      return setLayerCustomBounceTweenEndAtStart(state, action);
    case SET_LAYER_CUSTOM_BOUNCE_TWEEN_SQUASH:
      return setLayerCustomBounceTweenSquash(state, action);
    case SET_LAYER_CUSTOM_WIGGLE_TWEEN_STRENGTH:
      return setLayerCustomWiggleTweenStrength(state, action);
    case SET_LAYER_CUSTOM_WIGGLE_TWEEN_WIGGLES:
      return setLayerCustomWiggleTweenWiggles(state, action);
    case SET_LAYER_CUSTOM_WIGGLE_TWEEN_TYPE:
      return setLayerCustomWiggleTweenType(state, action);
    case SET_LAYERS_STEPS_TWEEN_STEPS:
      return setLayersStepsTweenSteps(state, action);
    case SET_LAYERS_ROUGH_TWEEN_CLAMP:
      return setLayersRoughTweenClamp(state, action);
    case SET_LAYERS_ROUGH_TWEEN_POINTS:
      return setLayersRoughTweenPoints(state, action);
    case SET_LAYERS_ROUGH_TWEEN_RANDOMIZE:
      return setLayersRoughTweenRandomize(state, action);
    case SET_LAYERS_ROUGH_TWEEN_STRENGTH:
      return setLayersRoughTweenStrength(state, action);
    case SET_LAYERS_ROUGH_TWEEN_TAPER:
      return setLayersRoughTweenTaper(state, action);
    case SET_LAYERS_ROUGH_TWEEN_TEMPLATE:
      return setLayersRoughTweenTemplate(state, action);
    case SET_LAYERS_SLOW_TWEEN_LINEAR_RATIO:
      return setLayersSlowTweenLinearRatio(state, action);
    case SET_LAYERS_SLOW_TWEEN_POWER:
      return setLayersSlowTweenPower(state, action);
    case SET_LAYERS_SLOW_TWEEN_YOYO_MODE:
      return setLayersSlowTweenYoYoMode(state, action);
    case SET_LAYERS_TEXT_TWEEN_DELIMITER:
      return setLayersTextTweenDelimiter(state, action);
    case SET_LAYERS_TEXT_TWEEN_SPEED:
      return setLayersTextTweenSpeed(state, action);
    case SET_LAYERS_TEXT_TWEEN_DIFF:
      return setLayersTextTweenDiff(state, action);
    case SET_LAYERS_TEXT_TWEEN_SCRAMBLE:
      return setLayersTextTweenScramble(state, action);
    case SET_LAYERS_SCRAMBLE_TEXT_TWEEN_CHARACTERS:
      return setLayersScrambleTextTweenCharacters(state, action);
    case SET_LAYERS_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY:
      return setLayersScrambleTextTweenRevealDelay(state, action);
    case SET_LAYERS_SCRAMBLE_TEXT_TWEEN_SPEED:
      return setLayersScrambleTextTweenSpeed(state, action);
    case SET_LAYERS_SCRAMBLE_TEXT_TWEEN_DELIMITER:
      return setLayersScrambleTextTweenDelimiter(state, action);
    case SET_LAYERS_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT:
      return setLayersScrambleTextTweenRightToLeft(state, action);
    case SET_LAYERS_CUSTOM_BOUNCE_TWEEN_STRENGTH:
      return setLayersCustomBounceTweenStrength(state, action);
    case SET_LAYERS_CUSTOM_BOUNCE_TWEEN_END_AT_START:
      return setLayersCustomBounceTweenEndAtStart(state, action);
    case SET_LAYERS_CUSTOM_BOUNCE_TWEEN_SQUASH:
      return setLayersCustomBounceTweenSquash(state, action);
    case SET_LAYERS_CUSTOM_WIGGLE_TWEEN_STRENGTH:
      return setLayersCustomWiggleTweenStrength(state, action);
    case SET_LAYERS_CUSTOM_WIGGLE_TWEEN_WIGGLES:
      return setLayersCustomWiggleTweenWiggles(state, action);
    case SET_LAYERS_CUSTOM_WIGGLE_TWEEN_TYPE:
      return setLayersCustomWiggleTweenType(state, action);
    case SET_LAYER_X:
      return setLayerX(state, action);
    case SET_LAYERS_X:
      return setLayersX(state, action);
    case SET_LAYER_Y:
      return setLayerY(state, action);
    case SET_LAYERS_Y:
      return setLayersY(state, action);
    case SET_LAYER_LEFT:
      return setLayerLeft(state, action);
    case SET_LAYERS_LEFT:
      return setLayersLeft(state, action);
    case SET_LAYER_CENTER:
      return setLayerCenter(state, action);
    case SET_LAYERS_CENTER:
      return setLayersCenter(state, action);
    case SET_LAYER_RIGHT:
      return setLayerRight(state, action);
    case SET_LAYERS_RIGHT:
      return setLayersRight(state, action);
    case SET_LAYER_TOP:
      return setLayerTop(state, action);
    case SET_LAYERS_TOP:
      return setLayersTop(state, action);
    case SET_LAYER_MIDDLE:
      return setLayerMiddle(state, action);
    case SET_LAYERS_MIDDLE:
      return setLayersMiddle(state, action);
    case SET_LAYER_BOTTOM:
      return setLayerBottom(state, action);
    case SET_LAYERS_BOTTOM:
      return setLayersBottom(state, action);
    case SET_LAYER_WIDTH:
      return setLayerWidth(state, action);
    case SET_LAYERS_WIDTH:
      return setLayersWidth(state, action);
    case SET_LAYER_HEIGHT:
      return setLayerHeight(state, action);
    case SET_LAYERS_HEIGHT:
      return setLayersHeight(state, action);
    case SET_LAYER_ROTATION:
      return setLayerRotation(state, action);
    case SET_LAYERS_ROTATION:
      return setLayersRotation(state, action);
    case SET_LAYER_OPACITY:
      return setLayerOpacity(state, action);
    case SET_LAYERS_OPACITY:
      return setLayersOpacity(state, action);
    case SET_LAYER_BLUR_RADIUS:
      return setLayerBlurRadius(state, action);
    case SET_LAYERS_BLUR_RADIUS:
      return setLayersBlurRadius(state, action);
    case ENABLE_LAYER_HORIZONTAL_FLIP:
      return enableLayerHorizontalFlip(state, action);
    case ENABLE_LAYERS_HORIZONTAL_FLIP:
      return enableLayersHorizontalFlip(state, action);
    case DISABLE_LAYER_HORIZONTAL_FLIP:
      return disableLayerHorizontalFlip(state, action);
    case DISABLE_LAYERS_HORIZONTAL_FLIP:
      return disableLayersHorizontalFlip(state, action);
    case ENABLE_LAYER_VERTICAL_FLIP:
      return enableLayerVerticalFlip(state, action);
    case ENABLE_LAYERS_VERTICAL_FLIP:
      return enableLayersVerticalFlip(state, action);
    case DISABLE_LAYER_VERTICAL_FLIP:
      return disableLayerVerticalFlip(state, action);
    case DISABLE_LAYERS_VERTICAL_FLIP:
      return disableLayersVerticalFlip(state, action);
    case ENABLE_LAYER_FILL:
      return enableLayerFill(state, action);
    case ENABLE_LAYERS_FILL:
      return enableLayersFill(state, action);
    case DISABLE_LAYER_FILL:
      return disableLayerFill(state, action);
    case DISABLE_LAYERS_FILL:
      return disableLayersFill(state, action);
    case SET_LAYER_FILL_COLOR:
      return setLayerFillColor(state, action);
    case SET_LAYERS_FILL_COLOR:
      return setLayersFillColor(state, action);
    case SET_LAYERS_FILL_COLORS:
      return setLayersFillColors(state, action);
    case ENABLE_LAYER_STROKE:
      return enableLayerStroke(state, action);
    case ENABLE_LAYERS_STROKE:
      return enableLayersStroke(state, action);
    case DISABLE_LAYER_STROKE:
      return disableLayerStroke(state, action);
    case DISABLE_LAYERS_STROKE:
      return disableLayersStroke(state, action);
    case SET_LAYER_STROKE_COLOR:
      return setLayerStrokeColor(state, action);
    case SET_LAYERS_STROKE_COLOR:
      return setLayersStrokeColor(state, action);
    case SET_LAYERS_STROKE_COLORS:
      return setLayersStrokeColors(state, action);
    case SET_LAYER_STROKE_FILL_TYPE:
      return setLayerStrokeFillType(state, action);
    case SET_LAYERS_STROKE_FILL_TYPE:
      return setLayersStrokeFillType(state, action);
    case SET_LAYER_GRADIENT:
      return setLayerGradient(state, action);
    case SET_LAYERS_GRADIENT:
      return setLayersGradient(state, action);
    case SET_LAYER_GRADIENT_TYPE:
      return setLayerGradientType(state, action);
    case SET_LAYERS_GRADIENT_TYPE:
      return setLayersGradientType(state, action);
    case SET_LAYER_STROKE_WIDTH:
      return setLayerStrokeWidth(state, action);
    case SET_LAYERS_STROKE_WIDTH:
      return setLayersStrokeWidth(state, action);
    case SET_LAYER_STROKE_CAP:
      return setLayerStrokeCap(state, action);
    case SET_LAYERS_STROKE_CAP:
      return setLayersStrokeCap(state, action);
    case SET_LAYER_STROKE_JOIN:
      return setLayerStrokeJoin(state, action);
    case SET_LAYERS_STROKE_JOIN:
      return setLayersStrokeJoin(state, action);
    case SET_LAYER_STROKE_DASH_OFFSET:
      return setLayerStrokeDashOffset(state, action);
    case SET_LAYERS_STROKE_DASH_OFFSET:
      return setLayersStrokeDashOffset(state, action);
    case SET_LAYER_STROKE_DASH_ARRAY:
      return setLayerStrokeDashArray(state, action);
    case SET_LAYERS_STROKE_DASH_ARRAY:
      return setLayersStrokeDashArray(state, action);
    case SET_LAYER_STROKE_DASH_ARRAY_WIDTH:
      return setLayerStrokeDashArrayWidth(state, action);
    case SET_LAYERS_STROKE_DASH_ARRAY_WIDTH:
      return setLayersStrokeDashArrayWidth(state, action);
    case SET_LAYER_STROKE_DASH_ARRAY_GAP:
      return setLayerStrokeDashArrayGap(state, action);
    case SET_LAYERS_STROKE_DASH_ARRAY_GAP:
      return setLayersStrokeDashArrayGap(state, action);
    case ENABLE_LAYER_SHADOW:
      return enableLayerShadow(state, action);
    case ENABLE_LAYERS_SHADOW:
      return enableLayersShadow(state, action);
    case DISABLE_LAYER_SHADOW:
      return disableLayerShadow(state, action);
    case DISABLE_LAYERS_SHADOW:
      return disableLayersShadow(state, action);
    case SET_LAYER_SHADOW_COLOR:
      return setLayerShadowColor(state, action);
    case SET_LAYERS_SHADOW_COLOR:
      return setLayersShadowColor(state, action);
    case SET_LAYERS_SHADOW_COLORS:
      return setLayersShadowColors(state, action);
    case ENABLE_LAYER_BLUR:
      return enableLayerBlur(state, action);
    case DISABLE_LAYER_BLUR:
      return disableLayerBlur(state, action);
    case ENABLE_LAYERS_BLUR:
      return enableLayersBlur(state, action);
    case DISABLE_LAYERS_BLUR:
      return disableLayersBlur(state, action);
    case SET_LAYER_SHADOW_BLUR:
      return setLayerShadowBlur(state, action);
    case SET_LAYERS_SHADOW_BLUR:
      return setLayersShadowBlur(state, action);
    case SET_LAYER_SHADOW_X_OFFSET:
      return setLayerShadowXOffset(state, action);
    case SET_LAYERS_SHADOW_X_OFFSET:
      return setLayersShadowXOffset(state, action);
    case SET_LAYER_SHADOW_Y_OFFSET:
      return setLayerShadowYOffset(state, action);
    case SET_LAYERS_SHADOW_Y_OFFSET:
      return setLayersShadowYOffset(state, action);
    case SCALE_LAYER:
      return scaleLayer(state, action);
    case SCALE_LAYERS:
      return scaleLayers(state, action);
    case SET_LAYER_TEXT:
      return setLayerText(state, action);
    case SET_LAYER_TEXT_RESIZE:
      return setLayerTextResize(state, action);
    case SET_LAYERS_TEXT_RESIZE:
      return setLayersTextResize(state, action);
    case SET_LAYER_FONT_SIZE:
      return setLayerFontSize(state, action);
    case SET_LAYERS_FONT_SIZE:
      return setLayersFontSize(state, action);
    case SET_LAYER_LETTER_SPACING:
      return setLayerLetterSpacing(state, action);
    case SET_LAYERS_LETTER_SPACING:
      return setLayersLetterSpacing(state, action);
    case SET_LAYER_TEXT_TRANSFORM:
      return setLayerTextTransform(state, action);
    case SET_LAYERS_TEXT_TRANSFORM:
      return setLayersTextTransform(state, action);
    case SET_LAYER_FONT_WEIGHT:
      return setLayerFontWeight(state, action);
    case SET_LAYERS_FONT_WEIGHT:
      return setLayersFontWeight(state, action);
    case SET_LAYER_FONT_FAMILY:
      return setLayerFontFamily(state, action);
    case SET_LAYERS_FONT_FAMILY:
      return setLayersFontFamily(state, action);
    case SET_LAYER_LEADING:
      return setLayerLeading(state, action);
    case SET_LAYERS_LEADING:
      return setLayersLeading(state, action);
    case SET_LAYER_JUSTIFICATION:
      return setLayerJustification(state, action);
    case SET_LAYERS_JUSTIFICATION:
      return setLayersJustification(state, action);
    case SET_LAYER_VERTICAL_ALIGNMENT:
      return setLayerVerticalAlignment(state, action);
    case SET_LAYERS_VERTICAL_ALIGNMENT:
      return setLayersVerticalAlignment(state, action);
    case SET_LAYER_FONT_STYLE:
      return setLayerFontStyle(state, action);
    case SET_LAYERS_FONT_STYLE:
      return setLayersFontStyle(state, action);
    case SET_LAYER_POINT_X:
      return setLayerPointX(state, action);
    case SET_LAYERS_POINT_X:
      return setLayersPointX(state, action);
    case SET_LAYER_POINT_Y:
      return setLayerPointY(state, action);
    case SET_LAYERS_POINT_Y:
      return setLayersPointY(state, action);
    case SET_LAYER_FILL:
      return setLayerFill(state, action);
    case SET_LAYER_FILL_TYPE:
      return setLayerFillType(state, action);
    case SET_LAYERS_FILL_TYPE:
      return setLayersFillType(state, action);
    case SET_LAYER_GRADIENT_ORIGIN:
      return setLayerGradientOrigin(state, action);
    case SET_LAYERS_GRADIENT_ORIGIN:
      return setLayersGradientOrigin(state, action);
    case SET_LAYER_GRADIENT_DESTINATION:
      return setLayerGradientDestination(state, action);
    case SET_LAYERS_GRADIENT_DESTINATION:
      return setLayersGradientDestination(state, action);
    case SET_LAYERS_GRADIENT_OD:
      return setLayersGradientOD(state, action);
    case SET_LAYER_GRADIENT_STOP_COLOR:
      return setLayerGradientStopColor(state, action);
    case SET_LAYERS_GRADIENT_STOP_COLOR:
      return setLayersGradientStopColor(state, action);
    case SET_LAYER_GRADIENT_STOP_POSITION:
      return setLayerGradientStopPosition(state, action);
    case SET_LAYERS_GRADIENT_STOP_POSITION:
      return setLayersGradientStopPosition(state, action);
    case ADD_LAYER_GRADIENT_STOP:
      return addLayerGradientStop(state, action);
    case ADD_LAYERS_GRADIENT_STOP:
      return addLayersGradientStop(state, action);
    case REMOVE_LAYER_GRADIENT_STOP:
      return removeLayerGradientStop(state, action);
    case REMOVE_LAYERS_GRADIENT_STOP:
      return removeLayersGradientStop(state, action);
    case SET_LAYER_ACTIVE_GRADIENT_STOP:
      return setLayerActiveGradientStop(state, action);
    case FLIP_LAYER_GRADIENT:
      return flipLayerGradient(state, action);
    case FLIP_LAYERS_GRADIENT:
      return flipLayersGradient(state, action);
    case ADD_LAYERS_MASK:
      return addLayersMask(state, action);
    case SET_LAYER_UNDERLYING_MASK:
      return setLayerUnderlyingMask(state, action);
    case SET_LAYERS_UNDERLYING_MASK:
      return setLayersUnderlyingMask(state, action);
    case TOGGLE_LAYER_IGNORE_UNDERLYING_MASK:
      return toggleLayerIgnoreUnderlyingMask(state, action);
    case TOGGLE_LAYERS_IGNORE_UNDERLYING_MASK:
      return toggleLayersIgnoreUnderlyingMask(state, action);
    case SET_LAYER_MASKED:
      return setLayerMasked(state, action);
    case SET_LAYERS_MASKED:
      return setLayersMasked(state, action);
    case TOGGLE_LAYER_MASK:
      return toggleLayerMask(state, action);
    case TOGGLE_LAYERS_MASK:
      return toggleLayersMask(state, action);
    case ALIGN_LAYERS_TO_LEFT:
      return alignLayersToLeft(state, action);
    case ALIGN_LAYERS_TO_RIGHT:
      return alignLayersToRight(state, action);
    case ALIGN_LAYERS_TO_TOP:
      return alignLayersToTop(state, action);
    case ALIGN_LAYERS_TO_BOTTOM:
      return alignLayersToBottom(state, action);
    case ALIGN_LAYERS_TO_CENTER:
      return alignLayersToCenter(state, action);
    case ALIGN_LAYERS_TO_MIDDLE:
      return alignLayersToMiddle(state, action);
    case DISTRIBUTE_LAYERS_HORIZONTALLY:
      return distributeLayersHorizontally(state, action);
    case DISTRIBUTE_LAYERS_VERTICALLY:
      return distributeLayersVertically(state, action);
    case DUPLICATE_LAYER:
      return duplicateLayer(state, action).state;
    case DUPLICATE_LAYERS:
      return duplicateLayers(state, action);
    case REMOVE_DUPLICATED_LAYERS:
      return removeDuplicatedLayers(state, action);
    case BRING_LAYER_FORWARD:
      return bringLayerForward(state, action);
    case BRING_LAYERS_FORWARD:
      return bringLayersForward(state, action);
    case BRING_LAYER_TO_FRONT:
      return bringLayerToFront(state, action);
    case BRING_LAYERS_TO_FRONT:
      return bringLayersToFront(state, action);
    case SEND_LAYER_BACKWARD:
      return sendLayerBackward(state, action);
    case SEND_LAYERS_BACKWARD:
      return sendLayersBackward(state, action);
    case SEND_LAYER_TO_BACK:
      return sendLayerToBack(state, action);
    case SEND_LAYERS_TO_BACK:
      return sendLayersToBack(state, action);
    case SET_LAYER_BLEND_MODE:
      return setLayerBlendMode(state, action);
    case SET_LAYERS_BLEND_MODE:
      return setLayersBlendMode(state, action);
    case UNITE_LAYERS:
      return uniteLayers(state, action);
    case INTERSECT_LAYERS:
      return intersectLayers(state, action);
    case SUBTRACT_LAYERS:
      return subtractLayers(state, action);
    case EXCLUDE_LAYERS:
      return excludeLayers(state, action);
    case DIVIDE_LAYERS:
      return divideLayers(state, action);
    case SET_ROUNDED_RADIUS:
      return setRoundedRadius(state, action);
    case SET_ROUNDED_RADII:
      return setRoundedRadii(state, action);
    case SET_POLYGON_SIDES:
      return setPolygonSides(state, action);
    case SET_POLYGONS_SIDES:
      return setPolygonsSides(state, action);
    case SET_STAR_POINTS:
      return setStarPoints(state, action);
    case SET_STARS_POINTS:
      return setStarsPoints(state, action);
    case SET_STAR_RADIUS:
      return setStarRadius(state, action);
    case SET_STARS_RADIUS:
      return setStarsRadius(state, action);
    case SET_LINE_FROM_X:
      return setLineFromX(state, action);
    case SET_LINES_FROM_X:
      return setLinesFromX(state, action);
    case SET_LINE_FROM_Y:
      return setLineFromY(state, action);
    case SET_LINES_FROM_Y:
      return setLinesFromY(state, action);
    case SET_LINE_FROM:
      return setLineFrom(state, action);
    case SET_LINE_TO_X:
      return setLineToX(state, action);
    case SET_LINES_TO_X:
      return setLinesToX(state, action);
    case SET_LINE_TO_Y:
      return setLineToY(state, action);
    case SET_LINES_TO_Y:
      return setLinesToY(state, action);
    case SET_LINE_TO:
      return setLineTo(state, action);
    case SET_LAYER_EDIT:
      return setLayerEdit(state, action);
    case SET_LAYER_STYLE:
      return setLayerStyle(state, action);
    case SET_LAYERS_STYLE:
      return setLayersStyle(state, action);
    case RESET_IMAGE_DIMENSIONS:
      return resetImageDimensions(state, action);
    case RESET_IMAGES_DIMENSIONS:
      return resetImagesDimensions(state, action);
    case REPLACE_IMAGE:
      return replaceImage(state, action);
    case REPLACE_IMAGES:
      return replaceImages(state, action);
    case PASTE_LAYERS_FROM_CLIPBOARD:
      return pasteLayersFromClipboard(state, action);
    case SET_LAYER_TREE:
      return setLayerTree(state, action);
    case SET_LAYER_TREE_SCROLL:
      return setLayerTreeScroll(state, action);
    case SET_LAYER_TREE_STICKY_ARTBOARD:
      return setLayerTreeStickyArtboard(state, action);
    case HYDRATE_LAYERS:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}

export default undoable(baseReducer, {
  limit: 64,
  filter: (action: any) => {
    return (action.payload && action.payload.includeInHistory) || [
      ADD_ARTBOARD,
      ADD_GROUP,
      ADD_SHAPE,
      ADD_TEXT,
      ADD_IMAGE,
      ADD_LAYERS,
      REMOVE_LAYER,
      REMOVE_LAYERS,
      ADD_LAYER_CHILD,
      ADD_LAYER_CHILDREN,
      INSERT_LAYER_CHILD,
      INSERT_LAYER_ABOVE,
      INSERT_LAYERS_ABOVE,
      INSERT_LAYER_BELOW,
      INSERT_LAYERS_BELOW,
      GROUP_LAYERS,
      UNGROUP_LAYER,
      UNGROUP_LAYERS,
      DUPLICATE_LAYERS,
      MOVE_LAYER_TO,
      MOVE_LAYER_BY,
      MOVE_LAYERS,
      MOVE_LAYERS_TO,
      MOVE_LAYERS_BY,
      SET_LAYER_NAME,
      ADD_LAYER_EVENT,
      ADD_LAYERS_EVENT,
      REMOVE_LAYER_EVENT,
      REMOVE_LAYERS_EVENT,
      SET_LAYER_EVENT_EVENT_LISTENER,
      SET_LAYERS_EVENT_EVENT_LISTENER,
      ADD_LAYER_TWEEN,
      REMOVE_LAYER_TWEEN,
      REMOVE_LAYER_TWEENS,
      SET_LAYER_TWEEN_DURATION,
      SET_LAYER_TWEEN_REPEAT,
      SET_LAYER_TWEEN_REPEAT_DELAY,
      SET_LAYER_TWEEN_YOYO,
      SET_LAYER_TWEEN_YOYO_EASE,
      SET_LAYER_TWEEN_DELAY,
      SET_LAYER_TWEEN_TIMING,
      SET_LAYER_TWEEN_EASE,
      SET_LAYER_TWEEN_POWER,
      SET_LAYERS_TWEEN_DURATION,
      SET_LAYERS_TWEEN_REPEAT,
      SET_LAYERS_TWEEN_REPEAT_DELAY,
      SET_LAYERS_TWEEN_YOYO,
      SET_LAYERS_TWEEN_YOYO_EASE,
      SET_LAYERS_TWEEN_TIMING,
      SET_LAYERS_TWEEN_DELAY,
      SET_LAYERS_TWEEN_EASE,
      SET_LAYERS_TWEEN_POWER,
      SET_LAYER_STEPS_TWEEN_STEPS,
      SET_LAYER_ROUGH_TWEEN_CLAMP,
      SET_LAYER_ROUGH_TWEEN_POINTS,
      SET_LAYER_ROUGH_TWEEN_RANDOMIZE,
      SET_LAYER_ROUGH_TWEEN_STRENGTH,
      SET_LAYER_ROUGH_TWEEN_TAPER,
      SET_LAYER_ROUGH_TWEEN_TEMPLATE,
      SET_LAYER_SLOW_TWEEN_LINEAR_RATIO,
      SET_LAYER_SLOW_TWEEN_POWER,
      SET_LAYER_SLOW_TWEEN_YOYO_MODE,
      SET_LAYER_TEXT_TWEEN_DELIMITER,
      SET_LAYER_TEXT_TWEEN_SPEED,
      SET_LAYER_TEXT_TWEEN_DIFF,
      SET_LAYER_TEXT_TWEEN_SCRAMBLE,
      SET_LAYER_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
      SET_LAYER_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
      SET_LAYER_SCRAMBLE_TEXT_TWEEN_SPEED,
      SET_LAYER_SCRAMBLE_TEXT_TWEEN_DELIMITER,
      SET_LAYER_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
      SET_LAYER_CUSTOM_BOUNCE_TWEEN_STRENGTH,
      SET_LAYER_CUSTOM_BOUNCE_TWEEN_END_AT_START,
      SET_LAYER_CUSTOM_BOUNCE_TWEEN_SQUASH,
      SET_LAYER_CUSTOM_WIGGLE_TWEEN_STRENGTH,
      SET_LAYER_CUSTOM_WIGGLE_TWEEN_WIGGLES,
      SET_LAYER_CUSTOM_WIGGLE_TWEEN_TYPE,
      SET_LAYERS_STEPS_TWEEN_STEPS,
      SET_LAYERS_ROUGH_TWEEN_CLAMP,
      SET_LAYERS_ROUGH_TWEEN_POINTS,
      SET_LAYERS_ROUGH_TWEEN_RANDOMIZE,
      SET_LAYERS_ROUGH_TWEEN_STRENGTH,
      SET_LAYERS_ROUGH_TWEEN_TAPER,
      SET_LAYERS_ROUGH_TWEEN_TEMPLATE,
      SET_LAYERS_SLOW_TWEEN_LINEAR_RATIO,
      SET_LAYERS_SLOW_TWEEN_POWER,
      SET_LAYERS_SLOW_TWEEN_YOYO_MODE,
      SET_LAYERS_TEXT_TWEEN_DELIMITER,
      SET_LAYERS_TEXT_TWEEN_SPEED,
      SET_LAYERS_TEXT_TWEEN_DIFF,
      SET_LAYERS_TEXT_TWEEN_SCRAMBLE,
      SET_LAYERS_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
      SET_LAYERS_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
      SET_LAYERS_SCRAMBLE_TEXT_TWEEN_SPEED,
      SET_LAYERS_SCRAMBLE_TEXT_TWEEN_DELIMITER,
      SET_LAYERS_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
      SET_LAYERS_CUSTOM_BOUNCE_TWEEN_STRENGTH,
      SET_LAYERS_CUSTOM_BOUNCE_TWEEN_END_AT_START,
      SET_LAYERS_CUSTOM_BOUNCE_TWEEN_SQUASH,
      SET_LAYERS_CUSTOM_WIGGLE_TWEEN_STRENGTH,
      SET_LAYERS_CUSTOM_WIGGLE_TWEEN_WIGGLES,
      SET_LAYERS_CUSTOM_WIGGLE_TWEEN_TYPE,
      SET_LAYER_X,
      SET_LAYERS_X,
      SET_LAYER_Y,
      SET_LAYERS_Y,
      SET_LAYER_LEFT,
      SET_LAYERS_LEFT,
      SET_LAYER_CENTER,
      SET_LAYERS_CENTER,
      SET_LAYER_RIGHT,
      SET_LAYERS_RIGHT,
      SET_LAYER_TOP,
      SET_LAYERS_TOP,
      SET_LAYER_MIDDLE,
      SET_LAYERS_MIDDLE,
      SET_LAYER_BOTTOM,
      SET_LAYERS_BOTTOM,
      SET_LAYER_WIDTH,
      SET_LAYERS_WIDTH,
      SET_LAYER_HEIGHT,
      SET_LAYERS_HEIGHT,
      SET_LAYER_ROTATION,
      SET_LAYERS_ROTATION,
      SET_LAYER_OPACITY,
      SET_LAYERS_OPACITY,
      SET_LAYER_BLUR_RADIUS,
      SET_LAYERS_BLUR_RADIUS,
      ENABLE_LAYER_HORIZONTAL_FLIP,
      ENABLE_LAYERS_HORIZONTAL_FLIP,
      DISABLE_LAYER_HORIZONTAL_FLIP,
      DISABLE_LAYERS_HORIZONTAL_FLIP,
      ENABLE_LAYER_VERTICAL_FLIP,
      ENABLE_LAYERS_VERTICAL_FLIP,
      DISABLE_LAYER_VERTICAL_FLIP,
      DISABLE_LAYERS_VERTICAL_FLIP,
      ENABLE_LAYER_FILL,
      ENABLE_LAYERS_FILL,
      DISABLE_LAYER_FILL,
      DISABLE_LAYERS_FILL,
      SET_LAYER_FILL,
      SET_LAYER_FILL_COLOR,
      SET_LAYERS_FILL_COLOR,
      SET_LAYERS_FILL_COLORS,
      SET_LAYER_FILL_TYPE,
      SET_LAYERS_FILL_TYPE,
      ENABLE_LAYER_STROKE,
      ENABLE_LAYERS_STROKE,
      DISABLE_LAYER_STROKE,
      DISABLE_LAYERS_STROKE,
      SET_LAYER_STROKE_COLOR,
      SET_LAYERS_STROKE_COLOR,
      SET_LAYERS_STROKE_COLORS,
      SET_LAYER_STROKE_FILL_TYPE,
      SET_LAYERS_STROKE_FILL_TYPE,
      SET_LAYER_GRADIENT,
      SET_LAYERS_GRADIENT,
      SET_LAYER_GRADIENT_TYPE,
      SET_LAYERS_GRADIENT_TYPE,
      ADD_LAYER_GRADIENT_STOP,
      ADD_LAYERS_GRADIENT_STOP,
      SET_LAYER_GRADIENT_STOP_POSITION,
      SET_LAYERS_GRADIENT_STOP_POSITION,
      SET_LAYER_GRADIENT_STOP_COLOR,
      SET_LAYERS_GRADIENT_STOP_COLOR,
      REMOVE_LAYER_GRADIENT_STOP,
      REMOVE_LAYERS_GRADIENT_STOP,
      SET_LAYER_GRADIENT_DESTINATION,
      SET_LAYERS_GRADIENT_DESTINATION,
      SET_LAYERS_GRADIENT_OD,
      SET_LAYER_GRADIENT_ORIGIN,
      SET_LAYERS_GRADIENT_ORIGIN,
      FLIP_LAYER_GRADIENT,
      FLIP_LAYERS_GRADIENT,
      SET_LAYER_STROKE_WIDTH,
      SET_LAYERS_STROKE_WIDTH,
      SET_LAYER_STROKE_CAP,
      SET_LAYERS_STROKE_CAP,
      SET_LAYER_STROKE_JOIN,
      SET_LAYERS_STROKE_JOIN,
      SET_LAYER_STROKE_DASH_OFFSET,
      SET_LAYERS_STROKE_DASH_OFFSET,
      SET_LAYER_STROKE_DASH_ARRAY,
      SET_LAYERS_STROKE_DASH_ARRAY,
      ENABLE_LAYER_SHADOW,
      ENABLE_LAYERS_SHADOW,
      DISABLE_LAYER_SHADOW,
      DISABLE_LAYERS_SHADOW,
      SET_LAYER_SHADOW_COLOR,
      SET_LAYERS_SHADOW_COLOR,
      SET_LAYERS_SHADOW_COLORS,
      ENABLE_LAYER_BLUR,
      DISABLE_LAYER_BLUR,
      ENABLE_LAYERS_BLUR,
      DISABLE_LAYERS_BLUR,
      SET_LAYER_SHADOW_BLUR,
      SET_LAYERS_SHADOW_BLUR,
      SET_LAYER_SHADOW_X_OFFSET,
      SET_LAYERS_SHADOW_X_OFFSET,
      SET_LAYER_SHADOW_Y_OFFSET,
      SET_LAYERS_SHADOW_Y_OFFSET,
      SCALE_LAYER,
      SCALE_LAYERS,
      SET_LAYER_TEXT,
      SET_LAYER_TEXT_RESIZE,
      SET_LAYERS_TEXT_RESIZE,
      SET_LAYER_FONT_SIZE,
      SET_LAYERS_FONT_SIZE,
      SET_LAYER_LETTER_SPACING,
      SET_LAYERS_LETTER_SPACING,
      SET_LAYER_TEXT_TRANSFORM,
      SET_LAYERS_TEXT_TRANSFORM,
      SET_LAYER_LEADING,
      SET_LAYERS_LEADING,
      SET_LAYER_FONT_WEIGHT,
      SET_LAYERS_FONT_WEIGHT,
      SET_LAYER_FONT_FAMILY,
      SET_LAYERS_FONT_FAMILY,
      SET_LAYER_JUSTIFICATION,
      SET_LAYERS_JUSTIFICATION,
      SET_LAYER_VERTICAL_ALIGNMENT,
      SET_LAYERS_VERTICAL_ALIGNMENT,
      SET_LAYER_FONT_STYLE,
      SET_LAYERS_FONT_STYLE,
      SET_LAYER_POINT_X,
      SET_LAYERS_POINT_X,
      SET_LAYER_POINT_Y,
      SET_LAYERS_POINT_Y,
      ADD_LAYERS_MASK,
      TOGGLE_LAYER_IGNORE_UNDERLYING_MASK,
      TOGGLE_LAYERS_IGNORE_UNDERLYING_MASK,
      TOGGLE_LAYER_MASK,
      TOGGLE_LAYERS_MASK,
      ALIGN_LAYERS_TO_LEFT,
      ALIGN_LAYERS_TO_RIGHT,
      ALIGN_LAYERS_TO_TOP,
      ALIGN_LAYERS_TO_BOTTOM,
      ALIGN_LAYERS_TO_CENTER,
      ALIGN_LAYERS_TO_MIDDLE,
      DISTRIBUTE_LAYERS_HORIZONTALLY,
      DISTRIBUTE_LAYERS_VERTICALLY,
      SET_LAYER_BLEND_MODE,
      SET_LAYERS_BLEND_MODE,
      UNITE_LAYERS,
      INTERSECT_LAYERS,
      SUBTRACT_LAYERS,
      EXCLUDE_LAYERS,
      DIVIDE_LAYERS,
      SET_ROUNDED_RADIUS,
      SET_ROUNDED_RADII,
      SET_STAR_POINTS,
      SET_STARS_POINTS,
      SET_POLYGON_SIDES,
      SET_POLYGONS_SIDES,
      SET_STAR_RADIUS,
      SET_STARS_RADIUS,
      SET_LINE_FROM_X,
      SET_LINES_FROM_X,
      SET_LINE_FROM_Y,
      SET_LINES_FROM_Y,
      SET_LINE_FROM,
      SET_LINE_TO_X,
      SET_LINES_TO_X,
      SET_LINES_TO_Y,
      SET_LINE_TO,
      SEND_LAYERS_BACKWARD,
      BRING_LAYERS_FORWARD,
      SEND_LAYERS_TO_BACK,
      BRING_LAYERS_TO_FRONT,
      SET_LAYER_STYLE,
      SET_LAYERS_STYLE,
      RESET_IMAGE_DIMENSIONS,
      RESET_IMAGES_DIMENSIONS,
      REPLACE_IMAGE,
      REPLACE_IMAGES,
      PASTE_LAYERS_FROM_CLIPBOARD
    ].includes(action.type) && !action.payload.batch;
  }
});