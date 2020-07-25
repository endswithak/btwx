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
  theme: remote.process.platform === 'darwin' ? remote.systemPreferences.getUserDefault('theme', 'string') : 'dark'
};

export default (state = initialState, action: ThemeTypes): ThemeState => {
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
    default:
      return state;
  }
}
