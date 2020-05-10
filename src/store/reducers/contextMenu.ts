import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  ContextMenuTypes,
} from '../actionTypes/contextMenu';

export interface ContextMenuState {
  type: em.ContextMenu;
  id: string;
  isOpen: boolean;
  x: number;
  y: number;
  data: any;
}

const initialState: ContextMenuState = {
  type: null,
  id: null,
  isOpen: false,
  x: null,
  y: null,
  data: null
};

export default (state = initialState, action: ContextMenuTypes): ContextMenuState => {
  switch (action.type) {
    case OPEN_CONTEXT_MENU: {
      return {
        ...state,
        type: action.payload.type,
        id: action.payload.id,
        isOpen: true,
        x: action.payload.x,
        y: action.payload.y,
        data: action.payload.data
      };
    }
    case CLOSE_CONTEXT_MENU: {
      return {
        ...state,
        ...initialState
      };
    }
    default:
      return state;
  }
}
