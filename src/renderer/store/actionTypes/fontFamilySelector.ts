export const OPEN_FONT_FAMILY_SELECTOR = 'OPEN_FONT_FAMILY_SELECTOR';
export const CLOSE_FONT_FAMILY_SELECTOR = 'CLOSE_FONT_FAMILY_SELECTOR';

export interface OpenFontFamilySelectorPayload {
  x: number;
  y: number;
}

export interface OpenFontFamilySelector {
  type: typeof OPEN_FONT_FAMILY_SELECTOR;
  payload: OpenFontFamilySelectorPayload;
}

export interface CloseFontFamilySelector {
  type: typeof CLOSE_FONT_FAMILY_SELECTOR;
}

export type FontFamilySelectorTypes = OpenFontFamilySelector | CloseFontFamilySelector;