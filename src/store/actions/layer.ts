import { v4 as uuidv4 } from 'uuid';
import { ActionCreators } from 'redux-undo';
import { clipboard } from 'electron';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { paperMain } from '../../canvas';
import { DEFAULT_STYLE, DEFAULT_TRANSFORM, DEFAULT_ARTBOARD_BACKGROUND_COLOR, DEFAULT_TEXT_VALUE } from '../../constants';
import { getPaperFillColor, getPaperStrokeColor, getPaperLayer, getPaperShadowColor } from '../utils/paper';
import { getClipboardCenter, getSelectionCenter, getLayerAndDescendants, getLayersBounds, importPaperProject, colorsMatch, gradientsMatch, getNearestScopeAncestor } from '../selectors/layer';
import { getLayerStyle, getLayerTransform, getLayerShapeOpts, getLayerFrame, getLayerPathData, getLayerTextStyle } from '../utils/actions';

import { bufferToBase64 } from '../../utils';

import { addDocumentImage } from './documentSettings';
import { setTweenDrawerEvent } from './tweenDrawer';
import { updateHoverFrame, updateSelectionFrame, updateActiveArtboardFrame, updateTweenEventsFrame, updateGradientFrame } from '../utils/layer';
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
  DisableLayerHorizontalFlipPayload,
  EnableLayerVerticalFlipPayload,
  DisableLayerVerticalFlipPayload,
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
  AddInViewLayerPayload,
  AddInViewLayersPayload,
  RemoveInViewLayerPayload,
  RemoveInViewLayersPayload,
  SetLayerFillPayload,
  SetLayerFillTypePayload,
  SetLayersFillTypePayload,
  AddLayersMaskPayload,
  RemoveLayersMaskPayload,
  MaskLayerPayload,
  UnmaskLayerPayload,
  MaskLayersPayload,
  UnmaskLayersPayload,
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
  SendLayerForwardPayload,
  SendLayersForwardPayload,
  SendLayerToFrontPayload,
  SendLayersToFrontPayload,
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
  LayerTypes
} from '../actionTypes/layer';

// Artboard

export const addArtboard = (payload: AddArtboardPayload): LayerTypes => ({
  type: ADD_ARTBOARD,
  payload
});

export const addArtboardThunk = (payload: AddArtboardPayload) => {
  return (dispatch: any, getState: any): Promise<em.Artboard> => {
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const style = getLayerStyle(payload, {}, { fill: { color: DEFAULT_ARTBOARD_BACKGROUND_COLOR } as em.Fill, stroke: { enabled: false } as em.Stroke, shadow: { enabled: false } as em.Shadow });
    const frame = getLayerFrame(payload);
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as em.PaperGradientFill : null;
    // create background
    const artboardBackground = new paperMain.Path.Rectangle({
      point: new paperMain.Point(0,0),
      size: [payload.layer.frame.width, payload.layer.frame.height],
      data: { id: 'ArtboardBackground', type: 'LayerChild', layerType: 'Artboard' },
      fillColor: paperFillColor,
      position: new paperMain.Point(payload.layer.frame.x, payload.layer.frame.y),
    });
    // create mask
    const artboardMask = artboardBackground.clone();
    artboardMask.data = { id: 'ArtboardMask', type: 'LayerChild', layerType: 'Artboard' };
    artboardMask.clipMask = true;
    // create artboard group
    const artboard = new paperMain.Group({
      data: { id: id, type: 'Layer', layerType: 'Artboard' },
      children: [artboardMask, artboardBackground],
      parent: getPaperLayer('page')
    });
    // dispatch action
    const newLayer = {
      type: 'Artboard',
      id: id,
      name: payload.layer.name ? payload.layer.name : 'Artboard',
      parent: payload.layer.parent,
      frame: payload.layer.frame,
      children: [],
      selected: false,
      showChildren: false,
      tweenEvents: [],
      tweens: [],
      mask: false,
      masked: false,
      transform: DEFAULT_TRANSFORM,
      style: DEFAULT_STYLE
    } as em.Artboard;
    if (!payload.batch) {
      dispatch(addArtboard({
        layer: newLayer,
        batch: payload.batch
      }));
    }
    return Promise.resolve(newLayer);
  }
};

