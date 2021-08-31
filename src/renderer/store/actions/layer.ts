/* eslint-disable @typescript-eslint/no-use-before-define */
import tinyColor from 'tinycolor2';
import { v4 as uuidv4 } from 'uuid';
import { ActionCreators } from 'redux-undo';
import { paperMain } from '../../canvas';
import {
  ARTBOARDS_PER_PROJECT, DEFAULT_TRANSFORM, DEFAULT_TEXT_VALUE,
  TWEEN_PROPS_MAP, DEFAULT_SCROLL
} from '../../constants';
import {
  clearLayerTransforms, applyLayerTransforms, getTextLines, positionTextContent, getTextInnerBounds,
  resizeTextBoundingBox, getPaperStyle, getShapeIcon
} from '../utils/paper';
import {
  getLayerAndDescendants, getLayersBounds, getNearestScopeAncestor, getSelectedBounds,
  getPaperLayer, getItemLayers, getSelectedProjectIndices, getAbsolutePosition,
  getActiveArtboardBounds, getAllArtboardItems, getSelectedAndDescendentsFull,
  getLayerDescendants
} from '../selectors/layer';
import {
  getLayerStyle, getLayerTransform, getLayerShapeOpts, getLayerFrame, getLayerPathData, getLayerTextStyle,
  getLayerMasked, getLayerUnderlyingMask
} from '../utils/actions';
import { bufferToBase64 } from '../../utils';
// import { addDocumentImage, removeDocumentImage, removeDocumentImages } from './documentSettings';
import { addSessionImage } from './session';
import { setEventDrawerEventThunk } from './eventDrawer';
import { openColorEditor, closeColorEditor } from './colorEditor';
import { openGradientEditor, closeGradientEditor } from './gradientEditor';
import { RootState } from '../reducers';
import { getContent, getParagraphs, getLeading } from '../../components/CanvasTextLayer';
import { updateActiveArtboardFrame } from '../../components/ActiveArtboardFrame';
import { updateSelectionFrame } from '../../components/SelectionFrame';
import { updateEventsFrame } from '../../components/EventsFrame';
import { updateNamesFrame } from '../../components/NamesFrame';

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
  ADD_LAYER_EVENT,
  ADD_LAYERS_EVENT,
  REMOVE_LAYER_EVENT,
  REMOVE_LAYERS_EVENT,
  SET_LAYER_EVENT_EVENT_LISTENER,
  SET_LAYERS_EVENT_EVENT_LISTENER,
  SELECT_LAYER_EVENT,
  DESELECT_LAYER_EVENT,
  SELECT_LAYER_EVENTS,
  DESELECT_LAYER_EVENTS,
  DESELECT_ALL_LAYER_EVENTS,
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
  FREEZE_LAYER_TWEEN,
  UNFREEZE_LAYER_TWEEN,
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
  ENABLE_LAYER_BLUR,
  DISABLE_LAYER_BLUR,
  ENABLE_LAYERS_BLUR,
  DISABLE_LAYERS_BLUR,
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
  SET_LAYERS_FILL,
  SET_LAYER_FILL_COLOR,
  SET_LAYERS_FILL_COLOR,
  SET_LAYERS_FILL_COLORS,
  SET_LAYER_STROKE,
  SET_LAYERS_STROKE,
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
  SET_LAYER_STROKE_MITER_LIMIT,
  SET_LAYER_SHADOW,
  SET_LAYERS_SHADOW,
  ENABLE_LAYER_SHADOW,
  ENABLE_LAYERS_SHADOW,
  DISABLE_LAYER_SHADOW,
  DISABLE_LAYERS_SHADOW,
  SET_LAYER_SHADOW_COLOR,
  SET_LAYERS_SHADOW_COLOR,
  SET_LAYERS_SHADOW_COLORS,
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
  SET_LAYER_LETTER_SPACING,
  SET_LAYERS_LETTER_SPACING,
  SET_LAYER_TEXT_TRANSFORM,
  SET_LAYERS_TEXT_TRANSFORM,
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
  SET_LAYER_TREE,
  SET_LAYER_TREE_SCROLL,
  SET_LAYER_TREE_STICKY_ARTBOARD,
  HYDRATE_LAYERS,
  ENABLE_GROUP_SCROLL,
  ENABLE_GROUPS_SCROLL,
  DISABLE_GROUP_SCROLL,
  DISABLE_GROUPS_SCROLL,
  ENABLE_GROUP_HORIZONTAL_SCROLL,
  ENABLE_GROUPS_HORIZONTAL_SCROLL,
  DISABLE_GROUP_HORIZONTAL_SCROLL,
  DISABLE_GROUPS_HORIZONTAL_SCROLL,
  ENABLE_GROUP_VERTICAL_SCROLL,
  ENABLE_GROUPS_VERTICAL_SCROLL,
  DISABLE_GROUP_VERTICAL_SCROLL,
  DISABLE_GROUPS_VERTICAL_SCROLL,
  SET_GROUP_SCROLL_OVERFLOW,
  SET_GROUPS_SCROLL_OVERFLOW,
  SET_GROUP_SCROLL_FRAME,
  ENABLE_GROUP_GROUP_EVENT_TWEENS,
  ENABLE_GROUPS_GROUP_EVENT_TWEENS,
  DISABLE_GROUP_GROUP_EVENT_TWEENS,
  DISABLE_GROUPS_GROUP_EVENT_TWEENS,
  ADD_GROUP_WIGGLES,
  EnableGroupGroupEventTweensPayload,
  EnableGroupsGroupEventTweensPayload,
  DisableGroupGroupEventTweensPayload,
  DisableGroupsGroupEventTweensPayload,
  EnableGroupScrollPayload,
  EnableGroupsScrollPayload,
  DisableGroupScrollPayload,
  DisableGroupsScrollPayload,
  EnableGroupHorizontalScrollPayload,
  EnableGroupsHorizontalScrollPayload,
  DisableGroupHorizontalScrollPayload,
  DisableGroupsHorizontalScrollPayload,
  EnableGroupVerticalScrollPayload,
  EnableGroupsVerticalScrollPayload,
  DisableGroupVerticalScrollPayload,
  DisableGroupsVerticalScrollPayload,
  SetGroupScrollOverflowPayload,
  SetGroupsScrollOverflowPayload,
  SetGroupScrollFramePayload,
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
  ShowLayersChildrenPayload,
  HideLayerChildrenPayload,
  HideLayersChildrenPayload,
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
  AddLayerEventPayload,
  AddLayersEventPayload,
  RemoveLayerEventPayload,
  RemoveLayersEventPayload,
  SetLayerEventEventListenerPayload,
  SetLayersEventEventListenerPayload,
  SelectLayerEventPayload,
  DeselectLayerEventPayload,
  SelectLayerEventsPayload,
  DeselectLayerEventsPayload,
  AddLayerTweenPayload,
  RemoveLayerTweenPayload,
  RemoveLayerTweensPayload,
  SelectLayerEventTweenPayload,
  DeselectLayerEventTweenPayload,
  SelectLayerEventTweensPayload,
  DeselectLayerEventTweensPayload,
  SetLayerTweenDurationPayload,
  SetLayerTweenRepeatPayload,
  SetLayerTweenRepeatDelayPayload,
  SetLayerTweenYoyoPayload,
  SetLayerTweenYoyoEasePayload,
  SetLayerTweenTimingPayload,
  SetLayerTweenDelayPayload,
  SetLayerTweenEasePayload,
  SetLayerTweenPowerPayload,
  SetLayersTweenDurationPayload,
  SetLayersTweenRepeatPayload,
  SetLayersTweenRepeatDelayPayload,
  SetLayersTweenYoyoPayload,
  SetLayersTweenYoyoEasePayload,
  SetLayersTweenTimingPayload,
  SetLayersTweenDelayPayload,
  SetLayersTweenEasePayload,
  SetLayersTweenPowerPayload,
  FreezeLayerTweenPayload,
  UnFreezeLayerTweenPayload,
  SetLayerStepsTweenStepsPayload,
  SetLayerRoughTweenClampPayload,
  SetLayerRoughTweenPointsPayload,
  SetLayerRoughTweenRandomizePayload,
  SetLayerRoughTweenStrengthPayload,
  SetLayerRoughTweenTaperPayload,
  SetLayerRoughTweenTemplatePayload,
  SetLayerSlowTweenLinearRatioPayload,
  SetLayerSlowTweenPowerPayload,
  SetLayerSlowTweenYoYoModePayload,
  SetLayerTextTweenDelimiterPayload,
  SetLayerTextTweenSpeedPayload,
  SetLayerTextTweenDiffPayload,
  SetLayerTextTweenScramblePayload,
  SetLayerScrambleTextTweenCharactersPayload,
  SetLayerScrambleTextTweenRevealDelayPayload,
  SetLayerScrambleTextTweenSpeedPayload,
  SetLayerScrambleTextTweenDelimiterPayload,
  SetLayerScrambleTextTweenRightToLeftPayload,
  SetLayerCustomBounceTweenStrengthPayload,
  SetLayerCustomBounceTweenEndAtStartPayload,
  SetLayerCustomBounceTweenSquashPayload,
  SetLayerCustomWiggleTweenStrengthPayload,
  SetLayerCustomWiggleTweenWigglesPayload,
  SetLayerCustomWiggleTweenTypePayload,
  SetLayersStepsTweenStepsPayload,
  SetLayersRoughTweenClampPayload,
  SetLayersRoughTweenPointsPayload,
  SetLayersRoughTweenRandomizePayload,
  SetLayersRoughTweenStrengthPayload,
  SetLayersRoughTweenTaperPayload,
  SetLayersRoughTweenTemplatePayload,
  SetLayersSlowTweenLinearRatioPayload,
  SetLayersSlowTweenPowerPayload,
  SetLayersSlowTweenYoYoModePayload,
  SetLayersTextTweenDelimiterPayload,
  SetLayersTextTweenSpeedPayload,
  SetLayersTextTweenDiffPayload,
  SetLayersTextTweenScramblePayload,
  SetLayersScrambleTextTweenCharactersPayload,
  SetLayersScrambleTextTweenRevealDelayPayload,
  SetLayersScrambleTextTweenSpeedPayload,
  SetLayersScrambleTextTweenDelimiterPayload,
  SetLayersScrambleTextTweenRightToLeftPayload,
  SetLayersCustomBounceTweenStrengthPayload,
  SetLayersCustomBounceTweenEndAtStartPayload,
  SetLayersCustomBounceTweenSquashPayload,
  SetLayersCustomWiggleTweenStrengthPayload,
  SetLayersCustomWiggleTweenWigglesPayload,
  SetLayersCustomWiggleTweenTypePayload,
  SetLayerXPayload,
  SetLayersXPayload,
  SetLayerYPayload,
  SetLayersYPayload,
  SetLayerLeftPayload,
  SetLayersLeftPayload,
  SetLayerCenterPayload,
  SetLayersCenterPayload,
  SetLayerRightPayload,
  SetLayersRightPayload,
  SetLayerTopPayload,
  SetLayersTopPayload,
  SetLayerMiddlePayload,
  SetLayersMiddlePayload,
  SetLayerBottomPayload,
  SetLayersBottomPayload,
  SetLayerWidthPayload,
  SetLayersWidthPayload,
  SetLayerHeightPayload,
  SetLayersHeightPayload,
  SetLayerRotationPayload,
  SetLayersRotationPayload,
  SetLayerOpacityPayload,
  SetLayersOpacityPayload,
  EnableLayerBlurPayload,
  DisableLayerBlurPayload,
  EnableLayersBlurPayload,
  DisableLayersBlurPayload,
  SetLayerBlurRadiusPayload,
  SetLayersBlurRadiusPayload,
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
  SetLayersFillColorsPayload,
  SetLayerStrokePayload,
  SetLayersStrokePayload,
  EnableLayerStrokePayload,
  EnableLayersStrokePayload,
  DisableLayerStrokePayload,
  DisableLayersStrokePayload,
  SetLayerStrokeColorPayload,
  SetLayersStrokeColorPayload,
  SetLayersStrokeColorsPayload,
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
  FlipLayerGradientPayload,
  FlipLayersGradientPayload,
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
  SetLayerShadowPayload,
  SetLayersShadowPayload,
  EnableLayerShadowPayload,
  EnableLayersShadowPayload,
  DisableLayerShadowPayload,
  DisableLayersShadowPayload,
  SetLayerShadowColorPayload,
  SetLayersShadowColorPayload,
  SetLayersShadowColorsPayload,
  SetLayerShadowBlurPayload,
  SetLayersShadowBlurPayload,
  SetLayerShadowXOffsetPayload,
  SetLayersShadowXOffsetPayload,
  SetLayerShadowYOffsetPayload,
  SetLayersShadowYOffsetPayload,
  ScaleLayerPayload,
  ScaleLayersPayload,
  SetLayerTextPayload,
  SetLayerTextResizePayload,
  SetLayersTextResizePayload,
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
  SetLayerVerticalAlignmentPayload,
  SetLayersVerticalAlignmentPayload,
  SetLayerFontStylePayload,
  SetLayersFontStylePayload,
  SetLayerPointXPayload,
  SetLayersPointXPayload,
  SetLayerPointYPayload,
  SetLayersPointYPayload,
  SetLayerLetterSpacingPayload,
  SetLayersLetterSpacingPayload,
  SetLayerTextTransformPayload,
  SetLayersTextTransformPayload,
  SetLayerFillPayload,
  SetLayersFillPayload,
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
  SetLayerTreeScrollPayload,
  SetLayerTreeStickyArtboardPayload,
  AddGroupsWigglesPayload,
  LayerTypes
} from '../actionTypes/layer';
import { LayerState } from '../reducers/layer';
import { setPreviewTweening } from './preview';

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
    const projectIndex = Math.floor((state.layer.present.byId.root.children.length) / ARTBOARDS_PER_PROJECT) + 1;
    const index = state.layer.present.byId.root.children.length;
    const payloadWithType = {
      ...payload,
      layer: {
        ...payload.layer,
        type: 'Artboard'
      }
    }
    const style = getLayerStyle(payloadWithType);
    const frame = getLayerFrame(payloadWithType);
    const showChildren = payload.layer.showChildren ? payload.layer.showChildren : true;
    // dispatch action
    const newLayer = {
      type: 'Artboard',
      id: id,
      name: name,
      artboard: id,
      parent: 'root',
      children: [],
      scope: ['root'],
      projectIndex: projectIndex,
      frame: frame, // payload.layer.frame,
      showChildren: showChildren,
      selected: false,
      hover: false,
      events: [],
      originForEvents: [],
      destinationForEvents: [],
      tweens: {
        allIds: [],
        asOrigin: [],
        asDestination: [],
        byProp: TWEEN_PROPS_MAP
      },
      transform: DEFAULT_TRANSFORM,
      style: style,
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
    const payloadWithType = {
      ...payload,
      layer: {
        ...payload.layer,
        type: 'Group'
      }
    }
    const style = getLayerStyle(payloadWithType);
    const name = payload.layer.name ? payload.layer.name : 'Group';
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const artboardItem = state.layer.present.byId[artboard] as Btwx.Artboard;
    const groupEventTweens = Object.prototype.hasOwnProperty.call(payload.layer, 'groupEventTweens') ? payload.layer.groupEventTweens : false;
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const frame = payload.layer.frame ? payload.layer.frame : { x: 0, y: 0, width: 0, height: 0, innerWidth: 0, innerHeight: 0 };
    const showChildren = payload.layer.showChildren ? payload.layer.showChildren : true;
    const newLayer = {
      type: 'Group',
      id: id,
      name: name,
      artboard: artboard,
      parent: parent,
      children: [],
      scope: scope,
      frame: frame,
      scroll: DEFAULT_SCROLL,
      groupEventTweens: groupEventTweens,
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

export const addShapeThunk = (payload: AddShapePayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Shape> => {
    const state = getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const artboardItem = state.layer.present.byId[artboard] as Btwx.Artboard;
    const shapeType = payload.layer.shapeType ? payload.layer.shapeType : 'Rectangle';
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const name = payload.layer.name ? payload.layer.name : shapeType;
    const payloadWithType = {
      ...payload,
      layer: {
        ...payload.layer,
        type: 'Shape'
      }
    }
    const frame = getLayerFrame(payloadWithType);
    const shapeOpts = getLayerShapeOpts(payloadWithType);
    const pathData = getLayerPathData(payloadWithType);
    const style = getLayerStyle(payloadWithType);
    const transform = getLayerTransform(payloadWithType);
    const shapeIcon = getShapeIcon(pathData);
    const mask = payload.layer.mask ? payload.layer.mask : false;
    const newLayer = {
      type: 'Shape',
      id: id,
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
      shapeIcon,
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
    const text = payload.layer.text ? payload.layer.text : DEFAULT_TEXT_VALUE;
    const name = payload.layer.name ? payload.layer.name : text;
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const artboardItem = state.layer.present.byId[artboard];
    const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
    const payloadWithType = {
      ...payload,
      layer: {
        ...payload.layer,
        type: 'Text'
      }
    }
    const style = getLayerStyle(payloadWithType);
    const textStyle = getLayerTextStyle(payloadWithType);
    const transform = getLayerTransform(payloadWithType);
    const frame = getLayerFrame(payloadWithType);
    const point = payload.layer.point;
    const nextParagraphs = getParagraphs({
      text: text,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      textResize: textStyle.textResize,
      innerWidth: frame.innerWidth,
      letterSpacing: textStyle.letterSpacing,
      textTransform: textStyle.textTransform,
      fontStyle: textStyle.fontStyle
    });
    const nextContent = getContent({
      paragraphs: nextParagraphs
    });
    const lines = payload.layer.lines ? payload.layer.lines : getTextLines({
      paperLayer: new paperMain.PointText({
        content: nextContent,
        point: new paperMain.Point(point.x, point.y).add(artboardPosition),
        insert: false,
        fontFamily: textStyle.fontFamily,
        fontSize: textStyle.fontSize,
        fontWeight: textStyle.fontWeight,
        letterSpacing: textStyle.letterSpacing,
        textTransform: textStyle.textTransform,
        justification: textStyle.justification,
        fillColor: {
          hue: style.fill.color.h,
          saturation: style.fill.color.s,
          lightness: style.fill.color.l,
          alpha: style.fill.color.a
        },
        leading: getLeading({
          leading: textStyle.leading,
          fontSize: textStyle.fontSize
        })
      }),
      leading: getLeading({
        leading: textStyle.leading,
        fontSize: textStyle.fontSize
      }),
      artboardPosition: artboardPosition,
      paragraphs: nextParagraphs
    });
    const newLayer = {
      type: 'Text',
      id: id,
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
      point: point,
      text: text,
      lines: lines,
      paragraphs: nextParagraphs
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

export const insertImageThunk = () => {
  return (dispatch: any, getState: any) => {
    (window as any).api.insertImage().then((data) => {
      const base64 = bufferToBase64(data.buffer);
      const fullBase64 = `data:image/${data.ext};base64,${base64}`;
      const newImage = new Image();
      newImage.onload = () => {
        const width = newImage.width;
        const height = newImage.height;
        dispatch(addImageThunk({
          layer: {
            frame: {
              x: 0,
              y: 0,
              width,
              height,
              innerWidth: width,
              innerHeight: height
            },
            originalDimensions: {
              width,
              height
            }
          },
          base64: fullBase64
        }));
      }
      newImage.src = fullBase64;
    }).catch(() => {
      console.error('image could not be read');
    });
  }
};

export const addImageThunk = (payload: AddImagePayload) => {
  return (dispatch: any, getState: any): Promise<Btwx.Image> => {
    const state = getState() as RootState;
    const id = payload.layer.id ? payload.layer.id : uuidv4();
    const sessionImageExists = state.session.images.allIds.find((id) => state.session.images.byId[id].base64 === payload.base64);
    const imageId = sessionImageExists ? sessionImageExists : payload.layer.imageId ? payload.layer.imageId : uuidv4();
    const name = payload.layer.name ? payload.layer.name : 'Image';
    const masked = Object.prototype.hasOwnProperty.call(payload.layer, 'masked') ? payload.layer.masked : getLayerMasked(state.layer.present, payload);
    const underlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'underlyingMask') ? payload.layer.underlyingMask : getLayerUnderlyingMask(state.layer.present, payload);
    const ignoreUnderlyingMask = Object.prototype.hasOwnProperty.call(payload.layer, 'ignoreUnderlyingMask') ? payload.layer.ignoreUnderlyingMask : false;
    const parent = payload.layer.parent ? payload.layer.parent : state.layer.present.activeArtboard;
    const parentItem = state.layer.present.byId[parent];
    const scope = [...parentItem.scope, parent];
    const artboard = scope[1];
    const payloadWithType = {
      ...payload,
      layer: {
        ...payload.layer,
        type: 'Image'
      }
    }
    const style = getLayerStyle(payloadWithType);
    const transform = getLayerTransform(payloadWithType);
    const frame = getLayerFrame(payloadWithType);
    const newLayer = {
      type: 'Image',
      id: id,
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
      originalDimensions: payloadWithType.layer.originalDimensions
    } as Btwx.Image;
    if (!sessionImageExists) {
      dispatch(addSessionImage({
        id: imageId,
        base64: payload.base64
      }));
    }
    dispatch(addImage({
      layer: newLayer,
      batch: payload.batch
    }));
    return Promise.resolve(newLayer);
  }
};

// layers

export const addLayers = (payload: AddLayersPayload): LayerTypes => ({
  type: ADD_LAYERS,
  payload
});

// export const addLayersThunk = (payload: AddLayersPayload) => {
//   return (dispatch: any, getState: any): Promise<any> => {
//     // const state = getState() as RootState;
//     return new Promise((resolve, reject) => {
//       const promises: Promise<any>[] = [];
//       payload.layers.forEach((layer) => {
//         switch(layer.type as Btwx.LayerType | 'ShapeGroup') {
//           case 'Artboard':
//             promises.push(dispatch(addArtboardThunk({layer: layer as Btwx.Artboard, batch: true})));
//             break;
//           case 'Shape':
//             promises.push(dispatch(addShapeThunk({layer: layer as Btwx.Shape, batch: true})));
//             break;
//           // case 'ShapeGroup':
//           //   promises.push(dispatch(addShapeGroupThunk({layer: layer as Btwx.Shape, batch: true})));
//           //   break;
//           case 'Image':
//             promises.push(dispatch(addImageThunk({layer: layer as Btwx.Image, batch: true, base64: payload.base64[(layer as Btwx.Image).imageId].base64})));
//             break;
//           case 'Group':
//             promises.push(dispatch(addGroupThunk({layer: layer as Btwx.Group, batch: true})));
//             break;
//           case 'Text':
//             promises.push(dispatch(addTextThunk({layer: layer as Btwx.Text, batch: true})));
//             break;
//         }
//       });
//       Promise.all(promises).then((layers) => {
//         dispatch(addLayers({layers: layers}));
//         resolve(layers);
//       });
//     });
//   }
// }

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
      const selectedAndDescendants = state.layer.present.selected.reduce((result, current) => {
        return [...result, ...getLayerAndDescendants(state.layer.present, current)];
      }, []);
      // if preview is tweening, and layers to remove...
      // includes a tweening layer, reset the tweening event
      if (state.preview.tweening && selectedAndDescendants.some(id => state.layer.present.events.byId[state.preview.tweening].layers.includes(id))) {
        (window as any).api.resetPreviewTweeningEvent(JSON.stringify({
          instanceId: state.session.instance,
          eventId: state.preview.tweening
        }));
        (window as any).api.setPreviewTweening(JSON.stringify({
          instanceId: state.session.instance,
          tweening: null
        }));
        // ipcRenderer.send('resetPreviewTweeningEvent', JSON.stringify({
        //   instanceId: state.session.instance,
        //   eventId: state.preview.tweening
        // }));
        // ipcRenderer.send('setPreviewTweening', JSON.stringify({
        //   instanceId: state.session.instance,
        //   tweening: null
        // }));
        dispatch(setPreviewTweening({tweening: null}));
      }
      if (state.viewSettings.eventDrawer.isOpen && state.eventDrawer.event) {
        const tweenEvent = state.layer.present.events.byId[state.eventDrawer.event];
        if (selectedAndDescendants.includes(tweenEvent.layer) || selectedAndDescendants.includes(tweenEvent.origin) || selectedAndDescendants.includes(tweenEvent.destination)) {
          dispatch(setEventDrawerEventThunk({id: null}));
        }
      }
      // if (selectedAndDescendants.some(id => state.layer.present.byId[id].type === 'Image')) {
      //   const removedImages = selectedAndDescendants.filter(id => state.layer.present.byId[id].type === 'Image');
      //   const removedDocumentImages = removedImages.reduce((result, current) => {
      //     const imageItem =  state.layer.present.byId[current] as Btwx.Image;
      //     const lastInstance = !state.layer.present.allImageIds.some(id => id !== current && ((state.layer.present.byId[id] as Btwx.Image).imageId === imageItem.imageId));
      //     if (lastInstance) {
      //       result = [...result, imageItem.imageId];
      //     }
      //     return result;
      //   }, []);
      //   if (removedDocumentImages.length > 0) {
      //     dispatch(removeDocumentImages({
      //       images: removedDocumentImages
      //     }));
      //   }
      // }
      dispatch(removeLayers({
        layers: state.layer.present.selected
      }));
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

export const selectAllArtboardsThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    dispatch(selectLayers({layers: state.layer.present.allArtboardIds, newSelection: true}));
  }
};

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

export const showLayersChildren = (payload: ShowLayersChildrenPayload): LayerTypes => ({
  type: SHOW_LAYERS_CHILDREN,
  payload
});

export const hideLayerChildren = (payload: HideLayerChildrenPayload): LayerTypes => ({
  type: HIDE_LAYER_CHILDREN,
  payload
});

export const hideLayersChildren = (payload: HideLayersChildrenPayload): LayerTypes => ({
  type: HIDE_LAYERS_CHILDREN,
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
    if (state.canvasSettings.mouse && state.canvasSettings.mouse.paperX && state.canvasSettings.mouse.paperY) {
      const point = new paperMain.Point(state.canvasSettings.mouse.paperX, state.canvasSettings.mouse.paperY)
      const hitResult = paperMain.project.hitTest(point);
      const validHitResult = hitResult && hitResult.item && hitResult.item.data && hitResult.item.data.type && (hitResult.item.data.type === 'Layer' || hitResult.item.data.type === 'LayerChild' || hitResult.item.data.type === 'LayerContainer');
      if (validHitResult) {
        let layerId;
        switch(hitResult.item.data.type) {
          case 'LayerContainer':
          case 'LayerChild':
            layerId = hitResult.item.data.layerId;
            break;
          case 'Layer':
            layerId = hitResult.item.data.id;
            break;
        }
        const nearestScopeAncestor = getNearestScopeAncestor({...state.layer.present, scope: nextScope}, layerId);
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
        dispatch(groupLayers({layers: state.layer.present.selected, group: newGroup}));
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

export const addLayerEvent = (payload: AddLayerEventPayload): LayerTypes => ({
  type: ADD_LAYER_EVENT,
  payload: {
    ...payload,
    id: uuidv4()
  }
});

export const addLayersEvent = (payload: AddLayersEventPayload): LayerTypes => ({
  type: ADD_LAYERS_EVENT,
  payload: {
    ...payload,
    events: payload.events.map((event) => ({
      ...event,
      id: uuidv4()
    }))
  }
});

export const addSelectedEventThunk = (listener: Btwx.EventType, destination: string) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const events: any[] = [];
    state.layer.present.selected.forEach((id, index) => {
      const layerItem = state.layer.present.byId[id];
      events.push({
        listener,
        destination,
        name: 'Event',
        origin: layerItem.type === 'Artboard' ? layerItem.id : layerItem.scope[1],
        layer: id,
        layers: [],
        tweens: {
          allIds: [],
          byLayer: {},
          byProp: TWEEN_PROPS_MAP
        }
      });
    });
    dispatch(addLayersEvent({events}));
  }
}

export const removeLayerEvent = (payload: RemoveLayerEventPayload): LayerTypes => ({
  type: REMOVE_LAYER_EVENT,
  payload
});

export const removeLayersEvent = (payload: RemoveLayersEventPayload): LayerTypes => ({
  type: REMOVE_LAYERS_EVENT,
  payload
});

export const setLayerEventEventListener = (payload: SetLayerEventEventListenerPayload): LayerTypes => ({
  type: SET_LAYER_EVENT_EVENT_LISTENER,
  payload
});

export const setLayersEventEventListener = (payload: SetLayersEventEventListenerPayload): LayerTypes => ({
  type: SET_LAYERS_EVENT_EVENT_LISTENER,
  payload
});

export const selectLayerEvent = (payload: SelectLayerEventPayload): LayerTypes => ({
  type: SELECT_LAYER_EVENT,
  payload
});

export const deselectLayerEvent = (payload: DeselectLayerEventPayload): LayerTypes => ({
  type: DESELECT_LAYER_EVENT,
  payload
});

export const selectLayerEvents = (payload: SelectLayerEventsPayload): LayerTypes => ({
  type: SELECT_LAYER_EVENTS,
  payload
});

export const deselectLayerEvents = (payload: DeselectLayerEventsPayload): LayerTypes => ({
  type: DESELECT_LAYER_EVENTS,
  payload
});

export const deselectAllLayerEvents = (): LayerTypes => ({
  type: DESELECT_ALL_LAYER_EVENTS
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

export const removeLayerTweens = (payload: RemoveLayerTweensPayload): LayerTypes => ({
  type: REMOVE_LAYER_TWEENS,
  payload
});

export const selectLayerEventTween = (payload: SelectLayerEventTweenPayload): LayerTypes => ({
  type: SELECT_LAYER_EVENT_TWEEN,
  payload
});

export const deselectLayerEventTween = (payload: DeselectLayerEventTweenPayload): LayerTypes => ({
  type: DESELECT_LAYER_EVENT_TWEEN,
  payload
});

export const selectLayerEventTweens = (payload: SelectLayerEventTweensPayload): LayerTypes => ({
  type: SELECT_LAYER_EVENT_TWEENS,
  payload
});

export const deselectLayerEventTweens = (payload: DeselectLayerEventTweensPayload): LayerTypes => ({
  type: DESELECT_LAYER_EVENT_TWEENS,
  payload
});

export const deselectAllLayerEventTweens = (): LayerTypes => ({
  type: DESELECT_ALL_LAYER_EVENT_TWEENS
});

export const setLayerTweenDuration = (payload: SetLayerTweenDurationPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_DURATION,
  payload
});

export const setLayerTweenRepeat = (payload: SetLayerTweenRepeatPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_REPEAT,
  payload
});

export const setLayerTweenRepeatDelay = (payload: SetLayerTweenRepeatDelayPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_REPEAT_DELAY,
  payload
});

export const setLayerTweenYoyo = (payload: SetLayerTweenYoyoPayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_YOYO,
  payload
});

export const setLayerTweenYoyoEase = (payload: SetLayerTweenYoyoEasePayload): LayerTypes => ({
  type: SET_LAYER_TWEEN_YOYO_EASE,
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

export const setLayersTweenDuration = (payload: SetLayersTweenDurationPayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_DURATION,
  payload
});

export const setLayersTweenRepeat = (payload: SetLayersTweenRepeatPayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_REPEAT,
  payload
});

export const setLayersTweenRepeatDelay = (payload: SetLayersTweenRepeatDelayPayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_REPEAT_DELAY,
  payload
});

export const setLayersTweenYoyo = (payload: SetLayersTweenYoyoPayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_YOYO,
  payload
});

export const setLayersTweenYoyoEase = (payload: SetLayersTweenYoyoEasePayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_YOYO_EASE,
  payload
});

