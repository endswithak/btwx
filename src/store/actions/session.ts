import {
  SET_PLATFORM,
  SetPlatformPayload,
  SessionTypes
} from '../actionTypes/session';

export const setPlatform = (payload: SetPlatformPayload): SessionTypes => ({
  type: SET_PLATFORM,
  payload
});