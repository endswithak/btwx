/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import replaceAll from 'string.prototype.replaceall';
import sharp from 'sharp';
import tinycolor from 'tinycolor2';
import { v4 as uuidv4 } from 'uuid';
import { ActionCreators } from 'redux-undo';
import { clipboard } from 'electron';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { uiPaperScope } from '../../canvas';
import paper from 'paper';
import MeasureGuide from '../../canvas/measureGuide';
import { ARTBOARDS_PER_PROJECT, DEFAULT_STYLE, DEFAULT_TRANSFORM, DEFAULT_ARTBOARD_BACKGROUND_COLOR, DEFAULT_TEXT_VALUE, THEME_PRIMARY_COLOR, DEFAULT_TWEEN_EVENTS, TWEEN_PROPS_MAP } from '../../constants';
import { getPaperFillColor, getPaperStrokeColor, getPaperShadowColor } from '../utils/paper';
import { getClipboardCenter, getLayerAndDescendants, getLayersBounds, colorsMatch, gradientsMatch, getNearestScopeAncestor, getArtboardEventItems, orderLayersByDepth, canMaskLayers, canMaskSelection, canPasteSVG, getLineToPoint, getLineFromPoint, getArtboardsTopTop, getSelectedBounds, getParentPaperLayer, getGradientOriginPoint, getGradientDestinationPoint, getPaperLayer, getSelectedPaperLayers, getItemLayers, getSelectedProjectIndices, getAbsolutePosition, getActiveArtboardBounds, getLayerBounds, importProjectJSON, getAllArtboardItems } from '../selectors/layer';
import { getLayerStyle, getLayerTransform, getLayerShapeOpts, getLayerFrame, getLayerPathData, getLayerTextStyle, getLayerMasked, getLayerUnderlyingMask } from '../utils/actions';

import { bufferToBase64, scrollToLayer } from '../../utils';
import { renderShapeGroup } from '../../canvas/sketch/utils/shapeGroup';
import getTheme from '../theme';

import { addDocumentImage } from './documentSettings';
import { setEventDrawerEventThunk } from './eventDrawer';
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
  RESET_IMAGE_DIMENSIONS,
  RESET_IMAGES_DIMENSIONS,
  REPLACE_IMAGE,
  REPLACE_IMAGES,
  PASTE_LAYERS_FROM_CLIPBOARD,
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
  SetLayersGradientODPayload,
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
  ResetImageDimensionsPayload,
  ResetImagesDimensionsPayload,
  ReplaceImagePayload,
  ReplaceImagesPayload,
  PasteLayersFromClipboardPayload,
  LayerTypes
} from '../actionTypes/layer';

import gradientEditor from '../reducers/gradientEditor';

// Artboard

export const addArtboard = (payload: AddArtboardPayload): LayerTypes => ({
  type: ADD_ARTBOARD,
  payload
});