export const setLayersTweenTiming = (payload: SetLayersTweenTimingPayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_TIMING,
  payload
});

export const setLayersTweenDelay = (payload: SetLayersTweenDelayPayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_DELAY,
  payload
});

export const setLayersTweenEase = (payload: SetLayersTweenEasePayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_EASE,
  payload
});

export const setLayersTweenPower = (payload: SetLayersTweenPowerPayload): LayerTypes => ({
  type: SET_LAYERS_TWEEN_POWER,
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

export const setLayerStepsTweenSteps = (payload: SetLayerStepsTweenStepsPayload): LayerTypes => ({
  type: SET_LAYER_STEPS_TWEEN_STEPS,
  payload
});

export const setLayerRoughTweenClamp = (payload: SetLayerRoughTweenClampPayload): LayerTypes => ({
  type: SET_LAYER_ROUGH_TWEEN_CLAMP,
  payload
});

export const setLayerRoughTweenPoints = (payload: SetLayerRoughTweenPointsPayload): LayerTypes => ({
  type: SET_LAYER_ROUGH_TWEEN_POINTS,
  payload
});

export const setLayerRoughTweenRandomize = (payload: SetLayerRoughTweenRandomizePayload): LayerTypes => ({
  type: SET_LAYER_ROUGH_TWEEN_RANDOMIZE,
  payload
});

export const setLayerRoughTweenStrength = (payload: SetLayerRoughTweenStrengthPayload): LayerTypes => ({
  type: SET_LAYER_ROUGH_TWEEN_STRENGTH,
  payload
});

export const setLayerRoughTweenTaper = (payload: SetLayerRoughTweenTaperPayload): LayerTypes => ({
  type: SET_LAYER_ROUGH_TWEEN_TAPER,
  payload
});

export const setLayerRoughTweenTemplate = (payload: SetLayerRoughTweenTemplatePayload): LayerTypes => ({
  type: SET_LAYER_ROUGH_TWEEN_TEMPLATE,
  payload
});

export const setLayerSlowTweenLinearRatio = (payload: SetLayerSlowTweenLinearRatioPayload): LayerTypes => ({
  type: SET_LAYER_SLOW_TWEEN_LINEAR_RATIO,
  payload
});

export const setLayerSlowTweenPower = (payload: SetLayerSlowTweenPowerPayload): LayerTypes => ({
  type: SET_LAYER_SLOW_TWEEN_POWER,
  payload
});

export const setLayerSlowTweenYoYoMode = (payload: SetLayerSlowTweenYoYoModePayload): LayerTypes => ({
  type: SET_LAYER_SLOW_TWEEN_YOYO_MODE,
  payload
});

export const setLayerTextTweenDelimiter = (payload: SetLayerTextTweenDelimiterPayload): LayerTypes => ({
  type: SET_LAYER_TEXT_TWEEN_DELIMITER,
  payload
});

export const setLayerTextTweenSpeed = (payload: SetLayerTextTweenSpeedPayload): LayerTypes => ({
  type: SET_LAYER_TEXT_TWEEN_SPEED,
  payload
});

export const setLayerTextTweenDiff = (payload: SetLayerTextTweenDiffPayload): LayerTypes => ({
  type: SET_LAYER_TEXT_TWEEN_DIFF,
  payload
});

export const setLayerTextTweenScramble = (payload: SetLayerTextTweenScramblePayload): LayerTypes => ({
  type: SET_LAYER_TEXT_TWEEN_SCRAMBLE,
  payload
});

export const setLayerScrambleTextTweenCharacters = (payload: SetLayerScrambleTextTweenCharactersPayload): LayerTypes => ({
  type: SET_LAYER_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
  payload
});

export const setLayerScrambleTextTweenRevealDelay = (payload: SetLayerScrambleTextTweenRevealDelayPayload): LayerTypes => ({
  type: SET_LAYER_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
  payload
});

export const setLayerScrambleTextTweenSpeed = (payload: SetLayerScrambleTextTweenSpeedPayload): LayerTypes => ({
  type: SET_LAYER_SCRAMBLE_TEXT_TWEEN_SPEED,
  payload
});

export const setLayerScrambleTextTweenDelimiter = (payload: SetLayerScrambleTextTweenDelimiterPayload): LayerTypes => ({
  type: SET_LAYER_SCRAMBLE_TEXT_TWEEN_DELIMITER,
  payload
});

export const setLayerScrambleTextTweenRightToLeft = (payload: SetLayerScrambleTextTweenRightToLeftPayload): LayerTypes => ({
  type: SET_LAYER_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
  payload
});

export const setLayerCustomBounceTweenStrength = (payload: SetLayerCustomBounceTweenStrengthPayload): LayerTypes => ({
  type: SET_LAYER_CUSTOM_BOUNCE_TWEEN_STRENGTH,
  payload
});

export const setLayerCustomBounceTweenEndAtStart = (payload: SetLayerCustomBounceTweenEndAtStartPayload): LayerTypes => ({
  type: SET_LAYER_CUSTOM_BOUNCE_TWEEN_END_AT_START,
  payload
});

export const setLayerCustomBounceTweenSquash = (payload: SetLayerCustomBounceTweenSquashPayload): LayerTypes => ({
  type: SET_LAYER_CUSTOM_BOUNCE_TWEEN_SQUASH,
  payload
});

export const setLayerCustomWiggleTweenStrength = (payload: SetLayerCustomWiggleTweenStrengthPayload): LayerTypes => ({
  type: SET_LAYER_CUSTOM_WIGGLE_TWEEN_STRENGTH,
  payload
});

export const setLayerCustomWiggleTweenWiggles = (payload: SetLayerCustomWiggleTweenWigglesPayload): LayerTypes => ({
  type: SET_LAYER_CUSTOM_WIGGLE_TWEEN_WIGGLES,
  payload
});

export const setLayerCustomWiggleTweenType = (payload: SetLayerCustomWiggleTweenTypePayload): LayerTypes => ({
  type: SET_LAYER_CUSTOM_WIGGLE_TWEEN_TYPE,
  payload
});

//

export const setLayersStepsTweenSteps = (payload: SetLayersStepsTweenStepsPayload): LayerTypes => ({
  type: SET_LAYERS_STEPS_TWEEN_STEPS,
  payload
});

export const setLayersRoughTweenClamp = (payload: SetLayersRoughTweenClampPayload): LayerTypes => ({
  type: SET_LAYERS_ROUGH_TWEEN_CLAMP,
  payload
});

export const setLayersRoughTweenPoints = (payload: SetLayersRoughTweenPointsPayload): LayerTypes => ({
  type: SET_LAYERS_ROUGH_TWEEN_POINTS,
  payload
});

export const setLayersRoughTweenRandomize = (payload: SetLayersRoughTweenRandomizePayload): LayerTypes => ({
  type: SET_LAYERS_ROUGH_TWEEN_RANDOMIZE,
  payload
});

export const setLayersRoughTweenStrength = (payload: SetLayersRoughTweenStrengthPayload): LayerTypes => ({
  type: SET_LAYERS_ROUGH_TWEEN_STRENGTH,
  payload
});

export const setLayersRoughTweenTaper = (payload: SetLayersRoughTweenTaperPayload): LayerTypes => ({
  type: SET_LAYERS_ROUGH_TWEEN_TAPER,
  payload
});

export const setLayersRoughTweenTemplate = (payload: SetLayersRoughTweenTemplatePayload): LayerTypes => ({
  type: SET_LAYERS_ROUGH_TWEEN_TEMPLATE,
  payload
});

export const setLayersSlowTweenLinearRatio = (payload: SetLayersSlowTweenLinearRatioPayload): LayerTypes => ({
  type: SET_LAYERS_SLOW_TWEEN_LINEAR_RATIO,
  payload
});

export const setLayersSlowTweenPower = (payload: SetLayersSlowTweenPowerPayload): LayerTypes => ({
  type: SET_LAYERS_SLOW_TWEEN_POWER,
  payload
});

export const setLayersSlowTweenYoYoMode = (payload: SetLayersSlowTweenYoYoModePayload): LayerTypes => ({
  type: SET_LAYERS_SLOW_TWEEN_YOYO_MODE,
  payload
});

export const setLayersTextTweenDelimiter = (payload: SetLayersTextTweenDelimiterPayload): LayerTypes => ({
  type: SET_LAYERS_TEXT_TWEEN_DELIMITER,
  payload
});

export const setLayersTextTweenSpeed = (payload: SetLayersTextTweenSpeedPayload): LayerTypes => ({
  type: SET_LAYERS_TEXT_TWEEN_SPEED,
  payload
});

export const setLayersTextTweenDiff = (payload: SetLayersTextTweenDiffPayload): LayerTypes => ({
  type: SET_LAYERS_TEXT_TWEEN_DIFF,
  payload
});

export const setLayersTextTweenScramble = (payload: SetLayersTextTweenScramblePayload): LayerTypes => ({
  type: SET_LAYERS_TEXT_TWEEN_SCRAMBLE,
  payload
});

export const setLayersScrambleTextTweenCharacters = (payload: SetLayersScrambleTextTweenCharactersPayload): LayerTypes => ({
  type: SET_LAYERS_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
  payload
});

export const setLayersScrambleTextTweenRevealDelay = (payload: SetLayersScrambleTextTweenRevealDelayPayload): LayerTypes => ({
  type: SET_LAYERS_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
  payload
});

export const setLayersScrambleTextTweenSpeed = (payload: SetLayersScrambleTextTweenSpeedPayload): LayerTypes => ({
  type: SET_LAYERS_SCRAMBLE_TEXT_TWEEN_SPEED,
  payload
});

export const setLayersScrambleTextTweenDelimiter = (payload: SetLayersScrambleTextTweenDelimiterPayload): LayerTypes => ({
  type: SET_LAYERS_SCRAMBLE_TEXT_TWEEN_DELIMITER,
  payload
});

export const setLayersScrambleTextTweenRightToLeft = (payload: SetLayersScrambleTextTweenRightToLeftPayload): LayerTypes => ({
  type: SET_LAYERS_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
  payload
});

export const setLayersCustomBounceTweenStrength = (payload: SetLayersCustomBounceTweenStrengthPayload): LayerTypes => ({
  type: SET_LAYERS_CUSTOM_BOUNCE_TWEEN_STRENGTH,
  payload
});

export const setLayersCustomBounceTweenEndAtStart = (payload: SetLayersCustomBounceTweenEndAtStartPayload): LayerTypes => ({
  type: SET_LAYERS_CUSTOM_BOUNCE_TWEEN_END_AT_START,
  payload
});

export const setLayersCustomBounceTweenSquash = (payload: SetLayersCustomBounceTweenSquashPayload): LayerTypes => ({
  type: SET_LAYERS_CUSTOM_BOUNCE_TWEEN_SQUASH,
  payload
});

export const setLayersCustomWiggleTweenStrength = (payload: SetLayersCustomWiggleTweenStrengthPayload): LayerTypes => ({
  type: SET_LAYERS_CUSTOM_WIGGLE_TWEEN_STRENGTH,
  payload
});

export const setLayersCustomWiggleTweenWiggles = (payload: SetLayersCustomWiggleTweenWigglesPayload): LayerTypes => ({
  type: SET_LAYERS_CUSTOM_WIGGLE_TWEEN_WIGGLES,
  payload
});

export const setLayersCustomWiggleTweenType = (payload: SetLayersCustomWiggleTweenTypePayload): LayerTypes => ({
  type: SET_LAYERS_CUSTOM_WIGGLE_TWEEN_TYPE,
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

export const setLayerLeft = (payload: SetLayerLeftPayload): LayerTypes => ({
  type: SET_LAYER_LEFT,
  payload
});

export const setLayersLeft = (payload: SetLayersLeftPayload): LayerTypes => ({
  type: SET_LAYERS_LEFT,
  payload
});

export const setLayerCenter = (payload: SetLayerCenterPayload): LayerTypes => ({
  type: SET_LAYER_CENTER,
  payload
});

export const setLayersCenter = (payload: SetLayersCenterPayload): LayerTypes => ({
  type: SET_LAYERS_CENTER,
  payload
});

export const setLayerRight = (payload: SetLayerRightPayload): LayerTypes => ({
  type: SET_LAYER_RIGHT,
  payload
});

export const setLayersRight = (payload: SetLayersRightPayload): LayerTypes => ({
  type: SET_LAYERS_RIGHT,
  payload
});

export const setLayerTop = (payload: SetLayerTopPayload): LayerTypes => ({
  type: SET_LAYER_TOP,
  payload
});

export const setLayersTop = (payload: SetLayersTopPayload): LayerTypes => ({
  type: SET_LAYERS_TOP,
  payload
});

export const setLayerMiddle = (payload: SetLayerMiddlePayload): LayerTypes => ({
  type: SET_LAYER_MIDDLE,
  payload
});

export const setLayersMiddle = (payload: SetLayersMiddlePayload): LayerTypes => ({
  type: SET_LAYERS_MIDDLE,
  payload
});

export const setLayerBottom = (payload: SetLayerBottomPayload): LayerTypes => ({
  type: SET_LAYER_BOTTOM,
  payload
});

export const setLayersBottom = (payload: SetLayersBottomPayload): LayerTypes => ({
  type: SET_LAYERS_BOTTOM,
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

export const setLayersWidthThunk = (payload: SetLayersWidthPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    let pathData: { [id: string]: string } = {};
    let shapeIcon: { [id: string]: string } = {};
    let bounds: { [id: string]: Btwx.Frame } = {};
    let paragraphs: { [id: string]: string[][] } = {};
    let lines: { [id: string]: Btwx.TextLine[] } = {};
    let textResize: { [id: string]: Btwx.TextResize } = {};
    let from: { [id: string]: Btwx.Point } = {};
    let to: { [id: string]: Btwx.Point } = {};
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      const clone = paperLayer.clone({insert: false}) as paper.Item;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      if (layerItem.type === 'Shape' || layerItem.type === 'Image') {
        const startPosition = clone.position;
        clearLayerTransforms({
          layerType: layerItem.type,
          paperLayer: clone,
          transform: layerItem.transform
        });
        clone.bounds.width = payload.width;
        applyLayerTransforms({
          paperLayer: clone,
          transform: layerItem.transform
        });
        if (layerItem.type === 'Shape') {
          pathData = {
            ...pathData,
            [id]: (clone as paper.CompoundPath).pathData
          }
          shapeIcon = {
            ...shapeIcon,
            [id]: getShapeIcon((clone as paper.CompoundPath).pathData)
          }
          if ((layerItem as Btwx.Shape).shapeType === 'Line') {
            clone.position = startPosition;
            const fromPoint = (clone as paper.Path).firstSegment.point.subtract(artboardPosition);
            const toPoint = (clone as paper.Path).lastSegment.point.subtract(artboardPosition);
            from = {
              ...from,
              [id]: {
                x: fromPoint.x,
                y: fromPoint.y
              }
            }
            to = {
              ...to,
              [id]: {
                x: toPoint.x,
                y: toPoint.y
              }
            }
          }
        }
        bounds = {
          ...bounds,
          [id]: {
            ...layerItem.frame,
            innerWidth: payload.width,
            width: clone.bounds.width,
            height: clone.bounds.height
          }
        }
      }
      if (layerItem.type === 'Text') {
        const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.PointText;
        const textItem: Btwx.Text = layerItem as Btwx.Text;
        const nextTextResize = textItem.textStyle.textResize === 'fixed' ? 'fixed' : 'autoHeight';
        clearLayerTransforms({
          layerType: layerItem.type,
          paperLayer: clone,
          transform: layerItem.transform
        });
        const nextParagraphs = getParagraphs({
          text: textItem.text,
          fontSize: textItem.textStyle.fontSize,
          fontWeight: textItem.textStyle.fontWeight,
          fontFamily: textItem.textStyle.fontFamily,
          textResize: nextTextResize,
          innerWidth: payload.width,
          letterSpacing: textItem.textStyle.letterSpacing,
          textTransform: textItem.textStyle.textTransform,
          fontStyle: textItem.textStyle.fontStyle
        });
        const nextContent = getContent({
          paragraphs: nextParagraphs
        });
        textContent.content = nextContent;
        const nextInnerBounds = getTextInnerBounds({
          paperLayer: clone as paper.Group,
          frame: {
            ...textItem.frame,
            innerWidth: payload.width,
            x: (() => {
              switch(textItem.textStyle.justification) {
                case 'left':
                  return (textContent.point.x - artboardPosition.x) + (payload.width / 2);
                case 'center':
                  return textContent.point.x - artboardPosition.x;
                case 'right':
                  return (textContent.point.x - artboardPosition.x) - (payload.width / 2);
              }
            })()
          },
          textResize: nextTextResize,
          artboardPosition
        });
        const textLines = getTextLines({
          paperLayer: textContent,
          leading: getLeading({
            leading: (layerItem as Btwx.Text).textStyle.leading,
            fontSize: (layerItem as Btwx.Text).textStyle.fontSize
          }),
          artboardPosition: artboardPosition,
          paragraphs: nextParagraphs
        });
        // resize text bounding box
        resizeTextBoundingBox({
          paperLayer: clone as paper.Group,
          innerBounds: nextInnerBounds,
          artboardPosition
        });
        // apply layer transforms
        applyLayerTransforms({
          paperLayer: clone,
          transform: layerItem.transform
        });
        paragraphs = {
          ...paragraphs,
          [id]: nextParagraphs
        }
        lines = {
          ...lines,
          [id]: textLines
        }
        bounds = {
          ...bounds,
          [id]: {
            ...nextInnerBounds,
            width: clone.bounds.width,
            height: clone.bounds.height
          }
        }
        textResize = {
          ...textResize,
          [id]: nextTextResize
        }
      }
    });
    dispatch(
      setLayersWidth({
        ...payload,
        pathData,
        shapeIcon,
        bounds,
        paragraphs,
        lines,
        textResize,
        from,
        to
      })
    )
  }
};

export const setLayerHeight = (payload: SetLayerHeightPayload): LayerTypes => ({
  type: SET_LAYER_HEIGHT,
  payload
});

export const setLayersHeight = (payload: SetLayersHeightPayload): LayerTypes => ({
  type: SET_LAYERS_HEIGHT,
  payload
});

export const setLayersHeightThunk = (payload: SetLayersHeightPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    let pathData: { [id: string]: string } = {};
    let shapeIcon: { [id: string]: string } = {};
    let bounds: { [id: string]: Btwx.Frame } = {};
    let paragraphs: { [id: string]: string[][] } = {};
    let lines: { [id: string]: Btwx.TextLine[] } = {};
    let textResize: { [id: string]: Btwx.TextResize } = {};
    let from: { [id: string]: Btwx.Point } = {};
    let to: { [id: string]: Btwx.Point } = {};
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      const clone = paperLayer.clone({insert: false});
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      if (layerItem.type === 'Shape' || layerItem.type === 'Image') {
        clearLayerTransforms({
          layerType: layerItem.type,
          paperLayer: clone,
          transform: layerItem.transform
        });
        clone.bounds.height = payload.height;
        applyLayerTransforms({
          paperLayer: clone,
          transform: layerItem.transform
        });
        if (layerItem.type === 'Shape') {
          pathData = {
            ...pathData,
            [id]: (clone as paper.CompoundPath).pathData
          }
          shapeIcon = {
            ...shapeIcon,
            [id]: getShapeIcon((clone as paper.CompoundPath).pathData)
          }
          if ((layerItem as Btwx.Shape).shapeType === 'Line') {
            const fromPoint = (clone as paper.Path).firstSegment.point.subtract(artboardPosition);
            const toPoint = (clone as paper.Path).lastSegment.point.subtract(artboardPosition);
            from = {
              ...from,
              [id]: {
                x: fromPoint.x,
                y: fromPoint.y
              }
            }
            to = {
              ...to,
              [id]: {
                x: toPoint.x,
                y: toPoint.y
              }
            }
          }
        }
        bounds = {
          ...bounds,
          [id]: {
            ...layerItem.frame,
            innerHeight: payload.height,
            width: clone.bounds.width,
            height: clone.bounds.height
          }
        }
      }
      if (layerItem.type === 'Text') {
        const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.PointText;
        const textItem: Btwx.Text = layerItem as Btwx.Text;
        const nextTextResize = 'fixed';
        clearLayerTransforms({
          layerType: layerItem.type,
          paperLayer: clone,
          transform: layerItem.transform
        });
        const nextInnerBounds = getTextInnerBounds({
          paperLayer: clone as paper.Group,
          frame: {
            ...textItem.frame,
            innerHeight: payload.height,
            y: (textItem.frame.y - (layerItem.frame.innerHeight / 2)) + (payload.height / 2)
          },
          textResize: nextTextResize,
          artboardPosition
        });
        const textLines = getTextLines({
          paperLayer: textContent,
          leading: getLeading({
            leading: (layerItem as Btwx.Text).textStyle.leading,
            fontSize: (layerItem as Btwx.Text).textStyle.fontSize
          }),
          artboardPosition: artboardPosition,
          paragraphs: textItem.paragraphs
        });
        // resize text bounding box
        resizeTextBoundingBox({
          paperLayer: clone as paper.Group,
          innerBounds: nextInnerBounds,
          artboardPosition
        });
        // apply layer transforms
        applyLayerTransforms({
          paperLayer: clone,
          transform: layerItem.transform
        });
        lines = {
          ...lines,
          [id]: textLines
        }
        bounds = {
          ...bounds,
          [id]: {
            ...nextInnerBounds,
            width: clone.bounds.width,
            height: clone.bounds.height
          }
        }
        textResize = {
          ...textResize,
          [id]: nextTextResize
        }
      }
    });
    dispatch(
      setLayersHeight({
        ...payload,
        pathData,
        shapeIcon,
        bounds,
        lines,
        textResize,
        from,
        to
      })
    )
  }
};

