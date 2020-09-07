import { v4 as uuidv4 } from 'uuid';
import { paperMain } from '../../canvas';
import { DEFAULT_STYLE, DEFAULT_TRANSFORM, DEFAULT_ARTBOARD_BACKGROUND_COLOR, DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DEFAULT_TEXT_STYLE, DEFAULT_SHADOW_STYLE, DEFAULT_BLEND_MODE, DEFAULT_OPACITY, DEFAULT_STROKE_DASH_ARRAY, DEFAULT_STROKE_DASH_OFFSET, DEFAULT_STROKE_CAP, DEFAULT_STROKE_JOIN, DEFAULT_ROTATION, DEFAULT_HORIZONTAL_FLIP, DEFAULT_VERTICAL_FLIP, DEFAULT_TEXT_VALUE, DEFAULT_FONT_SIZE, DEFAULT_FONT_WEIGHT, DEFAULT_FONT_FAMILY, DEFAULT_JUSTIFICATION, DEFAULT_LEADING, DEFAULT_SHADOW_COLOR, DEFAULT_SHADOW_OFFSET_X, DEFAULT_SHADOW_OFFSET_Y, DEFAULT_SHADOW_BLUR, DEFAULT_SHAPE_WIDTH, DEFAULT_SHAPE_HEIGHT, DEFAULT_STAR_POINTS, DEFAULT_ROUNDED_RADIUS, DEFAULT_STAR_RADIUS, DEFAULT_POLYGON_SIDES } from '../../constants';
import { applyImageMethods } from '../../canvas/imageUtils';
import { applyShapeMethods } from '../../canvas/shapeUtils';
import { applyTextMethods } from '../../canvas/textUtils';
import { applyArtboardMethods } from '../../canvas/artboardUtils';
import { getCurvePoints } from '../selectors/layer';
import { getPaperFillColor, getPaperStrokeColor, getPaperLayer, getPaperShadowColor, getPaperShapePathData } from '../utils/paper';
import { bufferToBase64 } from '../../utils';

import { addDocumentImage } from './documentSettings';

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
  SET_CURVE_POINT_ORIGIN,
  SET_CURVE_POINT_ORIGIN_X,
  SET_CURVE_POINT_ORIGIN_Y,
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
  SetCurvePointOriginPayload,
  SetCurvePointOriginXPayload,
  SetCurvePointOriginYPayload,
  SetLayerEditPayload,
  LayerTypes
} from '../actionTypes/layer';
import { RootState } from '../reducers';

// Artboard

export const addArtboard = (payload: AddArtboardPayload): LayerTypes => ({
  type: ADD_ARTBOARD,
  payload
});

export const addArtboardThunk = (payload: AddArtboardPayload) => {
  return (dispatch: any, getState: any) => {
    const id = payload.id ? payload.id : uuidv4();
    // create background
    const artboardBackground = new paperMain.Path.Rectangle({
      point: new paperMain.Point(0,0),
      size: [payload.frame.width, payload.frame.height],
      data: { id: 'ArtboardBackground', type: 'ArtboardBackground' },
      fillColor: DEFAULT_ARTBOARD_BACKGROUND_COLOR,
      position: new paperMain.Point(payload.frame.x, payload.frame.y),
    });
    // create mask
    const artboardMask = artboardBackground.clone();
    artboardMask.data = { id: 'ArtboardMask', type: 'ArtboardMask' };
    artboardMask.clipMask = true;
    // create artboard group
    const artboard = new paperMain.Group({
      data: { id: id, type: 'Artboard' },
      children: [artboardMask, artboardBackground],
      parent: getPaperLayer('page')
    });
    // apply artboard methods to background
    applyArtboardMethods(artboard);
    // dispatch action
    dispatch(addArtboard({
      ...payload,
      type: 'Artboard',
      id: id,
      name: payload.name ? payload.name : 'Artboard',
      parent: payload.parent,
      frame: payload.frame,
      children: [],
      selected: false,
      showChildren: false,
      tweenEvents: [],
      tweens: [],
      mask: false,
      masked: false,
      transform: DEFAULT_TRANSFORM,
      style: DEFAULT_STYLE
    }));
  }
};

