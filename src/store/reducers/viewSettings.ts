import { remote } from 'electron';

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
  SET_TWEEN_DRAWER_HEIGHT,
  SET_TWEEN_DRAWER_LAYERS_WIDTH,
  OPEN_LEFT_SIDEBAR,
  CLOSE_LEFT_SIDEBAR,
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
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
  tweenDrawer: {
    isOpen: boolean;
    height: number;
    layersWidth: number;
  };
  theme: Btwx.ThemeName;
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
  tweenDrawer: {
    isOpen: true,
    height: DEFAULT_TWEEN_DRAWER_HEIGHT, // remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerHeight', 'integer') : DEFAULT_TWEEN_DRAWER_HEIGHT,
    layersWidth: DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH // remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerLayersWidth', 'integer') : DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH,
  },
  theme: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('theme', 'string') : DEFAULT_THEME
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
    case OPEN_TWEEN_DRAWER: {
      return {
        ...state,
        tweenDrawer: {
          ...state.tweenDrawer,
          isOpen: true
        }
      };
    }
    case CLOSE_TWEEN_DRAWER: {
      return {
        ...state,
        tweenDrawer: {
          ...state.tweenDrawer,
          isOpen: false
        }
      };
    }
    case SET_TWEEN_DRAWER_HEIGHT: {
      // if (remote.process.platform === 'darwin') {
      //   remote.systemPreferences.setUserDefault('tweenDrawerHeight', 'integer', parseInt(action.payload.height as any) as any);
      // }
      return {
        ...state,
        tweenDrawer: {
          ...state.tweenDrawer,
          height: action.payload.height
        }
      };
    }
    case SET_TWEEN_DRAWER_LAYERS_WIDTH: {
      // if (remote.process.platform === 'darwin') {
      //   remote.systemPreferences.setUserDefault('tweenDrawerLayersWidth', 'integer', parseInt(action.payload.width as any) as any);
      // }
      return {
        ...state,
        tweenDrawer: {
          ...state.tweenDrawer,
          layersWidth: action.payload.width
        }
      };
    }
    case ENABLE_DARK_THEME: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('theme', 'string', 'dark');
      }
      return {
        ...state,
        theme: 'dark'
      };
    }
    case ENABLE_LIGHT_THEME: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('theme', 'string', 'light');
      }
      return {
        ...state,
        theme: 'light'
      };
    }
    default:
      return state;
  }
}