export const setLayerRotation = (payload: SetLayerRotationPayload): LayerTypes => ({
  type: SET_LAYER_ROTATION,
  payload
});

export const setLayersRotation = (payload: SetLayersRotationPayload): LayerTypes => ({
  type: SET_LAYERS_ROTATION,
  payload
});

// export const setLayersRotationThunk = (payload: SetLayersRotationPayload) => {
//   return (dispatch: any, getState: any) => {
//     const state = getState() as RootState;
//     let bounds: { [id: string]: Btwx.Frame; } = {};
//     let pathData: { [id: string]: string; } = {};
//     let shapeIcon: { [id: string]: string; } = {};
//     let point: { [id: string]: Btwx.Point; } = {};
//     let to: { [id: string]: Btwx.Point; } = {};
//     let from: { [id: string]: Btwx.Point; } = {};
//     let fillGradientOrigin: { [id: string]: Btwx.Point; } = {};
//     let fillGradientDestination: { [id: string]: Btwx.Point; } = {};
//     let strokeGradientOrigin: { [id: string]: Btwx.Point; } = {};
//     let strokeGradientDestination: { [id: string]: Btwx.Point; } = {};
//     const layersWithPivot = payload.layers.reduce((result, current) => {
//       const layerItem = state.layer.present.byId[current];
//       const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
//       const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data:{id: current}});
//       const pivot = paperLayer.position;
//       return [
//         ...result,
//         ...getLayerAndDescendants(state.layer.present, current, false).reduce((r, c) => {
//           return [...r, { id: c, pivot}];
//         }, [])
//       ];
//     }, []);
//     const handleRotation = ({id, pivot}: {id: string; pivot: paper.Point}) => {
//       const layerItem = state.layer.present.byId[id];
//       const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
//       const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
//       const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data:{id}});
//       const clone = paperLayer.clone({insert: false}) as paper.CompoundPath;
//       clearLayerTransforms({
//         layerType: layerItem.type,
//         paperLayer: clone,
//         transform: layerItem.transform
//       });
//       clone.pivot = pivot;
//       applyLayerTransforms({
//         paperLayer: clone,
//         transform: {
//           ...layerItem.transform,
//           rotation: payload.rotation
//         }
//       });
//       let fillRef = null;
//       switch(layerItem.type) {
//         case 'Shape':
//           fillRef = clone;
//           break;
//         case 'Text':
//           fillRef = clone.getItem({data:{id:'textContent'}});
//           break;
//       }
//       if (layerItem.style.fill.fillType === 'gradient') {
//         fillGradientOrigin = {
//           ...fillGradientOrigin,
//           [id]: fillRef.fillColor.origin
//         }
//         fillGradientDestination = {
//           ...fillGradientDestination,
//           [id]: fillRef.fillColor.destination
//         }
//       }
//       if (layerItem.style.stroke.fillType === 'gradient') {
//         strokeGradientOrigin = {
//           ...strokeGradientOrigin,
//           [id]: fillRef.strokeColor.origin
//         }
//         strokeGradientDestination = {
//           ...strokeGradientDestination,
//           [id]: fillRef.strokeColor.destination
//         }
//       }
//       if (layerItem.type === 'Shape') {
//         pathData = {
//           ...pathData,
//           [id]: (clone as paper.CompoundPath).pathData
//         }
//         shapeIcon = {
//           ...shapeIcon,
//           [id]: getShapeIcon((clone as paper.CompoundPath).pathData)
//         }
//         if ((layerItem as Btwx.Shape).shapeType === 'Line') {
//           const fromPoint = (clone as paper.Path).firstSegment.point.subtract(artboardPosition);
//           const toPoint = (clone as paper.Path).lastSegment.point.subtract(artboardPosition);
//           from = {
//             ...from,
//             [id]: {
//               x: fromPoint.x,
//               y: fromPoint.y
//             }
//           }
//           to = {
//             ...to,
//             [id]: {
//               x: toPoint.x,
//               y: toPoint.y
//             }
//           }
//         }
//       }
//       if (layerItem.type === 'Text') {
//         const textContent = clone.getItem({data:{id:'textContent'}}) as paper.PointText;
//         const newPoint = textContent.point.subtract(artboardPosition);
//         point = {
//           ...point,
//           [id]: {
//             x: newPoint.x,
//             y: newPoint.y
//           }
//         }
//       }
//       bounds = {
//         ...bounds,
//         [id]: {
//           ...layerItem.frame,
//           width: clone.bounds.width,
//           height: clone.bounds.height
//         }
//       }
//     }
//     layersWithPivot.forEach((itemData: {id: string; pivot: paper.Point}) => {
//       handleRotation(itemData);
//     });
//     dispatch(
//       setLayersRotation({
//         ...payload,
//         bounds,
//         pathData,
//         shapeIcon,
//         fillGradientOrigin,
//         fillGradientDestination,
//         strokeGradientOrigin,
//         strokeGradientDestination,
//         point,
//         from,
//         to
//       })
//     )
//   }
// };

