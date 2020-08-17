import {
  ADD_PAGE,
  ADD_ARTBOARD,
  ADD_GROUP,
  ADD_SHAPE,
  ADD_COMPOUND_SHAPE,
  ADD_TEXT,
  ADD_IMAGE,
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
  ADD_LAYER_CHILDREN,
  INSERT_LAYER_CHILD,
  SHOW_LAYER_CHILDREN,
  HIDE_LAYER_CHILDREN,
  INSERT_LAYER_ABOVE,
  INSERT_LAYERS_ABOVE,
  INSERT_LAYER_BELOW,
  INSERT_LAYERS_BELOW,
  INCREASE_LAYER_SCOPE,
  DECREASE_LAYER_SCOPE,
  CLEAR_LAYER_SCOPE,
  NEW_LAYER_SCOPE,
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
  MOVE_LAYER_BY,
  MOVE_LAYERS_TO,
  MOVE_LAYERS_BY,
  SET_LAYER_NAME,
  SET_ACTIVE_ARTBOARD,
  ADD_LAYER_TWEEN_EVENT,
  REMOVE_LAYER_TWEEN_EVENT,
  ADD_LAYER_TWEEN,
  REMOVE_LAYER_TWEEN,
  SET_LAYER_TWEEN_DURATION,
  SET_LAYER_TWEEN_TIMING,
  SET_LAYER_TWEEN_DELAY,
  SET_LAYER_TWEEN_EASE,
  SET_LAYER_TWEEN_POWER,
  SET_LAYER_X,
  SET_LAYERS_X,
  SET_LAYER_Y,
  SET_LAYERS_Y,
  SET_LAYER_WIDTH,
  SET_LAYERS_WIDTH,
  SET_LAYER_HEIGHT,
  SET_LAYERS_HEIGHT,
  SET_LAYER_ROTATION,
  SET_LAYERS_ROTATION,
  SET_LAYER_OPACITY,
  SET_LAYERS_OPACITY,
  ENABLE_LAYER_HORIZONTAL_FLIP,
  DISABLE_LAYER_HORIZONTAL_FLIP,
  ENABLE_LAYER_VERTICAL_FLIP,
  DISABLE_LAYER_VERTICAL_FLIP,
  ENABLE_LAYER_FILL,
  ENABLE_LAYERS_FILL,
  DISABLE_LAYER_FILL,
  DISABLE_LAYERS_FILL,
  SET_LAYER_FILL,
  SET_LAYER_FILL_COLOR,
  SET_LAYERS_FILL_COLOR,
  ENABLE_LAYER_STROKE,
  ENABLE_LAYERS_STROKE,
  DISABLE_LAYER_STROKE,
  DISABLE_LAYERS_STROKE,
  SET_LAYER_STROKE_COLOR,
  SET_LAYERS_STROKE_COLOR,
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
  SET_LAYER_GRADIENT_STOP_COLOR,
  SET_LAYERS_GRADIENT_STOP_COLOR,
  SET_LAYER_GRADIENT_STOP_POSITION,
  SET_LAYERS_GRADIENT_STOP_POSITION,
  ADD_LAYER_GRADIENT_STOP,
  ADD_LAYERS_GRADIENT_STOP,
  REMOVE_LAYER_GRADIENT_STOP,
  REMOVE_LAYERS_GRADIENT_STOP,
  SET_LAYER_ACTIVE_GRADIENT_STOP,
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
  SET_LAYER_STROKE_MITER_LIMIT,
  ENABLE_LAYER_SHADOW,
  ENABLE_LAYERS_SHADOW,
  DISABLE_LAYER_SHADOW,
  DISABLE_LAYERS_SHADOW,
  SET_LAYER_SHADOW_COLOR,
  SET_LAYERS_SHADOW_COLOR,
  SET_LAYER_SHADOW_BLUR,
  SET_LAYERS_SHADOW_BLUR,
  SET_LAYER_SHADOW_X_OFFSET,
  SET_LAYERS_SHADOW_X_OFFSET,
  SET_LAYER_SHADOW_Y_OFFSET,
  SET_LAYERS_SHADOW_Y_OFFSET,
  SCALE_LAYER,
  SCALE_LAYERS,
  SET_LAYER_TEXT,
  SET_LAYER_FONT_SIZE,
  SET_LAYERS_FONT_SIZE,
  SET_LAYER_LEADING,
  SET_LAYERS_LEADING,
  SET_LAYER_FONT_WEIGHT,
  SET_LAYERS_FONT_WEIGHT,
  SET_LAYER_FONT_FAMILY,
  SET_LAYERS_FONT_FAMILY,
  SET_LAYER_JUSTIFICATION,
  SET_LAYERS_JUSTIFICATION,
  ADD_IN_VIEW_LAYER,
  ADD_IN_VIEW_LAYERS,
  REMOVE_IN_VIEW_LAYER,
  REMOVE_IN_VIEW_LAYERS,
  UPDATE_IN_VIEW_LAYERS,
  SET_LAYER_FILL_TYPE,
  SET_LAYERS_FILL_TYPE,
  ADD_LAYERS_MASK,
  REMOVE_LAYERS_MASK,
  MASK_LAYER,
  UNMASK_LAYER,
  MASK_LAYERS,
  UNMASK_LAYERS,
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
  SEND_LAYER_FORWARD,
  SEND_LAYERS_FORWARD,
  SEND_LAYER_TO_FRONT,
  SEND_LAYERS_TO_FRONT,
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
  SET_CURVE_POINT_ORIGIN,
  SET_CURVE_POINT_ORIGIN_X,
  SET_CURVE_POINT_ORIGIN_Y,
  SET_LAYER_EDIT,
  LayerTypes
} from '../actionTypes/layer';