// Group

export const addGroup = (payload: AddGroupPayload): LayerTypes => ({
  type: ADD_GROUP,
  payload
});

export const addGroupThunk = (payload: AddGroupPayload) => {
  return (dispatch: any, getState: any) => {
    const id = payload.id ? payload.id : uuidv4();
    const parent = payload.parent ? payload.parent : 'page';
    new paperMain.Group({
      data: { id: id, type: 'Group' },
      parent: getPaperLayer(parent)
    });
    dispatch(addGroup({
      ...payload,
      type: 'Group',
      id: id,
      name: payload.name ? payload.name : 'Group',
      parent: parent,
      frame: payload.frame,
      children: [],
      selected: false,
      showChildren: false,
      tweenEvents: [],
      tweens: [],
      mask: false,
      masked: payload.masked ? payload.masked : false,
      clipped: false,
      transform: DEFAULT_TRANSFORM,
      style: {
        ...DEFAULT_STYLE,
        fill: {
          ...DEFAULT_STYLE.fill,
          enabled: false
        },
        stroke: {
          ...DEFAULT_STYLE.stroke,
          enabled: false
        }
      }
    }));
  }
};

// Shape

export const addShape = (payload: AddShapePayload): LayerTypes => ({
  type: ADD_SHAPE,
  payload
});