export const setLayersRotationThunk = (payload: SetLayersRotationPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    let bounds: { [id: string]: Btwx.Frame; } = {};
    let pathData: { [id: string]: string; } = {};
    let shapeIcon: { [id: string]: string; } = {};
    let point: { [id: string]: Btwx.Point; } = {};
    let to: { [id: string]: Btwx.Point; } = {};
    let from: { [id: string]: Btwx.Point; } = {};
    let fillGradientOrigin: { [id: string]: Btwx.Point; } = {};
    let fillGradientDestination: { [id: string]: Btwx.Point; } = {};
    let strokeGradientOrigin: { [id: string]: Btwx.Point; } = {};
    let strokeGradientDestination: { [id: string]: Btwx.Point; } = {};
    const allLayers = payload.layers.reduce((result, current) => {
      const layerItem = state.layer.present.byId[current];
      if (layerItem.type === 'Group') {
        const descendents = getLayerDescendants(state.layer.present, current, false);
        result = [...result, ...descendents];
      } else {
        result = [...result, current];
      }
      return result;
    }, []);
    allLayers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.CompoundPath;
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      applyLayerTransforms({
        paperLayer: clone,
        transform: {
          ...layerItem.transform,
          rotation: payload.rotation
        }
      });
      let fillRef = null;
      switch(layerItem.type) {
        case 'Shape':
          fillRef = clone;
          break;
        case 'Text':
          fillRef = clone.getItem({data:{id:'textContent'}});
          break;
      }
      if (layerItem.style.fill.fillType === 'gradient') {
        fillGradientOrigin = {
          ...fillGradientOrigin,
          [id]: fillRef.fillColor.origin
        }
        fillGradientDestination = {
          ...fillGradientDestination,
          [id]: fillRef.fillColor.destination
        }
      }
      if (layerItem.style.stroke.fillType === 'gradient') {
        strokeGradientOrigin = {
          ...strokeGradientOrigin,
          [id]: fillRef.strokeColor.origin
        }
        strokeGradientDestination = {
          ...strokeGradientDestination,
          [id]: fillRef.strokeColor.destination
        }
      }
      if (layerItem.type === 'Shape') {
        pathData = {
          ...pathData,
          [id]: (clone as paper.CompoundPath).pathData
        }
        shapeIcon = {
          ...shapeIcon,
          [id]: getShapeIcon((clone as paper.CompoundPath).pathData)
        }
        if ((layerItem as Btwx.Shape).shapeType === 'Line') {
          const fromPoint = (clone as paper.Path).firstSegment.point.subtract(artboardPosition);
          const toPoint = (clone as paper.Path).lastSegment.point.subtract(artboardPosition);
          from = {
            ...from,
            [id]: {
              x: fromPoint.x,
              y: fromPoint.y
            }
          }
          to = {
            ...to,
            [id]: {
              x: toPoint.x,
              y: toPoint.y
            }
          }
        }
      }
      if (layerItem.type === 'Text') {
        const textContent = clone.getItem({data:{id:'textContent'}}) as paper.PointText;
        const newPoint = textContent.point.subtract(artboardPosition);
        point = {
          ...point,
          [id]: {
            x: newPoint.x,
            y: newPoint.y
          }
        }
      }
      bounds = {
        ...bounds,
        [id]: {
          ...layerItem.frame,
          width: clone.bounds.width,
          height: clone.bounds.height
        }
      }
    });
    dispatch(
      setLayersRotation({
        ...payload,
        layers: allLayers,
        bounds,
        pathData,
        shapeIcon,
        fillGradientOrigin,
        fillGradientDestination,
        strokeGradientOrigin,
        strokeGradientDestination,
        point,
        from,
        to
      })
    )
  }
};

export const setLayerOpacity = (payload: SetLayerOpacityPayload): LayerTypes => ({
  type: SET_LAYER_OPACITY,
  payload
});

export const setLayersOpacity = (payload: SetLayersOpacityPayload): LayerTypes => ({
  type: SET_LAYERS_OPACITY,
  payload
});

export const enableLayerBlur = (payload: EnableLayerBlurPayload): LayerTypes => ({
  type: ENABLE_LAYER_BLUR,
  payload
});

export const disableLayerBlur = (payload: DisableLayerBlurPayload): LayerTypes => ({
  type: DISABLE_LAYER_BLUR,
  payload
});

export const enableLayersBlur = (payload: EnableLayersBlurPayload): LayerTypes => ({
  type: ENABLE_LAYERS_BLUR,
  payload
});

export const disableLayersBlur = (payload: DisableLayersBlurPayload): LayerTypes => ({
  type: DISABLE_LAYERS_BLUR,
  payload
});

export const setLayerBlurRadius = (payload: SetLayerBlurRadiusPayload): LayerTypes => ({
  type: SET_LAYER_BLUR_RADIUS,
  payload
});

export const setLayersBlurRadius = (payload: SetLayersBlurRadiusPayload): LayerTypes => ({
  type: SET_LAYERS_BLUR_RADIUS,
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

export const setLayersHorizontalFlipThunk = (payload: (EnableLayersHorizontalFlipPayload | DisableLayersHorizontalFlipPayload) & { enabled: boolean }) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const compiledLayers = [];
    let from = {} as { [id: string]: Btwx.Point };
    let to = {} as { [id: string]: Btwx.Point };
    let point = {} as { [id: string]: Btwx.Point };
    let pathData = {} as { [id: string]: string };
    let shapeIcon = {} as { [id: string]: string };
    const handleLayers = (layers: string[]) => {
      layers.forEach((id) => {
        compiledLayers.push(id);
        const layerItem = state.layer.present.byId[id];
        const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
        const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
        const projectIndex = artboardItem.projectIndex;
        const paperLayer = paperMain.projects[projectIndex].getItem({ data: { id } });
        const duplicate = paperLayer.clone({insert: false});
        duplicate.scale(-1, 1);
        if (layerItem.type === 'Shape') {
          pathData = {
            ...pathData,
            [id]: (duplicate as paper.CompoundPath).pathData
          }
          shapeIcon = {
            ...shapeIcon,
            [id]: getShapeIcon((duplicate as paper.CompoundPath).pathData)
          }
          if ((layerItem as Btwx.Shape).shapeType === 'Line') {
            const fromPoint = (duplicate as paper.Path).firstSegment.point.subtract(artboardPosition);
            const toPoint = (duplicate as paper.Path).lastSegment.point.subtract(artboardPosition);
            // const vector = toPoint.subtract(fromPoint).round();
            from = {
              ...from,
              [id]: {
                x: fromPoint.x
              } as Btwx.Point
            }
            to = {
              ...to,
              [id]: {
                x: toPoint.x
              } as Btwx.Point
            }
          }
        }
        if (layerItem.type === 'Text') {
          const textContent = paperLayer.getItem({data:{id:'textContent'}}) as paper.PointText;
          point = {
            ...point,
            [id]: {
              x: textContent.point.x,
              y: textContent.point.y
            }
          }
        }
        if (layerItem.type === 'Group') {
          const layerDescendants = getLayerDescendants(state.layer.present, id, false);
          handleLayers(layerDescendants);
        }
      });
    }
    handleLayers(payload.layers);
    if (payload.enabled) {
      dispatch(enableLayersHorizontalFlip({
        layers: compiledLayers,
        pathData,
        shapeIcon,
        from,
        to,
        point
      }));
    } else {
      dispatch(disableLayersHorizontalFlip({
        layers: compiledLayers,
        pathData,
        shapeIcon,
        from,
        to,
        point
      }));
    }
  }
};

export const toggleSelectedHorizontalFlipThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.horizontalFlip);
    if (mixed) {
      const unFlipped = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].transform.horizontalFlip);
      dispatch(setLayersHorizontalFlipThunk({
        layers: unFlipped,
        enabled: true
      }));
    } else {
      const flipped = state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.horizontalFlip);
      if (flipped) {
        dispatch(setLayersHorizontalFlipThunk({
          layers: state.layer.present.selected,
          enabled: false
        }));
      } else {
        dispatch(setLayersHorizontalFlipThunk({
          layers: state.layer.present.selected,
          enabled: true
        }));
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

export const setLayersVerticalFlipThunk = (payload: (EnableLayersVerticalFlipPayload | DisableLayersVerticalFlipPayload) & { enabled: boolean }) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const compiledLayers = [];
    let from = {} as { [id: string]: Btwx.Point };
    let to = {} as { [id: string]: Btwx.Point };
    let point = {} as { [id: string]: Btwx.Point };
    let pathData = {} as { [id: string]: string };
    let shapeIcon = {} as { [id: string]: string };
    const handleLayers = (layers: string[]) => {
      layers.forEach((id) => {
        compiledLayers.push(id);
        const layerItem = state.layer.present.byId[id];
        const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
        const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
        const projectIndex = artboardItem.projectIndex;
        const paperLayer = paperMain.projects[projectIndex].getItem({ data: { id } });
        const duplicate = paperLayer.clone({insert: false});
        duplicate.scale(1, -1);
        if (layerItem.type === 'Shape') {
          pathData = {
            ...pathData,
            [id]: (duplicate as paper.CompoundPath).pathData
          }
          shapeIcon = {
            ...shapeIcon,
            [id]: getShapeIcon((duplicate as paper.CompoundPath).pathData)
          }
          if ((layerItem as Btwx.Shape).shapeType === 'Line') {
            const fromPoint = (duplicate as paper.Path).firstSegment.point.subtract(artboardPosition);
            const toPoint = (duplicate as paper.Path).lastSegment.point.subtract(artboardPosition);
            // const vector = toPoint.subtract(fromPoint).round();
            from = {
              ...from,
              [id]: {
                y: fromPoint.y
              } as Btwx.Point
            }
            to = {
              ...to,
              [id]: {
                y: toPoint.y
              } as Btwx.Point
            }
          }
        }
        if (layerItem.type === 'Text') {
          const textContent = paperLayer.getItem({data:{id:'textContent'}}) as paper.PointText;
          point = {
            ...point,
            [id]: {
              x: textContent.point.x,
              y: textContent.point.y
            }
          }
        }
        if (layerItem.type === 'Group') {
          const layerDescendants = getLayerDescendants(state.layer.present, id, false);
          handleLayers(layerDescendants);
        }
      });
    }
    handleLayers(payload.layers);
    if (payload.enabled) {
      dispatch(enableLayersVerticalFlip({
        layers: compiledLayers,
        pathData,
        shapeIcon,
        from,
        to,
        point
      }));
    } else {
      dispatch(disableLayersVerticalFlip({
        layers: compiledLayers,
        pathData,
        shapeIcon,
        from,
        to,
        point
      }));
    }
  }
};

export const toggleSelectedVerticalFlipThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const mixed = !state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.verticalFlip);
    if (mixed) {
      const unFlipped = state.layer.present.selected.filter((id) => !state.layer.present.byId[id].transform.verticalFlip);
      dispatch(setLayersVerticalFlipThunk({
        layers: unFlipped,
        enabled: true
      }));
    } else {
      const flipped = state.layer.present.selected.every((id) => state.layer.present.byId[id].transform.verticalFlip);
      if (flipped) {
        dispatch(setLayersVerticalFlipThunk({
          layers: state.layer.present.selected,
          enabled: false
        }));
      } else {
        dispatch(setLayersVerticalFlipThunk({
          layers: state.layer.present.selected,
          enabled: true
        }));
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
      dispatch(enableLayersFill({
        layers: disabled
      }));
    } else {
      const enabled = state.layer.present.selected.every((id) => state.layer.present.byId[id].style.fill.enabled);
      if (enabled) {
        dispatch(disableLayersFill({
          layers: state.layer.present.selected
        }));
      } else {
        dispatch(enableLayersFill({
          layers: state.layer.present.selected
        }));
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

export const setLayersFillColors = (payload: SetLayersFillColorsPayload): LayerTypes => ({
  type: SET_LAYERS_FILL_COLORS,
  payload
});

export const setLayerStroke = (payload: SetLayerStrokePayload): LayerTypes => ({
  type: SET_LAYER_STROKE,
  payload
});

export const setLayersStroke = (payload: SetLayersStrokePayload): LayerTypes => ({
  type: SET_LAYERS_STROKE,
  payload
});

export const setHoverStrokeThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.layer.present.hover) {
      const hoverDescendents = getLayerAndDescendants(state.layer.present, state.layer.present.hover, false).filter((id) => {
        const layerItem = state.layer.present.byId[id];
        return layerItem.type !== 'Image' && layerItem.type !== 'Artboard';
      });
      if (hoverDescendents.length > 0) {
        dispatch(setLayersStroke({
          layers: hoverDescendents,
          stroke: state.rightSidebar.draggingStroke
        }));
      }
    }
  }
};

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
      dispatch(enableLayersStroke({
        layers: disabled
      }));
    } else {
      const enabled = state.layer.present.selected.every((id) => state.layer.present.byId[id].style.stroke.enabled);
      if (enabled) {
        dispatch(disableLayersStroke({
          layers: state.layer.present.selected
        }));
      } else {
        dispatch(enableLayersStroke({
          layers: state.layer.present.selected
        }));
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

export const setLayersStrokeColors = (payload: SetLayersStrokeColorsPayload): LayerTypes => ({
  type: SET_LAYERS_STROKE_COLORS,
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

export const flipLayerGradient = (payload: FlipLayerGradientPayload): LayerTypes => ({
  type: FLIP_LAYER_GRADIENT,
  payload
});

export const flipLayersGradient = (payload: FlipLayersGradientPayload): LayerTypes => ({
  type: FLIP_LAYERS_GRADIENT,
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

export const setLayerShadow = (payload: SetLayerShadowPayload): LayerTypes => ({
  type: SET_LAYER_SHADOW,
  payload
});

export const setLayersShadow = (payload: SetLayersShadowPayload): LayerTypes => ({
  type: SET_LAYERS_SHADOW,
  payload
});

export const setHoverShadowThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.layer.present.hover) {
      const hoverDescendents = getLayerAndDescendants(state.layer.present, state.layer.present.hover, false).filter((id) => {
        const layerItem = state.layer.present.byId[id];
        return layerItem.type !== 'Artboard';
      });
      if (hoverDescendents.length > 0) {
        dispatch(setLayersShadow({
          layers: hoverDescendents,
          shadow: state.rightSidebar.draggingShadow
        }));
      }
    }
  }
};

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
      dispatch(enableLayersShadow({
        layers: disabled
      }));
    } else {
      const enabled = state.layer.present.selected.every((id) => state.layer.present.byId[id].style.shadow.enabled);
      if (enabled) {
        dispatch(disableLayersShadow({
          layers: state.layer.present.selected
        }));
      } else {
        dispatch(enableLayersShadow({
          layers: state.layer.present.selected
        }));
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

export const setLayersShadowColors = (payload: SetLayersShadowColorsPayload): LayerTypes => ({
  type: SET_LAYERS_SHADOW_COLORS,
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

export const scaleLayersThunk = (payload: ScaleLayersPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    let pathData = {} as { [id: string]: string };
    let shapeIcon = {} as { [id: string]: string };
    let rotation = {} as { [id: string]: number };
    let bounds = {} as { [id: string]: Btwx.Frame };
    let from = {} as { [id: string]: Btwx.Point };
    let to = {} as { [id: string]: Btwx.Point };
    let resize = {} as { [id: string]: Btwx.TextResize };
    let point = {} as { [id: string]: Btwx.Point };
    let lines = {} as { [id: string]: Btwx.TextLine[] };
    let paragraphs = {} as { [id: string]: string[][] };
    payload.layers.forEach((id, index) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({ data: { id } });
      const artboardBackground = paperLayer.getItem({data:{id: 'artboardBackground'}});
      const isShape = layerItem.type === 'Shape';
      const isLine = isShape && (layerItem as Btwx.Shape).shapeType === 'Line';
      const isArtboard = layerItem.type === 'Artboard';
      const isText = layerItem.type === 'Text';
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      const paperPosition = paperLayer.position;
      let innerWidth: number;
      let innerHeight: number;
      if (isShape) {
        pathData = {
          ...pathData,
          [id]: (paperLayer as paper.CompoundPath).pathData
        }
        shapeIcon = {
          ...shapeIcon,
          [id]: getShapeIcon((paperLayer as paper.CompoundPath).pathData)
        }
        if (isLine) {
          const fromPoint = (paperLayer as paper.Path).firstSegment.point.subtract(artboardPosition);
          const toPoint = (paperLayer as paper.Path).lastSegment.point.subtract(artboardPosition);
          const vector = toPoint.subtract(fromPoint);
          innerWidth = vector.length;
          innerHeight = 0;
          from = {
            ...from,
            [id]: {
              x: fromPoint.x,
              y: fromPoint.y
            }
          }
          to = {
            ...to,
            [id]: {
              x: toPoint.x,
              y: toPoint.y
            }
          }
          rotation = {
            ...rotation,
            [id]: vector.angle
          }
        }
      }
      if (isText) {
        const duplicate = paperLayer.clone({insert: false}) as paper.Group;
        const textContent = duplicate.getItem({ data: { id: 'textContent' } }) as paper.PointText;
        const textBackground = duplicate.getItem({ data: { id: 'textBackground' } });
        clearLayerTransforms({
          layerType: 'Text',
          paperLayer: duplicate,
          transform: {
            ...layerItem.transform,
            rotation: layerItem.transform.rotation,
            horizontalFlip: (payload.horizontalFlip && !layerItem.transform.horizontalFlip) || (!payload.horizontalFlip && layerItem.transform.horizontalFlip),
            verticalFlip: (payload.verticalFlip && !layerItem.transform.verticalFlip) || (!payload.verticalFlip && layerItem.transform.verticalFlip)
          }
        });
        const horizontalOnlyScale = payload.scale.x !== 1 && payload.scale.y === 1;
        const nextResize = horizontalOnlyScale && (layerItem as Btwx.Text).textStyle.textResize !== 'fixed'  ? 'autoHeight' : 'fixed';
        // get next paragraphs
        const nextParagraphs = getParagraphs({
          text: (layerItem as Btwx.Text).text,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize,
          fontWeight: (layerItem as Btwx.Text).textStyle.fontWeight,
          fontFamily: (layerItem as Btwx.Text).textStyle.fontFamily,
          textResize: nextResize,
          innerWidth: textBackground.bounds.width,
          letterSpacing: (layerItem as Btwx.Text).textStyle.letterSpacing,
          textTransform: (layerItem as Btwx.Text).textStyle.textTransform,
          fontStyle: (layerItem as Btwx.Text).textStyle.fontStyle,
        });
        // get next content
        const nextContent = getContent({
          paragraphs: nextParagraphs
        });
        // set prop
        textContent.content = nextContent;
        // reposition text content
        positionTextContent({
          paperLayer: duplicate,
          verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
          justification: (layerItem as Btwx.Text).textStyle.justification,
          textResize: nextResize
        });
        // get next point, inner bounds, and lines
        const nextInnerBounds = getTextInnerBounds({
          paperLayer: duplicate,
          frame: {
            ...layerItem.frame,
            x: textBackground.position.x - artboardPosition.x,
            y: textBackground.position.y - artboardPosition.y,
            innerWidth: textBackground.bounds.width,
            innerHeight: textBackground.bounds.height,
          },
          textResize: nextResize,
          artboardPosition
        });
        const nextTextLines = getTextLines({
          paperLayer: textContent,
          leading: getLeading({
            leading: (layerItem as Btwx.Text).textStyle.leading,
            fontSize: (layerItem as Btwx.Text).textStyle.fontSize
          }),
          artboardPosition: artboardPosition,
          paragraphs: nextParagraphs
        });
        resizeTextBoundingBox({
          paperLayer: duplicate,
          innerBounds: nextInnerBounds,
          artboardPosition
        });
        // apply layer transforms
        applyLayerTransforms({
          paperLayer: duplicate,
          transform: {
            ...layerItem.transform,
            rotation: layerItem.transform.rotation,
            horizontalFlip: (payload.horizontalFlip && !layerItem.transform.horizontalFlip) || (!payload.horizontalFlip && layerItem.transform.horizontalFlip),
            verticalFlip: (payload.verticalFlip && !layerItem.transform.verticalFlip) || (!payload.verticalFlip && layerItem.transform.verticalFlip)
          }
        });
        const nextPoint = textContent.point.subtract(artboardPosition);
        lines = {
          ...lines,
          [id]: nextTextLines
        }
        bounds = {
          ...bounds,
          [id]: {
            ...nextInnerBounds,
            width: duplicate.bounds.width,
            height: duplicate.bounds.height
          }
        }
        point = {
          ...point,
          [id]: {
            x: nextPoint.x,
            y: nextPoint.y
          }
        }
        paragraphs = {
          ...paragraphs,
          [id]: nextParagraphs
        }
        resize = {
          ...resize,
          [id]: nextResize
        }
      } else {
        paperLayer.rotation = -layerItem.transform.rotation;
        if (!isLine) {
          innerWidth = paperLayer.bounds.width;
          innerHeight = paperLayer.bounds.height;
        }
        paperLayer.rotation = layerItem.transform.rotation;
        bounds = {
          ...bounds,
          [id]: {
            x: isArtboard ? artboardBackground.bounds.center.x : paperPosition.x - artboardItem.frame.x,
            y: isArtboard ? artboardBackground.bounds.center.y : paperPosition.y - artboardItem.frame.y,
            innerWidth: isArtboard ? artboardBackground.bounds.width : innerWidth,
            innerHeight: isArtboard ? artboardBackground.bounds.height : innerHeight,
            width: isArtboard ? artboardBackground.bounds.width : paperLayer.bounds.width,
            height: isArtboard ? artboardBackground.bounds.height : paperLayer.bounds.height
          }
        }
      }
      // reset flips
      if (payload.horizontalFlip || payload.verticalFlip) {
        paperLayer.scale(payload.horizontalFlip ? -1 : 1, payload.verticalFlip ? -1 : 1);
      }
    });
    dispatch(
      scaleLayers({
        ...payload,
        point,
        pathData,
        shapeIcon,
        bounds,
        from,
        to,
        rotation,
        resize,
        lines,
        paragraphs
      })
    )
  }
};

export const setLayerText = (payload: SetLayerTextPayload): LayerTypes => ({
  type: SET_LAYER_TEXT,
  payload
});

export const setLayerTextThunk = (payload: SetLayerTextPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const layerItem = state.layer.present.byId[payload.id] as Btwx.Text;
    const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
    const projectIndex = artboardItem.projectIndex;
    const paperLayer = paperMain.projects[projectIndex].getItem({data: {id: payload.id}});
    const clone = paperLayer.clone({insert:false}) as paper.Group;
    const textContent = clone.getItem({data:{id:'textContent'}}) as paper.PointText;
    const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
    // clear transforms
    clearLayerTransforms({
      layerType: layerItem.type,
      paperLayer: clone,
      transform: layerItem.transform
    });
    // get next paragraphs
    const nextParagraphs = getParagraphs({
      text: payload.text,
      fontSize: layerItem.textStyle.fontSize,
      fontWeight: layerItem.textStyle.fontWeight,
      fontFamily: layerItem.textStyle.fontFamily,
      textResize: layerItem.textStyle.textResize,
      innerWidth: layerItem.frame.innerWidth,
      letterSpacing: layerItem.textStyle.letterSpacing,
      textTransform: layerItem.textStyle.textTransform,
      fontStyle: layerItem.textStyle.fontStyle
    });
    // get next content
    const nextContent = getContent({
      paragraphs: nextParagraphs
    });
    // set next content
    textContent.content = nextContent;
    // reposition text content
    positionTextContent({
      paperLayer: clone,
      verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
      justification: (layerItem as Btwx.Text).textStyle.justification,
      textResize: (layerItem as Btwx.Text).textStyle.textResize
    });
    // get next point, inner bounds, and lines
    const nextInnerBounds = getTextInnerBounds({
      paperLayer: clone,
      frame: (layerItem as Btwx.Text).frame,
      textResize: (layerItem as Btwx.Text).textStyle.textResize,
      artboardPosition
    });
    const nextTextLines = getTextLines({
      paperLayer: textContent,
      leading: getLeading({
        leading: (layerItem as Btwx.Text).textStyle.leading,
        fontSize: (layerItem as Btwx.Text).textStyle.fontSize
      }),
      artboardPosition: artboardPosition,
      paragraphs: nextParagraphs
    });
    // resize text bounding box
    resizeTextBoundingBox({
      paperLayer: clone,
      innerBounds: nextInnerBounds,
      artboardPosition
    });
    // apply transforms
    applyLayerTransforms({
      paperLayer: clone,
      transform: layerItem.transform
    });
    const nextPoint = textContent.point.subtract(artboardPosition);
    dispatch(
      setLayerText({
        ...payload,
        bounds: {
          ...nextInnerBounds,
          width: clone.bounds.width,
          height: clone.bounds.height,
        },
        lines: nextTextLines,
        paragraphs: nextParagraphs,
        point: {
          x: nextPoint.x,
          y: nextPoint.y
        }
      })
    )
  }
};

export const setLayerTextResize = (payload: SetLayerTextResizePayload): LayerTypes => ({
  type: SET_LAYER_TEXT_RESIZE,
  payload
});

export const setLayersTextResize = (payload: SetLayersTextResizePayload): LayerTypes => ({
  type: SET_LAYERS_TEXT_RESIZE,
  payload
});

export const setLayersTextResizeThunk = (payload: SetLayersTextResizePayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const point: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data: {id: id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // get next paragraphs
      const nextParagraphs = getParagraphs({
        text: layerItem.text,
        fontSize: layerItem.textStyle.fontSize,
        fontWeight: layerItem.textStyle.fontWeight,
        fontFamily: layerItem.textStyle.fontFamily,
        textResize: payload.resize,
        innerWidth: layerItem.frame.innerWidth,
        letterSpacing: layerItem.textStyle.letterSpacing,
        textTransform: layerItem.textStyle.textTransform,
        fontStyle: layerItem.textStyle.fontStyle
      });
      // get next content
      const nextContent = getContent({
        paragraphs: nextParagraphs
      });
      // apply new props
      textContent.content = nextContent;
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: payload.resize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: (layerItem as Btwx.Text).frame,
        textResize: payload.resize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: nextParagraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      paragraphs.push(nextParagraphs);
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersTextResize({
        ...payload,
        bounds,
        lines,
        paragraphs,
        point
      })
    )
  }
};

export const setLayerFontSize = (payload: SetLayerFontSizePayload): LayerTypes => ({
  type: SET_LAYER_FONT_SIZE,
  payload
});

export const setLayersFontSize = (payload: SetLayersFontSizePayload): LayerTypes => ({
  type: SET_LAYERS_FONT_SIZE,
  payload
});

export const setLayersFontSizeThunk = (payload: SetLayersFontSizePayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const point: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const textBackground = clone.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
      const textMask = clone.getItem({data:{id:'textMask'}}) as paper.Path.Rectangle;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // get next paragraphs
      const nextParagraphs = getParagraphs({
        text: layerItem.text,
        fontSize: payload.fontSize,
        fontWeight: layerItem.textStyle.fontWeight,
        fontFamily: layerItem.textStyle.fontFamily,
        textResize: layerItem.textStyle.textResize,
        innerWidth: layerItem.frame.innerWidth,
        letterSpacing: layerItem.textStyle.letterSpacing,
        textTransform: layerItem.textStyle.textTransform,
        fontStyle: layerItem.textStyle.fontStyle
      });
      // get next content
      const nextContent = getContent({
        paragraphs: nextParagraphs
      });
      //
      const nextLeading = getLeading({
        leading: (layerItem as Btwx.Text).textStyle.leading,
        fontSize: payload.fontSize
      });
      // apply new props
      textContent.fontSize = payload.fontSize;
      textContent.leading = nextLeading;
      textContent.content = nextContent;
      // Recalculate bounds height and y
      let nextInnerHeight;
      let nextY;
      const prevLeading = getLeading({
        leading: (layerItem as Btwx.Text).textStyle.leading,
        fontSize: (layerItem as Btwx.Text).textStyle.fontSize
      })
      const diff = (nextLeading - prevLeading) * 0.75;
      switch(layerItem.textStyle.textResize) {
        case 'autoWidth':
          nextInnerHeight = textContent.bounds.height;
          nextY = textContent.position.y - artboardPosition.y;
          textBackground.bounds = textContent.bounds;
          textMask.bounds = textContent.bounds;
          break;
        case 'autoHeight':
          nextInnerHeight = textContent.bounds.height;
          nextY = textContent.position.y - artboardPosition.y;
          textBackground.bounds.height = textContent.bounds.height;
          textMask.bounds.height = textContent.bounds.height;
          textBackground.position.y = textContent.position.y;
          textMask.position.y = textMask.position.y;
          break;
        case 'fixed':
          switch(layerItem.textStyle.verticalAlignment) {
            case 'top':
              nextY = layerItem.frame.y - diff;
              nextInnerHeight = layerItem.frame.innerHeight;
              textBackground.position.y -= diff;
              textMask.position.y -= diff;
              break;
            case 'middle':
            case 'bottom':
              nextY = layerItem.frame.y;
              nextInnerHeight = layerItem.frame.innerHeight;
              break;
          }
          break;
      }
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      // const nextInnerBounds = getTextInnerBounds({
      //   paperLayer: clone,
      //   frame: (layerItem as Btwx.Text).frame,
      //   textResize: (layerItem as Btwx.Text).textStyle.textResize,
      //   artboardPosition
      // });
      // const textLines = getTextLines({
      //   paperLayer: textContent,
      //   leading: getLeading({
      //     leading: (layerItem as Btwx.Text).textStyle.leading,
      //     fontSize: payload.fontSize
      //   }),
      //   artboardPosition: artboardPosition,
      //   paragraphs: nextParagraphs
      // });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: {
          ...layerItem.frame,
          innerHeight: nextInnerHeight,
          y: nextY
        },
        textResize: layerItem.textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: nextLeading,
        artboardPosition: artboardPosition,
        paragraphs: layerItem.paragraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      paragraphs.push(nextParagraphs);
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersFontSize({
        ...payload,
        bounds,
        lines,
        point,
        paragraphs
      })
    )
  }
};

export const setLayerLeading = (payload: SetLayerLeadingPayload): LayerTypes => ({
  type: SET_LAYER_LEADING,
  payload
});

export const setLayersLeading = (payload: SetLayersLeadingPayload): LayerTypes => ({
  type: SET_LAYERS_LEADING,
  payload
});

export const setLayersLeadingThunk = (payload: SetLayersLeadingPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const point: Btwx.Point[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert:false}) as paper.Group;
      const textContent = clone.getItem({data:{id:'textContent'}}) as paper.PointText;
      const textBackground = clone.getItem({data:{id:'textBackground'}}) as paper.Path.Rectangle;
      const textMask = clone.getItem({data:{id:'textMask'}}) as paper.Path.Rectangle;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // apply new props
      textContent.leading = getLeading({
        leading: payload.leading,
        fontSize: (layerItem as Btwx.Text).textStyle.fontSize
      });
      // Recalculate bounds height and y
      let nextInnerHeight;
      let nextY;
      const nextLeading = getLeading({
        leading: payload.leading,
        fontSize: (layerItem as Btwx.Text).textStyle.fontSize
      });
      const prevLeading = getLeading({
        leading: layerItem.textStyle.leading,
        fontSize: (layerItem as Btwx.Text).textStyle.fontSize
      })
      const diff = (nextLeading - prevLeading) * 0.75;
      switch(layerItem.textStyle.textResize) {
        case 'autoWidth':
          nextInnerHeight = textContent.bounds.height;
          nextY = textContent.position.y - artboardPosition.y;
          textBackground.bounds = textContent.bounds;
          textMask.bounds = textContent.bounds;
          break;
        case 'autoHeight':
          nextInnerHeight = textContent.bounds.height;
          nextY = textContent.position.y - artboardPosition.y;
          textBackground.bounds.height = textContent.bounds.height;
          textMask.bounds.height = textContent.bounds.height;
          textBackground.position.y = textContent.position.y;
          textMask.position.y = textMask.position.y;
          break;
        case 'fixed':
          switch(layerItem.textStyle.verticalAlignment) {
            case 'top':
              nextY = layerItem.frame.y - diff;
              nextInnerHeight = layerItem.frame.innerHeight;
              textBackground.position.y -= diff;
              textMask.position.y -= diff;
              break;
            case 'middle':
            case 'bottom':
              nextY = layerItem.frame.y;
              nextInnerHeight = layerItem.frame.innerHeight;
              break;
          }
          break;
      }
      //
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: {
          ...layerItem.frame,
          innerHeight: nextInnerHeight,
          y: nextY
        },
        textResize: layerItem.textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: payload.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: layerItem.paragraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersLeading({
        ...payload,
        bounds,
        lines,
        point
      })
    )
  }
};

export const setLayerFontWeight = (payload: SetLayerFontWeightPayload): LayerTypes => ({
  type: SET_LAYER_FONT_WEIGHT,
  payload
});

export const setLayersFontWeight = (payload: SetLayersFontWeightPayload): LayerTypes => ({
  type: SET_LAYERS_FONT_WEIGHT,
  payload
});

export const setLayersFontWeightThunk = (payload: SetLayersFontWeightPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const point: Btwx.Point[] = [];
    const bounds: Btwx.Frame[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // get next paragraphs
      const nextParagraphs = getParagraphs({
        text: layerItem.text,
        fontSize: layerItem.textStyle.fontSize,
        fontWeight: payload.fontWeight as any,
        fontFamily: layerItem.textStyle.fontFamily,
        textResize: layerItem.textStyle.textResize,
        innerWidth: layerItem.frame.innerWidth,
        letterSpacing: layerItem.textStyle.letterSpacing,
        textTransform: layerItem.textStyle.textTransform,
        fontStyle: layerItem.textStyle.fontStyle
      });
      // get next content
      const nextContent = getContent({
        paragraphs: nextParagraphs
      });
      // apply new props
      textContent.fontWeight = payload.fontWeight;
      textContent.content = nextContent;
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: (layerItem as Btwx.Text).frame,
        textResize: (layerItem as Btwx.Text).textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: nextParagraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      paragraphs.push(nextParagraphs);
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersFontWeight({
        ...payload,
        bounds,
        lines,
        point,
        paragraphs
      })
    )
  }
};

export const setLayerFontFamily = (payload: SetLayerFontFamilyPayload): LayerTypes => ({
  type: SET_LAYER_FONT_FAMILY,
  payload
});

export const setLayersFontFamily = (payload: SetLayersFontFamilyPayload): LayerTypes => ({
  type: SET_LAYERS_FONT_FAMILY,
  payload
});

export const setLayersFontFamilyThunk = (payload: SetLayersFontFamilyPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const point: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data: {id: id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // get next paragraphs
      const nextParagraphs = getParagraphs({
        text: layerItem.text,
        fontSize: layerItem.textStyle.fontSize,
        fontWeight: layerItem.textStyle.fontWeight,
        fontFamily: payload.fontFamily,
        textResize: layerItem.textStyle.textResize,
        innerWidth: layerItem.frame.innerWidth,
        letterSpacing: layerItem.textStyle.letterSpacing,
        textTransform: layerItem.textStyle.textTransform,
        fontStyle: layerItem.textStyle.fontStyle
      });
      // get next content
      const nextContent = getContent({
        paragraphs: nextParagraphs
      });
      // apply new props
      textContent.fontFamily = payload.fontFamily;
      textContent.content = nextContent;
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: (layerItem as Btwx.Text).frame,
        textResize: (layerItem as Btwx.Text).textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: nextParagraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      paragraphs.push(nextParagraphs);
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersFontFamily({
        ...payload,
        bounds,
        lines,
        paragraphs,
        point
      })
    )
  }
};

export const setLayerLetterSpacing = (payload: SetLayerLetterSpacingPayload): LayerTypes => ({
  type: SET_LAYER_LETTER_SPACING,
  payload
});

export const setLayersLetterSpacing = (payload: SetLayersLetterSpacingPayload): LayerTypes => ({
  type: SET_LAYERS_LETTER_SPACING,
  payload
});

export const setLayersLetterSpacingThunk = (payload: SetLayersLetterSpacingPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const point: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data: {id: id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // get next paragraphs
      const nextParagraphs = getParagraphs({
        text: layerItem.text,
        fontSize: layerItem.textStyle.fontSize,
        fontWeight: layerItem.textStyle.fontWeight,
        fontFamily: layerItem.textStyle.fontFamily,
        textResize: layerItem.textStyle.textResize,
        innerWidth: layerItem.frame.innerWidth,
        letterSpacing: payload.letterSpacing,
        textTransform: layerItem.textStyle.textTransform,
        fontStyle: layerItem.textStyle.fontStyle
      });
      // get next content
      const nextContent = getContent({
        paragraphs: nextParagraphs
      });
      // apply new props
      textContent.letterSpacing = payload.letterSpacing;
      textContent.content = nextContent;
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: (layerItem as Btwx.Text).frame,
        textResize: (layerItem as Btwx.Text).textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: nextParagraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      paragraphs.push(nextParagraphs);
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersLetterSpacing({
        ...payload,
        bounds,
        lines,
        point,
        paragraphs
      })
    )
  }
};

export const setLayerTextTransform = (payload: SetLayerTextTransformPayload): LayerTypes => ({
  type: SET_LAYER_TEXT_TRANSFORM,
  payload
});

export const setLayersTextTransform = (payload: SetLayersTextTransformPayload): LayerTypes => ({
  type: SET_LAYERS_TEXT_TRANSFORM,
  payload
});

export const setLayersTextTransformThunk = (payload: SetLayersTextTransformPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const point: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // get next paragraphs
      const nextParagraphs = getParagraphs({
        text: layerItem.text,
        fontSize: layerItem.textStyle.fontSize,
        fontWeight: layerItem.textStyle.fontWeight,
        fontFamily: layerItem.textStyle.fontFamily,
        textResize: layerItem.textStyle.textResize,
        innerWidth: layerItem.frame.innerWidth,
        letterSpacing: layerItem.textStyle.letterSpacing,
        textTransform: payload.textTransform,
        fontStyle: layerItem.textStyle.fontStyle
      });
      // get next content
      const nextContent = getContent({
        paragraphs: nextParagraphs
      });
      // apply new props
      textContent.textTransform = payload.textTransform;
      textContent.content = nextContent;
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: (layerItem as Btwx.Text).frame,
        textResize: (layerItem as Btwx.Text).textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: nextParagraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      paragraphs.push(nextParagraphs);
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersTextTransform({
        ...payload,
        bounds,
        lines,
        paragraphs,
        point
      })
    )
  }
};

