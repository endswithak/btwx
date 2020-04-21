import { combineReducers } from 'redux';
import layers from './layers';
import drawTool from './drawTool';
import selectionTool from './selectionTool';

const rootReducer = combineReducers({
  layers,
  drawTool,
  selectionTool
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;