export const addArtboardThunk = (payload: AddArtboardPayload, providedState?: RootState) => {
  return (dispatch: any, getState: any): Promise<Btwx.Artboard> => {
    const state = getState() as RootState; // providedState ? providedState : getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const name = payload.layer.name ? payload.layer.name : 'Artboard';
    const projectIndex = Math.floor((state.layer.present.childrenById.root.length) / ARTBOARDS_PER_PROJECT) + 1;
    const index = state.layer.present.childrenById.root.length;
    const style = getLayerStyle(payload, {}, { fill: { color: DEFAULT_ARTBOARD_BACKGROUND_COLOR } as Btwx.Fill, stroke: { enabled: false } as Btwx.Stroke, shadow: { enabled: false } as Btwx.Shadow });
    const frame = getLayerFrame(payload);
    const showChildren = payload.layer.showChildren ? payload.layer.showChildren : true;
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    // create background
    const artboardBackground = new uiPaperScope.Path.Rectangle({
      name: 'Artboard Background',
      from: new uiPaperScope.Point(frame.x - (frame.width / 2), frame.y - (frame.height / 2)),
      to: new uiPaperScope.Point(frame.x + (frame.width / 2), frame.y + (frame.height / 2)),
      data: { id: 'artboardBackground', type: 'LayerChild', layerType: 'Artboard' },
      fillColor: paperFillColor,
      shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.20 },
      shadowOffset: new uiPaperScope.Point(0, 2),
      shadowBlur: 10,
      insert: false
    });
    // create title
    // const artboardTitle = new uiPaperScope.PointText({
    //   point: artboardBackground.bounds.bottomLeft.add(new uiPaperScope.Point(0, 24 * (1 / uiPaperScope.view.zoom))),
    //   content: name,
    //   fillColor: '#999',
    //   fontSize: 12 * (1 / uiPaperScope.view.zoom),
    //   fontFamily: 'Space Mono'
    // });
    // create layers mask
    const artboardLayersMask = new uiPaperScope.Path.Rectangle({
      name: 'Artboard Layers Mask',
      from: new uiPaperScope.Point(frame.x - (frame.width / 2), frame.y - (frame.height / 2)),
      to: new uiPaperScope.Point(frame.x + (frame.width / 2), frame.y + (frame.height / 2)),
      data: { id: 'artboardLayersMask', type: 'LayerChild', layerType: 'Artboard' },
      fillColor: paperFillColor,
      clipMask: true
    });
    //
    const artboardLayers = new uiPaperScope.Group({
      name: 'Artboard Layers',
      data: { id: 'artboardLayers', type: 'LayerChild', layerType: 'Artboard' }
    });
    //
    const artboardMaskedLayers = new uiPaperScope.Group({
      name: 'Artboard Masked Layers',
      data: { id: 'artboardMaskedLayers', type: 'LayerChild', layerType: 'Artboard' },
      children: [artboardLayersMask, artboardLayers]
    });
    // create artboard group
    const artboard = new uiPaperScope.Group({
      name: name,
      data: { id: id, type: 'Layer', layerType: 'Artboard', scope: ['root'] },
      children: [artboardBackground, artboardMaskedLayers],
      insert: false
    });
    // dispatch action
    const newLayer = {
      type: 'Artboard',
      id: id,
      index: index,
      name: name,
      artboard: id,
      parent: 'root',
      children: [],
      scope: ['root'],
      projectIndex: projectIndex,
      frame: payload.layer.frame,
      showChildren: showChildren,
      selected: false,
      hover: false,
      events: [],
      originArtboardForEvents: [],
      destinationArtboardForEvents: [],
      tweens: {
        allIds: [],
        asOrigin: [],
        asDestination: [],
        byProp: TWEEN_PROPS_MAP
      },
      transform: DEFAULT_TRANSFORM,
      style: style,
      json: artboard.exportJSON()
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

export const addGroupThunk = (payload: AddGroupPayload, providedState?: RootState) => {
  return (dispatch: any, getState: any): Promise<Btwx.Group> => {
    const state = getState() as RootState // providedState ? providedState : getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const style = getLayerStyle(payload, {}, { fill: { enabled: false } as Btwx.Fill, stroke: { enabled: false } as Btwx.Stroke, shadow: { enabled: false } as Btwx.Shadow });
    const name = payload.layer.name ? payload.layer.name : 'Group';
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const artboardItem = state.layer.present.byId[artboard] as Btwx.Artboard;
    const index = artboardItem.children.length;
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const frame = payload.layer.frame ? payload.layer.frame : { x: 0, y: 0, width: 0, height: 0, innerWidth: 0, innerHeight: 0 };
    let position = new uiPaperScope.Point(frame.x, frame.y);
    if (artboard) {
      position = position.add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y))
    }
    const showChildren = payload.layer.showChildren ? payload.layer.showChildren : true;
    const group = new uiPaperScope.Group({
      name: name,
      data: { id: id, type: 'Layer', layerType: 'Group', scope: scope },
      parent: parentPaperLayer,
      position: position
    });
    const newLayer = {
      type: 'Group',
      id: id,
      index: index,
      name: name,
      artboard: artboard,
      parent: parent,
      children: [],
      scope: scope,
      frame: frame,
      underlyingMask: underlyingMask,
      ignoreUnderlyingMask: ignoreUnderlyingMask,
      masked: masked,
      showChildren: showChildren,
      selected: false,
      hover: false,
      events: [],
      tweens: {
        allIds: [],
        asOrigin: [],
        asDestination: [],
        byProp: TWEEN_PROPS_MAP
      },
      transform: DEFAULT_TRANSFORM,
      style: style
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

export const addShapeThunk = (payload: AddShapePayload, providedState?: RootState) => {
  return (dispatch: any, getState: any): Promise<Btwx.Shape> => {
    const state = getState() as RootState; // providedState ? providedState : getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const artboardItem = state.layer.present.byId[artboard] as Btwx.Artboard;
    const index = artboardItem.children.length;
    const shapeType = payload.layer.shapeType ? payload.layer.shapeType : 'Rectangle';
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const name = payload.layer.name ? payload.layer.name : shapeType;
    const frame = getLayerFrame(payload);
    let position = new uiPaperScope.Point(frame.x, frame.y);
    if (artboard) {
      position = position.add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y))
    }
    const shapeOpts = getLayerShapeOpts(payload);
    const pathData = getLayerPathData(payload);
    const style = getLayerStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new uiPaperScope.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as Btwx.PaperGradientFill : null;
    const mask = payload.layer.mask ? payload.layer.mask : false;
    const paperLayer = new uiPaperScope.CompoundPath({
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
      data: { id, type: 'Layer', layerType: 'Shape', shapeType: shapeType, scope: scope },
      parent: parentPaperLayer
    });
    paperLayer.children.forEach((item) => item.data = { id: 'shapePartial', type: 'LayerChild', layerType: 'Shape' });
    paperLayer.position = position;
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    if (mask) {
      const maskGroup = new uiPaperScope.Group({
        name: 'MaskGroup',
        data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
        children: [paperLayer.clone()]
      });
      paperLayer.replaceWith(maskGroup);
    }
    const newLayer = {
      type: 'Shape',
      id: id,
      index: index,
      name: name,
      artboard: artboard,
      parent: parent,
      children: null,
      scope: scope,
      frame: frame,
      underlyingMask: underlyingMask,
      ignoreUnderlyingMask: ignoreUnderlyingMask,
      masked: masked,
      showChildren: null,
      selected: false,
      hover: false,
      events: [],
      tweens: {
        allIds: [],
        asOrigin: [],
        asDestination: [],
        byProp: TWEEN_PROPS_MAP
      },
      transform: transform,
      style: style,
      closed: payload.layer.closed,
      mask: mask,
      shapeType: shapeType,
      pathData: pathData,
      ...shapeOpts
    } as Btwx.Shape;
    dispatch(addShape({
      layer: newLayer,
      batch: payload.batch
    }));
    return Promise.resolve(newLayer);
  }
};

export const addShapeGroupThunk = (payload: AddShapePayload, providedState?: RootState) => {
  return (dispatch: any, getState: any): Promise<Btwx.Shape> => {
    const state = getState() as RootState; // providedState ? providedState : getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const artboardItem = state.layer.present.byId[artboard] as Btwx.Artboard;
    const index = artboardItem.children.length;
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const shapeType = payload.layer.shapeType ? payload.layer.shapeType : 'Rectangle';
    const name = payload.layer.name ? payload.layer.name : shapeType;
    const frame = getLayerFrame(payload);
    let position = new uiPaperScope.Point(frame.x, frame.y);
    if (artboard) {
      position = position.add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y))
    }
    const shapeOpts = getLayerShapeOpts(payload);
    const style = getLayerStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new uiPaperScope.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as Btwx.PaperGradientFill : null;
    const mask = payload.layer.mask ? payload.layer.mask : false;
    const shapeContainer = renderShapeGroup((payload.layer as any).sketchLayer);
    const paperLayer = new uiPaperScope.CompoundPath({
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
      data: { id, type: 'Layer', layerType: 'Shape', shapeType: 'Custom', scope: scope },
      parent: parentPaperLayer
    });
    paperLayer.children.forEach((item) => item.data = { id: 'shapePartial', type: 'LayerChild', layerType: 'Shape' });
    paperLayer.position = position;
    // wonky fix to make sure gradient destination and origin are in correct place
    paperLayer.rotation = -transform.rotation;
    paperLayer.scale(transform.horizontalFlip ? -1 : 1, transform.verticalFlip ? -1 : 1);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    paperLayer.rotation = transform.rotation;
    paperLayer.scale(transform.horizontalFlip ? -1 : 1, transform.verticalFlip ? -1 : 1);
    //
    if (mask) {
      const maskGroup = new uiPaperScope.Group({
        name: 'MaskGroup',
        data: { id: 'maskGroup', type: 'LayerContainer', layerType: 'Shape' },
        children: [paperLayer.clone()]
      });
      paperLayer.replaceWith(maskGroup);
    }
    //
    const newLayer = {
      type: 'Shape',
      id: id,
      index: index,
      name: name,
      artboard: artboard,
      parent: parent,
      children: null,
      scope: scope,
      frame: frame,
      underlyingMask: underlyingMask,
      ignoreUnderlyingMask: ignoreUnderlyingMask,
      masked: masked,
      showChildren: null,
      selected: false,
      hover: false,
      events: [],
      tweens: {
        allIds: [],
        asOrigin: [],
        asDestination: [],
        byProp: TWEEN_PROPS_MAP
      },
      transform: transform,
      style: style,
      closed: true,
      mask: mask,
      shapeType: 'Custom',
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

export const addTextThunk = (payload: AddTextPayload, providedState?: RootState) => {
  return (dispatch: any, getState: any): Promise<Btwx.Text> => {
    const state = getState() as RootState; // providedState ? providedState : getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const textContent = payload.layer.text ? payload.layer.text : DEFAULT_TEXT_VALUE;
    const name = payload.layer.name ? payload.layer.name : textContent;
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const artboardItem = state.layer.present.byId[artboard] as Btwx.Artboard;
    const index = artboardItem.children.length;
    const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
    const style = getLayerStyle(payload);
    const textStyle = getLayerTextStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new uiPaperScope.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperLayer = new uiPaperScope.PointText({
      point: new uiPaperScope.Point(0, 0),
      content: textContent,
      data: { id: 'textContent', type: 'LayerChild', layerType: 'Text' },
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
    let position = new uiPaperScope.Point(frame.x, frame.y);
    if (artboard) {
      position = position.add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y))
    }
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as Btwx.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as Btwx.PaperGradientFill : null;
    paperLayer.position = new uiPaperScope.Point(frame.x, frame.y);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    const textBackground = new uiPaperScope.Path.Rectangle({
      from: new uiPaperScope.Point(frame.x - frame.width / 2, frame.y - frame.height / 2),
      to: new uiPaperScope.Point(frame.x + frame.width / 2, frame.y + frame.height / 2),
      fillColor: '#fff',
      opacity: 0,
      insert: false,
      data: { id: 'textBackground', type: 'LayerChild', layerType: 'Text' },
    });
    const textContainer = new uiPaperScope.Group({
      name: name,
      parent: parentPaperLayer,
      data: { id, type: 'Layer', layerType: 'Text', scope: scope },
      children: [textBackground, paperLayer],
      position: position
    });
    const newLayer = {
      type: 'Text',
      id: id,
      index: index,
      name: name,
      artboard: artboard,
      parent: parent,
      children: null,
      scope: scope,
      frame: frame,
      underlyingMask: underlyingMask,
      ignoreUnderlyingMask: ignoreUnderlyingMask,
      masked: masked,
      showChildren: null,
      selected: false,
      hover: false,
      events: [],
      tweens: {
        allIds: [],
        asOrigin: [],
        asDestination: [],
        byProp: TWEEN_PROPS_MAP
      },
      transform: transform,
      style: style,
      textStyle: textStyle,
      text: textContent
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

export const addImageThunk = (payload: AddImagePayload, providedState?: RootState) => {
  return (dispatch: any, getState: any): Promise<Btwx.Image> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState; // providedState ? providedState : getState() as RootState;
      const buffer = Buffer.from(payload.buffer);
      const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
      const parentItem = state.layer.present.byId[parent];
      const scope = [...parentItem.scope, parent];
      const artboard = scope[1];
      const artboardItem = state.layer.present.byId[artboard] as Btwx.Artboard;
      const index = artboardItem.children.length;
      const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
      const parentPaperLayer = getParentPaperLayer(state.layer.present, parent, ignoreUnderlyingMask);
      sharp(buffer).metadata().then(({ width, height }) => {
        sharp(buffer).resize(Math.round(width * 0.5)).webp({quality: 75}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
          const frame = getLayerFrame(payload);
          let position = new uiPaperScope.Point(frame.x, frame.y);
          if (artboard) {
            position = position.add(new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y))
          }
          const name = payload.layer.name ? payload.layer.name : 'Image';
          const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
          const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
          const newBuffer = Buffer.from(data);
          const exists = state.documentSettings.images.allIds.length > 0 && state.documentSettings.images.allIds.find((id) => Buffer.from(state.documentSettings.images.byId[id].buffer).equals(newBuffer));
          const base64 = bufferToBase64(newBuffer);
          const id = payload.layer.id ? payload.layer.id : uuidv4();
          const imageId = exists ? exists : payload.layer.imageId ? payload.layer.imageId : uuidv4();
          const style = getLayerStyle(payload, {}, { fill: { enabled: false } as Btwx.Fill, stroke: { enabled: false } as Btwx.Stroke });
          const transform = getLayerTransform(payload);
          const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as Btwx.Shadow) : null;
          const paperShadowOffset = style.shadow.enabled ? new uiPaperScope.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
          const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
          const paperLayer = new uiPaperScope.Raster(`data:image/webp;base64,${base64}`);
          const imageContainer = new uiPaperScope.Group({
            name: name,
            parent: parentPaperLayer,
            data: { id, imageId, type: 'Layer', layerType: 'Image', scope: scope },
            children: [paperLayer]
          });
          paperLayer.onLoad = (): void => {
            paperLayer.data = { id: 'raster', type: 'LayerChild', layerType: 'Image' };
            imageContainer.bounds.width = frame.innerWidth;
            imageContainer.bounds.height = frame.innerHeight;
            imageContainer.position = position;
            imageContainer.shadowColor = paperShadowColor;
            imageContainer.shadowOffset = paperShadowOffset;
            imageContainer.shadowBlur = paperShadowBlur;
            const newLayer = {
              type: 'Image',
              id: id,
              index: index,
              name: name,
              artboard: artboard,
              parent: parent,
              children: null,
              scope: scope,
              frame: frame,
              underlyingMask: underlyingMask,
              ignoreUnderlyingMask: ignoreUnderlyingMask,
              masked: masked,
              showChildren: null,
              selected: false,
              hover: false,
              events: [],
              tweens: {
                allIds: [],
                asOrigin: [],
                asDestination: [],
                byProp: TWEEN_PROPS_MAP
              },
              transform: transform,
              style: style,
              imageId: imageId,
              originalDimensions: payload.layer.originalDimensions
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
    // const state = getState() as RootState;
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
        resolve(layers);
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
      if (state.viewSettings.eventDrawer.isOpen && state.eventDrawer.event) {
        const tweenEvent = state.layer.present.events.byId[state.eventDrawer.event];
        let layersAndChildren: string[] = [];
        state.layer.present.selected.forEach((id) => {
          layersAndChildren = [...layersAndChildren, ...getLayerAndDescendants(state.layer.present, id)];
        });
        if (layersAndChildren.includes(tweenEvent.layer) || layersAndChildren.includes(tweenEvent.artboard) || layersAndChildren.includes(tweenEvent.destinationArtboard)) {
          dispatch(setEventDrawerEventThunk({id: null}));
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
  payload: {
    ...payload,
    selectedEdit: uuidv4()
  }
});

export const deepSelectLayer = (payload: DeepSelectLayerPayload): LayerTypes => ({
  type: DEEP_SELECT_LAYER,
  payload
});

export const deepSelectLayerThunk = (payload: DeepSelectLayerPayload) => {
  return (dispatch: any, getState: any) => {
    dispatch(deepSelectLayer(payload));
    return Promise.resolve();
  }
}

export const selectLayers = (payload: SelectLayersPayload): LayerTypes => ({
  type: SELECT_LAYERS,
  payload
});

export const deselectLayer = (payload: DeselectLayerPayload): LayerTypes => ({
  type: DESELECT_LAYER,
  payload: {
    ...payload,
    selectedEdit: uuidv4()
  }
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
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const nextScope = state.layer.present.scope.filter((id, index) => index !== state.layer.present.scope.length - 1);
    if (state.layer.present.scope.length > 0) {
      scrollToLayer(state.layer.present.scope[state.layer.present.scope.length - 1]);
    }
    if (state.canvasSettings.mouse) {
      const point = new uiPaperScope.Point(state.canvasSettings.mouse.paperX, state.canvasSettings.mouse.paperY)
      const hitResult = uiPaperScope.project.hitTest(point);
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
      const scope = state.layer.present.byId[state.layer.present.selected[0]].scope;
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
        resolve(newGroup);
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
        dispatch(groupLayers({layers: state.layer.present.selected.reverse(), group: newGroup}));
        resolve(newGroup);
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

export const setLayersGradientOD = (payload: SetLayersGradientODPayload): LayerTypes => ({
  type: SET_LAYERS_GRADIENT_OD,
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
    const mixed = !state.layer.present.selected.every((id) => (state.layer.present.byId[id] as Btwx.MaskableLayer).ignoreUnderlyingMask);
    if (mixed) {
      const disabled = state.layer.present.selected.filter((id) => !(state.layer.present.byId[id] as Btwx.MaskableLayer).ignoreUnderlyingMask);
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

export const addSelectionMaskThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      if (state.layer.present.selected.length > 1) {
        const maskLayerItem = state.layer.present.byId[state.layer.present.selected[0]];
        dispatch(
          addGroupThunk({
            layer: {
              name: maskLayerItem.name
            },
            batch: true
          })
        ).then((newGroup: Btwx.Group) => {
          dispatch(
            addLayersMask({
              layers: state.layer.present.selected,
              group: newGroup
            })
          );
          resolve(newGroup);
        });
      } else {
        dispatch(toggleSelectedMaskThunk());
        resolve(null);
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

export const duplicateLayersThunk = (payload: DuplicateLayersPayload) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      dispatch(duplicateLayers(payload));
      const newState = getState() as RootState;
      resolve(newState.layer.present.selected);
    });
  }
};

export const duplicateSelectedThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      dispatch(duplicateLayers({layers: state.layer.present.selected}));
    });
  }
};

export const removeDuplicatedLayers = (payload: RemoveDuplicatedLayersPayload): LayerTypes => ({
  type: REMOVE_DUPLICATED_LAYERS,
  payload
});

export const removeDuplicatedLayersThunk = (payload: RemoveDuplicatedLayersPayload) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      dispatch(removeDuplicatedLayers(payload));
      const newState = getState() as RootState;
      resolve(newState.layer.present.selected);
    });
  }
};

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
      const selectedPaperScopes = getSelectedProjectIndices(state);
      const selected = state.layer.present.selected;
      const topLayer = selected[0];
      const layerItem = state.layer.present.byId[topLayer];
      const topLayerPaperScope = selectedPaperScopes[topLayer];
      let booleanLayers = getPaperLayer(topLayer, topLayerPaperScope) as paper.Path | paper.CompoundPath;
      for (let i = 1; i < selected.length; i++) {
        booleanLayers = booleanLayers[booleanOperation](getPaperLayer(selected[i], selectedPaperScopes[selected[i]]) as paper.Path | paper.CompoundPath, { insert: false }) as paper.Path | paper.CompoundPath;
      }
      if (booleanLayers.pathData) {
        let position = booleanLayers.position;
        if (state.layer.present.byId[layerItem.parent].type === 'Artboard') {
          const artboardPosition = getAbsolutePosition(state.layer.present, layerItem.parent);
          position = position.subtract(artboardPosition);
        }
        dispatch(addShapeThunk({
          layer: {
            name: 'Combined Shape',
            parent: layerItem.parent,
            frame: {
              x: position.x,
              y: position.y,
              width: booleanLayers.bounds.width,
              height: booleanLayers.bounds.height,
              innerWidth: booleanLayers.bounds.width,
              innerHeight: booleanLayers.bounds.height
            },
            style: layerItem.style,
            closed: true,
            shapeType: 'Custom',
            pathData: booleanLayers.pathData
          },
          batch: true
        })).then((newShape: Btwx.Shape) => {
          switch(booleanOperation) {
            case 'divide':
              dispatch(divideLayers({
                layers: selected,
                booleanLayer: newShape
              }));
              break;
            case 'exclude':
              dispatch(excludeLayers({
                layers: selected,
                booleanLayer: newShape
              }));
              break;
            case 'intersect':
              dispatch(intersectLayers({
                layers: selected,
                booleanLayer: newShape
              }));
              break;
            case 'subtract':
              dispatch(subtractLayers({
                layers: selected,
                booleanLayer: newShape
              }));
              break;
            case 'unite':
              dispatch(uniteLayers({
                layers: selected,
                booleanLayer: newShape
              }));
              break;
          }
          resolve(newShape);
        });
      } else {
        dispatch(removeLayers({layers: selected}));
      }
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
    edit: {
      ...payload.edit,
      id: uuidv4()
    }
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

export const resetImageDimensions = (payload: ResetImageDimensionsPayload): LayerTypes => ({
  type: RESET_IMAGE_DIMENSIONS,
  payload
});

export const resetImagesDimensions = (payload: ResetImagesDimensionsPayload): LayerTypes => ({
  type: RESET_IMAGES_DIMENSIONS,
  payload
});

export const resetSelectedImageDimensionsThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    dispatch(resetImagesDimensions({layers: state.layer.present.selected}));
  }
};

export const replaceImage = (payload: ReplaceImagePayload): LayerTypes => ({
  type: REPLACE_IMAGE,
  payload
});

export const replaceImages = (payload: ReplaceImagesPayload): LayerTypes => ({
  type: REPLACE_IMAGES,
  payload
});

export const replaceSelectedImagesThunk = () => {
  return (dispatch: any, getState: any): Promise<Btwx.Image> => {
    return new Promise((resolve, reject) => {
      remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
          { name: 'Images', extensions: ['jpg', 'png'] }
        ],
        properties: ['openFile']
      }).then(result => {
        if (result.filePaths.length > 0 && !result.canceled) {
          const state = getState() as RootState; // providedState ? providedState : getState() as RootState;
          sharp(result.filePaths[0]).metadata().then(({ width, height }) => {
            const originalDimensions = {width, height};
            sharp(result.filePaths[0]).resize(Math.round(width * 0.5)).webp({quality: 75}).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
              const newBuffer = Buffer.from(data);
              const exists = state.documentSettings.images.allIds.length > 0 && state.documentSettings.images.allIds.find((id) => Buffer.from(state.documentSettings.images.byId[id].buffer).equals(newBuffer));
              const base64 = bufferToBase64(newBuffer);
              const imageId = exists ? exists : uuidv4();
              const imageLoader = new uiPaperScope.Raster(`data:image/webp;base64,${base64}`);
              imageLoader.onLoad = (): void => {
                state.layer.present.selected.forEach((layer, index) => {
                  const { layerItem, paperLayer } = getItemLayers(state.layer.present, layer);
                  const raster = paperLayer.getItem({data: {id: 'raster'}}) as paper.Raster;
                  paperLayer.data.imageId = imageId;
                  raster.source = `data:image/webp;base64,${base64}`;
                });
                if (!exists) {
                  dispatch(addDocumentImage({id: imageId, buffer: newBuffer}));
                }
                dispatch(replaceImages({
                  layers: state.layer.present.selected,
                  imageId,
                  originalDimensions
                }));
                imageLoader.remove();
                resolve(null);
              }
            });
          });
        }
      });
    });
  }
};

