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
  UPDATE_SELECTION_PROPS,
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
  UpdateSelectionPropsPayload,
  SelectionTypes
} from '../actionTypes/selection';

import { RootState } from '../reducers';
import { SelectionState } from '../reducers/selection';
// import { updateSelectionFrame } from '../actions/layer';

import { getLayerAndDescendants, getSelectionBounds, canGroupSelection, canUngroupSelection, canSendBackwardSelection, canBringForwardSelection, canToggleSelectionStroke, canToggleSelectionShadow, canToggleSelectionFill, canTransformFlipSelection, canMaskSelection, canResizeSelection, canBooleanOperationSelection, canPasteSVG } from '../selectors/layer';

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

export const updateSelectionProps = (payload: UpdateSelectionPropsPayload): SelectionTypes => ({
  type: UPDATE_SELECTION_PROPS,
  payload
});

export const updateSelectionPropsThunk = () => {
  return (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const { layer } = state;
    const selected = layer.present.selected;
    const selectionBounds = getSelectionBounds(state);
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
    const canBoolean = canBooleanOperationSelection(layer.present);
    const canAlign = selected.length >= 2;
    const canDistribute = selected.length >= 3;
    const props: SelectionState = {
      canMoveBackward, canMoveForward, canGroup, canUngroup, canToggleStroke, canToggleShadow, canToggleFill, canToggleFlip,
      fillEnabled, strokeEnabled, shadowEnabled, horizontalFlipEnabled, verticalFlipEnabled, canMask, canBoolean, canResize,
      bounds: selectionBounds ? { x: parseInt(selectionBounds.center.x.toFixed(2)), y: parseInt(selectionBounds.center.y.toFixed(2)), width: parseInt(selectionBounds.width.toFixed(2)), height: parseInt(selectionBounds.height.toFixed(2))} : null,
      canAlign, canDistribute
    };
    const keysToUpdate = Object.keys(state.selection).reduce((result, current) => {
      if (current === 'bounds') {
        if (props[current]) {
          const boundsMatch = state.selection.bounds && Object.keys(state.selection.bounds).every((key) => (state.selection.bounds as any)[key] === (props as any)[current][key]);
          if (!boundsMatch) {
            result = [...result, current];
          }
        } else {
          if (state.selection.bounds) {
            result = [...result, current];
          }
        }
      } else {
        if ((state.selection as any)[current] !== (props as any)[current]) {
          result = [...result, current];
        }
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
      dispatch(updateSelectionProps(payload));
    }
    // updateSelectionFrame(state);
  }
};