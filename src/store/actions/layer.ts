/* eslint-disable @typescript-eslint/no-use-before-define */
import sharp from 'sharp';
import tinycolor from 'tinycolor2';
import { v4 as uuidv4 } from 'uuid';
import { ActionCreators } from 'redux-undo';
import { clipboard } from 'electron';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { paperMain } from '../../canvas';
import MeasureGuide from '../../canvas/measureGuide';
import { DEFAULT_STYLE, DEFAULT_TRANSFORM, DEFAULT_ARTBOARD_BACKGROUND_COLOR, DEFAULT_TEXT_VALUE, THEME_PRIMARY_COLOR, DEFAULT_TWEEN_EVENTS } from '../../constants';
import { getPaperFillColor, getPaperStrokeColor, getPaperLayer, getPaperShadowColor } from '../utils/paper';
import { getClipboardCenter, getSelectionCenter, getLayerAndDescendants, getLayersBounds, importPaperProject, colorsMatch, gradientsMatch, getNearestScopeAncestor, getTweenEventsFrameItems, orderLayersByDepth, canMaskLayers, canMaskSelection, canPasteSVG, getLineToPoint, getSelectionTopLeft, getSelectionBottomRight, getLineFromPoint, getArtboardsTopTop, getSelectionBounds, getSelectedBounds, getParentPaperLayer } from '../selectors/layer';
import { getLayerStyle, getLayerTransform, getLayerShapeOpts, getLayerFrame, getLayerPathData, getLayerTextStyle, getLayerMasked, getLayerUnderlyingMask } from '../utils/actions';

import { bufferToBase64, scrollToLayer } from '../../utils';
import { renderShapeGroup } from '../../canvas/sketch/utils/shapeGroup';
import getTheme from '../theme';

import { addDocumentImage } from './documentSettings';
import { setTweenDrawerEventThunk } from './tweenDrawer';
import { updateGradientFrame } from '../utils/layer';
import { openColorEditor, closeColorEditor } from './colorEditor';
import { openGradientEditor, closeGradientEditor } from './gradientEditor';
import { RootState } from '../reducers';

gsap.registerPlugin(ScrollToPlugin);

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
  HIDE_LAYER_CHILDREN,
  INSERT_LAYER_ABOVE,
  INSERT_LAYERS_ABOVE,
  INSERT_LAYER_BELOW,
  INSERT_LAYERS_BELOW,
  INCREASE_LAYER_SCOPE,
  DECREASE_LAYER_SCOPE,
  NEW_LAYER_SCOPE,
  CLEAR_LAYER_SCOPE,
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
  SET_LAYER_TWEEN_TIMING,
  SET_LAYER_TWEEN_DELAY,
  SET_LAYER_TWEEN_EASE,
  SET_LAYER_TWEEN_POWER,
  FREEZE_LAYER_TWEEN,
  UNFREEZE_LAYER_TWEEN,
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
  SET_LAYER_FILL_TYPE,
  SET_LAYERS_FILL_TYPE,
  ADD_LAYERS_MASK,
  SET_LAYER_UNDERLYING_MASK,
  SET_LAYERS_UNDERLYING_MASK,
  TOGGLE_LAYER_IGNORE_UNDERLYING_MASK,
  TOGGLE_LAYERS_IGNORE_UNDERLYING_MASK,
  TOGGLE_LAYER_MASK,
  TOGGLE_LAYERS_MASK,
  SET_LAYER_MASKED,
  SET_LAYERS_MASKED,
  REMOVE_LAYERS_MASK,
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
  AddArtboardPayload,
  AddGroupPayload,
  AddShapePayload,
  AddTextPayload,
  AddImagePayload,
  AddLayersPayload,
  RemoveLayerPayload,
  RemoveLayersPayload,
  SelectLayerPayload,
  DeepSelectLayerPayload,
  SelectLayersPayload,
  DeselectLayerPayload,
  DeselectLayersPayload,
  AreaSelectLayersPayload,
  SetLayerHoverPayload,
  AddLayerChildPayload,
  AddLayerChildrenPayload,
  InsertLayerChildPayload,
  ShowLayerChildrenPayload,
  HideLayerChildrenPayload,
  InsertLayerAbovePayload,
  InsertLayersAbovePayload,
  InsertLayerBelowPayload,
  InsertLayersBelowPayload,
  IncreaseLayerScopePayload,
  NewLayerScopePayload,
  SetLayerScopePayload,
  SetLayersScopePayload,
  SetGlobalScopePayload,
  GroupLayersPayload,
  UngroupLayerPayload,
  UngroupLayersPayload,
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
  SetLayerTweenTimingPayload,
  SetLayerTweenDelayPayload,
  SetLayerTweenEasePayload,
  SetLayerTweenPowerPayload,
  FreezeLayerTweenPayload,
  UnFreezeLayerTweenPayload,
  SetLayerXPayload,
  SetLayersXPayload,
  SetLayerYPayload,
  SetLayersYPayload,
  SetLayerWidthPayload,
  SetLayersWidthPayload,
  SetLayerHeightPayload,
  SetLayersHeightPayload,
  SetLayerRotationPayload,
  SetLayersRotationPayload,
  SetLayerOpacityPayload,
  SetLayersOpacityPayload,
  EnableLayerHorizontalFlipPayload,
  EnableLayersHorizontalFlipPayload,
  DisableLayerHorizontalFlipPayload,
  DisableLayersHorizontalFlipPayload,
  EnableLayerVerticalFlipPayload,
  EnableLayersVerticalFlipPayload,
  DisableLayerVerticalFlipPayload,
  DisableLayersVerticalFlipPayload,
  EnableLayerFillPayload,
  EnableLayersFillPayload,
  DisableLayerFillPayload,
  DisableLayersFillPayload,
  SetLayerFillColorPayload,
  SetLayersFillColorPayload,
  EnableLayerStrokePayload,
  EnableLayersStrokePayload,
  DisableLayerStrokePayload,
  DisableLayersStrokePayload,
  SetLayerStrokeColorPayload,
  SetLayersStrokeColorPayload,
  SetLayerStrokeFillTypePayload,
  SetLayersStrokeFillTypePayload,
  SetLayerGradientPayload,
  SetLayersGradientPayload,
  SetLayerGradientTypePayload,
  SetLayersGradientTypePayload,
  SetLayerGradientOriginPayload,
  SetLayersGradientOriginPayload,
  SetLayerGradientDestinationPayload,
  SetLayersGradientDestinationPayload,
  SetLayerGradientStopColorPayload,
  SetLayersGradientStopColorPayload,
  SetLayerGradientStopPositionPayload,
  SetLayersGradientStopPositionPayload,
  AddLayerGradientStopPayload,
  AddLayersGradientStopPayload,
  RemoveLayerGradientStopPayload,
  RemoveLayersGradientStopPayload,
  SetLayerActiveGradientStopPayload,
  SetLayerStrokeWidthPayload,
  SetLayersStrokeWidthPayload,
  SetLayerStrokeCapPayload,
  SetLayersStrokeCapPayload,
  SetLayerStrokeJoinPayload,
  SetLayersStrokeJoinPayload,
  SetLayerStrokeDashOffsetPayload,
  SetLayersStrokeDashOffsetPayload,
  SetLayerStrokeDashArrayPayload,
  SetLayersStrokeDashArrayPayload,
  SetLayerStrokeDashArrayWidthPayload,
  SetLayersStrokeDashArrayWidthPayload,
  SetLayerStrokeDashArrayGapPayload,
  SetLayersStrokeDashArrayGapPayload,
  SetLayerStrokeMiterLimitPayload,
  EnableLayerShadowPayload,
  EnableLayersShadowPayload,
  DisableLayerShadowPayload,
  DisableLayersShadowPayload,
  SetLayerShadowColorPayload,
  SetLayersShadowColorPayload,
  SetLayerShadowBlurPayload,
  SetLayersShadowBlurPayload,
  SetLayerShadowXOffsetPayload,
  SetLayersShadowXOffsetPayload,
  SetLayerShadowYOffsetPayload,
  SetLayersShadowYOffsetPayload,
  ScaleLayerPayload,
  ScaleLayersPayload,
  SetLayerTextPayload,
  SetLayerFontSizePayload,
  SetLayersFontSizePayload,
  SetLayerLeadingPayload,
  SetLayersLeadingPayload,
  SetLayerFontWeightPayload,
  SetLayersFontWeightPayload,
  SetLayerFontFamilyPayload,
  SetLayersFontFamilyPayload,
  SetLayerJustificationPayload,
  SetLayersJustificationPayload,
  SetLayerFillPayload,
  SetLayerFillTypePayload,
  SetLayersFillTypePayload,
  AddLayersMaskPayload,
  SetLayerUnderlyingMaskPayload,
  SetLayersUnderlyingMaskPayload,
  ToggleLayerIgnoreUnderlyingMaskPayload,
  ToggleLayersIgnoreUnderlyingMaskPayload,
  ToggleLayerMaskPayload,
  ToggleLayersMaskPayload,
  SetLayerMaskedPayload,
  SetLayersMaskedPayload,
  RemoveLayersMaskPayload,
  AlignLayersToLeftPayload,
  AlignLayersToRightPayload,
  AlignLayersToTopPayload,
  AlignLayersToBottomPayload,
  AlignLayersToCenterPayload,
  AlignLayersToMiddlePayload,
  DistributeLayersHorizontallyPayload,
  DistributeLayersVerticallyPayload,
  DuplicateLayerPayload,
  DuplicateLayersPayload,
  RemoveDuplicatedLayersPayload,
  BringLayerForwardPayload,
  BringLayersForwardPayload,
  BringLayerToFrontPayload,
  BringLayersToFrontPayload,
  SendLayerBackwardPayload,
  SendLayersBackwardPayload,
  SendLayerToBackPayload,
  SendLayersToBackPayload,
  SetLayerBlendModePayload,
  SetLayersBlendModePayload,
  UniteLayersPayload,
  IntersectLayersPayload,
  SubtractLayersPayload,
  ExcludeLayersPayload,
  DivideLayersPayload,
  SetRoundedRadiusPayload,
  SetRoundedRadiiPayload,
  SetPolygonSidesPayload,
  SetPolygonsSidesPayload,
  SetStarPointsPayload,
  SetStarsPointsPayload,
  SetStarRadiusPayload,
  SetStarsRadiusPayload,
  SetLineFromXPayload,
  SetLinesFromXPayload,
  SetLineFromYPayload,
  SetLinesFromYPayload,
  SetLineFromPayload,
  SetLineToXPayload,
  SetLinesToXPayload,
  SetLineToYPayload,
  SetLinesToYPayload,
  SetLineToPayload,
  SetLayerEditPayload,
  SetLayerStylePayload,
  SetLayersStylePayload,
  LayerTypes
} from '../actionTypes/layer';

// Artboard

export const addArtboard = (payload: AddArtboardPayload): LayerTypes => ({
  type: ADD_ARTBOARD,
  payload
});

