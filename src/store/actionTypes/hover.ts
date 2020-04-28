export const SET_HOVER = 'SET_HOVER';

export interface HoverPayload {
  id: string;
}

interface SetHover {
  type: typeof SET_HOVER;
  payload: HoverPayload;
}

export type HoverTypes = SetHover;