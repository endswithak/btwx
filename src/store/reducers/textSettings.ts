import {
  SET_TEXT_SETTINGS,
  SET_TEXT_SETTINGS_FILL_COLOR,
  SET_TEXT_SETTINGS_FONT_SIZE,
  SET_TEXT_SETTINGS_FONT_WEIGHT,
  SET_TEXT_SETTINGS_FONT_FAMILY,
  SET_TEXT_SETTINGS_LEADING,
  SET_TEXT_SETTINGS_JUSTIFICATION,
  SET_TEXT_SETTINGS_SYSTEM_FONTS,
  SET_TEXT_SETTINGS_READY,
  TextSettingsTypes,
} from '../actionTypes/textSettings';

import { DEFAULT_TEXT_STYLE, DEFAULT_TEXT_FILL_COLOR, WEB_SAFE_FONTS } from '../../constants';

export interface TextSettingsState extends Btwx.TextStyle {
  fillColor: Btwx.Color;
  systemFonts: string[];
  ready: boolean;
}

const initialState: TextSettingsState = {
  ...DEFAULT_TEXT_STYLE,
  fillColor: DEFAULT_TEXT_FILL_COLOR,
  systemFonts: WEB_SAFE_FONTS,
  ready: false
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
        fillColor: {
          ...state.fillColor,
          ...action.payload.fillColor
        }
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
    case SET_TEXT_SETTINGS_SYSTEM_FONTS: {
      return {
        ...state,
        systemFonts: action.payload.systemFonts
      };
    }
    case SET_TEXT_SETTINGS_READY: {
      return {
        ...state,
        ready: true
      };
    }
    default:
      return state;
  }
}
