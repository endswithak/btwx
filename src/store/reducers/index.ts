import { combineReducers } from 'redux';
import layer from './layer';
import hover from './hover';
import drawTool from './drawTool';
import selectionTool from './selectionTool';

const rootReducer = combineReducers({
  layer,
  drawTool,
  selectionTool,
  hover
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;