export const addArtboardThunk = (payload: AddArtboardPayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Artboard> => {
    const state = getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const name = payload.layer.name ? payload.layer.name : 'Artboard';
    const scope = ['page'];
    const masked = payload.layer.masked ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = payload.layer.underlyingMask ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = payload.layer.ignoreUnderlyingMask ? payload.layer.ignoreUnderlyingMask : false;
    const style = getLayerStyle(payload, {}, { fill: { color: DEFAULT_ARTBOARD_BACKGROUND_COLOR } as Btwx.Fill, stroke: { enabled: false } as Btwx.Stroke, shadow: { enabled: false } as Btwx.Shadow });
    const frame = getLayerFrame(payload);
    const showChildren = payload.layer.showChildren ? payload.layer.showChildren : false;
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    // create background
    const artboardBackground = new paperMain.Path.Rectangle({
      name: 'Artboard Background',
      point: new paperMain.Point(0,0),
      size: [payload.layer.frame.width, payload.layer.frame.height],
      data: { id: 'ArtboardBackground', type: 'LayerChild', layerType: 'Artboard' },
      fillColor: paperFillColor,
      position: new paperMain.Point(payload.layer.frame.x, payload.layer.frame.y),
      shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
      shadowOffset: new paperMain.Point(0, 2),
      shadowBlur: 10,
    });
    // create mask
    const artboardLayersMask = artboardBackground.clone();
    artboardLayersMask.name = 'Artboard Layers Mask';
    artboardLayersMask.data = { id: 'ArtboardLayersMask', type: 'LayerChild', layerType: 'Artboard' };
    artboardLayersMask.clipMask = true;
    //
    const artboardLayers = new paperMain.Group({
      name: 'Artboard Layers',
      data: { id: 'ArtboardLayers', type: 'LayerChild', layerType: 'Artboard' }
    });
    //
    const artboardMaskedLayers = new paperMain.Group({
      name: 'Artboard Masked Layers',
      data: { id: 'ArtboardMaskedLayers', type: 'LayerChild', layerType: 'Artboard' },
      children: [artboardLayersMask, artboardLayers]
    });
    // create artboard group
    const artboard = new paperMain.Group({
      name: name,
      data: { id: id, type: 'Layer', layerType: 'Artboard', selected: false, hover: false, activeArtboard: false, scope: scope },
      children: [artboardBackground, artboardMaskedLayers],
      parent: getPaperLayer('page')
    });
    // dispatch action
    const newLayer = {
      type: 'Artboard',
      id: id,
      name: name,
      parent: payload.layer.parent,
      frame: payload.layer.frame,
      scope: scope,
      children: [],
      selected: false,
      showChildren: showChildren,
      tweenEvents: [],
      tweens: [],
      transform: DEFAULT_TRANSFORM,
      style: DEFAULT_STYLE,
      masked,
      underlyingMask,
      ignoreUnderlyingMask,
    } as Btwx.Artboard;
    dispatch(addArtboard({
      layer: newLayer,
      batch: payload.batch
    }));
    return Promise.resolve(newLayer);
  }
};

// Group

export const addGroup = (payload: AddGroupPayload): LayerTypes => ({
  type: ADD_GROUP,
  payload
});

export const addGroupThunk = (payload: AddGroupPayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Group> => {
    const state = getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const style = getLayerStyle(payload, {}, { fill: { enabled: false } as Btwx.Fill, stroke: { enabled: false } as Btwx.Stroke, shadow: { enabled: false } as Btwx.Shadow });
    const name = payload.layer.name ? payload.layer.name : 'Group';
    const parent = payload.layer.parent ? payload.layer.parent : 'page';
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const frame = payload.layer.frame ? payload.layer.frame : { x: 0, y: 0, width: 0, height: 0, innerWidth: 0, innerHeight: 0 };
    // const masked = payload.layer.masked ? payload.layer.masked : false;
    // const clipped = payload.layer.clipped ? payload.layer.clipped : false;
    const showChildren = payload.layer.showChildren ? payload.layer.showChildren : false;
    const group = new paperMain.Group({
      name: name,
      data: { id: id, type: 'Layer', layerType: 'Group', selected: false, hover: false, scope: scope },
      parent: parentPaperLayer
    });
    const newLayer = {
      type: 'Group',
      id,
      name,
      parent,
      frame,
      scope,
      children: [],
      selected: false,
      tweenEvents: [],
      tweens: [],
      transform: DEFAULT_TRANSFORM,
      showChildren,
      style,
      underlyingMask,
      ignoreUnderlyingMask,
      masked
    } as Btwx.Group;
    dispatch(addGroup({
      layer: newLayer,
      batch: payload.batch
    }));
    return Promise.resolve(newLayer);
  }
};

// Shape

export const addShape = (payload: AddShapePayload): LayerTypes => ({
  type: ADD_SHAPE,
  payload
});

export const addShapeThunk = (payload: AddShapePayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Shape> => {
    const state = getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const parent = payload.layer.parent ? payload.layer.parent : 'page';
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const shapeType = payload.layer.shapeType ? payload.layer.shapeType : 'Rectangle';
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const name = payload.layer.name ? payload.layer.name : shapeType;
    const frame = getLayerFrame(payload);
    const shapeOpts = getLayerShapeOpts(payload);
    const pathData = getLayerPathData(payload);
    const style = getLayerStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new paperMain.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as Btwx.PaperGradientFill : null;
    const mask = payload.layer.mask ? payload.layer.mask : false;
    const paperLayer = new paperMain.CompoundPath({
      name: name,
      pathData: pathData,
      closed: payload.layer.closed,
      strokeWidth: style.stroke.width,
      shadowColor: paperShadowColor,
      shadowOffset: paperShadowOffset,
      shadowBlur: paperShadowBlur,
      blendMode: style.blendMode,
      opacity: style.opacity,
      dashArray: style.strokeOptions.dashArray,
      dashOffset: style.strokeOptions.dashOffset,
      strokeCap: style.strokeOptions.cap,
      clipMask: mask,
      strokeJoin: style.strokeOptions.join,
      data: { id, type: 'Layer', layerType: 'Shape', shapeType: shapeType, selected: false, hover: false, scope: scope },
      parent: parentPaperLayer
    });
    paperLayer.children.forEach((item) => item.data = { id: 'ShapePartial', type: 'LayerChild', layerType: 'Shape' });
    paperLayer.position = new paperMain.Point(frame.x, frame.y);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    if (mask) {
      const maskGroup = new paperMain.Group({
        name: 'MaskGroup',
        data: { id: `${id}-MaskGroup`, type: 'LayerContainer', layerType: 'Shape' },
        children: [paperLayer.clone()]
      });
      paperLayer.replaceWith(maskGroup);
    }
    const newLayer = {
      type: 'Shape',
      id: id,
      name: name,
      parent: parent,
      shapeType: shapeType,
      frame: frame,
      scope: scope,
      selected: false,
      children: null,
      tweenEvents: [],
      tweens: [],
      closed: payload.layer.closed,
      mask,
      underlyingMask,
      ignoreUnderlyingMask,
      masked,
      style,
      transform,
      pathData,
      ...shapeOpts
    } as Btwx.Shape;
    dispatch(addShape({
      layer: newLayer,
      batch: payload.batch
    }));
    return Promise.resolve(newLayer);
  }
};

export const addShapeGroupThunk = (payload: AddShapePayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Shape> => {
    const state = getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const parent = payload.layer.parent ? payload.layer.parent : 'page';
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const shapeType = payload.layer.shapeType ? payload.layer.shapeType : 'Rectangle';
    const name = payload.layer.name ? payload.layer.name : shapeType;
    const frame = getLayerFrame(payload);
    const shapeOpts = getLayerShapeOpts(payload);
    const style = getLayerStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new paperMain.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as Btwx.PaperGradientFill : null;
    const mask = payload.layer.mask ? payload.layer.mask : false;
    const shapeContainer = renderShapeGroup((payload.layer as any).sketchLayer);
    const paperLayer = new paperMain.CompoundPath({
      name: name,
      pathData: shapeContainer.lastChild.pathData,
      closed: payload.layer.closed,
      strokeWidth: style.stroke.width,
      shadowColor: paperShadowColor,
      shadowOffset: paperShadowOffset,
      shadowBlur: paperShadowBlur,
      blendMode: style.blendMode,
      opacity: style.opacity,
      dashArray: style.strokeOptions.dashArray,
      dashOffset: style.strokeOptions.dashOffset,
      strokeCap: style.strokeOptions.cap,
      strokeJoin: style.strokeOptions.join,
      clipMask: mask,
      data: { id, type: 'Layer', layerType: 'Shape', shapeType: 'Custom', selected: false, hover: false, scope: scope },
      parent: parentPaperLayer
    });
    paperLayer.children.forEach((item) => item.data = { id: 'ShapePartial', type: 'LayerChild', layerType: 'Shape' });
    paperLayer.position = new paperMain.Point(frame.x, frame.y);
    // wonky fix to make sure gradient destination and origin are in correct place
    paperLayer.rotation = -transform.rotation;
    paperLayer.scale(transform.horizontalFlip ? -1 : 1, transform.verticalFlip ? -1 : 1);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    paperLayer.rotation = transform.rotation;
    paperLayer.scale(transform.horizontalFlip ? -1 : 1, transform.verticalFlip ? -1 : 1);
    //
    if (mask) {
      const maskGroup = new paperMain.Group({
        name: 'MaskGroup',
        data: { id: `${id}-MaskGroup`, type: 'LayerContainer', layerType: 'Shape' },
        children: [paperLayer.clone()]
      });
      paperLayer.replaceWith(maskGroup);
    }
    //
    const newLayer = {
      type: 'Shape',
      id: id,
      name: name,
      parent: parent,
      shapeType: 'Custom',
      scope: scope,
      frame: frame,
      selected: false,
      children: null,
      tweenEvents: [],
      tweens: [],
      closed: true,
      mask,
      underlyingMask,
      ignoreUnderlyingMask,
      masked,
      style,
      transform,
      pathData: shapeContainer.lastChild.pathData,
      ...shapeOpts
    } as Btwx.Shape;
    dispatch(addShape({
      layer: newLayer,
      batch: payload.batch
    }));
    return Promise.resolve(newLayer);
  }
};

// Text

export const addText = (payload: AddTextPayload): LayerTypes => ({
  type: ADD_TEXT,
  payload
});

export const addTextThunk = (payload: AddTextPayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Text> => {
    const state = getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const textContent = payload.layer.text ? payload.layer.text : DEFAULT_TEXT_VALUE;
    const name = payload.layer.name ? payload.layer.name : textContent;
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parent = payload.layer.parent ? payload.layer.parent : 'page';
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const style = getLayerStyle(payload);
    const textStyle = getLayerTextStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new paperMain.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperLayer = new paperMain.PointText({
      point: new paperMain.Point(0, 0),
      content: textContent,
      data: { id: 'TextContent', type: 'LayerChild', layerType: 'Text' },
      parent: parentPaperLayer,
      strokeWidth: style.stroke.width,
      shadowColor: paperShadowColor,
      shadowOffset: paperShadowOffset,
      shadowBlur: paperShadowBlur,
      blendMode: style.blendMode,
      opacity: style.opacity,
      dashArray: style.strokeOptions.dashArray,
      dashOffset: style.strokeOptions.dashOffset,
      strokeCap: style.strokeOptions.cap,
      strokeJoin: style.strokeOptions.join,
      fontSize: textStyle.fontSize,
      leading: textStyle.leading,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      justification: textStyle.justification
    });
    const frame = getLayerFrame(payload);
    // const frame = getLayerFrame(payload, { width: paperLayer.bounds.width, height: paperLayer.bounds.height, innerWidth: paperLayer.bounds.width, innerHeight: paperLayer.bounds.height });
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as Btwx.PaperGradientFill : null;
    paperLayer.position = new paperMain.Point(frame.x, frame.y);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    const textBackground = new paperMain.Path.Rectangle({
      from: new paperMain.Point(frame.x - frame.width / 2, frame.y - frame.height / 2),
      to: new paperMain.Point(frame.x + frame.width / 2, frame.y + frame.height / 2),
      fillColor: '#fff',
      opacity: 0,
      insert: false,
      data: { id: 'TextBackground', type: 'LayerChild', layerType: 'Text' },
    });
    const textContainer = new paperMain.Group({
      name: name,
      parent: parentPaperLayer,
      data: { id, type: 'Layer', layerType: 'Text', selected: false, hover: false, scope: scope },
      children: [textBackground, paperLayer]
    });
    const newLayer = {
      type: 'Text',
      id: id,
      name: name,
      parent: parent,
      text: textContent,
      scope: scope,
      frame: frame,
      selected: false,
      children: null,
      tweenEvents: [],
      tweens: [],
      underlyingMask,
      ignoreUnderlyingMask,
      masked,
      style,
      transform,
      textStyle
    } as Btwx.Text;
    dispatch(addText({
      layer: newLayer,
      batch: payload.batch
    }));
    return Promise.resolve(newLayer);
  }
};

// Image

export const addImage = (payload: AddImagePayload): LayerTypes => ({
  type: ADD_IMAGE,
  payload
});

