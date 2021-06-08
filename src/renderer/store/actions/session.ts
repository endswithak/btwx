import {
  SET_PLATFORM,
  ADD_SESSION_IMAGE,
  ADD_SESSION_IMAGES,
  HYDRATE_SESSION_IMAGES,
  SetPlatformPayload,
  AddSessionImagePayload,
  AddSessionImagesPayload,
  HydrateSessionImagesPayload,
  SessionTypes
} from '../actionTypes/session';

export const setPlatform = (payload: SetPlatformPayload): SessionTypes => ({
  type: SET_PLATFORM,
  payload
});

export const addSessionImage = (payload: AddSessionImagePayload): SessionTypes => ({
  type: ADD_SESSION_IMAGE,
  payload
});

export const addSessionImages = (payload: AddSessionImagesPayload): SessionTypes => ({
  type: ADD_SESSION_IMAGES,
  payload
});

export const hydrateSessionImages = (payload: HydrateSessionImagesPayload): SessionTypes => ({
  type: HYDRATE_SESSION_IMAGES,
  payload
});