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
  INCREMENT_LAYER_TWEEN_DURATION,
  DECREMENT_LAYER_TWEEN_DURATION,
  SET_LAYER_TWEEN_DELAY,
  INCREMENT_LAYER_TWEEN_DELAY,
  DECREMENT_LAYER_TWEEN_DELAY,
  SET_LAYER_TWEEN_EASE,
  SET_LAYER_TWEEN_POWER,
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
  ADD_IN_VIEW_LAYER,
  ADD_IN_VIEW_LAYERS,
  REMOVE_IN_VIEW_LAYER,
  REMOVE_IN_VIEW_LAYERS,
  UPDATE_IN_VIEW_LAYERS,
  SET_LAYER_FILL_TYPE,
  SET_LAYER_FILL_GRADIENT_TYPE,
  SET_LAYER_FILL_GRADIENT_ORIGIN,
  SET_LAYER_FILL_GRADIENT_DESTINATION,
  SET_LAYER_FILL_GRADIENT_STOP_COLOR,
  SET_LAYER_FILL_GRADIENT_STOP_POSITION,
  ADD_LAYER_FILL_GRADIENT_STOP,
  REMOVE_LAYER_FILL_GRADIENT_STOP,
  LayerTypes
} from '../actionTypes/layer';

import {
  addPage,
  addArtboard,
  addShape,
  addGroup,
  addText,
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
  insertLayerChild,
  showLayerChildren,
  hideLayerChildren,
  insertLayerAbove,
  insertLayerBelow,
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
  incrementLayerTweenDuration,
  decrementLayerTweenDuration,
  setLayerTweenDelay,
  incrementLayerTweenDelay,
  decrementLayerTweenDelay,
  setLayerTweenEase,
  setLayerTweenPower,
  setLayerX,
  setLayerY,
  setLayerWidth,
  setLayerHeight,
  setLayerRotation,
  setLayerOpacity,
  enableLayerHorizontalFlip,
  disableLayerHorizontalFlip,
  enableLayerVerticalFlip,
  disableLayerVerticalFlip,
  enableLayerFill,
  disableLayerFill,
  setLayerFillColor,
  enableLayerStroke,
  disableLayerStroke,
  setLayerStrokeColor,
  setLayerStrokeWidth,
  setLayerStrokeCap,
  setLayerStrokeJoin,
  setLayerStrokeDashArray,
  setLayerStrokeMiterLimit,
  enableLayerShadow,
  disableLayerShadow,
  setLayerShadowColor,
  setLayerShadowBlur,
  setLayerShadowXOffset,
  setLayerShadowYOffset,
  resizeLayer,
  resizeLayers,
  setLayerFontSize,
  setLayerLeading,
  setLayerFontWeight,
  setLayerFontFamily,
  setLayerJustification,
  setLayerText,
  addInViewLayer,
  addInViewLayers,
  removeInViewLayer,
  removeInViewLayers,
  updateInViewLayers,
  setLayerFillType,
  setLayerFillGradientType,
  setLayerFillGradientOrigin,
  setLayerFillGradientDestination,
  setLayerFillGradientStopColor,
  setLayerFillGradientStopPosition,
  addLayerFillGradientStop,
  removeLayerFillGradientStop
} from '../utils/layer';