export const addImageThunk = (payload: AddImagePayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Image> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      const buffer = Buffer.from(payload.buffer);
      sharp(buffer).metadata().then(({ width, height }) => {
        sharp(buffer).resize(Math.round(width * 0.5)).webp({quality: 50}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
          const frame = getLayerFrame(payload);
          const name = payload.layer.name ? payload.layer.name : 'Image';
          const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
          const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
          const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
          const newBuffer = Buffer.from(data);
          const exists = state.documentSettings.images.allIds.length > 0 && state.documentSettings.images.allIds.find((id) => Buffer.from(state.documentSettings.images.byId[id].buffer).equals(newBuffer));
          const base64 = bufferToBase64(newBuffer);
          const id = payload.layer.id ? payload.layer.id : uuidv4();
          const imageId = exists ? exists : payload.layer.imageId ? payload.layer.imageId : uuidv4();
          const parent = payload.layer.parent ? payload.layer.parent : 'page';
          const parentItem = state.layer.present.byId[parent];
          const scope = [...parentItem.scope, parent];
          const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
          const style = getLayerStyle(payload, {}, { fill: { enabled: false } as Btwx.Fill, stroke: { enabled: false } as Btwx.Stroke });
          const transform = getLayerTransform(payload);
          const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
          const paperShadowOffset = style.shadow.enabled ? new paperMain.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
          const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
          const paperLayer = new paperMain.Raster(`data:image/webp;base64,${base64}`);
          const imageContainer = new paperMain.Group({
            name: name,
            parent: parentPaperLayer,
            data: { id, imageId, type: 'Layer', layerType: 'Image', selected: false, hover: false, scope: scope },
            children: [paperLayer]
          });
          paperLayer.onLoad = (): void => {
            paperLayer.data = { id: 'Raster', type: 'LayerChild', layerType: 'Image' };
            imageContainer.bounds.width = frame.innerWidth;
            imageContainer.bounds.height = frame.innerHeight;
            imageContainer.position = new paperMain.Point(frame.x, frame.y);
            imageContainer.shadowColor = paperShadowColor;
            imageContainer.shadowOffset = paperShadowOffset;
            imageContainer.shadowBlur = paperShadowBlur;
            const newLayer = {
              type: 'Image',
              id: id,
              name: name,
              parent: parent,
              scope: scope,
              frame: frame,
              selected: false,
              children: null,
              tweenEvents: [],
              tweens: [],
              underlyingMask,
              ignoreUnderlyingMask,
              masked,
              style,
              transform,
              imageId
            } as Btwx.Image;
            if (!exists) {
              dispatch(addDocumentImage({id: imageId, buffer: newBuffer}));
            }
            dispatch(addImage({
              layer: newLayer,
              batch: payload.batch
            }));
            resolve(newLayer);
          }
        });
      });
    });
  }
};

// layers

export const addLayers = (payload: AddLayersPayload): LayerTypes => ({
  type: ADD_LAYERS,
  payload
});

export const addLayersThunk = (payload: AddLayersPayload) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const promises: Promise<any>[] = [];
      payload.layers.forEach((layer) => {
        switch(layer.type as Btwx.LayerType | 'ShapeGroup') {
          case 'Artboard':
            promises.push(dispatch(addArtboardThunk({layer: layer as Btwx.Artboard, batch: true})));
            break;
          case 'Shape':
            promises.push(dispatch(addShapeThunk({layer: layer as Btwx.Shape, batch: true})));
            break;
          case 'ShapeGroup':
            promises.push(dispatch(addShapeGroupThunk({layer: layer as Btwx.Shape, batch: true})));
            break;
          case 'Image':
            promises.push(dispatch(addImageThunk({layer: layer as Btwx.Image, batch: true, buffer: payload.buffers[(layer as Btwx.Image).imageId].buffer})));
            break;
          case 'Group':
            promises.push(dispatch(addGroupThunk({layer: layer as Btwx.Group, batch: true})));
            break;
          case 'Text':
            promises.push(dispatch(addTextThunk({layer: layer as Btwx.Text, batch: true})));
            break;
        }
      });
      Promise.all(promises).then((layers) => {
        dispatch(addLayers({layers: layers}));
        resolve();
      });
    });
  }
}

// Remove

export const removeLayer = (payload: RemoveLayerPayload): LayerTypes => ({
  type: REMOVE_LAYER,
  payload
});

export const removeLayers = (payload: RemoveLayersPayload): LayerTypes => ({
  type: REMOVE_LAYERS,
  payload
});

export const removeLayersThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.layer.present.selected.length > 0 && state.canvasSettings.focusing) {
      if (state.viewSettings.tweenDrawer.isOpen && state.tweenDrawer.event) {
        const tweenEvent = state.layer.present.tweenEventById[state.tweenDrawer.event];
        let layersAndChildren: string[] = [];
        state.layer.present.selected.forEach((id) => {
          layersAndChildren = [...layersAndChildren, ...getLayerAndDescendants(state.layer.present, id)];
        });
        if (layersAndChildren.includes(tweenEvent.layer) || layersAndChildren.includes(tweenEvent.artboard) || layersAndChildren.includes(tweenEvent.destinationArtboard)) {
          dispatch(setTweenDrawerEventThunk({id: null}));
        }
      }
      dispatch(removeLayers({layers: state.layer.present.selected}));
    } else {
      return;
    }
  }
}

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

export const selectAllLayers = (): LayerTypes => ({
  type: SELECT_ALL_LAYERS
});

export const areaSelectLayers = (payload: AreaSelectLayersPayload): LayerTypes => ({
  type: AREA_SELECT_LAYERS,
  payload
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

export const addLayerChildren = (payload: AddLayerChildrenPayload): LayerTypes => ({
  type: ADD_LAYER_CHILDREN,
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

export const insertLayersAbove = (payload: InsertLayersAbovePayload): LayerTypes => ({
  type: INSERT_LAYERS_ABOVE,
  payload
});

export const insertLayerBelow = (payload: InsertLayerBelowPayload): LayerTypes => ({
  type: INSERT_LAYER_BELOW,
  payload
});

export const insertLayersBelow = (payload: InsertLayersBelowPayload): LayerTypes => ({
  type: INSERT_LAYERS_BELOW,
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

export const setLayerScope = (payload: SetLayerScopePayload): LayerTypes => ({
  type: SET_LAYER_SCOPE,
  payload
});

export const setLayersScope = (payload: SetLayersScopePayload): LayerTypes => ({
  type: SET_LAYERS_SCOPE,
  payload
});

export const setGlobalScope = (payload: SetGlobalScopePayload): LayerTypes => ({
  type: SET_GLOBAL_SCOPE,
  payload
});

export const escapeLayerScopeThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const nextScope = state.layer.present.scope.filter((id, index) => index !== state.layer.present.scope.length - 1);
    if (state.layer.present.scope.length > 0) {
      scrollToLayer(state.layer.present.scope[state.layer.present.scope.length - 1]);
    }
    if (state.canvasSettings.mouse) {
      const point = new paperMain.Point(state.canvasSettings.mouse.paperX, state.canvasSettings.mouse.paperY)
      const hitResult = paperMain.project.hitTest(point);
      const validHitResult = hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type && (hitResult.item.data.type === 'Layer' || hitResult.item.data.type === 'LayerChild');
      if (validHitResult) {
        const layerItem = state.layer.present.byId[hitResult.item.data.type === 'Layer' ? hitResult.item.data.id : hitResult.item.parent.data.id];
        const nearestScopeAncestor = getNearestScopeAncestor({...state.layer.present, scope: nextScope}, layerItem.id);
        if (state.layer.present.hover !== nearestScopeAncestor.id) {
          dispatch(setLayerHover({id: nearestScopeAncestor.id}));
        }
      } else {
        if (state.layer.present.hover !== null) {
          dispatch(setLayerHover({id: null}));
        }
      }
    }
    dispatch(escapeLayerScope());
  }
}

// Group

export const groupLayers = (payload: GroupLayersPayload): LayerTypes => ({
  type: GROUP_LAYERS,
  payload
});

export const groupLayersThunk = (payload: GroupLayersPayload) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      // get bounds of layers to group
      const layersBounds = getLayersBounds(state.layer.present, payload.layers);
      // add group
      dispatch(addGroupThunk({
        layer: {
          selected: true,
          frame: {
            x: layersBounds.center.x,
            y: layersBounds.center.y,
            width: layersBounds.width,
            height: layersBounds.height,
            innerWidth: layersBounds.width,
            innerHeight: layersBounds.height
          }
        },
        batch: true
      })).then((newGroup: Btwx.Group) => {
        dispatch(groupLayers({...payload, group: newGroup}));
        resolve();
      });
    });
  }
};

export const groupSelectedThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      // get bounds of layers to group
      const layersBounds = getSelectedBounds(state);
      // add group
      dispatch(addGroupThunk({
        layer: {
          selected: true,
          frame: {
            x: layersBounds.center.x,
            y: layersBounds.center.y,
            width: layersBounds.width,
            height: layersBounds.height,
            innerWidth: layersBounds.width,
            innerHeight: layersBounds.height
          }
        },
        batch: true
      })).then((newGroup: Btwx.Group) => {
        dispatch(groupLayers({layers: state.layer.present.selected, group: newGroup}));
        resolve();
      });
    });
  }
};

export const ungroupLayer = (payload: UngroupLayerPayload): LayerTypes => ({
  type: UNGROUP_LAYER,
  payload
});

export const ungroupLayers = (payload: UngroupLayersPayload): LayerTypes => ({
  type: UNGROUP_LAYERS,
  payload
});

export const ungroupSelectedThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      dispatch(ungroupLayers({layers: state.layer.present.selected}));
    });
  }
};

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

export const setLayerTweenTiming = (payload: SetLayerTweenTimingPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_TIMING,
  payload
});

export const setLayerTweenDelay = (payload: SetLayerTweenDelayPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_DELAY,
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

export const setLayersX = (payload: SetLayersXPayload): LayerTypes => ({
  type: SET_LAYERS_X,
  payload
});

export const setLayerY = (payload: SetLayerYPayload): LayerTypes => ({
  type: SET_LAYER_Y,
  payload
});

export const setLayersY = (payload: SetLayersYPayload): LayerTypes => ({
  type: SET_LAYERS_Y,
  payload
});

export const setLayerWidth = (payload: SetLayerWidthPayload): LayerTypes => ({
  type: SET_LAYER_WIDTH,
  payload
});

export const setLayersWidth = (payload: SetLayersWidthPayload): LayerTypes => ({
  type: SET_LAYERS_WIDTH,
  payload
});

export const setLayerHeight = (payload: SetLayerHeightPayload): LayerTypes => ({
  type: SET_LAYER_HEIGHT,
  payload
});

export const setLayersHeight = (payload: SetLayersHeightPayload): LayerTypes => ({
  type: SET_LAYERS_HEIGHT,
  payload
});

export const setLayerRotation = (payload: SetLayerRotationPayload): LayerTypes => ({
  type: SET_LAYER_ROTATION,
  payload
});

export const setLayersRotation = (payload: SetLayersRotationPayload): LayerTypes => ({
  type: SET_LAYERS_ROTATION,
  payload
});

export const setLayerOpacity = (payload: SetLayerOpacityPayload): LayerTypes => ({
  type: SET_LAYER_OPACITY,
  payload
});

export const setLayersOpacity = (payload: SetLayersOpacityPayload): LayerTypes => ({
  type: SET_LAYERS_OPACITY,
  payload
});

export const enableLayerHorizontalFlip = (payload: EnableLayerHorizontalFlipPayload): LayerTypes => ({
  type: ENABLE_LAYER_HORIZONTAL_FLIP,
  payload
});

export const enableLayersHorizontalFlip = (payload: EnableLayersHorizontalFlipPayload): LayerTypes => ({
  type: ENABLE_LAYERS_HORIZONTAL_FLIP,
  payload
});

export const disableLayerHorizontalFlip = (payload: DisableLayerHorizontalFlipPayload): LayerTypes => ({
  type: DISABLE_LAYER_HORIZONTAL_FLIP,
  payload
});

export const disableLayersHorizontalFlip = (payload: DisableLayersHorizontalFlipPayload): LayerTypes => ({
  type: DISABLE_LAYERS_HORIZONTAL_FLIP,
  payload
});

export const toggleSelectedHorizontalFlipThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.horizontalFlip);
    if (mixed) {
      const unFlipped = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].transform.horizontalFlip);
      dispatch(enableLayersHorizontalFlip({layers: unFlipped}));
    } else {
      const flipped = state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.horizontalFlip);
      if (flipped) {
        dispatch(disableLayersHorizontalFlip({layers: state.layer.present.selected}));
      } else {
        dispatch(enableLayersHorizontalFlip({layers: state.layer.present.selected}));
      }
    }
  }
};