export const addShapeThunk = (payload: AddShapePayload) => {
  return (dispatch: any, getState: any) => {
    const id = payload.id ? payload.id : uuidv4();
    const parent = payload.parent ? payload.parent : 'page';
    const x = payload.frame && payload.frame.x ? payload.frame.x : paperMain.view.center.x;
    const y = payload.frame && payload.frame.y ? payload.frame.y : paperMain.view.center.y;
    const width = payload.frame && payload.frame.width ? payload.frame.width : DEFAULT_SHAPE_WIDTH;
    const height = payload.frame && payload.frame.width ? payload.frame.height : DEFAULT_SHAPE_HEIGHT;
    const innerWidth = payload.frame && payload.frame.innerWidth ? payload.frame.innerWidth : DEFAULT_SHAPE_WIDTH;
    const innerHeight = payload.frame && payload.frame.innerHeight ? payload.frame.innerHeight : DEFAULT_SHAPE_HEIGHT;
    const frame = { x, y, width, height, innerWidth, innerHeight };
    const shapeType = payload.shapeType ? payload.shapeType : 'Rectangle';
    const name = payload.name ? payload.name : shapeType;
    const hasRadius = payload.shapeType === 'Rounded' || payload.shapeType === 'Star';
    const radius = hasRadius ? (payload as em.Star | em.Rounded).radius ? (payload as em.Star | em.Rounded).radius : payload.shapeType === 'Rounded' ? DEFAULT_ROUNDED_RADIUS : DEFAULT_STAR_RADIUS : null;
    const points = payload.shapeType === 'Star' ? (payload as em.Star).points ? (payload as em.Star).points : DEFAULT_STAR_POINTS : null;
    const sides = payload.shapeType === 'Polygon' ? (payload as em.Polygon).sides ? (payload as em.Polygon).sides : DEFAULT_POLYGON_SIDES : null;
    const pathData = payload.path && payload.path.data ? payload.path.data : getPaperShapePathData(shapeType, innerWidth, innerHeight, x, y, { radius, points, sides });
    const closed = payload.path && (payload.path.closed !== null || payload.path.closed !== undefined) ? payload.path.closed : true;
    const path = { data: pathData, closed: closed, points: getCurvePoints(new paperMain.Path({pathData, insert: false})) };
    const fill = payload.style && payload.style.fill ? {...DEFAULT_TEXT_STYLE, ...payload.style.fill} : DEFAULT_FILL_STYLE;
    const paperFillColor = getPaperFillColor(fill, payload.frame);
    const stroke = payload.style && payload.style.stroke ? {...DEFAULT_STROKE_STYLE, ...payload.style.stroke} : DEFAULT_STROKE_STYLE;
    const paperStrokeColor = getPaperStrokeColor(stroke, payload.frame);
    const shadowEnabled = payload.style && payload.style.shadow && payload.style.shadow.enabled ? payload.style.shadow.enabled : false;
    const shadowColor = payload.style && payload.style.shadow && payload.style.shadow.color ? {...DEFAULT_SHADOW_COLOR, ...payload.style.shadow.color} : DEFAULT_SHADOW_COLOR;
    const shadowOffsetX = payload.style && payload.style.shadow && payload.style.shadow.offset.x ? payload.style.shadow.offset.x : DEFAULT_SHADOW_OFFSET_X;
    const shadowOffsetY = payload.style && payload.style.shadow && payload.style.shadow.offset.y ? payload.style.shadow.offset.y : DEFAULT_SHADOW_OFFSET_Y;
    const shadowBlur = payload.style && payload.style.shadow && payload.style.shadow.blur ? payload.style.shadow.blur : DEFAULT_SHADOW_BLUR;
    const shadow = { enabled: shadowEnabled, fillType: 'color', color: shadowColor, offset: { x: shadowOffsetX, y: shadowOffsetY }, blur: shadowBlur } as em.Shadow;
    const paperShadowColor = getPaperShadowColor(shadow as em.Shadow);
    const opacity = payload.style && payload.style.opacity ? payload.style.opacity : DEFAULT_OPACITY;
    const blendMode = payload.style && payload.style.blendMode ? payload.style.blendMode : DEFAULT_BLEND_MODE;
    const dashArray = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.dashArray ? payload.style.strokeOptions.dashArray : DEFAULT_STROKE_DASH_ARRAY;
    const dashOffset = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.dashOffset ? payload.style.strokeOptions.dashOffset : DEFAULT_STROKE_DASH_OFFSET;
    const strokeCap = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.cap ? payload.style.strokeOptions.cap : DEFAULT_STROKE_CAP;
    const strokeJoin = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.join ? payload.style.strokeOptions.join : DEFAULT_STROKE_JOIN;
    const mask = payload.mask ? payload.mask : false;
    const masked = payload.masked ? payload.masked : false;
    const rotation = payload.transform && payload.transform.rotation ? payload.transform.rotation : DEFAULT_ROTATION;
    const horizontalFlip = payload.transform && payload.transform.horizontalFlip ? payload.transform.horizontalFlip : DEFAULT_HORIZONTAL_FLIP;
    const verticalFlip = payload.transform && payload.transform.verticalFlip ? payload.transform.verticalFlip : DEFAULT_VERTICAL_FLIP;
    const transform = { rotation, horizontalFlip, verticalFlip };
    const strokeOptions = { cap: strokeCap, join: strokeJoin, dashArray, dashOffset };
    const style = { fill, stroke, shadow, blendMode, opacity, strokeOptions };
    const paperLayer = new paperMain.CompoundPath({
      pathData: pathData,
      closed: closed,
      strokeWidth: stroke.width,
      shadowColor: shadow.enabled ? paperShadowColor : null,
      shadowOffset: shadow.enabled ? new paperMain.Point(shadow.offset.x, shadow.offset.y) : null,
      shadowBlur: shadow.enabled ? shadow.blur : null,
      blendMode: blendMode,
      opacity: opacity,
      dashArray: dashArray,
      dashOffset: dashOffset,
      strokeCap: strokeCap,
      strokeJoin: strokeJoin,
      clipMask: mask,
      data: { id, type: 'Shape' },
      parent: getPaperLayer(parent)
    });
    paperLayer.children.forEach((item) => item.data = { id: 'ShapePartial' });
    paperLayer.position = new paperMain.Point(frame.x, frame.y);
    paperLayer.fillColor = fill.enabled ? paperFillColor as em.PaperGradientFill : null;
    paperLayer.strokeColor = stroke.enabled ? paperStrokeColor as em.PaperGradientFill : null;
    applyShapeMethods(paperLayer);
    dispatch(addShape({
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
      path,
      ...(() => {
        switch(shapeType) {
          case 'Ellipse':
          case 'Rectangle':
            return {};
          case 'Rounded':
            return {
              radius
            };
          case 'Star':
            return {
              points,
              radius
            }
          case 'Polygon':
            return {
              sides
            }
          default:
            return {};
        }
      })()
    }));
  }
};

