import { remote } from 'electron';

import {
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  SET_CANVAS_THEME,
  ENABLE_AUTO_SAVE,
  DISABLE_AUTO_SAVE,
  PreferencesTypes,
} from '../actionTypes/preferences';

import {
  DEFAULT_THEME
} from '../../constants';

export interface PreferencesState {
  theme: Btwx.ThemeName;
  canvasTheme: Btwx.CanvasTheme;
  autoSave: boolean;
}

export const initialState: PreferencesState = {
  theme: DEFAULT_THEME,
  canvasTheme: 'btwx-default',
  autoSave: false
};

export default (state = initialState, action: PreferencesTypes): PreferencesState => {
  switch (action.type) {
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
    case SET_CANVAS_THEME: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('canvasTheme', 'string', action.payload.canvasTheme);
      }
      return {
        ...state,
        canvasTheme: action.payload.canvasTheme
      };
    }
    case ENABLE_AUTO_SAVE: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('autoSave', 'boolean', 'true');
      }
      return {
        ...state,
        autoSave: true
      };
    }
    case DISABLE_AUTO_SAVE: {
      if (remote.process.platform === 'darwin') {
        remote.systemPreferences.setUserDefault('autoSave', 'boolean', 'false');
      }
      return {
        ...state,
        autoSave: false
      };
    }
    default:
      return state;
  }
}