export const enableLayerVerticalFlip = (payload: EnableLayerVerticalFlipPayload): LayerTypes => ({
  type: ENABLE_LAYER_VERTICAL_FLIP,
  payload
});

export const enableLayersVerticalFlip = (payload: EnableLayersVerticalFlipPayload): LayerTypes => ({
  type: ENABLE_LAYERS_VERTICAL_FLIP,
  payload
});

export const disableLayerVerticalFlip = (payload: DisableLayerVerticalFlipPayload): LayerTypes => ({
  type: DISABLE_LAYER_VERTICAL_FLIP,
  payload
});

export const disableLayersVerticalFlip = (payload: DisableLayersVerticalFlipPayload): LayerTypes => ({
  type: DISABLE_LAYERS_VERTICAL_FLIP,
  payload
});

export const toggleSelectedVerticalFlipThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.verticalFlip);
    if (mixed) {
      const unFlipped = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].transform.verticalFlip);
      dispatch(enableLayersVerticalFlip({layers: unFlipped}));
    } else {
      const flipped = state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.verticalFlip);
      if (flipped) {
        dispatch(disableLayersVerticalFlip({layers: state.layer.present.selected}));
      } else {
        dispatch(enableLayersVerticalFlip({layers: state.layer.present.selected}));
      }
    }
  }
};

export const enableLayerFill = (payload: EnableLayerFillPayload): LayerTypes => ({
  type: ENABLE_LAYER_FILL,
  payload
});

export const enableLayersFill = (payload: EnableLayersFillPayload): LayerTypes => ({
  type: ENABLE_LAYERS_FILL,
  payload
});

export const toggleSelectedFillThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].style.fill.enabled);
    if (mixed) {
      const disabled = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].style.fill.enabled);
      dispatch(enableLayersFill({layers: disabled}));
    } else {
      const enabled = state.layer.present.selected.every((id) => state.layer.present.byId[id].style.fill.enabled);
      if (enabled) {
        dispatch(disableLayersFill({layers: state.layer.present.selected}));
      } else {
        dispatch(enableLayersFill({layers: state.layer.present.selected}));
      }
    }
  }
};

export const disableLayerFill = (payload: DisableLayerFillPayload): LayerTypes => ({
  type: DISABLE_LAYER_FILL,
  payload
});

export const disableLayersFill = (payload: DisableLayersFillPayload): LayerTypes => ({
  type: DISABLE_LAYERS_FILL,
  payload
});

export const setLayerFillColor = (payload: SetLayerFillColorPayload): LayerTypes => ({
  type: SET_LAYER_FILL_COLOR,
  payload
});

export const setLayersFillColor = (payload: SetLayersFillColorPayload): LayerTypes => ({
  type: SET_LAYERS_FILL_COLOR,
  payload
});

export const enableLayerStroke = (payload: EnableLayerStrokePayload): LayerTypes => ({
  type: ENABLE_LAYER_STROKE,
  payload
});

export const enableLayersStroke = (payload: EnableLayersStrokePayload): LayerTypes => ({
  type: ENABLE_LAYERS_STROKE,
  payload
});

export const toggleSelectedStrokeThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].style.stroke.enabled);
    if (mixed) {
      const disabled = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].style.stroke.enabled);
      dispatch(enableLayersStroke({layers: disabled}));
    } else {
      const enabled = state.layer.present.selected.every((id) => state.layer.present.byId[id].style.stroke.enabled);
      if (enabled) {
        dispatch(disableLayersStroke({layers: state.layer.present.selected}));
      } else {
        dispatch(enableLayersStroke({layers: state.layer.present.selected}));
      }
    }
  }
};

export const disableLayerStroke = (payload: DisableLayerStrokePayload): LayerTypes => ({
  type: DISABLE_LAYER_STROKE,
  payload
});

export const disableLayersStroke = (payload: DisableLayersStrokePayload): LayerTypes => ({
  type: DISABLE_LAYERS_STROKE,
  payload
});

export const setLayerStrokeColor = (payload: SetLayerStrokeColorPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_COLOR,
  payload
});

export const setLayersStrokeColor = (payload: SetLayersStrokeColorPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_COLOR,
  payload
});

export const setLayerStrokeFillType = (payload: SetLayerStrokeFillTypePayload): LayerTypes => ({
  type: SET_LAYER_STROKE_FILL_TYPE,
  payload
});

export const setLayersStrokeFillType = (payload: SetLayersStrokeFillTypePayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_FILL_TYPE,
  payload
});

export const setLayerGradient = (payload: SetLayerGradientPayload): LayerTypes => ({
  type: SET_LAYER_GRADIENT,
  payload
});

export const setLayersGradient = (payload: SetLayersGradientPayload): LayerTypes => ({
  type: SET_LAYERS_GRADIENT,
  payload
});

export const setLayerGradientType = (payload: SetLayerGradientTypePayload): LayerTypes => ({
  type: SET_LAYER_GRADIENT_TYPE,
  payload
});

export const setLayersGradientType = (payload: SetLayersGradientTypePayload): LayerTypes => ({
  type: SET_LAYERS_GRADIENT_TYPE,
  payload
});

export const setLayerGradientOrigin = (payload: SetLayerGradientOriginPayload): LayerTypes => ({
  type: SET_LAYER_GRADIENT_ORIGIN,
  payload
});

export const setLayersGradientOrigin = (payload: SetLayersGradientOriginPayload): LayerTypes => ({
  type: SET_LAYERS_GRADIENT_ORIGIN,
  payload
});

export const setLayerGradientDestination = (payload: SetLayerGradientDestinationPayload): LayerTypes => ({
  type: SET_LAYER_GRADIENT_DESTINATION,
  payload
});

export const setLayersGradientDestination = (payload: SetLayersGradientDestinationPayload): LayerTypes => ({
  type: SET_LAYERS_GRADIENT_DESTINATION,
  payload
});

export const setLayerGradientStopColor = (payload: SetLayerGradientStopColorPayload): LayerTypes => ({
  type: SET_LAYER_GRADIENT_STOP_COLOR,
  payload
});

export const setLayersGradientStopColor = (payload: SetLayersGradientStopColorPayload): LayerTypes => ({
  type: SET_LAYERS_GRADIENT_STOP_COLOR,
  payload
});

export const setLayerGradientStopPosition = (payload: SetLayerGradientStopPositionPayload): LayerTypes => ({
  type: SET_LAYER_GRADIENT_STOP_POSITION,
  payload
});

export const setLayersGradientStopPosition = (payload: SetLayersGradientStopPositionPayload): LayerTypes => ({
  type: SET_LAYERS_GRADIENT_STOP_POSITION,
  payload
});

export const addLayerGradientStop = (payload: AddLayerGradientStopPayload): LayerTypes => ({
  type: ADD_LAYER_GRADIENT_STOP,
  payload
});

export const addLayersGradientStop = (payload: AddLayersGradientStopPayload): LayerTypes => ({
  type: ADD_LAYERS_GRADIENT_STOP,
  payload
});

export const removeLayerGradientStop = (payload: RemoveLayerGradientStopPayload): LayerTypes => ({
  type: REMOVE_LAYER_GRADIENT_STOP,
  payload
});

export const removeLayersGradientStop = (payload: RemoveLayersGradientStopPayload): LayerTypes => ({
  type: REMOVE_LAYERS_GRADIENT_STOP,
  payload
});

export const setLayerActiveGradientStop = (payload: SetLayerActiveGradientStopPayload): LayerTypes => ({
  type: SET_LAYER_ACTIVE_GRADIENT_STOP,
  payload
});

export const setLayerStrokeWidth = (payload: SetLayerStrokeWidthPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_WIDTH,
  payload
});

export const setLayersStrokeWidth = (payload: SetLayersStrokeWidthPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_WIDTH,
  payload
});

export const setLayerStrokeCap = (payload: SetLayerStrokeCapPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_CAP,
  payload
});

export const setLayersStrokeCap = (payload: SetLayersStrokeCapPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_CAP,
  payload
});

export const setLayerStrokeJoin = (payload: SetLayerStrokeJoinPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_JOIN,
  payload
});

export const setLayersStrokeJoin = (payload: SetLayersStrokeJoinPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_JOIN,
  payload
});

export const setLayerStrokeDashOffset = (payload: SetLayerStrokeDashOffsetPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_DASH_OFFSET,
  payload
});

export const setLayersStrokeDashOffset = (payload: SetLayersStrokeDashOffsetPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_DASH_OFFSET,
  payload
});

export const setLayerStrokeDashArray = (payload: SetLayerStrokeDashArrayPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_DASH_ARRAY,
  payload
});

export const setLayersStrokeDashArray = (payload: SetLayersStrokeDashArrayPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_DASH_ARRAY,
  payload
});

export const setLayerStrokeDashArrayWidth = (payload: SetLayerStrokeDashArrayWidthPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_DASH_ARRAY_WIDTH,
  payload
});

export const setLayersStrokeDashArrayWidth = (payload: SetLayersStrokeDashArrayWidthPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_DASH_ARRAY_WIDTH,
  payload
});

export const setLayerStrokeDashArrayGap = (payload: SetLayerStrokeDashArrayGapPayload): LayerTypes => ({
  type: SET_LAYER_STROKE_DASH_ARRAY_GAP,
  payload
});

export const setLayersStrokeDashArrayGap = (payload: SetLayersStrokeDashArrayGapPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_DASH_ARRAY_GAP,
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

export const enableLayersShadow = (payload: EnableLayersShadowPayload): LayerTypes => ({
  type: ENABLE_LAYERS_SHADOW,
  payload
});

export const toggleSelectedShadowThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].style.shadow.enabled);
    if (mixed) {
      const disabled = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].style.shadow.enabled);
      dispatch(enableLayersShadow({layers: disabled}));
    } else {
      const enabled = state.layer.present.selected.every((id) => state.layer.present.byId[id].style.shadow.enabled);
      if (enabled) {
        dispatch(disableLayersShadow({layers: state.layer.present.selected}));
      } else {
        dispatch(enableLayersShadow({layers: state.layer.present.selected}));
      }
    }
  }
};

export const disableLayerShadow = (payload: DisableLayerShadowPayload): LayerTypes => ({
  type: DISABLE_LAYER_SHADOW,
  payload
});

export const disableLayersShadow = (payload: DisableLayersShadowPayload): LayerTypes => ({
  type: DISABLE_LAYERS_SHADOW,
  payload
});

export const setLayerShadowColor = (payload: SetLayerShadowColorPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_COLOR,
  payload
});

export const setLayersShadowColor = (payload: SetLayersShadowColorPayload): LayerTypes => ({
  type: SET_LAYERS_SHADOW_COLOR,
  payload
});

export const setLayerShadowBlur = (payload: SetLayerShadowBlurPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_BLUR,
  payload
});

export const setLayersShadowBlur = (payload: SetLayersShadowBlurPayload): LayerTypes => ({
  type: SET_LAYERS_SHADOW_BLUR,
  payload
});

export const setLayerShadowXOffset = (payload: SetLayerShadowXOffsetPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_X_OFFSET,
  payload
});

export const setLayersShadowXOffset = (payload: SetLayersShadowXOffsetPayload): LayerTypes => ({
  type: SET_LAYERS_SHADOW_X_OFFSET,
  payload
});

export const setLayerShadowYOffset = (payload: SetLayerShadowYOffsetPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW_Y_OFFSET,
  payload
});

export const setLayersShadowYOffset = (payload: SetLayersShadowYOffsetPayload): LayerTypes => ({
  type: SET_LAYERS_SHADOW_Y_OFFSET,
  payload
});

export const scaleLayer = (payload: ScaleLayerPayload): LayerTypes => ({
  type: SCALE_LAYER,
  payload
});