export const copyLayersThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const copyLayer = (copyState: Btwx.ClipboardLayers, layer: string, isChild?: boolean): Btwx.ClipboardLayers => {
      let currentCopyState = copyState;
      const { layerItem, paperLayer } = getItemLayers(state.layer.present, layer);
      const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
      const layerBounds = getLayerBounds(state.layer.present, layer);
      const nextTopLeft = copyState.bounds ? paper.Point.min((currentCopyState.bounds as paper.Rectangle).topLeft, layerBounds.topLeft) : layerBounds.topLeft;
      const nextBottomRight = copyState.bounds ? paper.Point.max((currentCopyState.bounds as paper.Rectangle).bottomRight, layerBounds.bottomRight) : layerBounds.bottomRight;
      // ids
      currentCopyState.allIds = [...currentCopyState.allIds, layer];
      // bounds
      currentCopyState.bounds = new uiPaperScope.Rectangle({
        from: nextTopLeft,
        to: nextBottomRight
      });
      // children
      if (layerItem.children && layerItem.children.length > 0) {
        currentCopyState = copyLayers(currentCopyState, layerItem.children, true);
      }
      // main && json
      if (!isChild) {
        currentCopyState.main = [...currentCopyState.main, layer];
        const pl = isMask ? paperLayer.parent : paperLayer;
        const clone = pl.clone({insert: false});
        currentCopyState.json = {
          ...currentCopyState.json,
          [layer]: clone.exportJSON()
        }
      }
      // byId
      currentCopyState.byId = {
        ...currentCopyState.byId,
        [layer]: {
          ...layerItem,
          events: [],
          tweens: {
            allIds: [],
            asOrigin: [],
            asDestination: [],
            byProp: TWEEN_PROPS_MAP
          },
          ...(() => {
            switch(layerItem.type) {
              case 'Artboard':
                return {
                  originArtboardForEvents: [],
                  destinationArtboardForEvents: []
                }
              default:
                return {};
            }
          })()
        }
      };
      // images
      if (layerItem.type === 'Image') {
        const imageId = (layerItem as Btwx.Image).imageId;
        if (!Object.keys(currentCopyState.images).includes(imageId)) {
          currentCopyState.images[imageId] = state.documentSettings.images.byId[imageId];
        }
      }
      return currentCopyState;
    };
    const copyLayers = (copyState: Btwx.ClipboardLayers, layers: string[], isChild?: boolean): Btwx.ClipboardLayers => {
      let currentCopyState = copyState;
      currentCopyState = layers.reduce((result, current) => {
        result = copyLayer(result, current, isChild);
        return result;
      }, currentCopyState);
      return currentCopyState;
    };
    if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
      const nextCopyState = { type: 'layers', main: [], allIds: [], byId: {}, images: {}, bounds: null, json: {} } as Btwx.ClipboardLayers;
      const copyState = copyLayers(nextCopyState, state.layer.present.selected, false);
      // copyState.paperLayers = groupThing.exportJSON();
      clipboard.writeText(JSON.stringify(copyState));
    }
  }
};

