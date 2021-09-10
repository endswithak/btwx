import {
  SET_PATH_DATA,
  REMOVE_PATH_DATA,
  PathDataTypes,
} from '../actionTypes/pathData';

export interface PathDataState {
  byId: {
    [id: string]: {
      id: string;
      pathData: string;
      icon: string;
    }
  }
}

const initialState: PathDataState = {
  byId: {}
};

export default (state = initialState, action: PathDataTypes): PathDataState => {
  switch (action.type) {
    case SET_PATH_DATA: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...action.payload
          }
        }
      };
    }
    case REMOVE_PATH_DATA: {
      return {
        ...state,
        byId: Object.keys(state.byId).reduce((result, current) => {
          if (current !== action.payload.id) {
            result = {
              ...result,
              [current]: state.byId[current]
            }
          }
          return result;
        }, {})
      };
    }
    default:
      return state;
  }
}
