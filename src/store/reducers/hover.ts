import {
  SET_HOVER,
  HoverTypes
} from '../actionTypes/hover';

export type HoverState = string;

const initialState: HoverState = null;

export default (state = initialState, action: HoverTypes): HoverState => {
  switch (action.type) {
    case SET_HOVER: {
      return action.payload.id;
    }
    default:
      return state;
  }
}