export const copyStyleThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length === 1) {
      const layerItem = state.layer.present.byId[state.layer.present.selected[0]];
      const style = layerItem.style;
      const textStyle = layerItem.type === 'Text' ? (layerItem as Btwx.Text).textStyle : null;
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
      const selectedPaperScopes = getSelectedProjectIndices(state);
      const group = new uiPaperScope.Group({insert: false});
      state.layer.present.selected.forEach((id) => {
        const paperLayer = getPaperLayer(id, selectedPaperScopes[id]);
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
      const svg = uiPaperScope.project.importSVG(clipboardText, {insert: false});
      console.log(svg);
    }
  }
};

export const pasteLayersFromClipboard = (payload: PasteLayersFromClipboardPayload): LayerTypes => ({
  type: PASTE_LAYERS_FROM_CLIPBOARD,
  payload
});

export const pasteLayersThunk = (props?: { overSelection?: boolean; overPoint?: Btwx.Point; overLayer?: string }) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const { overSelection, overPoint, overLayer } = props;
      const state = getState() as RootState;
      if (state.canvasSettings.focusing) {
        try {
          const text = clipboard.readText();
          const parsedText: Btwx.ClipboardLayers = JSON.parse(text);
          if (parsedText.type && parsedText.type === 'layers') {
            const withNewIds: string = parsedText.allIds.reduce((result: string, current: string) => {
              const newId = uuidv4();
              result = replaceAll(result, current, newId);
              return result;
            }, text);
            const clipboardLayers: Btwx.ClipboardLayers = JSON.parse(withNewIds);
            dispatch(pasteLayersFromClipboard({clipboardLayers, overSelection, overPoint, overLayer}));
            resolve(null);
            // const clipboardBounds = new uiPaperScope.Rectangle(
            //   new uiPaperScope.Point((clipboardLayers.bounds as number[])[1], (clipboardLayers.bounds as number[])[2]),
            //   new uiPaperScope.Size((clipboardLayers.bounds as number[])[3], (clipboardLayers.bounds as number[])[4])
            // );
            // // handle if clipboard position is not within viewport
            // if (!clipboardBounds.center.isInside(uiPaperScope.view.bounds)) {
            //   const pointDiff = uiPaperScope.view.center.subtract(clipboardBounds.center);
            //   clipboardLayers.main.forEach((id) => {
            //     const clipboardLayerItem = clipboardLayers.byId[id];
            //     clipboardLayerItem.frame.x += pointDiff.x;
            //     clipboardLayerItem.frame.y += pointDiff.y;
            //   });
            // }
            // //
            // if (!overSelection && !overPoint && !overLayer) {
            //   clipboardLayers.main.forEach((id) => {
            //     const clipboardLayerItem = clipboardLayers.byId[id];
            //     if (clipboardLayerItem.type !== 'Artboard') {
            //       const activeArtboard = state.layer.present.activeArtboard;
            //       const activeArtboardItem = state.layer.present.byId[activeArtboard];
            //       clipboardLayerItem.parent = activeArtboard;
            //       clipboardLayerItem.scope = [...activeArtboardItem.scope, activeArtboard];
            //       clipboardLayerItem.artboard = activeArtboard;
            //     }
            //   });
            // }
            // // handle paste over selection
            // if (overSelection && state.layer.present.selected.length > 0) {
            //   const singleSelection = state.layer.present.selected.length === 1;
            //   const overSelectionItem = state.layer.present.byId[state.layer.present.selected[0]];
            //   const selectedBounds = getSelectedBounds(state);
            //   const selectionPosition = selectedBounds.center;
            //   const pointDiff = selectionPosition.subtract(clipboardBounds.center);
            //   clipboardLayers.allIds.forEach((id) => {
            //     const clipboardLayerItem = clipboardLayers.byId[id];
            //     if (singleSelection && clipboardLayers.main.includes(id) && clipboardLayerItem.type !== 'Artboard') {
            //       if (overSelectionItem.type === 'Group' || overSelectionItem.type === 'Artboard') {
            //         clipboardLayerItem.parent = overSelectionItem.id;
            //       } else {
            //         clipboardLayerItem.parent = overSelectionItem.parent;
            //       }
            //     }
            //     clipboardLayerItem.frame.x += pointDiff.x;
            //     clipboardLayerItem.frame.y += pointDiff.y;
            //   });
            // }
            // // handle paste at point
            // if (overPoint && !overLayer) {
            //   const paperPoint = new uiPaperScope.Point(overPoint.x, overPoint.y);
            //   const pointDiff = paperPoint.subtract(clipboardBounds.center);
            //   clipboardLayers.allIds.forEach((id) => {
            //     const clipboardLayerItem = clipboardLayers.byId[id];
            //     clipboardLayerItem.frame.x += pointDiff.x;
            //     clipboardLayerItem.frame.y += pointDiff.y;
            //   });
            // }
            // // handle paste over layer
            // if (overLayer && !overPoint) {
            //   const { layerItem, paperLayer } = getItemLayers(state.layer.present, overLayer);
            //   const overLayerItem = state.layer.present.byId[overLayer];
            //   const pointDiff = paperLayer.position.subtract(clipboardBounds.center);
            //   clipboardLayers.allIds.forEach((id) => {
            //     const clipboardLayerItem = clipboardLayers.byId[id];
            //     if (clipboardLayers.main.includes(id) && clipboardLayerItem.type !== 'Artboard') {
            //       if (overLayerItem.type === 'Group' || overLayerItem.type === 'Artboard') {
            //         clipboardLayerItem.parent = overLayerItem.id;
            //       } else {
            //         clipboardLayerItem.parent = overLayerItem.parent;
            //       }
            //     }
            //     clipboardLayerItem.frame.x += pointDiff.x;
            //     clipboardLayerItem.frame.y += pointDiff.y;
            //   });
            // }
            // // handle paste over layer and over point
            // if (overPoint && overLayer) {
            //   const overLayerItem = state.layer.present.byId[overLayer];
            //   const paperPoint = new uiPaperScope.Point(overPoint.x, overPoint.y);
            //   const pointDiff = paperPoint.subtract(clipboardBounds.center);
            //   clipboardLayers.allIds.forEach((id) => {
            //     const clipboardLayerItem = clipboardLayers.byId[id];
            //     if (clipboardLayers.main.includes(id) && clipboardLayerItem.type !== 'Artboard') {
            //       if (overLayerItem.type === 'Group' || overLayerItem.type === 'Artboard') {
            //         clipboardLayerItem.parent = overLayerItem.id;
            //       } else {
            //         clipboardLayerItem.parent = overLayerItem.parent;
            //       }
            //     }
            //     clipboardLayerItem.frame.x += pointDiff.x;
            //     clipboardLayerItem.frame.y += pointDiff.y;
            //   });
            // }
            // const finalLayers: Btwx.Layer[] = clipboardLayers.allIds.reduce((result, current) => {
            //   result = [...result, clipboardLayers.byId[current]];
            //   return result;
            // }, []);
            // dispatch(addLayersThunk({layers: finalLayers, buffers: clipboardLayers.images}) as any).then(() => {
            //   dispatch(selectLayers({layers: clipboardLayers.main, newSelection: true}));
            //   resolve();
            // });
          }
        } catch(error) {
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
  }
};

// const updateEditors = (dispatch: any, state: RootState, type: 'redo' | 'undo') => {
//   if (state.colorEditor.isOpen) {
//     // const layerItem = state.layer.present.byId[state.colorEditor.layer];
//     const layerItems = state.colorEditor.layers.reduce((result, current) => {
//       return [...result, state.layer.present.byId[current]];
//     }, []);
//     // const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.colorEditor.layer] : state.layer.future[0].byId[state.colorEditor.layer];
//     const prevLayerItems = type === 'redo' ? state.colorEditor.layers.reduce((result, current) => {
//       return [...result, state.layer.past[state.layer.past.length - 1].byId[current]];
//     }, []) : state.colorEditor.layers.reduce((result, current) => {
//       return [...result, state.layer.future[0].byId[current]];
//     }, []);
//     // check if items exist and matches selection
//     if (layerItems.every((id) => id) && prevLayerItems.every((id) => id) && state.layer.present.selected.every((id, index) => state.layer.present.selected[index] === state.colorEditor.layers[index])) {
//       const style = layerItems[0].style[state.colorEditor.prop];
//       const prevStyle = prevLayerItems[0].style[state.colorEditor.prop];
//       // check if fill types match
//       if (style.fillType === prevStyle.fillType) {
//         // check if prev action creator was for color
//         if (colorsMatch(style.color, prevStyle.color)) {
//           dispatch(closeColorEditor());
//         }
//       } else {
//         // if fill types dont match, open relevant editor
//         switch(style.fillType) {
//           case 'gradient': {
//             dispatch(closeColorEditor());
//             dispatch(openGradientEditor({layers: state.colorEditor.layers, x: state.colorEditor.x, y: state.colorEditor.y, prop: state.colorEditor.prop}));
//           }
//         }
//       }
//     } else {
//       dispatch(closeColorEditor());
//     }
//   }
//   if (state.gradientEditor.isOpen) {
//     // const layerItem = state.layer.present.byId[state.gradientEditor.layer];
//     const layerItems = state.gradientEditor.layers.reduce((result, current) => {
//       return [...result, state.layer.present.byId[current]];
//     }, []);
//     // const prevLayerItem = type === 'redo' ? state.layer.past[state.layer.past.length - 1].byId[state.gradientEditor.layer] : state.layer.future[0].byId[state.gradientEditor.layer];
//     const prevLayerItems = type === 'redo' ? state.gradientEditor.layers.reduce((result, current) => {
//       return [...result, state.layer.past[state.layer.past.length - 1].byId[current]];
//     }, []) : state.gradientEditor.layers.reduce((result, current) => {
//       return [...result, state.layer.future[0].byId[current]];
//     }, []);
//     // check if items exist and matches selection
//     if (layerItems.every((id) => id) && prevLayerItems.every((id) => id) && state.layer.present.selected.every((id, index) => state.layer.present.selected[index] === state.gradientEditor.layers[index])) {
//       const style = layerItems[0].style[state.gradientEditor.prop];
//       const prevStyle = prevLayerItems[0].style[state.gradientEditor.prop];
//       // check if fill types match
//       if (style.fillType === prevStyle.fillType) {
//         updateGradientFrame(layerItems[0], (style as Btwx.Fill | Btwx.Stroke).gradient);
//         // check if prev action creator was for gradient
//         if (gradientsMatch((style as Btwx.Fill | Btwx.Stroke).gradient, (prevStyle as Btwx.Fill | Btwx.Stroke).gradient)) {
//           dispatch(closeGradientEditor());
//         }
//       } else {
//         // if fill types dont match, open relevant editor
//         switch(style.fillType) {
//           case 'color': {
//             dispatch(closeGradientEditor());
//             dispatch(openColorEditor({layers: state.gradientEditor.layers, x: state.gradientEditor.x, y: state.gradientEditor.y, prop: state.gradientEditor.prop}));
//             break;
//           }
//         }
//       }
//     } else {
//       dispatch(closeGradientEditor());
//     }
//   }
// };