export const scaleLayers = (payload: ScaleLayersPayload): LayerTypes => ({
  type: SCALE_LAYERS,
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

export const setLayersFontSize = (payload: SetLayersFontSizePayload): LayerTypes => ({
  type: SET_LAYERS_FONT_SIZE,
  payload
});

export const setLayerLeading = (payload: SetLayerLeadingPayload): LayerTypes => ({
  type: SET_LAYER_LEADING,
  payload
});

export const setLayersLeading = (payload: SetLayersLeadingPayload): LayerTypes => ({
  type: SET_LAYERS_LEADING,
  payload
});

export const setLayerFontWeight = (payload: SetLayerFontWeightPayload): LayerTypes => ({
  type: SET_LAYER_FONT_WEIGHT,
  payload
});

export const setLayersFontWeight = (payload: SetLayersFontWeightPayload): LayerTypes => ({
  type: SET_LAYERS_FONT_WEIGHT,
  payload
});

export const setLayerFontFamily = (payload: SetLayerFontFamilyPayload): LayerTypes => ({
  type: SET_LAYER_FONT_FAMILY,
  payload
});

export const setLayersFontFamily = (payload: SetLayersFontFamilyPayload): LayerTypes => ({
  type: SET_LAYERS_FONT_FAMILY,
  payload
});

export const setLayerJustification = (payload: SetLayerJustificationPayload): LayerTypes => ({
  type: SET_LAYER_JUSTIFICATION,
  payload
});

export const setLayersJustification = (payload: SetLayersJustificationPayload): LayerTypes => ({
  type: SET_LAYERS_JUSTIFICATION,
  payload
});

export const setLayerFill = (payload: SetLayerFillPayload): LayerTypes => ({
  type: SET_LAYER_FILL,
  payload
});

export const setLayerFillType = (payload: SetLayerFillTypePayload): LayerTypes => ({
  type: SET_LAYER_FILL_TYPE,
  payload
});

export const setLayersFillType = (payload: SetLayersFillTypePayload): LayerTypes => ({
  type: SET_LAYERS_FILL_TYPE,
  payload
});

export const setLayerUnderlyingMask = (payload: SetLayerUnderlyingMaskPayload): LayerTypes => ({
  type: SET_LAYER_UNDERLYING_MASK,
  payload
});

export const setLayersUnderlyingMask = (payload: SetLayersUnderlyingMaskPayload): LayerTypes => ({
  type: SET_LAYERS_UNDERLYING_MASK,
  payload
});

export const toggleLayerIgnoreUnderlyingMask = (payload: ToggleLayerIgnoreUnderlyingMaskPayload): LayerTypes => ({
  type: TOGGLE_LAYER_IGNORE_UNDERLYING_MASK,
  payload
});

export const toggleLayersIgnoreUnderlyingMask = (payload: ToggleLayersIgnoreUnderlyingMaskPayload): LayerTypes => ({
  type: TOGGLE_LAYERS_IGNORE_UNDERLYING_MASK,
  payload
});

export const toggleSelectionIgnoreUnderlyingMask = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].ignoreUnderlyingMask);
    if (mixed) {
      const disabled = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].ignoreUnderlyingMask);
      dispatch(toggleLayersIgnoreUnderlyingMask({layers: disabled}));
    } else {
      dispatch(toggleLayersIgnoreUnderlyingMask({layers: state.layer.present.selected}));
    }
  }
};

export const toggleLayerMask = (payload: ToggleLayerMaskPayload): LayerTypes => ({
  type: TOGGLE_LAYER_MASK,
  payload
});

export const toggleLayersMask = (payload: ToggleLayersMaskPayload): LayerTypes => ({
  type: TOGGLE_LAYERS_MASK,
  payload
});

export const setLayerMasked = (payload: SetLayerMaskedPayload): LayerTypes => ({
  type: SET_LAYER_MASKED,
  payload
});

export const setLayersMasked = (payload: SetLayersMaskedPayload): LayerTypes => ({
  type: SET_LAYERS_MASKED,
  payload
});

export const addLayersMask = (payload: AddLayersMaskPayload): LayerTypes => ({
  type: ADD_LAYERS_MASK,
  payload
});

export const addLayersMaskThunk = (payload: AddLayersMaskPayload) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      if (canMaskLayers(state.layer.present, payload.layers)) {
        if (payload.layers.length > 1) {
          const maskLayerItem = state.layer.present.byId[payload.layers[0]];
          dispatch(addGroupThunk({
            layer: {
              name: maskLayerItem.name
            },
            batch: true
          })).then((newGroup: Btwx.Group) => {
            dispatch(addLayersMask({...payload, group: newGroup}));
            resolve();
          });
        } else {
          dispatch(addLayersMask(payload));
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
};

export const addSelectionMaskThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      if (canMaskSelection(state.layer.present)) {
        if (state.layer.present.selected.length > 1) {
          // const maskLayerItem = state.layer.present.byId[state.layer.present.selected[0]];
          // dispatch(addGroupThunk({
          //   layer: {
          //     name: maskLayerItem.name
          //   },
          //   batch: true
          // })).then((newGroup: Btwx.Group) => {
          //   dispatch(addLayersMask({layers: state.layer.present.selected, group: newGroup}));
          //   resolve();
          // });
          dispatch(addLayersMask({layers: state.layer.present.selected}));
          resolve();
        } else {
          dispatch(addLayersMask({layers: state.layer.present.selected}));
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
};

export const toggleSelectedMaskThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => (state.layer.present.byId[id] as Btwx.Shape).mask);
    if (mixed) {
      const disabled = state.layer.present.selected.filter((id) => !(state.layer.present.byId[id] as Btwx.Shape).mask);
      dispatch(toggleLayersMask({layers: disabled}));
    } else {
      dispatch(toggleLayersMask({layers: state.layer.present.selected}));
    }
  }
};

export const removeLayersMask = (payload: RemoveLayersMaskPayload): LayerTypes => ({
  type: REMOVE_LAYERS_MASK,
  payload
});

export const alignLayersToLeft = (payload: AlignLayersToLeftPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_LEFT,
  payload
});

export const alignSelectedToLeftThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(alignLayersToLeft({layers: state.layer.present.selected}));
  }
};

export const alignLayersToRight = (payload: AlignLayersToRightPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_RIGHT,
  payload
});

export const alignSelectedToRightThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(alignLayersToRight({layers: state.layer.present.selected}));
  }
};

export const alignLayersToTop = (payload: AlignLayersToTopPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_TOP,
  payload
});


export const alignSelectedToTopThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(alignLayersToTop({layers: state.layer.present.selected}));
  }
};

export const alignLayersToBottom = (payload: AlignLayersToBottomPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_BOTTOM,
  payload
});

export const alignSelectedToBottomThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(alignLayersToBottom({layers: state.layer.present.selected}));
  }
};

export const alignLayersToCenter = (payload: AlignLayersToCenterPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_CENTER,
  payload
});

export const alignSelectedToCenterThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(alignLayersToCenter({layers: state.layer.present.selected}));
  }
};

export const alignLayersToMiddle = (payload: AlignLayersToMiddlePayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_MIDDLE,
  payload
});

export const alignSelectedToMiddleThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(alignLayersToMiddle({layers: state.layer.present.selected}));
  }
};

export const distributeLayersHorizontally = (payload: DistributeLayersHorizontallyPayload): LayerTypes => ({
  type: DISTRIBUTE_LAYERS_HORIZONTALLY,
  payload
});

export const distributeSelectedHorizontallyThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(distributeLayersHorizontally({layers: state.layer.present.selected}));
  }
};

export const distributeLayersVertically = (payload: DistributeLayersVerticallyPayload): LayerTypes => ({
  type: DISTRIBUTE_LAYERS_VERTICALLY,
  payload
});

export const distributeSelectedVerticallyThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(distributeLayersVertically({layers: state.layer.present.selected}));
  }
};

export const duplicateLayer = (payload: DuplicateLayerPayload): LayerTypes => ({
  type: DUPLICATE_LAYER,
  payload
});

export const duplicateLayers = (payload: DuplicateLayersPayload): LayerTypes => ({
  type: DUPLICATE_LAYERS,
  payload
});

export const removeDuplicatedLayers = (payload: RemoveDuplicatedLayersPayload): LayerTypes => ({
  type: REMOVE_DUPLICATED_LAYERS,
  payload
});

export const bringLayerForward = (payload: BringLayerForwardPayload): LayerTypes => ({
  type: BRING_LAYER_FORWARD,
  payload
});

export const bringLayersForward = (payload: BringLayersForwardPayload): LayerTypes => ({
  type: BRING_LAYERS_FORWARD,
  payload
});

export const bringSelectedForwardThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(bringLayersForward({layers: state.layer.present.selected}));
  }
};

export const bringLayerToFront = (payload: BringLayerToFrontPayload): LayerTypes => ({
  type: BRING_LAYER_TO_FRONT,
  payload
});

export const bringLayersToFront = (payload: BringLayersToFrontPayload): LayerTypes => ({
  type: BRING_LAYERS_TO_FRONT,
  payload
});

export const bringSelectedToFrontThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(bringLayersForward({layers: state.layer.present.selected}));
  }
};

export const sendLayerBackward = (payload: SendLayerBackwardPayload): LayerTypes => ({
  type: SEND_LAYER_BACKWARD,
  payload
});

export const sendLayersBackward = (payload: SendLayersBackwardPayload): LayerTypes => ({
  type: SEND_LAYERS_BACKWARD,
  payload
});

export const sendSelectedBackwardThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(sendLayersBackward({layers: state.layer.present.selected}));
  }
};

export const sendLayerToBack = (payload: SendLayerToBackPayload): LayerTypes => ({
  type: SEND_LAYER_TO_BACK,
  payload
});

export const sendLayersToBack = (payload: SendLayersToBackPayload): LayerTypes => ({
  type: SEND_LAYERS_TO_BACK,
  payload
});

export const sendSelectedToBackThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(sendLayersToBack({layers: state.layer.present.selected}));
  }
};

export const setLayerBlendMode = (payload: SetLayerBlendModePayload): LayerTypes => ({
  type: SET_LAYER_BLEND_MODE,
  payload
});

export const setLayersBlendMode = (payload: SetLayersBlendModePayload): LayerTypes => ({
  type: SET_LAYERS_BLEND_MODE,
  payload
});

export const uniteLayers = (payload: UniteLayersPayload): LayerTypes => ({
  type: UNITE_LAYERS,
  payload
});

export const intersectLayers = (payload: IntersectLayersPayload): LayerTypes => ({
  type: INTERSECT_LAYERS,
  payload
});

export const subtractLayers = (payload: SubtractLayersPayload): LayerTypes => ({
  type: SUBTRACT_LAYERS,
  payload
});

export const excludeLayers = (payload: ExcludeLayersPayload): LayerTypes => ({
  type: EXCLUDE_LAYERS,
  payload
});

export const divideLayers = (payload: DivideLayersPayload): LayerTypes => ({
  type: DIVIDE_LAYERS,
  payload
});

export const applyBooleanOperationThunk = (booleanOperation: Btwx.BooleanOperation) => {
  return (dispatch: any, getState: any): Promise<Btwx.Shape> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      const selected = state.layer.present.selected;
      const topLayer = selected[0];
      const layerItem = state.layer.present.byId[topLayer];
      let booleanLayers = getPaperLayer(topLayer) as paper.Path | paper.CompoundPath;
      for (let i = 1; i < selected.length; i++) {
        booleanLayers = booleanLayers[booleanOperation](getPaperLayer(selected[i]) as paper.Path | paper.CompoundPath, { insert: false }) as paper.Path | paper.CompoundPath;
      }
      dispatch(addShapeThunk({
        layer: {
          shapeType: 'Custom',
          name: 'Combined Shape',
          pathData: booleanLayers.pathData,
          parent: layerItem.parent,
          closed: true,
          frame: {
            x: booleanLayers.position.x,
            y: booleanLayers.position.y,
            width: booleanLayers.bounds.width,
            height: booleanLayers.bounds.height,
            innerWidth: booleanLayers.bounds.width,
            innerHeight: booleanLayers.bounds.height
          },
          style: layerItem.style
        },
        batch: true
      })).then((newShape: Btwx.Shape) => {
        switch(booleanOperation) {
          case 'divide':
            dispatch(divideLayers({
              layers: selected,
              booleanLayer: newShape.id
            }));
            break;
          case 'exclude':
            dispatch(excludeLayers({
              layers: selected,
              booleanLayer: newShape.id
            }));
            break;
          case 'intersect':
            dispatch(intersectLayers({
              layers: selected,
              booleanLayer: newShape.id
            }));
            break;
          case 'subtract':
            dispatch(subtractLayers({
              layers: selected,
              booleanLayer: newShape.id
            }));
            break;
          case 'unite':
            dispatch(uniteLayers({
              layers: selected,
              booleanLayer: newShape.id
            }));
            break;
        }
        resolve(newShape);
      });
    });
  }
};

