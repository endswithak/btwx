import {
  ACTIVATE_INSERT_KNOB,
  DEACTIVATE_INSERT_KNOB,
  SET_INSERT_KNOB_INDEX,
  SetInsertKnobIndexPayload,
  InsertKnobTypes
} from '../actionTypes/insertKnob';

export const activateInsertKnob = (): InsertKnobTypes => ({
  type: ACTIVATE_INSERT_KNOB
});

export const deactivateInsertKnob = (): InsertKnobTypes => ({
  type: DEACTIVATE_INSERT_KNOB
});

export const setInsertKnobIndex = (payload: SetInsertKnobIndexPayload): InsertKnobTypes => ({
  type: SET_INSERT_KNOB_INDEX,
  payload
});