import {
  addPage,
  addArtboard,
  addShape,
  addGroup,
  addText,
  addImage,
  removeLayer,
  removeLayers,
  selectLayer,
  deepSelectLayer,
  selectLayers,
  deselectLayer,
  deselectLayers,
  deselectAllLayers,
  setLayerHover,
  addLayerChild,
  addLayerChildren,
  insertLayerChild,
  showLayerChildren,
  hideLayerChildren,
  insertLayerAbove,
  insertLayersAbove,
  insertLayerBelow,
  insertLayersBelow,
  increaseLayerScope,
  decreaseLayerScope,
  newLayerScope,
  clearLayerScope,
  escapeLayerScope,
  groupLayers,
  ungroupLayer,
  copyLayerToClipboard,
  copyLayersToClipboard,
  pasteLayersFromClipboard,
  moveLayer,
  moveLayers,
  moveLayerTo,
  moveLayerBy,
  moveLayersTo,
  moveLayersBy,
  ungroupLayers,
  setActiveArtboard,
  addLayerTweenEvent,
  removeLayerTweenEvent,
  addLayerTween,
  removeLayerTween,
  setLayerName,
  setLayerTweenDuration,
  setLayerTweenTiming,
  setLayerTweenDelay,
  setLayerTweenEase,
  setLayerTweenPower,
  setLayerX,
  setLayersX,
  setLayerY,
  setLayersY,
  setLayerWidth,
  setLayersWidth,
  setLayerHeight,
  setLayersHeight,
  setLayerRotation,
  setLayersRotation,
  setLayerOpacity,
  setLayersOpacity,
  enableLayerHorizontalFlip,
  disableLayerHorizontalFlip,
  enableLayerVerticalFlip,
  disableLayerVerticalFlip,
  enableLayerFill,
  enableLayersFill,
  disableLayerFill,
  disableLayersFill,
  setLayerFillColor,
  setLayersFillColor,
  enableLayerStroke,
  enableLayersStroke,
  disableLayerStroke,
  disableLayersStroke,
  setLayerStrokeColor,
  setLayersStrokeColor,
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
  setLayerStrokeMiterLimit,
  enableLayerShadow,
  enableLayersShadow,
  disableLayerShadow,
  disableLayersShadow,
  setLayerShadowColor,
  setLayersShadowColor,
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
  setLayerLeading,
  setLayersLeading,
  setLayerFontWeight,
  setLayersFontWeight,
  setLayerFontFamily,
  setLayersFontFamily,
  setLayerJustification,
  setLayersJustification,
  setLayerText,
  addInViewLayer,
  addInViewLayers,
  removeInViewLayer,
  removeInViewLayers,
  updateInViewLayers,
  setLayerFill,
  setLayerFillType,
  setLayersFillType,
  setLayerGradientOrigin,
  setLayersGradientOrigin,
  setLayerGradientDestination,
  setLayersGradientDestination,
  setLayerGradientStopColor,
  setLayersGradientStopColor,
  setLayerGradientStopPosition,
  setLayersGradientStopPosition,
  addLayerGradientStop,
  addLayersGradientStop,
  removeLayerGradientStop,
  removeLayersGradientStop,
  setLayerActiveGradientStop,
  addLayersMask,
  removeLayersMask,
  maskLayer,
  unmaskLayer,
  maskLayers,
  unmaskLayers,
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
  sendLayerForward,
  sendLayersForward,
  sendLayerToFront,
  sendLayersToFront,
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
  setCurvePointOrigin,
  setCurvePointOriginX,
  setCurvePointOriginY,
  setLayerEdit
} from '../utils/layer';

