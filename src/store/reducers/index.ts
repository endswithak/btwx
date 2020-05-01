import { combineReducers } from 'redux';
import layer from './layer';
import tool from './tool';

const rootReducer = combineReducers({
  layer,
  tool
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;