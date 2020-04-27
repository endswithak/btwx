import { combineReducers } from 'redux';
import layers from './layers';
import selection from './selection';
import drawTool from './drawTool';
import selectionTool from './selectionTool';

const rootReducer = combineReducers({
  layers,
  drawTool,
  selectionTool,
  selection
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;