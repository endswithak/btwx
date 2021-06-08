import { FixedSizeTree } from '../../components/react-vtree';

import {
  SET_DRAGGING,
  SET_DRAG_OVER,
  SET_DROPZONE,
  SET_EDITING,
  SET_EDIT,
  SET_SEARCHING,
  SET_SEARCH,
  SET_REF,
  LeftSidebarTypes,
} from '../actionTypes/leftSidebar';

export interface LeftSidebarState {
  ref: FixedSizeTree;
  dragging: string;
  dragOver: string;
  dropzone: Btwx.Dropzone;
  editing: string;
  edit: string;
  searching: boolean;
  search: string;
}

const initialState: LeftSidebarState = {
  ref: null,
  dragging: null,
  dragOver: null,
  dropzone: null,
  editing: null,
  edit: '',
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
        editing: action.payload.editing,
        edit: action.payload.editing === null ? '' : Object.prototype.hasOwnProperty.call(action.payload, 'edit') ? action.payload.edit : state.edit
      };
    }
    case SET_EDIT: {
      return {
        ...state,
        edit: action.payload.edit
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
    case SET_REF: {
      return {
        ...state,
        ref: action.payload.ref
      };
    }
    default:
      return state;
  }
}