export interface LayerState {
  byId: {
    [id: string]: em.Page | em.Artboard | em.Group | em.Shape | em.Text | em.Image | em.CompoundShape;
  };
  allIds: string[];
  page: string;
  activeArtboard: string;
  selected: string[];
  allArtboardIds: string[];
  allShapeIds: string[];
  allGroupIds: string[];
  allTextIds: string[];
  allImageIds: string[];
  scope: string[];
  inView: {
    allIds: string[];
    snapPoints: em.SnapPoint[];
  };
  hover: string;
  clipboard: {
    main: string[];
    allIds: string[];
    byId: {
      [id: string]: em.ClipboardLayer;
    };
  };
  paperProject: string;
  allTweenEventIds: string[];
  tweenEventById: {
    [id: string]: em.TweenEvent;
  };
  allTweenIds: string[];
  tweenById: {
    [id: string]: em.Tween;
  };
  edit: string;
}

const initialState: LayerState = {
  byId: {
    'page': {
      type: 'Page',
      id: 'page',
      name: 'Page',
      parent: null,
      children: [],
      selected: false,
      tweenEvents: [],
      tweens: []
    } as em.Page
  },
  allIds: ['page'],
  page: 'page',
  activeArtboard: null,
  selected: [],
  allArtboardIds: [],
  allShapeIds: [],
  allGroupIds: [],
  allTextIds: [],
  allImageIds: [],
  scope: [],
  inView: {
    allIds: [],
    snapPoints: []
  },
  hover: null,
  clipboard: {
    main: [],
    allIds: [],
    byId: {}
  },
  paperProject: '[["Layer",{"applyMatrix":true,"children":[["Group",{"applyMatrix":true,"data":{"id":"page","type":"Page"}}]]}]]',
  allTweenEventIds: [],
  tweenEventById: {},
  allTweenIds: [],
  tweenById: {},
  edit: null
};

