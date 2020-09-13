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
  paperX: number;
  paperY: number;
  data: any;
}

const initialState: ContextMenuState = {
  type: null,
  id: null,
  isOpen: false,
  x: null,
  y: null,
  paperX: null,
  paperY: null,
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
        paperX: action.payload.paperX,
        paperY: action.payload.paperY,
        data: action.payload.data
      };
    }
    case CLOSE_CONTEXT_MENU: {
      return {
        type: null,
        id: null,
        isOpen: false,
        x: null,
        y: null,
        paperX: null,
        paperY: null,
        data: null
      };
    }
    default:
      return state;
  }
}
