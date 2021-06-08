import { addItem, addItems } from '../utils/general';

import {
  SET_PLATFORM,
  ADD_SESSION_IMAGE,
  ADD_SESSION_IMAGES,
  HYDRATE_SESSION_IMAGES,
  SessionTypes,
} from '../actionTypes/session';

export interface SessionState {
  instance: number;
  windowType: Btwx.WindowType;
  platform: string;
  env: 'production' | 'development';
  images: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.DocumentImage;
    };
  };
}

export const initialState: SessionState = {
  instance: null,
  windowType: null,
  platform: null,
  env: 'production',
  images: {
    allIds: [],
    byId: {}
  }
};

export default (state = initialState, action: SessionTypes): SessionState => {
  switch (action.type) {
    case SET_PLATFORM: {
      return {
        ...state,
        platform: action.payload.platform
      }
    }
    case ADD_SESSION_IMAGE: {
      return {
        ...state,
        images: {
          allIds: addItem(state.images.allIds, action.payload.id),
          byId: {
            ...state.images.byId,
            [action.payload.id]: action.payload
          }
        }
      }
    }
    case ADD_SESSION_IMAGES: {
      return {
        ...state,
        images: {
          allIds: addItems(state.images.allIds, action.payload.images.allIds),
          byId: {
            ...state.images.byId,
            ...action.payload.images.byId
          }
        }
      }
    }
    case HYDRATE_SESSION_IMAGES: {
      return {
        ...state,
        images: action.payload.images
      };
    }
    default:
      return state;
  }
}
