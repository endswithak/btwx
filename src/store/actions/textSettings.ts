import {
  SET_TEXT_SETTINGS,
  SET_TEXT_SETTINGS_FILL_COLOR,
  SET_TEXT_SETTINGS_FONT_SIZE,
  SET_TEXT_SETTINGS_FONT_WEIGHT,
  SET_TEXT_SETTINGS_FONT_FAMILY,
  SET_TEXT_SETTINGS_LEADING,
  SET_TEXT_SETTINGS_JUSTIFICATION,
  SET_TEXT_SETTINGS_SYSTEM_FONTS,
  SetTextSettingsPayload,
  SetTextSettingsFillColorPayload,
  SetTextSettingsFontSizePayload,
  SetTextSettingsFontWeightPayload,
  SetTextSettingsFontFamilyPayload,
  SetTextSettingsLeadingPayload,
  SetTextSettingsJustificationPayload,
  SetTextSettingsSystemFontsPayload,
  TextSettingsTypes
} from '../actionTypes/textSettings';

export const setTextSettings = (payload: SetTextSettingsPayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS,
  payload
});

export const setTextSettingsFillColor = (payload: SetTextSettingsFillColorPayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS_FILL_COLOR,
  payload
});

export const setTextSettingsFontSize = (payload: SetTextSettingsFontSizePayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS_FONT_SIZE,
  payload
});

export const setTextSettingsFontWeight = (payload: SetTextSettingsFontWeightPayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS_FONT_WEIGHT,
  payload
});

export const setTextSettingsFontFamily = (payload: SetTextSettingsFontFamilyPayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS_FONT_FAMILY,
  payload
});

export const setTextSettingsLeading = (payload: SetTextSettingsLeadingPayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS_LEADING,
  payload
});

export const setTextSettingsJustification = (payload: SetTextSettingsJustificationPayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS_JUSTIFICATION,
  payload
});

export const setTextSettingsSystemFonts = (payload: SetTextSettingsSystemFontsPayload): TextSettingsTypes => ({
  type: SET_TEXT_SETTINGS_SYSTEM_FONTS,
  payload
});