export interface LayerState {
  byId: {
    [id: string]: em.Page | em.Artboard | em.Group | em.Shape | em.Text;
  };
  allIds: string[];
  page: string;
  activeArtboard: string;
  selected: string[];
  allArtboardIds: string[];
  allShapeIds: string[];
  allGroupIds: string[];
  allTextIds: string[];
  scope: string[];
  inView: string[];
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
  scope: [],
  inView: [],
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
  tweenById: {}
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
    case INSERT_LAYER_CHILD:
      return insertLayerChild(state, action);
    case SHOW_LAYER_CHILDREN:
      return showLayerChildren(state, action);
    case HIDE_LAYER_CHILDREN:
      return hideLayerChildren(state, action);
    case INSERT_LAYER_ABOVE:
      return insertLayerAbove(state, action);
    case INSERT_LAYER_BELOW:
      return insertLayerBelow(state, action);
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
    case INCREMENT_LAYER_TWEEN_DURATION:
      return incrementLayerTweenDuration(state, action);
    case DECREMENT_LAYER_TWEEN_DURATION:
      return decrementLayerTweenDuration(state, action);
    case SET_LAYER_TWEEN_DELAY:
      return setLayerTweenDelay(state, action);
    case INCREMENT_LAYER_TWEEN_DELAY:
      return incrementLayerTweenDelay(state, action);
    case DECREMENT_LAYER_TWEEN_DELAY:
      return decrementLayerTweenDelay(state, action);
    case SET_LAYER_TWEEN_EASE:
      return setLayerTweenEase(state, action);
    case SET_LAYER_TWEEN_POWER:
      return setLayerTweenPower(state, action);
    case SET_LAYER_X:
      return setLayerX(state, action);
    case SET_LAYER_Y:
      return setLayerY(state, action);
    case SET_LAYER_WIDTH:
      return setLayerWidth(state, action);
    case SET_LAYER_HEIGHT:
      return setLayerHeight(state, action);
    case SET_LAYER_ROTATION:
      return setLayerRotation(state, action);
    case SET_LAYER_OPACITY:
      return setLayerOpacity(state, action);
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
    case DISABLE_LAYER_FILL:
      return disableLayerFill(state, action);
    case SET_LAYER_FILL_COLOR:
      return setLayerFillColor(state, action);
    case ENABLE_LAYER_STROKE:
      return enableLayerStroke(state, action);
    case DISABLE_LAYER_STROKE:
      return disableLayerStroke(state, action);
    case SET_LAYER_STROKE_COLOR:
      return setLayerStrokeColor(state, action);
    case SET_LAYER_STROKE_WIDTH:
      return setLayerStrokeWidth(state, action);
    case SET_LAYER_STROKE_CAP:
      return setLayerStrokeCap(state, action);
    case SET_LAYER_STROKE_JOIN:
      return setLayerStrokeJoin(state, action);
    case SET_LAYER_STROKE_DASH_ARRAY:
      return setLayerStrokeDashArray(state, action);
    case SET_LAYER_STROKE_MITER_LIMIT:
      return setLayerStrokeMiterLimit(state, action);
    case ENABLE_LAYER_SHADOW:
      return enableLayerShadow(state, action);
    case DISABLE_LAYER_SHADOW:
      return disableLayerShadow(state, action);
    case SET_LAYER_SHADOW_COLOR:
      return setLayerShadowColor(state, action);
    case SET_LAYER_SHADOW_BLUR:
      return setLayerShadowBlur(state, action);
    case SET_LAYER_SHADOW_X_OFFSET:
      return setLayerShadowXOffset(state, action);
    case SET_LAYER_SHADOW_Y_OFFSET:
      return setLayerShadowYOffset(state, action);
    case RESIZE_LAYER:
      return resizeLayer(state, action);
    case RESIZE_LAYERS:
      return resizeLayers(state, action);
    case SET_LAYER_TEXT:
      return setLayerText(state, action);
    case SET_LAYER_FONT_SIZE:
      return setLayerFontSize(state, action);
    case SET_LAYER_FONT_WEIGHT:
      return setLayerFontWeight(state, action);
    case SET_LAYER_FONT_FAMILY:
      return setLayerFontFamily(state, action);
    case SET_LAYER_LEADING:
      return setLayerLeading(state, action);
    case SET_LAYER_JUSTIFICATION:
      return setLayerJustification(state, action);
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
    case SET_LAYER_FILL_TYPE:
      return setLayerFillType(state, action);
    case SET_LAYER_FILL_GRADIENT_TYPE:
      return setLayerFillGradientType(state, action);
    case SET_LAYER_FILL_GRADIENT_ORIGIN:
      return setLayerFillGradientOrigin(state, action);
    case SET_LAYER_FILL_GRADIENT_DESTINATION:
      return setLayerFillGradientDestination(state, action);
    case SET_LAYER_FILL_GRADIENT_STOP_COLOR:
      return setLayerFillGradientStopColor(state, action);
    case SET_LAYER_FILL_GRADIENT_STOP_POSITION:
      return setLayerFillGradientStopPosition(state, action);
    case ADD_LAYER_FILL_GRADIENT_STOP:
      return addLayerFillGradientStop(state, action);
    case REMOVE_LAYER_FILL_GRADIENT_STOP:
      return removeLayerFillGradientStop(state, action);
    default:
      return state;
  }
}