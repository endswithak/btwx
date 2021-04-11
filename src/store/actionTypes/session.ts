export const SET_PLATFORM = 'SET_PLATFORM';

export interface SetPlatformPayload {
  platform: string;
}

export interface SetPlatform {
  type: typeof SET_PLATFORM;
  payload: SetPlatformPayload;
}

export type SessionTypes = SetPlatform;