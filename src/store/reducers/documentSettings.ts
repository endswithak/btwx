import { addItem, removeItem } from '../utils/general';
import { remote } from 'electron';
import {
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DEFAULT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_TWEEN_DRAWER_HEIGHT,
  DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH,
  DEFAULT_COLOR_FORMAT,
  DEFAULT_DEVICE_ORIENTATION
} from '../../constants';

import {
  SAVE_DOCUMENT_AS,
  ADD_DOCUMENT_IMAGE,
  SAVE_DOCUMENT,
  SET_CANVAS_MATRIX,
  SET_CANVAS_COLOR_FORMAT,
  ADD_ARTBOARD_PRESET,
  REMOVE_ARTBOARD_PRESET,
  UPDATE_ARTBOARD_PRESET,
  SET_LEFT_SIDEBAR_WIDTH,
  SET_RIGHT_SIDEBAR_WIDTH,
  SET_TWEEN_DRAWER_HEIGHT,
  SET_TWEEN_DRAWER_LAYERS_WIDTH,
  SET_ARTBOARD_PRESET_DEVICE_PLATFORM,
  SET_ARTBOARD_PRESET_DEVICE_ORIENTATION,
  OPEN_LEFT_SIDEBAR,
  CLOSE_LEFT_SIDEBAR,
  OPEN_RIGHT_SIDEBAR,
  CLOSE_RIGHT_SIDEBAR,
  OPEN_TWEEN_DRAWER,
  CLOSE_TWEEN_DRAWER,
  DocumentSettingsTypes,
} from '../actionTypes/documentSettings';

export interface DocumentSettingsState {
  id: string;
  name: string;
  path: string;
  matrix: number[];
  artboardPresets: {
    allIds: string[];
    byId: {
      [id: string]: em.ArtboardPreset;
    };
    orientation: em.DeviceOrientationType;
    platform: em.DevicePlatformType;
  };
  images: {
    allIds: string[];
    byId: {
      [id: string]: em.DocumentImage;
    };
  };
  view: {
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
  };
  colorFormat: em.ColorFormat;
  edit: string;
}

const initialState: DocumentSettingsState = {
  id: null,
  name: 'Untitled',
  path: null,
  matrix: [1, 0, 0, 1, 0, 0],
  artboardPresets: {
    allIds: [],
    byId: {},
    orientation: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('artboardPresetDeviceOrientation', 'string') : DEFAULT_DEVICE_ORIENTATION,
    platform: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('artboardPresetDevicePlatform', 'string') : 'Android'
  },
  images: {
    allIds: [],
    byId: {}
  },
  colorFormat: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('colorFormat', 'string') : DEFAULT_COLOR_FORMAT,
  view: {
    leftSidebar: {
      isOpen: true,
      width: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('leftSidebarWidth', 'integer') : DEFAULT_LEFT_SIDEBAR_WIDTH,
    },
    rightSidebar: {
      isOpen: true,
      width: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('rightSidebarWidth', 'integer') : DEFAULT_RIGHT_SIDEBAR_WIDTH,
    },
    tweenDrawer: {
      isOpen: true,
      height: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerHeight', 'integer') : DEFAULT_TWEEN_DRAWER_HEIGHT,
      layersWidth: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('tweenDrawerLayersWidth', 'integer') : DEFAULT_TWEEN_DRAWER_LAYERS_WIDTH,
    }
  },
  edit: null
};