export const setLayerJustification = (payload: SetLayerJustificationPayload): LayerTypes => ({
  type: SET_LAYER_JUSTIFICATION,
  payload
});

export const setLayersJustification = (payload: SetLayersJustificationPayload): LayerTypes => ({
  type: SET_LAYERS_JUSTIFICATION,
  payload
});

export const setLayersJustificationThunk = (payload: SetLayersJustificationPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const points: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      const prevJustification = layerItem.textStyle.justification;
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // apply new props
      textContent.justification = payload.justification;
      // adjust position to account for new justification
      switch(prevJustification) {
        case 'left': {
          switch(payload.justification) {
            case 'left':
              break;
            case 'center':
              textContent.point.x += (layerItem.frame.innerWidth / 2);
              break;
            case 'right':
              textContent.point.x += layerItem.frame.innerWidth;
              break;
          }
          break;
        }
        case 'center': {
          switch(payload.justification) {
            case 'left':
              textContent.point.x -= (layerItem.frame.innerWidth / 2);
              break;
            case 'center':
              break;
            case 'right':
              textContent.point.x += (layerItem.frame.innerWidth / 2);
              break;
          }
          break;
        }
        case 'right': {
          switch(payload.justification) {
            case 'left':
              textContent.position.x -= layerItem.frame.innerWidth;
              break;
            case 'center':
              textContent.position.x -= (layerItem.frame.innerWidth / 2);
              break;
            case 'right':
              break;
          }
          break;
        }
      }
      // reposition text content
      // positionTextContent({
      //   paperLayer: clone,
      //   verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
      //   justification: payload.justification,
      //   textResize: (layerItem as Btwx.Text).textStyle.textResize
      // });
      // get next point, inner bounds, and lines
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: layerItem.paragraphs
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      const nextPoint = textContent.point.subtract(artboardPosition);
      points.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push(layerItem.frame);
    });
    dispatch(
      setLayersJustification({
        ...payload,
        lines,
        bounds,
        points
      })
    )
  }
};

export const setLayerVerticalAlignment = (payload: SetLayerVerticalAlignmentPayload): LayerTypes => ({
  type: SET_LAYER_VERTICAL_ALIGNMENT,
  payload
});

export const setLayersVerticalAlignment = (payload: SetLayersVerticalAlignmentPayload): LayerTypes => ({
  type: SET_LAYERS_VERTICAL_ALIGNMENT,
  payload
});

export const setLayersVerticalAlignmentThunk = (payload: SetLayersVerticalAlignmentPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const points: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data: {id: id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: payload.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: (layerItem as Btwx.Text).frame,
        textResize: (layerItem as Btwx.Text).textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: layerItem.paragraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      const nextPoint = textContent.point.subtract(artboardPosition);
      points.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersVerticalAlignment({
        ...payload,
        lines,
        bounds,
        points
      })
    )
  }
};

export const setLayerFontStyle = (payload: SetLayerFontStylePayload): LayerTypes => ({
  type: SET_LAYER_FONT_STYLE,
  payload
});

export const setLayersFontStyle = (payload: SetLayersFontStylePayload): LayerTypes => ({
  type: SET_LAYERS_FONT_STYLE,
  payload
});

export const setLayersFontStyleThunk = (payload: SetLayersFontStylePayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const lines: Btwx.TextLine[][] = [];
    const bounds: Btwx.Frame[] = [];
    const point: Btwx.Point[] = [];
    const paragraphs: string[][][] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.Group;
      const textContent = clone.getItem({data: {id: 'textContent'}}) as paper.AreaText;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      // clear layer transforms
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      // get next paragraphs
      const nextParagraphs = getParagraphs({
        text: layerItem.text,
        fontSize: layerItem.textStyle.fontSize,
        fontWeight: layerItem.textStyle.fontWeight,
        fontFamily: layerItem.textStyle.fontFamily,
        textResize: layerItem.textStyle.textResize,
        innerWidth: layerItem.frame.innerWidth,
        letterSpacing: layerItem.textStyle.letterSpacing,
        textTransform: layerItem.textStyle.textTransform,
        fontStyle: payload.fontStyle
      });
      // get next content
      const nextContent = getContent({
        paragraphs: nextParagraphs
      });
      // apply new props
      textContent.fontStyle = payload.fontStyle;
      textContent.content = nextContent;
      // reposition text content
      positionTextContent({
        paperLayer: clone,
        verticalAlignment: (layerItem as Btwx.Text).textStyle.verticalAlignment,
        justification: (layerItem as Btwx.Text).textStyle.justification,
        textResize: (layerItem as Btwx.Text).textStyle.textResize
      });
      // get next point, inner bounds, and lines
      const nextInnerBounds = getTextInnerBounds({
        paperLayer: clone,
        frame: (layerItem as Btwx.Text).frame,
        textResize: (layerItem as Btwx.Text).textStyle.textResize,
        artboardPosition
      });
      const textLines = getTextLines({
        paperLayer: textContent,
        leading: getLeading({
          leading: (layerItem as Btwx.Text).textStyle.leading,
          fontSize: (layerItem as Btwx.Text).textStyle.fontSize
        }),
        artboardPosition: artboardPosition,
        paragraphs: nextParagraphs
      });
      // resize text bounding box
      resizeTextBoundingBox({
        paperLayer: clone,
        innerBounds: nextInnerBounds,
        artboardPosition
      });
      // apply layer transforms
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      // push updates
      paragraphs.push(nextParagraphs);
      const nextPoint = textContent.point.subtract(artboardPosition);
      point.push({x: nextPoint.x, y: nextPoint.y});
      lines.push(textLines);
      bounds.push({
        ...nextInnerBounds,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLayersFontStyle({
        ...payload,
        bounds,
        lines,
        paragraphs,
        point
      })
    )
  }
};

export const setLayerPointX = (payload: SetLayerPointXPayload): LayerTypes => ({
  type: SET_LAYER_POINT_X,
  payload
});

export const setLayersPointX = (payload: SetLayersPointXPayload): LayerTypes => ({
  type: SET_LAYERS_POINT_X,
  payload
});

export const setLayerPointY = (payload: SetLayerPointYPayload): LayerTypes => ({
  type: SET_LAYER_POINT_Y,
  payload
});

export const setLayersPointY = (payload: SetLayersPointYPayload): LayerTypes => ({
  type: SET_LAYERS_POINT_Y,
  payload
});

export const setLayerFill = (payload: SetLayerFillPayload): LayerTypes => ({
  type: SET_LAYER_FILL,
  payload
});

export const setLayersFill = (payload: SetLayersFillPayload): LayerTypes => ({
  type: SET_LAYERS_FILL,
  payload
});

export const setHoverFillThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.layer.present.hover) {
      const hoverDescendents = getLayerAndDescendants(state.layer.present, state.layer.present.hover, false).filter((id) => {
        const layerItem = state.layer.present.byId[id];
        return layerItem.type !== 'Image';
      });
      if (hoverDescendents.length > 0) {
        dispatch(setLayersFill({
          layers: hoverDescendents,
          fill: state.rightSidebar.draggingFill
        }));
      }
    }
  }
};

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
    const mixed = !state.layer.present.selected.every((id) =>
      (state.layer.present.byId[id] as Btwx.MaskableLayer).ignoreUnderlyingMask
    );
    if (mixed) {
      const disabled = state.layer.present.selected.filter((id) =>
        !(state.layer.present.byId[id] as Btwx.MaskableLayer).ignoreUnderlyingMask
      );
      dispatch(toggleLayersIgnoreUnderlyingMask({
        layers: disabled
      }));
    } else {
      dispatch(toggleLayersIgnoreUnderlyingMask({
        layers: state.layer.present.selected
      }));
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
              layers: state.layer.present.selected.reverse(),
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
          position = position.subtract(artboardPosition).round();
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

export const setRoundedRadiiThunk = (payload: SetRoundedRadiiPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.CompoundPath;
      const paperLayerPath = clone.children[0] as paper.Path;
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      const maxDim = Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height);
      const newShape = new paperMain.Path.Rectangle({
        from: paperLayerPath.bounds.topLeft,
        to: paperLayerPath.bounds.bottomRight,
        radius: (maxDim / 2) * payload.radius,
        insert: false
      });
      applyLayerTransforms({
        paperLayer: newShape,
        transform: layerItem.transform
      });
      paperLayerPath.pathData = newShape.pathData;
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setRoundedRadii({
        ...payload,
        pathData,
        shapeIcon,
        bounds
      })
    )
  }
};

export const setPolygonSides = (payload: SetPolygonSidesPayload): LayerTypes => ({
  type: SET_POLYGON_SIDES,
  payload
});

export const setPolygonsSides = (payload: SetPolygonsSidesPayload): LayerTypes => ({
  type: SET_POLYGONS_SIDES,
  payload
});

export const setPolygonsSidesThunk = (payload: SetPolygonsSidesPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.CompoundPath;
      const paperLayerPath = clone.children[0] as paper.Path;
      const startPosition = paperLayerPath.position;
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      const newShape = new paperMain.Path.RegularPolygon({
        center: paperLayerPath.bounds.center,
        radius: Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height) / 2,
        sides: payload.sides,
        insert: false
      });
      newShape.bounds.width = paperLayerPath.bounds.width;
      newShape.bounds.height = paperLayerPath.bounds.height;
      applyLayerTransforms({
        paperLayer: newShape,
        transform: layerItem.transform
      });
      newShape.position = startPosition;
      paperLayerPath.pathData = newShape.pathData;
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setPolygonsSides({
        ...payload,
        pathData,
        shapeIcon,
        bounds
      })
    )
  }
};

export const setStarPoints = (payload: SetStarPointsPayload): LayerTypes => ({
  type: SET_STAR_POINTS,
  payload
});

export const setStarsPoints = (payload: SetStarsPointsPayload): LayerTypes => ({
  type: SET_STARS_POINTS,
  payload
});

export const setStarsPointsThunk = (payload: SetStarsPointsPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.CompoundPath;
      const paperLayerPath = clone.children[0] as paper.Path;
      const startPosition = paperLayerPath.position;
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      const maxDim = Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height);
      const newShape = new paperMain.Path.Star({
        center: paperLayerPath.bounds.center,
        radius1: maxDim / 2,
        radius2: (maxDim / 2) * (layerItem as Btwx.Star).radius,
        points: payload.points,
        insert: false
      });
      newShape.bounds.width = paperLayerPath.bounds.width;
      newShape.bounds.height = paperLayerPath.bounds.height;
      applyLayerTransforms({
        paperLayer: newShape,
        transform: layerItem.transform
      });
      newShape.position = startPosition;
      paperLayerPath.pathData = newShape.pathData;
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setStarsPoints({
        ...payload,
        pathData,
        shapeIcon,
        bounds
      })
    )
  }
};

export const setStarRadius = (payload: SetStarRadiusPayload): LayerTypes => ({
  type: SET_STAR_RADIUS,
  payload
});

export const setStarsRadius = (payload: SetStarsRadiusPayload): LayerTypes => ({
  type: SET_STARS_RADIUS,
  payload
});

export const setStarsRadiusThunk = (payload: SetStarsRadiusPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data:{id}});
      const clone = paperLayer.clone({insert: false}) as paper.CompoundPath;
      const paperLayerPath = clone.children[0] as paper.Path;
      const startPosition = paperLayerPath.position;
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      const maxDim = Math.max(paperLayerPath.bounds.width, paperLayerPath.bounds.height);
      const newShape = new paperMain.Path.Star({
        center: paperLayerPath.bounds.center,
        radius1: maxDim / 2,
        radius2: (maxDim / 2) * payload.radius,
        points: (layerItem as Btwx.Star).points,
        insert: false
      });
      newShape.bounds.width = paperLayerPath.bounds.width;
      newShape.bounds.height = paperLayerPath.bounds.height;
      applyLayerTransforms({
        paperLayer: newShape,
        transform: layerItem.transform
      });
      newShape.position = startPosition;
      paperLayerPath.pathData = newShape.pathData;
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setStarsRadius({
        ...payload,
        pathData,
        shapeIcon,
        bounds
      })
    )
  }
};

export const setLineFromX = (payload: SetLineFromXPayload): LayerTypes => ({
  type: SET_LINE_FROM_X,
  payload
});

export const setLinesFromX = (payload: SetLinesFromXPayload): LayerTypes => ({
  type: SET_LINES_FROM_X,
  payload
});

export const setLinesFromXThunk = (payload: SetLinesFromXPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    const rotation: number[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      const clone = paperLayer.clone({insert: false}) as paper.Path;
      const paperFromX = artboardItem.frame.x + payload.x;
      clone.firstSegment.point.x = paperFromX;
      const fromPoint = clone.firstSegment.point.round();
      const toPoint = clone.lastSegment.point.round();
      const vector = toPoint.subtract(fromPoint).round();
      const positionInArtboard = clone.position.subtract(new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y)).round();
      rotation.push(vector.angle);
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        x: positionInArtboard.x,
        y: positionInArtboard.y,
        innerWidth: Math.round(vector.length),
        innerHeight: 0,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLinesFromX({
        ...payload,
        pathData,
        shapeIcon,
        bounds,
        rotation
      })
    )
  }
};

export const setLineFromY = (payload: SetLineFromYPayload): LayerTypes => ({
  type: SET_LINE_FROM_Y,
  payload
});

export const setLinesFromY = (payload: SetLinesFromYPayload): LayerTypes => ({
  type: SET_LINES_FROM_Y,
  payload
});

export const setLinesFromYThunk = (payload: SetLinesFromYPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    const rotation: number[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      const clone = paperLayer.clone({insert: false}) as paper.Path;
      const paperFromY = artboardItem.frame.y + payload.y;
      clone.firstSegment.point.y = paperFromY;
      const fromPoint = clone.firstSegment.point.round();
      const toPoint = clone.lastSegment.point.round();
      const vector = toPoint.subtract(fromPoint).round();
      const positionInArtboard = clone.position.subtract(new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y)).round();
      rotation.push(vector.angle);
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        x: positionInArtboard.x,
        y: positionInArtboard.y,
        innerWidth: Math.round(vector.length),
        innerHeight: 0,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLinesFromY({
        ...payload,
        pathData,
        shapeIcon,
        bounds,
        rotation
      })
    )
  }
};

export const setLineFrom = (payload: SetLineFromPayload): LayerTypes => ({
  type: SET_LINE_FROM,
  payload
});

export const setLineFromThunk = (payload: SetLineFromPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const layerItem = state.layer.present.byId[payload.id];
    const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
    const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id: payload.id}}) as paper.CompoundPath;
    const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
    const from = new paperMain.Point(payload.x, payload.y);
    const relFrom = from.subtract(artboardPosition).round();
    const fromPoint = paperLayer.firstSegment.point.round();
    const toPoint = paperLayer.lastSegment.point.round();
    const vector = toPoint.subtract(fromPoint).round();
    const positionInArtboard = paperLayer.position.subtract(artboardPosition).round();
    const rotation = vector.angle;
    const pathData = paperLayer.pathData;
    const shapeIcon = getShapeIcon(paperLayer.pathData);
    const bounds = {
      ...layerItem.frame,
      x: positionInArtboard.x,
      y: positionInArtboard.y,
      innerWidth: Math.round(vector.length),
      innerHeight: 0,
      width: paperLayer.bounds.width,
      height: paperLayer.bounds.height
    }
    dispatch(
      setLineFrom({
        ...payload,
        x: relFrom.x,
        y: relFrom.y,
        pathData,
        shapeIcon,
        bounds,
        rotation
      })
    )
  }
};

export const setLineToX = (payload: SetLineToXPayload): LayerTypes => ({
  type: SET_LINE_TO_X,
  payload
});

export const setLinesToX = (payload: SetLinesToXPayload): LayerTypes => ({
  type: SET_LINES_TO_X,
  payload
});

export const setLinesToXThunk = (payload: SetLinesToXPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    const rotation: number[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      const clone = paperLayer.clone({insert: false}) as paper.Path;
      const paperToX = artboardItem.frame.x + payload.x;
      clone.lastSegment.point.x = paperToX;
      const fromPoint = clone.firstSegment.point.round();
      const toPoint = clone.lastSegment.point.round();
      const vector = toPoint.subtract(fromPoint).round();
      const positionInArtboard = clone.position.subtract(new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y)).round();
      rotation.push(vector.angle);
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        x: positionInArtboard.x,
        y: positionInArtboard.y,
        innerWidth: Math.round(vector.length),
        innerHeight: 0,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLinesToX({
        ...payload,
        pathData,
        shapeIcon,
        bounds,
        rotation
      })
    )
  }
};

export const setLineToY = (payload: SetLineToYPayload): LayerTypes => ({
  type: SET_LINE_TO_Y,
  payload
});

export const setLinesToY = (payload: SetLinesToYPayload): LayerTypes => ({
  type: SET_LINES_TO_Y,
  payload
});

export const setLinesToYThunk = (payload: SetLinesToYPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const pathData: string[] = [];
    const shapeIcon: string[] = [];
    const bounds: Btwx.Frame[] = [];
    const rotation: number[] = [];
    payload.layers.forEach((id) => {
      const layerItem = state.layer.present.byId[id];
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      const clone = paperLayer.clone({insert: false}) as paper.Path;
      const paperToY = artboardItem.frame.y + payload.y;
      clone.lastSegment.point.y = paperToY;
      const fromPoint = clone.firstSegment.point.round();
      const toPoint = clone.lastSegment.point.round();
      const vector = toPoint.subtract(fromPoint).round();
      const positionInArtboard = clone.position.subtract(new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y)).round();
      rotation.push(vector.angle);
      pathData.push(clone.pathData);
      shapeIcon.push(getShapeIcon(clone.pathData));
      bounds.push({
        ...layerItem.frame,
        x: positionInArtboard.x,
        y: positionInArtboard.y,
        innerWidth: Math.round(vector.length),
        innerHeight: 0,
        width: clone.bounds.width,
        height: clone.bounds.height
      });
    });
    dispatch(
      setLinesToY({
        ...payload,
        pathData,
        shapeIcon,
        bounds,
        rotation
      })
    )
  }
};

export const setLineTo = (payload: SetLineToPayload): LayerTypes => ({
  type: SET_LINE_TO,
  payload
});

