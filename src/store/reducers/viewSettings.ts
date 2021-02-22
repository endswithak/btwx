import {
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DEFAULT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_TWEEN_DRAWER_HEIGHT,
  DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH,
  DEFAULT_THEME
} from '../../constants';

import {
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_EVENT_DRAWER_HEIGHT,
  SET_EVENT_DRAWER_LAYERS_WIDTH,
  OPEN_LEFT_SIDEBAR,
  CLOSE_LEFT_SIDEBAR,
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  OPEN_EVENT_DRAWER,
  CLOSE_EVENT_DRAWER,
  ViewSettingsTypes,
} from '../actionTypes/viewSettings';

export interface ViewSettingsState {
  leftSidebar: {
    isOpen: boolean;
    width: number;
  };
  rightSidebar: {
    isOpen: boolean;
    width: number;
  };
  eventDrawer: {
    isOpen: boolean;
    height: number;
    layersWidth: number;
  };
}

const initialState: ViewSettingsState = {
  leftSidebar: {
    isOpen: true,
    width: DEFAULT_LEFT_SIDEBAR_WIDTH // remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('leftSidebarWidth', 'integer') : DEFAULT_LEFT_SIDEBAR_WIDTH,
  },
  rightSidebar: {
    isOpen: true,
    width: DEFAULT_RIGHT_SIDEBAR_WIDTH // remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('rightSidebarWidth', 'integer') : DEFAULT_RIGHT_SIDEBAR_WIDTH,
  },
  eventDrawer: {
    isOpen: true,
    height: DEFAULT_TWEEN_DRAWER_HEIGHT, // remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('eventDrawerHeight', 'integer') : DEFAULT_TWEEN_DRAWER_HEIGHT,
    layersWidth: DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH // remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('eventDrawerEventLayersWidth', 'integer') : DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH,
  }
};

export default (state = initialState, action: ViewSettingsTypes): ViewSettingsState => {
  switch (action.type) {
    case OPEN_LEFT_SIDEBAR: {
      return {
        ...state,
        leftSidebar: {
          ...state.leftSidebar,
          isOpen: true
        }
      };
    }
    case CLOSE_LEFT_SIDEBAR: {
      return {
        ...state,
        leftSidebar: {
          ...state.leftSidebar,
          isOpen: false
        }
      };
    }
    case SET_LEFT_SIDEBAR_WIDTH: {
      // if (remote.process.platform === 'darwin') {
      //   remote.systemPreferences.setUserDefault('leftSidebarWidth', 'integer', parseInt(action.payload.width as any) as any);
      // }
      return {
        ...state,
        leftSidebar: {
          ...state.leftSidebar,
          width: action.payload.width
        }
      };
    }
    case OPEN_RIGHT_SIDEBAR: {
      return {
        ...state,
        rightSidebar: {
          ...state.rightSidebar,
          isOpen: true
        }
      };
    }
    case CLOSE_RIGHT_SIDEBAR: {
      return {
        ...state,
        rightSidebar: {
          ...state.rightSidebar,
          isOpen: false
        }
      };
    }
    case SET_RIGHT_SIDEBAR_WIDTH: {
      // if (remote.process.platform === 'darwin') {
      //   remote.systemPreferences.setUserDefault('rightSidebarWidth', 'integer', parseInt(action.payload.width as any) as any);
      // }
      return {
        ...state,
        rightSidebar: {
          ...state.rightSidebar,
          width: action.payload.width
        }
      };
    }
    case OPEN_EVENT_DRAWER: {
      return {
        ...state,
        eventDrawer: {
          ...state.eventDrawer,
          isOpen: true
        }
      };
    }
    case CLOSE_EVENT_DRAWER: {
      return {
        ...state,
        eventDrawer: {
          ...state.eventDrawer,
          isOpen: false
        }
      };
    }
    case SET_EVENT_DRAWER_HEIGHT: {
      // if (remote.process.platform === 'darwin') {
      //   remote.systemPreferences.setUserDefault('eventDrawerHeight', 'integer', parseInt(action.payload.height as any) as any);
      // }
      return {
        ...state,
        eventDrawer: {
          ...state.eventDrawer,
          height: action.payload.height
        }
      };
    }
    case SET_EVENT_DRAWER_LAYERS_WIDTH: {
      // if (remote.process.platform === 'darwin') {
      //   remote.systemPreferences.setUserDefault('eventDrawerEventLayersWidth', 'integer', parseInt(action.payload.width as any) as any);
      // }
      return {
        ...state,
        eventDrawer: {
          ...state.eventDrawer,
          layersWidth: action.payload.width
        }
      };
    }
    default:
      return state;
  }
}
