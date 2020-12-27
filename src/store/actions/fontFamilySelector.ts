import {
  OPEN_FONT_FAMILY_SELECTOR,
  CLOSE_FONT_FAMILY_SELECTOR,
  OpenFontFamilySelectorPayload,
  FontFamilySelectorTypes
} from '../actionTypes/fontFamilySelector';

export const openFontFamilySelector = (payload: OpenFontFamilySelectorPayload): FontFamilySelectorTypes => ({
  type: OPEN_FONT_FAMILY_SELECTOR,
  payload
});

export const closeFontFamilySelector = (): FontFamilySelectorTypes => ({
  type: CLOSE_FONT_FAMILY_SELECTOR
});