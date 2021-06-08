export const SET_PLATFORM = 'SET_PLATFORM';

export const ADD_SESSION_IMAGE = 'ADD_SESSION_IMAGE';
export const ADD_SESSION_IMAGES = 'ADD_SESSION_IMAGES';
export const HYDRATE_SESSION_IMAGES = 'HYDRATE_SESSION_IMAGES';

export interface SetPlatformPayload {
  platform: string;
}

export interface SetPlatform {
  type: typeof SET_PLATFORM;
  payload: SetPlatformPayload;
}

export interface AddSessionImagePayload {
  id: string;
  buffer: Buffer;
  ext: string;
}

export interface AddSessionImage {
  type: typeof ADD_SESSION_IMAGE;
  payload: AddSessionImagePayload;
}

export interface AddSessionImagesPayload {
  images: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.DocumentImage;
    };
  };
}

export interface AddSessionImages {
  type: typeof ADD_SESSION_IMAGES;
  payload: AddSessionImagesPayload;
}

export interface HydrateSessionImagesPayload {
  images: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.DocumentImage;
    };
  };
}

export interface HydrateSessionImages {
  type: typeof HYDRATE_SESSION_IMAGES;
  payload: HydrateSessionImagesPayload;
}

export type SessionTypes = SetPlatform | AddSessionImage | AddSessionImages | HydrateSessionImages;