// Group

export const addGroup = (payload: AddGroupPayload): LayerTypes => ({
  type: ADD_GROUP,
  payload
});

export const addGroupThunk = (payload: AddGroupPayload) => {
  return (dispatch: any, getState: any): Promise<em.Group> => {
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const style = getLayerStyle(payload, {}, { fill: { enabled: false } as em.Fill, stroke: { enabled: false } as em.Stroke, shadow: { enabled: false } as em.Shadow });
    const name = payload.layer.name ? payload.layer.name : 'Group';
    const parent = payload.layer.parent ? payload.layer.parent : 'page';
    const masked = payload.layer.masked ? payload.layer.masked : false;
    const clipped = payload.layer.clipped ? payload.layer.clipped : false;
    new paperMain.Group({
      data: { id: id, type: 'Layer', layerType: 'Group' },
      parent: getPaperLayer(parent)
    });
    const newLayer = {
      type: 'Group',
      id: id,
      name: name,
      parent: parent,
      frame: payload.layer.frame,
      children: [],
      selected: false,
      showChildren: false,
      tweenEvents: [],
      tweens: [],
      mask: false,
      masked: masked,
      clipped: clipped,
      transform: DEFAULT_TRANSFORM,
      style
    } as em.Group;
    if (!payload.batch) {
      dispatch(addGroup({
        layer: newLayer,
        batch: payload.batch
      }));
    }
    return Promise.resolve(newLayer);
  }
};

// Shape

export const addShape = (payload: AddShapePayload): LayerTypes => ({
  type: ADD_SHAPE,
  payload
});

export const addShapeThunk = (payload: AddShapePayload) => {
  return (dispatch: any, getState: any): Promise<em.Shape> => {
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const parent = payload.layer.parent ? payload.layer.parent : 'page';
    const shapeType = payload.layer.shapeType ? payload.layer.shapeType : 'Rectangle';
    const name = payload.layer.name ? payload.layer.name : shapeType;
    const frame = getLayerFrame(payload);
    const shapeOpts = getLayerShapeOpts(payload);
    const pathData = getLayerPathData(payload);
    const style = getLayerStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as em.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new paperMain.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as em.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as em.PaperGradientFill : null;
    const mask = payload.layer.mask ? payload.layer.mask : false;
    const masked = payload.layer.masked ? payload.layer.masked : false;
    const paperLayer = new paperMain.CompoundPath({
      pathData: pathData,
      closed: shapeType !== 'Line',
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
      data: { id, type: 'Layer', layerType: 'Shape' },
      parent: getPaperLayer(parent)
    });
    paperLayer.children.forEach((item) => item.data = { id: 'ShapePartial', type: 'LayerChild', layerType: 'Shape' });
    paperLayer.position = new paperMain.Point(frame.x, frame.y);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    const newLayer = {
      type: 'Shape',
      id: id,
      name: name,
      parent: parent,
      shapeType: shapeType,
      frame: frame,
      selected: false,
      children: null,
      tweenEvents: [],
      tweens: [],
      mask,
      masked,
      style,
      transform,
      pathData,
      ...shapeOpts
    } as em.Shape;
    if (!payload.batch) {
      dispatch(addShape({
        layer: newLayer,
        batch: payload.batch
      }));
    }
    return Promise.resolve(newLayer);
  }
};

// Text

export const addText = (payload: AddTextPayload): LayerTypes => ({
  type: ADD_TEXT,
  payload
});

