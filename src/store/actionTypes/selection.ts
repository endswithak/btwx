import { SelectionState } from '../reducers/selection';

export const SET_SELECTION_BOUNDS = 'SET_SELECTION_BOUNDS';
export const SET_CAN_BOOLEAN = 'SET_CAN_BOOLEAN';
export const SET_CAN_MASK = 'SET_CAN_MASK';
export const SET_CAN_MOVE_BACKWARD = 'SET_CAN_MOVE_BACKWARD';
export const SET_CAN_MOVE_FORWARD = 'SET_CAN_MOVE_FORWARD';
export const SET_CAN_GROUP = 'SET_CAN_GROUP';
export const SET_CAN_UNGROUP = 'SET_CAN_UNGROUP';
export const SET_CAN_RESIZE = 'SET_CAN_RESIZE';
export const SET_CAN_TOGGLE_STROKE = 'SET_CAN_TOGGLE_STROKE';
export const SET_CAN_TOGGLE_FILL = 'SET_CAN_TOGGLE_FILL';
export const SET_CAN_TOGGLE_SHADOW = 'SET_CAN_TOGGLE_SHADOW';
export const SET_CAN_TOGGLE_FLIP = 'SET_CAN_TOGGLE_FLIP';
export const SET_FILL_ENABLED = 'SET_FILL_ENABLED';
export const SET_STROKE_ENABLED = 'SET_STROKE_ENABLED';
export const SET_SHADOW_ENABLED = 'SET_SHADOW_ENABLED';
export const SET_HORIZONTAL_FLIP_ENABLED = 'SET_HORIZONTAL_FLIP_ENABLED';
export const SET_VERTICAL_FLIP_ENABLED = 'SET_VERTICAL_FLIP_ENABLED';
export const UPDATE_SELECTION_PROPS = 'UPDATE_SELECTION_PROPS';
export const SET_CAN_ALIGN = 'SET_CAN_ALIGN';
export const SET_CAN_DISTRIBUTE = 'SET_CAN_DISTRIBUTE';

export interface SetSelectionBoundsPayload {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SetSelectionBounds {
  type: typeof SET_SELECTION_BOUNDS;
  payload: SetSelectionBoundsPayload;
}

export interface SetCanAlignPayload {
  canAlign: boolean;
}

export interface SetCanAlign {
  type: typeof SET_CAN_ALIGN;
  payload: SetCanAlignPayload;
}

export interface SetCanDistributePayload {
  canDistribute: boolean;
}

export interface SetCanDistribute {
  type: typeof SET_CAN_DISTRIBUTE;
  payload: SetCanDistributePayload;
}

export interface SetCanBooleanPayload {
  canBoolean: boolean;
}

export interface SetCanBoolean {
  type: typeof SET_CAN_BOOLEAN;
  payload: SetCanBooleanPayload;
}

export interface SetCanMaskPayload {
  canMask: boolean;
}

export interface SetCanMask {
  type: typeof SET_CAN_MASK;
  payload: SetCanMaskPayload;
}

export interface SetCanMoveBackwardPayload {
  canMoveBackward: boolean;
}

export interface SetCanMoveBackward {
  type: typeof SET_CAN_MOVE_BACKWARD;
  payload: SetCanMoveBackwardPayload;
}

export interface SetCanMoveForwardPayload {
  canMoveForward: boolean;
}

export interface SetCanMoveForward {
  type: typeof SET_CAN_MOVE_FORWARD;
  payload: SetCanMoveForwardPayload;
}

export interface SetCanGroupPayload {
  canGroup: boolean;
}

export interface SetCanGroup {
  type: typeof SET_CAN_GROUP;
  payload: SetCanGroupPayload;
}

export interface SetCanUngroupPayload {
  canUngroup: boolean;
}

export interface SetCanUngroup {
  type: typeof SET_CAN_UNGROUP;
  payload: SetCanUngroupPayload;
}

export interface SetCanResizePayload {
  canResize: boolean;
}

export interface SetCanResize {
  type: typeof SET_CAN_RESIZE;
  payload: SetCanResizePayload;
}

export interface SetCanToggleFillPayload {
  canToggleFill: boolean;
}

export interface SetCanToggleFill {
  type: typeof SET_CAN_TOGGLE_FILL;
  payload: SetCanToggleFillPayload;
}

export interface SetCanToggleStrokePayload {
  canToggleStroke: boolean;
}

export interface SetCanToggleStroke {
  type: typeof SET_CAN_TOGGLE_STROKE;
  payload: SetCanToggleStrokePayload;
}

export interface SetCanToggleShadowPayload {
  canToggleShadow: boolean;
}

export interface SetCanToggleShadow {
  type: typeof SET_CAN_TOGGLE_SHADOW;
  payload: SetCanToggleShadowPayload;
}

export interface SetCanToggleFlipPayload {
  canToggleFlip: boolean;
}

export interface SetCanToggleFlip {
  type: typeof SET_CAN_TOGGLE_FLIP;
  payload: SetCanToggleFlipPayload;
}

export interface SetFillEnabledPayload {
  fillEnabled: boolean;
}

export interface SetFillEnabled {
  type: typeof SET_FILL_ENABLED;
  payload: SetFillEnabledPayload;
}

export interface SetStrokeEnabledPayload {
  strokeEnabled: boolean;
}

export interface SetStrokeEnabled {
  type: typeof SET_STROKE_ENABLED;
  payload: SetStrokeEnabledPayload;
}

export interface SetShadowEnabledPayload {
  shadowEnabled: boolean;
}

export interface SetShadowEnabled {
  type: typeof SET_SHADOW_ENABLED;
  payload: SetShadowEnabledPayload;
}

export interface SetHorizontalFlipEnabledPayload {
  horizontalFlipEnabled: boolean;
}

export interface SetHorizontalFlipEnabled {
  type: typeof SET_HORIZONTAL_FLIP_ENABLED;
  payload: SetHorizontalFlipEnabledPayload;
}

export interface SetVerticalFlipEnabledPayload {
  verticalFlipEnabled: boolean;
}

export interface SetVerticalFlipEnabled {
  type: typeof SET_VERTICAL_FLIP_ENABLED;
  payload: SetVerticalFlipEnabledPayload;
}

export type UpdateSelectionPropsPayload  = {
  [P in keyof SelectionState]?: SelectionState[P];
}

export interface UpdateSelectionProps {
  type: typeof UPDATE_SELECTION_PROPS;
  payload: UpdateSelectionPropsPayload;
}

export type SelectionTypes = SetSelectionBounds |
                             SetCanBoolean |
                             SetCanAlign |
                             SetCanDistribute |
                             SetCanGroup |
                             SetCanMask |
                             SetCanUngroup |
                             SetCanMoveBackward |
                             SetCanMoveForward |
                             SetCanResize |
                             SetCanToggleFill |
                             SetCanToggleFlip |
                             SetCanToggleShadow |
                             SetCanToggleStroke |
                             SetFillEnabled |
                             SetStrokeEnabled |
                             SetShadowEnabled |
                             SetHorizontalFlipEnabled |
                             SetVerticalFlipEnabled |
                             UpdateSelectionProps;