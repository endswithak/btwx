import {
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  SelectionPayload,
  SelectionTypes
} from '../actionTypes/selection';

import {
  selectLayer,
  deselectLayer,
  addGroup,
  insertAbove,
  insertChild,
  removeLayer
} from '../actions/layers';

import { getLayerIndex, getTopParentGroup } from '../selectors/layers';

import { StoreGetState, StoreDispatch } from '../index';

export const addToSelection = (selection: SelectionPayload): SelectionTypes => ({
  type: ADD_TO_SELECTION,
  payload: selection
});

export const removeFromSelection = (selection: SelectionPayload): SelectionTypes => ({
  type: REMOVE_FROM_SELECTION,
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
    if (selection.includes(id)) {
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
    currentSelection.forEach((id) => {
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
    currentSelection.forEach((id) => {
      dispatch(removeFromSelection({id}));
      dispatch(deselectLayer({id}));
    });
  }
}

export const deleteSelection = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    const currentSelection = state.selection;
    currentSelection.forEach((id) => {
      dispatch(removeFromSelection({id}));
      dispatch(removeLayer({id}));
    });
  }
}

export const groupSelection = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    const topSelection = [...state.selection].reduce((total, current) => {
      const topGroup = getTopParentGroup(state.layers, current);
      return getLayerIndex(state.layers, topGroup.id) <= getLayerIndex(state.layers, total) ? current : total;
    }, state.selection[0]);
    dispatch(addGroup({}));
    const stateWithGroup = getState();
    const groupId = stateWithGroup.layers.allIds[stateWithGroup.layers.allIds.length - 1];
    dispatch(insertAbove({
      layer: groupId,
      above: topSelection
    }));
    state.selection.forEach((id) => {
      dispatch(insertChild({
        layer: id,
        parent: groupId
      }));
    });
    dispatch(newSelection(groupId));
  }
}

export const ungroupSelection = (): any => {
  return (dispatch: StoreDispatch, getState: StoreGetState) => {
    const state = getState();
    state.selection.forEach((id) => {
      if (state.layers.layerById[id].type === 'Group') {
        dispatch(removeFromSelection({ id }));
        state.layers.layerById[id].children.forEach((child) => {
          dispatch(insertAbove({
            layer: child,
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