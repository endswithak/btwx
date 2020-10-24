import {
  SET_SELECTION_BOUNDS,
  SET_CAN_ALIGN,
  SET_CAN_DISTRIBUTE,
  SET_CAN_BOOLEAN,
  SET_CAN_GROUP,
  SET_CAN_MASK,
  SET_CAN_MOVE_BACKWARD,
  SET_CAN_MOVE_FORWARD,
  SET_CAN_RESIZE,
  SET_CAN_TOGGLE_FILL,
  SET_CAN_TOGGLE_FLIP,
  SET_CAN_TOGGLE_SHADOW,
  SET_CAN_TOGGLE_STROKE,
  SET_CAN_UNGROUP,
  SET_FILL_ENABLED,
  SET_STROKE_ENABLED,
  SET_SHADOW_ENABLED,
  SET_HORIZONTAL_FLIP_ENABLED,
  SET_VERTICAL_FLIP_ENABLED,
  UPDATE_SELECTION,
  SET_CAN_TOGGLE_USE_AS_MASK,
  SET_USE_AS_MASK_ENABLED,
  SET_IGNORE_UNDERLYING_ENABLED,
  SetCanToggleUseAsMaskPayload,
  SetUseAsMaskEnabledPayload,
  SetIgnoreUnderlyingMaskEnabledPayload,
  SetSelectionBoundsPayload,
  SetCanAlignPayload,
  SetCanDistributePayload,
  SetCanBooleanPayload,
  SetCanGroupPayload,
  SetCanUngroupPayload,
  SetCanMaskPayload,
  SetCanMoveBackwardPayload,
  SetCanMoveForwardPayload,
  SetCanResizePayload,
  SetCanToggleFillPayload,
  SetCanToggleStrokePayload,
  SetCanToggleShadowPayload,
  SetCanToggleFlipPayload,
  SetFillEnabledPayload,
  SetStrokeEnabledPayload,
  SetShadowEnabledPayload,
  SetHorizontalFlipEnabledPayload,
  SetVerticalFlipEnabledPayload,
  UpdateSelectionPayload,
  SelectionTypes
} from '../actionTypes/selection';

import { RootState } from '../reducers';
import { SelectionState } from '../reducers/selection';
import { updateSelectionFrame } from '../actions/layer';

import { getLayerAndDescendants, getSelectionBounds, canToggleUseAsMaskSelection, canGroupSelection, canUngroupSelection, canSendBackwardSelection, canBringForwardSelection, canToggleSelectionStroke, canToggleSelectionShadow, canToggleSelectionFill, canTransformFlipSelection, canMaskSelection, canResizeSelection, canBooleanOperationSelection, canPasteSVG } from '../selectors/layer';

export const setSelectionBounds = (payload: SetSelectionBoundsPayload): SelectionTypes => ({
  type: SET_SELECTION_BOUNDS,
  payload
});

export const setCanAlign = (payload: SetCanAlignPayload): SelectionTypes => ({
  type: SET_CAN_ALIGN,
  payload
});

export const setCanDistribute = (payload: SetCanDistributePayload): SelectionTypes => ({
  type: SET_CAN_DISTRIBUTE,
  payload
});

export const setCanBoolean = (payload: SetCanBooleanPayload): SelectionTypes => ({
  type: SET_CAN_BOOLEAN,
  payload
});

export const setCanMask = (payload: SetCanMaskPayload): SelectionTypes => ({
  type: SET_CAN_MASK,
  payload
});

export const setCanGroup = (payload: SetCanGroupPayload): SelectionTypes => ({
  type: SET_CAN_GROUP,
  payload
});

export const setCanUngroup = (payload: SetCanUngroupPayload): SelectionTypes => ({
  type: SET_CAN_UNGROUP,
  payload
});

export const setCanMoveForward = (payload: SetCanMoveForwardPayload): SelectionTypes => ({
  type: SET_CAN_MOVE_FORWARD,
  payload
});

export const setCanMoveBackward = (payload: SetCanMoveBackwardPayload): SelectionTypes => ({
  type: SET_CAN_MOVE_BACKWARD,
  payload
});

export const setCanResize = (payload: SetCanResizePayload): SelectionTypes => ({
  type: SET_CAN_RESIZE,
  payload
});

export const setCanToggleFill = (payload: SetCanToggleFillPayload): SelectionTypes => ({
  type: SET_CAN_TOGGLE_FILL,
  payload
});

export const setCanToggleStroke = (payload: SetCanToggleStrokePayload): SelectionTypes => ({
  type: SET_CAN_TOGGLE_STROKE,
  payload
});

export const setCanToggleShadow = (payload: SetCanToggleShadowPayload): SelectionTypes => ({
  type: SET_CAN_TOGGLE_SHADOW,
  payload
});

