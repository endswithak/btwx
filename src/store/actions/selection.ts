import {
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  SET_GROUP_SCOPE,
  SelectionPayload,
  SelectionTypes
} from '../actionTypes/selection';

import {
  selectLayer,
  deselectLayer,
  addGroup,
  insertLayerAbove,
  addLayerChild,
  removeLayer,
} from '../actions/layer';

import { getLayerIndex, getTopParentGroup } from '../selectors/layer';

import { StoreGetState, StoreDispatch } from '../index';

export const addToSelection = (selection: SelectionPayload): SelectionTypes => ({
  type: ADD_TO_SELECTION,
  payload: selection
});

export const removeFromSelection = (selection: SelectionPayload): SelectionTypes => ({
  type: REMOVE_FROM_SELECTION,
  payload: selection
});

export const setGroupScope = (selection: SelectionPayload): SelectionTypes => ({
  type: SET_GROUP_SCOPE,
  payload: selection
});

export const addLayerToSelection = (id: string): any => {
  return (dispatch: StoreDispatch) => {
    dispatch(addToSelection({id}));
    dispatch(selectLayer({id}));
  }
}

export const removeLayerFromSelection = (id: string): any => {
  return (dispatch: StoreDispatch) => {
    dispatch(removeFromSelection({id}));
    dispatch(deselectLayer({id}));
  }
}

export const toggleLayerSelection = (id: string): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const selection = getState().selection;
    if (selection.allIds.includes(id)) {
      dispatch(removeLayerFromSelection(id));
    } else {
      dispatch(addLayerToSelection(id));
    }
  }
}

export const newSelection = (id: string): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    const currentSelection = state.selection;
    currentSelection.allIds.forEach((id) => {
      dispatch(removeFromSelection({id}));
      dispatch(deselectLayer({id}));
    });
    dispatch(addToSelection({id}));
    dispatch(selectLayer({id}));
  }
}

export const clearSelection = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    const currentSelection = state.selection;
    currentSelection.allIds.forEach((id) => {
      dispatch(removeFromSelection({id}));
      dispatch(deselectLayer({id}));
    });
  }
}

export const deleteSelection = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    const currentSelection = state.selection;
    currentSelection.allIds.forEach((id) => {
      dispatch(removeFromSelection({id}));
      dispatch(removeLayer({id}));
    });
  }
}

export const groupSelection = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    const topSelection = [...state.selection.allIds].reduce((total, current) => {
      const topGroup = getTopParentGroup(state.layer, current);
      return getLayerIndex(state.layer, topGroup.id) <= getLayerIndex(state.layer, total) ? current : total;
    }, state.selection.allIds[0]);
    dispatch(addGroup({}));
    const stateWithGroup = getState();
    const groupId = stateWithGroup.layer.allIds[stateWithGroup.layer.allIds.length - 1];
    dispatch(insertLayerAbove({
      id: groupId,
      above: topSelection
    }));
    state.selection.allIds.forEach((id) => {
      dispatch(addLayerChild({
        id: groupId,
        child: id
      }));
    });
    dispatch(newSelection(groupId));
  }
}

export const ungroupSelection = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    state.selection.allIds.forEach((id) => {
      if (state.layer.byId[id].type === 'Group') {
        dispatch(removeFromSelection({ id }));
        state.layer.byId[id].children.forEach((child) => {
          dispatch(insertLayerAbove({
            id: child,
            above: id
          }));
        });
        dispatch(removeLayer({ id }));
      } else {
        return;
      }
    });
  }
}