export const undoThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.past.length > 0) {
      const layerState = state.layer.past[state.layer.past.length - 1];
      //
      if (state.layer.present.hover !== null) {
        dispatch(setLayerHover({id: null}));
      }
      // undo
      dispatch(ActionCreators.undo());
      //
      if (state.layer.present.edit.projects) {
        const documentImages = state.documentSettings.images.byId;
        state.layer.present.edit.projects.forEach((id) => {
          const currentArtboardItem = state.layer.present.byId[id];
          const pastArtboardItem = layerState.byId[id] as Btwx.Artboard;
          if (currentArtboardItem && pastArtboardItem) {
            const projectIndex = pastArtboardItem.projectIndex;
            const project = uiPaperScope.projects[projectIndex];
            const json = pastArtboardItem.json;
            const paperLayer = project.getItem({data: {id}});
            const newPaperLayer = importProjectJSON({
              project,
              json,
              documentImages
            });
            paperLayer.replaceWith(newPaperLayer);
          }
        });
      }
      // update editors
      switch(state.layer.present.edit.actionType) {
        case SET_LAYERS_FILL_COLOR: {
          if (state.gradientEditor.isOpen) {
            dispatch(closeGradientEditor());
          }
          if (state.colorEditor.isOpen && state.colorEditor.prop !== 'fill') {
            dispatch(closeColorEditor());
          }
          break;
        }
        case SET_LAYERS_STROKE_COLOR: {
          if (state.gradientEditor.isOpen) {
            dispatch(closeGradientEditor());
          }
          if (state.colorEditor.isOpen && state.colorEditor.prop !== 'stroke') {
            dispatch(closeColorEditor());
          }
          break;
        }
        case SET_LAYERS_SHADOW_COLOR: {
          if (state.gradientEditor.isOpen) {
            dispatch(closeGradientEditor());
          }
          if (state.colorEditor.isOpen && state.colorEditor.prop !== 'shadow') {
            dispatch(closeColorEditor());
          }
          break;
        }
        case SET_LAYERS_FILL_TYPE:
          switch(state.layer.present.edit.payload.fillType) {
            case 'gradient': {
              if (state.gradientEditor.isOpen) {
                dispatch(closeGradientEditor());
                if (state.gradientEditor.prop === 'fill') {
                  dispatch(openColorEditor({x: state.gradientEditor.x, y: state.gradientEditor.y, prop: state.gradientEditor.prop}));
                }
              }
              break;
            }
            case 'color': {
              if (state.colorEditor.isOpen) {
                dispatch(closeColorEditor());
                if (state.colorEditor.prop === 'fill') {
                  dispatch(openGradientEditor({x: state.colorEditor.x, y: state.colorEditor.y, prop: state.colorEditor.prop}));
                }
              }
              break;
            }
          }
          break;
        case SET_LAYERS_STROKE_FILL_TYPE:
          switch(state.layer.present.edit.payload.fillType) {
            case 'gradient': {
              if (state.gradientEditor.isOpen) {
                dispatch(closeGradientEditor());
                if (state.gradientEditor.prop === 'stroke') {
                  dispatch(openColorEditor({x: state.gradientEditor.x, y: state.gradientEditor.y, prop: state.gradientEditor.prop}));
                }
              }
              break;
            }
            case 'color': {
              if (state.colorEditor.isOpen) {
                dispatch(closeColorEditor());
                if (state.colorEditor.prop === 'stroke') {
                  dispatch(openGradientEditor({x: state.colorEditor.x, y: state.colorEditor.y, prop: state.colorEditor.prop}));
                }
              }
              break;
            }
          }
          break;
      }
      // update frames
      // if (!state.gradientEditor.isOpen && !gradientEditorFlag) {
      //   updateSelectionFrame(getSelectedBounds(fullState));
      // }
      // updateActiveArtboardFrame();
      // if (state.viewSettings.eventDrawer.isOpen && layerState.events.allIds.length > 0) {
      //   updateTweenEventsFrame(fullState);
      // }
    }
  }
};

export const redoThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.future.length > 0) {
      const layerState = state.layer.future[0];
      //
      if (state.layer.present.hover !== null) {
        dispatch(setLayerHover({id: null}));
      }
      // redo
      dispatch(ActionCreators.redo());
      //
      if (state.layer.present.edit.projects && layerState.edit.projects) {
        const documentImages = state.documentSettings.images.byId;
        layerState.edit.projects.forEach((id) => {
          const currentArtboardItem = state.layer.present.byId[id];
          const futureArtboardItem = layerState.byId[id] as Btwx.Artboard;
          if (currentArtboardItem && futureArtboardItem) {
            const projectIndex = futureArtboardItem.projectIndex;
            const project = uiPaperScope.projects[projectIndex];
            const json = futureArtboardItem.json;
            const paperLayer = project.getItem({data: {id}});
            const newPaperLayer = importProjectJSON({
              project,
              json,
              documentImages
            });
            paperLayer.replaceWith(newPaperLayer);
          }
        });
      }
      // update editors
      switch(layerState.edit.actionType) {
        case SET_LAYERS_FILL_COLOR: {
          if (state.gradientEditor.isOpen) {
            dispatch(closeGradientEditor());
          }
          if (state.colorEditor.isOpen && state.colorEditor.prop !== 'fill') {
            dispatch(closeColorEditor());
          }
          break;
        }
        case SET_LAYERS_STROKE_COLOR: {
          if (state.gradientEditor.isOpen) {
            dispatch(closeGradientEditor());
          }
          if (state.colorEditor.isOpen && state.colorEditor.prop !== 'stroke') {
            dispatch(closeColorEditor());
          }
          break;
        }
        case SET_LAYERS_SHADOW_COLOR: {
          if (state.gradientEditor.isOpen) {
            dispatch(closeGradientEditor());
          }
          if (state.colorEditor.isOpen && state.colorEditor.prop !== 'shadow') {
            dispatch(closeColorEditor());
          }
          break;
        }
        case SET_LAYERS_FILL_TYPE:
          switch(layerState.edit.payload.fillType) {
            case 'gradient': {
              if (state.colorEditor.isOpen) {
                dispatch(closeColorEditor());
                if (state.colorEditor.prop === 'fill') {
                  dispatch(openGradientEditor({x: state.colorEditor.x, y: state.colorEditor.y, prop: state.colorEditor.prop}));
                }
              }
              break;
            }
            case 'color': {
              if (state.gradientEditor.isOpen) {
                dispatch(closeGradientEditor());
                if (state.gradientEditor.prop === 'fill') {
                  dispatch(openColorEditor({x: state.gradientEditor.x, y: state.gradientEditor.y, prop: state.gradientEditor.prop}));
                }
              }
              break;
            }
          }
          break;
        case SET_LAYERS_STROKE_FILL_TYPE:
          switch(layerState.edit.payload.fillType) {
            case 'gradient': {
              if (state.colorEditor.isOpen) {
                dispatch(closeColorEditor());
                if (state.colorEditor.prop === 'stroke') {
                  dispatch(openGradientEditor({x: state.colorEditor.x, y: state.colorEditor.y, prop: state.colorEditor.prop}));
                }
              }
              break;
            }
            case 'color': {
              if (state.gradientEditor.isOpen) {
                dispatch(closeGradientEditor());
                if (state.colorEditor.prop === 'stroke') {
                  dispatch(openColorEditor({x: state.gradientEditor.x, y: state.gradientEditor.y, prop: state.gradientEditor.prop}));
                }
              }
              break;
            }
          }
          break;
      }
      // update frames
      // if (!state.gradientEditor.isOpen && !gradientEditorFlag) {
      //   updateSelectionFrame(getSelectedBounds(fullState));
      // }
      // updateActiveArtboardFrame();
      // if (state.viewSettings.eventDrawer.isOpen && layerState.events.allIds.length > 0) {
      //   updateTweenEventsFrame(fullState);
      // }
    }
  }
};