export default (state = initialState, action: DocumentSettingsTypes): DocumentSettingsState => {
  switch (action.type) {
    case SAVE_DOCUMENT_AS: {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path,
        edit: action.payload.edit
      };
    }
    case SAVE_DOCUMENT: {
      return {
        ...state,
        edit: action.payload.edit
      };
    }
    case ADD_DOCUMENT_IMAGE: {
      return {
        ...state,
        images: {
          ...state.images,
          allIds: [...state.images.allIds, action.payload.id],
          byId: {
            ...state.images.byId,
            [action.payload.id]: action.payload
          }
        }
      };
    }
    case SET_CANVAS_MATRIX: {
      return {
        ...state,
        matrix: action.payload.matrix
      };
    }
    case SET_CANVAS_COLOR_FORMAT: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('colorFormat', 'string', action.payload.colorFormat);
      }
      return {
        ...state,
        colorFormat: action.payload.colorFormat
      };
    }
    case ADD_ARTBOARD_PRESET: {
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          allIds: addItem(state.artboardPresets.allIds, action.payload.id),
          byId: {
            ...state.artboardPresets.byId,
            [action.payload.id]: {
              ...action.payload,
              category: 'Custom'
            }
          }
        }
      };
    }
    case REMOVE_ARTBOARD_PRESET: {
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          allIds: removeItem(state.artboardPresets.allIds, action.payload.id),
          byId: Object.keys(state.artboardPresets.byId).reduce((result: { [id: string]: em.ArtboardPreset }, id) => {
            if (id !== action.payload.id) {
              result[id] = state.artboardPresets.byId[id];
            }
            return result;
          }, {})
        }
      };
    }
    case UPDATE_ARTBOARD_PRESET: {
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          byId: Object.keys(state.artboardPresets.byId).reduce((result: { [id: string]: em.ArtboardPreset }, id) => {
            if (id !== action.payload.id) {
              result[id] = state.artboardPresets.byId[id];
            } else {
              result[id] = {
                ...action.payload,
                category: 'Custom'
              };
            }
            return result;
          }, {})
        }
      };
    }
    case OPEN_LEFT_SIDEBAR: {
      return {
        ...state,
        view: {
          ...state.view,
          leftSidebar: {
            ...state.view.leftSidebar,
            isOpen: true
          }
        }
      };
    }
    case CLOSE_LEFT_SIDEBAR: {
      return {
        ...state,
        view: {
          ...state.view,
          leftSidebar: {
            ...state.view.leftSidebar,
            isOpen: false
          }
        }
      };
    }
    case SET_LEFT_SIDEBAR_WIDTH: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('leftSidebarWidth', 'integer', parseInt(action.payload.width as any) as any);
      }
      return {
        ...state,
        view: {
          ...state.view,
          leftSidebar: {
            ...state.view.leftSidebar,
            width: action.payload.width
          }
        }
      };
    }
    case OPEN_RIGHT_SIDEBAR: {
      return {
        ...state,
        view: {
          ...state.view,
          rightSidebar: {
            ...state.view.rightSidebar,
            isOpen: true
          }
        }
      };
    }
    case CLOSE_RIGHT_SIDEBAR: {
      return {
        ...state,
        view: {
          ...state.view,
          rightSidebar: {
            ...state.view.rightSidebar,
            isOpen: false
          }
        }
      };
    }
    case SET_RIGHT_SIDEBAR_WIDTH: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('rightSidebarWidth', 'integer', parseInt(action.payload.width as any) as any);
      }
      return {
        ...state,
        view: {
          ...state.view,
          rightSidebar: {
            ...state.view.rightSidebar,
            width: action.payload.width
          }
        }
      };
    }
    case OPEN_TWEEN_DRAWER: {
      return {
        ...state,
        view: {
          ...state.view,
          tweenDrawer: {
            ...state.view.tweenDrawer,
            isOpen: true
          }
        }
      };
    }
    case CLOSE_TWEEN_DRAWER: {
      return {
        ...state,
        view: {
          ...state.view,
          tweenDrawer: {
            ...state.view.tweenDrawer,
            isOpen: false
          }
        }
      };
    }
    case SET_TWEEN_DRAWER_HEIGHT: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('tweenDrawerHeight', 'integer', parseInt(action.payload.height as any) as any);
      }
      return {
        ...state,
        view: {
          ...state.view,
          tweenDrawer: {
            ...state.view.tweenDrawer,
            height: action.payload.height
          }
        }
      };
    }
    case SET_TWEEN_DRAWER_LAYERS_WIDTH: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('tweenDrawerLayersWidth', 'integer', parseInt(action.payload.width as any) as any);
      }
      return {
        ...state,
        view: {
          ...state.view,
          tweenDrawer: {
            ...state.view.tweenDrawer,
            layersWidth: action.payload.width
          }
        }
      };
    }
    case SET_ARTBOARD_PRESET_DEVICE_ORIENTATION: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('artboardPresetDeviceOrientation', 'string', action.payload.orientation);
      }
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          orientation: action.payload.orientation
        }
      };
    }
    case SET_ARTBOARD_PRESET_DEVICE_PLATFORM: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('artboardPresetDevicePlatform', 'string', action.payload.platform);
      }
      return {
        ...state,
        artboardPresets: {
          ...state.artboardPresets,
          platform: action.payload.platform
        }
      };
    }
    default:
      return state;
  }
}
