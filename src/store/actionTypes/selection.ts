export const ADD_TO_SELECTION = 'ADD_TO_SELECTION';
export const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';

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

export type SelectionTypes = AddToSelection | RemoveFromSelection;