export const setRoundedRadius = (payload: SetRoundedRadiusPayload): LayerTypes => ({
  type: SET_ROUNDED_RADIUS,
  payload
});

export const setRoundedRadii = (payload: SetRoundedRadiiPayload): LayerTypes => ({
  type: SET_ROUNDED_RADII,
  payload
});

export const setPolygonSides = (payload: SetPolygonSidesPayload): LayerTypes => ({
  type: SET_POLYGON_SIDES,
  payload
});

export const setPolygonsSides = (payload: SetPolygonsSidesPayload): LayerTypes => ({
  type: SET_POLYGONS_SIDES,
  payload
});

export const setStarPoints = (payload: SetStarPointsPayload): LayerTypes => ({
  type: SET_STAR_POINTS,
  payload
});

export const setStarsPoints = (payload: SetStarsPointsPayload): LayerTypes => ({
  type: SET_STARS_POINTS,
  payload
});

export const setStarRadius = (payload: SetStarRadiusPayload): LayerTypes => ({
  type: SET_STAR_RADIUS,
  payload
});

export const setStarsRadius = (payload: SetStarsRadiusPayload): LayerTypes => ({
  type: SET_STARS_RADIUS,
  payload
});

export const setLineFromX = (payload: SetLineFromXPayload): LayerTypes => ({
  type: SET_LINE_FROM_X,
  payload
});

export const setLinesFromX = (payload: SetLinesFromXPayload): LayerTypes => ({
  type: SET_LINES_FROM_X,
  payload
});

export const setLineFromY = (payload: SetLineFromYPayload): LayerTypes => ({
  type: SET_LINE_FROM_Y,
  payload
});

export const setLinesFromY = (payload: SetLinesFromYPayload): LayerTypes => ({
  type: SET_LINES_FROM_Y,
  payload
});

export const setLineFrom = (payload: SetLineFromPayload): LayerTypes => ({
  type: SET_LINE_FROM,
  payload
});

export const setLineToX = (payload: SetLineToXPayload): LayerTypes => ({
  type: SET_LINE_TO_X,
  payload
});

export const setLinesToX = (payload: SetLinesToXPayload): LayerTypes => ({
  type: SET_LINES_TO_X,
  payload
});

export const setLineToY = (payload: SetLineToYPayload): LayerTypes => ({
  type: SET_LINE_TO_Y,
  payload
});

export const setLinesToY = (payload: SetLinesToYPayload): LayerTypes => ({
  type: SET_LINES_TO_Y,
  payload
});

export const setLineTo = (payload: SetLineToPayload): LayerTypes => ({
  type: SET_LINE_TO,
  payload
});

export const setLayerEdit = (payload: SetLayerEditPayload): LayerTypes => ({
  type: SET_LAYER_EDIT,
  payload: {
    ...payload,
    edit: uuidv4()
  }
});

export const setLayerStyle = (payload: SetLayerStylePayload): LayerTypes => ({
  type: SET_LAYER_STYLE,
  payload
});

export const setLayersStyle = (payload: SetLayersStylePayload): LayerTypes => ({
  type: SET_LAYERS_STYLE,
  payload
});

export const copyLayersThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
      const layers = state.layer.present.selected.reduce((result, current) => {
        const layerAndDescendants = getLayerAndDescendants(state.layer.present, current);
        const imageLayers = layerAndDescendants.filter(id => state.layer.present.byId[id].type === 'Image');
        const imageBuffers = imageLayers.reduce((bufferResult, bufferCurrent) => {
          const imageId = (state.layer.present.byId[bufferCurrent] as Btwx.Image).imageId;
          if (!Object.keys(bufferResult).includes(imageId)) {
            bufferResult[imageId] = state.documentSettings.images.byId[imageId];
          }
          return bufferResult;
        }, {} as { [id: string]: Btwx.DocumentImage });
        result.images = { ...result.images, ...imageBuffers };
        result.main = [...result.main, current];
        result.allIds = [...result.allIds, ...layerAndDescendants];
        result.byId = layerAndDescendants.reduce((lr, cr) => {
          lr = {
            ...lr,
            [cr]: {
              ...state.layer.present.byId[cr],
              parent: result.main.includes(cr) ? 'page' : state.layer.present.byId[cr].parent,
              tweenEvents: [],
              tweens: [],
              children: ((): string[] => {
                const layerItem = state.layer.present.byId[cr];
                const hasChildren = layerItem.type === 'Artboard' || layerItem.type === 'Group';
                return hasChildren ? [] : null;
              })()
            }
          }
          return lr;
        }, result.byId);
        return result;
      }, { type: 'layers', main: [], allIds: [], byId: {}, images: {} } as Btwx.ClipboardLayers);
      clipboard.writeText(JSON.stringify(layers));
    }
  }
};

export const copyStyleThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length === 1) {
      const layerItem = state.layer.present.byId[state.layer.present.selected[0]];
      const style = layerItem.style;
      const textStyle = layerItem.type === 'Text' ? layerItem.textStyle : null;
      clipboard.writeText(JSON.stringify({
        type: 'style',
        style,
        textStyle
      }));
    }
  }
};

export const copySVGThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
      const group = new paperMain.Group({insert: false});
      state.layer.present.selected.forEach((id) => {
        const paperLayer = getPaperLayer(id);
        const clone = paperLayer.clone({insert: false});
        clone.parent = group;
      });
      const svg = group.exportSVG({asString: true}) as string;
      clipboard.writeText(`<svg>${svg}</svg>`);
    }
  }
};

export const pasteStyleThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
      try {
        const text = clipboard.readText();
        const parsedText: Btwx.ClipboardStyle = JSON.parse(text);
        if (parsedText.type && parsedText.type === 'style') {
          dispatch(setLayersStyle({layers: state.layer.present.selected, style: parsedText.style, textStyle: parsedText.textStyle}));
        }
      } catch(error) {
        return;
      }
    }
  }
};

export const pasteSVGThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && canPasteSVG()) {
      const clipboardText = clipboard.readText();
      const svg = paperMain.project.importSVG(clipboardText, {insert: false});
      console.log(svg);
    }
  }
};

export const pasteLayersThunk = (props?: { overSelection?: boolean; overPoint?: Btwx.Point; overLayer?: string }) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const { overSelection, overPoint, overLayer } = props;
      const state = getState() as RootState;
      if (state.canvasSettings.focusing) {
        try {
          const text = clipboard.readText();
          const parsedText: Btwx.ClipboardLayers = JSON.parse(text);
          if (parsedText.type && (parsedText.type === 'layers' || parsedText.type === 'sketch-layers')) {
            const replaceAll = (str: string, find: string, replace: string) => {
              return str.replace(new RegExp(find, 'g'), replace);
            };
            const withNewIds: string = parsedText.allIds.reduce((result: string, current: string) => {
              const newId = uuidv4();
              result = replaceAll(result, current, newId);
              return result;
            }, text);
            const newParse: Btwx.ClipboardLayers = JSON.parse(withNewIds);
            const newLayers: Btwx.Layer[] = Object.keys(newParse.byId).reduce((result, current) => {
              result = [...result, newParse.byId[current]];
              return result;
            }, []);
            const mainLayers = newLayers.filter(layerItem => newParse.main.includes(layerItem.id));
            const clipboardPosition = getClipboardCenter(mainLayers);
            // handle if clipboard position is not within viewport
            if (!clipboardPosition.isInside(paperMain.view.bounds)) {
              const pointDiff = paperMain.view.center.subtract(clipboardPosition);
              newLayers.forEach((layerItem) => {
                layerItem.frame.x += pointDiff.x;
                layerItem.frame.y += pointDiff.y;
              });
            }
            // handle paste over selection
            if (overSelection && state.layer.present.selected.length > 0) {
              const singleSelection = state.layer.present.selected.length === 1;
              const overSelectionItem = state.layer.present.byId[state.layer.present.selected[0]];
              const selectionPosition = getSelectionCenter();
              const pointDiff = selectionPosition.subtract(clipboardPosition);
              newLayers.forEach((layerItem) => {
                if (singleSelection && newParse.main.includes(layerItem.id) && layerItem.type !== 'Artboard') {
                  if (overSelectionItem.type === 'Group' || overSelectionItem.type === 'Artboard' || overSelectionItem.type === 'Page') {
                    layerItem.parent = overSelectionItem.id;
                  } else {
                    layerItem.parent = overSelectionItem.parent;
                  }
                }
                layerItem.frame.x += pointDiff.x;
                layerItem.frame.y += pointDiff.y;
              });
            }
            // handle paste at point
            if (overPoint && !overLayer) {
              const paperPoint = new paperMain.Point(overPoint.x, overPoint.y);
              const pointDiff = paperPoint.subtract(clipboardPosition);
              newLayers.forEach((layerItem) => {
                layerItem.frame.x += pointDiff.x;
                layerItem.frame.y += pointDiff.y;
              });
            }
            // handle paste over layer
            if (overLayer && !overPoint) {
              const overLayerItem = state.layer.present.byId[overLayer];
              const paperPoint = getPaperLayer(overLayer) as paper.Item;
              const pointDiff = paperPoint.position.subtract(clipboardPosition);
              newLayers.forEach((layerItem) => {
                if (newParse.main.includes(layerItem.id) && layerItem.type !== 'Artboard') {
                  if (overLayerItem.type === 'Group' || overLayerItem.type === 'Artboard' || overLayerItem.type === 'Page') {
                    layerItem.parent = overLayerItem.id;
                  } else {
                    layerItem.parent = overLayerItem.parent;
                  }
                }
                layerItem.frame.x += pointDiff.x;
                layerItem.frame.y += pointDiff.y;
              });
            }
            // handle paste over layer and over point
            if (overPoint && overLayer) {
              const overLayerItem = state.layer.present.byId[overLayer];
              const paperPoint = new paperMain.Point(overPoint.x, overPoint.y);
              const pointDiff = paperPoint.subtract(clipboardPosition);
              newLayers.forEach((layerItem) => {
                if (newParse.main.includes(layerItem.id) && layerItem.type !== 'Artboard') {
                  if (overLayerItem.type === 'Group' || overLayerItem.type === 'Artboard' || overLayerItem.type === 'Page') {
                    layerItem.parent = overLayerItem.id;
                  } else {
                    layerItem.parent = overLayerItem.parent;
                  }
                }
                layerItem.frame.x += pointDiff.x;
                layerItem.frame.y += pointDiff.y;
              });
            }
            dispatch(addLayersThunk({layers: newLayers, buffers: newParse.images}) as any).then(() => {
              dispatch(selectLayers({layers: newParse.main, newSelection: true}));
              resolve();
            });
          }
        } catch(error) {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
};

const updateEditors = (dispatch: any, state: RootState, type: 'redo' | 'undo') => {
  if (state.colorEditor.isOpen) {
    // const layerItem = state.layer.present.byId[state.colorEditor.layer];
    const layerItems = state.colorEditor.layers.reduce((result, current) => {
      return [...result, state.layer.present.byId[current]];
    }, []);
    // const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.colorEditor.layer] : state.layer.future[0].byId[state.colorEditor.layer];
    const prevLayerItems = type === 'redo' ? state.colorEditor.layers.reduce((result, current) => {
      return [...result, state.layer.past[state.layer.past.length - 1].byId[current]];
    }, []) : state.colorEditor.layers.reduce((result, current) => {
      return [...result, state.layer.future[0].byId[current]];
    }, []);
    // check if items exist and matches selection
    if (layerItems.every((id) => id) && prevLayerItems.every((id) => id) && state.layer.present.selected.every((id, index) => state.layer.present.selected[index] === state.colorEditor.layers[index])) {
      const style = layerItems[0].style[state.colorEditor.prop];
      const prevStyle = prevLayerItems[0].style[state.colorEditor.prop];
      // check if fill types match
      if (style.fillType === prevStyle.fillType) {
        // check if prev action creator was for color
        if (colorsMatch(style.color, prevStyle.color)) {
          dispatch(closeColorEditor());
        }
      } else {
        // if fill types dont match, open relevant editor
        switch(style.fillType) {
          case 'gradient': {
            dispatch(closeColorEditor());
            dispatch(openGradientEditor({layers: state.colorEditor.layers, x: state.colorEditor.x, y: state.colorEditor.y, prop: state.colorEditor.prop}));
          }
        }
      }
    } else {
      dispatch(closeColorEditor());
    }
  }
  if (state.gradientEditor.isOpen) {
    // const layerItem = state.layer.present.byId[state.gradientEditor.layer];
    const layerItems = state.gradientEditor.layers.reduce((result, current) => {
      return [...result, state.layer.present.byId[current]];
    }, []);
    // const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.gradientEditor.layer] : state.layer.future[0].byId[state.gradientEditor.layer];
    const prevLayerItems = type === 'redo' ? state.gradientEditor.layers.reduce((result, current) => {
      return [...result, state.layer.past[state.layer.past.length - 1].byId[current]];
    }, []) : state.gradientEditor.layers.reduce((result, current) => {
      return [...result, state.layer.future[0].byId[current]];
    }, []);
    // check if items exist and matches selection
    if (layerItems.every((id) => id) && prevLayerItems.every((id) => id) && state.layer.present.selected.every((id, index) => state.layer.present.selected[index] === state.gradientEditor.layers[index])) {
      const style = layerItems[0].style[state.gradientEditor.prop];
      const prevStyle = prevLayerItems[0].style[state.gradientEditor.prop];
      // check if fill types match
      if (style.fillType === prevStyle.fillType) {
        updateGradientFrame(layerItems[0], (style as Btwx.Fill | Btwx.Stroke).gradient, state.viewSettings.theme);
        // check if prev action creator was for gradient
        if (gradientsMatch((style as Btwx.Fill | Btwx.Stroke).gradient, (prevStyle as Btwx.Fill | Btwx.Stroke).gradient)) {
          dispatch(closeGradientEditor());
        }
      } else {
        // if fill types dont match, open relevant editor
        switch(style.fillType) {
          case 'color': {
            dispatch(closeGradientEditor());
            dispatch(openColorEditor({layers: state.gradientEditor.layers, x: state.gradientEditor.x, y: state.gradientEditor.y, prop: state.gradientEditor.prop}));
            break;
          }
        }
      }
    } else {
      dispatch(closeGradientEditor());
    }
  }
};

export const undoThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.layer.past.length > 0) {
      const layerState = state.layer.past[state.layer.past.length - 1];
      const fullState = {...state, layer: { ...state.layer, present: layerState }};
      // remove hover
      dispatch(setLayerHover({id: null}));
      // undo
      dispatch(ActionCreators.undo());
      // import past paper project
      importPaperProject({
        paperProject: layerState.paperProject,
        documentImages: state.documentSettings.images.byId
      });
      // update editors
      updateEditors(dispatch, state, 'undo');
      // update frames
      if (!state.gradientEditor.isOpen) {
        updateHoverFrame();
        updateSelectionFrame();
      }
      updateActiveArtboardFrame();
      if (state.viewSettings.tweenDrawer.isOpen && layerState.allTweenEventIds.length > 0) {
        updateTweenEventsFrame(fullState);
      }
    }
  }
};