export const updateGradientFrame = (origin: { position: paper.Point; color: Btwx.Color; selected: boolean; index: number }, destination: { position: paper.Point; color: Btwx.Color; selected: boolean; index: number }): void => {
  const gradientFrame = uiPaperScope.project.getItem({ data: { id: 'gradientFrame' } });
  gradientFrame.removeChildren();
  if (origin && destination) {
    uiPaperScope.activate();
    const gradientFrameHandleBgProps = {
      radius: 8 / uiPaperScope.view.zoom,
      fillColor: '#fff',
      shadowColor: new uiPaperScope.Color(0, 0, 0, 0.5),
      shadowBlur: 2,
      insert: false,
      strokeWidth: 1 / uiPaperScope.view.zoom
    }
    const gradientFrameHandleSwatchProps = {
      radius: 6 / uiPaperScope.view.zoom,
      fillColor: '#fff',
      insert: false
    }
    const gradientFrameLineProps = {
      from: origin.position,
      to: destination.position,
      insert: false
    }
    const gradientFrameOriginHandleBg = new uiPaperScope.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: origin.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'origin',
        elementId: 'gradientFrame',
        stopIndex: origin.index
      },
      strokeColor: origin.selected ? THEME_PRIMARY_COLOR : null
    });
    const gradientFrameOriginHandleSwatch  = new uiPaperScope.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: {
        hue: origin.color.h,
        saturation: origin.color.s,
        lightness: origin.color.l,
        alpha: origin.color.a
      },
      center: origin.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'origin',
        elementId: 'gradientFrame',
        stopIndex: origin.index
      }
    });
    const gradientFrameDestinationHandleBg = new uiPaperScope.Shape.Circle({
      ...gradientFrameHandleBgProps,
      center: destination.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'destination',
        elementId: 'gradientFrame',
        stopIndex: destination.index
      },
      strokeColor: destination.selected ? THEME_PRIMARY_COLOR : null
    });
    const gradientFrameDestinationHandleSwatch = new uiPaperScope.Shape.Circle({
      ...gradientFrameHandleSwatchProps,
      fillColor: {
        hue: destination.color.h,
        saturation: destination.color.s,
        lightness: destination.color.l,
        alpha: destination.color.a
      },
      center: destination.position,
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'destination',
        elementId: 'gradientFrame',
        stopIndex: destination.index
      }
    });
    const gradientFrameLineDark = new uiPaperScope.Path.Line({
      ...gradientFrameLineProps,
      strokeColor: new uiPaperScope.Color(0, 0, 0, 0.25),
      strokeWidth: 3 / uiPaperScope.view.zoom,
      data: {
        id: 'gradientFrameLine',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'gradientFrame'
      }
    });
    const gradientFrameLineLight = new uiPaperScope.Path.Line({
      ...gradientFrameLineProps,
      strokeColor: '#fff',
      strokeWidth: 1 / uiPaperScope.view.zoom,
      data: {
        id: 'gradientFrameLine',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'gradientFrame'
      }
    });
    const gradientFrameOriginHandle = new uiPaperScope.Group({
      data: {
        id: 'gradientFrameOriginHandle',
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'origin',
        elementId: 'gradientFrame',
        stopIndex: origin.index
      },
      insert: false,
      children: [gradientFrameOriginHandleBg, gradientFrameOriginHandleSwatch]
    });
    const gradientFrameDestinationHandle = new uiPaperScope.Group({
      data: {
        id: 'gradientFrameDestinationHandle',
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'destination',
        elementId: 'gradientFrame',
        stopIndex: destination.index
      },
      insert: false,
      children: [gradientFrameDestinationHandleBg, gradientFrameDestinationHandleSwatch]
    });
    const gradientFrameLines = new uiPaperScope.Group({
      data: {
        id: 'gradientFrameLines',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'gradientFrame'
      },
      insert: false,
      children: [gradientFrameLineDark, gradientFrameLineLight]
    });
    new uiPaperScope.Group({
      data: {
        id: 'GradientFrame',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: 'gradientFrame'
      },
      children: [gradientFrameLines, gradientFrameOriginHandle, gradientFrameDestinationHandle],
      parent: gradientFrame
    });
  }
}

// export const updateGradientFrame = (layerItem: Btwx.Layer, gradient: Btwx.Gradient) => {
//   const gradientFrame = uiPaperScope.project.getItem({ data: { id: 'gradientFrame' } });
//   gradientFrame.removeChildren();
//   const stopsWithIndex = gradient.stops.map((stop, index) => {
//     return {
//       ...stop,
//       index
//     }
//   });
//   const sortedStops = stopsWithIndex.sort((a,b) => { return a.position - b.position });
//   const originStop = sortedStops[0];
//   const destStop = sortedStops[sortedStops.length - 1];
//   const gradientFrameHandleBgProps = {
//     radius: 8 / uiPaperScope.view.zoom,
//     fillColor: '#fff',
//     shadowColor: new uiPaperScope.Color(0, 0, 0, 0.5),
//     shadowBlur: 2,
//     insert: false,
//     strokeWidth: 1 / uiPaperScope.view.zoom
//   }
//   const gradientFrameHandleSwatchProps = {
//     radius: 6 / uiPaperScope.view.zoom,
//     fillColor: '#fff',
//     insert: false
//   }
//   const gradientFrameLineProps = {
//     from: getGradientOriginPoint(layerItem, gradient.origin),
//     to: getGradientDestinationPoint(layerItem, gradient.destination),
//     insert: false
//   }
//   const gradientFrameOriginHandleBg = new uiPaperScope.Shape.Circle({
//     ...gradientFrameHandleBgProps,
//     center: getGradientOriginPoint(layerItem, gradient.origin),
//     data: {
//       type: 'UIElementChild',
//       interactive: true,
//       interactiveType: 'origin',
//       elementId: 'gradientFrame'
//     },
//     strokeColor: originStop.index === gradient.activeStopIndex ? THEME_PRIMARY_COLOR : null
//   });
//   const gradientFrameOriginHandleSwatch  = new uiPaperScope.Shape.Circle({
//     ...gradientFrameHandleSwatchProps,
//     fillColor: {
//       hue: originStop.color.h,
//       saturation: originStop.color.s,
//       lightness: originStop.color.l,
//       alpha: originStop.color.a
//     },
//     center: getGradientOriginPoint(layerItem, gradient.origin),
//     data: {
//       type: 'UIElementChild',
//       interactive: true,
//       interactiveType: 'origin',
//       elementId: 'gradientFrame'
//     }
//   });
//   const gradientFrameDestinationHandleBg = new uiPaperScope.Shape.Circle({
//     ...gradientFrameHandleBgProps,
//     center: getGradientDestinationPoint(layerItem, gradient.destination),
//     data: {
//       type: 'UIElementChild',
//       interactive: true,
//       interactiveType: 'destination',
//       elementId: 'gradientFrame'
//     },
//     strokeColor: destStop.index === gradient.activeStopIndex ? THEME_PRIMARY_COLOR : null
//   });
//   const gradientFrameDestinationHandleSwatch = new uiPaperScope.Shape.Circle({
//     ...gradientFrameHandleSwatchProps,
//     fillColor: {
//       hue: destStop.color.h,
//       saturation: destStop.color.s,
//       lightness: destStop.color.l,
//       alpha: destStop.color.a
//     },
//     center: getGradientDestinationPoint(layerItem, gradient.destination),
//     data: {
//       type: 'UIElementChild',
//       interactive: true,
//       interactiveType: 'destination',
//       elementId: 'gradientFrame'
//     }
//   });
//   const gradientFrameLineDark = new uiPaperScope.Path.Line({
//     ...gradientFrameLineProps,
//     strokeColor: new uiPaperScope.Color(0, 0, 0, 0.25),
//     strokeWidth: 3 / uiPaperScope.view.zoom,
//     data: {
//       id: 'GradientFrameLine',
//       type: 'UIElementChild',
//       interactive: false,
//       interactiveType: null,
//       elementId: 'gradientFrame'
//     }
//   });
//   const gradientFrameLineLight = new uiPaperScope.Path.Line({
//     ...gradientFrameLineProps,
//     strokeColor: '#fff',
//     strokeWidth: 1 / uiPaperScope.view.zoom,
//     data: {
//       id: 'GradientFrameLine',
//       type: 'UIElementChild',
//       interactive: false,
//       interactiveType: null,
//       elementId: 'gradientFrame'
//     }
//   });
//   const gradientFrameOriginHandle = new uiPaperScope.Group({
//     data: {
//       id: 'GradientFrameOriginHandle',
//       type: 'UIElementChild',
//       interactive: true,
//       interactiveType: 'origin',
//       elementId: 'gradientFrame'
//     },
//     insert: false,
//     children: [gradientFrameOriginHandleBg, gradientFrameOriginHandleSwatch]
//   });
//   const gradientFrameDestinationHandle = new uiPaperScope.Group({
//     data: {
//       id: 'GradientFrameDestinationHandle',
//       type: 'UIElementChild',
//       interactive: true,
//       interactiveType: 'destination',
//       elementId: 'gradientFrame'
//     },
//     insert: false,
//     children: [gradientFrameDestinationHandleBg, gradientFrameDestinationHandleSwatch]
//   });
//   const gradientFrameLines = new uiPaperScope.Group({
//     data: {
//       id: 'GradientFrameLines',
//       type: 'UIElementChild',
//       interactive: false,
//       interactiveType: null,
//       elementId: 'gradientFrame'
//     },
//     insert: false,
//     children: [gradientFrameLineDark, gradientFrameLineLight]
//   });
//   new uiPaperScope.Group({
//     data: {
//       id: 'GradientFrame',
//       type: 'UIElement',
//       interactive: false,
//       interactiveType: null,
//       elementId: 'gradientFrame'
//     },
//     children: [gradientFrameLines, gradientFrameOriginHandle, gradientFrameDestinationHandle],
//     parent: gradientFrame
//   });
// }

