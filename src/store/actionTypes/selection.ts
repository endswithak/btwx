export const ADD_TO_SELECTION = 'ADD_TO_SELECTION';
export const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
export const SET_GROUP_SCOPE = 'SET_GROUP_SCOPE';

export interface SelectionPayload {
  id: string;
}

interface AddToSelection {
  type: typeof ADD_TO_SELECTION;
  payload: SelectionPayload;
}

interface RemoveFromSelection {
  type: typeof REMOVE_FROM_SELECTION;
  payload: SelectionPayload;
}

interface SetGroupScope {
  type: typeof SET_GROUP_SCOPE;
  payload: SelectionPayload;
}

export type SelectionTypes = AddToSelection | RemoveFromSelection | SetGroupScope;