export const redoThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.layer.future.length > 0) {
      const layerState = state.layer.future[0];
      const fullState = {...state, layer: { ...state.layer, present: layerState }};
      // remove hover
      dispatch(setLayerHover({id: null}));
      // redo
      dispatch(ActionCreators.redo());
      // import future paper project
      importPaperProject({
        paperProject: layerState.paperProject,
        documentImages: state.documentSettings.images.byId
      });
      // update editors
      updateEditors(dispatch, state, 'redo');
      // update frames
      if (!state.gradientEditor.isOpen) {
        updateHoverFrame();
        updateSelectionFrame();
      }
      updateActiveArtboardFrame();
      if (state.viewSettings.tweenDrawer.isOpen && layerState.allTweenEventIds.length > 0) {
        updateTweenEventsFrame(fullState);
      }
    }
  }
};

export const updateActiveArtboardFrame = () => {
  const activeArtboardFrame = paperMain.project.getItem({ data: { id: 'ActiveArtboardFrame' } });
  const activeArtboardPaperLayer = paperMain.project.getItem({ data: { activeArtboard: true } });
  if (activeArtboardFrame) {
    activeArtboardFrame.remove();
  }
  if (activeArtboardPaperLayer) {
    const topLeft = activeArtboardPaperLayer.bounds.topLeft;
    const bottomRight = activeArtboardPaperLayer.bounds.bottomRight;
    new paperMain.Path.Rectangle({
      from: new paperMain.Point(topLeft.x - (2 / paperMain.view.zoom), topLeft.y - (2 / paperMain.view.zoom)),
      to: new paperMain.Point(bottomRight.x + (2 / paperMain.view.zoom), bottomRight.y + (2 / paperMain.view.zoom)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 4 / paperMain.view.zoom,
      data: {
        id: 'ActiveArtboardFrame',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: 'ActiveArtboardFrame'
      }
    });
  }
};

export const updateHoverFrame = () => {
  const hoverFrame = paperMain.project.getItem({ data: { id: 'HoverFrame' } });
  const hoverFrameConstants = {
    strokeColor: THEME_PRIMARY_COLOR,
    strokeWidth: 2 / paperMain.view.zoom,
    data: { id: 'HoverFrame', type: 'UIElement', interactive: false }
  }
  const hoverPaperLayer = paperMain.project.getItem({ data: { hover: true } });
  if (hoverFrame) {
    hoverFrame.remove();
  }
  if (hoverPaperLayer) {
    let nextHoverFrame: paper.Item;
    switch(hoverPaperLayer.data.layerType) {
      case 'Shape':
        nextHoverFrame = new paperMain.CompoundPath({
          ...hoverFrameConstants,
          closed: hoverPaperLayer.data.shapeType !== 'Line',
          pathData: (hoverPaperLayer as paper.Path | paper.CompoundPath).pathData
        });
        break;
      case 'Text': {
        const textLayer = hoverPaperLayer.getItem({data: { id: 'TextContent' }});
        nextHoverFrame = new paperMain.Group({
          data: { id: 'HoverFrame', type: 'UIElement', interactive: false }
        });
        const initialPoint = (textLayer as paper.PointText).point;
        (textLayer as any)._lines.forEach((line: any, index: number) => {
          new paperMain.Path.Line({
            from: new paperMain.Point(initialPoint.x, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
            to: new paperMain.Point(initialPoint.x + textLayer.bounds.width, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
            strokeColor: THEME_PRIMARY_COLOR,
            strokeWidth: 2 / paperMain.view.zoom,
            data: {
              type: 'UIElementChild',
              interactive: false,
              interactiveType: null,
              elementId: 'HoverFrame'
            },
            parent: nextHoverFrame
          });
        });
        break;
      }
      default:
        nextHoverFrame = new paperMain.Path.Rectangle({
          ...hoverFrameConstants,
          from: hoverPaperLayer.bounds.topLeft,
          to: hoverPaperLayer.bounds.bottomRight
        });
        break;
    }
    if (getPaperLayer('SelectionFrame')) {
      const selectionFrame = getPaperLayer('SelectionFrame');
      nextHoverFrame.insertBelow(selectionFrame);
    }
  }
};

export const updateSelectionFrame = (visibleHandle: Btwx.SelectionFrameHandle = 'all'): void => {
  const selectionFrame = paperMain.project.getItem({ data: { id: 'SelectionFrame' } });
  if (selectionFrame) {
    selectionFrame.remove();
  }
  const selected = paperMain.project.getItems({ data: { selected: true } });
  const linesSelected = paperMain.project.getItems({ data: { selected: true, shapeType: 'Line' } });
  if (selected.length > 0) {
    const resizeDisabled = false;
    const selectionTopLeft =  getSelectionTopLeft(selected);
    const selectionBottomRight = getSelectionBottomRight(selected);
    const baseProps = {
      point: selectionTopLeft,
      size: [8, 8],
      fillColor: '#fff',
      strokeColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.24 },
      strokeWidth: 1 / paperMain.view.zoom,
      shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.5 },
      shadowBlur: 1 / paperMain.view.zoom,
      insert: false,
      opacity: resizeDisabled ? 1 : 1
    }
    // Line selection frame
    if (selected.length === 1 && linesSelected.length > 0) {
      const paperLayer = selected[0] as paper.Path;
      const moveHandle = new paperMain.Path.Ellipse({
        ...baseProps,
        opacity: 1,
        visible: visibleHandle === 'all' || visibleHandle === 'move',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'move',
          elementId: 'SelectionFrame'
        }
      });
      moveHandle.position = paperLayer.bounds.center;
      moveHandle.scaling.x = 1 / paperMain.view.zoom;
      moveHandle.scaling.y = 1 / paperMain.view.zoom;
      const fromHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'from',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'from',
          elementId: 'SelectionFrame'
        }
      });
      fromHandle.position = paperLayer.firstSegment.point;
      fromHandle.scaling.x = 1 / paperMain.view.zoom;
      fromHandle.scaling.y = 1 / paperMain.view.zoom;
      const toHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'to',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'to',
          elementId: 'SelectionFrame'
        }
      });
      toHandle.position = paperLayer.lastSegment.point;
      toHandle.scaling.x = 1 / paperMain.view.zoom;
      toHandle.scaling.y = 1 / paperMain.view.zoom;
      new paperMain.Group({
        children: [fromHandle, moveHandle, toHandle],
        data: {
          id: 'SelectionFrame',
          type: 'UIElement',
          interactive: false,
          interactiveType: null,
          elementId: 'SelectionFrame'
        }
      });
    }
    // All other selection frames
    else {
      const baseFrameOverlay = new paperMain.Path.Rectangle({
        from: selectionTopLeft,
        to: selectionBottomRight,
        strokeColor: '#fff',
        strokeWidth: 1 / paperMain.view.zoom,
        blendMode: 'multiply',
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'SelectionFrame'
        }
      });
      const baseFrameDifference = new paperMain.Path.Rectangle({
        from: selectionTopLeft,
        to: selectionBottomRight,
        strokeColor: '#999',
        strokeWidth: 1 / paperMain.view.zoom,
        blendMode: 'difference',
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'SelectionFrame'
        }
      });
      const baseFrame = new paperMain.Group({
        opacity: 0.33,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'SelectionFrame'
        },
        children: [baseFrameDifference, baseFrameOverlay]
      });
      const moveHandle = new paperMain.Path.Ellipse({
        ...baseProps,
        opacity: 1,
        visible: visibleHandle === 'all' || visibleHandle === 'move',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'move',
          elementId: 'SelectionFrame'
        }
      });
      moveHandle.position = new paperMain.Point(baseFrame.bounds.topCenter.x, baseFrame.bounds.topCenter.y - ((1 / paperMain.view.zoom) * 24));
      moveHandle.scaling.x = 1 / paperMain.view.zoom;
      moveHandle.scaling.y = 1 / paperMain.view.zoom;
      const topLeftHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'topLeft',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'topLeft',
          elementId: 'SelectionFrame'
        }
      });
      topLeftHandle.position = baseFrame.bounds.topLeft;
      topLeftHandle.scaling.x = 1 / paperMain.view.zoom;
      topLeftHandle.scaling.y = 1 / paperMain.view.zoom;
      const topCenterHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'topCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'topCenter',
          elementId: 'SelectionFrame'
        }
      });
      topCenterHandle.position = baseFrame.bounds.topCenter;
      topCenterHandle.scaling.x = 1 / paperMain.view.zoom;
      topCenterHandle.scaling.y = 1 / paperMain.view.zoom;
      const topRightHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'topRight',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'topRight',
          elementId: 'SelectionFrame'
        }
      });
      topRightHandle.position = baseFrame.bounds.topRight;
      topRightHandle.scaling.x = 1 / paperMain.view.zoom;
      topRightHandle.scaling.y = 1 / paperMain.view.zoom;
      const bottomLeftHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'bottomLeft',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'bottomLeft',
          elementId: 'SelectionFrame'
        }
      });
      bottomLeftHandle.position = baseFrame.bounds.bottomLeft;
      bottomLeftHandle.scaling.x = 1 / paperMain.view.zoom;
      bottomLeftHandle.scaling.y = 1 / paperMain.view.zoom;
      const bottomCenterHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'bottomCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'bottomCenter',
          elementId: 'SelectionFrame'
        }
      });
      bottomCenterHandle.position = baseFrame.bounds.bottomCenter;
      bottomCenterHandle.scaling.x = 1 / paperMain.view.zoom;
      bottomCenterHandle.scaling.y = 1 / paperMain.view.zoom;
      const bottomRightHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'bottomRight',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'bottomRight',
          elementId: 'SelectionFrame'
        }
      });
      bottomRightHandle.position = baseFrame.bounds.bottomRight;
      bottomRightHandle.scaling.x = 1 / paperMain.view.zoom;
      bottomRightHandle.scaling.y = 1 / paperMain.view.zoom;
      const rightCenterHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'rightCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'rightCenter',
          elementId: 'SelectionFrame'
        }
      });
      rightCenterHandle.position = baseFrame.bounds.rightCenter;
      rightCenterHandle.scaling.x = 1 / paperMain.view.zoom;
      rightCenterHandle.scaling.y = 1 / paperMain.view.zoom;
      const leftCenterHandle = new paperMain.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'leftCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'leftCenter',
          elementId: 'SelectionFrame'
        }
      });
      leftCenterHandle.position = baseFrame.bounds.leftCenter;
      leftCenterHandle.scaling.x = 1 / paperMain.view.zoom;
      leftCenterHandle.scaling.y = 1 / paperMain.view.zoom;
      new paperMain.Group({
        children: [baseFrame, moveHandle, topLeftHandle, topCenterHandle, topRightHandle, bottomLeftHandle, bottomCenterHandle, bottomRightHandle, leftCenterHandle, rightCenterHandle],
        data: {
          id: 'SelectionFrame',
          type: 'UIElement',
          interactive: false,
          interactiveType: null,
          elementId: 'SelectionFrame'
        }
      });
    }
  }
};

