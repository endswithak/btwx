import {
  SET_DRAGGING,
  SET_EDITING,
  SET_SEARCHING,
  SET_SEARCH,
  LeftSidebarTypes,
} from '../actionTypes/leftSidebar';

export interface LeftSidebarState {
  dragging: boolean;
  editing: string;
  searching: boolean;
  search: string;
}

const initialState: LeftSidebarState = {
  dragging: false,
  editing: null,
  searching: false,
  search: ''
};

export default (state = initialState, action: LeftSidebarTypes): LeftSidebarState => {
  switch (action.type) {
    case SET_DRAGGING: {
      return {
        ...state,
        dragging: action.payload.dragging
      };
    }
    case SET_EDITING: {
      return {
        ...state,
        editing: action.payload.editing
      };
    }
    case SET_SEARCHING: {
      return {
        ...state,
        searching: action.payload.searching
      };
    }
    case SET_SEARCH: {
      return {
        ...state,
        search: action.payload.search
      };
    }
    default:
      return state;
  }
}
