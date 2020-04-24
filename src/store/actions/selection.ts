import {
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  CLEAR_SELECTION,
  NEW_SELECTION,
  SelectionPayload,
  SelectionTypes
} from '../actionTypes/selection';

export const addToSelection = (selection: SelectionPayload): SelectionTypes => ({
  type: ADD_TO_SELECTION,
  payload: selection
});

export const removeFromSelection = (selection: SelectionPayload): SelectionTypes => ({
  type: REMOVE_FROM_SELECTION,
  payload: selection
});

export const clearSelection = (): SelectionTypes => ({
  type: CLEAR_SELECTION
});

export const newSelection = (selection: SelectionPayload): SelectionTypes => ({
  type: NEW_SELECTION,
  payload: selection
});