export const updateTweenEventsFrame = (state: RootState) => {
  const tweenEventsFrame = paperMain.project.getItem({ data: { id: 'TweenEventsFrame' } });
  const events = getTweenEventsFrameItems(state).tweenEventItems;
  if (tweenEventsFrame) {
    tweenEventsFrame.remove();
  }
  if (events) {
    const theme = getTheme(state.viewSettings.theme);
    const tweenEventsFrame = new paperMain.Group({
      data: {
        id: 'TweenEventsFrame',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: 'TweenEventsFrame'
      }
    });
    events.forEach((event, index) => {
      const eventLayerItem = state.layer.present.byId[event.layer];
      const groupOpacity = state.layer.present.hover ? state.layer.present.hover === event.id ? 1 : 0.25 : 1;
      const elementColor = event.artboard === state.layer.present.activeArtboard ? THEME_PRIMARY_COLOR : theme.text.lighter;
      const artboardTopTop = getArtboardsTopTop(state.layer.present);
      const origin = state.layer.present.byId[event.artboard];
      const destination = state.layer.present.byId[event.destinationArtboard];
      const tweenEventDestinationIndicator = new paperMain.Path.Ellipse({
        center: new paperMain.Point(destination.frame.x, artboardTopTop - ((1 / paperMain.view.zoom) * 48)),
        radius: ((1 / paperMain.view.zoom) * 4),
        fillColor: elementColor,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'TweenEventsFrame'
        }
      });
      const tweenEventOriginIndicator = new paperMain.Path.Ellipse({
        center: new paperMain.Point(origin.frame.x, artboardTopTop - ((1 / paperMain.view.zoom) * 48)),
        radius: ((1 / paperMain.view.zoom) * 10),
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'TweenEventsFrame'
        }
      });
      const tweenEventIconBackground = new paperMain.Path.Ellipse({
        center: tweenEventOriginIndicator.bounds.center,
        radius: ((1 / paperMain.view.zoom) * 14),
        fillColor: theme.background.z0,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'TweenEventsFrame'
        }
      });
      const tweenEventIcon = new paperMain.CompoundPath({
        pathData: (() => {
          switch(eventLayerItem.type) {
            case 'Artboard':
              return 'M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z';
            case 'Group':
              return 'M21,9 L21,20 L3,20 L3,9 L21,9 Z M9,4 C10.480515,4 11.7731656,4.80434324 12.4648015,5.99987956 L21,6 L21,8 L3,8 L3,4 L9,4 Z';
            case 'Shape':
              return eventLayerItem.pathData;
            case 'Text':
              return 'M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z';
            case 'Image':
              return state.viewSettings.theme === 'dark' ? 'M21,4 L21,20 L3,20 L3,4 L21,4 Z M20,5 L4,5 L4,14.916 L7.55555556,11 L12.7546667,16.728 L16,13.6703297 L20,17.44 L20,5 Z M16.6243657,6.71118154 C16.9538983,6.79336861 17.2674833,6.9606172 17.5297066,7.21384327 C18.3242674,7.98114172 18.3463679,9.24727881 17.5790695,10.0418396 C16.811771,10.8364004 15.5456339,10.8585009 14.7510731,10.0912025 C14.4888499,9.8379764 14.3107592,9.53041925 14.21741,9.2034121 C14.8874902,9.37067575 15.6260244,9.1851639 16.1403899,8.65252287 C16.6547553,8.11988184 16.8143797,7.37532327 16.6243657,6.71118154 Z' : 'M21,4 L21,20 L3,20 L3,4 L21,4 Z M20,5 L4,5 L4,14.916 L7.55555556,11 L12.7546667,16.728 L16,13.6703297 L20,17.44 L20,5 Z M16,7 C17.1045695,7 18,7.8954305 18,9 C18,10.1045695 17.1045695,11 16,11 C14.8954305,11 14,10.1045695 14,9 C14,7.8954305 14.8954305,7 16,7 Z';
          }
        })(),
        fillColor: elementColor,
        closed: true,
        fillRule: 'nonzero',
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'TweenEventsFrame'
        }
      });
      tweenEventIcon.fitBounds(tweenEventOriginIndicator.bounds);
      const tweenEventConnector = new paperMain.Path.Line({
        from: tweenEventOriginIndicator.bounds.center,
        to: tweenEventDestinationIndicator.bounds.center,
        strokeColor: elementColor,
        strokeWidth: 1 / paperMain.view.zoom,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'TweenEventsFrame'
        }
      });
      const tweenEventText = new paperMain.PointText({
        content: DEFAULT_TWEEN_EVENTS.find((tweenEvent) => event.event === tweenEvent.event).titleCase,
        point: new paperMain.Point(tweenEventConnector.bounds.center.x, tweenEventDestinationIndicator.bounds.top - ((1 / paperMain.view.zoom) * 12)),
        justification: 'center',
        fontSize: ((1 / paperMain.view.zoom) * 12),
        fillColor: elementColor,
        insert: false,
        fontFamily: 'Space Mono',
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'TweenEventsFrame'
        }
      });
      const tweenEventFrame = new paperMain.Group({
        children: [tweenEventConnector, tweenEventIconBackground, tweenEventIcon, tweenEventDestinationIndicator, tweenEventText],
        data: {
          id: 'TweenEventFrame',
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: 'TweenEventsFrame'
        },
        parent: tweenEventsFrame,
        opacity: groupOpacity,
        onMouseEnter: function() {
          document.body.style.cursor = 'pointer';
        },
        onMouseLeave: function() {
          document.body.style.cursor = 'auto';
        }
      });
      const tweenEventFrameBackground = new paperMain.Path.Rectangle({
        from: tweenEventFrame.bounds.topLeft,
        to: tweenEventFrame.bounds.bottomRight,
        fillColor: theme.background.z0,
        opacity: 0.01,
        parent: tweenEventFrame,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: 'TweenEventsFrame'
        }
      });
      tweenEventFrame.position.y -= (tweenEventFrame.bounds.height + ((1 / paperMain.view.zoom) * 12)) * index;
    });
  }
};

export const updateTweenEventsFrameThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    updateTweenEventsFrame(state);
  }
};

export const updateMeasureFrame = (guides: { top?: string; bottom?: string; left?: string; right?: string; all?: string }, bounds?: paper.Rectangle) => {
  const measureFrame = paperMain.project.getItem({ data: { id: 'MeasureFrame' } });
  const selected = paperMain.project.getItems({ data: { selected: true } });
  if (measureFrame) {
    measureFrame.remove();
  }
  if (selected.length > 0) {
    const selectionBounds = bounds ? bounds : getSelectionBounds();
    const measureFrameGuides = [];
    let hasTopMeasure;
    let hasBottomMeasure;
    let hasLeftMeasure;
    let hasRightMeasure;
    let topMeasureTo;
    let bottomMeasureTo;
    let leftMeasureTo;
    let rightMeasureTo;
    Object.keys(guides).forEach((current: 'top' | 'bottom' | 'left' | 'right' | 'all') => {
      const guideMeasureToId = guides[current] as any;
      const measureToBounds = getPaperLayer(guideMeasureToId).bounds;
      if (measureToBounds.contains(selectionBounds)) {
        switch(current) {
          case 'top':
            hasTopMeasure = true;
            topMeasureTo = measureToBounds.top;
            break;
          case 'bottom':
            hasBottomMeasure = true;
            bottomMeasureTo = measureToBounds.bottom;
            break;
          case 'left':
            hasLeftMeasure = true;
            leftMeasureTo = measureToBounds.left;
            break;
          case 'right':
            hasRightMeasure = true;
            rightMeasureTo = measureToBounds.right;
            break;
          case 'all':
            hasTopMeasure = true;
            hasBottomMeasure = true;
            hasLeftMeasure = true;
            hasRightMeasure = true;
            topMeasureTo = measureToBounds.top;
            bottomMeasureTo = measureToBounds.bottom;
            leftMeasureTo = measureToBounds.left;
            rightMeasureTo = measureToBounds.right;
            break;
        }
      } else {
        switch(current) {
          case 'top':
            hasTopMeasure = selectionBounds.top > measureToBounds.top;
            topMeasureTo = selectionBounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
            break;
          case 'bottom':
            hasBottomMeasure = selectionBounds.bottom < measureToBounds.bottom;
            bottomMeasureTo = selectionBounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
            break;
          case 'left':
            hasLeftMeasure = selectionBounds.left > measureToBounds.left;
            leftMeasureTo = selectionBounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
            break;
          case 'right':
            hasRightMeasure = selectionBounds.right < measureToBounds.right;
            rightMeasureTo = selectionBounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
            break;
          case 'all':
            hasTopMeasure = selectionBounds.top > measureToBounds.top;
            hasBottomMeasure = selectionBounds.bottom < measureToBounds.bottom;
            hasLeftMeasure = selectionBounds.left > measureToBounds.left;
            hasRightMeasure = selectionBounds.right < measureToBounds.right;
            topMeasureTo = selectionBounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
            bottomMeasureTo = selectionBounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
            leftMeasureTo = selectionBounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
            rightMeasureTo = selectionBounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
            break;
        }
      }
    });
    if (hasTopMeasure && (guides['all'] || guides['top'])) {
      const topMeasureFromPoint = selectionBounds.topCenter;
      const topMeasureToPoint = new paperMain.Point(topMeasureFromPoint.x, topMeasureTo);
      const measureGuide = new MeasureGuide(topMeasureFromPoint, topMeasureToPoint, 'top', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    if (hasBottomMeasure && (guides['all'] || guides['bottom'])) {
      const bottomMeasureFromPoint = selectionBounds.bottomCenter;
      const bottomMeasureToPoint = new paperMain.Point(bottomMeasureFromPoint.x, bottomMeasureTo);
      const measureGuide = new MeasureGuide(bottomMeasureFromPoint, bottomMeasureToPoint, 'bottom', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    if (hasLeftMeasure && (guides['all'] || guides['left'])) {
      const leftMeasureFromPoint = selectionBounds.leftCenter;
      const leftMeasureToPoint = new paperMain.Point(leftMeasureTo, leftMeasureFromPoint.y);
      const measureGuide = new MeasureGuide(leftMeasureFromPoint, leftMeasureToPoint, 'left', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    if (hasRightMeasure && (guides['all'] || guides['right'])) {
      const rightMeasureFromPoint = selectionBounds.rightCenter;
      const rightMeasureToPoint = new paperMain.Point(rightMeasureTo, rightMeasureFromPoint.y);
      const measureGuide = new MeasureGuide(rightMeasureFromPoint, rightMeasureToPoint, 'right', { down: true, up: true });
      if (measureGuide.distance > 0) {
        measureFrameGuides.push(measureGuide.paperLayer);
      }
    }
    new paperMain.Group({
      children: measureFrameGuides,
      data: {
        id: 'MeasureFrame',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: 'MeasureFrame'
      }
    });
  }
};