export const addTextThunk = (payload: AddTextPayload) => {
  return (dispatch: any, getState: any): Promise<em.Text> => {
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const textContent = payload.layer.text ? payload.layer.text : DEFAULT_TEXT_VALUE;
    const name = payload.layer.name ? payload.layer.name : textContent;
    const masked = payload.layer.masked ? payload.layer.masked : false;
    const parent = payload.layer.parent ? payload.layer.parent : 'page';
    const style = getLayerStyle(payload);
    const textStyle = getLayerTextStyle(payload);
    const transform = getLayerTransform(payload);
    const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as em.Shadow) : null;
    const paperShadowOffset = style.shadow.enabled ? new paperMain.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
    const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
    const paperLayer = new paperMain.PointText({
      point: new paperMain.Point(0, 0),
      content: textContent,
      data: { id, type: 'Layer', layerType: 'Text' },
      parent: getPaperLayer(parent),
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
    const frame = getLayerFrame(payload, { width: paperLayer.bounds.width, height: paperLayer.bounds.height, innerWidth: paperLayer.bounds.width, innerHeight: paperLayer.bounds.height });
    const paperFillColor = style.fill.enabled ? getPaperFillColor(style.fill, frame) as em.PaperGradientFill : null;
    const paperStrokeColor = style.stroke.enabled ? getPaperStrokeColor(style.stroke, frame) as em.PaperGradientFill : null;
    paperLayer.position = new paperMain.Point(frame.x, frame.y);
    paperLayer.fillColor = paperFillColor;
    paperLayer.strokeColor = paperStrokeColor;
    const newLayer = {
      type: 'Text',
      id: id,
      name: name,
      parent: parent,
      text: textContent,
      frame: frame,
      selected: false,
      mask: false,
      masked: masked,
      children: null,
      tweenEvents: [],
      tweens: [],
      style,
      transform,
      textStyle
    } as em.Text;
    if (!payload.batch) {
      dispatch(addText({
        layer: newLayer,
        batch: payload.batch
      }));
    }
    return Promise.resolve(newLayer);
  }
};

// Image

export const addImage = (payload: AddImagePayload): LayerTypes => ({
  type: ADD_IMAGE,
  payload
});

export const addImageThunk = (payload: AddImagePayload) => {
  return (dispatch: any, getState: any): Promise<em.Image> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      const frame = getLayerFrame(payload);
      const newBuffer = Buffer.from(payload.buffer);
      const exists = state.documentSettings.images.allIds.length > 0 && state.documentSettings.images.allIds.find((id) => Buffer.from(state.documentSettings.images.byId[id].buffer).equals(newBuffer));
      const base64 = bufferToBase64(newBuffer);
      const id = payload.layer.id ? payload.layer.id : uuidv4();
      const imageId = exists ? exists : payload.layer.imageId ? payload.layer.imageId : uuidv4();
      const masked = payload.layer.masked ? payload.layer.masked : false;
      const parent = payload.layer.parent ? payload.layer.parent : 'page';
      const style = getLayerStyle(payload, {}, { fill: { enabled: false } as em.Fill, stroke: { enabled: false } as em.Stroke });
      const transform = getLayerTransform(payload);
      const paperShadowColor = style.shadow.enabled ? getPaperShadowColor(style.shadow as em.Shadow) : null;
      const paperShadowOffset = style.shadow.enabled ? new paperMain.Point(style.shadow.offset.x, style.shadow.offset.y) : null;
      const paperShadowBlur = style.shadow.enabled ? style.shadow.blur : null;
      const paperLayer = new paperMain.Raster(`data:image/webp;base64,${base64}`);
      const imageContainer = new paperMain.Group({
        parent: getPaperLayer(parent),
        data: { id, imageId, type: 'Layer', layerType: 'Image' },
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
          name: payload.layer.name ? payload.layer.name : 'Image',
          parent: parent,
          frame: frame,
          selected: false,
          mask: false,
          masked: masked,
          children: null,
          tweenEvents: [],
          tweens: [],
          style,
          transform,
          imageId
        } as em.Image;
        if (!exists) {
          dispatch(addDocumentImage({id: imageId, buffer: newBuffer}));
        }
        if (!payload.batch) {
          dispatch(addImage({
            layer: newLayer,
            batch: payload.batch
          }));
        }
        resolve(newLayer);
      }
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
        switch(layer.type) {
          case 'Artboard':
            promises.push(dispatch(addArtboardThunk({layer: layer as em.Artboard, batch: true})));
            break;
          case 'Shape':
            promises.push(dispatch(addShapeThunk({layer: layer as em.Shape, batch: true})));
            break;
          case 'Image':
            promises.push(dispatch(addImageThunk({layer: layer as em.Image, batch: true, buffer: payload.buffers[(layer as em.Image).imageId].buffer})));
            break;
          case 'Group':
            promises.push(dispatch(addGroupThunk({layer: layer as em.Group, batch: true})));
            break;
          case 'Text':
            promises.push(dispatch(addTextThunk({layer: layer as em.Text, batch: true})));
            break;
        }
      });
      Promise.all(promises).then(() => {
        dispatch(addLayers({layers: payload.layers}));
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

export const removeLayersThunk = (payload: RemoveLayersPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState();
    if (state.layer.present.selected.length > 0 && state.canvasSettings.focusing) {
      if (state.tweenDrawer.isOpen && state.tweenDrawer.event) {
        const tweenEvent = state.layer.present.tweenEventById[state.tweenDrawer.event];
        let layersAndChildren: string[] = [];
        state.layer.present.selected.forEach((id) => {
          layersAndChildren = [...layersAndChildren, ...getLayerAndDescendants(state.layer.present, id)];
        });
        if (layersAndChildren.includes(tweenEvent.layer) || layersAndChildren.includes(tweenEvent.artboard) || layersAndChildren.includes(tweenEvent.destinationArtboard)) {
          dispatch(setTweenDrawerEvent({id: null}));
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

export const escapeLayerScopeThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const nextScope = state.layer.present.scope.filter((id, index) => index !== state.layer.present.scope.length - 1);
    if (state.layer.present.scope.length > 0) {
      const leftSidebar = document.getElementById('sidebar-scroll-left');
      const layerDomItem = document.getElementById(state.layer.present.scope[state.layer.present.scope.length - 1]);
      if (layerDomItem) {
        gsap.set(leftSidebar, {
          scrollTo: layerDomItem
        });
      }
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
      })).then((newGroup: em.Group) => {
        dispatch(groupLayers({...payload, group: newGroup}));
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

export const enableLayersFill = (payload: EnableLayersFillPayload): LayerTypes => ({
  type: ENABLE_LAYERS_FILL,
  payload
});

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

export const addInViewLayer = (payload: AddInViewLayerPayload): LayerTypes => ({
  type: ADD_IN_VIEW_LAYER,
  payload
});

export const addInViewLayers = (payload: AddInViewLayersPayload): LayerTypes => ({
  type: ADD_IN_VIEW_LAYERS,
  payload
});

export const removeInViewLayer = (payload: RemoveInViewLayerPayload): LayerTypes => ({
  type: REMOVE_IN_VIEW_LAYER,
  payload
});

export const removeInViewLayers = (payload: RemoveInViewLayersPayload): LayerTypes => ({
  type: REMOVE_IN_VIEW_LAYERS,
  payload
});

export const updateInViewLayers = (): LayerTypes => ({
  type: UPDATE_IN_VIEW_LAYERS
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

export const addLayersMask = (payload: AddLayersMaskPayload): LayerTypes => ({
  type: ADD_LAYERS_MASK,
  payload
});

export const addLayersMaskThunk = (payload: AddLayersMaskPayload) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      dispatch(addGroupThunk({
        layer: {
          clipped: true,
          name: 'Masked Group'
        },
        batch: true
      })).then((newGroup: em.Group) => {
        dispatch(addLayersMask({...payload, group: newGroup}));
        resolve();
      });
    });
  }
}

export const removeLayersMask = (payload: RemoveLayersMaskPayload): LayerTypes => ({
  type: REMOVE_LAYERS_MASK,
  payload
});

export const maskLayer = (payload: MaskLayerPayload): LayerTypes => ({
  type: MASK_LAYER,
  payload
});

export const unmaskLayer = (payload: UnmaskLayerPayload): LayerTypes => ({
  type: UNMASK_LAYER,
  payload
});

export const maskLayers = (payload: MaskLayersPayload): LayerTypes => ({
  type: MASK_LAYERS,
  payload
});

export const unmaskLayers = (payload: UnmaskLayersPayload): LayerTypes => ({
  type: UNMASK_LAYERS,
  payload
});

export const alignLayersToLeft = (payload: AlignLayersToLeftPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_LEFT,
  payload
});

export const alignLayersToRight = (payload: AlignLayersToRightPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_RIGHT,
  payload
});

export const alignLayersToTop = (payload: AlignLayersToTopPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_TOP,
  payload
});

export const alignLayersToBottom = (payload: AlignLayersToBottomPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_BOTTOM,
  payload
});

