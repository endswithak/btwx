import {
  SET_TEXT_SETTINGS,
  SET_TEXT_SETTINGS_FILL_COLOR,
  SET_TEXT_SETTINGS_FONT_SIZE,
  SET_TEXT_SETTINGS_FONT_WEIGHT,
  SET_TEXT_SETTINGS_FONT_FAMILY,
  SET_TEXT_SETTINGS_LEADING,
  SET_TEXT_SETTINGS_JUSTIFICATION,
  TextSettingsTypes,
} from '../actionTypes/textSettings';

import { DEFAULT_TEXT_STYLE, DEFAULT_TEXT_FILL_COLOR } from '../../constants';

export interface TextSettingsState extends em.TextStyle {
  fillColor: em.Color;
}

const initialState: TextSettingsState = {
  ...DEFAULT_TEXT_STYLE,
  fillColor: DEFAULT_TEXT_FILL_COLOR
};

export default (state = initialState, action: TextSettingsTypes): TextSettingsState => {
  switch (action.type) {
    case SET_TEXT_SETTINGS: {
      return {
        ...state,
        ...action.payload
      };
    }
    case SET_TEXT_SETTINGS_FILL_COLOR: {
      return {
        ...state,
        fillColor: action.payload.fillColor
      };
    }
    case SET_TEXT_SETTINGS_FONT_SIZE: {
      return {
        ...state,
        fontSize: action.payload.fontSize
      };
    }
    case SET_TEXT_SETTINGS_FONT_WEIGHT: {
      return {
        ...state,
        fontWeight: action.payload.fontWeight
      };
    }
    case SET_TEXT_SETTINGS_FONT_FAMILY: {
      return {
        ...state,
        fontFamily: action.payload.fontFamily
      };
    }
    case SET_TEXT_SETTINGS_LEADING: {
      return {
        ...state,
        leading: action.payload.leading
      };
    }
    case SET_TEXT_SETTINGS_JUSTIFICATION: {
      return {
        ...state,
        justification: action.payload.justification
      };
    }
    default:
      return state;
  }
}
