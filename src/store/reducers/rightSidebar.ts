import {
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  RightSidebarTypes,
} from '../actionTypes/rightSidebar';

export interface RightSidebarState {
  isOpen: boolean;
}

const initialState: RightSidebarState = {
  isOpen: true
};

export default (state = initialState, action: RightSidebarTypes): RightSidebarState => {
  switch (action.type) {
    case OPEN_RIGHT_SIDEBAR: {
      return {
        ...state,
        isOpen: true
      };
    }
    case CLOSE_RIGHT_SIDEBAR: {
      return {
        ...state,
        isOpen: false
      };
    }
    default:
      return state;
  }
}
