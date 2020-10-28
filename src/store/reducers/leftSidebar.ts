import {
  SET_DRAGGING,
  SET_DRAG_OVER,
  SET_DROPZONE,
  SET_EDITING,
  SET_SEARCHING,
  SET_SEARCH,
  LeftSidebarTypes,
} from '../actionTypes/leftSidebar';

export interface LeftSidebarState {
  dragging: string;
  dragOver: string;
  dropzone: Btwx.Dropzone;
  editing: string;
  searching: boolean;
  search: string;
}

const initialState: LeftSidebarState = {
  dragging: null,
  dragOver: null,
  dropzone: null,
  editing: null,
  searching: false,
  search: ''
};

export default (state = initialState, action: LeftSidebarTypes): LeftSidebarState => {
  switch (action.type) {
    case SET_DRAGGING: {
      return {
        ...state,
        dragging: action.payload.dragging,
        dragOver: action.payload.dragging ? state.dragOver : null,
        dropzone: action.payload.dragging ? state.dropzone : null
      };
    }
    case SET_DRAG_OVER: {
      return {
        ...state,
        dragOver: action.payload.dragOver
      };
    }
    case SET_DROPZONE: {
      return {
        ...state,
        dropzone: action.payload.dropzone
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