export const alignLayersToCenter = (payload: AlignLayersToCenterPayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_CENTER,
  payload
});

export const alignLayersToMiddle = (payload: AlignLayersToMiddlePayload): LayerTypes => ({
  type: ALIGN_LAYERS_TO_MIDDLE,
  payload
});

export const distributeLayersHorizontally = (payload: DistributeLayersHorizontallyPayload): LayerTypes => ({
  type: DISTRIBUTE_LAYERS_HORIZONTALLY,
  payload
});

export const distributeLayersVertically = (payload: DistributeLayersVerticallyPayload): LayerTypes => ({
  type: DISTRIBUTE_LAYERS_VERTICALLY,
  payload
});

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

export const sendLayerForward = (payload: SendLayerForwardPayload): LayerTypes => ({
  type: SEND_LAYER_FORWARD,
  payload
});

export const sendLayersForward = (payload: SendLayersForwardPayload): LayerTypes => ({
  type: SEND_LAYERS_FORWARD,
  payload
});

export const sendLayerToFront = (payload: SendLayerToFrontPayload): LayerTypes => ({
  type: SEND_LAYER_TO_FRONT,
  payload
});

export const sendLayersToFront = (payload: SendLayersToFrontPayload): LayerTypes => ({
  type: SEND_LAYERS_TO_FRONT,
  payload
});