export const updateActiveArtboardFrame = (bounds: paper.Rectangle): void => {
  if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
    uiPaperScope.projects[0].activate();
  }
  const activeArtboardFrame = uiPaperScope.project.getItem({ data: { id: 'activeArtboardFrame' } });
  activeArtboardFrame.removeChildren();
  if (bounds) {
    const topLeft = bounds.topLeft;
    const bottomRight = bounds.bottomRight;
    new uiPaperScope.Path.Rectangle({
      from: new uiPaperScope.Point(topLeft.x - (2 / uiPaperScope.view.zoom), topLeft.y - (2 / uiPaperScope.view.zoom)),
      to: new uiPaperScope.Point(bottomRight.x + (2 / uiPaperScope.view.zoom), bottomRight.y + (2 / uiPaperScope.view.zoom)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 4 / uiPaperScope.view.zoom,
      parent: activeArtboardFrame
    });
  }
};

export const updateActiveArtboardFrameThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const activeArtboard = state.layer.present.activeArtboard;
    if (activeArtboard) {
      const { paperLayer } = getItemLayers(state.layer.present, activeArtboard);
      updateActiveArtboardFrame(paperLayer.getItem({data: {id: 'artboardBackground'}}).bounds);
    }
  }
};

export const updateNameFrame = (artboards: { [id: string]: Btwx.Artboard }): void => {
  if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
    uiPaperScope.projects[0].activate();
  }
  const nameFrame = uiPaperScope.project.getItem({ data: { id: 'nameFrame' } });
  nameFrame.removeChildren();
  if (artboards) {
    Object.keys(artboards).forEach((id: string) => {
      const artboardItem = artboards[id];
      // const paperLayer = getPaperLayer(artboardItem.id, artboardItem.projectIndex);
      // const artboardBackground = paperLayer.getItem({data: {id: 'artboardBackground'}});
      const bottomLeft = new uiPaperScope.Point(artboardItem.frame.x - (artboardItem.frame.width / 2), artboardItem.frame.y + (artboardItem.frame.height / 2));
      new uiPaperScope.PointText({
        point: bottomLeft.add(new uiPaperScope.Point(0, 24 * (1 / uiPaperScope.view.zoom))),
        content: artboardItem.name,
        fillColor: '#999',
        fontSize: 12 * (1 / uiPaperScope.view.zoom),
        fontFamily: 'Space Mono',
        parent: nameFrame,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: artboardItem.id,
          elementId: 'nameFrame'
        }
      });
    });
  }
};

export const updateHoverFrame = (hoverItem: Btwx.Layer, artboardItem?: Btwx.Artboard): void => {
  if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
    uiPaperScope.projects[0].activate();
  }
  const hoverFrame = uiPaperScope.project.getItem({ data: { id: 'hoverFrame' } });
  hoverFrame.removeChildren();
  if (hoverItem) {
    const hoverFrameConstants = {
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 2 / uiPaperScope.view.zoom,
      parent: hoverFrame
    }
    let hoverPosition = new uiPaperScope.Point(hoverItem.frame.x, hoverItem.frame.y);
    if (artboardItem) {
      const artboardPosition = new uiPaperScope.Point(artboardItem.frame.x, artboardItem.frame.y);
      hoverPosition = hoverPosition.add(artboardPosition);
    }
    const hoverItemBounds = new uiPaperScope.Rectangle({
      from: new uiPaperScope.Point(hoverPosition.x - (hoverItem.frame.width / 2), hoverPosition.y - (hoverItem.frame.height / 2)),
      to: new uiPaperScope.Point(hoverPosition.x + (hoverItem.frame.width / 2), hoverPosition.y + (hoverItem.frame.height / 2))
    });
    switch(hoverItem.type) {
      // case 'Artboard': {
      //   const artboardBackground = hoverPaperLayer.getItem({ data: { id: 'artboardBackground' } });
      //   new paperMain.Path.Rectangle({
      //     ...hoverFrameConstants,
      //     rectangle: artboardBackground.bounds
      //   });
      //   break;
      // }
      case 'Shape': {
        const hoverItemPath = new uiPaperScope.CompoundPath({
          ...hoverFrameConstants,
          closed: (hoverItem as Btwx.Shape).closed,
          pathData: (hoverItem as Btwx.Shape).pathData
        });
        hoverItemPath.position = hoverItemBounds.center;
        break;
      }
      // case 'Text': {
      //   const textLayer = hoverPaperLayer.getItem({data: { id: 'textContent' }});
      //   const initialPoint = (textLayer as paper.PointText).point;
      //   (textLayer as any)._lines.forEach((line: any, index: number) => {
      //     new paperMain.Path.Line({
      //       from: new paperMain.Point(initialPoint.x, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
      //       to: new paperMain.Point(initialPoint.x + textLayer.bounds.width, initialPoint.y + (((textLayer as paper.PointText).leading as number) * index)),
      //       strokeColor: THEME_PRIMARY_COLOR,
      //       strokeWidth: 2 / uiPaperScope.view.zoom,
      //       data: {
      //         type: 'UIElementChild',
      //         interactive: false,
      //         interactiveType: null,
      //         elementId: 'hoverFrame'
      //       },
      //       parent: hoverFrame
      //     });
      //   });
      //   break;
      // }
      default:
        new uiPaperScope.Path.Rectangle({
          ...hoverFrameConstants,
          from: hoverItemBounds.topLeft,
          to: hoverItemBounds.bottomRight,
        });
        break;
    }
  }
};

export const updateSelectionFrame = (bounds: paper.Rectangle, visibleHandle: Btwx.SelectionFrameHandle = 'all', linePaperLayer?: any): void => {
  if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
    uiPaperScope.projects[0].activate();
  }
  const selectionFrame = uiPaperScope.project.getItem({ data: { id: 'selectionFrame' } });
  selectionFrame.removeChildren();
  if (bounds) {
    const resizeDisabled = false;
    const baseProps = {
      point: bounds.topLeft,
      size: [8, 8],
      fillColor: '#fff',
      strokeColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.24 },
      strokeWidth: 1 / uiPaperScope.view.zoom,
      shadowColor: { hue: 0, saturation: 0, lightness: 0, alpha: 0.5 },
      shadowBlur: 1 / uiPaperScope.view.zoom,
      opacity: resizeDisabled ? 1 : 1,
      parent: selectionFrame
    }
    const selectionTopLeft = bounds.topLeft; // bounds ? bounds.topLeft : getSelectedTopLeft(state);
    const selectionBottomRight = bounds.bottomRight; // bounds ? bounds.bottomRight : getSelectedBottomRight(state);
    const baseFrame = new uiPaperScope.Group({
      opacity: 0.33,
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'selectionFrame'
      },
      parent: selectionFrame
    });
    const baseFrameOverlay = new uiPaperScope.Path.Rectangle({
      from: selectionTopLeft,
      to: selectionBottomRight,
      strokeColor: '#fff',
      strokeWidth: 1 / uiPaperScope.view.zoom,
      blendMode: 'multiply',
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'selectionFrame'
      },
      parent: baseFrame
    });
    const baseFrameDifference = new uiPaperScope.Path.Rectangle({
      from: selectionTopLeft,
      to: selectionBottomRight,
      strokeColor: '#999',
      strokeWidth: 1 / uiPaperScope.view.zoom,
      blendMode: 'difference',
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'selectionFrame'
      },
      parent: baseFrame
    });
    const moveHandle = new uiPaperScope.Path.Ellipse({
      ...baseProps,
      opacity: 1,
      visible: visibleHandle === 'all' || visibleHandle === 'move',
      data: {
        type: 'UIElementChild',
        interactive: true,
        interactiveType: 'move',
        elementId: 'selectionFrame'
      }
    });
    moveHandle.position = new uiPaperScope.Point(baseFrame.bounds.topCenter.x, baseFrame.bounds.topCenter.y - ((1 / uiPaperScope.view.zoom) * 24));
    moveHandle.scaling.x = 1 / uiPaperScope.view.zoom;
    moveHandle.scaling.y = 1 / uiPaperScope.view.zoom;
    // Line selection frame
    if (linePaperLayer) {
      const fromHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'lineFrom' || visibleHandle === 'all',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'lineFrom',
          elementId: 'selectionFrame'
        }
      });
      fromHandle.position = linePaperLayer.firstSegment.point;
      fromHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      fromHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const toHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'lineTo' || visibleHandle === 'all',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'lineTo',
          elementId: 'selectionFrame'
        }
      });
      toHandle.position = linePaperLayer.lastSegment.point;
      toHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      toHandle.scaling.y = 1 / uiPaperScope.view.zoom;
    } else {
      const topLeftHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'topLeft',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'topLeft',
          elementId: 'selectionFrame'
        }
      });
      topLeftHandle.position = baseFrame.bounds.topLeft;
      topLeftHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      topLeftHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const topCenterHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'topCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'topCenter',
          elementId: 'selectionFrame'
        }
      });
      topCenterHandle.position = baseFrame.bounds.topCenter;
      topCenterHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      topCenterHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const topRightHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'topRight',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'topRight',
          elementId: 'selectionFrame'
        }
      });
      topRightHandle.position = baseFrame.bounds.topRight;
      topRightHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      topRightHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const bottomLeftHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'bottomLeft',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'bottomLeft',
          elementId: 'selectionFrame'
        }
      });
      bottomLeftHandle.position = baseFrame.bounds.bottomLeft;
      bottomLeftHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      bottomLeftHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const bottomCenterHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'bottomCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'bottomCenter',
          elementId: 'selectionFrame'
        }
      });
      bottomCenterHandle.position = baseFrame.bounds.bottomCenter;
      bottomCenterHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      bottomCenterHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const bottomRightHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'bottomRight',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'bottomRight',
          elementId: 'selectionFrame'
        }
      });
      bottomRightHandle.position = baseFrame.bounds.bottomRight;
      bottomRightHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      bottomRightHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const rightCenterHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'rightCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'rightCenter',
          elementId: 'selectionFrame'
        }
      });
      rightCenterHandle.position = baseFrame.bounds.rightCenter;
      rightCenterHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      rightCenterHandle.scaling.y = 1 / uiPaperScope.view.zoom;
      const leftCenterHandle = new uiPaperScope.Path.Rectangle({
        ...baseProps,
        visible: visibleHandle === 'all' || visibleHandle === 'leftCenter',
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: 'leftCenter',
          elementId: 'selectionFrame'
        }
      });
      leftCenterHandle.position = baseFrame.bounds.leftCenter;
      leftCenterHandle.scaling.x = 1 / uiPaperScope.view.zoom;
      leftCenterHandle.scaling.y = 1 / uiPaperScope.view.zoom;
    }
  }
};