export const setCanToggleFlip = (payload: SetCanToggleFlipPayload): SelectionTypes => ({
  type: SET_CAN_TOGGLE_FLIP,
  payload
});

export const setFillEnabled = (payload: SetFillEnabledPayload): SelectionTypes => ({
  type: SET_FILL_ENABLED,
  payload
});

export const setStrokeEnabled = (payload: SetStrokeEnabledPayload): SelectionTypes => ({
  type: SET_STROKE_ENABLED,
  payload
});

export const setShadowEnabled = (payload: SetShadowEnabledPayload): SelectionTypes => ({
  type: SET_SHADOW_ENABLED,
  payload
});

export const setHorizontalFlipEnabled = (payload: SetHorizontalFlipEnabledPayload): SelectionTypes => ({
  type: SET_HORIZONTAL_FLIP_ENABLED,
  payload
});

export const setVerticalFlipEnabled = (payload: SetVerticalFlipEnabledPayload): SelectionTypes => ({
  type: SET_VERTICAL_FLIP_ENABLED,
  payload
});

export const updateSelection = (payload: UpdateSelectionPayload): SelectionTypes => ({
  type: UPDATE_SELECTION,
  payload
});

export const setCanToggleUseAsMask = (payload: SetCanToggleUseAsMaskPayload): SelectionTypes => ({
  type: SET_CAN_TOGGLE_USE_AS_MASK,
  payload
});

export const setUseAsMaskEnabled = (payload: SetUseAsMaskEnabledPayload): SelectionTypes => ({
  type: SET_USE_AS_MASK_ENABLED,
  payload
});

export const setIgnoreUnderlyingMaskEnabled = (payload: SetIgnoreUnderlyingMaskEnabledPayload): SelectionTypes => ({
  type: SET_IGNORE_UNDERLYING_ENABLED,
  payload
});

export const updateSelectionThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const { layer } = state;
    const selected = layer.present.selected;
    const canResize = canResizeSelection(layer.present);
    const canMoveBackward = canSendBackwardSelection(layer.present);
    const canMoveForward = canBringForwardSelection(layer.present);
    const canGroup = canGroupSelection(layer.present);
    const canUngroup = canUngroupSelection(layer.present);
    const canToggleStroke = canToggleSelectionStroke(layer.present);
    const canToggleShadow = canToggleSelectionShadow(layer.present);
    const canToggleFill = canToggleSelectionFill(layer.present);
    const canToggleFlip = canTransformFlipSelection(layer.present);
    const fillEnabled = canToggleFill ? selected.every((id) => layer.present.byId[id].style.fill.enabled) : false;
    const strokeEnabled = canToggleStroke ? selected.every((id) => layer.present.byId[id].style.stroke.enabled) : false;
    const shadowEnabled = canToggleShadow ? selected.every((id) => layer.present.byId[id].style.shadow.enabled) : false;
    const horizontalFlipEnabled = canToggleFlip ? selected.every((id) => layer.present.byId[id].transform.horizontalFlip) : false;
    const verticalFlipEnabled = canToggleFlip ? selected.every((id) => layer.present.byId[id].transform.verticalFlip) : false;
    const canMask = canMaskSelection(layer.present);
    const canToggleUseAsMask = canToggleUseAsMaskSelection(layer.present);
    const useAsMaskEnabled = canToggleUseAsMask ? selected.every((id) => (layer.present.byId[id] as em.Shape).mask) : false;
    const ignoreUnderlyingMaskEnabled = selected.every((id) => layer.present.byId[id].ignoreUnderlyingMask);
    const canBoolean = canBooleanOperationSelection(layer.present);
    const canAlign = selected.length >= 2;
    const canDistribute = selected.length >= 3;
    const props: SelectionState = {
      canMoveBackward, canMoveForward, canGroup, canUngroup, canToggleStroke, canToggleShadow, canToggleFill, canToggleFlip,
      fillEnabled, strokeEnabled, shadowEnabled, horizontalFlipEnabled, verticalFlipEnabled, canMask, canBoolean, canResize,
      canAlign, canDistribute, canToggleUseAsMask, useAsMaskEnabled, ignoreUnderlyingMaskEnabled
    };
    const keysToUpdate = Object.keys(state.selection).reduce((result, current) => {
      if ((state.selection as any)[current] !== (props as any)[current]) {
        result = [...result, current];
      }
      return result;
    }, []);
    if (keysToUpdate.length > 0) {
      const payload = keysToUpdate.reduce((result, current) => {
        result = {
          ...result,
          [current]: (props as any)[current]
        }
        return result;
      }, {});
      dispatch(updateSelection(payload));
    }
    updateSelectionFrame(state);
  }
};