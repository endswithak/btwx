export const ACTIVATE_INSERT_KNOB = 'ACTIVATE_INSERT_KNOB';
export const DEACTIVATE_INSERT_KNOB = 'DEACTIVATE_INSERT_KNOB';
export const SET_INSERT_KNOB_INDEX = 'SET_INSERT_KNOB_INDEX';

export interface ActivateInsertKnob {
  type: typeof ACTIVATE_INSERT_KNOB;
}

export interface DeactivateInsertKnob {
  type: typeof DEACTIVATE_INSERT_KNOB;
}

export interface SetInsertKnobIndexPayload {
  index: number;
}

export interface SetInsertKnobIndex {
  type: typeof SET_INSERT_KNOB_INDEX;
  payload: SetInsertKnobIndexPayload;
}

export type InsertKnobTypes = ActivateInsertKnob | DeactivateInsertKnob | SetInsertKnobIndex;