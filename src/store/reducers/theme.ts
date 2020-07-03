import { remote } from 'electron';

import {
  ENABLE_DARK_THEME,
  ENABLE_LIGHT_THEME,
  ThemeTypes,
} from '../actionTypes/theme';

export interface ThemeState {
  theme: em.ThemeName;
}

const initialState: ThemeState = {
  theme: remote.systemPreferences.getUserDefault('theme', 'string')
};

export default (state = initialState, action: ThemeTypes): ThemeState => {
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
    default:
      return state;
  }
}