export default (state = initialState, action: LayerTypes): LayerState => {
  switch (action.type) {
    case ADD_PAGE:
      return addPage(state, action);
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
    case DESELECT_ALL_LAYERS:
      return deselectAllLayers(state, action);
    case SET_LAYER_HOVER:
      return setLayerHover(state, action);
    case ADD_LAYER_CHILD:
      return addLayerChild(state, action);
    case ADD_LAYER_CHILDREN:
      return addLayerChildren(state, action);
    case INSERT_LAYER_CHILD:
      return insertLayerChild(state, action);
    case SHOW_LAYER_CHILDREN:
      return showLayerChildren(state, action);
    case HIDE_LAYER_CHILDREN:
      return hideLayerChildren(state, action);
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
    case GROUP_LAYERS:
      return groupLayers(state, action);
    case UNGROUP_LAYER:
      return ungroupLayer(state, action);
    case UNGROUP_LAYERS:
      return ungroupLayers(state, action);
    case COPY_LAYER_TO_CLIPBOARD:
      return copyLayerToClipboard(state, action);
    case COPY_LAYERS_TO_CLIPBOARD:
      return copyLayersToClipboard(state, action);
    case PASTE_LAYERS_FROM_CLIPBOARD:
      return pasteLayersFromClipboard(state, action);
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
    case ADD_LAYER_TWEEN_EVENT:
      return addLayerTweenEvent(state, action);
    case REMOVE_LAYER_TWEEN_EVENT:
      return removeLayerTweenEvent(state, action);
    case ADD_LAYER_TWEEN:
      return addLayerTween(state, action);
    case REMOVE_LAYER_TWEEN:
      return removeLayerTween(state, action);
    case SET_LAYER_TWEEN_DURATION:
      return setLayerTweenDuration(state, action);
    case SET_LAYER_TWEEN_TIMING:
      return setLayerTweenTiming(state, action);
    case SET_LAYER_TWEEN_DELAY:
      return setLayerTweenDelay(state, action);
    case SET_LAYER_TWEEN_EASE:
      return setLayerTweenEase(state, action);
    case SET_LAYER_TWEEN_POWER:
      return setLayerTweenPower(state, action);
    case SET_LAYER_X:
      return setLayerX(state, action);
    case SET_LAYERS_X:
      return setLayersX(state, action);
    case SET_LAYER_Y:
      return setLayerY(state, action);
    case SET_LAYERS_Y:
      return setLayersY(state, action);
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
    case ENABLE_LAYER_HORIZONTAL_FLIP:
      return enableLayerHorizontalFlip(state, action);
    case DISABLE_LAYER_HORIZONTAL_FLIP:
      return disableLayerHorizontalFlip(state, action);
    case ENABLE_LAYER_VERTICAL_FLIP:
      return enableLayerVerticalFlip(state, action);
    case DISABLE_LAYER_VERTICAL_FLIP:
      return disableLayerVerticalFlip(state, action);
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
    case SET_LAYER_STROKE_MITER_LIMIT:
      return setLayerStrokeMiterLimit(state, action);
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
    case SET_LAYER_FONT_SIZE:
      return setLayerFontSize(state, action);
    case SET_LAYERS_FONT_SIZE:
      return setLayersFontSize(state, action);
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
    case ADD_IN_VIEW_LAYER:
      return addInViewLayer(state, action);
    case ADD_IN_VIEW_LAYERS:
      return addInViewLayers(state, action);
    case REMOVE_IN_VIEW_LAYER:
      return removeInViewLayer(state, action);
    case REMOVE_IN_VIEW_LAYERS:
      return removeInViewLayers(state, action);
    case UPDATE_IN_VIEW_LAYERS:
      return updateInViewLayers(state, action);
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
    case ADD_LAYERS_MASK:
      return addLayersMask(state, action);
    case REMOVE_LAYERS_MASK:
      return removeLayersMask(state, action);
    case MASK_LAYER:
      return maskLayer(state, action);
    case UNMASK_LAYER:
      return unmaskLayer(state, action);
    case MASK_LAYERS:
      return maskLayers(state, action);
    case UNMASK_LAYERS:
      return unmaskLayers(state, action);
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
      return duplicateLayer(state, action);
    case DUPLICATE_LAYERS:
      return duplicateLayers(state, action);
    case REMOVE_DUPLICATED_LAYERS:
      return removeDuplicatedLayers(state, action);
    case SEND_LAYER_FORWARD:
      return sendLayerForward(state, action);
    case SEND_LAYERS_FORWARD:
      return sendLayersForward(state, action);
    case SEND_LAYER_TO_FRONT:
      return sendLayerToFront(state, action);
    case SEND_LAYERS_TO_FRONT:
      return sendLayersToFront(state, action);
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
    case SET_CURVE_POINT_ORIGIN:
      return setCurvePointOrigin(state, action);
    case SET_CURVE_POINT_ORIGIN_X:
      return setCurvePointOriginX(state, action);
    case SET_CURVE_POINT_ORIGIN_Y:
      return setCurvePointOriginY(state, action);
    case SET_LAYER_EDIT:
      return setLayerEdit(state, action);
    default:
      return state;
  }
}