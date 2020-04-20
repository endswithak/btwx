import { combineReducers } from 'redux';
import layers from './layers';
import drawTool from './drawTool';

const rootReducer = combineReducers({ layers, drawTool });
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;