// Text

export const addText = (payload: AddTextPayload): LayerTypes => ({
  type: ADD_TEXT,
  payload
});

export const addTextThunk = (payload: AddTextPayload) => {
  return (dispatch: any, getState: any) => {
    const id = payload.id ? payload.id : uuidv4();
    const textContent = payload.text ? payload.text : DEFAULT_TEXT_VALUE;
    const name = payload.name ? payload.name : textContent;
    const masked = payload.masked ? payload.masked : false;
    const parent = payload.parent ? payload.parent : 'page';
    const fill = payload.style && payload.style.fill ? {...DEFAULT_TEXT_STYLE, ...payload.style.fill} : DEFAULT_FILL_STYLE;
    const stroke = payload.style && payload.style.stroke ? {...DEFAULT_STROKE_STYLE, ...payload.style.stroke} : DEFAULT_STROKE_STYLE;
    const opacity = payload.style && payload.style.opacity ? payload.style.opacity : DEFAULT_OPACITY;
    const blendMode = payload.style && payload.style.blendMode ? payload.style.blendMode : DEFAULT_BLEND_MODE;
    const shadowEnabled = payload.style && payload.style.shadow && payload.style.shadow.enabled ? payload.style.shadow.enabled : false;
    const shadowColor = payload.style && payload.style.shadow && payload.style.shadow.color ? {...DEFAULT_SHADOW_COLOR, ...payload.style.shadow.color} : DEFAULT_SHADOW_COLOR;
    const shadowOffsetX = payload.style && payload.style.shadow && payload.style.shadow.offset.x ? payload.style.shadow.offset.x : DEFAULT_SHADOW_OFFSET_X;
    const shadowOffsetY = payload.style && payload.style.shadow && payload.style.shadow.offset.y ? payload.style.shadow.offset.y : DEFAULT_SHADOW_OFFSET_Y;
    const shadowBlur = payload.style && payload.style.shadow && payload.style.shadow.blur ? payload.style.shadow.blur : DEFAULT_SHADOW_BLUR;
    const shadow = { enabled: shadowEnabled, fillType: 'color', color: shadowColor, offset: { x: shadowOffsetX, y: shadowOffsetY }, blur: shadowBlur } as em.Shadow;
    const rotation = payload.transform && payload.transform.rotation ? payload.transform.rotation : DEFAULT_ROTATION;
    const horizontalFlip = payload.transform && payload.transform.horizontalFlip ? payload.transform.horizontalFlip : DEFAULT_HORIZONTAL_FLIP;
    const verticalFlip = payload.transform && payload.transform.verticalFlip ? payload.transform.verticalFlip : DEFAULT_VERTICAL_FLIP;
    const dashArray = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.dashArray ? payload.style.strokeOptions.dashArray : DEFAULT_STROKE_DASH_ARRAY;
    const dashOffset = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.dashOffset ? payload.style.strokeOptions.dashOffset : DEFAULT_STROKE_DASH_OFFSET;
    const strokeCap = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.cap ? payload.style.strokeOptions.cap : DEFAULT_STROKE_CAP;
    const strokeJoin = payload.style && payload.style.strokeOptions && payload.style.strokeOptions.join ? payload.style.strokeOptions.join : DEFAULT_STROKE_JOIN;
    const fontSize = payload.textStyle && payload.textStyle.fontSize ? payload.textStyle.fontSize : DEFAULT_FONT_SIZE;
    const fontWeight = payload.textStyle && payload.textStyle.fontWeight ? payload.textStyle.fontWeight : DEFAULT_FONT_WEIGHT;
    const fontFamily = payload.textStyle && payload.textStyle.fontFamily ? payload.textStyle.fontFamily : DEFAULT_FONT_FAMILY;
    const justification = payload.textStyle && payload.textStyle.justification ? payload.textStyle.justification : DEFAULT_JUSTIFICATION;
    const leading = payload.textStyle && payload.textStyle.leading ? payload.textStyle.leading : DEFAULT_LEADING;
    const transform = { rotation, horizontalFlip, verticalFlip };
    const strokeOptions = { cap: strokeCap, join: strokeJoin, dashArray, dashOffset };
    const style = { fill, stroke, shadow, blendMode, opacity, strokeOptions };
    const textStyle = { fontSize, leading, fontWeight, fontFamily, justification };
    const paperFillColor = getPaperFillColor(fill, payload.frame);
    const paperStrokeColor = getPaperStrokeColor(stroke, payload.frame);
    const paperShadowColor = getPaperShadowColor(shadow);
    const paperLayer = new paperMain.PointText({
      point: new paperMain.Point(0, 0),
      content: payload.text,
      data: { id, type: 'Text' },
      parent: getPaperLayer(parent),
      strokeWidth: stroke.width,
      shadowColor: shadow.enabled ? paperShadowColor : null,
      shadowOffset: shadow.enabled ? new paperMain.Point(shadow.offset.x, shadow.offset.y) : null,
      shadowBlur: shadow.enabled ? shadow.blur : null,
      blendMode,
      opacity,
      dashArray,
      dashOffset,
      strokeCap,
      strokeJoin,
      fontSize,
      leading,
      fontWeight,
      fontFamily,
      justification
    });
    const x = payload.frame && payload.frame.x ? payload.frame.x : paperMain.view.center.x;
    const y = payload.frame && payload.frame.y ? payload.frame.y : paperMain.view.center.y;
    const width = paperLayer.bounds.width;
    const height = paperLayer.bounds.height;
    const innerWidth = paperLayer.bounds.width;
    const innerHeight = paperLayer.bounds.height;
    const frame = { x, y, width, height, innerHeight, innerWidth };
    paperLayer.position = new paperMain.Point(payload.frame.x, payload.frame.y);
    paperLayer.fillColor = fill.enabled ? paperFillColor as em.PaperGradientFill : null;
    paperLayer.strokeColor = stroke.enabled ? paperStrokeColor as em.PaperGradientFill : null;
    applyTextMethods(paperLayer);
    dispatch(addText({
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
    }));
  }
};

