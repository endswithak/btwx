import {
  OPEN_CONTEXT_MENU,
  ContextMenuTypes,
} from '../actionTypes/contextMenu';

export interface ContextMenuState {
  menuId: string | null;
  type: Btwx.ContextMenuType | null;
  id: string | null;
}

const initialState: ContextMenuState = {
  menuId: null,
  type: null,
  id: null
};

export default (state = initialState, action: ContextMenuTypes): ContextMenuState => {
  switch (action.type) {
    case OPEN_CONTEXT_MENU: {
      return {
        ...state,
        menuId: action.payload.menuId as string,
        type: action.payload.type,
        id: action.payload.id
      };
    }
    default:
      return state;
  }
}
