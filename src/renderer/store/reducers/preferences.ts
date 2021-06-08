import {
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  SET_CANVAS_THEME,
  ENABLE_AUTO_SAVE,
  DISABLE_AUTO_SAVE,
  HYDRATE_PREFERENCES,
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
      return {
        ...state,
        theme: 'dark'
      };
    }
    case ENABLE_LIGHT_THEME: {
      return {
        ...state,
        theme: 'light'
      };
    }
    case SET_CANVAS_THEME: {
      return {
        ...state,
        canvasTheme: action.payload.canvasTheme
      };
    }
    case ENABLE_AUTO_SAVE: {
      return {
        ...state,
        autoSave: true
      };
    }
    case DISABLE_AUTO_SAVE: {
      return {
        ...state,
        autoSave: false
      };
    }
    case HYDRATE_PREFERENCES: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}