// Image

export const addImage = (payload: AddImagePayload): LayerTypes => ({
  type: ADD_IMAGE,
  payload
});

export const addImageThunk = (payload: AddImagePayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const newBuffer = Buffer.from(payload.buffer);
    const exists = state.documentSettings.images.allIds.length > 0 && state.documentSettings.images.allIds.find((id) => Buffer.from(state.documentSettings.images.byId[id].buffer).equals(newBuffer));
    const base64 = bufferToBase64(newBuffer);
    const paperLayer = new paperMain.Raster(`data:image/webp;base64,${base64}`);
    paperLayer.onLoad = (): void => {
      const id = payload.id ? payload.id : uuidv4();
      const imageId = exists ? exists : payload.imageId ? payload.imageId : uuidv4();
      const parent = payload.parent ? payload.parent : 'page';
      const x = payload.frame && payload.frame.x ? payload.frame.x : paperMain.view.center.x;
      const y = payload.frame && payload.frame.y ? payload.frame.y : paperMain.view.center.y;
      const width = paperLayer.bounds.width;
      const height = paperLayer.bounds.height;
      const innerWidth = paperLayer.bounds.width;
      const innerHeight = paperLayer.bounds.height;
      const frame = { x, y, width, height, innerWidth, innerHeight };
      const opacity = payload.style && payload.style.opacity ? payload.style.opacity : DEFAULT_OPACITY;
      const blendMode = payload.style && payload.style.blendMode ? payload.style.blendMode : DEFAULT_BLEND_MODE;
      const shadowEnabled = payload.style && payload.style.shadow && payload.style.shadow.enabled ? payload.style.shadow.enabled : false;
      const shadowColor = payload.style && payload.style.shadow && payload.style.shadow.color ? {...DEFAULT_SHADOW_COLOR, ...payload.style.shadow.color} : DEFAULT_SHADOW_COLOR;
      const shadowOffsetX = payload.style && payload.style.shadow && payload.style.shadow.offset.x ? payload.style.shadow.offset.x : DEFAULT_SHADOW_OFFSET_X;
      const shadowOffsetY = payload.style && payload.style.shadow && payload.style.shadow.offset.y ? payload.style.shadow.offset.y : DEFAULT_SHADOW_OFFSET_Y;
      const shadowBlur = payload.style && payload.style.shadow && payload.style.shadow.blur ? payload.style.shadow.blur : DEFAULT_SHADOW_BLUR;
      const shadow = { enabled: shadowEnabled, fillType: 'color', color: shadowColor, offset: { x: shadowOffsetX, y: shadowOffsetY }, blur: shadowBlur } as em.Shadow;
      const rotation = payload.transform && payload.transform.rotation ? payload.transform.rotation : DEFAULT_ROTATION;
      const horizontalFlip = payload.transform && payload.transform.horizontalFlip ? payload.transform.horizontalFlip : DEFAULT_HORIZONTAL_FLIP;
      const verticalFlip = payload.transform && payload.transform.verticalFlip ? payload.transform.verticalFlip : DEFAULT_VERTICAL_FLIP;
      const transform = { rotation, horizontalFlip, verticalFlip };
      const paperShadowColor = getPaperShadowColor(shadow);
      paperLayer.data = { type: 'Raster', id: 'Raster' };
      const imageContainer = new paperMain.Group({
        parent: getPaperLayer(parent),
        data: { id, imageId, type: 'Image' },
        shadowColor: shadow.enabled ? paperShadowColor : null,
        shadowOffset: shadow.enabled ? new paperMain.Point(shadow.offset.x, shadow.offset.y) : null,
        shadowBlur: shadow.enabled ? shadow.blur : null,
        children: [paperLayer]
      });
      imageContainer.position = new paperMain.Point(frame.x, frame.y);
      applyImageMethods(paperLayer);
      if (!exists) {
        dispatch(addDocumentImage({id: imageId, buffer: newBuffer}));
      }
      dispatch(addImage({
        type: 'Image',
        id: id,
        name: payload.name ? payload.name : 'Image',
        parent: parent,
        frame: frame,
        selected: false,
        mask: false,
        masked: payload.masked ? payload.masked : false,
        children: null,
        tweenEvents: [],
        tweens: [],
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
          shadow,
          opacity,
          blendMode
        },
        transform,
        imageId
      }));
    }
  }
};

// layers

export const addLayers = (payload: AddLayersPayload): LayerTypes => ({
  type: ADD_LAYERS,
  payload
});

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

export const setCurvePointOrigin = (payload: SetCurvePointOriginPayload): LayerTypes => ({
  type: SET_CURVE_POINT_ORIGIN,
  payload
});

export const setCurvePointOriginX = (payload: SetCurvePointOriginXPayload): LayerTypes => ({
  type: SET_CURVE_POINT_ORIGIN_X,
  payload
});

export const setCurvePointOriginY = (payload: SetCurvePointOriginYPayload): LayerTypes => ({
  type: SET_CURVE_POINT_ORIGIN_Y,
  payload
});

export const setLayerEdit = (payload: SetLayerEditPayload): LayerTypes => ({
  type: SET_LAYER_EDIT,
  payload: {
    ...payload,
    edit: uuidv4()
  }
});