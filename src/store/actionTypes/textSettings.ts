export const SET_TEXT_SETTINGS = 'SET_TEXT_SETTINGS';
export const SET_TEXT_SETTINGS_FILL_COLOR = 'SET_TEXT_SETTINGS_FILL_COLOR';
export const SET_TEXT_SETTINGS_FONT_SIZE = 'SET_TEXT_SETTINGS_FONT_SIZE';
export const SET_TEXT_SETTINGS_FONT_WEIGHT = 'SET_TEXT_SETTINGS_FONT_WEIGHT';
export const SET_TEXT_SETTINGS_FONT_FAMILY = 'SET_TEXT_SETTINGS_FONT_FAMILY';
export const SET_TEXT_SETTINGS_LEADING = 'SET_TEXT_SETTINGS_LEADING';
export const SET_TEXT_SETTINGS_JUSTIFICATION = 'SET_TEXT_SETTINGS_JUSTIFICATION';

export type SetTextSettingsPayload = {
  [P in keyof em.TextStyle]?: em.TextStyle[P];
} & { fillColor?: string }

export interface SetTextSettings {
  type: typeof SET_TEXT_SETTINGS;
  payload: SetTextSettingsPayload;
}

export interface SetTextSettingsFillColorPayload {
  fillColor: string;
}

export interface SetTextSettingsFillColor {
  type: typeof SET_TEXT_SETTINGS_FILL_COLOR;
  payload: SetTextSettingsFillColorPayload;
}

export interface SetTextSettingsFontSizePayload {
  fontSize: number;
}

export interface SetTextSettingsFontSize {
  type: typeof SET_TEXT_SETTINGS_FONT_SIZE;
  payload: SetTextSettingsFontSizePayload;
}

export interface SetTextSettingsFontWeightPayload {
  fontWeight: em.FontWeight;
}

export interface SetTextSettingsFontWeight {
  type: typeof SET_TEXT_SETTINGS_FONT_WEIGHT;
  payload: SetTextSettingsFontWeightPayload;
}

export interface SetTextSettingsFontFamilyPayload {
  fontFamily: string;
}

export interface SetTextSettingsFontFamily {
  type: typeof SET_TEXT_SETTINGS_FONT_FAMILY;
  payload: SetTextSettingsFontFamilyPayload;
}

export interface SetTextSettingsLeadingPayload {
  leading: number;
}

export interface SetTextSettingsLeading {
  type: typeof SET_TEXT_SETTINGS_LEADING;
  payload: SetTextSettingsLeadingPayload;
}

export interface SetTextSettingsJustificationPayload {
  justification: em.Jusftification;
}

export interface SetTextSettingsJustification {
  type: typeof SET_TEXT_SETTINGS_JUSTIFICATION;
  payload: SetTextSettingsJustificationPayload;
}

export type TextSettingsTypes = SetTextSettings | SetTextSettingsFillColor | SetTextSettingsFontSize | SetTextSettingsFontWeight | SetTextSettingsFontFamily | SetTextSettingsLeading | SetTextSettingsJustification;