export const setLineToThunk = (payload: SetLineToPayload) => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const layerItem = state.layer.present.byId[payload.id];
    const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
    const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id: payload.id}}) as paper.CompoundPath;
    const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
    const to = new paperMain.Point(payload.x, payload.y);
    const relTo = to.subtract(artboardPosition).round();
    const fromPoint = paperLayer.firstSegment.point.round();
    const toPoint = paperLayer.lastSegment.point.round();
    const vector = toPoint.subtract(fromPoint).round();
    const positionInArtboard = paperLayer.position.subtract(artboardPosition).round();
    const rotation = vector.angle;
    const pathData = paperLayer.pathData;
    const shapeIcon = getShapeIcon(paperLayer.pathData);
    const bounds = {
      ...layerItem.frame,
      x: positionInArtboard.x,
      y: positionInArtboard.y,
      innerWidth: Math.round(vector.length),
      innerHeight: 0,
      width: paperLayer.bounds.width,
      height: paperLayer.bounds.height
    }
    dispatch(
      setLineTo({
        ...payload,
        x: relTo.x,
        y: relTo.y,
        pathData,
        shapeIcon,
        bounds,
        rotation
      })
    )
  }
};

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
    let bounds = {};
    state.layer.present.selected.forEach((id) => {
      const layerItem = state.layer.present.byId[id] as Btwx.Image;
      const od = layerItem.originalDimensions;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const paperLayer = paperMain.projects[artboardItem.projectIndex].getItem({data: {id}});
      const clone = paperLayer.clone({insert: false}) as paper.Item;
      const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
      const startPosition = clone.position;
      clearLayerTransforms({
        layerType: layerItem.type,
        paperLayer: clone,
        transform: layerItem.transform
      });
      clone.bounds.width = od.width;
      clone.bounds.height = od.height;
      applyLayerTransforms({
        paperLayer: clone,
        transform: layerItem.transform
      });
      bounds = {
        ...bounds,
        [id]: {
          ...layerItem.frame,
          innerWidth: od.width,
          innerHeight: od.height,
          width: clone.bounds.width,
          height: clone.bounds.height
        }
      }
    });
    dispatch(
      resetImagesDimensions({
        layers: state.layer.present.selected,
        bounds
      })
    )
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
      const state = getState() as RootState;
      (window as any).api.insertImage().then((data) => {
        const base64 = bufferToBase64(data.buffer);
        const fullBase64 = `data:image/${data.ext};base64,${base64}`;
        const sessionImageExists = state.session.images.allIds.find((id) => state.session.images.byId[id].base64 === fullBase64);
        const imageId = sessionImageExists ? sessionImageExists : uuidv4();
        const newImage = new Image();
        newImage.onload = () => {
          const originalDimensions = {
            width: newImage.width,
            height: newImage.height
          }
          if (!sessionImageExists) {
            dispatch(addSessionImage({
              id: imageId,
              base64: fullBase64
            }));
          }
          dispatch(replaceImages({
            layers: state.layer.present.selected,
            imageId,
            originalDimensions
          }));
          // if (allInstancesSelected) {
          //   dispatch(removeDocumentImages({
          //     images: [(state.layer.present.byId[state.layer.present.selected[0]] as Btwx.Image).imageId]
          //   }));
          // } else {
          //   if (removedDocumentImages.length > 0) {
          //     dispatch(removeDocumentImages({
          //       images: removedDocumentImages
          //     }));
          //   }
          // }
          resolve(null);
        }
        newImage.src = fullBase64;
      });
    });
  }
};

// need to copy events if artboards are copied
// need to change copied names so copied events work
export const copySelectedToClipboardThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
      const bounds = getSelectedBounds(state);
      const fullSelected = getSelectedAndDescendentsFull(state);
      const nonArtboardBounds = getLayersBounds(state.layer.present, fullSelected.topScopeChildren);
      const images = fullSelected.allImageIds.reduce((result: { [id: string]: Btwx.DocumentImage }, current) => {
        const layerItem = state.layer.present.byId[current];
        const imageId = (layerItem as Btwx.Image).imageId;
        if (!Object.keys(result).includes(imageId)) {
          result[imageId] = state.session.images.byId[imageId];
        }
        return result;
      }, {});
      (window as any).api.writeClipboardText(JSON.stringify({
        ...fullSelected,
        compiledIds: [...fullSelected.compiledIds, ...Object.keys(images)],
        type: 'layers',
        bounds,
        nonArtboardBounds,
        images,
      }));
    }
  }
}

export const copyStyleThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length === 1) {
      const layerItem = state.layer.present.byId[state.layer.present.selected[0]];
      const style = layerItem.style;
      const textStyle = layerItem.type === 'Text' ? (layerItem as Btwx.Text).textStyle : null;
      (window as any).api.writeClipboardText(JSON.stringify({
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
    if (state.canvasSettings.focusing && state.layer.present.selected.length === 1 && state.layer.present.byId[state.layer.present.selected[0]].type === 'Shape') {
      const id = state.layer.present.selected[0];
      const layerItem = state.layer.present.byId[id] as Btwx.Text;
      const artboardItem = state.layer.present.byId[layerItem.artboard] as Btwx.Artboard;
      const projectIndex = artboardItem.projectIndex;
      const paperLayer = paperMain.projects[projectIndex].getItem({ data: { id }}) as paper.CompoundPath;
      if (paperLayer && paperLayer.pathData) {
        (window as any).api.writeClipboardText(paperLayer.pathData);
      }
    }
  }
};

export const pasteStyleThunk = () => {
  return (dispatch: any, getState: any): Promise<any> => {
    const state = getState() as RootState;
    if (state.canvasSettings.focusing && state.layer.present.selected.length > 0) {
      try {
        const text = (window as any).api.readClipboardText();
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
    if (state.canvasSettings.focusing) {
      const clipboardText = (window as any).api.readClipboardText();
      const svg = paperMain.project.importSVG(clipboardText, {insert: false});
      console.log(svg);
    }
  }
};

export const pasteLayersFromClipboard = (payload: PasteLayersFromClipboardPayload): LayerTypes => ({
  type: PASTE_LAYERS_FROM_CLIPBOARD,
  payload
});

interface HandlePasteText {
  state: RootState;
  resolve: any;
  dispatch: any;
  overSelection: boolean;
}

const handlePasteText = ({state, dispatch, resolve, overSelection}: HandlePasteText) => {
  const formats = (window as any).api.readClipboardFormats();
  if (formats.some(format => format.startsWith('text'))) {
    const activeArtboard = state.layer.present.activeArtboard;
    const activeArtboardItem = activeArtboard ? state.layer.present.byId[activeArtboard] as Btwx.Artboard : null;
    const topScopeId = state.layer.present.scope[state.layer.present.scope.length - 1] === 'root'
    ? activeArtboard
      ? activeArtboard
      : null
    : state.layer.present.scope[state.layer.present.scope.length - 1];
    const topScopeItem = topScopeId ? state.layer.present.byId[topScopeId] as Btwx.Artboard | Btwx.Group : null
    const text = (window as any).api.readClipboardText();
    const parsedText: Btwx.ClipboardLayers = JSON.parse(text);
    if (parsedText.type && (parsedText.type === 'layers' || parsedText.type === 'sketch-layers')) {
      // replace old ids with new ids
      const withNewIds: string = parsedText.compiledIds.reduce((result: string, current: string) => {
        const newId = uuidv4();
        result = result.replaceAll(current, newId);
        return result;
      }, text);
      // parsed layers with new ids
      const parsedClipboardLayers: Btwx.ClipboardLayers = JSON.parse(withNewIds);
      let rootChildrenLength = state.layer.present.byId.root.children.length;
      let lastTopScopeChild = topScopeItem ? topScopeItem.children[topScopeItem.children.length - 1] : null;
      let lastTopScopeChildFromClip = false;
      const nonArtboardBounds = new paperMain.Rectangle(
        new paperMain.Point(
          (parsedClipboardLayers.nonArtboardBounds as number[])[1],
          (parsedClipboardLayers.nonArtboardBounds as number[])[2]
        ),
        new paperMain.Size(
          (parsedClipboardLayers.nonArtboardBounds as number[])[3],
          (parsedClipboardLayers.nonArtboardBounds as number[])[4]
        )
      );
      // create artboard for non-artboard copied layers
      const artboardId = uuidv4();
      let newArtboard = {
        type: 'Artboard',
        id: artboardId,
        name: 'Artboard',
        artboard: artboardId,
        parent: 'root',
        children: parsedClipboardLayers.topScopeChildren,
        scope: ['root'],
        frame: {
          innerWidth: nonArtboardBounds.width,
          innerHeight: nonArtboardBounds.height,
          width: nonArtboardBounds.width,
          height: nonArtboardBounds.height,
          x: nonArtboardBounds.x,
          y: nonArtboardBounds.y
        },
        showChildren: true,
        selected: false,
        hover: false,
        events: [],
        originForEvents: [],
        destinationForEvents: [],
        tweens: {
          allIds: [],
          asOrigin: [],
          asDestination: [],
          byProp: TWEEN_PROPS_MAP
        },
        transform: DEFAULT_TRANSFORM,
        style: getLayerStyle({layer:{type:'Artboard'}})
      };
      let clipboardLayers: Btwx.ClipboardLayers = parsedClipboardLayers.main.reduce((result, current) => {
        const layerItem = result.byId[current];
        const isLast = result.topScopeChildren.length === 1 && result.topScopeChildren[0] === current;
        // handle artboard main layers
        if (layerItem.type === 'Artboard') {
          const projectIndex = Math.floor(rootChildrenLength / ARTBOARDS_PER_PROJECT) + 1;
          result = {
            ...result,
            byId: {
              ...result.byId,
              [current]: {
                ...result.byId[current],
                projectIndex: projectIndex
              }
            } as any
          }
          rootChildrenLength++;
        }
        // handle non-artboard main layers
        else {
          // if active artboard, add non-artboard main layers to active artboard
          if (activeArtboard) {
            const lastTopScopeChildItem: Btwx.MaskableLayer = lastTopScopeChildFromClip ? result.byId[lastTopScopeChild] as Btwx.MaskableLayer : state.layer.present.byId[lastTopScopeChild] as Btwx.MaskableLayer;
            const isLastTopScopeChildMask = lastTopScopeChildItem && lastTopScopeChildItem.type === 'Shape' && (lastTopScopeChildItem as Btwx.Shape).mask;
            result = {
              ...result,
              byId: {
                ...result.byId,
                [current]: {
                  ...result.byId[current],
                  underlyingMask: lastTopScopeChildItem ? isLastTopScopeChildMask ? lastTopScopeChildItem.id : lastTopScopeChildItem.underlyingMask : null,
                  parent: topScopeItem.id,
                  artboard: activeArtboard,
                  scope: [...topScopeItem.scope, topScopeItem.id],
                  events: [],
                  tweens: {
                    allIds: [],
                    asOrigin: [],
                    asDestination: [],
                    byProp: TWEEN_PROPS_MAP
                  },
                }
              } as any
            }
            if (lastTopScopeChildItem && (lastTopScopeChildItem.masked || isLastTopScopeChildMask) && !(layerItem as Btwx.MaskableLayer).ignoreUnderlyingMask) {
              result = {
                ...result,
                byId: {
                  ...result.byId,
                  [current]: {
                    ...result.byId[current],
                    masked: true
                  }
                } as any
              }
            }
            lastTopScopeChild = current;
            if (!lastTopScopeChildFromClip) {
              lastTopScopeChildFromClip = true;
            }
            // update layerItem children with fresh events/tweens
            if (layerItem.type === 'Group') {
              const groups: string[] = [current];
              const groupLayers: { [id: string]: Btwx.Layer } = {};
              let i = 0;
              while(i < groups.length) {
                const groupLayerItem = result.byId[groups[i]];
                if (groupLayerItem.children) {
                  groupLayerItem.children.forEach((child) => {
                    result = {
                      ...result,
                      byId: {
                        ...result.byId,
                        [child]: {
                          ...result.byId[child],
                          events: [],
                          tweens: {
                            allIds: [],
                            asOrigin: [],
                            asDestination: [],
                            byProp: TWEEN_PROPS_MAP
                          },
                        }
                      }
                    }
                    const groupChildLayerItem = result.byId[child];
                    if (groupChildLayerItem.children && groupChildLayerItem.children.length > 0) {
                      groups.push(child);
                    }
                    groupLayers[child] = groupChildLayerItem;
                  });
                }
                i++;
              }
            }
          }
          // if no active artboard, do other relevant stuff
          else {
            // update layerItem and others
            const prevArtboard = result.topScopeArtboards.byId[result.byId[current].artboard];
            result = {
              ...result,
              byId: {
                ...result.byId,
                [current]: {
                  ...result.byId[current],
                  frame: {
                    ...result.byId[current].frame,
                    x: ((result.byId[current].frame.x + prevArtboard.frame.x) - nonArtboardBounds.x) - nonArtboardBounds.width / 2,
                    y: ((result.byId[current].frame.y + prevArtboard.frame.y) - nonArtboardBounds.y) - nonArtboardBounds.height / 2
                  },
                  selected: false,
                  hover: false,
                  scope: ['root', artboardId],
                  parent: artboardId,
                  artboard: artboardId,
                  events: [],
                  tweens: {
                    allIds: [],
                    asOrigin: [],
                    asDestination: [],
                    byProp: TWEEN_PROPS_MAP
                  },
                }
              } as any
            }
            // remove from topScope and main arrays
            result = {
              ...result,
              topScopeChildren: result.topScopeChildren.filter((id) => id !== current),
              main: result.main.filter((id) => id !== current)
            }
            // update layerItem children with new artboard and scope if group
            if (layerItem.type === 'Group') {
              const groups: string[] = [current];
              const groupLayers: { [id: string]: Btwx.Layer } = {};
              let i = 0;
              while(i < groups.length) {
                const groupLayerItem = result.byId[groups[i]];
                if (groupLayerItem.children) {
                  groupLayerItem.children.forEach((child) => {
                    result = {
                      ...result,
                      byId: {
                        ...result.byId,
                        [child]: {
                          ...result.byId[child],
                          artboard: artboardId,
                          scope: [...groupLayerItem.scope, ...groupLayerItem.id],
                          events: [],
                          tweens: {
                            allIds: [],
                            asOrigin: [],
                            asDestination: [],
                            byProp: TWEEN_PROPS_MAP
                          },
                        }
                      }
                    }
                    const groupChildLayerItem = result.byId[child];
                    if (groupChildLayerItem.children && groupChildLayerItem.children.length > 0) {
                      groups.push(child);
                    }
                    groupLayers[child] = groupChildLayerItem;
                  });
                }
                i++;
              }
            }
            // if last, add new artboard to arrays
            if (isLast) {
              result = {
                ...result,
                allIds: [...result.allIds, artboardId],
                allArtboardIds: [...result.allArtboardIds, artboardId],
                compiledIds: [...result.compiledIds, artboardId],
                topScopeChildren: result.topScopeChildren.filter((id) => id !== current),
                main: [...result.main, artboardId],
                byId: {
                  ...result.byId,
                  [artboardId]: {
                    ...newArtboard,
                    projectIndex: Math.floor(rootChildrenLength / ARTBOARDS_PER_PROJECT) + 1
                  } as Btwx.Artboard
                }
              }
            }
          }
        }
        return result;
      }, parsedClipboardLayers);
      // create clipboard bounds
      const clipboardBounds = new paperMain.Rectangle(
        new paperMain.Point(
          (clipboardLayers.bounds as number[])[1],
          (clipboardLayers.bounds as number[])[2]
        ),
        new paperMain.Size(
          (clipboardLayers.bounds as number[])[3],
          (clipboardLayers.bounds as number[])[4]
        )
      );
      // handle if clipboard position is not within viewport
      if (!clipboardBounds.center.isInside(paperMain.view.bounds)) {
        const pointDiff = paperMain.view.center.subtract(clipboardBounds.center).round();
        clipboardLayers.main.forEach((id) => {
          const clipboardLayerItem = clipboardLayers.byId[id];
          if (clipboardLayerItem.type === 'Artboard') {
            clipboardLayerItem.frame.x += pointDiff.x;
            clipboardLayerItem.frame.y += pointDiff.y;
          }
        });
      }
      // handle paste over selection
      if (overSelection && state.layer.present.selected.length > 0) {
        const selectedBounds = getSelectedBounds(state);
        const selectionPosition = selectedBounds.center;
        const pointDiff = selectionPosition.subtract(clipboardBounds.center).round();
        clipboardLayers.main.forEach((id) => {
          const clipboardLayerItem = clipboardLayers.byId[id];
          const prevX = clipboardLayerItem.frame.x;
          const prevY = clipboardLayerItem.frame.y;
          clipboardLayerItem.frame.x += pointDiff.x;
          clipboardLayerItem.frame.y += pointDiff.y;
          if (clipboardLayerItem.type !== 'Artboard') {
            const prevLayerItem = parsedClipboardLayers.byId[id];
            const prevArtboardItem = parsedClipboardLayers.topScopeArtboards.byId[prevLayerItem.artboard];
            const artboardXDiff = activeArtboardItem.frame.x - prevArtboardItem.frame.x;
            const artboardYDiff = activeArtboardItem.frame.y - prevArtboardItem.frame.y;
            clipboardLayerItem.frame.x -= artboardXDiff;
            clipboardLayerItem.frame.y -= artboardYDiff;
            const xDiff = clipboardLayerItem.frame.x - prevX;
            const yDiff = clipboardLayerItem.frame.y - prevY;
            if (clipboardLayerItem.type === 'Text') {
              (clipboardLayerItem as Btwx.Text).point.x += xDiff;
              (clipboardLayerItem as Btwx.Text).point.y += yDiff;
              (clipboardLayerItem as Btwx.Text).lines.forEach((line) => {
                line.frame.x += xDiff;
                line.frame.y += yDiff;
                line.anchor.x += xDiff;
                line.anchor.y += yDiff;
              });
            }
            if (clipboardLayerItem.type === 'Shape' && (clipboardLayerItem as Btwx.Shape).shapeType === 'Line') {
              (clipboardLayerItem as Btwx.Line).from.x += xDiff;
              (clipboardLayerItem as Btwx.Line).from.y += yDiff;
              (clipboardLayerItem as Btwx.Line).to.x += xDiff;
              (clipboardLayerItem as Btwx.Line).to.y += yDiff;
            }
          }
        });
      }
      // handle images
      Object.keys(clipboardLayers.images).forEach((imgId) => {
        const documentImage = clipboardLayers.images[imgId];
        // const documentImageExists = state.documentSettings.images.allIds.length > 0 && state.documentSettings.images.allIds.find((id) => Buffer.from(state.documentSettings.images.byId[id].buffer).equals(buffer));
        const sessionImageExists = state.session.images.allIds.find((id) => state.session.images.byId[id].base64 === documentImage.base64);
        if (!sessionImageExists) {
          // if (!documentImageExists) {
          //   dispatch(addDocumentImage(documentImage));
          // }
          dispatch(addSessionImage(documentImage));
        } else {
          clipboardLayers = clipboardLayers.allImageIds.filter((id) =>
            (clipboardLayers.byId[id] as Btwx.Image).imageId === imgId
          ).reduce((result, current) => ({
            ...result,
            byId: {
              ...result.byId,
              [current]: {
                ...result.byId[current],
                imageId: sessionImageExists
              } as Btwx.Image
            }
          }), clipboardLayers);
        }
      });
      if (clipboardLayers.type === 'sketch-layers') {
        // Dont have galaxy brain math skillz to figure out point in plugin...
        // so I do it here
        clipboardLayers = clipboardLayers.allTextIds.reduce((result, current) => {
          const textItem = clipboardLayers.byId[current] as Btwx.Text;
          const artboardItem = (clipboardLayers.byId[textItem.artboard] ? clipboardLayers.byId[textItem.artboard] : state.layer.present.byId[textItem.artboard]) as Btwx.Artboard;
          const point = new paperMain.Point(textItem.point.x, textItem.point.y);
          const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
          const getAreaTextRectangle = () => {
            const artboardPosition = new paperMain.Point(artboardItem.frame.x, artboardItem.frame.y);
            const textPosition = new paperMain.Point(textItem.frame.x, textItem.frame.y);
            const absPosition = textPosition.add(artboardPosition);
            const topLeft = new paperMain.Point(
              absPosition.x - (textItem.frame.innerWidth / 2),
              absPosition.y - (textItem.frame.innerHeight / 2)
            );
            const bottomRight = new paperMain.Point(
              absPosition.x + (textItem.frame.innerWidth / 2),
              absPosition.y + (textItem.frame.innerHeight / 2)
            );
            return new paperMain.Rectangle({
              from: topLeft,
              to: bottomRight
            });
          }
          const textContainer = new paperMain.Group({
            insert: false,
            children: [
              new paperMain.Path.Rectangle({
                rectangle: getAreaTextRectangle(),
                // fillColor: tinyColor('#fff').setAlpha(0.01).toRgbString(),
                // blendMode: 'multiply',
                fillColor: '#000',
                data: {
                  id: 'textMask',
                  type: 'LayerChild',
                  layerType: 'Text'
                },
                clipMask: true
              }),
              new paperMain.Path.Rectangle({
                rectangle: getAreaTextRectangle(),
                // fillColor: tinyColor('#fff').setAlpha(0.01).toRgbString(),
                // blendMode: 'multiply',
                fillColor: tinyColor('red').setAlpha(0.25).toRgbString(),
                data: {
                  id: 'textBackground',
                  type: 'LayerChild',
                  layerType: 'Text'
                }
              }),
              new paperMain.PointText({
                point: point.add(artboardPosition),
                data: {
                  id: 'textContent',
                  type: 'LayerChild',
                  layerType: 'Text'
                },
                content: getContent({
                  paragraphs: textItem.paragraphs
                }),
                ...getPaperStyle({
                  style: textItem.style,
                  textStyle: textItem.textStyle,
                  isLine: false,
                  layerFrame: textItem.frame,
                  artboardFrame: artboardItem.frame
                })
              })
            ]
          });
          const initialLineAnchor = textItem.lines[0].anchor;
          const absAnchor = new paperMain.Point(initialLineAnchor.x, initialLineAnchor.y).add(artboardPosition);
          const textContent = textContainer.getItem({data:{id:'textContent'}}) as paper.PointText;
          positionTextContent({
            paperLayer: textContainer,
            verticalAlignment: textItem.textStyle.verticalAlignment,
            justification: textItem.textStyle.justification,
            textResize: textItem.textStyle.textResize
          });
          const pointYDiff = textContent.point.y - absAnchor.y;
          textContainer.position.y -= pointYDiff;
          applyLayerTransforms({
            paperLayer: textContainer,
            transform: textItem.transform
          });
          const pointWithTransforms = textContent.point.subtract(artboardPosition);
          const positionWithTransforms = textContainer.position.subtract(artboardPosition);
          return {
            ...result,
            byId: {
              ...result.byId,
              [current]: {
                ...result.byId[current],
                frame: {
                  ...result.byId[current].frame,
                  y: positionWithTransforms.y
                },
                point: {
                  x: pointWithTransforms.x,
                  y: pointWithTransforms.y
                }
              } as Btwx.Text
            }
          }
        }, clipboardLayers);
        // same goes for shape icons
        clipboardLayers = clipboardLayers.allShapeIds.reduce((result, current) => {
          const iconData = getShapeIcon((clipboardLayers.byId[current] as Btwx.Shape).pathData);
          return {
            ...result,
            shapeIcons: {
              ...result.shapeIcons,
              [current]: iconData
            }
          }
        }, clipboardLayers);
      }
      dispatch(pasteLayersFromClipboard({
        clipboardLayers,
        overSelection,
        overPoint: null,
        overLayer: null
      }));
      resolve(null);
    }
  }
  resolve(null);
}

const handleImagePaste = ({state, dispatch, resolve, overSelection}: HandlePasteText) => {
  const formats = (window as any).api.readClipboardFormats();
  // if (formats.some(format => format.startsWith('text'))) {
  //   if (state.layer.present.activeArtboard) {
  //     const text = clipboard.readText();
  //     const textSettings = state.textSettings;
  //     const activeArtboardItem = state.layer.present.byId[state.layer.present.activeArtboard];
  //     const artboardPosition = new paperMain.Point(activeArtboardItem.frame.x, activeArtboardItem.frame.y);
  //     const youngestChild = activeArtboardItem.children[activeArtboardItem.children.length - 1];
  //     const youngestChildItem = state.layer.present.byId[youngestChild] as Btwx.MaskableLayer;
  //     // paste text as text layer
  //     const textLayer = new paperMain.PointText({
  //       point: artboardPosition,
  //       data: {
  //         id: 'textContent',
  //         type: 'LayerChild',
  //         layerType: 'Text'
  //       },
  //       content: text,
  //       insert: false,
  //       fontFamily: textSettings.fontFamily,
  //       fontSize: textSettings.fontSize,
  //       fontWeight: textSettings.fontWeight,
  //       letterSpacing: textSettings.letterSpacing,
  //       textTransform: textSettings.textTransform,
  //       fillColor: textSettings.fillColor,
  //       leading: getLeading({
  //         leading: textSettings.leading,
  //         fontSize: textSettings.fontSize
  //       })
  //     });
  //     textLayer.position = artboardPosition;
  //     const positionInArtboard = artboardPosition.subtract(textLayer.position);
  //     const pointInArtboard = artboardPosition.subtract(textLayer.point);
  //     const newTextLayer = {
  //       type: 'Text',
  //       name: text,
  //       artboard: state.layer.present.activeArtboard,
  //       parent: state.layer.present.activeArtboard,
  //       children: null,
  //       scope: ['root', state.layer.present.activeArtboard],
  //       frame: {
  //         x: positionInArtboard.x,
  //         y: positionInArtboard.y,
  //         width: textLayer.bounds.width,
  //         height: textLayer.bounds.height,
  //         innerWidth: textLayer.bounds.width,
  //         innerHeight: textLayer.bounds.height
  //       },
  //       underlyingMask: youngestChild ? youngestChildItem.underlyingMask : null,
  //       ignoreUnderlyingMask: false,
  //       masked: youngestChild ? (youngestChildItem.masked || (youngestChildItem.type === 'Shape' && (youngestChildItem as Btwx.Shape).mask)) : null,
  //       showChildren: false,
  //       selected: false,
  //       hover: false,
  //       events: [],
  //       tweens: {
  //         allIds: [],
  //         asOrigin: [],
  //         asDestination: [],
  //         byProp: TWEEN_PROPS_MAP
  //       },
  //       transform: DEFAULT_TRANSFORM,
  //       style: {
  //         ...DEFAULT_STYLE,
  //         fill: {
  //           ...DEFAULT_STYLE.fill,
  //           color: textSettings.fillColor
  //         },
  //         stroke: {
  //           ...DEFAULT_STYLE.stroke,
  //           enabled: false
  //         }
  //       },
  //       textStyle: {
  //         fontSize: textSettings.fontSize,
  //         leading: textSettings.leading,
  //         fontWeight: textSettings.fontWeight,
  //         fontFamily: textSettings.fontFamily,
  //         justification: textSettings.justification,
  //         letterSpacing: textSettings.letterSpacing,
  //         textTransform: textSettings.textTransform,
  //         textResize: 'autoWidth',
  //         verticalAlignment: 'top',
  //         fontStyle: textSettings.fontStyle
  //       },
  //       point: {
  //         x: pointInArtboard.x,
  //         y: pointInArtboard.y
  //       },
  //       text: text,
  //       lines: getTextLines({
  //         paperLayer: textLayer,
  //         leading: getLeading({
  //           leading: textSettings.leading,
  //           fontSize: textSettings.fontSize
  //         }),
  //         artboardPosition: artboardPosition,
  //         paragraphs: [[text]]
  //       }),
  //       paragraphs: [[text]]
  //     } as Btwx.Text;
  //     dispatch(addTextThunk({
  //       layer: newTextLayer,
  //       batch: false
  //     }));
  //   }
  // }
  // handle image paste
  if (formats.some(format => format.startsWith('image'))) {
    if (state.layer.present.activeArtboard) {
      const activeArtboardItem = state.layer.present.byId[state.layer.present.activeArtboard];
      const artboardPosition = new paperMain.Point(activeArtboardItem.frame.x, activeArtboardItem.frame.y);
      const base64 = (window as any).api.readClipboardImage();
      const originalDimensions = (window as any).api.readClipboardImageSize();
      let x = 0;
      let y = 0;
      if (overSelection && state.layer.present.selected.length > 0) {
        const selectedBounds = getSelectedBounds(state);
        const pos = selectedBounds.center.subtract(artboardPosition);
        x = pos.x;
        y = pos.y;
      }
      dispatch(addImageThunk({
        layer: {
          name: 'image',
          frame: {
            x: x,
            y: y,
            width: originalDimensions.width,
            height: originalDimensions.height,
            innerWidth: originalDimensions.width,
            innerHeight: originalDimensions.height
          },
          originalDimensions: {
            width: originalDimensions.width,
            height: originalDimensions.height
          }
        },
        base64: base64 as string
      }));
    }
  }
  resolve(null);
}

export const pasteLayersThunk = (props?: { overSelection?: boolean; overPoint?: Btwx.Point; overLayer?: string }) => {
  return (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const { overSelection, overPoint, overLayer } = props;
      const state = getState() as RootState;
      try {
        handlePasteText({state, resolve, overSelection, dispatch});
      } catch(error) {
        console.log(error);
        handleImagePaste({state, resolve, overSelection, dispatch});
      }
    });
  }
};

export const setLayerTree = (): LayerTypes => ({
  type: SET_LAYER_TREE
});

export const setLayerTreeScroll = (payload: SetLayerTreeScrollPayload): LayerTypes => ({
  type: SET_LAYER_TREE_SCROLL,
  payload
});

export const setLayerTreeStickyArtboard = (payload: SetLayerTreeStickyArtboardPayload): LayerTypes => ({
  type: SET_LAYER_TREE_STICKY_ARTBOARD,
  payload
});

export const undoThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.past.length > 0) {
      const layerState = state.layer.past[state.layer.past.length - 1];
      const fullState = {
        ...state,
        layer: {
          ...state.layer,
          present: layerState
        }
      }
      //
      if (state.layer.present.hover !== null) {
        dispatch(setLayerHover({id: null}));
      }
      // undo
      dispatch(ActionCreators.undo());
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
                  dispatch(openColorEditor({
                    x: state.gradientEditor.x,
                    y: state.gradientEditor.y,
                    prop: state.gradientEditor.prop
                  }));
                }
              }
              break;
            }
            case 'color': {
              if (state.colorEditor.isOpen) {
                dispatch(closeColorEditor());
                if (state.colorEditor.prop === 'fill') {
                  dispatch(openGradientEditor({
                    x: state.colorEditor.x,
                    y: state.colorEditor.y,
                    prop: state.colorEditor.prop
                  }));
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
                  dispatch(openColorEditor({
                    x: state.gradientEditor.x,
                    y: state.gradientEditor.y,
                    prop: state.gradientEditor.prop
                  }));
                }
              }
              break;
            }
            case 'color': {
              if (state.colorEditor.isOpen) {
                dispatch(closeColorEditor());
                if (state.colorEditor.prop === 'stroke') {
                  dispatch(openGradientEditor({
                    x: state.colorEditor.x,
                    y: state.colorEditor.y,
                    prop: state.colorEditor.prop
                  }));
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
      if (state.viewSettings.eventDrawer.isOpen && layerState.events.allIds.length > 0) {
        updateEventsFrame(fullState);
      }
    }
  }
};