export const updateEventsFrame = (state: RootState): void => {
  if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
    uiPaperScope.projects[0].activate();
  }
  const eventsFrame = uiPaperScope.project.getItem({ data: { id: 'eventsFrame' } });
  const events = (getArtboardEventItems(state) as {
    tweenEventItems: Btwx.TweenEvent[];
    tweenEventLayers: {
      allIds: string[];
      byId: {
        [id: string]: Btwx.Layer;
      };
    };
  }).tweenEventItems;
  eventsFrame.removeChildren();
  if (events) {
    const theme = getTheme(state.viewSettings.theme);
    events.forEach((event, index) => {
      const eventLayerItem = state.layer.present.byId[event.layer];
      // const groupOpacity = state.layer.present.hover ? state.layer.present.hover === event.id ? 1 : 0.25 : 1;
      const elementColor = event.artboard === state.layer.present.activeArtboard ? THEME_PRIMARY_COLOR : theme.text.lighter;
      const artboardTopTop = getArtboardsTopTop(state.layer.present);
      const origin = state.layer.present.byId[event.artboard];
      const destination = state.layer.present.byId[event.destinationArtboard];
      const tweenEventDestinationIndicator = new uiPaperScope.Path.Ellipse({
        center: new uiPaperScope.Point(destination.frame.x, artboardTopTop - ((1 / uiPaperScope.view.zoom) * 48)),
        radius: ((1 / uiPaperScope.view.zoom) * 4),
        fillColor: elementColor,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'eventsFrame'
        }
      });
      const tweenEventOriginIndicator = new uiPaperScope.Path.Ellipse({
        center: new uiPaperScope.Point(origin.frame.x, artboardTopTop - ((1 / uiPaperScope.view.zoom) * 48)),
        radius: ((1 / uiPaperScope.view.zoom) * 10),
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'eventsFrame'
        }
      });
      const tweenEventIconBackground = new uiPaperScope.Path.Ellipse({
        center: tweenEventOriginIndicator.bounds.center,
        radius: ((1 / uiPaperScope.view.zoom) * 14),
        fillColor: theme.background.z0,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'eventsFrame'
        }
      });
      const tweenEventIcon = new uiPaperScope.CompoundPath({
        pathData: ((): string => {
          switch(eventLayerItem.type) {
            case 'Artboard':
              return 'M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z';
            case 'Group':
              return 'M21,9 L21,20 L3,20 L3,9 L21,9 Z M9,4 C10.480515,4 11.7731656,4.80434324 12.4648015,5.99987956 L21,6 L21,8 L3,8 L3,4 L9,4 Z';
            case 'Shape':
              return (eventLayerItem as Btwx.Shape).pathData;
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
          elementId: 'eventsFrame'
        }
      });
      tweenEventIcon.fitBounds(tweenEventOriginIndicator.bounds);
      const tweenEventConnector = new uiPaperScope.Path.Line({
        from: tweenEventOriginIndicator.bounds.center,
        to: tweenEventDestinationIndicator.bounds.center,
        strokeColor: elementColor,
        strokeWidth: 1 / uiPaperScope.view.zoom,
        insert: false,
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'eventsFrame'
        }
      });
      const tweenEventText = new uiPaperScope.PointText({
        content: DEFAULT_TWEEN_EVENTS.find((tweenEvent) => event.event === tweenEvent.event).titleCase,
        point: new uiPaperScope.Point(tweenEventConnector.bounds.center.x, tweenEventDestinationIndicator.bounds.top - ((1 / uiPaperScope.view.zoom) * 10)),
        justification: 'center',
        fontSize: ((1 / uiPaperScope.view.zoom) * 10),
        fillColor: elementColor,
        insert: false,
        fontFamily: 'Space Mono',
        data: {
          type: 'UIElementChild',
          interactive: false,
          interactiveType: null,
          elementId: 'eventsFrame'
        }
      });
      const eventFrame = new uiPaperScope.Group({
        children: [tweenEventConnector, tweenEventIconBackground, tweenEventIcon, tweenEventDestinationIndicator, tweenEventText],
        data: {
          id: 'eventFrame',
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: 'eventsFrame'
        },
        parent: eventsFrame,
        // opacity: groupOpacity
      });
      const eventFrameBackground = new uiPaperScope.Path.Rectangle({
        from: eventFrame.bounds.topLeft,
        to: eventFrame.bounds.bottomRight,
        fillColor: theme.background.z0,
        opacity: 0.01,
        parent: eventFrame,
        data: {
          type: 'UIElementChild',
          interactive: true,
          interactiveType: event.id,
          elementId: 'eventsFrame'
        }
      });
      eventFrame.position.y -= (eventFrame.bounds.height + ((1 / uiPaperScope.view.zoom) * 12)) * index;
    });
  }
};

export const updateEventsFrameThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    updateEventsFrame(state);
  }
};

export const updateMeasureGuides = (bounds: paper.Rectangle, measureTo: { top?: paper.Rectangle; bottom?: paper.Rectangle; left?: paper.Rectangle; right?: paper.Rectangle; all?: paper.Rectangle }): void => {
  if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
    uiPaperScope.projects[0].activate();
  }
  const measureGuides = uiPaperScope.project.getItem({ data: { id: 'measureGuides' } });
  measureGuides.removeChildren();
  if (measureTo) {
    let hasTopMeasure;
    let hasBottomMeasure;
    let hasLeftMeasure;
    let hasRightMeasure;
    let topMeasureTo;
    let bottomMeasureTo;
    let leftMeasureTo;
    let rightMeasureTo;
    Object.keys(measureTo).forEach((current: 'top' | 'bottom' | 'left' | 'right' | 'all') => {
      const measureToBounds = measureTo[current];
      if (measureToBounds.contains(bounds)) {
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
            hasTopMeasure = bounds.top > measureToBounds.top;
            topMeasureTo = bounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
            break;
          case 'bottom':
            hasBottomMeasure = bounds.bottom < measureToBounds.bottom;
            bottomMeasureTo = bounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
            break;
          case 'left':
            hasLeftMeasure = bounds.left > measureToBounds.left;
            leftMeasureTo = bounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
            break;
          case 'right':
            hasRightMeasure = bounds.right < measureToBounds.right;
            rightMeasureTo = bounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
            break;
          case 'all':
            hasTopMeasure = bounds.top > measureToBounds.top;
            hasBottomMeasure = bounds.bottom < measureToBounds.bottom;
            hasLeftMeasure = bounds.left > measureToBounds.left;
            hasRightMeasure = bounds.right < measureToBounds.right;
            topMeasureTo = bounds.top > measureToBounds.bottom ? measureToBounds.bottom : measureToBounds.top;
            bottomMeasureTo = bounds.bottom < measureToBounds.top ? measureToBounds.top : measureToBounds.bottom;
            leftMeasureTo = bounds.left > measureToBounds.right ? measureToBounds.right : measureToBounds.left;
            rightMeasureTo = bounds.right < measureToBounds.left ? measureToBounds.left : measureToBounds.right;
            break;
        }
      }
    });
    if (hasTopMeasure && (measureTo['all'] || measureTo['top'])) {
      const topMeasureFromPoint = bounds.topCenter;
      const topMeasureToPoint = new uiPaperScope.Point(topMeasureFromPoint.x, topMeasureTo);
      new MeasureGuide(topMeasureFromPoint, topMeasureToPoint, 'top', { down: true, up: true });
    }
    if (hasBottomMeasure && (measureTo['all'] || measureTo['bottom'])) {
      const bottomMeasureFromPoint = bounds.bottomCenter;
      const bottomMeasureToPoint = new uiPaperScope.Point(bottomMeasureFromPoint.x, bottomMeasureTo);
      new MeasureGuide(bottomMeasureFromPoint, bottomMeasureToPoint, 'bottom', { down: true, up: true });
    }
    if (hasLeftMeasure && (measureTo['all'] || measureTo['left'])) {
      const leftMeasureFromPoint = bounds.leftCenter;
      const leftMeasureToPoint = new uiPaperScope.Point(leftMeasureTo, leftMeasureFromPoint.y);
      new MeasureGuide(leftMeasureFromPoint, leftMeasureToPoint, 'left', { down: true, up: true });
    }
    if (hasRightMeasure && (measureTo['all'] || measureTo['right'])) {
      const rightMeasureFromPoint = bounds.rightCenter;
      const rightMeasureToPoint = new uiPaperScope.Point(rightMeasureTo, rightMeasureFromPoint.y);
      new MeasureGuide(rightMeasureFromPoint, rightMeasureToPoint, 'right', { down: true, up: true });
    }
  }
};

export const updateFramesThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const artboardItems = getAllArtboardItems(state);
    const activeArtboardBounds = getActiveArtboardBounds(state);
    const selectedBounds = getSelectedBounds(state);
    const selectedPaperScopes = getSelectedProjectIndices(state);
    const singleSelection = state.layer.present.selected.length === 1;
    const isLine = singleSelection && state.layer.present.byId[state.layer.present.selected[0]].type === 'Shape' && (state.layer.present.byId[state.layer.present.selected[0]] as Btwx.Shape).shapeType === 'Line';
    const linePaperLayer = isLine ? getPaperLayer(Object.keys(selectedPaperScopes)[0], selectedPaperScopes[Object.keys(selectedPaperScopes)[0]]) : null;
    const canvasWrap = document.getElementById('canvas-container');
    ['ui', ...state.layer.present.childrenById.root].forEach((scope, index) => {
      uiPaperScope.projects[index].view.viewSize = new uiPaperScope.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
      uiPaperScope.projects[index].view.matrix.set(state.documentSettings.matrix);
    });
    updateSelectionFrame(selectedBounds, 'all', linePaperLayer);
    updateActiveArtboardFrame(activeArtboardBounds);
    updateEventsFrame(state);
    updateNameFrame(artboardItems);
  }
}