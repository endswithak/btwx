import { combineReducers } from 'redux';
import layers from './layers';
import selection from './selection';
import hover from './hover';
import drawTool from './drawTool';
import selectionTool from './selectionTool';
import shape from './shape';
import page from './page';

const rootReducer = combineReducers({
  layers,
  drawTool,
  selectionTool,
  selection,
  hover,
  shape,
  page
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;