export const redoThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    if (state.layer.future.length > 0) {
      const layerState = state.layer.future[0];
      const fullState = {
        ...state,
        layer: {
          ...state.layer,
          present: layerState
        }
      }
      //
      if (state.layer.present.hover !== null) {
        dispatch(setLayerHover({id: null}));
      }
      // redo
      dispatch(ActionCreators.redo());
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
                  dispatch(openGradientEditor({
                    x: state.colorEditor.x,
                    y: state.colorEditor.y,
                    prop: state.colorEditor.prop
                  }));
                }
              }
              break;
            }
            case 'color': {
              if (state.gradientEditor.isOpen) {
                dispatch(closeGradientEditor());
                if (state.gradientEditor.prop === 'fill') {
                  dispatch(openColorEditor({
                    x: state.gradientEditor.x,
                    y: state.gradientEditor.y,
                    prop: state.gradientEditor.prop
                  }));
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
                  dispatch(openGradientEditor({
                    x: state.colorEditor.x,
                    y: state.colorEditor.y,
                    prop: state.colorEditor.prop
                  }));
                }
              }
              break;
            }
            case 'color': {
              if (state.gradientEditor.isOpen) {
                dispatch(closeGradientEditor());
                if (state.colorEditor.prop === 'stroke') {
                  dispatch(openColorEditor({
                    x: state.gradientEditor.x,
                    y: state.gradientEditor.y,
                    prop: state.gradientEditor.prop
                  }));
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
      if (state.viewSettings.eventDrawer.isOpen && layerState.events.allIds.length > 0) {
        updateEventsFrame(fullState);
      }
    }
  }
};

export const updateActiveArtboardFrameThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const activeArtboard = state.layer.present.activeArtboard;
    const themeName = state.preferences.theme;
    if (activeArtboard) {
      const { paperLayer } = getItemLayers(state.layer.present, activeArtboard);
      updateActiveArtboardFrame({
        bounds: paperLayer.getItem({data: {id: 'artboardBackground'}}).bounds,
        themeName
      });
    }
  }
};

export const updateEventsFrameThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    updateEventsFrame(state);
  }
};

export const updateFramesThunk = () => {
  return (dispatch: any, getState: any): void => {
    const state = getState() as RootState;
    const artboardItems = getAllArtboardItems(state);
    const activeArtboardBounds = getActiveArtboardBounds(state);
    const themeName = state.preferences.theme;
    // const selectedInnerBounds = getSelectedBounds(state);
    const selectedBounds = getSelectedBounds(state);
    // const selectedRotation = getSelectedRotation(state);
    // const selectedPaperScopes = getSelectedProjectIndices(state);
    const singleSelection = state.layer.present.selected.length === 1;
    const isLine = singleSelection && state.layer.present.byId[state.layer.present.selected[0]].type === 'Shape' && (state.layer.present.byId[state.layer.present.selected[0]] as Btwx.Shape).shapeType === 'Line';
    const lineItem = isLine ? state.layer.present.byId[state.layer.present.selected[0]] as Btwx.Line : null;
    const artboardItem = isLine ? state.layer.present.byId[lineItem.artboard] : null;
    // const linePaperLayer = isLine ? getPaperLayer(Object.keys(selectedPaperScopes)[0], selectedPaperScopes[Object.keys(selectedPaperScopes)[0]]) : null;
    // const canvasWrap = document.getElementById('canvas-container');
    // ['ui', ...state.layer.present.byId.root.children].forEach((scope, index) => {
    //   paperMain.projects[index].view.viewSize = new paperMain.Size(canvasWrap.clientWidth, canvasWrap.clientHeight);
    //   paperMain.projects[index].view.matrix.set(state.documentSettings.matrix);
    // });
    updateSelectionFrame({
      // bounds: selectedRotation !== 'multi' && selectedRotation !== 0 ? selectedInnerBounds : selectedBounds,
      bounds: selectedBounds,
      handle: 'all',
      lineHandles: isLine ? {
        from: {
          x: artboardItem.frame.x + lineItem.from.x,
          y: artboardItem.frame.y + lineItem.from.y
        },
        to: {
          x: artboardItem.frame.x + lineItem.to.x,
          y: artboardItem.frame.y + lineItem.to.y
        }
      } : null
      // rotation: selectedRotation !== 'multi' && selectedRotation !== 0 ? selectedRotation : null
    });
    updateActiveArtboardFrame({
      bounds: activeArtboardBounds,
      themeName
    });
    updateEventsFrame(state);
    updateNamesFrame(artboardItems);
  }
}

export const hydrateLayers = (payload: LayerState): LayerTypes => ({
  type: HYDRATE_LAYERS,
  payload
});

export const enableGroupScroll = (payload: EnableGroupScrollPayload): LayerTypes => ({
  type: ENABLE_GROUP_SCROLL,
  payload
});

export const enableGroupsScroll = (payload: EnableGroupsScrollPayload): LayerTypes => ({
  type: ENABLE_GROUPS_SCROLL,
  payload
});

export const disableGroupScroll = (payload: DisableGroupScrollPayload): LayerTypes => ({
  type: DISABLE_GROUP_SCROLL,
  payload
});

export const disableGroupsScroll = (payload: DisableGroupsScrollPayload): LayerTypes => ({
  type: DISABLE_GROUPS_SCROLL,
  payload
});

//

export const enableGroupHorizontalScroll = (payload: EnableGroupHorizontalScrollPayload): LayerTypes => ({
  type: ENABLE_GROUP_HORIZONTAL_SCROLL,
  payload
});

export const enableGroupsHorizontalScroll = (payload: EnableGroupsHorizontalScrollPayload): LayerTypes => ({
  type: ENABLE_GROUPS_HORIZONTAL_SCROLL,
  payload
});

export const disableGroupHorizontalScroll = (payload: DisableGroupHorizontalScrollPayload): LayerTypes => ({
  type: DISABLE_GROUP_HORIZONTAL_SCROLL,
  payload
});

export const disableGroupsHorizontalScroll = (payload: DisableGroupsHorizontalScrollPayload): LayerTypes => ({
  type: DISABLE_GROUPS_HORIZONTAL_SCROLL,
  payload
});

//

export const enableGroupVerticalScroll = (payload: EnableGroupVerticalScrollPayload): LayerTypes => ({
  type: ENABLE_GROUP_VERTICAL_SCROLL,
  payload
});

export const enableGroupsVerticalScroll = (payload: EnableGroupsVerticalScrollPayload): LayerTypes => ({
  type: ENABLE_GROUPS_VERTICAL_SCROLL,
  payload
});

export const disableGroupVerticalScroll = (payload: DisableGroupVerticalScrollPayload): LayerTypes => ({
  type: DISABLE_GROUP_VERTICAL_SCROLL,
  payload
});

export const disableGroupsVerticalScroll = (payload: DisableGroupsVerticalScrollPayload): LayerTypes => ({
  type: DISABLE_GROUPS_VERTICAL_SCROLL,
  payload
});

//

export const setGroupScrollOverflow = (payload: SetGroupScrollOverflowPayload): LayerTypes => ({
  type: SET_GROUP_SCROLL_OVERFLOW,
  payload
});

export const setGroupsScrollOverflow = (payload: SetGroupsScrollOverflowPayload): LayerTypes => ({
  type: SET_GROUPS_SCROLL_OVERFLOW,
  payload
});

//

export const setGroupScrollFrame = (payload: SetGroupScrollFramePayload): LayerTypes => ({
  type: SET_GROUP_SCROLL_FRAME,
  payload
});

//

export const enableGroupGroupEventTweens = (payload: EnableGroupGroupEventTweensPayload): LayerTypes => ({
  type: ENABLE_GROUP_GROUP_EVENT_TWEENS,
  payload
});

export const enableGroupsGroupEventTweens = (payload: EnableGroupsGroupEventTweensPayload): LayerTypes => ({
  type: ENABLE_GROUPS_GROUP_EVENT_TWEENS,
  payload
});

export const disableGroupGroupEventTweens = (payload: DisableGroupGroupEventTweensPayload): LayerTypes => ({
  type: DISABLE_GROUP_GROUP_EVENT_TWEENS,
  payload
});

export const disableGroupsGroupEventTweens = (payload: DisableGroupsGroupEventTweensPayload): LayerTypes => ({
  type: DISABLE_GROUPS_GROUP_EVENT_TWEENS,
  payload
});

export const addGroupWiggles = (payload: AddGroupWigglesPayload): LayerTypes => ({
  type: ADD_GROUP_WIGGLES,
  payload
});