export const sendLayerBackward = (payload: SendLayerBackwardPayload): LayerTypes => ({
  type: SEND_LAYER_BACKWARD,
  payload
});

export const sendLayersBackward = (payload: SendLayersBackwardPayload): LayerTypes => ({
  type: SEND_LAYERS_BACKWARD,
  payload
});

export const sendLayerToBack = (payload: SendLayerToBackPayload): LayerTypes => ({
  type: SEND_LAYER_TO_BACK,
  payload
});

export const sendLayersToBack = (payload: SendLayersToBackPayload): LayerTypes => ({
  type: SEND_LAYERS_TO_BACK,
  payload
});

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

export const applyBooleanOperationThunk = (payload: UniteLayersPayload | IntersectLayersPayload | SubtractLayersPayload | ExcludeLayersPayload | DivideLayersPayload, booleanOperation: em.BooleanOperation) => {
  return (dispatch: any, getState: any): Promise<em.Shape> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      const layerItem = state.layer.present.byId[payload.id];
      const paperLayer = getPaperLayer(payload.id) as paper.Path | paper.CompoundPath;
      const booleanPaperLayer = getPaperLayer((payload as any)[booleanOperation]) as paper.Path | paper.CompoundPath;
      const booleanLayers = paperLayer[booleanOperation](booleanPaperLayer, { insert: false }) as paper.Path | paper.CompoundPath;
      dispatch(addShapeThunk({
        layer: {
          shapeType: 'Custom',
          pathData: booleanLayers.pathData,
          parent: layerItem.parent,
          frame: {
            x: booleanLayers.position.x,
            y: booleanLayers.position.y,
            width: booleanLayers.bounds.width,
            height: booleanLayers.bounds.height,
            innerWidth: booleanLayers.bounds.width,
            innerHeight: booleanLayers.bounds.height
          }
        },
        batch: true
      })).then((newShape: em.Shape) => {
        switch(booleanOperation) {
          case 'divide':
            dispatch(divideLayers({
              id: payload.id,
              [booleanOperation]: (payload as DivideLayersPayload)[booleanOperation],
              booleanLayer: newShape
            }));
            break;
          case 'exclude':
            dispatch(excludeLayers({
              id: payload.id,
              [booleanOperation]: (payload as ExcludeLayersPayload)[booleanOperation],
              booleanLayer: newShape
            }));
            break;
          case 'intersect':
            dispatch(intersectLayers({
              id: payload.id,
              [booleanOperation]: (payload as IntersectLayersPayload)[booleanOperation],
              booleanLayer: newShape
            }));
            break;
          case 'subtract':
            dispatch(subtractLayers({
              id: payload.id,
              [booleanOperation]: (payload as SubtractLayersPayload)[booleanOperation],
              booleanLayer: newShape
            }));
            break;
          case 'unite':
            dispatch(uniteLayers({
              id: payload.id,
              [booleanOperation]: (payload as UniteLayersPayload)[booleanOperation],
              booleanLayer: newShape
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

export const copyLayersThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
      const layers = state.layer.present.selected.reduce((result, current) => {
        const layerAndDescendants = getLayerAndDescendants(state.layer.present, current);
        const imageLayers = layerAndDescendants.filter(id => state.layer.present.byId[id].type === 'Image');
        const imageBuffers = imageLayers.reduce((bufferResult, bufferCurrent) => {
          const imageId = (state.layer.present.byId[bufferCurrent] as em.Image).imageId;
          if (!Object.keys(bufferResult).includes(imageId)) {
            bufferResult[imageId] = state.documentSettings.images.byId[imageId];
          }
          return bufferResult;
        }, {} as { [id: string]: em.DocumentImage });
        result.images = { ...result.images, ...imageBuffers };
        result.main = [...result.main, current];
        result.allIds = [...result.allIds, ...layerAndDescendants];
        result.byId = layerAndDescendants.reduce((lr, cr) => {
          lr = {
            ...lr,
            [cr]: {
              ...state.layer.present.byId[cr],
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
      }, { type: 'layers', main: [], allIds: [], byId: {}, images: {} } as em.ClipboardLayers);
      clipboard.writeText(JSON.stringify(layers));
    }
  }
};

export const pasteLayersThunk = ({ overSelection, overPoint, overLayer }: { overSelection?: boolean; overPoint?: em.Point; overLayer?: string }) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const state = getState() as RootState;
      if (state.canvasSettings.focusing) {
        try {
          const text = clipboard.readText();
          const parsedText: em.ClipboardLayers = JSON.parse(text);
          if (parsedText.type && parsedText.type === 'layers') {
            const replaceAll = (str: string, find: string, replace: string) => {
              return str.replace(new RegExp(find, 'g'), replace);
            };
            const withNewIds: string = parsedText.allIds.reduce((result: string, current: string) => {
              const newId = uuidv4();
              result = replaceAll(result, current, newId);
              return result;
            }, text);
            const newParse: em.ClipboardLayers = JSON.parse(withNewIds);
            const newLayers: em.Layer[] = Object.keys(newParse.byId).reduce((result, current) => {
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
              const selectionPosition = getSelectionCenter(state.layer.present, true);
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

const undo = () => {
  return (dispatch: any, getState: any) => {
    return new Promise((resolve, reject) => {
      dispatch(ActionCreators.undo());
      resolve();
    });
  }
}

const redo = () => {
  return (dispatch: any, getState: any) => {
    return new Promise((resolve, reject) => {
      dispatch(ActionCreators.redo());
      resolve();
    });
  }
}

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
        updateGradientFrame(layerItems[0], (style as em.Fill | em.Stroke).gradient, state.theme.theme);
        // check if prev action creator was for gradient
        if (gradientsMatch((style as em.Fill | em.Stroke).gradient, (prevStyle as em.Fill | em.Stroke).gradient)) {
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
}

export const undoThunk = () => {
  return (dispatch: any, getState: any) => {
    let state = getState() as RootState;
    if (state.layer.past.length > 0) {
      // remove hover
      dispatch(setLayerHover({id: null}));
      // undo
      dispatch(undo()).then(() => {
        state = getState() as RootState;
        // import past paper project
        importPaperProject({
          paperProject: state.layer.present.paperProject,
          documentImages: state.documentSettings.images.byId,
          layers: {
            shape: state.layer.present.allShapeIds,
            artboard: state.layer.present.allArtboardIds,
            text: state.layer.present.allTextIds,
            image: state.layer.present.allImageIds
          }
        });
        // update editors
        updateEditors(dispatch, state, 'undo');
        // update frames
        if (!state.gradientEditor.isOpen) {
          updateHoverFrame(state.layer.present);
          updateSelectionFrame(state.layer.present);
        }
        updateActiveArtboardFrame(state.layer.present);
        if (state.tweenDrawer.isOpen && state.layer.present.allTweenEventIds.length > 0) {
          updateTweenEventsFrame(state.layer.present, state.tweenDrawer.event === null ? state.layer.present.allTweenEventIds.reduce((result, current) => {
            const tweenEvent = state.layer.present.tweenEventById[current];
            if (tweenEvent.artboard === state.layer.present.activeArtboard || current === state.tweenDrawer.eventHover) {
              result = [...result, tweenEvent];
            }
            return result;
          }, []) : [state.layer.present.tweenEventById[state.tweenDrawer.event]], state.tweenDrawer.eventHover, state.theme.theme);
        }
      });
    }
  }
};

export const redoThunk = () => {
  return (dispatch: any, getState: any) => {
    let state = getState() as RootState;
    if (state.layer.future.length > 0) {
      // remove hover
      dispatch(setLayerHover({id: null}));
      // redo
      dispatch(redo()).then(() => {
        // get state
        state = getState() as RootState;
        // import future paper project
        importPaperProject({
          paperProject: state.layer.present.paperProject,
          documentImages: state.documentSettings.images.byId,
          layers: {
            shape: state.layer.present.allShapeIds,
            artboard: state.layer.present.allArtboardIds,
            text: state.layer.present.allTextIds,
            image: state.layer.present.allImageIds
          }
        });
        // update editors
        updateEditors(dispatch, state, 'redo');
        // update frames
        if (!state.gradientEditor.isOpen) {
          updateHoverFrame(state.layer.present);
          updateSelectionFrame(state.layer.present);
        }
        updateActiveArtboardFrame(state.layer.present);
        if (state.tweenDrawer.isOpen && state.layer.present.allTweenEventIds.length > 0) {
          updateTweenEventsFrame(state.layer.present, state.tweenDrawer.event === null ? state.layer.present.allTweenEventIds.reduce((result, current) => {
            const tweenEvent = state.layer.present.tweenEventById[current];
            if (tweenEvent.artboard === state.layer.present.activeArtboard || current === state.tweenDrawer.eventHover) {
              result = [...result, tweenEvent];
            }
            return result;
          }, []) : [state.layer.present.tweenEventById[state.tweenDrawer.event]], state.tweenDrawer.eventHover, state.theme.theme);
        }
      });
    }
  }
};